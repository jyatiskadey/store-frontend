import { useEffect, useState } from "react";
import API from "../api";
import Loader from "../Components/Loader";

const GoodsList = () => {
  const [goods, setGoods] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qtyToRemove, setQtyToRemove] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // disable confirm btn while patching

  const fetchGoods = async () => {
    setLoading(true);
    try {
      const res = await API.get("/goods");
      setGoods(res.data);
    } catch (err) {
      console.error("Failed to fetch goods", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoods();
  }, []);

  const openConfirmModal = (item) => {
    setSelectedItem(item);
    setQtyToRemove("1");
    setShowConfirm(true);
  };

  const handleConfirmStockOut = async () => {
    const qty = Number(qtyToRemove);

    if (!qty || qty <= 0 || qty > selectedItem.quantity) {
      alert("❌ Invalid quantity");
      return;
    }

    setSubmitting(true);

    try {
      await API.patch(`/goods/stockout/${selectedItem._id}`, { quantity: qty });
      alert("✅ Stock updated successfully");
      setShowConfirm(false);
      setSelectedItem(null);
      setQtyToRemove("");
      fetchGoods(); // refresh list
    } catch (err) {
      alert(`❌ Error: ${err.response?.data?.error || "Failed to update"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowConfirm(false);
    setSelectedItem(null);
    setQtyToRemove("");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">📋 Items List</h2>

      {loading ? (
        <Loader />
      ) : goods.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg">No items found. Please add some item.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {goods.map((item, idx) => (
                <tr
                  key={item._id}
                  className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">{item.quantity}</td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4">
                    {item.quantity > 0 ? (
                      <button
                        onClick={() => openConfirmModal(item)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                      >
                        Stock Out
                      </button>
                    ) : (
                      <span className="text-gray-400 italic text-sm">No stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Stock Out</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to stock out{" "}
              <strong>{selectedItem.name}</strong>?
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity to remove (Max: {selectedItem.quantity})
            </label>
            <input
              type="number"
              value={qtyToRemove}
              min="1"
              max={selectedItem.quantity}
              onChange={(e) => setQtyToRemove(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStockOut}
                disabled={submitting}
                className={`px-4 py-2 rounded text-white ${
                  submitting
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {submitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodsList;
