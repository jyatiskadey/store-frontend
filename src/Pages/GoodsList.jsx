import { useEffect, useState } from "react";
import API from "../api";
import Loader from "../Components/Loader";
import { pdf } from "@react-pdf/renderer";
import InvoiceDocument from "../Components/InvoiceDocument";
import { toast } from "react-toastify";

const GoodsList = () => {
  const [goods, setGoods] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [buyer, setBuyer] = useState({ name: "", phone: "", address: "" });

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

  const toggleSelectItem = (item) => {
    const exists = selectedItems.find((i) => i._id === item._id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i._id !== item._id));
      const updatedQty = { ...quantities };
      delete updatedQty[item._id];
      setQuantities(updatedQty);
    } else {
      setSelectedItems([...selectedItems, item]);
      setQuantities({ ...quantities, [item._id]: 1 });
    }
  };

  const openConfirmModal = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to stock out.");
      return;
    }
    setShowConfirm(true);
  };

  const closeModal = () => {
    setShowConfirm(false);
    setSelectedItems([]);
    setQuantities({});
    setBuyer({ name: "", phone: "", address: "" });
  };

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const qty = Number(quantities[item._id] || 0);
      return total + qty * (item.unitPrice || 0);
    }, 0);
  };

  const handleConfirmStockOut = async () => {
    setSubmitting(true);
    try {
      const items = selectedItems.map((item) => ({
        _id: item._id,
        quantity: Number(quantities[item._id] || 0),
      }));
  
      await API.post("/goods/stockout-multiple", { items });
  
      const blob = await pdf(
        <InvoiceDocument
          buyer={buyer}
          items={selectedItems.map((item) => ({
            name: item.name,
            qty: Number(quantities[item._id]), // ✅ Key matches PDF component
            rate: item.unitPrice || 0,
          }))}
          gst={18}
        />
      ).toBlob();
  
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${Date.now()}.pdf`;
      link.click();
  
      toast.success("✅ Stock out completed & Invoice downloaded!");
      fetchGoods();
      closeModal();
    } catch (err) {
      console.error("Invoice generation failed:", err);
      toast.error("❌ Failed to stock out and generate invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">📋 Items List</h2>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4">Select</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {goods.map((item, idx) => (
                  <tr key={item._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.some((i) => i._id === item._id)}
                        onChange={() => toggleSelectItem(item)}
                      />
                    </td>
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${item.status === "In"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={openConfirmModal}
          >
            🧾 Stock Out & Generate Invoice
          </button>
        </>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Stock Out & Generate Bill
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Buyer Name"
                className="w-full border rounded px-3 py-2"
                value={buyer.name}
                onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full border rounded px-3 py-2"
                value={buyer.phone}
                onChange={(e) =>
                  setBuyer({ ...buyer, phone: e.target.value.replace(/\D/g, "") })
                }
                required
              />

              <textarea
                placeholder="Address"
                className="w-full border rounded px-3 py-2"
                value={buyer.address}
                onChange={(e) => setBuyer({ ...buyer, address: e.target.value })}
                required
              />

              {selectedItems.map((item) => (
                <div key={item._id}>
                  <div className="font-medium">
                    {item.name} ({item.unit}) - ₹{item.unitPrice}/unit
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={item.quantity}
                    value={quantities[item._id] || ""}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    className="w-full border rounded px-3 py-1 mt-1"
                  />
                </div>
              ))}

              <div className="mt-2 text-gray-700">
                Total: ₹{calculateTotal().toFixed(2)}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStockOut}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {submitting ? "Processing..." : "✅ Confirm & Download"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodsList;
