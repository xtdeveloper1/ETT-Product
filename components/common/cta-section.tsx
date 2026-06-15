import Link from "next/link";

export default function CTASection() {
  return (
    <section className="container-page py-9 md:py-20">
      <div className="mx-auto flex max-w-[424px] flex-col gap-5 rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] md:max-w-7xl md:flex-row md:items-center md:justify-between md:p-10">

        <div className="flex-1 text-left">
          <h2 className="mb-2 text-[20px] font-bold tracking-[-0.02em] text-[#0F172A] md:text-2xl">
            Need a custom solar quote?
          </h2>

          <p className="max-w-md text-sm font-normal leading-[1.5] text-[#64748B] md:text-base">
            Tell us your load and location — we&apos;ll size the system for you.
          </p>
        </div>

        <div className="grid w-full flex-shrink-0 grid-cols-2 gap-3 md:w-auto">
          <Link href="/quote" className="inline-flex h-11 items-center justify-center rounded-full bg-[#2D62A8] px-4 text-sm font-medium text-white shadow-[0_2px_7px_rgba(45,98,168,0.25)] transition hover:bg-[#24538F] md:px-7">
            Request a Quote
          </Link>

          <Link href="/shop" className="inline-flex h-11 items-center justify-center rounded-full border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#0F172A] shadow-[0_2px_7px_rgba(15,23,42,0.06)] transition hover:bg-[#FAFBFC] md:px-7">
            Browse Catalogue
          </Link>
        </div>

      </div>
    </section>
  );
}
