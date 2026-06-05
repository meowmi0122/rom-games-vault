## 你回報的問題

1. **平台頁排序**：目前是檔案系統預設順序，你要「舊→新」。
2. **控制台一堆 404 / 「Error for site owner」**：模擬器跑不起來。
3. `**Missing language zh-TW**`：EmulatorJS CDN 沒有 zh-TW 語言檔。

> 註：`Could not establish connection. Receiving end does not exist.`、`whatsapp-express-fte.js`、`chatgpt-express-fte.js`、`handoff.user.js`、`tag.js`、`injectAIMarker.js`、`ch-content-script-dend.js` 這些**全部來自你瀏覽器裝的擴充功能**（WhatsApp/ChatGPT/AI 相關 extension），跟網站無關，無法也不需要修。

## 真正要修的

### 1. 排序：舊→新

- 在 `vite.config.ts` 的掃描器 `scan()` 裡，讀 ROM 檔的 `fs.statSync().mtimeMs` 一起寫進 manifest（新增 `mtime` 欄位）。
- 在 `src/lib/games.ts` 的 `gamesByPlatform()` 加 `sort((a,b)=>a.mtime-b.mtime)`（舊在前）。

### 2. `Pokemon: Platinum Version` 資料夾名有冒號+空格 → 真實 404 來源

- 冒號 `:` 在 URL / 檔案系統上會壞掉（Windows 根本存不了，Vercel 路徑也有風險）。
- 修法：掃描器在產出 `slug` 跟 URL 時把資料夾名做 **slugify**（小寫、空白與非法字元換 `-`）；`name` 仍用原始資料夾名（去掉副檔名）顯示。
- 你以後資料夾命名建議只用英數和 `-`，但程式會自動處理。

### 3. GBA 兩個 rom.gba 是 0 bytes

- `public/games/gba/metroid-fusion/rom.gba`、`pokemon-fire-red/rom.gba` 都是空檔，模擬器當然炸。
- 我不會幫你下載 ROM（版權問題）。你要自己放真正的檔進去。**我只在這個 plan 裡標出來，不動。**

### 4. zh-TW 語言錯誤

- `src/routes/play.$platform.$slug.tsx` 設 `EJS_language`：根據目前 i18n 是 `zh` → 用 `"zh-CN"`（CDN 有），其餘 → 不設（預設 en-US）。
- 這個只是 warning，不是模擬器跑不起來的主因，但順手修掉。

### 5.（可選）「Error for site owner Check console」

- 通常是 ROM URL 404 或 core 載不到。修完上面 2、3、4 後，剩下若還有，再回報實際看到的 Network 紅字（哪個 URL 404），我才知道是 ROM 路徑、core 路徑還是 BIOS 缺。

## 動到的檔案

- `vite.config.ts`（加 mtime、slugify 資料夾名）
- `src/types/games.d.ts`（加 `mtime: number`）
- `src/lib/games.ts`（`gamesByPlatform` 加排序）
- `src/routes/play.$platform.$slug.tsx`（設 `EJS_language`）

確認後我就動工。