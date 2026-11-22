import { Outlet } from "react-router";
import Navbar from "../ui/Navbar";
import Footer from "../Footer";
import AiChatWidget from "../chat/AiChatWidget";

export function UserLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AiChatWidget />
    </div>
  );
}

export default UserLayout;
