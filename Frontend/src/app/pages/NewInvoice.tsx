import React, { useEffect, useState } from "react";
import { Trash2, Plus, Save, CalendarDays } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { generateInvoicePdf } from "../../utils/generateInvoicePdf";
import { getCompany } from "../../utils/companyStorage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { generateInvoiceNumber } from "../../utils/invoiceNumber";

/* ---------- TYPES ---------- */

interface Client {
  id: string;
  companyName: string;
}

interface Product {
  id: string;
  name: string;
  quantity: number;   // ⭐ IMPORTANT (stock)
  price: number;
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
} 

interface LineItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  price: number;
  tax: number;
  total: number;
}

/* ---------- PAGE ---------- */

export const NewInvoice: React.FC = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [invoiceNumber] = useState(generateInvoiceNumber());

  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0,10));
  const [dueDate, setDueDate] = useState("");

  const [items, setItems] = useState<LineItem[]>([
    { id: Date.now().toString(), productId: "", name: "", qty: 1, price: 0, tax: 0, total: 0 },
  ]);

  const [notes, setNotes] = useState("");

  /* ---------- LOAD ---------- */

  useEffect(() => {
    const c = localStorage.getItem("clients");
    const p = localStorage.getItem("items");
    if (c) setClients(JSON.parse(c));
    if (p) setProducts(JSON.parse(p));
  }, []);

  /* ---------- CALCULATIONS ---------- */

  const calculate = (item: LineItem) => {
    const subtotal = item.qty * item.price;
    const taxAmount = subtotal * (item.tax / 100);
    return subtotal + taxAmount;
  };

  const selectProduct = (lineId: string, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const tax = prod.cgst + prod.sgst + prod.igst + prod.cess;

    setItems((prev) =>
      prev.map((l) => {
        if (l.id === lineId) {
          const updated = { ...l, productId, name: prod.name, price: prod.price, tax };
          return { ...updated, total: calculate(updated) };
        }
        return l;
      })
    );
  };

  const updateQty = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, qty };
          return { ...updated, total: calculate(updated) };
        }
        return l;
      })
    );
  };

  const addLine = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), productId: "", name: "", qty: 1, price: 0, tax: 0, total: 0 },
    ]);
  };

  const removeLine = (id: string) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id));
  };

  /* ---------- TOTALS ---------- */

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const taxTotal = items.reduce((s, i) => s + (i.total - i.qty * i.price), 0);
  const grandTotal = subtotal + taxTotal;
 

  /* ---------- SAVE ---------- */

