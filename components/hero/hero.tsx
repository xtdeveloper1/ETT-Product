import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="container-page pt-7 pb-9 md:pt-14 md:pb-16">
      <div className="mx-auto grid max-w-[424px] gap-7 lg:max-w-7xl lg:grid-cols-2 lg:items-center lg:gap-12">

        {/* LEFT */}
        <div className="order-2 max-w-md lg:order-1 lg:max-w-xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#FAFBFC] px-3 py-1.5 text-[13px] font-medium leading-none text-[#64748B] shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2D62A8]" />
            Trusted by 12,000+ projects
          </div>

          {/* Heading */}
          <h1 className="mt-5 text-[23px] font-semibold leading-[1.13] tracking-[-0.02em] text-[#0F172A] sm:text-3xl lg:whitespace-nowrap lg:text-[42px] lg:leading-[1.04] xl:text-[46px]">
            Solar that just works.
          </h1>

          {/* Description */}
       <p className="mt-3 max-w-[330px] text-sm leading-[1.45] text-[#64748B] md:text-base md:leading-normal">
        Street lights, panels, Solar Lithium Batteries and road safety gear —
        delivered across India.
       </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2D62A8] px-6 text-sm font-medium text-white shadow-[0_2px_7px_rgba(45,98,168,0.28)] transition hover:bg-[#24538F]"
            >
              Shop solar
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/quote"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#E2E8F0] bg-white px-6 text-sm font-medium text-[#0F172A] shadow-[0_2px_7px_rgba(15,23,42,0.08)] transition hover:bg-[#FAFBFC]"
            >
              Get a quote
            </Link>

          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-2 lg:mt-10 lg:flex lg:gap-10">

            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-3 py-3">
              <h3 className="text-lg font-semibold leading-none text-[#0F172A] sm:text-3xl">
                12+
              </h3>
              <p className="mt-1 text-[11px] text-[#64748B] sm:text-sm">
                Years
              </p>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-3 py-3">
              <h3 className="text-lg font-semibold leading-none text-[#0F172A] sm:text-3xl">
                450+
              </h3>
              <p className="mt-1 text-[11px] text-[#64748B] sm:text-sm">
                Products
              </p>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-3 py-3">
              <h3 className="text-lg font-semibold leading-none text-[#0F172A] sm:text-3xl">
                180
              </h3>
              <p className="mt-1 text-[11px] text-[#64748B] sm:text-sm">
                Cities
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="relative order-1 aspect-[1.6] w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:order-2 lg:h-[520px] lg:aspect-auto">

          <Image
            src="/images/hero/solar-light.jpg"
            alt="Solar Street Light"
            fill
            priority
            className="object-cover"
          />

        </div>

      </div>
    </section>
  );
}
