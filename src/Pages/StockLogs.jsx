import { useEffect, useState } from "react";
import API from "../api";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const StockLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("ALL");
  const [itemNames, setItemNames] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/goods/logs");
        const sortedLogs = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setLogs(sortedLogs);
        setFilteredLogs(sortedLogs);
        const uniqueItems = [...new Set(sortedLogs.map((log) => log.itemName))];
        setItemNames(uniqueItems);
      } catch (err) {
        console.error("Error fetching stock logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (filter !== "ALL") {
      filtered = filtered.filter((log) => log.action === filter);
    }

    if (selectedItem !== "ALL") {
      filtered = filtered.filter((log) => log.itemName === selectedItem);
    }

    setFilteredLogs(filtered);
  }, [filter, logs, selectedItem]);

  const totalIN = logs.filter((log) => log.action === "IN").length;
  const totalOUT = logs.filter((log) => log.action === "OUT").length;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📜 Stock Logs</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        {/* Filter by Action */}
        <div className="space-x-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === "ALL"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilter("IN")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === "IN"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700"
            }`}
          >
            IN ({totalIN})
          </button>
          <button
            onClick={() => setFilter("OUT")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === "OUT"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-700"
            }`}
          >
            OUT ({totalOUT})
          </button>
        </div>

        {/* Filter by Item */}
        <div className="flex items-center gap-2">
          <label htmlFor="itemFilter" className="text-sm text-gray-700">
            Filter by Item:
          </label>
          <select
            id="itemFilter"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
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

      {/* Table or Message */}
      {loading ? (
        <div className="text-center text-gray-500 mt-20">Loading stock logs...</div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No logs match this filter.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Item</th>
                <th className="py-3 px-4 text-left">Action</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr
                  key={log._id}
                  className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="py-3 px-4">{log.itemName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                        log.action === "IN"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.action === "IN" ? (
                        <ArrowDownCircle className="w-4 h-4" />
                      ) : (
                        <ArrowUpCircle className="w-4 h-4" />
                      )}
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">{log.quantity}</td>
                  <td className="py-3 px-4">{log.category}</td>
                  <td className="py-3 px-4 text-gray-600">
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
