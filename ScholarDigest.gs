function runScholarDigest() {
  const config = getConfig();
  const query = ["retinal blood flow", "skin blood flow"].join(" OR ");

  const papers = searchScholar(query, config.SERP_API_KEY);
  if (papers.length === 0) {
    Logger.log("⚠️ 論文が見つかりませんでした。");
    return;
  }

  let digest = "";

  for (const paper of papers) {
    const { title, link, info } = paper;
    const summary = generateSummary(title, link, info, config.OPENAI_API_KEY);

    digest += formatDigestEntry(title, info, link, summary);

    if (!checkZoteroDuplicate(link, config)) {
      registerToZotero(title, link, summary, config);
    } else {
      Logger.log(`⏭ 登録済み: ${title}`);
    }
  }

  sendDigestEmail("ScholarDigest：要約とZotero登録完了", digest, config.EMAIL_RECIPIENT);
}

function getConfig() {
  const prop = PropertiesService.getScriptProperties();
  return {
    SERP_API_KEY: prop.getProperty('SERP_API_KEY'),
    OPENAI_API_KEY: prop.getProperty('OPENAI_API_KEY'),
    EMAIL_RECIPIENT: prop.getProperty('EMAIL_RECIPIENT'),
    ZOTERO_API_KEY: prop.getProperty('ZOTERO_API_KEY'),
    ZOTERO_USER_ID: prop.getProperty('ZOTERO_USER_ID'),
    ZOTERO_COLLECTION_KEY: prop.getProperty('ZOTERO_COLLECTION_KEY'),
  };
}

function searchScholar(query, apiKey) {
  const endpoint = `https://serpapi.com/search?engine=google_scholar&q=${encodeURIComponent(query)}&api_key=${apiKey}&num=3&scisbd=1`;

  try {
    const res = UrlFetchApp.fetch(endpoint);
    const data = JSON.parse(res.getContentText());
    return (data.organic_results || []).map(item => ({
      title: item.title || "タイトル不明",
      link: item.link || "リンク不明",
      info: item.publication_info?.summary || "情報不明"
    }));
  } catch (err) {
    Logger.log("検索エラー: " + err);
    return [];
  }
}

function generateSummary(title, link, info, apiKey) {
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "あなたは生理学・医学論文の専門的な要約者です。研究の目的、方法、結果、意義を日本語で箇条書きにしてください。"
      },
      {
        role: "user",
        content: `タイトル: ${title}\nリンク: ${link}\n著者・雑誌: ${info}`
      }
    ],
    max_tokens: 700
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const res = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", options);
    const data = JSON.parse(res.getContentText());

    if (data.choices?.[0]?.message?.content) {
      Logger.log(`🔢 Token usage - Prompt: ${data.usage?.prompt_tokens}, Completion: ${data.usage?.completion_tokens}`);
      return data.choices[0].message.content.trim();
    }

    Logger.log("OpenAI応答エラー: " + JSON.stringify(data));
    return "要約に失敗しました（API応答エラー）";
  } catch (err) {
    Logger.log("要約エラー: " + err);
    return "要約に失敗しました（例外）";
  }
}

function formatDigestEntry(title, info, link, summary) {
  return `タイトル: ${title}\n著者・雑誌: ${info}\nリンク: ${link}\n要約:\n${summary}\n\n`;
}

function sendDigestEmail(subject, content, to) {
  try {
    MailApp.sendEmail({ to, subject, body: content });
  } catch (err) {
    Logger.log("メール送信エラー: " + err);
  }
}

function registerToZotero(title, link, summary, config) {
  const createUrl = `https://api.zotero.org/users/${config.ZOTERO_USER_ID}/items`;
  const itemPayload = [{
    itemType: "journalArticle",
    title,
    url: link,
    abstractNote: "",
    tags: [{ tag: "AI要約済み" }],
    collections: [config.ZOTERO_COLLECTION_KEY]
  }];

  const headers = { 'Zotero-API-Key': config.ZOTERO_API_KEY };
  const itemOptions = {
    method: "POST",
    contentType: "application/json",
    headers,
    payload: JSON.stringify(itemPayload),
    muteHttpExceptions: true
  };

  try {
    const res = UrlFetchApp.fetch(createUrl, itemOptions);
    const result = JSON.parse(res.getContentText());

    const itemKey = result.successful?.["0"]?.key || result?.[0]?.key;
    if (!itemKey) throw new Error("itemKeyの取得に失敗");

    const noteUrl = `https://api.zotero.org/users/${config.ZOTERO_USER_ID}/items/${itemKey}/notes`;
    const notePayload = [{
      itemType: "note",
      parentItem: itemKey,
      note: summary.replace(/\n/g, "<br>")
    }];

    const noteOptions = {
      method: "POST",
      contentType: "application/json",
      headers,
      payload: JSON.stringify(notePayload),
      muteHttpExceptions: true
    };

    const noteRes = UrlFetchApp.fetch(noteUrl, noteOptions);
    if (noteRes.getResponseCode() < 300) {
      Logger.log(`📝 ノート登録成功: ${itemKey}`);
    } else {
      Logger.log(`⚠️ ノート登録失敗: ${noteRes.getContentText()}`);
    }

  } catch (err) {
    Logger.log("Zotero登録エラー: " + err);
  }
}

function checkZoteroDuplicate(url, config) {
  const queryUrl = `https://api.zotero.org/users/${config.ZOTERO_USER_ID}/items?limit=100&format=json`;

  try {
    const res = UrlFetchApp.fetch(queryUrl, {
      method: "GET",
      headers: { 'Zotero-API-Key': config.ZOTERO_API_KEY },
      muteHttpExceptions: true
    });

    const items = JSON.parse(res.getContentText());
    return items.some(item => item.data?.url?.trim() === url.trim());
  } catch (err) {
    Logger.log("重複確認エラー: " + err);
    return false;
  }
}
