import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const csvPath = path.join(rootDir, "products", "product_list.csv");
const publicImageDir = path.join(rootDir, "public", "product-images");
const catalogPath = path.join(rootDir, "src", "data", "catalog.ts");

const categoryDefinitions = [
  {
    id: "chips-namkeen",
    name: "Chips & Namkeen",
    description: "Crunchy negotiations for salty late-night thoughts.",
    mark: "CN",
    vibe: "Crisp chaos",
    accent: "coral",
  },
  {
    id: "cold-drinks",
    name: "Cold Drinks",
    description: "Fizz, chill, and the illusion of a tiny reset.",
    mark: "CD",
    vibe: "Fizz logic",
    accent: "teal",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    description: "Soft squares for feelings with excellent packaging.",
    mark: "CH",
    vibe: "Cocoa courtroom",
    accent: "lilac",
  },
  {
    id: "ice-cream",
    name: "Ice Cream",
    description: "Freezer theatre with a spoon-shaped plot twist.",
    mark: "IC",
    vibe: "Cold comfort",
    accent: "sunny",
  },
  {
    id: "instant-food",
    name: "Instant Food",
    description: "Two-minute ambition dressed as a meal plan.",
    mark: "IF",
    vibe: "Steam spiral",
    accent: "ink",
  },
  {
    id: "bakery",
    name: "Bakery",
    description: "Soft carbs with negotiation skills.",
    mark: "BK",
    vibe: "Butter subplot",
    accent: "coral",
  },
  {
    id: "frozen-snacks",
    name: "Frozen Snacks",
    description: "Freezer-door confidence for snack emergencies.",
    mark: "FS",
    vibe: "Crispy freezer",
    accent: "teal",
  },
  {
    id: "breakfast-regrets",
    name: "Breakfast Regrets",
    description: "Morning intentions trying not to become a subplot.",
    mark: "BR",
    vibe: "Sunrise bargaining",
    accent: "lilac",
  },
  {
    id: "random-non-food-items",
    name: "Random Non-Food Items",
    description: "Useful, maybe. Urgent right now, suspicious.",
    mark: "NF",
    vibe: "Cart padding",
    accent: "sunny",
  },
  {
    id: "emotional-purchases",
    name: "Emotional Purchases",
    description: "Tiny objects for very large moods.",
    mark: "EP",
    vibe: "Mood merch",
    accent: "ink",
  },
];

const categoryIdByName = new Map(categoryDefinitions.map((category) => [category.name, category.id]));

const regretBaseByOriginalCategory = new Map([
  ["instant food", 74],
  ["frozen snack", 76],
  ["ice cream", 78],
  ["snack", 67],
  ["chocolate", 70],
  ["bakery", 64],
  ["breakfast", 60],
  ["drink", 48],
  ["non food item", 40],
  ["emotional purchase", 48],
]);

