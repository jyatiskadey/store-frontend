import { useEffect, useState } from "react";
import API from "../api";
import { PlusCircle } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

const AddGood = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
  });
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let categoryToSave = form.category;
  
    // If custom category provided, save it first
    if (form.category === "custom" && customCategory.trim()) {
      try {
        const res = await API.post("/categories", { name: customCategory });
        categoryToSave = res.data.name;
        await fetchCategories(); // refresh category list
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
      });
  
      setMessage("✅ Good added successfully!");
  
      // ✅ Delay navigation by 1 second
      setTimeout(() => {
        navigate("/goods-list");
      }, 1000);
  
      // Clear form
      setForm({ name: "", category: "", quantity: "" });
      setCustomCategory("");
    } catch (err) {
      setMessage("❌ Failed to add good");
    }
  };
  

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="text-blue-600" size={28} />
        <h2 className="text-2xl font-semibold text-gray-800">Add New Good</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 max-w-lg space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            autoComplete="off"
            placeholder="e.g. Chocolate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.name}>
                {cat.name}
              </option>
            ))}
            <option value="custom">+ Add New</option>
          </select>
        </div>

        {form.category === "custom" && (
          <div>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter new category"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
            min="1"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="e.g. 100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add to Stock
        </button>

        {message && (
          <div
            className={`mt-4 text-center font-medium ${
              message.startsWith("✅")
                ? "text-green-600"
                : "text-red-500"
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
