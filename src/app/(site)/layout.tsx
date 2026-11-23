import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCta } from "@/components/site/StickyCta";
import { RouteProgressBar } from "@/components/site/RouteProgressBar";
import { SplashScreen } from "@/components/site/SplashScreen";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden">
      <SplashScreen />
      <RouteProgressBar />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-gold focus:p-3">Skip to content</a>
      <Header />
      <main id="main" className="flex-1 page-luxury-enter pb-16 md:pb-0">{children}</main>
      <Footer />
      <StickyCta />
    </div>
  );
}
