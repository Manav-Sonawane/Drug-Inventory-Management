'use client';

import React, { useState } from 'react';
import {
  X,
  ArrowRightLeft,
  Truck,
  Building,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface RerouteStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAlertTitle?: string;
  onRerouteComplete?: (details: {
    drug: string;
    quantity: number;
    from: string;
    to: string;
  }) => void;
}

export default function RerouteStockModal({
  isOpen,
  onClose,
  targetAlertTitle = 'Insulin Depletion - Zone B',
  onRerouteComplete,
}: RerouteStockModalProps) {
  const [selectedDrug, setSelectedDrug] = useState('Insulin Glargine (100IU/ml)');
  const [sourceHub, setSourceHub] = useState('Central State Medical Warehouse (9,600 units avail)');
  const [targetFacility, setTargetFacility] = useState('District Alpha Hospital & Zone B (Critical)');
  const [transferQty, setTransferQty] = useState(800);
  const [courierOption, setCourierOption] = useState('Priority Cold-Chain Express (ETA: 2.5 hrs)');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRerouteComplete) {
      onRerouteComplete({
        drug: selectedDrug,
        quantity: transferQty,
        from: sourceHub,
        to: targetFacility,
      });
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-[#ba1a1a] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Emergency Stock Re-route</h3>
              <p className="text-xs text-red-100">Statewide rapid supply diversion protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-red-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Emergency Dispatch Initiated!</h4>
            <p className="text-sm text-slate-600">
              Dispatched {transferQty} units of {selectedDrug} to {targetFacility}.
            </p>
            <p className="text-xs text-emerald-700 font-mono">Consignment Code: #REROUTE-EMG-9901</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
            {/* Urgent Alert Banner */}
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Active Trigger: {targetAlertTitle}</span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Automated logistics balancing has identified surplus stock in Central Warehouse to prevent critical stockouts.
                </p>
              </div>
            </div>

            {/* Source Warehouse */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Source Depot (Surplus Node)
              </label>
              <select
                value={sourceHub}
                onChange={(e) => setSourceHub(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
              >
                <option value="Central State Medical Warehouse (9,600 units avail)">
                  Central State Medical Warehouse (9,600 units avail)
                </option>
                <option value="Siliguri Regional Medical Depot (4,200 units avail)">
                  Siliguri Regional Medical Depot (4,200 units avail)
                </option>
                <option value="Kolkata Apex Stock Reserve (12,000 units avail)">
                  Kolkata Apex Stock Reserve (12,000 units avail)
                </option>
              </select>
            </div>

            {/* Target Facility */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Target Facility (Critical Depletion)
              </label>
              <select
                value={targetFacility}
                onChange={(e) => setTargetFacility(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
              >
                <option value="District Alpha Hospital & Zone B (Critical)">
                  District Alpha Hospital & Zone B (&lt; 48hr supply)
                </option>
                <option value="Primary Health Centre, Malda">
                  Primary Health Centre, Malda (Paracetamol & Oxytocin)
                </option>
                <option value="North Wing General Hospital">
                  North Wing General Hospital (Insulin & PPE)
                </option>
              </select>
            </div>

            {/* Transfer Qty & Courier */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Re-route Quantity
                </label>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  value={transferQty}
                  onChange={(e) => setTransferQty(parseInt(e.target.value) || 100)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Transport Tier
                </label>
                <select
                  value={courierOption}
                  onChange={(e) => setCourierOption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-xs font-medium"
                >
                  <option value="Priority Cold-Chain Express (ETA: 2.5 hrs)">
                    Cold-Chain (2.5 hrs)
                  </option>
                  <option value="Dedicated Medical Courier (ETA: 4 hrs)">
                    Dedicated (4 hrs)
                  </option>
                  <option value="Standard Scheduled Freight (ETA: 24 hrs)">
                    Standard (24 hrs)
                  </option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#ba1a1a] text-white font-semibold text-xs rounded-lg hover:bg-red-800 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                Authorize & Dispatch Re-route
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
