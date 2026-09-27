export interface Item {
  name: string;
  price: string;
  img: string;
  video?: string;
  description: string;
  author: string;
  year: string;
  madeIn: string;
  materials: string;
  size: string;
  rarity: string;
  secondaryImg: string;
}

export const items: Item[] = [
  { name: "YUMI", price: "$18000.00", img: "/1.png" },
  { name: "ZENYA", price: "$23000.00", img: "/2.png" },
  { name: "ELYSIA", price: "$19000.00", img: "/3.png" },
  { name: "LIORA", price: "$58000.00", img: "/4.png" },
  { name: "SOLARA", price: "Sold Out", img: "/5.png" },
  { name: "LYRA", price: "$25000.00", img: "/6.png" },
  { name: "ISLA", price: "$29000.00", img: "/7.png" },
  { name: "SERAPH", price: "$17000.00", img: "/8.png" },
  { name: "AZURA", price: "$25000.00", img: "/9.png", video: "/azura_video.mp4" },
  { name: "ARIYA", price: "$15000.00", img: "/10.png" },
  { name: "MIRA", price: "$28000.00", img: "/11.png" },
].map(item => ({
  ...item,
  description: `An extraordinary work of art that existed only in dreams before it was brought to life in porcelain. This handcrafted figurine is the first and only one of its kind. Inspired by the magic and myths of the East, ${item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()} embodies the fusion of ancient wisdom and exceptional craftsmanship.`,
  author: "Hiroshi Takahashi",
  year: "2024",
  madeIn: "Japan",
  materials: "Premium quality porcelain, hand-painted details, and finished with 24-karat gold accents.",
  size: "35 cm (height)",
  rarity: "Unique piece",
  secondaryImg: item.name === "AZURA" ? "/girl 1.png" : "https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=2000"
}));
