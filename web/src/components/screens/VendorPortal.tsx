'use client';

import React, { useState } from 'react';
import {
  Hourglass,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Plus,
  Filter,
  MoreVertical,
  Clock,
  ArrowUp,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';
import { Invoice, Order } from '@/lib/types';

interface VendorPortalProps {
  orders: Order[];
  invoices: Invoice[];
  onOpenCreateInvoice: () => void;
  onAcknowledgeOrder: (orderId: string) => void;
}

export default function VendorPortal({
  orders,
  invoices,
  onOpenCreateInvoice,
  onAcknowledgeOrder,
}: VendorPortalProps) {
  const [priorityDismissed, setPriorityDismissed] = useState(false);
  const [acknowledgedOrders, setAcknowledgedOrders] = useState<string[]>([]);

  const handleAck = (orderId: string) => {
    setAcknowledgedOrders([...acknowledgedOrders, orderId]);
    onAcknowledgeOrder(orderId);
  };

  const totalAwaiting = invoices
    .filter((inv) => inv.status === 'Awaiting Payment' || inv.status === 'Submitted')
    .reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Emergency Priority Alert */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Fulfillment Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Overview of assigned state supply orders, transit logistics and performance metrics.
          </p>
        </div>

        {/* Priority Emergency Order Alert Banner */}
        {!priorityDismissed && (
          <div className="bg-red-50 text-red-900 px-4 py-3 rounded-xl flex items-center gap-3 border border-red-300 w-full lg:w-auto shadow-xs">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <div className="flex-1 text-xs">
              <p className="font-bold text-red-950">New Priority Order: ORD-8892</p>
              <p className="text-red-800 text-[11px]">
                Urgent PPE delivery required within 24hrs. Acknowledge immediately.
              </p>
            </div>
            <button
              onClick={() => handleAck('ORD-8892')}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              {acknowledgedOrders.includes('ORD-8892') ? 'Acknowledged' : 'Acknowledge'}
            </button>
          </div>
        )}
      </div>

      {/* Bento Grid: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Pending Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs h-36">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#00236f]">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">12</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-red-600 font-bold flex items-center">
                <ArrowUp className="w-3.5 h-3.5" /> +2
              </span>
              <span>from yesterday</span>
            </div>
          </div>
        </div>

        {/* Metric 2: In Transit */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs h-36">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">In Transit</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#00236f]">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">45</div>
            <div className="mt-2 space-y-1">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00236f] h-full w-[80%] rounded-full"></div>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">80% on schedule</span>
            </div>
          </div>
        </div>

        {/* Metric 3: SLA Adherence Gauge */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs h-36 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">SLA Adherence</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Excellent
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">96%</div>
              <span className="text-[11px] text-slate-500">Target: &gt;95% Target Met</span>
            </div>

            {/* Simulated Mini Arc Indicator */}
            <div className="w-16 h-10 border-t-4 border-l-4 border-r-4 border-[#00236f] rounded-t-full bg-blue-50/50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#00236f]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Active Orders Table & Right Column Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Orders List (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/80">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Active Fulfillment Orders</h3>
              <p className="text-[11px] text-slate-500">State healthcare facility dispatch queue</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-slate-400 hover:text-slate-700 p-1">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-100/60 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <th className="p-3 pl-4">Order ID</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">SLA Limit</th>
                  <th className="p-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Row 1: ORD-8892 (Needs Action) */}
                <tr
                  className={`transition-colors ${
                    acknowledgedOrders.includes('ORD-8892')
                      ? 'bg-white hover:bg-slate-50'
                      : 'bg-red-50/40 hover:bg-red-50/70'
                  }`}
                >
                  <td className="p-3 pl-4 font-mono font-bold text-slate-900">ORD-8892</td>
                  <td className="p-3 text-slate-700 font-medium">Central City Hospital</td>
                  <td className="p-3">
                    {acknowledgedOrders.includes('ORD-8892') ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900">
                        Preparing
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-900 border border-red-200">
                        Pending Ack.
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-red-600 font-bold">2 hrs remaining</td>
                  <td className="p-3 pr-4 text-right">
                    <button
                      onClick={() => handleAck('ORD-8892')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        acknowledgedOrders.includes('ORD-8892')
                          ? 'bg-slate-100 text-slate-600 cursor-default'
                          : 'bg-[#00236f] text-white hover:bg-blue-900 shadow-xs cursor-pointer active:scale-95'
                      }`}
                    >
                      {acknowledgedOrders.includes('ORD-8892') ? 'Acknowledged' : 'Acknowledge'}
                    </button>
                  </td>
                </tr>

                {/* Row 2: ORD-8845 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 pl-4 font-mono font-bold text-slate-900">ORD-8845</td>
                  <td className="p-3 text-slate-700 font-medium">Northside Clinic</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      Preparing
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">Tomorrow, 14:00</td>
                  <td className="p-3 pr-4 text-right">
                    <button className="border border-[#00236f] text-[#00236f] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
                      Update Status
                    </button>
                  </td>
                </tr>

                {/* Row 3: ORD-8812 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 pl-4 font-mono font-bold text-slate-900">ORD-8812</td>
                  <td className="p-3 text-slate-700 font-medium">West Valley Medical</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900">
                      In Transit
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">Today, 18:00</td>
                  <td className="p-3 pr-4 text-right">
                    <button className="border border-slate-300 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Invoice Status & Recent Activity */}
        <div className="flex flex-col gap-6">
          {/* Invoice Tracker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5 mb-3 flex justify-between items-center">
              Invoice Status
              <Receipt className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Drafts</span>
                <span className="font-mono font-bold text-slate-900">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Submitted</span>
                <span className="font-mono font-bold text-slate-900">14</span>
              </div>
              <div className="flex justify-between items-center font-bold text-sm border-t border-slate-100 pt-2.5">
                <span className="text-slate-600">Awaiting Payment</span>
                <span className="text-[#00236f] font-mono text-base">
                  ₹{totalAwaiting.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenCreateInvoice}
              className="mt-4 w-full border border-slate-300 text-slate-700 hover:text-[#00236f] hover:border-[#00236f] rounded-lg py-2 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Invoice
            </button>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex-1">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5 mb-4">
              Recent Activity
            </h3>

            <div className="relative pl-5 space-y-5 border-l-2 border-slate-200 ml-2 text-xs">
              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-[#00236f] ring-4 ring-white"></div>
                <p className="font-bold text-slate-900">Shipment ORD-8812 Dispatched</p>
                <p className="text-[11px] text-slate-400 mt-0.5">10 mins ago by Warehouse Team</p>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-300 ring-4 ring-white"></div>
                <p className="font-semibold text-slate-700">Invoice INV-2023-11 Paid</p>
                <p className="text-[11px] text-slate-400 mt-0.5">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
