'use client';

import React from 'react';
import {
  LayoutDashboard,
  Package,
  Truck,
  Building,
  Handshake,
  BarChart3,
  Settings,
  HelpCircle,
  Plus,
  HeartPulse,
  Sparkles,
  Snowflake,
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import Logo from './Logo';

interface SidebarNavProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onOpenCreateOrder: () => void;
  onOpenAiAdvisor?: () => void;
  onOpenTelemetryModal?: () => void;
}

export default function SidebarNav({
  currentRole,
  onSelectRole,
  activeNav,
  onSelectNav,
  onOpenCreateOrder,
  onOpenAiAdvisor,
  onOpenTelemetryModal,
}: SidebarNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: Truck },
    { id: 'warehouses', label: 'Warehouses & Cold Chain', icon: Building },
    { id: 'partners', label: 'Partners', icon: Handshake },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 border-r border-slate-200 bg-white sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between h-16 shrink-0">
        <Logo size="md" subtitle="Supply Chain Control" />
      </div>

      {/* Action Button */}
      <div className="p-4 space-y-2">
        <button
          onClick={onOpenCreateOrder}
          className="w-full bg-[#1e3a8a] text-white hover:bg-blue-900 transition-colors font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 shadow-xs active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Order
        </button>

        {onOpenAiAdvisor && (
          <button
            onClick={onOpenAiAdvisor}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition-colors font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            <span>AI Surge Advisor</span>
          </button>
        )}
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 text-xs font-semibold">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectNav(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-[#00236f] font-bold border-r-4 border-[#00236f]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#00236f]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#00236f]' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {onOpenTelemetryModal && (
          <button
            onClick={onOpenTelemetryModal}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-cyan-800 transition-colors text-left cursor-pointer mt-2 border-t border-slate-100 pt-2.5"
          >
            <div className="flex items-center gap-3">
              <Snowflake className="w-4 h-4 text-cyan-600" />
              <span>IoT Telemetry Feed</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        )}
      </nav>

      {/* Bottom Settings & Support */}
      <div className="p-3 border-t border-slate-200 space-y-1 text-xs font-semibold text-slate-600 shrink-0">
        <button
          onClick={() => onSelectNav('settings')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#00236f] transition-colors text-left"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => onSelectNav('support')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#00236f] transition-colors text-left"
        >
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Support & Helpdesk</span>
        </button>
      </div>
    </aside>
  );
}
