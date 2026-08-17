'use client';

import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  QrCode,
  Search,
  ExternalLink,
  AlertTriangle,
  Plus,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  Calendar,
} from 'lucide-react';
import { Order, ManifestItem } from '@/lib/types';
import { initialCentralLedger } from '@/lib/mock-data';

interface WarehousePortalProps {
  orders: Order[];
  onOpenTransportQR: (order: Order) => void;
  onCreateNewOrder: () => void;
}

export default function WarehousePortal({
  orders,
  onOpenTransportQR,
  onCreateNewOrder,
}: WarehousePortalProps) {
  const [pipelineTab, setPipelineTab] = useState<
    'Pending Approval' | 'Packing' | 'Ready for Dispatch' | 'Shipped'
  >('Ready for Dispatch');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ORD-8942');

  const activeOrder =
    orders.find((o) => o.id === selectedOrderId) ||
    orders.find((o) => o.status === pipelineTab) ||
    orders[0];

  const filteredLedger = initialCentralLedger.filter(
    (item) =>
      item.name.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      item.batchNo.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dispatch Pipeline Section Header & Tabs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Dispatch Pipeline & Order Processing
            </h2>
            <p className="text-xs text-slate-500">
              Pick, pack, verify temperature requirements and generate QR transport waybills.
            </p>
          </div>
          <button
            onClick={onCreateNewOrder}
            className="bg-[#00236f] text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 hover:bg-blue-900 transition-colors shadow-xs w-max cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Order
          </button>
        </div>

        {/* Pipeline Segmented Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex overflow-x-auto gap-2 shadow-xs hide-scrollbar">
          {(['Pending Approval', 'Packing', 'Ready for Dispatch', 'Shipped'] as const).map(
            (tab) => {
              const isActive = pipelineTab === tab;
              const matchingCount = orders.filter((o) => o.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setPipelineTab(tab)}
                  className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#1e3a8a] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab}</span>
                  {isActive && (
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-300 ml-2"></span>
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Main Grid: Order Manifest Card (2 cols) & Central Ledger (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Detail Card */}
        <div className="lg:col-span-2 space-y-6">
          {activeOrder ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      Order #{activeOrder.orderNumber}
                    </h3>
                    {activeOrder.priority && (
                      <span className="bg-blue-100 text-[#00236f] px-2 py-0.5 rounded text-[11px] font-bold">
                        Priority
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Dest: <strong className="text-slate-800">{activeOrder.destination}</strong> |
                    Requested: {activeOrder.requestedDate}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="inline-flex items-center gap-1.5 text-blue-900 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Cleared for Dispatch
                  </span>
                </div>
              </div>

              {/* Manifest Table */}
              <div className="mt-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Manifest & Allocation List
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-3 text-slate-500 uppercase font-semibold pl-4">Drug Name</th>
                        <th className="p-3 text-slate-500 uppercase font-semibold">Batch No.</th>
                        <th className="p-3 text-slate-500 uppercase font-semibold text-right">Qty</th>
                        <th className="p-3 text-slate-500 uppercase font-semibold text-right pr-4">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeOrder.manifest.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 pl-4 font-semibold text-slate-900">{item.drugName}</td>
                          <td className="p-3 text-slate-500 font-mono">{item.batchNo}</td>
                          <td className="p-3 text-right font-bold text-slate-900">
                            {item.quantity.toLocaleString()} {item.unit}
                          </td>
                          <td className="p-3 text-right pr-4">
                            <span className="text-[#00236f] bg-blue-50 px-2 py-0.5 rounded font-bold text-[11px]">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transport Doc & QR Action Box */}
              <div className="mt-6 bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between border border-slate-200 gap-4">
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center shrink-0 shadow-xs text-slate-600">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Transport Doc</p>
                    <p className="text-sm font-bold text-slate-900">
                      {activeOrder.status === 'Shipped'
                        ? 'Consignment In Transit'
                        : 'Pending Generation'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenTransportQR(activeOrder)}
                  className="w-full sm:w-auto bg-[#1e3a8a] text-white hover:bg-blue-900 transition-colors px-6 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  Generate QR & Dispatch
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-sm">No orders currently in {pipelineTab} stage.</p>
              <button
                onClick={onCreateNewOrder}
                className="mt-3 text-xs font-bold text-[#00236f] hover:underline"
              >
                + Create new dispatch order
              </button>
            </div>
          )}
        </div>

        {/* Central Stock Ledger Quick View */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col h-full min-h-[460px]">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Central Ledger Quick View</h4>
                <p className="text-[11px] text-slate-500">Warehouse bay & cold vault stock levels</p>
              </div>
              <button
                onClick={onCreateNewOrder}
                className="text-slate-400 hover:text-blue-900 p-1"
                title="Open detailed inventory"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search batches, drugs..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            {/* Ledger Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 hide-scrollbar">
              {filteredLedger.map((item) => {
                const isLow = item.status === 'low';
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isLow
                        ? 'bg-red-50/80 border-red-200'
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900">{item.name}</span>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">
                        {item.batchNo}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 text-[11px]">{item.location}</span>
                      <span
                        className={`font-bold font-mono ${
                          isLow ? 'text-red-600 flex items-center gap-1' : 'text-slate-900'
                        }`}
                      >
                        {isLow && <AlertTriangle className="w-3 h-3 text-red-600" />}
                        {item.warning || `${item.stock.toLocaleString()} ${item.unit}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
