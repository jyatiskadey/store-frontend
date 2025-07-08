import { useEffect, useState } from "react";
import API from "../api";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      });

      setMessage("✅ Good added successfully!");

      setTimeout(() => {
        navigate("/goods-list");
      }, 1000);

      setForm({ name: "", category: "", quantity: "" });
      setCustomCategory("");
    } catch (err) {
      setMessage("❌ Failed to add good");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="text-blue-600" size={28} />
        <h2 className="text-2xl font-semibold text-gray-800">Add New Good</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 shadow-xl rounded-xl p-8 max-w-lg mx-auto space-y-6"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="off"
            placeholder="e.g. Chocolate"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="e.g. Beverages"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="e.g. 100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Add to Stock
        </button>

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
