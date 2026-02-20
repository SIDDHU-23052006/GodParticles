import React, { useEffect, useState } from "react";
import { Plus, Trash2, Package } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";

interface Item {
  id: string;
  name: string;
  quantity: number;
  description: string;
  price: number;
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
}

export const Items: React.FC = () => {

  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Item>({
    id: "",
    name: "",
    quantity: 1,
    description: "",
    price: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    cess: 0
  });

  /* LOAD ITEMS */
useEffect(() => {
  const load = () => {
    const stored = localStorage.getItem("items");
    if (stored) setItems(JSON.parse(stored));
  };

  load();

  window.addEventListener("focus", load);
  return () => window.removeEventListener("focus", load);
}, []);

  const saveItems = (data: Item[]) => {
    setItems(data);
    localStorage.setItem("items", JSON.stringify(data));
  };

  /* ADD ITEM */
  const addItem = () => {
    if (!form.name || form.price <= 0) return;

    const newItem = { ...form, id: Date.now().toString() };
    const updated = [...items, newItem];

    saveItems(updated);
    setShowModal(false);

    setForm({
      id: "",
      name: "",
      quantity: 1,
      description: "",
      price: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0
    });
  };

  /* DELETE */
  const deleteItem = (id: string) => {
    saveItems(items.filter(i => i.id !== id));
  };

  const getStockStatus = (qty: number) => {
    if (qty === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-600" };
    if (qty <= 5) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-600" };
    return { text: "In Stock", color: "bg-green-100 text-green-600" };
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="text-gray-500">Manage your inventory items</p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white flex gap-2 px-6 py-3 rounded-xl shadow-lg transition hover:scale-105"
        >
          <Plus /> Add Product
        </Button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {items.map(item => {

          const totalTax = item.cgst + item.sgst + item.igst + item.cess;
          const finalPrice = item.price + (item.price * totalTax / 100);
          const stock = getStockStatus(item.quantity);

          return (
            <Card
              key={item.id}
              className="p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-3">

                <div className="flex gap-3 items-center">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Package className="text-orange-500" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${stock.color}`}>
                      {stock.text}
                    </span>
                  </div>
                </div>

                <Trash2
                  className="text-red-500 cursor-pointer hover:scale-110 transition"
                  onClick={() => deleteItem(item.id)}
                />
              </div>

              <p className="text-sm text-gray-500 mb-4 min-h-[40px]">
                {item.description || "No description"}
              </p>

              <div className="space-y-1 text-sm">
                <p><b>Stock:</b> {item.quantity}</p>
                <p><b>Base Price:</b> ₹{item.price}</p>
                <p><b>GST:</b> {totalTax}%</p>
                <p className="text-orange-600 font-semibold text-lg">
                  ₹{finalPrice.toFixed(2)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">

          <Card className="p-8 w-[480px] rounded-2xl space-y-4 animate-scaleIn">

            <h2 className="text-2xl font-semibold mb-2">Add New Product</h2>

            <Input placeholder="Product Name"
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <Input placeholder="Quantity (Stock)"
              type="number"
              onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
            />

            <Input placeholder="Description"
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <Input placeholder="Price ₹"
              type="number"
              onChange={e => setForm({ ...form, price: Number(e.target.value) })}
            />

            <h3 className="font-semibold mt-4">GST Details</h3>

            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="CGST %" type="number" onChange={e => setForm({ ...form, cgst: Number(e.target.value) })}/>
              <Input placeholder="SGST %" type="number" onChange={e => setForm({ ...form, sgst: Number(e.target.value) })}/>
              <Input
  placeholder="IGST %"
  type="number"
  onChange={e => setForm({ ...form, igst: Number(e.target.value) })}
/>
              <Input placeholder="CESS %" type="number" onChange={e => setForm({ ...form, cess: Number(e.target.value) })}/>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="bg-orange-500 text-white" onClick={addItem}>Save Product</Button>
            </div>

          </Card>
        </div>
      )}
    </div>
  );
};