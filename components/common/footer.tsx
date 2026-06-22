"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { buildCategoryTree, categoryHref, fetchCategories } from "@/services/category-service";
import type { CategoryNode } from "@/types/category";
import { useEffect, useState } from "react";

export default function Footer() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);

  useEffect(() => {
    fetchCategories()
      .then((rows) => setCategories(buildCategoryTree(rows)))
      .catch((error) => console.error("Failed to load footer categories:", error));
  }, []);
  return (
    <footer className="mt-9 border-t border-[#E2E8F0] bg-[#F1F5F9]">

      <div className="container-page py-9 md:py-14">
        <div className="mx-auto max-w-[424px] lg:max-w-7xl">

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-4 md:gap-12">

          <div>
            <Image
              src="/images/brand/ett-smart-lighting-logo.png"
              alt="ETT Smart Lighting logo"
              width={180}
              height={80}
              className="mb-3 h-auto w-40 object-contain"
            />

            <p className="text-sm leading-[1.6] text-[#64748B]">
              Premium solar products for homes, farms,
              industry and roads. Built in India,
              engineered for the sun.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#0F172A]">
              Shop
            </h4>

            <ul className="space-y-2.5 text-sm text-[#64748B]">
              <li><Link href="/shop" className="transition hover:text-[#2D62A8]">All Products</Link></li>
              {categories.map((category) => (
                <li key={category.id}><Link href={categoryHref(category)} className="transition hover:text-[#2D62A8]">{category.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#0F172A]">
              Company
            </h4>

            <ul className="space-y-2.5 text-sm text-[#64748B]">
              <li><Link href="/contact" className="transition hover:text-[#2D62A8]">Contact</Link></li>
              <li><Link href="/quote" className="transition hover:text-[#2D62A8]">Get Quote</Link></li>
              <li><Link href="/" className="transition hover:text-[#2D62A8]">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-[#0F172A] whitespace-nowrap">
              ENVIRO TECH TECHNOLOGIES
            </h3>

            <h4 className="mb-3 text-sm font-semibold text-[#0F172A]">
              Reach us
            </h4>

            <div className="space-y-3 text-sm text-[#64748B]">

              <div className="flex items-center gap-3">
                <Phone size={16} />
                <a href="tel:+917479766602" className="transition hover:text-[#2D62A8]">+91 7479766602</a>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} />
                <a href="mailto:backenviro@gmail.com" className="transition hover:text-[#2D62A8]">backenviro@gmail.com</a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>
                  ENVIRO TECH TECHNOLOGIES<br />
                  NS-11(P-1)<br />
                  Industrial Estate, Bela<br />
                  Phase-1, Near P&amp;M Mall<br />
                  Muzaffarpur, Bihar - 842005
                </span>
              </div>

            </div>
          </div>

        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[#E2E8F0] pt-5 text-xs text-[#64748B] md:mt-12 md:flex-row md:justify-between md:text-sm">
          <span>© 2026 ENVIRO TECH TECHNOLOGIES. All rights reserved.</span>

          <span>
            GST · Razorpay Secure Checkout
          </span>
        </div>

      </div>
      </div>

    </footer>
  );
}
