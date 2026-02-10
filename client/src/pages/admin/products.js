import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Trash2,
  /*Upload,*/
  X,
  Loader2,
  Save,
  Image as ImageIcon,
} from "lucide-react";

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "apparel",
    quantity: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/product");
    const json = await res.json();
    if (json.success) setProducts(json.data);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setSelectedFiles(Array.from(e.target.files));
  };

  // Update openModal function
  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
    });
    setShowModal(true);
  };

  // Modified handleSubmit to handle both POST and PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    selectedFiles.forEach((file) => data.append("images", file));

    const url = editingId
      ? `http://localhost:5000/api/product/${editingId}`
      : "http://localhost:5000/api/product";

    try {
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body: data,
      });
      if (res.ok) {
        fetchProducts();
        closeModal();
      }
    } catch (err) {
      alert("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "apparel",
      quantity: "",
    });
    setSelectedFiles([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const res = await fetch(`http://localhost:5000/api/product/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl text-blue-600">
            <Package size={32} />
          </div>
          <div>
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">
              Inventory
            </h2>
            <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
              Shop Products
            </h1>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-xl shadow-blue-600/20"
        >
          <Plus size={18} /> Add Product
        </button>
      </header>

      {/* Product List Table */}
      <div className="bg-white dark:bg-[#161B22] border dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Preview
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Name & Category
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Price
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Stock
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            {products.map((p) => (
              <tr
                key={p._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-8 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={`http://localhost:5000${p.images[0]}`}
                      className="w-full h-full object-cover"
                      alt="product"
                    />
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-black dark:text-white uppercase text-sm">
                    {p.name}
                  </p>
                  <span className="text-[9px] font-black text-blue-600 uppercase">
                    {p.category}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm font-bold dark:text-white">
                  KES {p.price.toLocaleString()}
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black ${p.quantity > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {p.quantity} IN STOCK
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UPLOAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#002034] w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-10 right-10 text-slate-400"
            >
              <X size={28} />
            </button>
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter mb-8">
              New Product
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Product Name
                  </label>
                  <input
                    required
                    className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Category
                  </label>
                  <select
                    className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="apparel">Apparel</option>
                    <option value="books">Books</option>
                    <option value="media">Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Description
                </label>
                <textarea
                  required
                  rows="3"
                  className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Price (KES)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-50 dark:bg-[#000411] p-4 rounded-xl dark:text-white font-bold border dark:border-[#001D30]"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Multi-Image Upload */}
              <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center">
                <ImageIcon className="mx-auto text-blue-600 mb-2" size={32} />
                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 font-mono">
                  Select up to 5 images
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-[10px] text-slate-500"
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-4 flex gap-2 justify-center">
                    {selectedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-[10px] font-black text-blue-600"
                      >
                        IMG {i + 1}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                disabled={saving}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                {saving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Save Product
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
