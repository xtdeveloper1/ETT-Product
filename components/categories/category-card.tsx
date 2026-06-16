import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
  href: string;
}

export default function CategoryCard({ title, image, href }: Props) {
  return (
    <Link href={href} className="group block cursor-pointer overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-white transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "100%" }}>
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <Image
            src={image}
            alt={title}
            width={300}
            height={300}
            className="h-auto w-full object-cover transition duration-300 group-hover:scale-105"
            priority={false}
            unoptimized={image.startsWith("http") || image.includes("supabase")}
          />
        </div>
      </div>

      <div className="px-3 py-2.5">
        <h3 className="text-sm font-medium leading-tight text-[#0F172A]">
          {title}
        </h3>
      </div>
    </Link>
  );
}
