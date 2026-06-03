/**
 * 編輯這個檔案來自訂平台與遊戲名稱顯示。
 * Edit this file to customize platform & game display names.
 *
 * - platformLabels: 平台代碼 → { label: 短名稱, full: 完整名稱 }
 * - gameNames: "平台/資料夾名" → 顯示名稱
 */

export const platformLabels: Record<string, { label: string; full: string }> = {
  nds: { label: "NDS", full: "Nintendo DS" },
  gba: { label: "GBA", full: "Game Boy Advance" },
  snes: { label: "SNES", full: "Super Nintendo" },
  nes: { label: "NES", full: "Nintendo Entertainment System" },
  gb: { label: "GB", full: "Game Boy" },
  gbc: { label: "GBC", full: "Game Boy Color" },
  n64: { label: "N64", full: "Nintendo 64" },
};

export const gameNames: Record<string, string> = {
  // 範例 / Examples:
  // "nds/super-mario-bros": "超級瑪利歐兄弟",
  // "gba/pokemon-fire-red": "寶可夢 火紅版",
};