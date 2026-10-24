import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/landing/Footer";

export default function LandingLayout() {
  return (
    <div className="min-h-screen">
      <Navbar showAnchors />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}