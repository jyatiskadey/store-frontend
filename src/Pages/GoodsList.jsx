import { useEffect, useState } from "react";
import API from "../api";
import Swal from "sweetalert2";

const GoodsList = () => {
  const [goods, setGoods] = useState([]);

  const fetchGoods = async () => {
    const res = await API.get("/goods");
    setGoods(res.data);
  };

  useEffect(() => {
    fetchGoods();
  }, []);

  const handleStockOut = async (id, currentQty) => {
    const { value: qtyToRemove } = await Swal.fire({
      title: "Stock Out",
      input: "number",
      inputLabel: "Quantity to remove",
      inputValue: 1,
      inputAttributes: {
        min: 1,
        max: currentQty,
      },
      showCancelButton: true,
    });

    if (!qtyToRemove || qtyToRemove <= 0) return;

    try {
      await API.patch(`/goods/stockout/${id}`, {
        quantity: Number(qtyToRemove),
      });
      await fetchGoods();
      Swal.fire("Success", "Stock updated", "success");
    } catch (err) {
      Swal.fire("Error", err.response.data.error || "Failed to update", "error");
    }
  };

  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 Goods List</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {goods.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.category}</td>
                <td className="py-2 px-4">{item.quantity}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      item.status === "In"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {item.quantity > 0 ? (
                    <button
                      onClick={() => handleStockOut(item._id, item.quantity)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Stock Out
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">No stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoodsList;
