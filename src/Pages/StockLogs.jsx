import { useEffect, useState } from "react";
import API from "../api";

const StockLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await API.get("/goods/logs");
      setLogs(res.data);
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📜 Stock Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-2 px-4 text-left">Item</th>
              <th className="py-2 px-4 text-left">Action</th>
              <th className="py-2 px-4 text-left">Qty</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="py-2 px-4">{log.itemName}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      log.action === "IN"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="py-2 px-4">{log.quantity}</td>
                <td className="py-2 px-4">{log.category}</td>
                <td className="py-2 px-4">
                  {new Date(log.date).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockLogs;
