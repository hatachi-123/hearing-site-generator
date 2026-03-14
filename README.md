# Hearing Site Generator

ヒアリングシステムで生成されたプロンプトから、Webサイトを自動生成・デプロイするリポジトリ。

## 仕組み
1. `prompts/` にプロンプトファイルがpushされる
2. GitHub Actionsが起動
3. Claude APIでサイトを生成
4. Cloudflare Pagesにデプロイ
