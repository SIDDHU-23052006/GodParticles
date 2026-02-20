import React, { useState } from "react";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children }: any) => {

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300
        ${collapsed ? "ml-20" : "ml-64"}`}
      >
        <div className="p-8">
          {children}
        </div>
      </div>

    </div>
  );
};
