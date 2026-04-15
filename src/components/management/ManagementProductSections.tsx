import { ModuleGrid } from "../compositions/ModuleGrid";
import { MANAGEMENT_MODULES } from "../../data/pillars";

export function ManagementProductSections() {
  return (
    <ModuleGrid
      sectionId="management-products"
      eyebrow="Management suite"
      title="Systems that keep the business coherent"
      subtitle="Choose the module that matches your current constraint—then layer the rest as you grow."
      items={MANAGEMENT_MODULES}
      className="bg-ori-black section-divider"
    />
  );
}
