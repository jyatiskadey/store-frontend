import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import AddGood from "./Pages/AddGood";
import GoodsList from "./Pages/GoodsList";
import Profile from "./Pages/Profile";
import PrivateRoute from "./Components/PrivateRoute";
import StockLogs from "./Pages/StockLogs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-good" element={<AddGood />} />
          <Route path="goods-list" element={<GoodsList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="logs" element={<StockLogs />} />

        </Route>
      </Routes>
      
    </Router>
  );
}

export default App;
