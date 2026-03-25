# 羽淵民泊Webサイト セットアップガイド

## 概要
羽淵民泊の高級民泊Webサイトが完成しました。CLAUDE.mdの共通ルールに準拠し、指定された技術スタックで構築されています。

## 完成した機能

### 🎯 適用テクニック
- ✅ **④ Sticky Scroll**: 客室紹介セクションで画像と詳細が連動
- ✅ **⑩ Parallax**: ヒーローセクションで没入感のある演出
- ✅ **⑫ Video Hero**: 高級感のある動画背景
- ✅ **⑨ Micro Animation**: 上品なホバーエフェクトとアニメーション

### 📱 レスポンシブ対応
- モバイルファースト設計（375px基準）
- タブレット対応（768px〜）
- デスクトップ対応（1280px〜）

### 🎨 デザイン特徴
- ダークベース（#1a1a1a）+ ゴールドアクセント（#d4af37）
- 高級感のあるフォントペアリング（Playfair Display + Inter）
- 12px以上の角丸、80px以上のセクション余白

## セットアップ手順

### 1. 画像の準備
`images/README.md`を参照して以下の画像を準備してください：

**必須画像**:
- `hero-video.mp4` (30-60秒のループ動画)
- `living-room.jpg` (リビングルーム)
- `bedroom.jpg` (ベッドルーム)
- `kitchen.jpg` (キッチン)
- `bathroom.jpg` (バスルーム)

### 2. Formspree設定
お問い合わせフォームを有効化するため：

1. [Formspree](https://formspree.io/)でアカウント作成
2. 新しいフォームを作成
3. フォームIDを取得
4. `js/contact.js`の12行目を更新：
```javascript
formspreeEndpoint: 'YOUR_FORM_ID', // ここに実際のフォームIDを入力
```

### 3. Google Fonts確認
HTMLで以下のフォントが読み込まれています：
- Playfair Display (見出し用)
- Inter (本文用)

### 4. 連絡先情報の更新
以下のファイルで連絡先を実際の情報に更新：

**HTML内の更新箇所**:
- 電話番号: `03-1234-5678` → 実際の番号
- WhatsApp: `+81312345678` → 実際の番号
- LINE ID: `@habuchi-minpaku` → 実際のLINE ID
- 住所: `静岡県熱海市羽淵1-2-3` → 実際の住所

### 5. Google Maps埋め込み
`index.html`の「Google Map」プレースホルダーを実際のマップに交換：

1. [Google Maps Embed API](https://developers.google.com/maps/documentation/embed)を設定
2. `.map-placeholder`を以下と交換：
```html
<iframe
    src="https://www.google.com/maps/embed?pb=実際の埋め込みコード"
    width="100%"
    height="400"
    style="border:0;"
    allowfullscreen=""
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade">
</iframe>
```

## 技術仕様

### フロントエンド
- **HTML**: セマンティックマークアップ
- **CSS**: カスタムCSS（フレームワーク不使用）
- **JavaScript**: バニラJS（jQuery不使用）
- **アニメーション**: Intersection Observer API

### デザインシステム
- **カラーパレット**: 60:30:10の法則
  - ベース（60%): #1a1a1a
  - メイン（30%): #d4af37
  - アクセント（10%): #f8f8f8
- **フォント**: Google Fonts
- **アイコン**: SVGインライン

### パフォーマンス最適化
- 画像レイジーローディング
- CSS/JSの最小化
- 重要リソースのプリロード
- レスポンシブ画像対応

## デプロイメント

### Cloudflare Pages（推奨）
1. GitHubリポジトリにコードをプッシュ
2. Cloudflare Pagesでリポジトリを連携
3. ビルド設定は不要（静的サイト）
4. 自動デプロイが開始されます

### その他のホスティング
- Netlify
- Vercel
- GitHub Pages
- 従来のWebホスティング

## SEO対策

### 既に実装済み
- `<title>`と`<meta description>`設定
- セマンティックHTML使用
- 画像alt属性設定
- レスポンシブ対応
- 高速読み込み最適化

### 追加推奨対策
- Google Analytics設置
- Google Search Console登録
- sitemap.xml作成
- robots.txt設置
- 構造化データ追加

## アクセシビリティ

### 実装済み機能
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 十分なカラーコントラスト
- `prefers-reduced-motion`対応
- フォーカス状態の視認性

## ブラウザサポート
- **現行ブラウザ**: Chrome, Firefox, Safari, Edge（最新版）
- **IE11**: 非サポート（モダンJavaScript使用のため）
- **モバイル**: iOS Safari, Chrome Mobile

## メンテナンス

### 定期的な更新
- 宿泊プラン料金の更新
- 客室写真の更新
- お客様レビューの追加
- 空室カレンダーの更新

### パフォーマンス監視
- Google PageSpeed Insights
- Lighthouse監査
- Core Web Vitals監視

## トラブルシューティング

### よくある問題
1. **動画が再生されない**: ファイルサイズを確認（20MB以下推奨）
2. **アニメーションが重い**: `prefers-reduced-motion`設定を確認
3. **フォームが送信されない**: Formspree設定を確認
4. **画像が表示されない**: ファイルパスと権限を確認

## サポート

追加のカスタマイズやトラブルシューティングが必要な場合は、開発チームにお問い合わせください。

---

**制作**: Claude Code
**準拠規格**: CLAUDE.md 共通ルール
**更新日**: 2026-03-25