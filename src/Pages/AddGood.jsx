import { useEffect, useState } from "react";
import API from "../api";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const unitOptions = ["kg", "liter", "piece", "box", "packet", "meter"];

const AddGood = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    unitPrice: "",
  });

  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let categoryToSave = form.category;

    if (form.category === "custom" && customCategory.trim()) {
      try {
        const res = await API.post("/categories", { name: customCategory });
        categoryToSave = res.data.name;
        await fetchCategories();
      } catch (err) {
        setMessage("❌ Failed to save category");
        return;
      }
    }

    try {
      await API.post("/goods", {
        ...form,
        category: categoryToSave,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });

      setMessage("✅ Good added successfully!");

      setTimeout(() => {
        navigate("/goods-list");
      }, 1200);

      setForm({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        unitPrice: "",
      });
      setCustomCategory("");
    } catch (err) {
      setMessage("❌ Failed to add good");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="text-blue-600" size={28} />
        <h2 className="text-2xl font-semibold text-gray-800">Add New Stock Item</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 shadow-xl rounded-xl p-8 max-w-2xl mx-auto space-y-6"
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="off"
            placeholder="e.g. Chocolate"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.name}>
                {cat.name}
              </option>
            ))}
            <option value="custom">➕ Add New Category</option>
          </select>
        </div>

        {/* Custom Category */}
        {form.category === "custom" && (
          <div className="animate-fadeIn">
            <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-1">
              New Category Name
            </label>
            <input
              id="customCategory"
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Beverages"
              required
            />
          </div>
        )}

        {/* Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 100"
            />
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              id="unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Unit --</option>
              {unitOptions.map((u, i) => (
                <option key={i} value={u}>
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Per Unit Price ₹ <span className="text-red-500">*</span>
          </label>
          <input
            id="unitPrice"
            name="unitPrice"
            type="number"
            value={form.unitPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 15.00"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Add to Stock
        </button>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 text-center font-medium transition duration-300 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddGood;
