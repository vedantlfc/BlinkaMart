export type CategoryId =
  | "chips-namkeen"
  | "cold-drinks"
  | "chocolate"
  | "ice-cream"
  | "instant-food"
  | "bakery"
  | "frozen-snacks"
  | "breakfast-regrets"
  | "random-non-food-items"
  | "emotional-purchases";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  mark: string;
  vibe: string;
  accent: "coral" | "teal" | "lilac" | "sunny" | "ink";
}

export interface ProductDetailCopy {
  headline: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  fullName: string;
  categoryId: CategoryId;
  subcategory: string;
  brandName: string;
  price: number;
  calories: number;
  regretScore: number;
  detailCopy: ProductDetailCopy;
  subtitle: string;
  searchKeywords: string[];
  originalCategory: string;
  availabilityStatus: string;
  imageSrc: string;
  tag?: string;
}

export const categories: Category[] = [
  {
    accent: "coral",
    description: "Crunchy negotiations for salty late-night thoughts.",
    id: "chips-namkeen",
    mark: "CN",
    name: "Chips & Namkeen",
    vibe: "Crisp chaos"
  },
  {
    accent: "teal",
    description: "Fizz, chill, and the illusion of a tiny reset.",
    id: "cold-drinks",
    mark: "CD",
    name: "Cold Drinks",
    vibe: "Fizz logic"
  },
  {
    accent: "lilac",
    description: "Soft squares for feelings with excellent packaging.",
    id: "chocolate",
    mark: "CH",
    name: "Chocolate",
    vibe: "Cocoa courtroom"
  },
  {
    accent: "sunny",
    description: "Freezer theatre with a spoon-shaped plot twist.",
    id: "ice-cream",
    mark: "IC",
    name: "Ice Cream",
    vibe: "Cold comfort"
  },
  {
    accent: "ink",
    description: "Two-minute ambition dressed as a meal plan.",
    id: "instant-food",
    mark: "IF",
    name: "Instant Food",
    vibe: "Steam spiral"
  },
  {
    accent: "coral",
    description: "Soft carbs with negotiation skills.",
    id: "bakery",
    mark: "BK",
    name: "Bakery",
    vibe: "Butter subplot"
  },
  {
    accent: "teal",
    description: "Freezer-door confidence for snack emergencies.",
    id: "frozen-snacks",
    mark: "FS",
    name: "Frozen Snacks",
    vibe: "Crispy freezer"
  },
  {
    accent: "lilac",
    description: "Morning intentions trying not to become a subplot.",
    id: "breakfast-regrets",
    mark: "BR",
    name: "Breakfast Regrets",
    vibe: "Sunrise bargaining"
  },
  {
    accent: "sunny",
    description: "Useful, maybe. Urgent right now, suspicious.",
    id: "random-non-food-items",
    mark: "NF",
    name: "Random Non-Food Items",
    vibe: "Cart padding"
  },
  {
    accent: "ink",
    description: "Tiny objects for very large moods.",
    id: "emotional-purchases",
    mark: "EP",
    name: "Emotional Purchases",
    vibe: "Mood merch"
  }
];

