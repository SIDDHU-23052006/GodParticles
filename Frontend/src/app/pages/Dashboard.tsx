import React, { useEffect, useState } from "react";
import {
  IndianRupeeIcon,
  FileText,
  Users as UsersIcon,
  ShoppingCart,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Invoice {
  id: string;
  number: string;
  client: string;
  clientId: string;
  total: number;
  status: "paid" | "pending";
  issueDate: string;
  dueDate: string;
}


export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // LOAD INVOICES
  useEffect(() => {

  const loadInvoices = () => {
    const stored = localStorage.getItem("invoices");
    if (!stored) return;

    const parsed: Invoice[] = JSON.parse(stored);
    setInvoices(parsed);
    generateChart(parsed);
  };

  loadInvoices();

  // realtime refresh when invoices change
  window.addEventListener("storage", loadInvoices);

  return () => {
    window.removeEventListener("storage", loadInvoices);
  };

}, []);


  // GENERATE MONTHLY REVENUE
  const generateChart = (data: Invoice[]) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const revenueMap: any = {};
    months.forEach(m => (revenueMap[m] = 0));

    data.forEach(inv => {
      if (inv.status === "paid") {
        const d = new Date(inv.issueDate);
        const month = months[d.getMonth()];
        revenueMap[month] += Number(inv.total);
      }
    });

    const formatted = months.map(m => ({
      name: m,
      revenue: revenueMap[m],
    }));

    setChartData(formatted);
  };

  // CALCULATIONS
  const totalRevenue = invoices
    .filter(i => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.total), 0);

  const paidInvoices = invoices.filter(i => i.status === "paid").length;
  const pendingInvoices = invoices.filter(i => i.status === "pending").length;

  // EMPTY STATE
  if (invoices.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <div className="bg-orange-100 p-8 rounded-full mb-6">
          <FileText className="w-12 h-12 text-orange-500" />
        </div>

        <h2 className="text-3xl font-semibold mb-4">
          No invoices yet
        </h2>

        <p className="text-gray-500 mb-8 max-w-md">
          Start by creating your first invoice. Once you create invoices,
          revenue analytics and reports will appear here automatically.
        </p>

        <button
          onClick={() => navigate("/new-invoice")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl flex items-center gap-2 shadow-lg"
        >
          <PlusCircle />
          Create First Invoice
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name || "User"} 👋
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <StatCard
          title="Total Revenue"
          value={`${totalRevenue}`}
          subtitle="From paid invoices"
          icon={IndianRupeeIcon}
          color="text-orange-500"
          bg="bg-orange-100"
        />

        <StatCard
          title="Invoices Sent"
          value={invoices.length}
          subtitle={`${pendingInvoices} pending`}
          icon={FileText}
          color="text-orange-500"
          bg="bg-orange-100"
        />

        <StatCard
          title="Clients"
          value={[...new Set(invoices.map(i => i.client))].length}
          subtitle="Active clients"
          icon={UsersIcon}
          color="text-blue-500"
          bg="bg-blue-100"
        />

        <StatCard
          title="Paid Invoices"
          value={paidInvoices}
          subtitle="Completed payments"
          icon={ShoppingCart}
          color="text-green-500"
          bg="bg-green-100"
        />

      </div>

      {/* CHART + RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* REVENUE CHART */}
        <Card className="p-6 lg:col-span-2 shadow-xl rounded-2xl">
          <h3 className="text-xl font-semibold mb-6">Revenue Overview</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* RECENT INVOICES */}
        <Card className="p-6 shadow-xl rounded-2xl">
          <h3 className="text-xl font-semibold mb-6">Recent Invoices</h3>

          <div className="space-y-4">
            {invoices.slice(-5).reverse().map(inv => (
              <div
                key={inv.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">{inv.client}</p>
<p className="text-sm text-gray-500">{inv.issueDate}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">₹{inv.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full 
                    ${inv.status === "paid"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                    }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, color, bg }: any) => (
  <Card className="p-6 rounded-2xl shadow-md hover:shadow-xl transition">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-semibold">{value}</h3>
      </div>

      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </Card>
);
