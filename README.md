## 變更計畫

### 1. `vite.config.ts` — 掃描器升級
- 把 `rom.*` 規則改成：掃描每個遊戲資料夾，**找第一個 `.zip` 檔**當作 ROM（檔名任意，例如 `super-mario.zip`、`rom.zip` 都可）。
- 封面：找**第一個任何圖片副檔名**（png/jpg/jpeg/webp/gif/avif）即可，檔名任意。
- 大於 100MB 的 zip 一樣自動切換成 GitHub Raw URL（保留現有邏輯）。
- `romFile` 仍輸出原始檔名，給 `download` 屬性使用。

### 2. `src/routes/play.$platform.$slug.tsx` — 整頁就是遊戲
- 移除目前 React 元件外層（已經沒 SiteHeader，但 root layout 仍會包 `__root` shell）。改寫成：
  - 用 `Route` 的 `component` 直接 mount 一個 `useEffect`，把 `document.documentElement` / `body` 的 margin/padding 設 0、overflow hidden。
  - render 一個 `<div id="game" style="position:fixed;inset:0">`，外面包一層 `width:100%;height:100%;max-width:100%` 的 div，完全比照你貼的 HTML 結構。
- 確認 `__root.tsx` 對 `/play/*` 路由不要塞額外 chrome（檢查後若有則用條件 render 或 pathless layout 隔離）。

### 3. 速度優化（EmulatorJS 設定）
- 加 `EJS_threads = true`（多執行緒，需 COOP/COEP，下方第 4 點）。
- 加 `EJS_DEBUG_XX = false`、`EJS_startOnLoaded = true`（已有）。
- preload `loader.js`：在 route 的 `head()` 加 `<link rel="preload" as="script" href="https://cdn.emulatorjs.org/stable/data/loader.js">` 跟 `<link rel="preconnect" href="https://cdn.emulatorjs.org">`，盡早建立連線、提早抓 loader。
- ROM 若是 GitHub Raw URL，加 `<link rel="preconnect" href="https://raw.githubusercontent.com">`。

### 4. （可選）開啟 SharedArrayBuffer 讓模擬器多執行緒更快
- 在 `__root.tsx` 的 `head()` 或 server response 加 COOP/COEP headers。TanStack Start + Vercel 需要在 `vite.config.ts` 的 dev server 設 headers，prod 在 `vercel.json` 加 `headers` 區塊：
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`
- 注意：開了 COEP 後，所有跨來源資源（cdn.emulatorjs.org、raw.githubusercontent.com）必須回 `Cross-Origin-Resource-Policy: cross-origin` 或設 `crossorigin` 屬性，否則 ROM 圖片會壞。**這項預設先不開**，等你確認要不要冒這個風險。

### 5. 文件
- 更新 `public/games/README.txt`：「每個資料夾放一個 `.zip`（檔名隨意）和一張圖（檔名隨意）」。
- 更新 `src/config/labels.ts` 註解。

### 影響範圍
- 編輯：`vite.config.ts`、`src/routes/play.$platform.$slug.tsx`、`public/games/README.txt`
- 可能編輯：`src/routes/__root.tsx`（若 `/play/*` 需排除外框）

確認後我就動工。預設**不開** COOP/COEP（第 4 點），若你之後覺得不夠快再加。