export const products: Product[] = [
  {
    availabilityStatus: "available",
    brandName: "BhookBoss",
    calories: 385,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Arrives when just checking becomes cart research. Potato Chips has made its case; future you requested a pause.",
      headline: "Potato Chips urge logged"
    },
    fullName: "BhookBoss 3AM Decision Making Chips",
    id: "NC001",
    imageSrc: "/product-images/NC001.jpg",
    name: "Decision Chips",
    originalCategory: "snack",
    price: 50,
    regretScore: 70,
    searchKeywords: [
      "spicy",
      "chips",
      "midnight",
      "bad",
      "decision"
    ],
    subcategory: "Potato Chips",
    subtitle: "Potato Chips made for because your sleep schedule was becoming too peaceful",
    tag: "Potato Chips"
  },
  {
    availabilityStatus: "available",
    brandName: "Namkeen Nonsense",
    calories: 434,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Built for living-room diplomacy and side-eye. Tagged under bhujia, family and argument; proceed with comedy, not autopilot.",
      headline: "Bhujia impulse brief"
    },
    fullName: "Namkeen Nonsense Family Argument Survival Bhujia",
    id: "NC002",
    imageSrc: "/product-images/NC002.jpg",
    name: "Argument Bhujia",
    originalCategory: "snack",
    price: 67,
    regretScore: 70,
    searchKeywords: [
      "bhujia",
      "family",
      "argument",
      "namkeen"
    ],
    subcategory: "Bhujia",
    subtitle: "Bhujia made for crunch through the tension before uncle starts again",
    tag: "Bhujia"
  },
  {
    availabilityStatus: "available",
    brandName: "Crunch Committee",
    calories: 472,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences.",
      headline: "Corn Puffs craving filed"
    },
    fullName: "Crunch Committee Office Pantry Cheese Puffs",
    id: "NC003",
    imageSrc: "/product-images/NC003.jpg",
    name: "Pantry Puffs",
    originalCategory: "snack",
    price: 84,
    regretScore: 70,
    searchKeywords: [
      "cheese",
      "puffs",
      "office",
      "stress"
    ],
    subcategory: "Corn Puffs",
    subtitle: "Corn Puffs made for for when the meeting could have been a snack",
    tag: "Corn Puffs"
  },
  {
    availabilityStatus: "available",
    brandName: "Desi Dynamics",
    calories: 510,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Pairs with one more reel. Dangerous phrase. Regret risk: 73/100; Self Control is observing.",
      headline: "Masala Mix urge logged"
    },
    fullName: "Desi Dynamics Doomscroll Masala Mix",
    id: "NC004",
    imageSrc: "/product-images/NC004.jpg",
    name: "Doom Mix",
    originalCategory: "snack",
    price: 101,
    regretScore: 73,
    searchKeywords: [
      "masala",
      "mix",
      "reels",
      "scrolling"
    ],
    subcategory: "Masala Mix",
    subtitle: "Masala Mix made for one handful per unnecessary reel",
    tag: "Masala Mix"
  },
  {
    availabilityStatus: "available",
    brandName: "Midnight Mandali",
    calories: 560,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Built for pantry politics, group chat courage and one very crunchy deadline. Self Control has opened a ticket.",
      headline: "Nachos temptation memo"
    },
    fullName: "Midnight Mandali Group Chat Screenshot Nachos",
    id: "NC005",
    imageSrc: "/product-images/NC005.jpg",
    name: "Chat Nachos",
    originalCategory: "snack",
    price: 118,
    regretScore: 73,
    searchKeywords: [
      "nachos",
      "gossip",
      "group",
      "chat"
    ],
    subcategory: "Nachos",
    subtitle: "Nachos made for crunch before you type something risky",
    tag: "Nachos"
  },
  {
    availabilityStatus: "available",
    brandName: "BhookBoss",
    calories: 598,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Built for pantry politics, group chat courage and one very crunchy deadline.",
      headline: "Peanuts craving filed"
    },
    fullName: "BhookBoss Auto Ride Peanut Masala",
    id: "NC006",
    imageSrc: "/product-images/NC006.jpg",
    name: "Auto Peanuts",
    originalCategory: "snack",
    price: 40,
    regretScore: 67,
    searchKeywords: [
      "peanut",
      "masala",
      "traffic",
      "hunger"
    ],
    subcategory: "Peanuts",
    subtitle: "Peanuts made for for traffic jams that become personality tests",
    tag: "Peanuts"
  },
  {
    availabilityStatus: "available",
    brandName: "Namkeen Nonsense",
    calories: 643,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Built for living-room diplomacy and side-eye. Craving heard; cart drama can take a breath.",
      headline: "Sev cart case opened"
    },
    fullName: "Namkeen Nonsense Aunty Visit Emergency Sev",
    id: "NC007",
    imageSrc: "/product-images/NC007.jpg",
    name: "Emergency Sev",
    originalCategory: "snack",
    price: 57,
    regretScore: 67,
    searchKeywords: [
      "sev",
      "family",
      "guest",
      "snack"
    ],
    subcategory: "Sev",
    subtitle: "Sev made for looks polite, behaves chaotic",
    tag: "Sev"
  },
  {
    availabilityStatus: "available",
    brandName: "Crunch Committee",
    calories: 695,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Built for pantry politics, group chat courage and one very crunchy deadline. Regret risk: 67/100; Self Control is observing.",
      headline: "Banana Chips impulse brief"
    },
    fullName: "Crunch Committee Kerala Trip Cancelled Banana Chips",
    id: "NC008",
    imageSrc: "/product-images/NC008.jpg",
    name: "Trip Chips",
    originalCategory: "snack",
    price: 74,
    regretScore: 67,
    searchKeywords: [
      "banana",
      "chips",
      "travel",
      "craving"
    ],
    subcategory: "Banana Chips",
    subtitle: "Banana Chips made for vacation mood without booking tickets",
    tag: "Banana Chips"
  },
  {
    availabilityStatus: "available",
    brandName: "Desi Dynamics",
    calories: 723,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Salary-week confidence, month-end consequences.",
      headline: "Mixture craving filed"
    },
    fullName: "Desi Dynamics Salary Over Mixture",
    id: "NC009",
    imageSrc: "/product-images/NC009.jpg",
    name: "Salary Mixture",
    originalCategory: "snack",
    price: 91,
    regretScore: 73,
    searchKeywords: [
      "mixture",
      "salary",
      "month",
      "end"
    ],
    subcategory: "Mixture",
    subtitle: "Mixture made for month-end crunch with actual crunch",
    tag: "Mixture"
  },
  {
    availabilityStatus: "available",
    brandName: "Midnight Mandali",
    calories: 777,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Built for pantry politics, group chat courage and one very crunchy deadline. Price pressure: Rs 108; the thumb committee gets one breath.",
      headline: "Makhana urge logged"
    },
    fullName: "Midnight Mandali Wellness Pretence Peri Makhana",
    id: "NC010",
    imageSrc: "/product-images/NC010.jpg",
    name: "Pretence Makhana",
    originalCategory: "snack",
    price: 108,
    regretScore: 73,
    searchKeywords: [
      "makhana",
      "healthy",
      "spicy",
      "snack"
    ],
    subcategory: "Makhana",
    subtitle: "Makhana made for for pretending this was a balanced choice",
    tag: "Makhana"
  },
  {
    availabilityStatus: "available",
    brandName: "BhookBoss",
    calories: 394,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Built for pantry politics, group chat courage and one very crunchy deadline. Future you says: drink water before this becomes a full committee decision.",
      headline: "Papdi cart case opened"
    },
    fullName: "BhookBoss Shaadi Buffet Papdi Bites",
    id: "NC011",
    imageSrc: "/product-images/NC011.jpg",
    name: "Shaadi Papdi",
    originalCategory: "snack",
    price: 125,
    regretScore: 70,
    searchKeywords: [
      "papdi",
      "wedding",
      "snack"
    ],
    subcategory: "Papdi",
    subtitle: "Papdi made for wedding starter energy at home",
    tag: "Papdi"
  },
  {
    availabilityStatus: "available",
    brandName: "Namkeen Nonsense",
    calories: 434,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Chakli has made its case; future you requested a pause.",
      headline: "Chakli impulse brief"
    },
    fullName: "Namkeen Nonsense Deadline Spiral Chakli",
    id: "NC012",
    imageSrc: "/product-images/NC012.jpg",
    name: "Spiral Chakli",
    originalCategory: "snack",
    price: 47,
    regretScore: 70,
    searchKeywords: [
      "chakli",
      "deadline",
      "snack"
    ],
    subcategory: "Chakli",
    subtitle: "Chakli made for your task list now has texture",
    tag: "Chakli"
  },
  {
    availabilityStatus: "available",
    brandName: "Crunch Committee",
    calories: 477,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Hostel-room morale in one tiny decision. Future you asks why Khurma needed governance.",
      headline: "Khurma temptation memo"
    },
    fullName: "Crunch Committee Hostel Cupboard Khurma",
    id: "NC013",
    imageSrc: "/product-images/NC013.jpg",
    name: "Cupboard Khurma",
    originalCategory: "snack",
    price: 64,
    regretScore: 67,
    searchKeywords: [
      "hostel",
      "sweet",
      "snack"
    ],
    subcategory: "Khurma",
    subtitle: "Khurma made for found in every room during exam season",
    tag: "Khurma"
  },
  {
    availabilityStatus: "available",
    brandName: "Desi Dynamics",
    calories: 524,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Built for pantry politics, group chat courage and one very crunchy deadline. Craving heard; cart drama can take a breath.",
      headline: "Chana cart case opened"
    },
    fullName: "Desi Dynamics Protein Drama Masala Chana",
    id: "NC014",
    imageSrc: "/product-images/NC014.jpg",
    name: "Drama Chana",
    originalCategory: "snack",
    price: 81,
    regretScore: 67,
    searchKeywords: [
      "chana",
      "protein",
      "spicy"
    ],
    subcategory: "Chana",
    subtitle: "Chana made for gym bro approved until packet three",
    tag: "Chana"
  },
  {
    availabilityStatus: "available",
    brandName: "Midnight Mandali",
    calories: 566,
    categoryId: "chips-namkeen",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences.",
      headline: "Wafer Chips craving filed"
    },
    fullName: "Midnight Mandali Soft Launch Salted Wafers",
    id: "NC015",
    imageSrc: "/product-images/NC015.jpg",
    name: "Launch Wafers",
    originalCategory: "snack",
    price: 98,
    regretScore: 76,
    searchKeywords: [
      "wafer",
      "chips",
      "startup",
      "stress"
    ],
    subcategory: "Wafer Chips",
    subtitle: "Wafer Chips made for for founders avoiding user feedback",
    tag: "Wafer Chips"
  },
  {
    availabilityStatus: "available",
    brandName: "MoodFuel",
    calories: 27,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Arrives when just checking becomes cart research. Self Control has opened a ticket.",
      headline: "Cola temptation memo"
    },
    fullName: "MoodFuel Energy Cola Zero Sleep",
    id: "NC016",
    imageSrc: "/product-images/NC016.jpg",
    name: "Energy Cola",
    originalCategory: "drink",
    price: 46,
    regretScore: 51,
    searchKeywords: [
      "cola",
      "caffeine",
      "midnight"
    ],
    subcategory: "Cola",
    subtitle: "Cola made for fuel your bad decisions",
    tag: "Cola"
  },
  {
    availabilityStatus: "available",
    brandName: "Fizz Logic",
    calories: 59,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Built for camera-off calls, assignment extensions and fridge-door confidence. Regret risk: 51/100; Self Control is observing.",
      headline: "Lemon Soda urge logged"
    },
    fullName: "Fizz Logic Panic Lemon Soda",
    id: "NC017",
    imageSrc: "/product-images/NC017.jpg",
    name: "Panic Soda",
    originalCategory: "drink",
    price: 63,
    regretScore: 51,
    searchKeywords: [
      "lemon",
      "soda",
      "anxiety",
      "fizz"
    ],
    subcategory: "Lemon Soda",
    subtitle: "Lemon Soda made for hydration but make it nervous",
    tag: "Lemon Soda"
  },
  {
    availabilityStatus: "available",
    brandName: "Chill Pending",
    calories: 114,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Price pressure: Rs 80; the thumb committee gets one breath.",
      headline: "Iced Tea impulse brief"
    },
    fullName: "Chill Pending Passive Aggressive Peach Tea",
    id: "NC018",
    imageSrc: "/product-images/NC018.jpg",
    name: "Peach Tea",
    originalCategory: "drink",
    price: 80,
    regretScore: 48,
    searchKeywords: [
      "iced",
      "tea",
      "peach",
      "office"
    ],
    subcategory: "Iced Tea",
    subtitle: "Iced Tea made for best served with unread emails",
    tag: "Iced Tea"
  },
  {
    availabilityStatus: "available",
    brandName: "Office Escape",
    calories: 160,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Future you says: the cold drink can stay in the cart; your sleep schedule has already filed HR feedback.",
      headline: "Energy Drink temptation memo"
    },
    fullName: "Office Escape Deadline Extension Energy Drink",
    id: "NC019",
    imageSrc: "/product-images/NC019.jpg",
    name: "Deadline Drink",
    originalCategory: "drink",
    price: 97,
    regretScore: 54,
    searchKeywords: [
      "energy",
      "drink",
      "deadline",
      "work"
    ],
    subcategory: "Energy Drink",
    subtitle: "Energy Drink made for scientifically unproven but emotionally necessary",
    tag: "Energy Drink"
  },
  {
    availabilityStatus: "available",
    brandName: "Sleep Later Co",
    calories: 196,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Future you says: the cold drink can stay in the cart; your sleep schedule has already filed HR feedback.",
      headline: "Cold Coffee cart case opened"
    },
    fullName: "Sleep Later Co Standup Call Cold Coffee",
    id: "NC020",
    imageSrc: "/product-images/NC020.jpg",
    name: "Standup Coffee",
    originalCategory: "drink",
    price: 114,
    regretScore: 51,
    searchKeywords: [
      "cold",
      "coffee",
      "corporate",
      "morning"
    ],
    subcategory: "Cold Coffee",
    subtitle: "Cold Coffee made for for surviving cameras-off meetings",
    tag: "Cold Coffee"
  },
  {
    availabilityStatus: "available",
    brandName: "MoodFuel",
    calories: 244,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Hostel-room morale in one tiny decision. Price pressure: Rs 131; the thumb committee gets one breath.",
      headline: "Mango Drink urge logged"
    },
    fullName: "MoodFuel Summer Internship Mango Drink",
    id: "NC021",
    imageSrc: "/product-images/NC021.jpg",
    name: "Intern Mango",
    originalCategory: "drink",
    price: 131,
    regretScore: 51,
    searchKeywords: [
      "mango",
      "drink",
      "internship"
    ],
    subcategory: "Mango Drink",
    subtitle: "Mango Drink made for tastes like unpaid learning",
    tag: "Mango Drink"
  },
  {
    availabilityStatus: "available",
    brandName: "Fizz Logic",
    calories: 16,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Built for camera-off calls, assignment extensions and fridge-door confidence. Future you asks why Jeera Soda needed governance.",
      headline: "Jeera Soda temptation memo"
    },
    fullName: "Fizz Logic Gaslight Jeera Soda",
    id: "NC022",
    imageSrc: "/product-images/NC022.jpg",
    name: "Jeera Soda",
    originalCategory: "drink",
    price: 148,
    regretScore: 51,
    searchKeywords: [
      "jeera",
      "soda",
      "digestion",
      "spicy"
    ],
    subcategory: "Jeera Soda",
    subtitle: "Jeera Soda made for for snacks that deny involvement",
    tag: "Jeera Soda"
  },
  {
    availabilityStatus: "available",
    brandName: "Chill Pending",
    calories: 63,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Salary-week confidence, month-end consequences. Tonic Water has made its case; future you requested a pause.",
      headline: "Tonic Water impulse brief"
    },
    fullName: "Chill Pending Salary Day Luxury Water",
    id: "NC023",
    imageSrc: "/product-images/NC023.jpg",
    name: "Luxury Water",
    originalCategory: "drink",
    price: 50,
    regretScore: 51,
    searchKeywords: [
      "premium",
      "water",
      "salary",
      "day"
    ],
    subcategory: "Tonic Water",
    subtitle: "Tonic Water made for water with confidence problems",
    tag: "Tonic Water"
  },
  {
    availabilityStatus: "available",
    brandName: "Office Escape",
    calories: 108,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Built for camera-off calls, assignment extensions and fridge-door confidence.",
      headline: "Orange Drink craving filed"
    },
    fullName: "Office Escape Gym Tomorrow Orange Drink",
    id: "NC024",
    imageSrc: "/product-images/NC024.jpg",
    name: "Gym Orange",
    originalCategory: "drink",
    price: 67,
    regretScore: 48,
    searchKeywords: [
      "orange",
      "drink",
      "gym",
      "tomorrow"
    ],
    subcategory: "Orange Drink",
    subtitle: "Orange Drink made for for people starting fitness monday",
    tag: "Orange Drink"
  },
  {
    availabilityStatus: "available",
    brandName: "Sleep Later Co",
    calories: 157,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Built for camera-off calls, assignment extensions and fridge-door confidence. Craving heard; cart drama can take a breath.",
      headline: "Mocktail cart case opened"
    },
    fullName: "Sleep Later Co Rooftop Plan Cancelled Mocktail",
    id: "NC025",
    imageSrc: "/product-images/NC025.jpg",
    name: "Cancelled Mocktail",
    originalCategory: "drink",
    price: 84,
    regretScore: 48,
    searchKeywords: [
      "mocktail",
      "weekend",
      "plan"
    ],
    subcategory: "Mocktail",
    subtitle: "Mocktail made for night-out aesthetic without leaving bed",
    tag: "Mocktail"
  },
  {
    availabilityStatus: "available",
    brandName: "MoodFuel",
    calories: 203,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Built for camera-off calls, assignment extensions and fridge-door confidence. Regret risk: 51/100; Self Control is observing.",
      headline: "Coconut Water urge logged"
    },
    fullName: "MoodFuel Hangover Negotiation Coconut Water",
    id: "NC026",
    imageSrc: "/product-images/NC026.jpg",
    name: "Negotiation Water",
    originalCategory: "drink",
    price: 101,
    regretScore: 51,
    searchKeywords: [
      "coconut",
      "water",
      "hangover"
    ],
    subcategory: "Coconut Water",
    subtitle: "Coconut Water made for peace treaty with last night",
    tag: "Coconut Water"
  },
  {
    availabilityStatus: "available",
    brandName: "Fizz Logic",
    calories: 236,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Hostel-room morale in one tiny decision. Self Control has opened a ticket.",
      headline: "Masala Soda temptation memo"
    },
    fullName: "Fizz Logic College Fest Masala Soda",
    id: "NC027",
    imageSrc: "/product-images/NC027.jpg",
    name: "Fest Soda",
    originalCategory: "drink",
    price: 118,
    regretScore: 51,
    searchKeywords: [
      "masala",
      "soda",
      "college",
      "fest"
    ],
    subcategory: "Masala Soda",
    subtitle: "Masala Soda made for tastes like loud speakers and dust",
    tag: "Masala Soda"
  },
  {
    availabilityStatus: "available",
    brandName: "Chill Pending",
    calories: 13,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Built for camera-off calls, assignment extensions and fridge-door confidence. Tagged under rose, milk and childhood; proceed with comedy, not autopilot.",
      headline: "Rose Milk impulse brief"
    },
    fullName: "Chill Pending Nostalgia Rose Milk",
    id: "NC028",
    imageSrc: "/product-images/NC028.jpg",
    name: "Rose Milk",
    originalCategory: "drink",
    price: 135,
    regretScore: 51,
    searchKeywords: [
      "rose",
      "milk",
      "childhood"
    ],
    subcategory: "Rose Milk",
    subtitle: "Rose Milk made for childhood sweetness with adult bills",
    tag: "Rose Milk"
  },
  {
    availabilityStatus: "available",
    brandName: "Office Escape",
    calories: 61,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Arrives when just checking becomes cart research.",
      headline: "Lassi craving filed"
    },
    fullName: "Office Escape Nap Required Sweet Lassi",
    id: "NC029",
    imageSrc: "/product-images/NC029.jpg",
    name: "Nap Lassi",
    originalCategory: "drink",
    price: 37,
    regretScore: 48,
    searchKeywords: [
      "lassi",
      "sleep",
      "afternoon"
    ],
    subcategory: "Lassi",
    subtitle: "Lassi made for this drink has logged you out",
    tag: "Lassi"
  },
  {
    availabilityStatus: "available",
    brandName: "Sleep Later Co",
    calories: 106,
    categoryId: "cold-drinks",
    detailCopy: {
      description: "Built for camera-off calls, assignment extensions and fridge-door confidence. Sparkling Water has made its case; future you requested a pause.",
      headline: "Sparkling Water urge logged"
    },
    fullName: "Sleep Later Co Influencer Sparkling Water",
    id: "NC030",
    imageSrc: "/product-images/NC030.jpg",
    name: "Sparkle Water",
    originalCategory: "drink",
    price: 54,
    regretScore: 48,
    searchKeywords: [
      "sparkling",
      "water",
      "aesthetic"
    ],
    subcategory: "Sparkling Water",
    subtitle: "Sparkling Water made for for people who call bubbles a lifestyle",
    tag: "Sparkling Water"
  },
  {
    availabilityStatus: "available",
    brandName: "Emotional Damage",
    calories: 206,
    categoryId: "chocolate",
    detailCopy: {
      description: "Looks like adulting. Behaves like impulse. Future you asks why Chocolate Bar needed governance.",
      headline: "Chocolate Bar cart case opened"
    },
    fullName: "Emotional Damage Adulting Failure Chocolate",
    id: "NC031",
    imageSrc: "/product-images/NC031.jpg",
    name: "Failure Bar",
    originalCategory: "chocolate",
    price: 54,
    regretScore: 73,
    searchKeywords: [
      "chocolate",
      "adulting",
      "rent",
      "stress"
    ],
    subcategory: "Chocolate Bar",
    subtitle: "Chocolate Bar made for for when life admin wins",
    tag: "Chocolate Bar"
  },
  {
    availabilityStatus: "available",
    brandName: "Snack Therapy",
    calories: 243,
    categoryId: "chocolate",
    detailCopy: {
      description: "Built for soft launches, soft feelings and a calendar invite named quick break.",
      headline: "Wafer Bar craving filed"
    },
    fullName: "Snack Therapy Crispy Closure Wafer",
    id: "NC032",
    imageSrc: "/product-images/NC032.jpg",
    name: "Closure Wafer",
    originalCategory: "chocolate",
    price: 71,
    regretScore: 70,
    searchKeywords: [
      "wafer",
      "breakup",
      "closure"
    ],
    subcategory: "Wafer Bar",
    subtitle: "Wafer Bar made for layers like your coping strategy",
    tag: "Wafer Bar"
  },
  {
    availabilityStatus: "available",
    brandName: "Sugar Syllabus",
    calories: 289,
    categoryId: "chocolate",
    detailCopy: {
      description: "Built for soft launches, soft feelings and a calendar invite named quick break. Tagged under truffle, overthinking and message; proceed with comedy, not autopilot.",
      headline: "Truffle impulse brief"
    },
    fullName: "Sugar Syllabus Unread Message Truffles",
    id: "NC033",
    imageSrc: "/product-images/NC033.jpg",
    name: "Unread Truffles",
    originalCategory: "chocolate",
    price: 88,
    regretScore: 70,
    searchKeywords: [
      "truffle",
      "overthinking",
      "message"
    ],
    subcategory: "Truffle",
    subtitle: "Truffle made for sweetness for texts you should ignore",
    tag: "Truffle"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 338,
    categoryId: "chocolate",
    detailCopy: {
      description: "Built for soft launches, soft feelings and a calendar invite named quick break. Self Control has opened a ticket.",
      headline: "Dark Chocolate cart case opened"
    },
    fullName: "Regret Foods Serious Person Dark Chocolate",
    id: "NC034",
    imageSrc: "/product-images/NC034.jpg",
    name: "Serious Dark",
    originalCategory: "chocolate",
    price: 105,
    regretScore: 76,
    searchKeywords: [
      "dark",
      "chocolate",
      "serious",
      "mood"
    ],
    subcategory: "Dark Chocolate",
    subtitle: "Dark Chocolate made for for pretending your snack has discipline",
    tag: "Dark Chocolate"
  },
  {
    availabilityStatus: "available",
    brandName: "Guilt Free-ish",
    calories: 372,
    categoryId: "chocolate",
    detailCopy: {
      description: "Salary-week confidence, month-end consequences.",
      headline: "Caramel Bar craving filed"
    },
    fullName: "Guilt Free-ish Rent Due Caramel Bar",
    id: "NC035",
    imageSrc: "/product-images/NC035.jpg",
    name: "Rent Caramel",
    originalCategory: "chocolate",
    price: 122,
    regretScore: 73,
    searchKeywords: [
      "caramel",
      "rent",
      "month",
      "end"
    ],
    subcategory: "Caramel Bar",
    subtitle: "Caramel Bar made for sticky like your financial planning",
    tag: "Caramel Bar"
  },
  {
    availabilityStatus: "available",
    brandName: "Emotional Damage",
    calories: 422,
    categoryId: "chocolate",
    detailCopy: {
      description: "Hostel-room morale in one tiny decision. Price pressure: Rs 139; the thumb committee gets one breath.",
      headline: "Chocolate Bites impulse brief"
    },
    fullName: "Emotional Damage Exam Result Chocolate Bites",
    id: "NC036",
    imageSrc: "/product-images/NC036.jpg",
    name: "Result Bites",
    originalCategory: "chocolate",
    price: 139,
    regretScore: 76,
    searchKeywords: [
      "chocolate",
      "exam",
      "stress"
    ],
    subcategory: "Chocolate Bites",
    subtitle: "Chocolate Bites made for marks may vary, cocoa is constant",
    tag: "Chocolate Bites"
  },
  {
    availabilityStatus: "available",
    brandName: "Snack Therapy",
    calories: 461,
    categoryId: "chocolate",
    detailCopy: {
      description: "Built for soft launches, soft feelings and a calendar invite named quick break. Future you says: save the main character energy for tomorrow morning.",
      headline: "Fudge temptation memo"
    },
    fullName: "Snack Therapy Therapy Slot Full Fudge",
    id: "NC037",
    imageSrc: "/product-images/NC037.jpg",
    name: "Therapy Fudge",
    originalCategory: "chocolate",
    price: 156,
    regretScore: 75,
    searchKeywords: [
      "fudge",
      "emotional",
      "snack"
    ],
    subcategory: "Fudge",
    subtitle: "Fudge made for next appointment available never",
    tag: "Fudge"
  },
  {
    availabilityStatus: "available",
    brandName: "Sugar Syllabus",
    calories: 502,
    categoryId: "chocolate",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences.",
      headline: "Choco Pie craving filed"
    },
    fullName: "Sugar Syllabus Soft Launch Choco Pie",
    id: "NC038",
    imageSrc: "/product-images/NC038.jpg",
    name: "Launch Pie",
    originalCategory: "chocolate",
    price: 173,
    regretScore: 75,
    searchKeywords: [
      "choco",
      "pie",
      "startup"
    ],
    subcategory: "Choco Pie",
    subtitle: "Choco Pie made for because production broke but dessert shipped",
    tag: "Choco Pie"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 552,
    categoryId: "chocolate",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Regret risk: 78/100; Self Control is observing.",
      headline: "Hazelnut Bar impulse brief"
    },
    fullName: "Regret Foods LinkedIn Update Hazelnut Bar",
    id: "NC039",
    imageSrc: "/product-images/NC039.jpg",
    name: "LinkedIn Bar",
    originalCategory: "chocolate",
    price: 190,
    regretScore: 78,
    searchKeywords: [
      "hazelnut",
      "corporate",
      "cringe"
    ],
    subcategory: "Hazelnut Bar",
    subtitle: "Hazelnut Bar made for for celebrating other people getting promoted",
    tag: "Hazelnut Bar"
  },
  {
    availabilityStatus: "available",
    brandName: "Guilt Free-ish",
    calories: 591,
    categoryId: "chocolate",
    detailCopy: {
      description: "Built for soft launches, soft feelings and a calendar invite named quick break. Regret risk: 70/100; Self Control is observing.",
      headline: "Brownie Bar urge logged"
    },
    fullName: "Guilt Free-ish Quarter Life Brownie Bar",
    id: "NC040",
    imageSrc: "/product-images/NC040.jpg",
    name: "Quarter Brownie",
    originalCategory: "chocolate",
    price: 52,
    regretScore: 70,
    searchKeywords: [
      "brownie",
      "quarter",
      "life"
    ],
    subcategory: "Brownie Bar",
    subtitle: "Brownie Bar made for rich, dense, and slightly confused",
    tag: "Brownie Bar"
  },
  {
    availabilityStatus: "available",
    brandName: "Emotional Damage",
    calories: 639,
    categoryId: "chocolate",
    detailCopy: {
      description: "Built for soft launches, soft feelings and a calendar invite named quick break. Self Control has opened a ticket.",
      headline: "Chocolate Cubes temptation memo"
    },
    fullName: "Emotional Damage Crush Replied Chocolate Cubes",
    id: "NC041",
    imageSrc: "/product-images/NC041.jpg",
    name: "Reply Cubes",
    originalCategory: "chocolate",
    price: 69,
    regretScore: 70,
    searchKeywords: [
      "chocolate",
      "crush",
      "reply"
    ],
    subcategory: "Chocolate Cubes",
    subtitle: "Chocolate Cubes made for for screenshots sent to three friends",
    tag: "Chocolate Cubes"
  },
  {
    availabilityStatus: "available",
    brandName: "Snack Therapy",
    calories: 677,
    categoryId: "chocolate",
    detailCopy: {
      description: "Built for soft launches, soft feelings and a calendar invite named quick break.",
      headline: "Protein Chocolate craving filed"
    },
    fullName: "Snack Therapy Gym Membership Chocolate",
    id: "NC042",
    imageSrc: "/product-images/NC042.jpg",
    name: "Gym Chocolate",
    originalCategory: "chocolate",
    price: 86,
    regretScore: 70,
    searchKeywords: [
      "protein",
      "chocolate",
      "fitness"
    ],
    subcategory: "Protein Chocolate",
    subtitle: "Protein Chocolate made for tastes like unused subscription guilt",
    tag: "Protein Chocolate"
  },
  {
    availabilityStatus: "available",
    brandName: "Sugar Syllabus",
    calories: 719,
    categoryId: "chocolate",
    detailCopy: {
      description: "Built for living-room diplomacy and side-eye. Craving heard; cart drama can take a breath.",
      headline: "Cocoa Bomb cart case opened"
    },
    fullName: "Sugar Syllabus Family Group Cocoa Bomb",
    id: "NC043",
    imageSrc: "/product-images/NC043.jpg",
    name: "Family Cocoa",
    originalCategory: "chocolate",
    price: 103,
    regretScore: 73,
    searchKeywords: [
      "cocoa",
      "family",
      "whatsapp"
    ],
    subcategory: "Cocoa Bomb",
    subtitle: "Cocoa Bomb made for explodes like forwarded messages",
    tag: "Cocoa Bomb"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 184,
    categoryId: "chocolate",
    detailCopy: {
      description: "Built for soft launches, soft feelings and a calendar invite named quick break. Future you asks why Chocolate Stick needed governance.",
      headline: "Chocolate Stick cart case opened"
    },
    fullName: "Regret Foods Metro Rush Chocolate Stick",
    id: "NC044",
    imageSrc: "/product-images/NC044.jpg",
    name: "Metro Stick",
    originalCategory: "chocolate",
    price: 120,
    regretScore: 76,
    searchKeywords: [
      "chocolate",
      "metro",
      "commute"
    ],
    subcategory: "Chocolate Stick",
    subtitle: "Chocolate Stick made for portable comfort for standing passengers",
    tag: "Chocolate Stick"
  },
  {
    availabilityStatus: "available",
    brandName: "Guilt Free-ish",
    calories: 223,
    categoryId: "chocolate",
    detailCopy: {
      description: "Salary-week confidence, month-end consequences. Praline has made its case; future you requested a pause.",
      headline: "Praline urge logged"
    },
    fullName: "Guilt Free-ish Bonus Expected Praline",
    id: "NC045",
    imageSrc: "/product-images/NC045.jpg",
    name: "Bonus Praline",
    originalCategory: "chocolate",
    price: 137,
    regretScore: 76,
    searchKeywords: [
      "praline",
      "salary",
      "bonus"
    ],
    subcategory: "Praline",
    subtitle: "Praline made for premium until hr sends the mail",
    tag: "Praline"
  },
  {
    availabilityStatus: "available",
    brandName: "Emotional Damage",
    calories: 250,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy. Tagged under ice, cream and breakup; proceed with comedy, not autopilot.",
      headline: "Tub impulse brief"
    },
    fullName: "Emotional Damage Breakup Recovery Ice Cream Tub",
    id: "NC046",
    imageSrc: "/product-images/NC046.jpg",
    name: "Recovery Tub",
    originalCategory: "ice cream",
    price: 68,
    regretScore: 78,
    searchKeywords: [
      "ice",
      "cream",
      "breakup",
      "tub"
    ],
    subcategory: "Tub",
    subtitle: "Tub made for spoon sold separately, dignity not included",
    tag: "Tub"
  },
  {
    availabilityStatus: "available",
    brandName: "Chill Pending",
    calories: 284,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy.",
      headline: "Stick craving filed"
    },
    fullName: "Chill Pending Power Cut Kulfi Stick",
    id: "NC047",
    imageSrc: "/product-images/NC047.jpg",
    name: "Power Kulfi",
    originalCategory: "ice cream",
    price: 85,
    regretScore: 78,
    searchKeywords: [
      "kulfi",
      "power",
      "cut",
      "summer"
    ],
    subcategory: "Stick",
    subtitle: "Stick made for melts faster than patience",
    tag: "Stick"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 325,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy.",
      headline: "Cone craving filed"
    },
    fullName: "Weekend Unlimited Main Character Cone",
    id: "NC048",
    imageSrc: "/product-images/NC048.jpg",
    name: "Main Cone",
    originalCategory: "ice cream",
    price: 102,
    regretScore: 81,
    searchKeywords: [
      "ice",
      "cream",
      "cone",
      "aesthetic"
    ],
    subcategory: "Cone",
    subtitle: "Cone made for for walking to the fridge dramatically",
    tag: "Cone"
  },
  {
    availabilityStatus: "available",
    brandName: "Snack Therapy",
    calories: 375,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Hostel-room morale in one tiny decision. Self Control has opened a ticket.",
      headline: "Sandwich cart case opened"
    },
    fullName: "Snack Therapy Roommate Ate Mine Sandwich",
    id: "NC049",
    imageSrc: "/product-images/NC049.jpg",
    name: "Roommate Sandwich",
    originalCategory: "ice cream",
    price: 119,
    regretScore: 81,
    searchKeywords: [
      "ice",
      "cream",
      "sandwich",
      "hostel"
    ],
    subcategory: "Sandwich",
    subtitle: "Sandwich made for trust issues between two biscuits",
    tag: "Sandwich"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 413,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy. Craving heard; cart drama can take a breath.",
      headline: "Sundae temptation memo"
    },
    fullName: "Regret Foods Sunday Scaries Sundae",
    id: "NC050",
    imageSrc: "/product-images/NC050.jpg",
    name: "Scary Sundae",
    originalCategory: "ice cream",
    price: 136,
    regretScore: 84,
    searchKeywords: [
      "sundae",
      "sunday",
      "evening"
    ],
    subcategory: "Sundae",
    subtitle: "Sundae made for tastes like monday approaching",
    tag: "Sundae"
  },
  {
    availabilityStatus: "available",
    brandName: "Emotional Damage",
    calories: 459,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy. Tagged under mini, tub and lonely; proceed with comedy, not autopilot.",
      headline: "Mini Tub urge logged"
    },
    fullName: "Emotional Damage Single But Fine Mini Tub",
    id: "NC051",
    imageSrc: "/product-images/NC051.jpg",
    name: "Fine Tub",
    originalCategory: "ice cream",
    price: 153,
    regretScore: 83,
    searchKeywords: [
      "mini",
      "tub",
      "lonely",
      "snack"
    ],
    subcategory: "Mini Tub",
    subtitle: "Mini Tub made for fine means two scoops minimum",
    tag: "Mini Tub"
  },
  {
    availabilityStatus: "available",
    brandName: "Chill Pending",
    calories: 501,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for living-room diplomacy and side-eye.",
      headline: "Cassata craving filed"
    },
    fullName: "Chill Pending Family Function Cassata",
    id: "NC052",
    imageSrc: "/product-images/NC052.jpg",
    name: "Function Cassata",
    originalCategory: "ice cream",
    price: 170,
    regretScore: 83,
    searchKeywords: [
      "cassata",
      "family",
      "dinner"
    ],
    subcategory: "Cassata",
    subtitle: "Cassata made for three layers of relatives asking questions",
    tag: "Cassata"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 543,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy. Regret risk: 83/100; Self Control is observing.",
      headline: "Sorbet impulse brief"
    },
    fullName: "Weekend Unlimited Detox Lie Mango Sorbet",
    id: "NC053",
    imageSrc: "/product-images/NC053.jpg",
    name: "Detox Sorbet",
    originalCategory: "ice cream",
    price: 187,
    regretScore: 83,
    searchKeywords: [
      "sorbet",
      "mango",
      "diet"
    ],
    subcategory: "Sorbet",
    subtitle: "Sorbet made for fruit-adjacent emotional loophole",
    tag: "Sorbet"
  },
  {
    availabilityStatus: "available",
    brandName: "Snack Therapy",
    calories: 584,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Salary-week confidence, month-end consequences. Price pressure: Rs 204; the thumb committee gets one breath.",
      headline: "Choco Bar impulse brief"
    },
    fullName: "Snack Therapy Salary Day Choco Bar",
    id: "NC054",
    imageSrc: "/product-images/NC054.jpg",
    name: "Salary Bar",
    originalCategory: "ice cream",
    price: 204,
    regretScore: 86,
    searchKeywords: [
      "choco",
      "bar",
      "salary",
      "day"
    ],
    subcategory: "Choco Bar",
    subtitle: "Choco Bar made for luxury until bank balance refreshes",
    tag: "Choco Bar"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 629,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Arrives when just checking becomes cart research. Future you says: close the freezer tab and let the craving lose network.",
      headline: "Cup temptation memo"
    },
    fullName: "Regret Foods Exam Night Vanilla Cup",
    id: "NC055",
    imageSrc: "/product-images/NC055.jpg",
    name: "Exam Cup",
    originalCategory: "ice cream",
    price: 221,
    regretScore: 86,
    searchKeywords: [
      "vanilla",
      "cup",
      "study",
      "night"
    ],
    subcategory: "Cup",
    subtitle: "Cup made for plain flavour, complicated life",
    tag: "Cup"
  },
  {
    availabilityStatus: "available",
    brandName: "Emotional Damage",
    calories: 668,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy. Self Control has opened a ticket.",
      headline: "Gelato cart case opened"
    },
    fullName: "Emotional Damage Bandra Mood Gelato",
    id: "NC056",
    imageSrc: "/product-images/NC056.jpg",
    name: "Bandra Gelato",
    originalCategory: "ice cream",
    price: 238,
    regretScore: 83,
    searchKeywords: [
      "gelato",
      "city",
      "aesthetic"
    ],
    subcategory: "Gelato",
    subtitle: "Gelato made for rent too high, dessert too small",
    tag: "Gelato"
  },
  {
    availabilityStatus: "available",
    brandName: "Chill Pending",
    calories: 717,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy.",
      headline: "Falooda craving filed"
    },
    fullName: "Chill Pending Shaadi Cancelled Falooda",
    id: "NC057",
    imageSrc: "/product-images/NC057.jpg",
    name: "Cancelled Falooda",
    originalCategory: "ice cream",
    price: 255,
    regretScore: 86,
    searchKeywords: [
      "falooda",
      "wedding",
      "drama"
    ],
    subcategory: "Falooda",
    subtitle: "Falooda made for celebration without relatives",
    tag: "Falooda"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 758,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy. Craving heard; cart drama can take a breath.",
      headline: "Ice Pop cart case opened"
    },
    fullName: "Weekend Unlimited Traffic Signal Ice Pop",
    id: "NC058",
    imageSrc: "/product-images/NC058.jpg",
    name: "Signal Pop",
    originalCategory: "ice cream",
    price: 272,
    regretScore: 86,
    searchKeywords: [
      "ice",
      "pop",
      "traffic",
      "summer"
    ],
    subcategory: "Ice Pop",
    subtitle: "Ice Pop made for red light, cold coping",
    tag: "Ice Pop"
  },
  {
    availabilityStatus: "available",
    brandName: "Snack Therapy",
    calories: 804,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy.",
      headline: "Cookie Tub craving filed"
    },
    fullName: "Snack Therapy Crumbs Of Hope Cookie Tub",
    id: "NC059",
    imageSrc: "/product-images/NC059.jpg",
    name: "Hope Tub",
    originalCategory: "ice cream",
    price: 289,
    regretScore: 86,
    searchKeywords: [
      "cookie",
      "ice",
      "cream",
      "hope"
    ],
    subcategory: "Cookie Tub",
    subtitle: "Cookie Tub made for hope is mostly cookie pieces",
    tag: "Cookie Tub"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 847,
    categoryId: "ice-cream",
    detailCopy: {
      description: "Built for hostel freezer diplomacy, post-meeting silence and spoon-based strategy. Future you says: close the freezer tab and let the craving lose network.",
      headline: "Matka Kulfi temptation memo"
    },
    fullName: "Regret Foods Nani Approved Matka Kulfi",
    id: "NC060",
    imageSrc: "/product-images/NC060.jpg",
    name: "Nani Kulfi",
    originalCategory: "ice cream",
    price: 65,
    regretScore: 81,
    searchKeywords: [
      "matka",
      "kulfi",
      "nostalgia"
    ],
    subcategory: "Matka Kulfi",
    subtitle: "Matka Kulfi made for emotional blackmail in frozen form",
    tag: "Matka Kulfi"
  },
  {
    availabilityStatus: "available",
    brandName: "Hostel Heroes",
    calories: 308,
    categoryId: "instant-food",
    detailCopy: {
      description: "Built for two-minute ambition, exam season bargaining and dinner that forgot to become dinner. Price pressure: Rs 37; the thumb committee gets one breath.",
      headline: "Noodles impulse brief"
    },
    fullName: "Hostel Heroes Sunday Evening Panic Noodles",
    id: "NC061",
    imageSrc: "/product-images/NC061.jpg",
    name: "Panic Noodles",
    originalCategory: "instant food",
    price: 37,
    regretScore: 77,
    searchKeywords: [
      "instant",
      "noodles",
      "sunday",
      "fear"
    ],
    subcategory: "Noodles",
    subtitle: "Noodles made for two minutes plus existential dread",
    tag: "Noodles"
  },
  {
    availabilityStatus: "available",
    brandName: "Panic Pantry",
    calories: 357,
    categoryId: "instant-food",
    detailCopy: {
      description: "Hostel-room morale in one tiny decision.",
      headline: "Cup Noodles craving filed"
    },
    fullName: "Panic Pantry Hostel Borrowed Kettle Cup Noodles",
    id: "NC062",
    imageSrc: "/product-images/NC062.jpg",
    name: "Kettle Noodles",
    originalCategory: "instant food",
    price: 54,
    regretScore: 77,
    searchKeywords: [
      "cup",
      "noodles",
      "hostel"
    ],
    subcategory: "Cup Noodles",
    subtitle: "Cup Noodles made for requires water and social negotiation",
    tag: "Cup Noodles"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 392,
    categoryId: "instant-food",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Self Control has opened a ticket.",
      headline: "Pasta Cup cart case opened"
    },
    fullName: "Regret Foods Deadline Alfredo Pasta Cup",
    id: "NC063",
    imageSrc: "/product-images/NC063.jpg",
    name: "Deadline Pasta",
    originalCategory: "instant food",
    price: 71,
    regretScore: 80,
    searchKeywords: [
      "instant",
      "pasta",
      "office"
    ],
    subcategory: "Pasta Cup",
    subtitle: "Pasta Cup made for creamy escape from deliverables",
    tag: "Pasta Cup"
  },
  {
    availabilityStatus: "available",
    brandName: "BhookBoss",
    calories: 429,
    categoryId: "instant-food",
    detailCopy: {
      description: "Built for two-minute ambition, exam season bargaining and dinner that forgot to become dinner. Tagged under instant, poha and morning; proceed with comedy, not autopilot.",
      headline: "Poha Cup impulse brief"
    },
    fullName: "BhookBoss 9AM Standup Poha Cup",
    id: "NC064",
    imageSrc: "/product-images/NC064.jpg",
    name: "Standup Poha",
    originalCategory: "instant food",
    price: 88,
    regretScore: 74,
    searchKeywords: [
      "instant",
      "poha",
      "morning"
    ],
    subcategory: "Poha Cup",
    subtitle: "Poha Cup made for breakfast for cameras-off professionals",
    tag: "Poha Cup"
  },
  {
    availabilityStatus: "available",
    brandName: "Sleep Later Co",
    calories: 478,
    categoryId: "instant-food",
    detailCopy: {
      description: "Looks like adulting. Behaves like impulse.",
      headline: "Upma Cup craving filed"
    },
    fullName: "Sleep Later Co Responsible Adult Upma Cup",
    id: "NC065",
    imageSrc: "/product-images/NC065.jpg",
    name: "Adult Upma",
    originalCategory: "instant food",
    price: 105,
    regretScore: 77,
    searchKeywords: [
      "instant",
      "upma",
      "adulting"
    ],
    subcategory: "Upma Cup",
    subtitle: "Upma Cup made for tastes like trying your best",
    tag: "Upma Cup"
  },
  {
    availabilityStatus: "available",
    brandName: "Hostel Heroes",
    calories: 515,
    categoryId: "instant-food",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Future you asks why Soup needed governance.",
      headline: "Soup cart case opened"
    },
    fullName: "Hostel Heroes Sad Desk Tomato Soup",
    id: "NC066",
    imageSrc: "/product-images/NC066.jpg",
    name: "Desk Soup",
    originalCategory: "instant food",
    price: 122,
    regretScore: 77,
    searchKeywords: [
      "instant",
      "soup",
      "work"
    ],
    subcategory: "Soup",
    subtitle: "Soup made for for keyboards that have seen things",
    tag: "Soup"
  },
  {
    availabilityStatus: "available",
    brandName: "Panic Pantry",
    calories: 560,
    categoryId: "instant-food",
    detailCopy: {
      description: "Built for two-minute ambition, exam season bargaining and dinner that forgot to become dinner. Rice Bowl has made its case; future you requested a pause.",
      headline: "Rice Bowl urge logged"
    },
    fullName: "Panic Pantry No Groceries Rice Bowl",
    id: "NC067",
    imageSrc: "/product-images/NC067.jpg",
    name: "No Grocery Bowl",
    originalCategory: "instant food",
    price: 139,
    regretScore: 80,
    searchKeywords: [
      "rice",
      "bowl",
      "lazy",
      "dinner"
    ],
    subcategory: "Rice Bowl",
    subtitle: "Rice Bowl made for when your fridge becomes a museum",
    tag: "Rice Bowl"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 608,
    categoryId: "instant-food",
    detailCopy: {
      description: "Built for two-minute ambition, exam season bargaining and dinner that forgot to become dinner.",
      headline: "Khichdi Cup craving filed"
    },
    fullName: "Regret Foods Stomach Apology Khichdi Cup",
    id: "NC068",
    imageSrc: "/product-images/NC068.jpg",
    name: "Apology Khichdi",
    originalCategory: "instant food",
    price: 156,
    regretScore: 82,
    searchKeywords: [
      "khichdi",
      "comfort"
    ],
    subcategory: "Khichdi Cup",
    subtitle: "Khichdi Cup made for a peace offering to your digestion",
    tag: "Khichdi Cup"
  },
  {
    availabilityStatus: "available",
    brandName: "BhookBoss",
    calories: 644,
    categoryId: "instant-food",
    detailCopy: {
      description: "Built for two-minute ambition, exam season bargaining and dinner that forgot to become dinner. Craving heard; cart drama can take a breath.",
      headline: "Mac Cup cart case opened"
    },
    fullName: "BhookBoss Gourmet Mac Cup",
    id: "NC069",
    imageSrc: "/product-images/NC069.jpg",
    name: "Gourmet Mac",
    originalCategory: "instant food",
    price: 173,
    regretScore: 79,
    searchKeywords: [
      "mac",
      "cheese",
      "instant"
    ],
    subcategory: "Mac Cup",
    subtitle: "Mac Cup made for five-star energy, hostel utensils",
    tag: "Mac Cup"
  },
  {
    availabilityStatus: "available",
    brandName: "Sleep Later Co",
    calories: 693,
    categoryId: "instant-food",
    detailCopy: {
      description: "Built for two-minute ambition, exam season bargaining and dinner that forgot to become dinner. Oats Cup has made its case; future you requested a pause.",
      headline: "Oats Cup impulse brief"
    },
    fullName: "Sleep Later Co Fitness Reboot Masala Oats",
    id: "NC070",
    imageSrc: "/product-images/NC070.jpg",
    name: "Reboot Oats",
    originalCategory: "instant food",
    price: 35,
    regretScore: 74,
    searchKeywords: [
      "masala",
      "oats",
      "fitness"
    ],
    subcategory: "Oats Cup",
    subtitle: "Oats Cup made for reset button with masala",
    tag: "Oats Cup"
  },
  {
    availabilityStatus: "available",
    brandName: "Hostel Heroes",
    calories: 729,
    categoryId: "instant-food",
    detailCopy: {
      description: "Built for two-minute ambition, exam season bargaining and dinner that forgot to become dinner. Future you asks why Momo Soup needed governance.",
      headline: "Momo Soup temptation memo"
    },
    fullName: "Hostel Heroes Rainy Day Momo Soup",
    id: "NC071",
    imageSrc: "/product-images/NC071.jpg",
    name: "Momo Soup",
    originalCategory: "instant food",
    price: 52,
    regretScore: 74,
    searchKeywords: [
      "momo",
      "soup",
      "rain"
    ],
    subcategory: "Momo Soup",
    subtitle: "Momo Soup made for cloudy weather in a cup",
    tag: "Momo Soup"
  },
  {
    availabilityStatus: "available",
    brandName: "Panic Pantry",
    calories: 770,
    categoryId: "instant-food",
    detailCopy: {
      description: "Built for two-minute ambition, exam season bargaining and dinner that forgot to become dinner. Price pressure: Rs 69; the thumb committee gets one breath.",
      headline: "Dosa Mix urge logged"
    },
    fullName: "Panic Pantry Ambition Dosa Mix",
    id: "NC072",
    imageSrc: "/product-images/NC072.jpg",
    name: "Ambition Dosa",
    originalCategory: "instant food",
    price: 69,
    regretScore: 77,
    searchKeywords: [
      "dosa",
      "mix",
      "breakfast"
    ],
    subcategory: "Dosa Mix",
    subtitle: "Dosa Mix made for for people with pan confidence",
    tag: "Dosa Mix"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 824,
    categoryId: "instant-food",
    detailCopy: {
      description: "Hostel-room morale in one tiny decision. Future you says: future you requests a meal plan with fewer plot twists.",
      headline: "Paratha Mix cart case opened"
    },
    fullName: "Regret Foods Last Clean Plate Paratha Mix",
    id: "NC073",
    imageSrc: "/product-images/NC073.jpg",
    name: "Plate Paratha",
    originalCategory: "instant food",
    price: 86,
    regretScore: 80,
    searchKeywords: [
      "paratha",
      "mix",
      "hostel"
    ],
    subcategory: "Paratha Mix",
    subtitle: "Paratha Mix made for utensil crisis management",
    tag: "Paratha Mix"
  },
  {
    availabilityStatus: "available",
    brandName: "BhookBoss",
    calories: 864,
    categoryId: "instant-food",
    detailCopy: {
      description: "Arrives when just checking becomes cart research.",
      headline: "Ramen Bowl craving filed"
    },
    fullName: "BhookBoss Main Character Ramen Bowl",
    id: "NC074",
    imageSrc: "/product-images/NC074.jpg",
    name: "Main Ramen",
    originalCategory: "instant food",
    price: 103,
    regretScore: 77,
    searchKeywords: [
      "ramen",
      "late",
      "night"
    ],
    subcategory: "Ramen Bowl",
    subtitle: "Ramen Bowl made for for dramatic eating near windows",
    tag: "Ramen Bowl"
  },
  {
    availabilityStatus: "available",
    brandName: "Sleep Later Co",
    calories: 905,
    categoryId: "instant-food",
    detailCopy: {
      description: "Salary-week confidence, month-end consequences. Regret risk: 80/100; Self Control is observing.",
      headline: "Biryani Cup impulse brief"
    },
    fullName: "Sleep Later Co Salary Over Biryani Cup",
    id: "NC075",
    imageSrc: "/product-images/NC075.jpg",
    name: "Budget Biryani",
    originalCategory: "instant food",
    price: 120,
    regretScore: 80,
    searchKeywords: [
      "biryani",
      "cup",
      "month",
      "end"
    ],
    subcategory: "Biryani Cup",
    subtitle: "Biryani Cup made for biryani feelings, cup budget",
    tag: "Biryani Cup"
  },
  {
    availabilityStatus: "available",
    brandName: "Snack Therapy",
    calories: 186,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review. Craving heard; cart drama can take a breath.",
      headline: "Brownie temptation memo"
    },
    fullName: "Snack Therapy Last Chapter Brownie Bites",
    id: "NC076",
    imageSrc: "/product-images/NC076.jpg",
    name: "Brownie Bites",
    originalCategory: "bakery",
    price: 41,
    regretScore: 67,
    searchKeywords: [
      "brownie",
      "study",
      "stress"
    ],
    subcategory: "Brownie",
    subtitle: "Brownie made for exam prep but make it fudgy",
    tag: "Brownie"
  },
  {
    availabilityStatus: "available",
    brandName: "Sugar Syllabus",
    calories: 223,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review. Tagged under croissant, luxury and budget; proceed with comedy, not autopilot.",
      headline: "Croissant urge logged"
    },
    fullName: "Sugar Syllabus Paris Croissant",
    id: "NC077",
    imageSrc: "/product-images/NC077.jpg",
    name: "Paris Croissant",
    originalCategory: "bakery",
    price: 58,
    regretScore: 64,
    searchKeywords: [
      "croissant",
      "luxury",
      "budget"
    ],
    subcategory: "Croissant",
    subtitle: "Croissant made for passport not required, delusion included",
    tag: "Croissant"
  },
  {
    availabilityStatus: "available",
    brandName: "Office Escape",
    calories: 273,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review. Self Control has opened a ticket.",
      headline: "Garlic Bread cart case opened"
    },
    fullName: "Office Escape Date Cancelled Garlic Bread",
    id: "NC078",
    imageSrc: "/product-images/NC078.jpg",
    name: "Cancelled Bread",
    originalCategory: "bakery",
    price: 75,
    regretScore: 64,
    searchKeywords: [
      "garlic",
      "bread",
      "date",
      "cancelled"
    ],
    subcategory: "Garlic Bread",
    subtitle: "Garlic Bread made for at least garlic showed up",
    tag: "Garlic Bread"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 312,
    categoryId: "bakery",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences.",
      headline: "Muffin craving filed"
    },
    fullName: "Weekend Unlimited Meeting Could Be Muffin",
    id: "NC079",
    imageSrc: "/product-images/NC079.jpg",
    name: "Meeting Muffin",
    originalCategory: "bakery",
    price: 92,
    regretScore: 67,
    searchKeywords: [
      "muffin",
      "office",
      "meeting"
    ],
    subcategory: "Muffin",
    subtitle: "Muffin made for soft, sweet, and more useful than agenda",
    tag: "Muffin"
  },
  {
    availabilityStatus: "available",
    brandName: "Adulting Dept",
    calories: 353,
    categoryId: "bakery",
    detailCopy: {
      description: "Salary-week confidence, month-end consequences. Regret risk: 70/100; Self Control is observing.",
      headline: "Donut impulse brief"
    },
    fullName: "Adulting Dept Salary Credited Donut",
    id: "NC080",
    imageSrc: "/product-images/NC080.jpg",
    name: "Salary Donut",
    originalCategory: "bakery",
    price: 109,
    regretScore: 70,
    searchKeywords: [
      "donut",
      "salary",
      "day"
    ],
    subcategory: "Donut",
    subtitle: "Donut made for circular like your spending habits",
    tag: "Donut"
  },
  {
    availabilityStatus: "available",
    brandName: "Snack Therapy",
    calories: 397,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review.",
      headline: "Cupcake craving filed"
    },
    fullName: "Snack Therapy People Pleaser Cupcake",
    id: "NC081",
    imageSrc: "/product-images/NC081.jpg",
    name: "Pleaser Cupcake",
    originalCategory: "bakery",
    price: 126,
    regretScore: 67,
    searchKeywords: [
      "cupcake",
      "social",
      "anxiety"
    ],
    subcategory: "Cupcake",
    subtitle: "Cupcake made for says yes before you do",
    tag: "Cupcake"
  },
  {
    availabilityStatus: "available",
    brandName: "Sugar Syllabus",
    calories: 445,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review. Tagged under banana, bread and weekend; proceed with comedy, not autopilot.",
      headline: "Banana Bread urge logged"
    },
    fullName: "Sugar Syllabus Overripe Plans Banana Bread",
    id: "NC082",
    imageSrc: "/product-images/NC082.jpg",
    name: "Plans Bread",
    originalCategory: "bakery",
    price: 143,
    regretScore: 67,
    searchKeywords: [
      "banana",
      "bread",
      "weekend"
    ],
    subcategory: "Banana Bread",
    subtitle: "Banana Bread made for for plans you ignored beautifully",
    tag: "Banana Bread"
  },
  {
    availabilityStatus: "available",
    brandName: "Office Escape",
    calories: 483,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review. Craving heard; cart drama can take a breath.",
      headline: "Cookie temptation memo"
    },
    fullName: "Office Escape Browser History Cookie",
    id: "NC083",
    imageSrc: "/product-images/NC083.jpg",
    name: "History Cookie",
    originalCategory: "bakery",
    price: 160,
    regretScore: 72,
    searchKeywords: [
      "cookie",
      "doomscroll"
    ],
    subcategory: "Cookie",
    subtitle: "Cookie made for accept all cravings",
    tag: "Cookie"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 525,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review.",
      headline: "Pav craving filed"
    },
    fullName: "Weekend Unlimited Mumbai Local Pav Pack",
    id: "NC084",
    imageSrc: "/product-images/NC084.jpg",
    name: "Local Pav",
    originalCategory: "bakery",
    price: 177,
    regretScore: 69,
    searchKeywords: [
      "pav",
      "commute",
      "snack"
    ],
    subcategory: "Pav",
    subtitle: "Pav made for soft landing after a hard commute",
    tag: "Pav"
  },
  {
    availabilityStatus: "available",
    brandName: "Adulting Dept",
    calories: 575,
    categoryId: "bakery",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Self Control has opened a ticket.",
      headline: "Cake Slice cart case opened"
    },
    fullName: "Adulting Dept Promotion Pending Cake Slice",
    id: "NC085",
    imageSrc: "/product-images/NC085.jpg",
    name: "Pending Cake",
    originalCategory: "bakery",
    price: 194,
    regretScore: 69,
    searchKeywords: [
      "cake",
      "promotion",
      "office"
    ],
    subcategory: "Cake Slice",
    subtitle: "Cake Slice made for celebration held in draft mode",
    tag: "Cake Slice"
  },
  {
    availabilityStatus: "available",
    brandName: "Snack Therapy",
    calories: 612,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review. Future you says: future you requests a softer landing than a midnight pastry subplot.",
      headline: "Cheese Bun temptation memo"
    },
    fullName: "Snack Therapy Traffic Jam Cheese Bun",
    id: "NC086",
    imageSrc: "/product-images/NC086.jpg",
    name: "Jam Bun",
    originalCategory: "bakery",
    price: 211,
    regretScore: 69,
    searchKeywords: [
      "cheese",
      "bun",
      "traffic"
    ],
    subcategory: "Cheese Bun",
    subtitle: "Cheese Bun made for stationary but emotionally moving",
    tag: "Cheese Bun"
  },
  {
    availabilityStatus: "available",
    brandName: "Sugar Syllabus",
    calories: 650,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review. Price pressure: Rs 228; the thumb committee gets one breath.",
      headline: "Rusk impulse brief"
    },
    fullName: "Sugar Syllabus Nani Biscuit Rusk",
    id: "NC087",
    imageSrc: "/product-images/NC087.jpg",
    name: "Nani Rusk",
    originalCategory: "bakery",
    price: 228,
    regretScore: 69,
    searchKeywords: [
      "rusk",
      "tea",
      "nostalgia"
    ],
    subcategory: "Rusk",
    subtitle: "Rusk made for approved by every steel dabba",
    tag: "Rusk"
  },
  {
    availabilityStatus: "available",
    brandName: "Office Escape",
    calories: 700,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review. Future you asks why Waffle needed governance.",
      headline: "Waffle cart case opened"
    },
    fullName: "Office Escape Influencer Brunch Waffle",
    id: "NC088",
    imageSrc: "/product-images/NC088.jpg",
    name: "Brunch Waffle",
    originalCategory: "bakery",
    price: 245,
    regretScore: 69,
    searchKeywords: [
      "waffle",
      "brunch",
      "aesthetic"
    ],
    subcategory: "Waffle",
    subtitle: "Waffle made for looks expensive from top angle",
    tag: "Waffle"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 743,
    categoryId: "bakery",
    detailCopy: {
      description: "Hostel-room morale in one tiny decision. Puff has made its case; future you requested a pause.",
      headline: "Puff urge logged"
    },
    fullName: "Weekend Unlimited College Canteen Veg Puff",
    id: "NC089",
    imageSrc: "/product-images/NC089.jpg",
    name: "Canteen Puff",
    originalCategory: "bakery",
    price: 47,
    regretScore: 64,
    searchKeywords: [
      "veg",
      "puff",
      "college"
    ],
    subcategory: "Puff",
    subtitle: "Puff made for flaky like attendance promises",
    tag: "Puff"
  },
  {
    availabilityStatus: "available",
    brandName: "Adulting Dept",
    calories: 785,
    categoryId: "bakery",
    detailCopy: {
      description: "Built for butter logic, college canteen nostalgia and one unread performance review. Craving heard; cart drama can take a breath.",
      headline: "Cinnamon Roll temptation memo"
    },
    fullName: "Adulting Dept Soft Life Cinnamon Roll",
    id: "NC090",
    imageSrc: "/product-images/NC090.jpg",
    name: "Soft Roll",
    originalCategory: "bakery",
    price: 64,
    regretScore: 64,
    searchKeywords: [
      "cinnamon",
      "roll",
      "comfort"
    ],
    subcategory: "Cinnamon Roll",
    subtitle: "Cinnamon Roll made for for people scheduling rest as a task",
    tag: "Cinnamon Roll"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 266,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Hostel-room morale in one tiny decision. Tagged under momos, frozen and hostel; proceed with comedy, not autopilot.",
      headline: "Momos urge logged"
    },
    fullName: "Regret Foods Frozen Group Project Momos",
    id: "NC091",
    imageSrc: "/product-images/NC091.jpg",
    name: "Project Momos",
    originalCategory: "frozen snack",
    price: 92,
    regretScore: 82,
    searchKeywords: [
      "momos",
      "frozen",
      "hostel"
    ],
    subcategory: "Momos",
    subtitle: "Momos made for everyone contributes chutney opinions",
    tag: "Momos"
  },
  {
    availabilityStatus: "available",
    brandName: "Hostel Heroes",
    calories: 308,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors.",
      headline: "Fries craving filed"
    },
    fullName: "Hostel Heroes Quarter Life Crisis Fries",
    id: "NC092",
    imageSrc: "/product-images/NC092.jpg",
    name: "Crisis Fries",
    originalCategory: "frozen snack",
    price: 109,
    regretScore: 85,
    searchKeywords: [
      "fries",
      "frozen",
      "stress"
    ],
    subcategory: "Fries",
    subtitle: "Fries made for crispy outside, confused inside",
    tag: "Fries"
  },
  {
    availabilityStatus: "available",
    brandName: "Midnight Mandali",
    calories: 346,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors. Regret risk: 82/100; Self Control is observing.",
      headline: "Nuggets impulse brief"
    },
    fullName: "Midnight Mandali Protein Nuggets",
    id: "NC093",
    imageSrc: "/product-images/NC093.jpg",
    name: "Protein Nuggets",
    originalCategory: "frozen snack",
    price: 126,
    regretScore: 82,
    searchKeywords: [
      "nuggets",
      "frozen",
      "gym"
    ],
    subcategory: "Nuggets",
    subtitle: "Nuggets made for gym-adjacent if you squint",
    tag: "Nuggets"
  },
  {
    availabilityStatus: "available",
    brandName: "BhookBoss",
    calories: 393,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors. Price pressure: Rs 143; the thumb committee gets one breath.",
      headline: "Spring Rolls urge logged"
    },
    fullName: "BhookBoss House Party Spring Rolls",
    id: "NC094",
    imageSrc: "/product-images/NC094.jpg",
    name: "Party Rolls",
    originalCategory: "frozen snack",
    price: 143,
    regretScore: 79,
    searchKeywords: [
      "spring",
      "rolls",
      "party",
      "snack"
    ],
    subcategory: "Spring Rolls",
    subtitle: "Spring Rolls made for for guests who arrive hungry and judge silently",
    tag: "Spring Rolls"
  },
  {
    availabilityStatus: "available",
    brandName: "Panic Pantry",
    calories: 435,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors. Future you says: the freezer can wait; your future self has bandwidth constraints.",
      headline: "Pizza Pockets cart case opened"
    },
    fullName: "Panic Pantry Rent Week Pizza Pockets",
    id: "NC095",
    imageSrc: "/product-images/NC095.jpg",
    name: "Rent Pockets",
    originalCategory: "frozen snack",
    price: 160,
    regretScore: 84,
    searchKeywords: [
      "pizza",
      "pockets",
      "budget"
    ],
    subcategory: "Pizza Pockets",
    subtitle: "Pizza Pockets made for pizza feelings in emi format",
    tag: "Pizza Pockets"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 480,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Cheese Balls has made its case; future you requested a pause.",
      headline: "Cheese Balls impulse brief"
    },
    fullName: "Regret Foods Unread Email Cheese Balls",
    id: "NC096",
    imageSrc: "/product-images/NC096.jpg",
    name: "Email Balls",
    originalCategory: "frozen snack",
    price: 177,
    regretScore: 84,
    searchKeywords: [
      "cheese",
      "balls",
      "office"
    ],
    subcategory: "Cheese Balls",
    subtitle: "Cheese Balls made for inbox zero is a myth",
    tag: "Cheese Balls"
  },
  {
    availabilityStatus: "available",
    brandName: "Hostel Heroes",
    calories: 519,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors. Future you asks why Kebab needed governance.",
      headline: "Kebab temptation memo"
    },
    fullName: "Hostel Heroes Balcony Kebab Skewers",
    id: "NC097",
    imageSrc: "/product-images/NC097.jpg",
    name: "Balcony Kebab",
    originalCategory: "frozen snack",
    price: 194,
    regretScore: 81,
    searchKeywords: [
      "kebab",
      "frozen",
      "evening"
    ],
    subcategory: "Kebab",
    subtitle: "Kebab made for restaurant vibes near drying clothes",
    tag: "Kebab"
  },
  {
    availabilityStatus: "available",
    brandName: "Midnight Mandali",
    calories: 564,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors. Craving heard; cart drama can take a breath.",
      headline: "Samosa cart case opened"
    },
    fullName: "Midnight Mandali Emergency Guest Samosas",
    id: "NC098",
    imageSrc: "/product-images/NC098.jpg",
    name: "Guest Samosa",
    originalCategory: "frozen snack",
    price: 211,
    regretScore: 84,
    searchKeywords: [
      "samosa",
      "frozen",
      "guests"
    ],
    subcategory: "Samosa",
    subtitle: "Samosa made for because relatives give no eta",
    tag: "Samosa"
  },
  {
    availabilityStatus: "available",
    brandName: "BhookBoss",
    calories: 613,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors.",
      headline: "Garlic Pops craving filed"
    },
    fullName: "BhookBoss Vampire Cancelled Garlic Pops",
    id: "NC099",
    imageSrc: "/product-images/NC099.jpg",
    name: "Garlic Pops",
    originalCategory: "frozen snack",
    price: 228,
    regretScore: 81,
    searchKeywords: [
      "garlic",
      "pops",
      "snack"
    ],
    subcategory: "Garlic Pops",
    subtitle: "Garlic Pops made for social distancing by flavour",
    tag: "Garlic Pops"
  },
  {
    availabilityStatus: "available",
    brandName: "Panic Pantry",
    calories: 653,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors.",
      headline: "Paneer Tikka craving filed"
    },
    fullName: "Panic Pantry Barbecue Paneer Tikka",
    id: "NC100",
    imageSrc: "/product-images/NC100.jpg",
    name: "BBQ Paneer",
    originalCategory: "frozen snack",
    price: 245,
    regretScore: 84,
    searchKeywords: [
      "paneer",
      "tikka",
      "frozen"
    ],
    subcategory: "Paneer Tikka",
    subtitle: "Paneer Tikka made for smoke alarm optional",
    tag: "Paneer Tikka"
  },
  {
    availabilityStatus: "available",
    brandName: "Regret Foods",
    calories: 691,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors. Regret risk: 87/100; Self Control is observing.",
      headline: "Cutlets impulse brief"
    },
    fullName: "Regret Foods Tiffin Memory Cutlets",
    id: "NC101",
    imageSrc: "/product-images/NC101.jpg",
    name: "Memory Cutlets",
    originalCategory: "frozen snack",
    price: 262,
    regretScore: 87,
    searchKeywords: [
      "cutlet",
      "nostalgia"
    ],
    subcategory: "Cutlets",
    subtitle: "Cutlets made for school lunch flashback with adult bills",
    tag: "Cutlets"
  },
  {
    availabilityStatus: "available",
    brandName: "Hostel Heroes",
    calories: 731,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors. Craving heard; cart drama can take a breath.",
      headline: "Corn Bites temptation memo"
    },
    fullName: "Hostel Heroes Monsoon Corn Bites",
    id: "NC102",
    imageSrc: "/product-images/NC102.jpg",
    name: "Monsoon Corn",
    originalCategory: "frozen snack",
    price: 279,
    regretScore: 84,
    searchKeywords: [
      "corn",
      "bites",
      "rain"
    ],
    subcategory: "Corn Bites",
    subtitle: "Corn Bites made for rain demanded something crispy",
    tag: "Corn Bites"
  },
  {
    availabilityStatus: "available",
    brandName: "Midnight Mandali",
    calories: 774,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors. Tagged under hash, brown and breakfast; proceed with comedy, not autopilot.",
      headline: "Hash Browns urge logged"
    },
    fullName: "Midnight Mandali Monday Hash Browns",
    id: "NC103",
    imageSrc: "/product-images/NC103.jpg",
    name: "Monday Hash",
    originalCategory: "frozen snack",
    price: 296,
    regretScore: 87,
    searchKeywords: [
      "hash",
      "brown",
      "breakfast"
    ],
    subcategory: "Hash Browns",
    subtitle: "Hash Browns made for crispy denial before login",
    tag: "Hash Browns"
  },
  {
    availabilityStatus: "available",
    brandName: "BhookBoss",
    calories: 826,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors. Self Control has opened a ticket.",
      headline: "Nacho Bites cart case opened"
    },
    fullName: "BhookBoss Movie Buffering Nacho Bites",
    id: "NC104",
    imageSrc: "/product-images/NC104.jpg",
    name: "Buffer Bites",
    originalCategory: "frozen snack",
    price: 313,
    regretScore: 84,
    searchKeywords: [
      "nacho",
      "bites",
      "movie"
    ],
    subcategory: "Nacho Bites",
    subtitle: "Nacho Bites made for for loading screens and loud opinions",
    tag: "Nacho Bites"
  },
  {
    availabilityStatus: "available",
    brandName: "Panic Pantry",
    calories: 869,
    categoryId: "frozen-snacks",
    detailCopy: {
      description: "Built for freezer raids, IPL overs and group project survivors.",
      headline: "Stuffed Kulcha craving filed"
    },
    fullName: "Panic Pantry North Indian Freezer Kulcha",
    id: "NC105",
    imageSrc: "/product-images/NC105.jpg",
    name: "Freezer Kulcha",
    originalCategory: "frozen snack",
    price: 330,
    regretScore: 87,
    searchKeywords: [
      "kulcha",
      "frozen",
      "dinner"
    ],
    subcategory: "Stuffed Kulcha",
    subtitle: "Stuffed Kulcha made for dhabha fantasy from a freezer drawer",
    tag: "Stuffed Kulcha"
  },
  {
    availabilityStatus: "available",
    brandName: "Guilt Free-ish",
    calories: 201,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Price pressure: Rs 46; the thumb committee gets one breath.",
      headline: "Cereal impulse brief"
    },
    fullName: "Guilt Free-ish Healthy Monday Cereal",
    id: "NC106",
    imageSrc: "/product-images/NC106.jpg",
    name: "Monday Cereal",
    originalCategory: "breakfast",
    price: 46,
    regretScore: 63,
    searchKeywords: [
      "cereal",
      "healthy",
      "monday"
    ],
    subcategory: "Cereal",
    subtitle: "Cereal made for bought for discipline, eaten at 1am",
    tag: "Cereal"
  },
  {
    availabilityStatus: "available",
    brandName: "Adulting Dept",
    calories: 248,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Future you says: tomorrow you deserves breakfast, not a plot twist.",
      headline: "Granola temptation memo"
    },
    fullName: "Adulting Dept Influencer Granola Crunch",
    id: "NC107",
    imageSrc: "/product-images/NC107.jpg",
    name: "Granola Crunch",
    originalCategory: "breakfast",
    price: 63,
    regretScore: 63,
    searchKeywords: [
      "granola",
      "aesthetic",
      "breakfast"
    ],
    subcategory: "Granola",
    subtitle: "Granola made for looks like rent in a bowl",
    tag: "Granola"
  },
  {
    availabilityStatus: "available",
    brandName: "Panic Pantry",
    calories: 295,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Protein Bar has made its case; future you requested a pause.",
      headline: "Protein Bar urge logged"
    },
    fullName: "Panic Pantry Gym Bag Forgotten Protein Bar",
    id: "NC108",
    imageSrc: "/product-images/NC108.jpg",
    name: "Forgotten Bar",
    originalCategory: "breakfast",
    price: 80,
    regretScore: 66,
    searchKeywords: [
      "protein",
      "bar",
      "gym",
      "bag"
    ],
    subcategory: "Protein Bar",
    subtitle: "Protein Bar made for expired motivation flavour",
    tag: "Protein Bar"
  },
  {
    availabilityStatus: "available",
    brandName: "Office Escape",
    calories: 327,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Future you asks why Oats needed governance.",
      headline: "Oats cart case opened"
    },
    fullName: "Office Escape Plain Sadness Oats",
    id: "NC109",
    imageSrc: "/product-images/NC109.jpg",
    name: "Sad Oats",
    originalCategory: "breakfast",
    price: 97,
    regretScore: 66,
    searchKeywords: [
      "oats",
      "breakfast",
      "diet"
    ],
    subcategory: "Oats",
    subtitle: "Oats made for for people punishing themselves politely",
    tag: "Oats"
  },
  {
    availabilityStatus: "available",
    brandName: "Sasta Luxury",
    calories: 378,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance.",
      headline: "Cornflakes craving filed"
    },
    fullName: "Sasta Luxury Bachelor Dinner Cornflakes",
    id: "NC110",
    imageSrc: "/product-images/NC110.jpg",
    name: "Dinner Flakes",
    originalCategory: "breakfast",
    price: 114,
    regretScore: 66,
    searchKeywords: [
      "cornflakes",
      "bachelor",
      "dinner"
    ],
    subcategory: "Cornflakes",
    subtitle: "Cornflakes made for breakfast at night because rules collapsed",
    tag: "Cornflakes"
  },
  {
    availabilityStatus: "available",
    brandName: "Guilt Free-ish",
    calories: 419,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Salary-week confidence, month-end consequences. Craving heard; cart drama can take a breath.",
      headline: "Muesli cart case opened"
    },
    fullName: "Guilt Free-ish Salary Day Muesli Deluxe",
    id: "NC111",
    imageSrc: "/product-images/NC111.jpg",
    name: "Muesli Deluxe",
    originalCategory: "breakfast",
    price: 131,
    regretScore: 69,
    searchKeywords: [
      "muesli",
      "premium",
      "salary"
    ],
    subcategory: "Muesli",
    subtitle: "Muesli made for tiny dry fruits with big confidence",
    tag: "Muesli"
  },
  {
    availabilityStatus: "available",
    brandName: "Adulting Dept",
    calories: 467,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Regret risk: 66/100; Self Control is observing.",
      headline: "Peanut Butter urge logged"
    },
    fullName: "Adulting Dept Spoonful Regret Peanut Butter",
    id: "NC112",
    imageSrc: "/product-images/NC112.jpg",
    name: "Regret Butter",
    originalCategory: "breakfast",
    price: 148,
    regretScore: 66,
    searchKeywords: [
      "peanut",
      "butter",
      "spoon",
      "snack"
    ],
    subcategory: "Peanut Butter",
    subtitle: "Peanut Butter made for no bread, only vibes",
    tag: "Peanut Butter"
  },
  {
    availabilityStatus: "available",
    brandName: "Panic Pantry",
    calories: 502,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Self Control has opened a ticket.",
      headline: "Bread temptation memo"
    },
    fullName: "Panic Pantry Last Two Slices Bread",
    id: "NC113",
    imageSrc: "/product-images/NC113.jpg",
    name: "Two Slices",
    originalCategory: "breakfast",
    price: 165,
    regretScore: 71,
    searchKeywords: [
      "bread",
      "breakfast",
      "empty",
      "fridge"
    ],
    subcategory: "Bread",
    subtitle: "Bread made for a survival story in plastic",
    tag: "Bread"
  },
  {
    availabilityStatus: "available",
    brandName: "Office Escape",
    calories: 544,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Future you says: tomorrow you deserves breakfast, not a plot twist.",
      headline: "Jam cart case opened"
    },
    fullName: "Office Escape Childhood Excuse Jam",
    id: "NC114",
    imageSrc: "/product-images/NC114.jpg",
    name: "Excuse Jam",
    originalCategory: "breakfast",
    price: 182,
    regretScore: 68,
    searchKeywords: [
      "jam",
      "bread",
      "nostalgia"
    ],
    subcategory: "Jam",
    subtitle: "Jam made for because plain bread felt too honest",
    tag: "Jam"
  },
  {
    availabilityStatus: "available",
    brandName: "Sasta Luxury",
    calories: 595,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Price pressure: Rs 199; the thumb committee gets one breath.",
      headline: "Pancake Mix urge logged"
    },
    fullName: "Sasta Luxury Weekend Ambition Pancake Mix",
    id: "NC115",
    imageSrc: "/product-images/NC115.jpg",
    name: "Ambition Pancake",
    originalCategory: "breakfast",
    price: 199,
    regretScore: 68,
    searchKeywords: [
      "pancake",
      "mix",
      "weekend"
    ],
    subcategory: "Pancake Mix",
    subtitle: "Pancake Mix made for requires the version of you who wakes early",
    tag: "Pancake Mix"
  },
  {
    availabilityStatus: "available",
    brandName: "Guilt Free-ish",
    calories: 641,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Future you asks why Idli Batter needed governance.",
      headline: "Idli Batter temptation memo"
    },
    fullName: "Guilt Free-ish Responsible Citizen Idli Batter",
    id: "NC116",
    imageSrc: "/product-images/NC116.jpg",
    name: "Citizen Batter",
    originalCategory: "breakfast",
    price: 216,
    regretScore: 68,
    searchKeywords: [
      "idli",
      "batter",
      "breakfast"
    ],
    subcategory: "Idli Batter",
    subtitle: "Idli Batter made for for when you briefly respect routine",
    tag: "Idli Batter"
  },
  {
    availabilityStatus: "available",
    brandName: "Adulting Dept",
    calories: 676,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Dhokla has made its case; future you requested a pause.",
      headline: "Dhokla impulse brief"
    },
    fullName: "Adulting Dept Diet Starts Dhokla Pack",
    id: "NC117",
    imageSrc: "/product-images/NC117.jpg",
    name: "Diet Dhokla",
    originalCategory: "breakfast",
    price: 32,
    regretScore: 63,
    searchKeywords: [
      "dhokla",
      "breakfast",
      "snack"
    ],
    subcategory: "Dhokla",
    subtitle: "Dhokla made for steamed, therefore legally innocent",
    tag: "Dhokla"
  },
  {
    availabilityStatus: "available",
    brandName: "Panic Pantry",
    calories: 722,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Tagged under chai, biscuit and office; proceed with comedy, not autopilot.",
      headline: "Chai Biscuit urge logged"
    },
    fullName: "Panic Pantry Meeting Delay Chai Biscuit",
    id: "NC118",
    imageSrc: "/product-images/NC118.jpg",
    name: "Delay Biscuit",
    originalCategory: "breakfast",
    price: 49,
    regretScore: 66,
    searchKeywords: [
      "chai",
      "biscuit",
      "office"
    ],
    subcategory: "Chai Biscuit",
    subtitle: "Chai Biscuit made for tea break disguised as project work",
    tag: "Chai Biscuit"
  },
  {
    availabilityStatus: "available",
    brandName: "Office Escape",
    calories: 767,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance. Craving heard; cart drama can take a breath.",
      headline: "Smoothie Pack temptation memo"
    },
    fullName: "Office Escape Detox Tomorrow Smoothie Pack",
    id: "NC119",
    imageSrc: "/product-images/NC119.jpg",
    name: "Tomorrow Smoothie",
    originalCategory: "breakfast",
    price: 66,
    regretScore: 63,
    searchKeywords: [
      "smoothie",
      "detox",
      "fruit"
    ],
    subcategory: "Smoothie Pack",
    subtitle: "Smoothie Pack made for tomorrow you is very ambitious",
    tag: "Smoothie Pack"
  },
  {
    availabilityStatus: "available",
    brandName: "Sasta Luxury",
    calories: 801,
    categoryId: "breakfast-regrets",
    detailCopy: {
      description: "Built for morning optimism, alarm snoozes and wellness plans with weak governance.",
      headline: "Egg Bites craving filed"
    },
    fullName: "Sasta Luxury Meal Prep Egg Bites",
    id: "NC120",
    imageSrc: "/product-images/NC120.jpg",
    name: "Prep Bites",
    originalCategory: "breakfast",
    price: 83,
    regretScore: 63,
    searchKeywords: [
      "egg",
      "bites",
      "breakfast"
    ],
    subcategory: "Egg Bites",
    subtitle: "Egg Bites made for meal prep for people who forgot meals",
    tag: "Egg Bites"
  },
  {
    availabilityStatus: "available",
    brandName: "Laziness Labs",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Tagged under earbuds, meeting and escape; proceed with comedy, not autopilot.",
      headline: "Earbuds impulse brief"
    },
    fullName: "Laziness Labs Meeting Escape Earbuds Do Nothing Edition",
    id: "NC121",
    imageSrc: "/product-images/NC121.jpg",
    name: "Escape Earbuds",
    originalCategory: "non food item",
    price: 40,
    regretScore: 40,
    searchKeywords: [
      "earbuds",
      "meeting",
      "escape"
    ],
    subcategory: "Earbuds",
    subtitle: "Earbuds made for blocks nothing except accountability",
    tag: "Earbuds"
  },
  {
    availabilityStatus: "available",
    brandName: "Dopamine Dukaan",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Built for adulting tabs, salary-week confidence and things your drawer did not request. Cable has made its case; future you requested a pause.",
      headline: "Cable urge logged"
    },
    fullName: "Dopamine Dukaan Mystery Drawer Charging Cable",
    id: "NC122",
    imageSrc: "/product-images/NC122.jpg",
    name: "Mystery Cable",
    originalCategory: "non food item",
    price: 57,
    regretScore: 43,
    searchKeywords: [
      "charging",
      "cable",
      "drawer"
    ],
    subcategory: "Cable",
    subtitle: "Cable made for might work if you believe enough",
    tag: "Cable"
  },
  {
    availabilityStatus: "available",
    brandName: "Adulting Dept",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Looks like adulting. Behaves like impulse. Future you asks why Notebook needed governance.",
      headline: "Notebook cart case opened"
    },
    fullName: "Adulting Dept Fresh Start Notebook",
    id: "NC123",
    imageSrc: "/product-images/NC123.jpg",
    name: "Fresh Notebook",
    originalCategory: "non food item",
    price: 74,
    regretScore: 40,
    searchKeywords: [
      "notebook",
      "productivity"
    ],
    subcategory: "Notebook",
    subtitle: "Notebook made for page one has dreams, page two has doodles",
    tag: "Notebook"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Built for adulting tabs, salary-week confidence and things your drawer did not request. Craving heard; cart drama can take a breath.",
      headline: "Scented Candle cart case opened"
    },
    fullName: "Weekend Unlimited Rent Friendly Luxury Candle",
    id: "NC124",
    imageSrc: "/product-images/NC124.jpg",
    name: "Luxury Candle",
    originalCategory: "non food item",
    price: 91,
    regretScore: 43,
    searchKeywords: [
      "candle",
      "room",
      "aesthetic"
    ],
    subcategory: "Scented Candle",
    subtitle: "Scented Candle made for makes 1bhk feel sponsored",
    tag: "Scented Candle"
  },
  {
    availabilityStatus: "available",
    brandName: "Sasta Luxury",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Arrives when just checking becomes cart research.",
      headline: "Face Wash craving filed"
    },
    fullName: "Sasta Luxury Tomorrow Glow Face Wash",
    id: "NC125",
    imageSrc: "/product-images/NC125.jpg",
    name: "Tomorrow Glow",
    originalCategory: "non food item",
    price: 108,
    regretScore: 46,
    searchKeywords: [
      "face",
      "wash",
      "skincare",
      "late",
      "night"
    ],
    subcategory: "Face Wash",
    subtitle: "Face Wash made for for routines started after midnight",
    tag: "Face Wash"
  },
  {
    availabilityStatus: "available",
    brandName: "Laziness Labs",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Built for living-room diplomacy and side-eye. Self Control has opened a ticket.",
      headline: "Batteries temptation memo"
    },
    fullName: "Laziness Labs Remote Fight Batteries",
    id: "NC126",
    imageSrc: "/product-images/NC126.jpg",
    name: "Remote Batteries",
    originalCategory: "non food item",
    price: 125,
    regretScore: 43,
    searchKeywords: [
      "batteries",
      "remote",
      "family"
    ],
    subcategory: "Batteries",
    subtitle: "Batteries made for saves democracy in the living room",
    tag: "Batteries"
  },
  {
    availabilityStatus: "available",
    brandName: "Dopamine Dukaan",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Looks like adulting. Behaves like impulse. Regret risk: 43/100; Self Control is observing.",
      headline: "Laundry Bag urge logged"
    },
    fullName: "Dopamine Dukaan Laundry Mountain Storage Bag",
    id: "NC127",
    imageSrc: "/product-images/NC127.jpg",
    name: "Laundry Bag",
    originalCategory: "non food item",
    price: 142,
    regretScore: 43,
    searchKeywords: [
      "laundry",
      "bag",
      "adulting"
    ],
    subcategory: "Laundry Bag",
    subtitle: "Laundry Bag made for for clothes entering geological phase",
    tag: "Laundry Bag"
  },
  {
    availabilityStatus: "available",
    brandName: "Adulting Dept",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Looks like adulting. Behaves like impulse. Craving heard; cart drama can take a breath.",
      headline: "Sticky Notes temptation memo"
    },
    fullName: "Adulting Dept Productivity Sticky Notes",
    id: "NC128",
    imageSrc: "/product-images/NC128.jpg",
    name: "Sticky Notes",
    originalCategory: "non food item",
    price: 159,
    regretScore: 45,
    searchKeywords: [
      "sticky",
      "notes",
      "productivity"
    ],
    subcategory: "Sticky Notes",
    subtitle: "Sticky Notes made for tiny papers, huge avoidance",
    tag: "Sticky Notes"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Hostel-room morale in one tiny decision. Tagged under room, freshener and hostel; proceed with comedy, not autopilot.",
      headline: "Room Freshener urge logged"
    },
    fullName: "Weekend Unlimited Hostel Room Apology Spray",
    id: "NC129",
    imageSrc: "/product-images/NC129.jpg",
    name: "Apology Spray",
    originalCategory: "non food item",
    price: 176,
    regretScore: 45,
    searchKeywords: [
      "room",
      "freshener",
      "hostel"
    ],
    subcategory: "Room Freshener",
    subtitle: "Room Freshener made for for smells with backstory",
    tag: "Room Freshener"
  },
  {
    availabilityStatus: "available",
    brandName: "Sasta Luxury",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Built for adulting tabs, salary-week confidence and things your drawer did not request. Regret risk: 45/100; Self Control is observing.",
      headline: "Keychain impulse brief"
    },
    fullName: "Sasta Luxury Personality Keychain",
    id: "NC130",
    imageSrc: "/product-images/NC130.jpg",
    name: "Keychain",
    originalCategory: "non food item",
    price: 193,
    regretScore: 45,
    searchKeywords: [
      "keychain",
      "impulse",
      "buy"
    ],
    subcategory: "Keychain",
    subtitle: "Keychain made for because keys looked emotionally empty",
    tag: "Keychain"
  },
  {
    availabilityStatus: "available",
    brandName: "Laziness Labs",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Arrives when just checking becomes cart research.",
      headline: "Sleep Mask craving filed"
    },
    fullName: "Laziness Labs Optimistic Sleep Mask",
    id: "NC131",
    imageSrc: "/product-images/NC131.jpg",
    name: "Sleep Mask",
    originalCategory: "non food item",
    price: 210,
    regretScore: 45,
    searchKeywords: [
      "sleep",
      "mask",
      "insomnia"
    ],
    subcategory: "Sleep Mask",
    subtitle: "Sleep Mask made for darkness is not a sleep schedule",
    tag: "Sleep Mask"
  },
  {
    availabilityStatus: "available",
    brandName: "Dopamine Dukaan",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Tagged under water, bottle and office; proceed with comedy, not autopilot.",
      headline: "Water Bottle urge logged"
    },
    fullName: "Dopamine Dukaan Hydration Personality Bottle",
    id: "NC132",
    imageSrc: "/product-images/NC132.jpg",
    name: "Hydration Bottle",
    originalCategory: "non food item",
    price: 227,
    regretScore: 45,
    searchKeywords: [
      "water",
      "bottle",
      "office"
    ],
    subcategory: "Water Bottle",
    subtitle: "Water Bottle made for for people who buy wellness accessories",
    tag: "Water Bottle"
  },
  {
    availabilityStatus: "available",
    brandName: "Adulting Dept",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Pairs with one more reel. Dangerous phrase. Craving heard; cart drama can take a breath.",
      headline: "Phone Stand temptation memo"
    },
    fullName: "Adulting Dept Reels Research Phone Stand",
    id: "NC133",
    imageSrc: "/product-images/NC133.jpg",
    name: "Phone Stand",
    originalCategory: "non food item",
    price: 244,
    regretScore: 48,
    searchKeywords: [
      "phone",
      "stand",
      "reels"
    ],
    subcategory: "Phone Stand",
    subtitle: "Phone Stand made for hands-free doomscrolling innovation",
    tag: "Phone Stand"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Looks like adulting. Behaves like impulse. Future you asks why Planner needed governance.",
      headline: "Planner temptation memo"
    },
    fullName: "Weekend Unlimited Life Sorted Planner",
    id: "NC134",
    imageSrc: "/product-images/NC134.jpg",
    name: "Sorted Planner",
    originalCategory: "non food item",
    price: 261,
    regretScore: 48,
    searchKeywords: [
      "planner",
      "adulting"
    ],
    subcategory: "Planner",
    subtitle: "Planner made for january energy in june packaging",
    tag: "Planner"
  },
  {
    availabilityStatus: "available",
    brandName: "Sasta Luxury",
    calories: 0,
    categoryId: "random-non-food-items",
    detailCopy: {
      description: "Built for adulting tabs, salary-week confidence and things your drawer did not request. Tote Bag has made its case; future you requested a pause.",
      headline: "Tote Bag impulse brief"
    },
    fullName: "Sasta Luxury Main Character Tote Bag",
    id: "NC135",
    imageSrc: "/product-images/NC135.jpg",
    name: "Tote Bag",
    originalCategory: "non food item",
    price: 278,
    regretScore: 48,
    searchKeywords: [
      "tote",
      "bag",
      "aesthetic"
    ],
    subcategory: "Tote Bag",
    subtitle: "Tote Bag made for carries groceries and delusion",
    tag: "Tote Bag"
  },
  {
    availabilityStatus: "available",
    brandName: "Dopamine Dukaan",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting. Future you says: the emotion is valid; the cart can take a breath.",
      headline: "Gift Box cart case opened"
    },
    fullName: "Dopamine Dukaan Apology To Myself Gift Box",
    id: "NC136",
    imageSrc: "/product-images/NC136.jpg",
    name: "Self Gift",
    originalCategory: "emotional purchase",
    price: 68,
    regretScore: 48,
    searchKeywords: [
      "self",
      "gift",
      "emotional",
      "purchase"
    ],
    subcategory: "Gift Box",
    subtitle: "Gift Box made for for forgiving yourself without evidence",
    tag: "Gift Box"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting. Price pressure: Rs 85; the thumb committee gets one breath.",
      headline: "Sticker Pack urge logged"
    },
    fullName: "Weekend Unlimited Therapy Pending Sticker Pack",
    id: "NC137",
    imageSrc: "/product-images/NC137.jpg",
    name: "Therapy Stickers",
    originalCategory: "emotional purchase",
    price: 85,
    regretScore: 48,
    searchKeywords: [
      "stickers",
      "laptop",
      "therapy"
    ],
    subcategory: "Sticker Pack",
    subtitle: "Sticker Pack made for cheaper than processing feelings",
    tag: "Sticker Pack"
  },
  {
    availabilityStatus: "available",
    brandName: "Sasta Luxury",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Looks like adulting. Behaves like impulse. Regret risk: 51/100; Self Control is observing.",
      headline: "Mini Plant urge logged"
    },
    fullName: "Sasta Luxury Responsibility Practice Mini Plant",
    id: "NC138",
    imageSrc: "/product-images/NC138.jpg",
    name: "Practice Plant",
    originalCategory: "emotional purchase",
    price: 102,
    regretScore: 51,
    searchKeywords: [
      "mini",
      "plant",
      "adulting"
    ],
    subcategory: "Mini Plant",
    subtitle: "Mini Plant made for low-stakes parenting with leaves",
    tag: "Mini Plant"
  },
  {
    availabilityStatus: "available",
    brandName: "Emotional Damage",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Teams-meeting energy, snack-sized consequences. Self Control has opened a ticket.",
      headline: "Mug temptation memo"
    },
    fullName: "Emotional Damage Corporate Personality Mug",
    id: "NC139",
    imageSrc: "/product-images/NC139.jpg",
    name: "Office Mug",
    originalCategory: "emotional purchase",
    price: 119,
    regretScore: 51,
    searchKeywords: [
      "mug",
      "office",
      "personality"
    ],
    subcategory: "Mug",
    subtitle: "Mug made for because your desk needed a coping prop",
    tag: "Mug"
  },
  {
    availabilityStatus: "available",
    brandName: "Laziness Labs",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting. Bookmark has made its case; future you requested a pause.",
      headline: "Bookmark urge logged"
    },
    fullName: "Laziness Labs Reading Habit Bookmark",
    id: "NC140",
    imageSrc: "/product-images/NC140.jpg",
    name: "Habit Bookmark",
    originalCategory: "emotional purchase",
    price: 136,
    regretScore: 51,
    searchKeywords: [
      "bookmark",
      "books",
      "habit"
    ],
    subcategory: "Bookmark",
    subtitle: "Bookmark made for for books you keep meaning to start",
    tag: "Bookmark"
  },
  {
    availabilityStatus: "available",
    brandName: "Dopamine Dukaan",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting. Future you asks why Fairy Lights needed governance.",
      headline: "Fairy Lights cart case opened"
    },
    fullName: "Dopamine Dukaan Mood Repair Fairy Lights",
    id: "NC141",
    imageSrc: "/product-images/NC141.jpg",
    name: "Repair Lights",
    originalCategory: "emotional purchase",
    price: 153,
    regretScore: 53,
    searchKeywords: [
      "fairy",
      "lights",
      "room",
      "mood"
    ],
    subcategory: "Fairy Lights",
    subtitle: "Fairy Lights made for room makeover under emotional pressure",
    tag: "Fairy Lights"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting.",
      headline: "Poster craving filed"
    },
    fullName: "Weekend Unlimited Motivation Poster For Tired People",
    id: "NC142",
    imageSrc: "/product-images/NC142.jpg",
    name: "Tired Poster",
    originalCategory: "emotional purchase",
    price: 170,
    regretScore: 53,
    searchKeywords: [
      "poster",
      "motivation",
      "tired"
    ],
    subcategory: "Poster",
    subtitle: "Poster made for shouts hustle at someone lying down",
    tag: "Poster"
  },
  {
    availabilityStatus: "available",
    brandName: "Sasta Luxury",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting. Tagged under lip, balm and impulse; proceed with comedy, not autopilot.",
      headline: "Lip Balm impulse brief"
    },
    fullName: "Sasta Luxury Where Did It Go Lip Balm",
    id: "NC143",
    imageSrc: "/product-images/NC143.jpg",
    name: "Lost Balm",
    originalCategory: "emotional purchase",
    price: 187,
    regretScore: 53,
    searchKeywords: [
      "lip",
      "balm",
      "impulse"
    ],
    subcategory: "Lip Balm",
    subtitle: "Lip Balm made for you already own six invisible ones",
    tag: "Lip Balm"
  },
  {
    availabilityStatus: "available",
    brandName: "Emotional Damage",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting. Self Control has opened a ticket.",
      headline: "Desk Toy cart case opened"
    },
    fullName: "Emotional Damage Deadline Panic Desk Toy",
    id: "NC144",
    imageSrc: "/product-images/NC144.jpg",
    name: "Panic Toy",
    originalCategory: "emotional purchase",
    price: 204,
    regretScore: 62,
    searchKeywords: [
      "desk",
      "toy",
      "stress"
    ],
    subcategory: "Desk Toy",
    subtitle: "Desk Toy made for productivity through fidgeting",
    tag: "Desk Toy"
  },
  {
    availabilityStatus: "available",
    brandName: "Laziness Labs",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting.",
      headline: "Journal craving filed"
    },
    fullName: "Laziness Labs Overthinking Export Journal",
    id: "NC145",
    imageSrc: "/product-images/NC145.jpg",
    name: "Export Journal",
    originalCategory: "emotional purchase",
    price: 221,
    regretScore: 53,
    searchKeywords: [
      "journal",
      "overthinking"
    ],
    subcategory: "Journal",
    subtitle: "Journal made for converts brain tabs into paper tabs",
    tag: "Journal"
  },
  {
    availabilityStatus: "available",
    brandName: "Dopamine Dukaan",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting. Price pressure: Rs 238; the thumb committee gets one breath.",
      headline: "Bath Bomb impulse brief"
    },
    fullName: "Dopamine Dukaan Main Character Bath Bomb",
    id: "NC146",
    imageSrc: "/product-images/NC146.jpg",
    name: "Bath Bomb",
    originalCategory: "emotional purchase",
    price: 238,
    regretScore: 53,
    searchKeywords: [
      "bath",
      "bomb",
      "self",
      "care"
    ],
    subcategory: "Bath Bomb",
    subtitle: "Bath Bomb made for for bathrooms pretending to be resorts",
    tag: "Bath Bomb"
  },
  {
    availabilityStatus: "available",
    brandName: "Weekend Unlimited",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting. Future you says: the emotion is valid; the cart can take a breath.",
      headline: "Fridge Magnet temptation memo"
    },
    fullName: "Weekend Unlimited Goa Plan Fridge Magnet",
    id: "NC147",
    imageSrc: "/product-images/NC147.jpg",
    name: "Goa Magnet",
    originalCategory: "emotional purchase",
    price: 255,
    regretScore: 56,
    searchKeywords: [
      "fridge",
      "magnet",
      "travel",
      "plan"
    ],
    subcategory: "Fridge Magnet",
    subtitle: "Fridge Magnet made for vacation cancelled, magnet remains",
    tag: "Fridge Magnet"
  },
  {
    availabilityStatus: "available",
    brandName: "Sasta Luxury",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting.",
      headline: "Tiny Perfume craving filed"
    },
    fullName: "Sasta Luxury Situationship Perfume Mini",
    id: "NC148",
    imageSrc: "/product-images/NC148.jpg",
    name: "Situation Perfume",
    originalCategory: "emotional purchase",
    price: 272,
    regretScore: 59,
    searchKeywords: [
      "perfume",
      "dating",
      "mini"
    ],
    subcategory: "Tiny Perfume",
    subtitle: "Tiny Perfume made for smells like mixed signals",
    tag: "Tiny Perfume"
  },
  {
    availabilityStatus: "available",
    brandName: "Emotional Damage",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting. Regret risk: 56/100; Self Control is observing.",
      headline: "Key Bowl impulse brief"
    },
    fullName: "Emotional Damage Life Together Key Bowl",
    id: "NC149",
    imageSrc: "/product-images/NC149.jpg",
    name: "Key Bowl",
    originalCategory: "emotional purchase",
    price: 289,
    regretScore: 56,
    searchKeywords: [
      "key",
      "bowl",
      "home",
      "decor"
    ],
    subcategory: "Key Bowl",
    subtitle: "Key Bowl made for for people still losing keys",
    tag: "Key Bowl"
  },
  {
    availabilityStatus: "available",
    brandName: "Laziness Labs",
    calories: 0,
    categoryId: "emotional-purchases",
    detailCopy: {
      description: "Built for self-care decks, mood boards and retail therapy with no minutes of meeting. Future you says: the emotion is valid; the cart can take a breath.",
      headline: "Mystery Item temptation memo"
    },
    fullName: "Laziness Labs Why Did I Add This Mystery Item",
    id: "NC150",
    imageSrc: "/product-images/NC150.jpg",
    name: "Mystery Item",
    originalCategory: "emotional purchase",
    price: 306,
    regretScore: 59,
    searchKeywords: [
      "mystery",
      "impulse",
      "random"
    ],
    subcategory: "Mystery Item",
    subtitle: "Mystery Item made for even the app is concerned",
    tag: "Mystery Item"
  }
];
