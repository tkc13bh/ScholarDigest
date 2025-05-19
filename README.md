[日本語版Readmeはこちら](https://github.com/tkc13bh/ScholarDigest/blob/main/README-ja.md)

# ScholarDigest: Automated Literature Summarizer and Zotero Archiver

ScholarDigest is a Google Apps Script tool that automates the process of searching academic papers using Google Scholar (via SerpAPI), summarizing them with OpenAI's GPT model, storing them in Zotero, and delivering the summaries via email.

> ⚠️ This script is a customized version based on the community example at:  
> [https://ict4d.jp/2024/09/25/ai-scholar/](https://ict4d.jp/2024/09/25/ai-scholar/)

---

## ✨ Features

- 🔍 **Flexible keyword-based academic search** using [SerpAPI](https://serpapi.com/)
- 🤖 **Automated summarization** using `gpt-3.5-turbo` (OpenAI)
- 📨 **Email report** including title, authors/journal, link, and bullet-point summary
- 📚 **Zotero integration**:
  - Adds new articles to a specific collection
  - Skips duplicates by checking existing item URLs
  - Attaches summary as a note to the Zotero item
- 🔁 **Scheduled execution** via time-based triggers
- 📊 **Logs token usage** for monitoring OpenAI API consumption

---

## 🔧 Setup

### 1. Clone the Script

Paste the code into [Google Apps Script](https://script.google.com).

### 2. Configure Script Properties

Go to `File → Project Properties → Script Properties`, and add the following keys:

| Key                   | Description                            |
|----------------------|----------------------------------------|
| `SERP_API_KEY`        | Your [SerpAPI](https://serpapi.com/) key |
| `OPENAI_API_KEY`      | Your [OpenAI](https://platform.openai.com/) API key |
| `EMAIL_RECIPIENT`     | Email address to send the digest       |
| `ZOTERO_API_KEY`      | Your [Zotero](https://www.zotero.org/settings/keys) API key |
| `ZOTERO_USER_ID`      | Your Zotero user ID (numeric)          |
| `ZOTERO_COLLECTION_KEY` | Zotero collection key to store articles |

### 3. Customize Your Keywords

In the `runScholarDigest()` function, modify the following line:

```javascript
const keywords = ["your", "search", "keywords"];
```
You can write queries like:

```
["machine learning", "bioinformatics"]
// becomes: "machine learning OR bioinformatics"
```

## 🕒 Example: Set Up Daily Automation
Go to Triggers → Add Trigger, and configure:

Function: runScholarDigest

Event Type: Time-driven

e.g., Run once a day at 20:00 JST

## 📧 Example Email Output
```
タイトル: Advances in Bioinformatics
著者・雑誌: Tanaka et al., Nature (2023)
リンク: https://example.com/bioinfo123

要約:
- Describes a new deep learning model for gene sequence alignment.
- Outperforms traditional methods in accuracy and speed.
- Potential for clinical application in genome diagnostics.
```

## 🧠 Tips
No hardcoded keywords – just update the keywords array to target any research domain.

Zotero duplicates are detected via article URL comparison.

You can enhance it to extract DOIs or add PDF download integration.
