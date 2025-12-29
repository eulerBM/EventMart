import { getFeaturedProducts } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Produtos em destaque</h2>
            <p className="text-muted-foreground">Itens selecionados a dedo, especialmente para você.</p>
          </div>
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            Ver tudo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
