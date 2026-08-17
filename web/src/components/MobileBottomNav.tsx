'use client';

import React from 'react';
import {
  Home,
  Package,
  Receipt,
  User,
  QrCode,
  HeartPulse,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenScanner: () => void;
}

export default function MobileBottomNav({
  activeTab,
  onSelectTab,
  onOpenScanner,
}: MobileBottomNavProps) {
  return (
    <>
      {/* Floating Action Button (FAB) positioned above the bottom bar */}
      <button
        onClick={onOpenScanner}
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#1e3a8a] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-900 transition-all z-40 active:scale-95 border-2 border-white cursor-pointer"
        title="Open QR & Barcode Scanner"
      >
        <QrCode className="w-6 h-6" />
      </button>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-16 px-2 bg-white border-t border-slate-200 shadow-lg pb-safe">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-transform active:scale-95 ${
            activeTab === 'home'
              ? 'bg-[#1e3a8a] text-white'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onSelectTab('stocks')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-colors ${
            activeTab === 'stocks'
              ? 'bg-[#1e3a8a] text-white'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">Stocks</span>
        </button>

        <button
          onClick={() => onSelectTab('orders')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-colors ${
            activeTab === 'orders'
              ? 'bg-[#1e3a8a] text-white'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">Orders</span>
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-colors ${
            activeTab === 'profile'
              ? 'bg-[#1e3a8a] text-white'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">Profile</span>
        </button>
      </nav>
    </>
  );
}
