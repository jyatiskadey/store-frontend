const Header = ({ toggleSidebar }) => {
    return (
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-700 hover:text-black"
        >
          ☰
        </button>
        <h1 className="text-lg font-bold text-gray-800">Store Keeper Dashboard</h1>
      </header>
    );
  };
  
  export default Header;
  