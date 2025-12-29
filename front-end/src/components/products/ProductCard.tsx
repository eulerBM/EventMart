import { useState } from "react";
import { ShoppingCart, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block bg-card rounded-2xl overflow-hidden shadow-sm card-hover border border-border/50"
      >
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-md">
              -{discount}%
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-3 right-3 px-2 py-1 bg-warning text-warning-foreground text-xs font-semibold rounded-md">
              Low stock
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-muted-foreground font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-muted-foreground text-sm">({product.reviews})</span>
          </div>
          <h3 className="font-semibold text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">{product.category}</p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground text-sm line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <Button
              size="icon"
              variant={isAdding ? "success" : "default"}
              className={cn("h-9 w-9 shrink-0", isAdding && "pointer-events-none")}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {isAdding ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
