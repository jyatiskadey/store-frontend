import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  PlusCircle,
  List,
  LogOut,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Add Item", icon: <PlusCircle size={20} />, path: "/add-good" },
    { name: "Items List", icon: <List size={20} />, path: "/goods-list" },
    { name: "Logs", icon: <FileText size={20} />, path: "/logs" },
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      <motion.div
        animate={{ width: isOpen ? 240 : 72 }}
        transition={{ duration: 0.3 }}
        className="h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg overflow-hidden"
      >
        <nav className="mt-6 flex flex-col gap-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3 rounded-md mx-2 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-md"
                    : "hover:bg-gray-700"
                }`
              }
            >
              <div className="text-indigo-300">{item.icon}</div>
              {isOpen && <span className="text-white font-medium">{item.name}</span>}
            </NavLink>
          ))}

          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-4 px-5 py-3 mx-2 mt-2 rounded-md text-sm bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white hover:bg-red-600 transition-all duration-200"
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </nav>
      </motion.div>

      {/* Custom Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-gray-800">
            <h2 className="text-lg font-bold mb-3">Logout Confirmation</h2>
            <p className="text-sm mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