const saveInvoice = async () => {
  if (!selectedClient) return alert("Select a client");
  // prevent empty lines
for (const line of items) {
  if (!line.productId) {
    alert("Please select product in all line items");
    return;
  }
}

  // ===== STEP 1: LOAD INVENTORY =====
  const storedItems = localStorage.getItem("items");
  let inventory = storedItems ? JSON.parse(storedItems) : [];

  // ===== STEP 2: VALIDATE STOCK =====
  for (const line of items) {

    const product = inventory.find((p:any) => p.id === line.productId);
    if (!product) continue;

    if (product.quantity < line.qty) {
      alert(`❌ Not enough stock for "${product.name}"\nAvailable: ${product.quantity}`);
      return; // BLOCK INVOICE
    }
  }

  // ===== STEP 3: DEDUCT STOCK (ONLY NOW) =====
  for (const line of items) {

    const product = inventory.find((p:any) => p.id === line.productId);
    if (!product) continue;

    product.quantity -= line.qty;
  }

  localStorage.setItem("items", JSON.stringify(inventory));

  // ===== STEP 4: SAVE INVOICE =====
  const clientObj = clients.find(c => c.id === selectedClient);

const company = getCompany();
const template = localStorage.getItem("selectedTemplate") || "classic";

const invoice = {
  id: Date.now().toString(),
  number: invoiceNumber,
  clientId: clientObj?.id,
  clientName: clientObj?.companyName,
  items,
  subtotal,
  tax: taxTotal,
  total: grandTotal,
  issueDate,
  dueDate,
  createdAt: new Date().toISOString(),
  status: "pending",
  company,        // ⭐ company profile
  template        // ⭐ selected template
};

  const stored = localStorage.getItem("invoices");
  const invoices = stored ? JSON.parse(stored) : [];
  invoices.push(invoice);
  localStorage.setItem("invoices", JSON.stringify(invoices));

const download = window.confirm(
  "Invoice saved successfully!\nDo you want to download the invoice PDF?"
);

if (download) {
  await generateInvoicePdf(invoice);
}

window.dispatchEvent(new Event("focus"));
navigate("/history");
};

  /* ---------- UI ---------- */

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">New Invoice</h1>
          <p className="text-gray-500">Create and send a new invoice</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">Cancel</Button>
          <Button onClick={saveInvoice} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Save className="w-4 h-4 mr-2"/>
            Save & Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* BILL TO */}
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <Label>Bill To</Label>
                <Select onValueChange={setSelectedClient}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c=>(
                      <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Invoice Number</Label>
                <Input className="mt-2 bg-gray-100" value={invoiceNumber} readOnly/>
              </div>

            </div>
          </Card>

          {/* DATES */}
<Card className="p-6">
  <div className="grid md:grid-cols-2 gap-6">

    {/* ISSUE DATE */}
    <div>
      <Label>Issue Date</Label>
      <div className="relative mt-2">

        <Input
          type="date"
          value={issueDate}
          onChange={(e)=>setIssueDate(e.target.value)}
          className="pr-12"
        />

        <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

      </div>
    </div>

    {/* DUE DATE */}
    <div>
      <Label>Due Date</Label>
      <div className="relative mt-2">

        <Input
          type="date"
          value={dueDate}
          onChange={(e)=>setDueDate(e.target.value)}
          className="pr-12"
        />

        <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

      </div>
    </div>

  </div>
</Card>


          {/* ITEMS */}
          <Card className="p-6">

            <div className="grid grid-cols-12 text-sm text-gray-500 mb-4">
              <div className="col-span-5">Item</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Total</div>
              <div className="col-span-1"></div>
            </div>

            {items.map(item=>(
              <div key={item.id} className="grid grid-cols-12 gap-3 mb-4 items-center">

                <div className="col-span-5">
                  <Select onValueChange={(v)=>selectProduct(item.id,v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select or type..." />
                    </SelectTrigger>
                    <SelectContent>
  {products.map(p=>(
    <SelectItem key={p.id} value={p.id}>
      {p.name} ({p.quantity} in stock)
    </SelectItem>
  ))}
</SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
  <div className="space-y-1">

    <Input
      type="number"
      min={1}
      value={item.qty}
      onChange={e=>updateQty(item.id,Number(e.target.value))}
      className="text-center"
    />

    {(() => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;

      if (item.qty > product.quantity)
        return <p className="text-xs text-red-500">Only {product.quantity} left in stock</p>;

      if (product.quantity <= 5)
        return <p className="text-xs text-yellow-500">Low stock</p>;

      return null;
    })()}

  </div>
</div>

                <div className="col-span-2 text-center font-medium">
                  ₹{item.price}
                </div>

                <div className="col-span-2 text-center font-semibold text-orange-600">
                  ₹{item.total.toFixed(2)}
                </div>

                <div className="col-span-1 text-center">
                  <Trash2 className="text-red-500 cursor-pointer" onClick={()=>removeLine(item.id)}/>
                </div>

              </div>
            ))}

            <Button variant="outline" onClick={addLine} className="w-full">
              <Plus className="w-4 h-4 mr-2"/>
              Add Line Item
            </Button>

          </Card>

          {/* NOTES */}
          <Card className="p-6">
            <Label>Notes</Label>
            <Textarea className="mt-2" placeholder="Payment terms, thank you note, etc." value={notes} onChange={e=>setNotes(e.target.value)}/>
          </Card>

        </div>

        {/* RIGHT SUMMARY */}
        <div className="space-y-6">

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Summary</h3>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax</span>
              <span>₹{taxTotal.toFixed(2)}</span>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg text-orange-600">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};
