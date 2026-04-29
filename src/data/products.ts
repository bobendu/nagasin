export interface Product {
  id: number;
  slug: string;
  title: string;
  category: "EDITION" | "COLLECTION" | "DESSIN" | "ORIGINAL" | "AUTRE";
  price: number;
  description: string;
  image: string;
  details: string; // Texte plus long pour la page produit
  canBeDedicated: boolean;
  stock: number;
  weight: number; // En grammes, utile pour les frais de port plus tard
}

export const CATALOG: Product[] = [
  {
    id: 1,
    slug: "codex-maladie-rare",
    title: "Le Codex Maladie Rare",
    category: "EDITION",
    price: 24,
    description: "Une exploration graphique et humoristique du monde des maladies rares.",
    details: "128 pages de dessins percutants. Préface du Pr. Machin. Edition na! Studio 2024.",
    image: "https://www.dessinateur.net/wp-content/uploads/2018/03/codex-maladie-rare.jpg",
    canBeDedicated: true,
    stock: 50,
    weight: 450
  },
  {
    id: 2,
    slug: "hagard-dunord",
    title: "Hagard Dunord",
    category: "COLLECTION",
    price: 19,
    description: "Les aventures déjantées du célèbre strip d'Automodélisme.",
    details: "Format italien, couverture cartonnée. Retrouvez l'intégrale des strips parus.",
    image: "https://www.dessinateur.net/wp-content/uploads/2018/03/hagard-dunord.jpg",
    canBeDedicated: true,
    stock: 20,
    weight: 350
  }
];
