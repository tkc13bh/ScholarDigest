# ScholarDigest: Automated Literature Summarizer for Retinal and Skin Blood Flow Research

This Google Apps Script automatically fetches scholarly articles related to retinal and skin blood flow from Google Scholar via SerpAPI, summarizes them using OpenAI's GPT model, and sends the results via email.

> ⚠️ This script is a slightly customized version based on the original example at:
> [https://platform.openai.com/docs/guides/community/openai-and-google-apps-script](https://ict4d.jp/2024/09/25/ai-scholar/)


## ✨ Features

- Keyword-based search using SerpAPI (Google Scholar engine)
- Article summarization using `gpt-3.5-turbo`
- Clean output: title, author/journal, link, and bullet-point summary
- Daily scheduled execution (e.g., every day at 8 PM)
- Token usage logging per API call

## 🔧 Setup

1. **Clone or paste the script into Google Apps Script.**
2. **Set script properties** (`File → Project Properties → Script Properties`):

| Key               | Description                        |
|------------------|------------------------------------|
| `SERP_API_KEY`    | Your SerpAPI key                   |
| `OPENAI_API_KEY`  | Your OpenAI API key                |
| `EMAIL_RECIPIENT` | Email address to send results to   |

3. **(Optional) Set a time-driven trigger:**
   - Run `main()` once a day (e.g., 20:00 JST)

## 📦 Example Output (Email)

Title: Retinal blood flow in patients with type 2 diabetes
Authors/Journal: Smith et al., Diabetologia (2021)
Link: https://example.com/article1
Summary:

Retinal blood flow is reduced in type 2 diabetes.

Correlates with disease duration and HbA1c.

Non-invasive measurement may help monitor progression.

