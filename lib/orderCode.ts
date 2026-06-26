// Short, human-friendly order code for bank-transfer notes (e.g. "KN260627AB12").
// Format: "KN" + yyMMdd + 4 random base36 chars (uppercase). The orderNumber column
// is unique, so on the rare collision the insert throws and the customer retries.
export function generateOrderCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KN${yy}${mm}${dd}${random}`;
}
