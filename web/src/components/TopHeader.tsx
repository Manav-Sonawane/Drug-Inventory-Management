'use client';

import React from 'react';
import {
  Bell,
  HelpCircle,
  Search,
  Building2,
  Warehouse,
  Truck,
  HeartPulse,
  Smartphone,
  Monitor,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';

interface TopHeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenCreateOrder: () => void;
  onOpenCommandPalette?: () => void;
  onOpenTelemetryModal?: () => void;
  onOpenAiAdvisor?: () => void;
}

export default function TopHeader({
  currentRole,
  onSelectRole,
  onOpenCreateOrder,
  onOpenCommandPalette,
  onOpenTelemetryModal,
  onOpenAiAdvisor,
}: TopHeaderProps) {
  const { user, logout } = useAuth();
  const roleLabels: Record<UserRole, { title: string; subtitle: string; badge: string; icon: any }> = {
    super_admin: {
      title: 'State Health Directorate',
      subtitle: 'Statewide Health Logistics & Emergency Diversion',
      badge: 'Super Admin',
      icon: Building2,
    },
    phc_clinic: {
      title: 'Primary Health Centre, Malda',
      subtitle: 'District Clinic Dispensing & Consignment Receiving',
      badge: 'PHC Malda',
      icon: HeartPulse,
    },
    warehouse: {
      title: 'Central State Medical Warehouse',
      subtitle: 'Consignment Picking, Packing & QR Dispatch',
      badge: 'Warehouse HQ',
      icon: Warehouse,
    },
    vendor: {
      title: 'Vendor Partner Portal',
      subtitle: 'Fulfillment Tracking, SLAs & Invoicing',
      badge: 'Vendor Partner',
      icon: Truck,
    },
  };

  const roleInfo = roleLabels[currentRole];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shrink-0">
      {/* Top Meta Bar: Role Selector & Device Mode Switcher */}
      <div className="bg-[#00236f] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-200 hidden sm:inline">Active Portal View:</span>
          <div className="flex bg-white/10 rounded-lg p-0.5 border border-white/15">
            <button
              onClick={() => onSelectRole('super_admin')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'super_admin'
                  ? 'bg-white text-[#00236f] shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>

            <button
              onClick={() => onSelectRole('phc_clinic')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'phc_clinic'
                  ? 'bg-white text-[#00236f] shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>PHC Malda</span>
            </button>

            <button
              onClick={() => onSelectRole('warehouse')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'warehouse'
                  ? 'bg-white text-[#00236f] shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>Warehouse</span>
            </button>

            <button
              onClick={() => onSelectRole('vendor')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'vendor'
                  ? 'bg-white text-[#00236f] shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Vendor Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Mobile Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Logo size="sm" showSubtitle={false} />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-[#00236f] leading-tight">
                {roleInfo.title}
              </h1>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-slate-200">
                {roleInfo.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              {roleInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Center: Search Bar / Command Palette Trigger */}
        <div className="hidden md:flex flex-1 max-w-sm relative">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-full text-xs text-slate-500 font-medium transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-blue-900 transition-colors" />
              <span>Search drugs, batches, hubs...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-500 border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Telemetry, AI Advisor, Notification, Help & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cold Chain IoT Live Status Pill */}
          {onOpenTelemetryModal && (
            <button
              onClick={onOpenTelemetryModal}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-semibold transition-colors cursor-pointer"
              title="View Real-Time IoT Cold Chain Telemetry"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>Vault +4.2°C</span>
            </button>
          )}

          {/* AI Advisor Button */}
          {onOpenAiAdvisor && (
            <button
              onClick={onOpenAiAdvisor}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Launch AI Outbreak Surge & Restock Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-900" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>
          )}

          <button
            onClick={onOpenCommandPalette}
            className="md:hidden text-slate-500 hover:text-[#00236f] p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCommandPalette}
            className="text-slate-500 hover:text-[#00236f] p-1.5 rounded-full hover:bg-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* User Profile Avatar with Role-specific styling */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-900 to-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white">
              {currentRole === 'super_admin' ? 'DR' : currentRole === 'phc_clinic' ? 'PH' : currentRole === 'warehouse' ? 'WH' : 'VP'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {user?.full_name || 'User'}
              </p>
              <p className="text-[10px] text-slate-500">
                {user?.role || currentRole}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="ml-1 p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
