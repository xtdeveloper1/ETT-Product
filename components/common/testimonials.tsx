export default function Testimonials() {
  const reviews = [
    {
      name: "Rohan Mehta",
      role: "Homeowner, Pune",
      review:
        "Rooftop install was smooth — bill dropped to almost zero in the first month.",
    },
    {
      name: "Anita Reddy",
      role: "Farm owner, Telangana",
      review:
        "The solar pump runs the whole day. Saved us from diesel completely.",
    },
    {
      name: "PWD, Nashik",
      role: "Municipal project",
      review:
        "Street lights have been running 18 months without a single fault. Great support.",
    },
  ];

  return (
    <section className="container-page py-9 md:py-20">
      <div className="mx-auto max-w-[424px] lg:max-w-7xl">
      <h2 className="mb-2 text-[20px] font-bold leading-tight tracking-[-0.02em] text-[#0F172A] md:text-2xl">
        What our customers say
      </h2>

      <p className="mb-5 text-sm font-normal leading-[1.45] text-[#64748B] md:mb-8">
        Trusted by homes, farms and municipalities across India.
      </p>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 md:gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 transition hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:p-5"
          >
            <div className="mb-3 flex gap-0.5 text-sm leading-none text-[#2D62A8]">
              ★★★★★
            </div>

            <p className="mb-4 text-sm font-normal leading-[1.55] text-slate-700">
              &quot;{review.review}&quot;
            </p>

            <div>
              <h4 className="text-sm font-semibold text-[#0F172A]">
                {review.name}
              </h4>

              <p className="text-xs font-normal text-[#64748B]">
                {review.role}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
