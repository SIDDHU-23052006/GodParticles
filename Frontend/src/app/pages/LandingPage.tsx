import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CheckCircle2,
  FileText,
  Users,
  BarChart3,
  ShieldCheck,
  Clock,
  ArrowDown,
} from "lucide-react";
import { Button } from "../components/ui/button";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  // navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden relative">

      {/* GLOW BACKGROUND */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full" />
      <div className="absolute top-[45%] -right-40 w-[500px] h-[500px] bg-orange-400/20 blur-[140px] rounded-full" />

      {/* ================= NAVBAR ================= */}
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
        <header
          className={`w-full max-w-6xl transition-all duration-300 rounded-2xl 
          ${scrolled
              ? "bg-white/80 backdrop-blur-xl shadow-lg border border-orange-100"
              : "bg-white/60 backdrop-blur-md border border-orange-50"
            }`}
        >
          <div className="flex items-center px-8 py-4">

  {/* LEFT : Logo */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow">
      <Package className="w-6 h-6 text-white" />
    </div>
    <span className="text-xl font-bold tracking-tight">
      Invoice Creator
    </span>
  </div>

  {/* RIGHT SIDE (push to right) */}
  <div className="ml-auto flex items-center gap-8">

    {/* Nav links */}
    <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
      <a href="#features" className="hover:text-orange-500 transition">
        Features
      </a>
      <a href="#workflow" className="hover:text-orange-500 transition">
        Workflow
      </a>
    </nav>

    {/* Sign in */}
    <Button
      onClick={() => navigate("/login")}
      className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-xl shadow-md"
    >
      Sign in
    </Button>

  </div>
</div>

        </header>
      </div>

      {/* ================= HERO ================= */}
      <section className="pt-44 pb-32 text-center px-6 relative">

        <h1 className="text-6xl md:text-7xl font-bold max-w-5xl mx-auto leading-tight">
          Professional Billing
          <span className="text-orange-500"> Without Complexity</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-8 leading-relaxed">
          Create GST-ready invoices, manage clients, and track payments from one
          modern dashboard built for freelancers, startups and small businesses.
        </p>

        <div className="flex gap-5 justify-center mt-12 flex-wrap">
          <Button
            onClick={() => navigate("/signup")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-6 text-lg rounded-xl shadow-xl"
          >
            Create Free Account →
          </Button>

          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="px-10 py-6 text-lg rounded-xl border-gray-300"
          >
            Open Dashboard
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center mt-20 text-gray-400 animate-bounce">
          <span className="text-sm">Scroll to explore</span>
          <ArrowDown className="mt-2" />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-28 px-6">
        <h2 className="text-4xl font-bold text-center mb-20">
          Everything needed for invoicing
        </h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <Feature icon={<FileText />} title="Smart Invoice Builder" desc="Generate invoices instantly with automatic tax calculation and downloadable PDF." />
          <Feature icon={<Users />} title="Client Database" desc="Save customers and reuse them without entering details every time." />
          <Feature icon={<BarChart3 />} title="Revenue Analytics" desc="Understand monthly earnings and unpaid invoices in real-time." />
          <Feature icon={<Clock />} title="Payment Status" desc="Know which invoice is paid, pending or overdue instantly." />
          <Feature icon={<ShieldCheck />} title="Secure Storage" desc="All invoices stored securely and accessible anytime." />
          <Feature icon={<CheckCircle2 />} title="Business Ready" desc="Structured invoice layout suitable for real business usage." />
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}
      <section id="workflow" className="py-28 bg-orange-50/60 px-6">
        <h2 className="text-4xl font-bold text-center mb-20">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto text-center">
          <Step number="1" title="Add Clients">Store customer once and reuse forever.</Step>
          <Step number="2" title="Create Invoice">Add items and generate instantly.</Step>
          <Step number="3" title="Track Payments">Monitor paid and pending invoices.</Step>
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="py-28 bg-orange-500 text-white text-center px-6">
        <h2 className="text-4xl font-bold mb-6">
          Replace Excel invoices today.
        </h2>

        <p className="text-lg opacity-90 mb-10">
          Start sending professional invoices in less than 2 minutes.
        </p>

        <Button
          onClick={() => navigate("/signup")}
          className="bg-white text-orange-600 hover:bg-gray-100 px-12 py-6 text-lg rounded-xl font-semibold"
        >
          Get Started
        </Button>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, desc }: any) => (
  <div className="p-8 rounded-2xl border border-orange-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white/80 backdrop-blur-lg">
    <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const Step = ({ number, title, children }: any) => (
  <div className="bg-white p-10 rounded-2xl shadow-xl border border-orange-100 hover:scale-105 transition">
    <div className="text-orange-500 text-4xl font-bold mb-4">{number}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);
