import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/common/footer";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F8FAFC] px-6 py-16">
        <section className="mx-auto max-w-2xl text-center">
          <p className="text-[96px] font-bold leading-none text-blue-600 md:text-[140px]">
            404
          </p>

          <h1 className="mt-6 text-3xl font-bold text-slate-900 md:text-5xl">
            Page Not Found
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-500 md:text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#2563EB] px-7 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Go Home
            </Link>

            <Link
              href="/shop"
              className="inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              Shop Products
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
