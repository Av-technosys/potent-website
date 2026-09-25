import Footer from "../components/common/Footer";
import { Navbar } from "../components/common/Navbar";
import { MobileBottomNav } from "../components/common/MobileBottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pb-14 md:pb-0">
        {children}
      </div>
      <Footer />
      <MobileBottomNav />
    </>
  );
}