import { Truck, ShieldCheck, Wrench } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Truck,
      title: "Free delivery",
      description: "Pan-India shipping on every order.",
    },
    {
      icon: ShieldCheck,
      title: "25-yr warranty",
      description: "Tier-1 solar panels with full cover.",
    },
    {
      icon: Wrench,
      title: "Lifetime support",
      description: "WhatsApp engineers, any day.",
    },
  ];

  return (
    <section className="container-page py-9 md:py-20">
      <div className="mx-auto max-w-[424px] lg:max-w-7xl">
      <h2 className="mb-2 text-[20px] font-bold leading-tight tracking-[-0.02em] text-[#0F172A] md:text-2xl">
        Why choose us
      </h2>

      <p className="mb-5 text-sm font-normal leading-[1.45] text-[#64748B] md:mb-8">
        Built for Indian conditions, backed by real engineers.
      </p>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 md:gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex min-h-[102px] items-center gap-3.5 rounded-[16px] border border-[#E2E8F0] bg-white p-4 transition hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:block sm:min-h-[174px] sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#EFF6FF] sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 text-[#2D62A8]" />
              </div>

              <div className="sm:mt-4">
                <h3 className="text-sm font-semibold text-[#0F172A]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs font-normal leading-[1.45] text-[#64748B]">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
