'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Package,
  Truck,
  Building2,
  AlertTriangle,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Command,
} from 'lucide-react';
import { initialOrders, initialLowStockAlerts } from '@/lib/mock-data';

interface SearchBatch {
  drugName: string;
  batchNumber: string;
  facilityName: string;
  currentStock: number;
  unit: string;
}

const mockSearchBatches: SearchBatch[] = [
  {
    drugName: 'Rotavirus Oral Vaccine (Live)',
    batchNumber: 'ROTA-2024-09B',
    facilityName: 'Central State Medical Warehouse',
    currentStock: 8400,
    unit: 'Doses',
  },
  {
    drugName: 'Insulin Glargine 100 IU/mL',
    batchNumber: 'INS-8812-X',
    facilityName: 'Central Hub - Cold Room 01',
    currentStock: 350,
    unit: 'Vials',
  },
  {
    drugName: 'Amoxicillin + Clavulanic Acid 625mg',
    batchNumber: 'AMX-9011-C',
    facilityName: 'Siliguri Depot - Bay 04',
    currentStock: 14500,
    unit: 'Tabs',
  },
  {
    drugName: 'Oxytocin Injection 10 IU/mL',
    batchNumber: 'OXY-4421-P',
    facilityName: 'Central Hub - Cold Room 03',
    currentStock: 6200,
    unit: 'Ampoules',
  },
  {
    drugName: 'Normal Saline 0.9% IV 500ml',
    batchNumber: 'NS-5501-A',
    facilityName: 'Kolkata Depot - Pallet Rack 12',
    currentStock: 28000,
    unit: 'Bottles',
  },
];

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onOpenScanner: () => void;
  onOpenOrderModal: () => void;
  onOpenRerouteModal: (title?: string) => void;
  onOpenTelemetryModal: () => void;
  onOpenAiAdvisor: () => void;
  onSelectBatch?: (batchNumber: string) => void;
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigate,
  onOpenScanner,
  onOpenOrderModal,
  onOpenRerouteModal,
  onOpenTelemetryModal,
  onOpenAiAdvisor,
  onSelectBatch,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Esc and Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // If already handled by parent or opened
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredBatches = mockSearchBatches.filter(
    (b) =>
      b.drugName.toLowerCase().includes(query.toLowerCase()) ||
      b.batchNumber.toLowerCase().includes(query.toLowerCase()) ||
      b.facilityName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredOrders = initialOrders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
      o.destination.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredAlerts = initialLowStockAlerts.filter(
    (a) =>
      a.drugName.toLowerCase().includes(query.toLowerCase()) ||
      a.location.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a drug name, batch #, consignment, hospital, or action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-slate-900 focus:outline-hidden placeholder:text-slate-400"
          />
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 rounded border border-slate-200">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick Actions Bar */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              System Actions
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenScanner();
                }}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 text-slate-700 hover:text-blue-900 font-medium flex items-center gap-2 transition-colors text-left"
              >
                <QrCode className="w-4 h-4 text-blue-900 shrink-0" />
                <span>Barcode Scanner</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenTelemetryModal();
                }}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-cyan-50/50 hover:border-cyan-200 text-slate-700 hover:text-cyan-900 font-medium flex items-center gap-2 transition-colors text-left"
              >
                <Snowflake className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Cold Vault Telemetry</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAiAdvisor();
                }}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 text-slate-700 hover:text-blue-900 font-medium flex items-center gap-2 transition-colors text-left"
              >
                <Sparkles className="w-4 h-4 text-blue-900 shrink-0" />
                <span>AI Outbreak Advisor</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenOrderModal();
                }}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 text-slate-700 hover:text-blue-900 font-medium flex items-center gap-2 transition-colors text-left"
              >
                <Truck className="w-4 h-4 text-blue-900 shrink-0" />
                <span>Raise Purchase Order</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenRerouteModal('Emergency Stock Transfer');
                }}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-rose-50/50 hover:border-rose-200 text-slate-700 hover:text-rose-900 font-medium flex items-center gap-2 transition-colors text-left"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Stock Re-route Wizard</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate('analytics');
                }}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2 transition-colors text-left"
              >
                <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Statewide Analytics</span>
              </button>
            </div>
          </div>

          {/* Batches Section */}
          {filteredBatches.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Pharmaceutical Batches & Stock
              </div>
              <div className="space-y-1.5">
                {filteredBatches.map((b) => (
                  <div
                    key={b.batchNumber}
                    onClick={() => {
                      onClose();
                      onNavigate('inventory');
                      if (onSelectBatch) onSelectBatch(b.batchNumber);
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-blue-900" />
                      <div>
                        <div className="font-semibold text-slate-900">{b.drugName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Batch #{b.batchNumber} • {b.facilityName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">
                        {b.currentStock.toLocaleString()} {b.unit}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consignments Section */}
          {filteredOrders.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Active Orders & Consignments
              </div>
              <div className="space-y-1.5">
                {filteredOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      onClose();
                      onNavigate('orders');
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-blue-900" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {o.orderNumber} &rarr; {o.destination}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Status: <span className="font-medium text-blue-900">{o.status}</span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search drugs, facilities, and actions across state logistics</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
