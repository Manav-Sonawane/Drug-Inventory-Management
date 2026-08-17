'use client';

import React, { useState } from 'react';
import {
  X,
  PackagePlus,
  Building,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Order, ManifestItem } from '@/lib/types';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (newOrder: Order) => void;
}

export default function CreateOrderModal({
  isOpen,
  onClose,
  onCreateOrder,
}: CreateOrderModalProps) {
  const [destination, setDestination] = useState('City Hospital North Wing');
  const [priority, setPriority] = useState(true);
  const [slaHours, setSlaHours] = useState('4 hrs remaining');
  const [items, setItems] = useState<ManifestItem[]>([
    {
      id: 'item-1',
      drugName: 'Amoxicillin 500mg Caps',
      batchNo: 'B-992-X',
      quantity: 5000,
      unit: 'Caps',
      status: 'Packed',
      location: 'Aisle 2, Shelf A',
    },
    {
      id: 'item-2',
      drugName: 'Ibuprofen 400mg Tabs',
      batchNo: 'B-104-Y',
      quantity: 2500,
      unit: 'Tabs',
      status: 'Packed',
      location: 'Aisle 3, Shelf C',
    },
  ]);

  const [newDrugName, setNewDrugName] = useState('');
  const [newBatch, setNewBatch] = useState('');
  const [newQty, setNewQty] = useState(1000);
  const [newUnit, setNewUnit] = useState('Units');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!newDrugName) return;
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        drugName: newDrugName,
        batchNo: newBatch || `B-${Math.floor(100 + Math.random() * 900)}`,
        quantity: newQty,
        unit: newUnit,
        status: 'Packed',
        location: 'Main Aisle 1',
      },
    ]);
    setNewDrugName('');
    setNewBatch('');
    setNewQty(1000);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderNum = `ORD-2023-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderNum,
      orderNumber: orderNum,
      destination,
      requestedDate: 'Today, Just now',
      status: 'Ready for Dispatch',
      priority,
      clearedForDispatch: true,
      slaLimit: slaHours,
      totalValue: `₹${(items.reduce((acc, i) => acc + i.quantity * 2.5, 0)).toLocaleString()}`,
      transportDocStatus: 'Pending Generation',
      manifest: items,
    };

    onCreateOrder(newOrder);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#00236f] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <PackagePlus className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Create Medical Consignment Order</h3>
              <p className="text-xs text-blue-200">Dispatch allocation & hospital supply manifest</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Order Manifest Created!</h4>
            <p className="text-sm text-slate-600">
              Order dispatched for destination: {destination} with {items.length} line items.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1 text-sm">
            {/* Destination & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Destination Facility
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
                >
                  <option value="City Hospital North Wing">City Hospital North Wing</option>
                  <option value="Primary Health Centre, Malda">Primary Health Centre, Malda</option>
                  <option value="Central City Hospital">Central City Hospital</option>
                  <option value="West Valley Medical Center">West Valley Medical Center</option>
                  <option value="Siliguri Regional Medical Unit">Siliguri Regional Medical Unit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Delivery Urgency & SLA
                </label>
                <div className="flex items-center gap-3 mt-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={priority}
                      onChange={(e) => setPriority(e.target.checked)}
                      className="w-4 h-4 text-blue-900 rounded focus:ring-blue-800 border-slate-300"
                    />
                    <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      High Priority
                    </span>
                  </label>
                  <span className="text-xs text-slate-500 font-mono">SLA: 4 Hours</span>
                </div>
              </div>
            </div>

            {/* Manifest Items List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Consignment Manifest ({items.length} items)
                </h4>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5 pl-3">Drug / Supply</th>
                      <th className="p-2.5">Batch</th>
                      <th className="p-2.5 text-right">Quantity</th>
                      <th className="p-2.5 text-right">Status</th>
                      <th className="p-2.5 pr-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2.5 pl-3 font-medium text-slate-900">{item.drugName}</td>
                        <td className="p-2.5 font-mono text-slate-500">{item.batchNo}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          {item.quantity.toLocaleString()} {item.unit}
                        </td>
                        <td className="p-2.5 text-right">
                          <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded text-[11px]">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-2.5 pr-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Item Row */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Add Manifest Item:</p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Drug Name (e.g. Saline IV 500ml)"
                  value={newDrugName}
                  onChange={(e) => setNewDrugName(e.target.value)}
                  className="sm:col-span-2 bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-800 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Batch (e.g. B-502)"
                  value={newBatch}
                  onChange={(e) => setNewBatch(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-800 focus:outline-none font-mono"
                />
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={newQty}
                    onChange={(e) => setNewQty(parseInt(e.target.value) || 100)}
                    className="w-20 bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-800 focus:outline-none font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex-1 bg-blue-900 text-white rounded-lg p-2 text-xs font-semibold hover:bg-blue-800 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
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
                className="px-5 py-2.5 bg-[#00236f] text-white font-semibold text-xs rounded-lg hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Order to Pipeline
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
