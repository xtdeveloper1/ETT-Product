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
      <div className="relative aspect-square w-full bg-white">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="px-3 py-2.5">
        <h3 className="text-sm font-medium leading-tight text-[#0F172A]">
          {title}
        </h3>
      </div>
    </Link>
  );
}
