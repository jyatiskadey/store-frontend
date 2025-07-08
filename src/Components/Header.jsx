const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-200">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-indigo-600 text-xl focus:outline-none transition duration-200"
      >
        ☰
      </button>

      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
        📦 Store Keeper Dashboard
      </h1>

      {/* Placeholder for future icons (user, settings, etc.) */}
      <div className="flex items-center space-x-4">
        {/* Example: Future profile dropdown or theme toggle */}
        {/* <button className="text-gray-600 hover:text-indigo-600 transition">
          <UserCircle size={20} />
        </button> */}
      </div>
    </header>
  );
};

export default Header;
