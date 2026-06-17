export type CategoryId =
  | "chips-namkeen"
  | "cold-drinks"
  | "sweet-cravings"
  | "lazy-meals"
  | "random-midnight";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  mark: string;
  vibe: string;
  accent: "coral" | "teal" | "lilac" | "sunny" | "ink";
}

export interface Product {
  id: string;
  name: string;
  categoryId: CategoryId;
  price: number;
  calories: number;
  regretScore: number;
  subtitle: string;
  tag?: string;
}

export const categories: Category[] = [
  {
    id: "chips-namkeen",
    name: "Chips & Namkeen",
    description: "Crunch, salt, and the confidence of a bad idea.",
    mark: "CR",
    vibe: "Crispy chaos",
    accent: "coral",
  },
  {
    id: "cold-drinks",
    name: "Cold Drinks",
    description: "Fizz for the person who said they were just browsing.",
    mark: "FZ",
    vibe: "Gateway fizz",
    accent: "teal",
  },
  {
    id: "sweet-cravings",
    name: "Sweet Cravings",
    description: "Dessert feelings with zero delivery consequences.",
    mark: "SW",
    vibe: "Soft sabotage",
    accent: "lilac",
  },
  {
    id: "lazy-meals",
    name: "Lazy Meals",
    description: "The meal plan your future self will pretend not to know.",
    mark: "LM",
    vibe: "Blanket cuisine",
    accent: "sunny",
  },
  {
    id: "random-midnight",
    name: "Random Midnight Items",
    description: "Because apparently batteries are emotional support now.",
    mark: "??",
    vibe: "Why cart",
    accent: "ink",
  },
];

