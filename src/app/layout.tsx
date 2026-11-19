import type { Metadata, Viewport } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import { DemoNav } from "@/components/DemoNav";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio Carol Bocão | Nails & Beauty",
  description:
    "Unhas, pés, cílios e cabelo com hora marcada na Gleba do Pêssego, São Paulo. Agende pelo site ou pelo WhatsApp.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#B0306A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${dmSans.variable}`}>
      <body>
        <DemoNav />
        {children}
      </body>
    </html>
  );
}
