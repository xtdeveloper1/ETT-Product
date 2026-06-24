import type { ProductSpecification } from "@/services/product-details-service";

interface ProductSpecificationsProps {
  specifications?: ProductSpecification[];
}

export default function ProductSpecifications({
  specifications = [],
}: ProductSpecificationsProps) {
  const specs = specifications.filter(
    (spec) =>
      spec.spec_group?.toLowerCase() === "specifications"
  );

  if (specs.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-4 md:px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Specifications
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {specs.map((spec, index) => (
                <tr
                  key={spec.id}
                  className={`border-b border-slate-200 last:border-b-0 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  <td className="px-4 md:px-6 py-3 font-semibold text-slate-900 text-sm">
                    {spec.name}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-slate-700 text-sm text-right">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}