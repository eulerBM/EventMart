export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals alike.",
    price: 299.99,
    originalPrice: 349.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Electronics",
    stock: 15,
    featured: true,
    rating: 4.8,
    reviews: 256,
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    description: "Advanced smartwatch with health monitoring, GPS tracking, and seamless phone integration. Water-resistant up to 50 meters.",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: "Electronics",
    stock: 8,
    featured: true,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: "3",
    name: "Minimalist Leather Backpack",
    description: "Handcrafted genuine leather backpack with laptop compartment. Elegant design meets everyday functionality.",
    price: 189.99,
    originalPrice: 229.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    category: "Accessories",
    stock: 23,
    featured: true,
    rating: 4.9,
    reviews: 342,
  },
  {
    id: "4",
    name: "Premium Coffee Maker",
    description: "Barista-quality espresso machine with built-in grinder. Wake up to perfect coffee every morning.",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
    category: "Home",
    stock: 5,
    featured: false,
    rating: 4.6,
    reviews: 128,
  },
  {
    id: "5",
    name: "Ceramic Desk Lamp",
    description: "Handmade ceramic lamp with warm LED lighting. Adds elegance to any workspace or reading corner.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    category: "Home",
    stock: 32,
    featured: false,
    rating: 4.5,
    reviews: 87,
  },
  {
    id: "6",
    name: "Portable Bluetooth Speaker",
    description: "Compact speaker with 360° sound, waterproof design, and 24-hour battery. Take your music anywhere.",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    category: "Electronics",
    stock: 45,
    featured: true,
    rating: 4.4,
    reviews: 412,
  },
  {
    id: "7",
    name: "Organic Cotton T-Shirt",
    description: "Sustainably made premium cotton t-shirt. Soft, breathable, and perfect for everyday wear.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    category: "Clothing",
    stock: 120,
    featured: false,
    rating: 4.3,
    reviews: 567,
  },
  {
    id: "8",
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with hot-swappable switches. Built for gamers and typists who demand precision.",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80",
    category: "Electronics",
    stock: 18,
    featured: false,
    rating: 4.7,
    reviews: 234,
  },
];

export const categories = [
  "All",
  "Electronics",
  "Accessories",
  "Home",
  "Clothing",
];

export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getProductById = (id: string) => products.find(p => p.id === id);
export const searchProducts = (query: string) => 
  products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );
