import React from "react";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

const templates = [
  { id: "classic", name: "Classic White" },
  { id: "modern", name: "Modern Minimal" },
  { id: "dark", name: "Dark Professional" },
];

export const Templates: React.FC = () => {
  const navigate = useNavigate();

  const selectTemplate = (id:string) => {
    localStorage.setItem("invoiceTemplate", id);
    navigate("/new-invoice");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Invoice Templates</h1>
      <p className="text-gray-500">Choose a design for your invoices</p>

      <div className="grid md:grid-cols-3 gap-6">

        {templates.map(t => (
          <Card
            key={t.id}
            onClick={() => selectTemplate(t.id)}
            className="p-6 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition rounded-2xl"
          >
            <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mb-4"></div>
            <h2 className="text-xl font-semibold">{t.name}</h2>
            <p className="text-gray-500 text-sm">Click to use this template</p>
          </Card>
        ))}

      </div>
    </div>
  );
};