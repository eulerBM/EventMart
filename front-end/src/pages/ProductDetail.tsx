import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const product = getProductById(id || "");

  if (!product) {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate("/")}>Back to Shop</Button>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, quantity);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container-main py-8 md:py-16">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1.5 bg-destructive text-destructive-foreground text-sm font-semibold rounded-lg">
              -{discount}% OFF
            </span>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-primary font-medium mb-2">{product.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-semibold">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
            <span className={`text-sm font-medium ${product.stock > 10 ? "text-success" : product.stock > 0 ? "text-warning" : "text-destructive"}`}>
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="xl"
            variant={isAdding ? "success" : "hero"}
            className="mb-8"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
          >
            {isAdding ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart — {formatPrice(product.price * quantity)}
              </>
            )}
          </Button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Free Shipping</span>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Secure Payment</span>
            </div>
            <div className="text-center">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">30-Day Return</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
