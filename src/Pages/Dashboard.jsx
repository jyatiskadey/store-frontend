import { useEffect, useRef, useState } from "react";
import API from "../api";
import {
  ArrowBigDown,
  ArrowBigUp,
  PackageX,
  LayoutGrid,
} from "lucide-react";
import Chart from "react-apexcharts";
import ContentLoader from "react-content-loader";
import Loader from "../Components/Loader";


const Dashboard = () => {
  const tableRef = useRef();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalItems: 0,
    outOfStock: 0,
    totalIn: 0,
    totalOut: 0,
    items: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/stats/dashboard");
        setStats(res.data);
        setLoading(true)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }finally{
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const $ = window.$;
    if (!stats.items || stats.items.length === 0) return;

    const timeout = setTimeout(() => {
      const table = $(tableRef.current);
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }

      table.DataTable({
        paging: true,
        searching: true,
        ordering: true,
        destroy: true,
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [stats.items]);

  // Chart Config
  const chartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#3B82F6", "#EF4444", "#10B981", "#8B5CF6"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
    },
    xaxis: {
      categories: ["Total Items", "Out of Stock", "Item In", "Item out"],
    },
    legend: { show: false },
  };

  const chartSeries = [
    {
      name: "Count",
      data: [
        stats.totalItems || 0,
        stats.outOfStock || 0,
        stats.totalIn || 0,
        stats.totalOut || 0,
      ],
    },
  ];

  return (
    <> 
    {
      loading ? (
        <Loader/>
    ):
    (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">
        📊 Dashboard Overview
      </h2>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-xl shadow mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Stock Stats Overview</h3>
        <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
      </div>

      {/* Top stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white hover:shadow-lg transition-all p-6 rounded-xl border border-gray-100 flex items-center gap-4">
          <LayoutGrid className="text-blue-500 w-10 h-10" />
          <div>
            <h3 className="text-sm text-gray-500">Total Items</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalItems}</p>
          </div>
        </div>

        <div className="bg-white hover:shadow-lg transition-all p-6 rounded-xl border border-gray-100 flex items-center gap-4">
          <PackageX className="text-red-500 w-10 h-10" />
          <div>
            <h3 className="text-sm text-gray-500">Out of Stock</h3>
            <p className="text-3xl font-bold text-red-500">{stats.outOfStock}</p>
          </div>
        </div>

        <div className="bg-white hover:shadow-lg transition-all p-6 rounded-xl border border-gray-100 flex items-center gap-4">
          <ArrowBigDown className="text-green-500 w-10 h-10" />
          <div>
            <h3 className="text-sm text-gray-500">Total Stock In Qty</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalIn}</p>
          </div>
        </div>

        <div className="bg-white hover:shadow-lg transition-all p-6 rounded-xl border border-gray-100 flex items-center gap-4">
          <ArrowBigUp className="text-purple-500 w-10 h-10" />
          <div>
            <h3 className="text-sm text-gray-500">Total Stock Out Qty</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalOut}</p>
          </div>
        </div>
      </div>

      {/* Item-wise Breakdown Table */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          📦 Item-wise Stock Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg shadow" ref={tableRef}>
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="py-2 px-4">Item</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">In Qty</th>
                <th className="py-2 px-4">Out Qty</th>
                <th className="py-2 px-4">Current Qty</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(stats.items) && stats.items.length > 0 ? (
                stats.items.map((item, idx) => (
                  <tr
                    key={item.name + idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">{item.category}</td>
                    <td className="py-2 px-4 font-semibold">{item.totalIn}{item.unit}</td>
                    <td className="py-2 px-4 text-red-600 font-semibold">{item.totalOut}{item.unit}</td>
                    <td className="py-2 px-4 font-bold text-green-600">{item.quantity}{item.unit}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Out"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )}
    </>
  );
};

export default Dashboard;
