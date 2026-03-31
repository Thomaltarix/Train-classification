import {
  MODEL_CATEGORIES,
  MODEL_CATEGORY_LABELS,
  MODEL_TYPES,
  MODEL_TYPE_LABELS,
  type ModelFilters,
} from "@/types/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export function ModelFilterBar({ filters }: { filters: ModelFilters }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-3 sm:p-4">
        <form
          action="/models"
          className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] md:items-center"
        >
          <Select name="category" defaultValue={filters.category ?? ""}>
            <option value="">Toutes les catégories</option>
            {MODEL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {MODEL_CATEGORY_LABELS[category]}
              </option>
            ))}
          </Select>
          <Select name="type" defaultValue={filters.type ?? ""}>
            <option value="">Tous les types</option>
            {MODEL_TYPES.map((type) => (
              <option key={type} value={type}>
                {MODEL_TYPE_LABELS[type]}
              </option>
            ))}
          </Select>
          <Button type="submit" className="w-full md:w-auto">
            Filtrer
          </Button>
          <Button
            type="submit"
            formAction="/models"
            variant="outline"
            className="w-full md:w-auto"
          >
            Réinitialiser
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
