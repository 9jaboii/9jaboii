import { readFile } from "node:fs/promises";

const allowedDomains = new Set(["d1", "d2", "d3", "d4", "d5", "d6", "d7"]);
const allowedMolds = new Set(["wrong_constraint", "compensating_control", "over_engineered", "plausible_myth"]);
const bank = JSON.parse(await readFile(new URL("../bank/sample-questions.json", import.meta.url), "utf8"));
const failures = [];
const slugs = new Set();

for (const item of bank.items ?? []) {
  const label = item.slug ?? "<missing slug>";
  if (!item.slug || slugs.has(item.slug)) failures.push(`${label}: slug is missing or duplicated`);
  slugs.add(item.slug);
  if (!allowedDomains.has(item.domain)) failures.push(`${label}: invalid domain`);
  if (![1, 2, 3].includes(item.difficulty)) failures.push(`${label}: difficulty must be 1–3`);
  if (!Array.isArray(item.options) || item.options.length !== 4) failures.push(`${label}: exactly four options required`);
  const optionKeys = new Set(item.options?.map((option) => option.key));
  const correctKeys = new Set(item.correct_keys ?? []);
  const requiredCorrectCount = item.is_multi ? 2 : 1;
  if (correctKeys.size !== requiredCorrectCount) failures.push(`${label}: expected ${requiredCorrectCount} correct key(s)`);
  for (const key of correctKeys) if (!optionKeys.has(key)) failures.push(`${label}: unknown correct key ${key}`);
  for (const option of item.options ?? []) {
    const isCorrect = correctKeys.has(option.key);
    if (isCorrect && option.mold !== null) failures.push(`${label}/${option.key}: correct options must have null mold`);
    if (!isCorrect && !allowedMolds.has(option.mold)) failures.push(`${label}/${option.key}: invalid missing/wrong mold`);
    if (!isCorrect && !item.rationale?.wrong?.[option.key]) failures.push(`${label}/${option.key}: missing wrong-option rationale`);
  }
  if (!item.rationale?.correct) failures.push(`${label}: missing correct rationale`);
}

if (failures.length) {
  console.error(`Question-bank validation failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Validated ${bank.items.length} questions across ${new Set(bank.items.map((item) => item.domain)).size} domains.`);
