import { Outlet } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Sidebar from "./sidebar.jsx";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-[#202124]">
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Home;
