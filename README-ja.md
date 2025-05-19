# ScholarDigest：学術論文の要約とZotero自動登録ツール

**ScholarDigest** は、Google Scholar（SerpAPI経由）を使って学術論文を検索し、OpenAIのGPTモデルで要約し、Zoteroに登録した上で、要約結果をメールで送信する Google Apps Script ツールです。

> ⚠️ このスクリプトは、以下のコミュニティサンプルをベースにカスタマイズされています：  
> [https://ict4d.jp/2024/09/25/ai-scholar/](https://ict4d.jp/2024/09/25/ai-scholar/)

---

## ✨ 特徴

- 🔍 任意のキーワードによる柔軟な論文検索（SerpAPI + Google Scholar）
- 🤖 GPT-3.5による自動要約（OpenAI API）
- 📬 メールでのレポート送信（タイトル・情報・リンク・要約）
- 📚 Zotero連携機能：
  - 特定のコレクションへ論文を追加
  - URLを比較して重複登録を防止
  - 要約をノートとしてZoteroアイテムに添付
- 🔁 時間ベースのトリガーで自動実行
- 📊 OpenAIトークン使用量のログ出力

---

## 🔧 セットアップ手順

### 1. スクリプトをコピー

Google Apps Script にコードを貼り付けて使用します。  
→ [https://script.google.com](https://script.google.com)

### 2. スクリプトプロパティを設定

`ファイル → プロジェクトのプロパティ → スクリプトのプロパティ` に以下を追加します：

| キー                    | 説明                                 |
|-------------------------|--------------------------------------|
| `SERP_API_KEY`           | SerpAPIのAPIキー                     |
| `OPENAI_API_KEY`         | OpenAIのAPIキー                      |
| `EMAIL_RECIPIENT`        | 要約を送るメールアドレス             |
| `ZOTERO_API_KEY`         | ZoteroのAPIキー                      |
| `ZOTERO_USER_ID`         | ZoteroのユーザーID（数値）           |
| `ZOTERO_COLLECTION_KEY`  | 保存対象のZoteroコレクションキー     |

### 3. キーワードをカスタマイズ

スクリプト内の `runScholarDigest()` 関数内で以下のように設定します：

```javascript
const keywords = ["機械学習", "バイオインフォマティクス"];
```
この配列は "機械学習 OR バイオインフォマティクス" のように自動的に組み合わされます。

## 🕒 自動実行の設定例
トリガー → トリガーを追加 から以下を設定：

関数: runScholarDigest

実行イベント: 時間主導型

時間: 例）毎日20:00（JST）

## 📧 メール出力の例
```
タイトル: バイオインフォマティクスの進展  
著者・雑誌: 田中ら, Nature (2023)  
リンク: https://example.com/bioinfo123  

要約:
- 新しい深層学習モデルを用いた遺伝子配列のアラインメント。
- 従来手法よりも高精度・高速。
- 臨床応用への可能性。
```

## 🧠 補足
キーワードは自由に変更可能で、任意の研究領域に対応します。

Zoteroの重複チェックはURLを用いて行われます。

今後の拡張として、DOI取得やPDF添付機能の追加も可能です。