export const products: Product[] = [
  {
    id: "masala-drama-chips",
    name: "Masala Drama Chips",
    categoryId: "chips-namkeen",
    price: 68,
    calories: 320,
    regretScore: 72,
    subtitle: "Crunchy bad decision with main-character seasoning.",
    tag: "Salt spiral",
  },
  {
    id: "cream-onion-excuse",
    name: "Cream & Onion Excuse",
    categoryId: "chips-namkeen",
    price: 75,
    calories: 350,
    regretScore: 69,
    subtitle: "You called it a small packet. The packet disagreed.",
    tag: "Classic almost-order",
  },
  {
    id: "bhujia-backup-plan",
    name: "Bhujia Backup Plan",
    categoryId: "chips-namkeen",
    price: 54,
    calories: 280,
    regretScore: 63,
    subtitle: "For when dinner was technically eaten but emotionally ignored.",
  },
  {
    id: "midnight-nachos",
    name: "Midnight Nachos",
    categoryId: "chips-namkeen",
    price: 92,
    calories: 410,
    regretScore: 78,
    subtitle: "Requires dip, confidence, and no morning meetings.",
  },
  {
    id: "peanut-masala-panic",
    name: "Peanut Masala Panic",
    categoryId: "chips-namkeen",
    price: 48,
    calories: 240,
    regretScore: 58,
    subtitle: "Protein-adjacent enough for denial.",
    tag: "Denial-friendly",
  },
  {
    id: "zero-ish-cola",
    name: "Zero-ish Cola",
    categoryId: "cold-drinks",
    price: 45,
    calories: 5,
    regretScore: 31,
    subtitle: "Gateway item. Suddenly chips appear beside it.",
    tag: "Fizz logic",
  },
  {
    id: "regular-chaos-cola",
    name: "Regular Chaos Cola",
    categoryId: "cold-drinks",
    price: 48,
    calories: 150,
    regretScore: 55,
    subtitle: "Cold, fizzy, and very good at negotiating extras.",
  },
  {
    id: "lemon-fizz-detour",
    name: "Lemon Fizz Detour",
    categoryId: "cold-drinks",
    price: 42,
    calories: 120,
    regretScore: 46,
    subtitle: "Tastes like refreshment and poor timing.",
  },
  {
    id: "energy-drink-bad-idea",
    name: "Energy Drink Bad Idea",
    categoryId: "cold-drinks",
    price: 110,
    calories: 165,
    regretScore: 82,
    subtitle: "For people who want tomorrow to start at 3 AM.",
    tag: "Sleep enemy",
  },
  {
    id: "iced-tea-negotiation",
    name: "Iced Tea Negotiation",
    categoryId: "cold-drinks",
    price: 60,
    calories: 130,
    regretScore: 41,
    subtitle: "Looks civilized. Still came from craving brain.",
  },
  {
    id: "chocolate-bar-feelings",
    name: "Chocolate Bar of Feelings",
    categoryId: "sweet-cravings",
    price: 55,
    calories: 260,
    regretScore: 62,
    subtitle: "A tiny rectangle with a large emotional department.",
    tag: "Soft landing",
  },
  {
    id: "choco-pie-alibi",
    name: "Choco Pie Alibi",
    categoryId: "sweet-cravings",
    price: 40,
    calories: 190,
    regretScore: 52,
    subtitle: "You said just one bite. It filed a counterclaim.",
  },
  {
    id: "brownie-square-spiral",
    name: "Brownie Square Spiral",
    categoryId: "sweet-cravings",
    price: 96,
    calories: 390,
    regretScore: 76,
    subtitle: "Dense, fudgy, and absolutely not a productivity tool.",
  },
  {
    id: "ice-cream-tub-expedition",
    name: "Ice Cream Tub Expedition",
    categoryId: "sweet-cravings",
    price: 240,
    calories: 780,
    regretScore: 88,
    subtitle: "For emotional excavation. Spoon not included, wisely.",
    tag: "Big feelings",
  },
  {
    id: "cookie-stack-situation",
    name: "Cookie Stack Situation",
    categoryId: "sweet-cravings",
    price: 85,
    calories: 310,
    regretScore: 66,
    subtitle: "One cookie became a meeting with the whole team.",
  },
  {
    id: "two-minute-noodles",
    name: "Two-Minute Noodles",
    categoryId: "lazy-meals",
    price: 36,
    calories: 340,
    regretScore: 61,
    subtitle: "Not a snack. A lifestyle subplot.",
    tag: "Hostel classic",
  },
  {
    id: "cup-noodles-console",
    name: "Cup Noodles Console",
    categoryId: "lazy-meals",
    price: 52,
    calories: 300,
    regretScore: 58,
    subtitle: "Just add hot water and questionable decisions.",
  },
  {
    id: "frozen-momos",
    name: "Frozen Momos",
    categoryId: "lazy-meals",
    price: 180,
    calories: 520,
    regretScore: 81,
    subtitle: "Needs chutney and forgiveness.",
    tag: "Steam drama",
  },
  {
    id: "garlic-bread-side-quest",
    name: "Garlic Bread Side Quest",
    categoryId: "lazy-meals",
    price: 120,
    calories: 430,
    regretScore: 70,
    subtitle: "Somehow became the main plot.",
  },
  {
    id: "pizza-pocket-plot",
    name: "Pizza Pocket Plot",
    categoryId: "lazy-meals",
    price: 135,
    calories: 460,
    regretScore: 74,
    subtitle: "Tiny pizza energy. Full-size negotiation.",
  },
  {
    id: "scented-candle-crisis",
    name: "Scented Candle Crisis",
    categoryId: "random-midnight",
    price: 299,
    calories: 0,
    regretScore: 47,
    subtitle: "Your room did not ask for vanilla ambition.",
    tag: "Non-edible chaos",
  },
  {
    id: "emergency-phone-cable",
    name: "Emergency Phone Cable",
    categoryId: "random-midnight",
    price: 249,
    calories: 0,
    regretScore: 39,
    subtitle: "Because the other five cables are emotionally unavailable.",
  },
  {
    id: "face-wash-at-1am",
    name: "Face Wash at 1 AM",
    categoryId: "random-midnight",
    price: 180,
    calories: 0,
    regretScore: 44,
    subtitle: "Self-care or cart padding? The court is still deciding.",
  },
  {
    id: "battery-pack-regret",
    name: "Battery Pack of Regret",
    categoryId: "random-midnight",
    price: 120,
    calories: 0,
    regretScore: 35,
    subtitle: "Useful, yes. Urgent at midnight, suspicious.",
  },
  {
    id: "mystery-why-item",
    name: "Mystery Why Item",
    categoryId: "random-midnight",
    price: 99,
    calories: 0,
    regretScore: 67,
    subtitle: "You added it. We are all learning about you.",
    tag: "Cart filler",
  },
];
