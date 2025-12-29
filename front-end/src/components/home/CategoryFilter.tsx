import { Button } from "@/components/ui/button";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "default" : "secondary"}
          size="sm"
          onClick={() => onSelect(category)}
          className={cn(
            "rounded-full",
            selected === category && "shadow-md"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