const regretKeywords = [
  "midnight",
  "panic",
  "deadline",
  "salary",
  "stress",
  "regret",
  "crisis",
  "doom",
  "argument",
  "situation",
  "mystery",
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (quoted) {
      if (character === "\"" && nextCharacter === "\"") {
        field += "\"";
        index += 1;
      } else if (character === "\"") {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === "\"") {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  if (quoted) {
    throw new Error("CSV has an unterminated quoted field.");
  }

  return rows;
}

function parseNumber(value, label, rowIndex) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(`Row ${rowIndex}: ${label} must be a nonnegative number.`);
  }
  return numberValue;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getPriceWeight(price) {
  if (price >= 600) return 14;
  if (price >= 400) return 11;
  if (price >= 250) return 8;
  if (price >= 150) return 5;
  if (price >= 90) return 3;
  return 0;
}

function deriveRegretScore(row) {
  const originalCategory = row.original_category.trim().toLowerCase();
  const base = regretBaseByOriginalCategory.get(originalCategory);
  if (base === undefined) {
    throw new Error(`Unknown original_category: ${row.original_category}`);
  }

  const searchable = [
    row.category,
    row.subcategory,
    row.brand_name,
    row.product_name,
    row.short_name,
    row.search_keywords,
    row.one_line_description,
  ]
    .join(" ")
    .toLowerCase();
  const keywordBump = regretKeywords.reduce(
    (total, keyword) => total + (searchable.includes(keyword) ? 3 : 0),
    0,
  );
  const price = Number(row.fake_price_inr);

  return clamp(Math.round(base + getPriceWeight(price) + Math.min(keywordBump, 15)), 1, 100);
}

function getSearchKeywords(value) {
  return Array.from(
    new Set(
      value
        .split(/[,\s]+/)
        .map((keyword) => keyword.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pickStable(values, seed, offset = 0) {
  return values[(seed + offset) % values.length];
}

function toFriendlyList(values) {
  const cleanValues = values.filter(Boolean);

  if (cleanValues.length <= 1) {
    return cleanValues[0] ?? "";
  }

  return `${cleanValues.slice(0, -1).join(", ")} and ${cleanValues[cleanValues.length - 1]}`;
}

const categoryDetailMoods = {
  "chips-namkeen": {
    scene: "pantry politics, group chat courage and one very crunchy deadline",
    meeting: "all-hands crunch review",
    future: "drink water before this becomes a full committee decision",
  },
  "cold-drinks": {
    scene: "camera-off calls, assignment extensions and fridge-door confidence",
    meeting: "fizz-led standup",
    future: "the cold drink can stay in the cart; your sleep schedule has already filed HR feedback",
  },
  chocolate: {
    scene: "soft launches, soft feelings and a calendar invite named quick break",
    meeting: "cocoa townhall",
    future: "save the main character energy for tomorrow morning",
  },
  "ice-cream": {
    scene: "hostel freezer diplomacy, post-meeting silence and spoon-based strategy",
    meeting: "freezer retrospective",
    future: "close the freezer tab and let the craving lose network",
  },
  "instant-food": {
    scene: "two-minute ambition, exam season bargaining and dinner that forgot to become dinner",
    meeting: "noodle sprint planning",
    future: "make real food if you are hungry; this one is for the ritual",
  },
  bakery: {
    scene: "butter logic, college canteen nostalgia and one unread performance review",
    meeting: "carb alignment call",
    future: "future you requests a softer landing than a midnight pastry subplot",
  },
  "frozen-snacks": {
    scene: "freezer raids, IPL overs and group project survivors",
    meeting: "air-fryer escalation",
    future: "the freezer can wait; your future self has bandwidth constraints",
  },
  "breakfast-regrets": {
    scene: "morning optimism, alarm snoozes and wellness plans with weak governance",
    meeting: "breakfast OKR review",
    future: "tomorrow you deserves breakfast, not a plot twist",
  },
  "random-non-food-items": {
    scene: "adulting tabs, salary-week confidence and things your drawer did not request",
    meeting: "impulse procurement sync",
    future: "check the drawer before your cart becomes an inventory system",
  },
  "emotional-purchases": {
    scene: "self-care decks, mood boards and retail therapy with no minutes of meeting",
    meeting: "feelings finance review",
    future: "the emotion is valid; the checkout can remain fictional",
  },
};

const keywordScenes = [
  {
    keywords: ["office", "meeting", "corporate", "deadline", "work", "startup"],
    line: "Teams-meeting energy, snack-sized consequences.",
  },
  {
    keywords: ["hostel", "college", "exam", "fest", "internship"],
    line: "Hostel-room morale in one tiny decision.",
  },
  {
    keywords: ["salary", "month", "premium"],
    line: "Salary-week confidence, month-end consequences.",
  },
  {
    keywords: ["midnight", "3am", "sleep", "insomnia", "late", "night"],
    line: "Arrives when just checking becomes cart research.",
  },
  {
    keywords: ["family", "argument", "guest", "remote"],
    line: "Built for living-room diplomacy and side-eye.",
  },
  {
    keywords: ["reels", "doom", "scrolling", "phone"],
    line: "Pairs with one more reel. Dangerous phrase.",
  },
  {
    keywords: ["adulting", "productivity", "planner", "notebook"],
    line: "Looks like adulting. Behaves like impulse.",
  },
];

const detailOpeners = [
  "{subcategory} craving, officially escalated.",
  "{subcategory} with full group-chat approval energy.",
  "{subcategory} confidence at 12:07 AM.",
  "{subcategory}, but make it a tiny procurement decision.",
  "{subcategory} pretending to be a reasonable idea.",
];

const whyTemplates = [
  "Because {keywords} were already trending in your head.",
  "Because the cart saw {keywords} and called it research.",
  "Because the brief was simple: small dopamine, big theatre, excellent cart choreography.",
  "Because your thumb tried to approve the {subcategory} purchase order.",
];

const futureTemplates = [
  "Future you says: {future}.",
  "Future you approves the fictional version only.",
  "Future you asks why {subcategory} needed governance.",
  "Dopamine acknowledged. Delivery can stand down.",
];

function getKeywordScene(searchKeywords) {
  const keywordSet = new Set(searchKeywords.map((keyword) => keyword.toLowerCase()));
  return keywordScenes.find((scene) =>
    scene.keywords.some((keyword) => keywordSet.has(keyword)),
  )?.line;
}

function getOptionalDetailLine(seed, mood, subcategory, keywords) {
  const detailMode = seed % 5;

  if (detailMode === 0 || detailMode === 3) {
    return pickStable(whyTemplates, seed, 2)
      .replaceAll("{keywords}", keywords || subcategory.toLowerCase())
      .replaceAll("{subcategory}", subcategory);
  }

  if (detailMode === 1 || detailMode === 4) {
    return pickStable(futureTemplates, seed, 4)
      .replaceAll("{future}", mood.future)
      .replaceAll("{subcategory}", subcategory);
  }

  return "";
}

function buildDetailCopy(record, categoryId, price, calories, regretScore) {
  const seed = hashString(record.product_id);
  const mood = categoryDetailMoods[categoryId];
  const subcategory = record.subcategory;
  const searchKeywords = getSearchKeywords(record.search_keywords);
  const keywords = toFriendlyList(searchKeywords.slice(0, 3));
  const keywordScene = getKeywordScene(searchKeywords);
  const opener = pickStable(detailOpeners, seed)
    .replaceAll("{subcategory}", subcategory);
  const description = [
    opener,
    keywordScene ?? `Built for ${mood.scene}.`,
    getOptionalDetailLine(seed, mood, subcategory, keywords),
  ].filter(Boolean).join(" ");

  return {
    headline: `Craving report: ${subcategory}`,
    description,
  };
}

function cleanUserFacingText(value) {
  return value
    .replace(/\b[fF]ake\s+/g, "")
    .replace(/\s+\b[fF]ake\b/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function sortObjectKeys(value) {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = sortObjectKeys(value[key]);
        return sorted;
      }, {});
  }

  return value;
}

function formatTs(value) {
  return JSON.stringify(sortObjectKeys(value), null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"/g, "\"");
}

function toRecord(header, row, rowIndex) {
  if (row.length !== header.length) {
    throw new Error(`Row ${rowIndex}: expected ${header.length} columns, received ${row.length}.`);
  }

  return Object.fromEntries(header.map((key, index) => [key, row[index]?.trim() ?? ""]));
}

const csvText = await readFile(csvPath, "utf8");
const [header, ...rows] = parseCsv(csvText);
const requiredColumns = [
  "product_id",
  "category",
  "subcategory",
  "brand_name",
  "product_name",
  "short_name",
  "search_keywords",
  "fake_price_inr",
  "original_category",
  "availability_status",
  "one_line_description",
  "estimated_calories",
];

for (const column of requiredColumns) {
  if (!header.includes(column)) {
    throw new Error(`Missing CSV column: ${column}`);
  }
}

const seenIds = new Set();
const productCountByCategory = new Map(categoryDefinitions.map((category) => [category.id, 0]));
const products = rows.map((row, rowIndex) => {
  const record = toRecord(header, row, rowIndex + 2);
  const id = record.product_id;
  const categoryId = categoryIdByName.get(record.category);

  if (!id) {
    throw new Error(`Row ${rowIndex + 2}: product_id is required.`);
  }
  if (seenIds.has(id)) {
    throw new Error(`Row ${rowIndex + 2}: duplicate product_id ${id}.`);
  }
  if (!categoryId) {
    throw new Error(`Row ${rowIndex + 2}: unknown category ${record.category}.`);
  }
  if (!record.short_name || !record.product_name || !record.brand_name || !record.subcategory) {
    throw new Error(`Row ${rowIndex + 2}: product naming fields are required.`);
  }

  seenIds.add(id);
  productCountByCategory.set(categoryId, (productCountByCategory.get(categoryId) ?? 0) + 1);

  const price = parseNumber(record.fake_price_inr, "fake_price_inr", rowIndex + 2);
  const calories = parseNumber(record.estimated_calories, "estimated_calories", rowIndex + 2);
  if (
    (categoryId === "random-non-food-items" || categoryId === "emotional-purchases") &&
    calories !== 0
  ) {
    throw new Error(`Row ${rowIndex + 2}: non-food/emotional purchase calories must be 0.`);
  }

  const imageFileName = `${id}.jpg`;
  if (!existsSync(path.join(publicImageDir, imageFileName))) {
    throw new Error(`Missing public product image: public/product-images/${imageFileName}`);
  }

  return {
    id,
    name: record.short_name,
    fullName: cleanUserFacingText(record.product_name),
    categoryId,
    subcategory: record.subcategory,
    brandName: record.brand_name,
    price,
    calories,
    regretScore: deriveRegretScore(record),
    detailCopy: buildDetailCopy(
      record,
      categoryId,
      price,
      calories,
      deriveRegretScore(record),
    ),
    subtitle: record.one_line_description,
    searchKeywords: getSearchKeywords(record.search_keywords),
    originalCategory: record.original_category,
    availabilityStatus: record.availability_status,
    imageSrc: `/product-images/${imageFileName}`,
    tag: record.subcategory,
  };
});

if (products.length !== 150) {
  throw new Error(`Expected 150 products, received ${products.length}.`);
}

for (const category of categoryDefinitions) {
  const count = productCountByCategory.get(category.id) ?? 0;
  if (count !== 15) {
    throw new Error(`Expected 15 products for ${category.name}, received ${count}.`);
  }
}

const categoryIds = categoryDefinitions.map((category) => category.id);
const catalogSource = `export type CategoryId =\n${categoryIds
  .map((categoryId, index) => `  | "${categoryId}"${index === categoryIds.length - 1 ? ";" : ""}`)
  .join("\n")}\n\nexport interface Category {\n  id: CategoryId;\n  name: string;\n  description: string;\n  mark: string;\n  vibe: string;\n  accent: \"coral\" | \"teal\" | \"lilac\" | \"sunny\" | \"ink\";\n}\n\nexport interface ProductDetailCopy {\n  headline: string;\n  description: string;\n}\n\nexport interface Product {\n  id: string;\n  name: string;\n  fullName: string;\n  categoryId: CategoryId;\n  subcategory: string;\n  brandName: string;\n  price: number;\n  calories: number;\n  regretScore: number;\n  detailCopy: ProductDetailCopy;\n  subtitle: string;\n  searchKeywords: string[];\n  originalCategory: string;\n  availabilityStatus: string;\n  imageSrc: string;\n  tag?: string;\n}\n\nexport const categories: Category[] = ${formatTs(categoryDefinitions)};\n\nexport const products: Product[] = ${formatTs(products)};\n`;

await writeFile(catalogPath, catalogSource);

console.log(
  `Generated ${products.length} products across ${categoryDefinitions.length} categories in ${path.relative(
    rootDir,
    catalogPath,
  )}.`,
);
