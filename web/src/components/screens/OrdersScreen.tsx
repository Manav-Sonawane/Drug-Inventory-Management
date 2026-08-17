'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Truck,
  QrCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  PackageCheck,
  Building2,
  Calendar,
  DollarSign,
  Plus,
  ChevronRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Order } from '@/lib/types';

interface OrdersScreenProps {
  orders: Order[];
  onOpenTransportQR: (order: Order) => void;
  onCreateNewOrder: () => void;
}

export function OrdersScreen({ orders, onOpenTransportQR, onCreateNewOrder }: OrdersScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.manifest.some((m) => m.drugName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'In Transit' && order.status === 'In Transit') ||
      (statusFilter === 'Ready for Dispatch' && order.status === 'Ready for Dispatch') ||
      (statusFilter === 'Preparing' && (order.status === 'Preparing' || order.status === 'Packing')) ||
      (statusFilter === 'Pending Ack.' && order.status === 'Pending Ack.') ||
      (statusFilter === 'Shipped' && order.status === 'Shipped');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="statewide-orders-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 tracking-wider uppercase mb-1">
            <Truck className="w-4 h-4" />
            <span>State Logistics & Consignment Network</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Orders & Distribution Consignments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track multi-tier procurement requisitions, generate QR waybills, and monitor dispatch SLA deadlines.
          </p>
        </div>

        <button
          onClick={onCreateNewOrder}
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Order Requisition</span>
        </button>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Active Orders</div>
          <div className="text-2xl font-bold text-slate-900">{orders.length}</div>
          <div className="text-[11px] text-blue-800 font-medium mt-1">Across all districts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Ready for Dispatch</div>
          <div className="text-2xl font-bold text-emerald-600">
            {orders.filter((o) => o.status === 'Ready for Dispatch').length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Packing verified</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">In Transit (Active Fleet)</div>
          <div className="text-2xl font-bold text-blue-600">
            {orders.filter((o) => o.status === 'In Transit' || o.status === 'Shipped').length}
          </div>
          <div className="text-[11px] text-blue-800 font-medium mt-1">GPS-tracked vehicles</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Urgent Priority</div>
          <div className="text-2xl font-bold text-rose-600">
            {orders.filter((o) => o.priority).length}
          </div>
          <div className="text-[11px] text-rose-700 font-medium mt-1">SLA critical dispatch</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ID, destination hospital, or drug item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', 'Ready for Dispatch', 'In Transit', 'Preparing', 'Pending Ack.'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                statusFilter === tab
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List & Manifest Details Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-2 space-y-3">
          {filteredOrders.map((order) => {
            const isSelected = selectedOrder?.id === order.id;
            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-blue-900 ring-2 ring-blue-900/10 bg-blue-50/20'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">
                        {order.orderNumber}
                      </span>
                      {order.priority && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px] uppercase">
                          Priority Rush
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          order.status === 'Ready for Dispatch'
                            ? 'bg-emerald-50 text-emerald-700'
                            : order.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-800'
                            : order.status === 'Preparing'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5 pt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {order.destination}
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-4 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {order.requestedDate}
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {order.slaLimit}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    {order.totalValue && (
                      <span className="text-xs font-bold text-slate-900">{order.totalValue}</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTransportQR(order);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5 text-blue-900" />
                        <span>QR Pass</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mini Item Summary */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{order.manifest.length} manifest line items</span>
                  <span className="flex items-center gap-1 text-blue-900 font-medium">
                    View line items <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
              <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No matching orders found</p>
            </div>
          )}
        </div>

        {/* Selected Order Manifest Deep Dive Panel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs h-fit space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-900" />
              Manifest Inspector
            </h3>
            {selectedOrder && (
              <span className="text-xs font-mono font-semibold text-blue-900">
                {selectedOrder.orderNumber}
              </span>
            )}
          </div>

          {selectedOrder ? (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-slate-600">
                <div><strong className="text-slate-900">Destination:</strong> {selectedOrder.destination}</div>
                <div><strong className="text-slate-900">Requested Date:</strong> {selectedOrder.requestedDate}</div>
                <div><strong className="text-slate-900">Waybill QR Status:</strong> {selectedOrder.transportDocStatus}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-900 mb-2">Manifest Items ({selectedOrder.manifest.length})</div>
                <div className="space-y-2">
                  {selectedOrder.manifest.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg border border-slate-100 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{item.drugName}</span>
                        <span className="font-bold text-blue-900">{item.quantity} {item.unit}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Batch: <span className="font-mono text-slate-700">{item.batchNo}</span></span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                          {item.status}
                        </span>
                      </div>
                      {item.location && (
                        <div className="text-[10px] text-slate-400">Warehouse Bin: {item.location}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenTransportQR(selectedOrder)}
                  className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Generate Transport QR Waybill</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Click on any order in the list to inspect its packing manifest, batch verification, and dispatch credentials.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
