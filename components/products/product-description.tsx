import type { ProductSpecification } from "@/services/product-details-service";

interface ProductDescriptionProps {
  description?: string;
  specifications?: ProductSpecification[];
}

export default function ProductDescription({
  description = "",
  specifications = [],
}: ProductDescriptionProps) {
  const descriptionSpecs = specifications.filter(
    (spec) =>
      spec.spec_group?.toLowerCase() === "product description"
  );

  if (!description && descriptionSpecs.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-4 md:px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            About this product
          </h2>
        </div>

        <div className="px-4 md:px-6 py-6 space-y-6">
          {description && (
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          )}

          {descriptionSpecs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Highlights
              </h3>
              <div className="space-y-2">
                {descriptionSpecs.map((spec) => (
                  <div key={spec.id} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {spec.name || spec.spec_key}
                      </p>
                      {(spec.value || spec.spec_value) && (
                        <p className="text-xs text-slate-600 mt-0.5">
                          {spec.value || spec.spec_value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}