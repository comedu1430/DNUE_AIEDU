import fs from "node:fs";
import path from "node:path";

export const NOTION_VERSION = "2022-06-28";

export function loadEnvFile(filePath = ".env") {
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) return;

  const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function normalizeNotionId(value) {
  const rawValue = String(value || "").trim();
  const uuidMatch = rawValue.match(/[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}/);

  if (!uuidMatch) {
    return rawValue;
  }

  const compactId = uuidMatch[0].replace(/-/g, "");
  return `${compactId.slice(0, 8)}-${compactId.slice(8, 12)}-${compactId.slice(12, 16)}-${compactId.slice(16, 20)}-${compactId.slice(20)}`;
}

export async function notionRequest(pathname, { method = "GET", body, token = process.env.NOTION_TOKEN } = {}) {
  if (!token) throw new Error("Missing NOTION_TOKEN");

  const response = await fetch(`https://api.notion.com/v1${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || text || response.statusText;
    throw new Error(`Notion API ${method} ${pathname} failed: ${message}`);
  }

  return data;
}

export async function queryAllDatabase(databaseId) {
  const results = [];
  let cursor;

  do {
    const data = await notionRequest(`/databases/${databaseId}/query`, {
      method: "POST",
      body: cursor ? { start_cursor: cursor } : {},
    });

    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return results;
}

export function richTextToPlainText(items = []) {
  return items.map((item) => item.plain_text || "").join("").trim();
}

export function getProperty(page, name) {
  return page.properties?.[name];
}

export function readText(page, name) {
  const property = getProperty(page, name);
  if (!property) return "";

  if (property.type === "title") return richTextToPlainText(property.title);
  if (property.type === "rich_text") return richTextToPlainText(property.rich_text);
  if (property.type === "select") return property.select?.name || "";
  if (property.type === "multi_select") return property.multi_select?.map((item) => item.name).join(" / ") || "";
  if (property.type === "email") return property.email || "";
  if (property.type === "phone_number") return property.phone_number || "";
  if (property.type === "url") return property.url || "";
  if (property.type === "number") return property.number == null ? "" : String(property.number);
  if (property.type === "checkbox") return property.checkbox ? "true" : "false";

  return "";
}

export function readNumber(page, name, fallback = 0) {
  const property = getProperty(page, name);
  if (!property) return fallback;
  if (property.type === "number") return property.number ?? fallback;
  const parsed = Number(readText(page, name));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function readCheckbox(page, name, fallback = true) {
  const property = getProperty(page, name);
  if (!property) return fallback;
  if (property.type === "checkbox") return property.checkbox;
  const text = readText(page, name).toLowerCase();
  if (["true", "yes", "1", "visible", "y"].includes(text)) return true;
  if (["false", "no", "0", "hidden", "n"].includes(text)) return false;
  return fallback;
}

export function splitList(value) {
  if (!value) return [];
  return String(value)
    .split(/\r?\n|\s*;\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

export function writeJson(filePath, value) {
  ensureDirForFile(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
