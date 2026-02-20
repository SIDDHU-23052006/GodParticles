import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { CheckCircle2, Trash2, Download, FileText } from "lucide-react";
import { generateInvoicePdf } from "../../utils/generateInvoicePdf";

export const History: React.FC = () => {

  const [invoices, setInvoices] = useState<any[]>([]);

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    loadInvoices();
    window.addEventListener("focus", loadInvoices);
    return () => window.removeEventListener("focus", loadInvoices);
  }, []);

  const loadInvoices = () => {
    const stored = localStorage.getItem("invoices");
    if (stored) setInvoices(JSON.parse(stored));
    else setInvoices([]);
  };

  const save = (data:any[]) => {
    localStorage.setItem("invoices", JSON.stringify(data));
    setInvoices(data);
  };

  /* -------- MARK AS PAID -------- */
  const markPaid = (id:string) => {
    const updated = invoices.map(inv =>
      inv.id === id
        ? { ...inv, status: "paid", paidAt: new Date().toISOString() }
        : inv
    );
    save(updated);
  };

  /* -------- DELETE -------- */
  const deleteInvoice = (id:string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (!confirmDelete) return;

    const updated = invoices.filter(inv => inv.id !== id);
    save(updated);
  };

  /* -------- FORMAT MONEY -------- */
  const money = (amt:number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amt);

  /* ---------------- EMPTY STATE ---------------- */
  if(invoices.length === 0){
    return (
      <div className="flex flex-col items-center justify-center mt-24 text-center">
        <div className="bg-orange-100 p-6 rounded-full mb-6 animate-pulse">
          <FileText className="w-12 h-12 text-orange-500"/>
        </div>
        <h2 className="text-2xl font-semibold mb-2">No Invoices Yet</h2>
        <p className="text-gray-500 max-w-md">
          Once you create invoices they will appear here. You can download,
          mark as paid, or manage them anytime.
        </p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-semibold mb-2">Invoice History</h1>
        <p className="text-gray-500">
          Manage, download and track all your invoices
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl shadow-xl">

        <table className="w-full text-sm">

          {/* HEADER */}
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Issue Date</th>
              <th className="p-4 text-left">Due Date</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {invoices.map(inv => (
              <tr
                key={inv.id}
                className="border-t hover:bg-orange-50/40 transition-all duration-200"
              >

                <td className="p-4 font-semibold text-gray-800">
                  {inv.number}
                </td>

                <td className="p-4">{inv.clientName}</td>

                <td className="p-4">{inv.issueDate}</td>

                <td className="p-4">{inv.dueDate || "-"}</td>

                <td className="p-4 font-semibold text-orange-600">
                  {money(inv.total)}
                </td>

                {/* STATUS */}
                <td className="p-4 capitalize">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium transition
                    ${inv.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {inv.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 flex flex-wrap gap-4">

                  {/* MARK PAID */}
                  {inv.status === "pending" && (
                    <button
                      onClick={() => markPaid(inv.id)}
                      className="text-green-600 hover:text-green-700 flex items-center gap-1 transition hover:scale-105"
                    >
                      <CheckCircle2 size={18}/> Paid
                    </button>
                  )}

                  {/* DOWNLOAD */}
                  <button
                    onClick={() => generateInvoicePdf(inv)}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition hover:scale-105"
                  >
                    <Download size={18}/> Download
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteInvoice(inv.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 transition hover:scale-105"
                  >
                    <Trash2 size={18}/> Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </Card>
    </div>
  );
};