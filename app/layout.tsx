import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "ENVIRO TECH TECHNOLOGIES",
  description:
    "Solar Street Lights, Solar Panels, Solar Lithium Batteries and Road Safety Products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#FAFBFC] text-[#0F172A] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
