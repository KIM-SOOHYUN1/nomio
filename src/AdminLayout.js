import React, { useState } from "react";

function AdminHeader() {
  return (
    <header className="bg-blue-700 text-white px-8 py-4 flex items-center justify-between shadow">
      <div className="text-2xl font-bold tracking-tight">NOMIO</div>
      <div className="text-sm opacity-80">NOMIO 관리자시스템</div>
    </header>
  );
}

function AdminSidebar({ menu, onMenuClick, active }) {
  return (
    <aside className="bg-white border-r w-56 min-h-screen pt-8 px-4">
      <nav>
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.key}>
              <button
                className={`w-full text-left px-4 py-2 rounded font-medium transition-colors ${
                  active === item.key
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => onMenuClick(item.key)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children, menu, onMenuClick, activeMenu }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar menu={menu} onMenuClick={onMenuClick} active={activeMenu} />
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
}
