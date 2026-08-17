'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Star,
  Clock,
  AlertTriangle,
  FileCheck,
  Search,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { Vendor } from '@/lib/types';

interface PartnersScreenProps {
  vendors: Vendor[];
  onOpenOrderModal?: () => void;
}

export function PartnersScreen({ vendors, onOpenOrderModal }: PartnersScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(vendors[0] || null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="vendor-partners-view">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Supplier Network & Contract Governance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Vendor Directory & Compliance SLA
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor pharmaceutical manufacturer fulfillment performance, on-time SLA metrics, and WHO-GMP compliance ratings.
          </p>
        </div>

        {onOpenOrderModal && (
          <button
            onClick={onOpenOrderModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Vendor Purchase Order</span>
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Embarqued Vendors</div>
          <div className="text-2xl font-bold text-slate-900">{vendors.length} Approved</div>
          <div className="text-[11px] text-slate-500 mt-1">100% WHO-GMP Certified</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Avg State Fulfillment SLA</div>
          <div className="text-2xl font-bold text-emerald-600">93.2%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">+2.4% vs last quarter</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Avg Dispatch Lead Time</div>
          <div className="text-2xl font-bold text-blue-900">1.4 Days</div>
          <div className="text-[11px] text-blue-800 font-medium mt-1">Target threshold &lt; 2.0 days</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Suppliers Under Review</div>
          <div className="text-2xl font-bold text-amber-600">
            {vendors.filter((v) => v.status === 'Under Review').length}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Audit notices dispatched</div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor name, email, or compliance status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
          />
        </div>
      </div>

      {/* Vendor Grid & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendors List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredVendors.map((vendor) => {
            const isSelected = selectedVendor?.id === vendor.id;
            return (
              <div
                key={vendor.id}
                onClick={() => setSelectedVendor(vendor)}
                className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-blue-900 ring-2 ring-blue-900/10 bg-blue-50/15'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">
                        {vendor.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          vendor.status === 'Excellent'
                            ? 'bg-emerald-50 text-emerald-700'
                            : vendor.status === 'Good'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5 pt-1">
                      <Building2 className="w-4 h-4 text-blue-900" />
                      {vendor.name}
                    </h3>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{vendor.contactEmail}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-500">Fulfillment Score</div>
                    <div className="text-xl font-bold text-blue-900">{vendor.fulfillmentRate}%</div>
                  </div>
                </div>

                {/* Scorecard Bars */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <div className="text-slate-500 text-[11px]">Avg Delay</div>
                    <div className="font-bold text-slate-900 mt-0.5">{vendor.avgDelay}</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <div className="text-slate-500 text-[11px]">Quality Rating</div>
                    <div className="font-bold text-amber-600 mt-0.5 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{vendor.qualityRating} / 5.0</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <div className="text-slate-500 text-[11px]">Active Orders</div>
                    <div className="font-bold text-slate-900 mt-0.5">{vendor.activeOrders} Batches</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Vendor Inspector & Contract Details */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Vendor Dossier</div>
            <h3 className="font-bold text-slate-900 text-base mt-0.5">{selectedVendor?.name}</h3>
          </div>

          {selectedVendor && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Registered Vendor ID:</span>
                  <span className="font-mono font-bold text-blue-900">{selectedVendor.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Contract Standing:</span>
                  <span className="font-semibold text-emerald-700">Active Tier 1 State Supplier</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Audit Status:</span>
                  <span className="font-semibold text-slate-900">Passed ISO 9001:2015</span>
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-900 mb-2">Verified Compliance Badges</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>WHO Good Manufacturing Practice (GMP) Validated</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-medium">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>National Pharmacovigilance Program Registered</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => showToast(`Initiated vendor audit communication with ${selectedVendor.name}.`)}
                  className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Official Quality Audit Notice</span>
                </button>

                {onOpenOrderModal && (
                  <button
                    onClick={onOpenOrderModal}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                  >
                    Raise Direct Requisition Order
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
