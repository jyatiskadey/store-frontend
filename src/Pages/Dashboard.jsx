import { useEffect, useState } from "react";
import API from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const res = await API.get("/stats/dashboard");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: "Stock In", qty: stats.totalIn || 0 },
    { name: "Stock Out", qty: stats.totalOut || 0 },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📊 Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700">Total Items</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-500">{stats.outOfStock}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700">Quantity</h3>
          <p className="text-2xl font-bold text-green-600">{(stats.totalIn || 0) + (stats.totalOut || 0)}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-700 mb-4">Stock Movement</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="qty" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;