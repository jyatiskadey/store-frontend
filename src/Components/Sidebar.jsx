import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, PlusCircle, List, User, LogOut, FileText } from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <Home />, path: "/dashboard" },
    { name: "Add Good", icon: <PlusCircle />, path: "/add-good" },
    { name: "Goods List", icon: <List />, path: "/goods-list" },
    // { name: "Profile", icon: <User />, path: "/profile" },
    {
        name: "Logs",
        icon: <FileText />,
        path: "/logs",
      }
      
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "fire",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        navigate("/");
        Swal.fire("Logged out!", "You have been logged out.", "success");
      }
    });
  };

  return (
    <motion.div
      animate={{ width: isOpen ? 250 : 70 }}
      className="bg-gray-900 text-white h-screen shadow-md overflow-hidden"
      transition={{ duration: 0.3 }}
    >
      <nav className="mt-6 space-y-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 hover:bg-gray-800 transition ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full text-left hover:bg-red-600 transition"
        >
          <LogOut />
          {isOpen && <span>Logout</span>}
        </button>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
