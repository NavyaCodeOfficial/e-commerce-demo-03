/* Editable product data. SAMPLE ENTRIES ONLY: replace with your real, verified products,
   prices and photos, then set sampleCatalogue:false in config.js.
   Do not use third-party brand names or logos unless you are an authorised seller. */
const CATEGORIES = [
  { id: "watches", name: "Watches", blurb: "Everyday and occasion timepieces." },
  { id: "sunglasses", name: "Sunglasses", blurb: "Frames for sun and style." },
  { id: "bags", name: "Bags", blurb: "Handbags and carry-alls." }
];

const PRODUCTS = [
  { id: "classic-steel-watch", name: "Classic Steel Analog Watch", category: "watches", price: 1499, originalPrice: null,
    images: ["assets/images/watch-1.svg", "assets/images/watch-2.svg", "assets/images/watch-3.svg"],
    description: "Sample listing: a clean analog watch with a steel-tone bracelet. Replace with your real product details.",
    material: "To be confirmed by store", care: "To be confirmed by store", sizes: [], colors: ["Silver", "Black"], featured: true, added: "2026-10-01" },
  { id: "leather-strap-chronograph", name: "Leather Strap Chronograph Watch", category: "watches", price: 1799, originalPrice: null,
    images: ["assets/images/watch-2.svg", "assets/images/watch-1.svg", "assets/images/watch-3.svg"],
    description: "Sample listing: a chronograph-style watch on a leather strap. Replace with your real product details.",
    material: "To be confirmed by store", care: "To be confirmed by store", sizes: [], colors: ["Brown", "Black"], featured: true, added: "2026-10-03" },
  { id: "slim-bracelet-watch", name: "Slim Bracelet Watch for Women", category: "watches", price: 1299, originalPrice: null,
    images: ["assets/images/watch-3.svg", "assets/images/watch-1.svg", "assets/images/watch-2.svg"],
    description: "Sample listing: a slim bracelet watch with a minimal dial. Replace with your real product details.",
    material: "To be confirmed by store", care: "To be confirmed by store", sizes: [], colors: ["Rose Gold", "Gunmetal"], featured: false, added: "2026-10-05" },
  { id: "aviator-sunglasses", name: "Aviator Sunglasses", category: "sunglasses", price: 899, originalPrice: null,
    images: ["assets/images/sunglasses-1.svg", "assets/images/sunglasses-2.svg", "assets/images/sunglasses-3.svg"],
    description: "Sample listing: metal-frame aviator sunglasses. Replace with your real product details.",
    material: "To be confirmed by store", care: "To be confirmed by store", sizes: [], colors: ["Gold", "Black"], featured: true, added: "2026-10-02" },
  { id: "square-frame-sunglasses", name: "Square Frame Sunglasses", category: "sunglasses", price: 799, originalPrice: null,
    images: ["assets/images/sunglasses-2.svg", "assets/images/sunglasses-1.svg", "assets/images/sunglasses-3.svg"],
    description: "Sample listing: bold square-frame sunglasses. Replace with your real product details.",
    material: "To be confirmed by store", care: "To be confirmed by store", sizes: [], colors: ["Black", "Green"], featured: false, added: "2026-10-06" },
  { id: "round-retro-sunglasses", name: "Round Retro Sunglasses", category: "sunglasses", price: 849, originalPrice: null,
    images: ["assets/images/sunglasses-3.svg", "assets/images/sunglasses-1.svg", "assets/images/sunglasses-2.svg"],
    description: "Sample listing: round retro-style sunglasses. Replace with your real product details.",
    material: "To be confirmed by store", care: "To be confirmed by store", sizes: [], colors: ["Tortoise", "Black"], featured: false, added: "2026-10-07" },
  { id: "structured-top-handle-bag", name: "Structured Top-Handle Handbag", category: "bags", price: 1999, originalPrice: null,
    images: ["assets/images/bag-1.svg", "assets/images/bag-2.svg", "assets/images/bag-3.svg"],
    description: "Sample listing: a structured top-handle handbag. Replace with your real product details.",
    material: "To be confirmed by store", care: "To be confirmed by store", sizes: [], colors: ["Tan", "Black"], featured: true, added: "2026-10-04" },
  { id: "everyday-tote-bag", name: "Everyday Tote Bag", category: "bags", price: 1599, originalPrice: null,
    images: ["assets/images/bag-2.svg", "assets/images/bag-1.svg", "assets/images/bag-3.svg"],
    description: "Sample listing: a roomy everyday tote. Replace with your real product details.",
    material: "To be confirmed by store", care: "To be confirmed by store", sizes: [], colors: ["Beige", "Brown"], featured: false, added: "2026-10-08" }
];
