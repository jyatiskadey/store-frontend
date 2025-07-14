import { useEffect, useState } from "react";
import API from "../api";
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react";
import ContentLoader from "react-content-loader";

const StatCard = ({ title, value, bgColor, textColor }) => (
  <div className={`flex-1 px-4 py-3 rounded-md shadow ${bgColor} ${textColor}`}>
    <div className="text-sm font-medium">{title}</div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
);

const StockLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState("ALL");
  const [itemNames, setItemNames] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalIN = logs.filter((log) => log.action === "IN").length;
  const totalOUT = logs.filter((log) => log.action === "OUT").length;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/goods/logs");
        const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(sorted);
        setFilteredLogs(sorted);
        setItemNames([...new Set(sorted.map((log) => log.itemName))]);
      } catch (err) {
        console.error("Failed to load logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    let temp = [...logs];
    if (filter !== "ALL") temp = temp.filter((log) => log.action === filter);
    if (selectedItem !== "ALL") temp = temp.filter((log) => log.itemName === selectedItem);
    setFilteredLogs(temp);
  }, [filter, logs, selectedItem]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Stock Logs</h2>

      {/* Summary Cards */}
      <div className="flex gap-4 mb-6">
        <StatCard title="Total Entries" value={logs.length} bgColor="bg-gray-100" textColor="text-gray-800" />
        <StatCard title="Stock IN" value={totalIN} bgColor="bg-green-100" textColor="text-green-800" />
        <StatCard title="Stock OUT" value={totalOUT} bgColor="bg-red-100" textColor="text-red-800" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div className="flex gap-2">
          {["ALL", "IN", "OUT"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1 rounded-full font-medium transition ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Filter by Item:</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="border text-sm px-2 py-1 rounded-md"
          >
            <option value="ALL">All Items</option>
            {itemNames.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table or Loader */}
      {loading ? (
        <ContentLoader viewBox="0 0 400 160" height={160} width={400} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
          <rect x="0" y="10" rx="4" ry="4" width="400" height="20" />
          <rect x="0" y="40" rx="4" ry="4" width="400" height="20" />
          <rect x="0" y="70" rx="4" ry="4" width="400" height="20" />
        </ContentLoader>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No logs match your filter.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl border border-gray-200 shadow">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={log._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2">{log.itemName}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                        log.action === "IN"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.action === "IN" ? <ArrowDownCircle className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-2">{log.quantity}{log.unit}</td>
                  <td className="px-4 py-2">{log.category}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(log.date).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockLogs;
