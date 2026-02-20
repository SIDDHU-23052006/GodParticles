import React, { useEffect, useState } from "react";
import { Search, Plus, Mail, Phone, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";

interface Client {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
}

export const Clients: React.FC = () => {

  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Client>({
  id: "",
  companyName: "",
  email: "",
  phone: "",
  address: "",
});

  // LOAD
  useEffect(() => {
    const stored = localStorage.getItem("clients");
    if (stored) setClients(JSON.parse(stored));
  }, []);

  // SAVE
  const saveClients = (data: Client[]) => {
    setClients(data);
    localStorage.setItem("clients", JSON.stringify(data));
  };

  // ADD CLIENT
  const handleSubmit = () => {
    if (!form.companyName || !form.email || !form.phone) return;

    const newClient = { ...form, id: Date.now().toString() };
    const updated = [...clients, newClient];
    saveClients(updated);

    setShowModal(false);
    setForm({ id: "", companyName: "", email: "", phone: "", address: ""});
  };

  // DELETE
  const deleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    saveClients(updated);
  };

  const filtered = clients.filter(c =>
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getClientStatus = (clientId:string) => {
  const stored = localStorage.getItem("invoices");
  if(!stored) return "Pending";

  const invoices = JSON.parse(stored).filter((i:any)=>i.clientId===clientId);

  if(invoices.length===0) return "Pending";

  const unpaid = invoices.some((i:any)=>i.status==="pending");

  return unpaid ? "Pending" : "Paid";
};

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Clients</h1>
          <p className="text-gray-600">Your business customers</p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 flex gap-2"
        >
          <Plus /> Add Client
        </Button>
      </div>

      {/* SEARCH */}
      <Card className="p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search company..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filtered.map(client => (
          <Card key={client.id} className="p-6 hover:shadow-xl transition">

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{client.companyName}</h3>

                <span
  className={`text-xs px-2 py-1 rounded-full font-medium
  ${
    getClientStatus(client.id) === "Paid"
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-600"
  }`}
>
  {getClientStatus(client.id)}
</span>

              </div>

              <div className="flex gap-2">
                <Pencil className="cursor-pointer" size={18} />
                <Trash2
                  className="cursor-pointer text-red-500"
                  size={18}
                  onClick={() => deleteClient(client.id)}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex gap-2"><Mail size={16}/> {client.email}</div>
              <div className="flex gap-2"><Phone size={16}/> {client.phone}</div>
              <div className="flex gap-2"><MapPin size={16}/> {client.address}</div>
            </div>

          </Card>
        ))}

        {clients.length === 0 && (
          <p className="text-gray-500">No clients added yet.</p>
        )}

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="p-8 w-[420px] space-y-4">

            <h2 className="text-xl font-semibold">Add Client</h2>

            <Input placeholder="Company Name"
              value={form.companyName}
              onChange={e => setForm({ ...form, companyName: e.target.value })}
            />

            <Input placeholder="Company Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            <Input placeholder="Phone Number"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />

            <Input placeholder="Address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />


            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="bg-orange-500 text-white" onClick={handleSubmit}>Save</Button>
            </div>

          </Card>
        </div>
      )}
    </div>
  );
};
