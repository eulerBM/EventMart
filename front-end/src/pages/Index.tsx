import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductSkeletonGrid } from "@/components/products/ProductSkeleton";
import { CategoryFilter } from "@/components/home/CategoryFilter";
import { products, searchProducts } from "@/data/products";
import { motion } from "framer-motion";

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    
    
    let result = searchQuery ? searchProducts(searchQuery) : products;
    
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    
    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen">
      <Hero />
      
      {!searchQuery && <FeaturedProducts />}
      
      <section id="products" className="section-padding bg-secondary/20">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} available
              </p>
            </div>
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          {isLoading ? (
            <ProductSkeletonGrid />
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="h-24 w-24 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar seus critérios de pesquisa ou filtro.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
