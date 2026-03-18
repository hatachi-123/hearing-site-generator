# Webデザイン技法リファレンス — Claude Code 用インストラクション
# 2025–2026年版

このファイルはサイト生成時にClaude Codeが自動参照する技法リファレンスです。
プロンプトに含まれる `TECH:①③⑤` のようなIDに従って、該当する技法を実装してください。

---

## RULE: 基本方針

- 外部ライブラリは **CDN経由のみ** 許可（GSAP / AOS / Three.js / Lottie）
- Google Fontsは使用可
- **prefers-reduced-motion** メディアクエリ対応必須
- アニメーションは「意図のあるもの」のみ。装飾目的の乱用禁止

---

## SECTION 1: 技法カタログ

### ① Scroll-triggered Animation
- **概要**: スクロール位置でフェードイン・スライド・ズーム発火
- **実装**: Intersection Observer API + CSSクラス付与、またはAOS / GSAP ScrollTrigger
- **実装ポイント**:
  - `threshold: 0.15〜0.2` が自然な発火タイミング
  - `once: true` で一度だけ発火（戻り再発火は疲れる）
  - `transition-delay` でstagger（順番に出現）演出
  - `transform: translateY(40px)→0` が最も自然な動き

### ② Scrollytelling
- **概要**: スクロールでストーリーが進む構成。Appleの製品ページが典型
- **実装**: GSAP ScrollTrigger / Framer Motion
- **実装ポイント**:
  - ページを「物語のシーン」として設計する
  - テキスト・画像・背景が連携してナラティブを展開

### ③ Scroll Snap
- **概要**: 1スクロールで次セクションにスナップ移動。CSSのみで実装可能
- **実装ポイント**:
  ```css
  .container { scroll-snap-type: y mandatory; overflow-y: scroll; height: 100vh; }
  .section   { scroll-snap-align: start; height: 100vh; }
  ```

### ④ Sticky Scroll（固定背景スクロール）
- **概要**: 背景固定のままコンテンツだけスクロール
- **実装ポイント**:
  - iOSでは `background-attachment: fixed` が非対応。JS + transform で代替
  - 高品質な背景写真との組み合わせが前提

### ⑤ Glassmorphism（グラスモーフィズム）
- **概要**: 半透明 + backdrop-filter:blur でガラス質感を表現
- **実装ポイント**:
  ```css
  .glass {
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
  }
  ```
  - ガラス要素は最大2〜3層まで
  - テキスト可読性確保: rgba overlayを必ず追加
  - 古い端末向けフォールバック: `rgba(255,255,255,0.2)` のみの半透明

### ⑥ 3D / WebGL
- **概要**: Three.jsでブラウザ内3D空間を構築
- **実装ポイント**:
  - 必ずローディング画面とフォールバックを用意
  - モバイルでは簡易版 or 静止画に切り替え

### ⑦ Kinetic Typography（キネティックタイポグラフィ）
- **概要**: 文字が動く・変形する・スクロールに反応する
- **実装ポイント**:
  - フォントサイズは `clamp(3rem, 8vw, 8rem)` など大胆に
  - 文字をspan単位で分割してstagger animationをかける

### ⑧ Claymorphism（クレイモーフィズム）
- **概要**: クレイアニメ風の柔らかい質感。大きな角丸＋パステル＋影
- **実装ポイント**:
  ```css
  .clay {
    border-radius: 30px;
    box-shadow: 8px 8px 0px rgba(0,0,0,0.15), inset 0 -4px 0 rgba(0,0,0,0.1);
  }
  ```

### ⑨ Micro Animation（マイクロアニメーション）
- **概要**: ホバー・クリック・フォーカスに反応する細かいアニメーション
- **実装ポイント**:
  - ボタンホバー: 色が下からスライドで変わる（`::before` + transform）
  - リンク下線: `transform: scaleX(0→1)` でスライドイン
  - カードホバー: `translateY(-6px)` + shadow変化
  ```css
  .btn { position: relative; overflow: hidden; }
  .btn::before {
    content: ''; position: absolute; inset: 0;
    background: var(--accent);
    transform: translateY(100%);
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  .btn:hover::before { transform: translateY(0); }
  .btn span { position: relative; z-index: 1; }
  ```

### ⑩ Parallax Scrolling（パララックス）
- **概要**: 背景と前景の移動速度を変えて奥行きを表現
- **実装ポイント**:
  - iOSでのパフォーマンスに注意（`transform` ベースで実装）

### ⑪ Bento Grid（ベントーグリッド）
- **概要**: お弁当箱風モジュラーカードレイアウト。不均等サイズでメリハリ
- **実装ポイント**:
  ```css
  .bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .card-wide  { grid-column: span 2; }
  .card-tall  { grid-row: span 2; }
  .card-large { grid-column: span 2; grid-row: span 2; }
  ```

### ⑫ Video Hero（動画ヒーロー）
- **概要**: ファーストビューに全画面ループ動画を配置
- **実装ポイント**:
  ```html
  <video autoplay muted loop playsinline poster="thumb.jpg">
    <source src="hero.mp4" type="video/mp4">
  </video>
  ```
  - `muted` は必須（ブラウザの自動再生制限のため）
  - `poster` にサムネ画像を必ず設定
  - mp4は5MB以下を目標に圧縮

### ⑬ 水平スクロール（Horizontal Scroll）
- **概要**: 縦スクロールの中に横スクロールセクションを組み込む
- **実装**: GSAP horizontal / CSS overflow-x

### ⑭ Brutalism（ブルータリズム）
- **概要**: 型破りレイアウト・生々しい素材・意図的な「崩し」が特徴
- **注意**: 医療・法律・一般企業には完全に不向き

### ⑮ Dopamine Colors（ドーパミンカラー）
- **概要**: 高彩度・ネオン系カラーで心理的高揚感を演出
- **実装ポイント**: 技法単体でなく他技法のカラー戦略として組み合わせる

---

## SECTION 2: パフォーマンス・アクセシビリティ必須ルール

### パフォーマンス
```css
/* prefers-reduced-motion 対応 — 必ず記述 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
- `will-change: transform` は必要な要素のみ
- Glassmorphismのblur値はモバイルで半分以下に
- Video Heroはmp4軽量版 + WebPポスター画像を用意
- Three.js / WebGL系は必ずローディング画面とフォールバックを用意

### アクセシビリティ
- WCAG 2.2 コントラスト比 4.5:1 以上（Glassmorphism系は特に注意）
- フォーカスアウトラインを `outline: none` で消さない
- アニメーションに頼らず構造で情報を伝える

---

## SECTION 3: ライブラリCDN

| 用途 | ライブラリ | CDN URL |
|------|-----------|---------|
| スクロールアニメ（簡易） | AOS | `https://unpkg.com/aos@2.3.1/dist/aos.js` |
| スクロールアニメ（高度） | GSAP + ScrollTrigger | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js` |
| 3D表現 | Three.js | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` |
| アイコンアニメ | Lottie | `https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js` |

---

## SECTION 4: よくある禁止パターン

```
❌ 医療・法律サイトに派手なアニメーション
❌ Glassmorphismでテキストコントラスト比を4.5:1未満にする
❌ backdrop-filterのフォールバック未設定
❌ will-change: transform を全要素に付与
❌ Video Heroのmuted属性省略
❌ prefers-reduced-motion の未対応
❌ アニメーション目的で@keyframesを20個以上定義
❌ 一般企業コーポレートサイトにBrutalism
❌ モバイルで backdrop-filter: blur(80px) 以上
```
