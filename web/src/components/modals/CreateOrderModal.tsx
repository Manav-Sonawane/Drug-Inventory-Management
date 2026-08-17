'use client';

import React, { useState, useEffect } from 'react';
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
  Building2,
} from 'lucide-react';
import { Order, ManifestItem } from '@/lib/types';
import { procurementApi, drugsApi, adminApi } from '@/lib/api';

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
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [priority, setPriority] = useState(false);
  const [slaHours, setSlaHours] = useState('24 hrs remaining');
  const [availableDrugs, setAvailableDrugs] = useState<any[]>([]);
  const [availableVendors, setAvailableVendors] = useState<any[]>([]);
  const [availableHospitals, setAvailableHospitals] = useState<any[]>([]);

  const [items, setItems] = useState<ManifestItem[]>([
    {
      id: 'item-1',
      drugName: 'Paracetamol 500mg',
      batchNo: 'B-7742',
      quantity: 1000,
      unit: 'Units',
      status: 'Packed',
      location: 'Aisle 1, Shelf B',
    },
  ]);

  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [newDrugName, setNewDrugName] = useState('');
  const [newBatch, setNewBatch] = useState('');
  const [newQty, setNewQty] = useState<number>(500);
  const [newUnit, setNewUnit] = useState('Units');
  const [newUnitPrice, setNewUnitPrice] = useState<number>(10);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    drugsApi.list().then((r) => {
      if (r?.data && r.data.length > 0) {
        setAvailableDrugs(r.data);
        setSelectedDrugId(r.data[0].id);
        setNewDrugName(r.data[0].name);
        setNewUnitPrice(r.data[0].unit_price || 10);
      }
    }).catch(() => {});

    adminApi.vendors.list().then((r) => {
      if (r?.data && r.data.length > 0) {
        setAvailableVendors(r.data);
        setSelectedVendorId(r.data[0].id);
      }
    }).catch(() => {});

    adminApi.hospitals.list().then((r) => {
      if (r?.data && r.data.length > 0) {
        setAvailableHospitals(r.data);
        setDestination(r.data[0].name);
      }
    }).catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDrugSelectChange = (drugId: string) => {
    setSelectedDrugId(drugId);
    const d = availableDrugs.find((drug) => drug.id === drugId);
    if (d) {
      setNewDrugName(d.name);
      setNewUnitPrice(d.unit_price || 10);
      setNewUnit(d.category === 'IV Fluid' ? 'Bottles' : d.category === 'Hormone' ? 'Vials' : 'Units');
      setNewBatch(`LOT-${d.name.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
    }
  };

  const handleAddItem = () => {
    const finalDrugName = newDrugName || (availableDrugs.find((d) => d.id === selectedDrugId)?.name) || 'Medicine Lot';
    if (!finalDrugName) return;

    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        drugName: finalDrugName,
        batchNo: newBatch || `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
        quantity: Number(newQty) || 100,
        unit: newUnit,
        status: 'Packed',
        location: 'Bay A-1',
      },
    ]);

    setNewBatch('');
    setNewQty(500);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderNum = `ORD-${Date.now().toString().slice(-6)}`;
    const totalEstValue = items.reduce((acc, i) => acc + (i.quantity * newUnitPrice), 0);

    const newOrder: Order = {
      id: orderNum,
      orderNumber: orderNum,
      destination,
      requestedDate: 'Today, Just now',
      status: 'Ready for Dispatch',
      priority,
      clearedForDispatch: true,
      slaLimit: priority ? '4 hrs remaining' : slaHours,
      totalValue: `₹${totalEstValue.toLocaleString()}`,
      transportDocStatus: 'Pending Generation',
      manifest: items,
    };

    // Save POs to SQLite backend
    try {
      const vendorId = selectedVendorId || (availableVendors[0]?.id);
      for (const item of items) {
        let matchingDrug = availableDrugs.find((d) => d.name.toLowerCase() === item.drugName.toLowerCase() || d.id === selectedDrugId);
        let drugId = matchingDrug ? matchingDrug.id : (availableDrugs[0]?.id);

        if (vendorId && drugId) {
          await procurementApi.create({
            vendor_id: vendorId,
            drug_id: drugId,
            quantity: item.quantity,
            unit_price: matchingDrug?.unit_price || newUnitPrice || 10,
            promised_delivery_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
            notes: `Destination: ${destination} | Batch: ${item.batchNo}`,
          });
        }
      }
    } catch (err: any) {
      console.warn('Procurement PO persistence notice:', err?.response?.data?.message || err.message);
    }

    onCreateOrder(newOrder);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1000);
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
              Order dispatched for destination: <span className="font-semibold text-slate-900">{destination}</span> with {items.length} line item(s).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1 text-sm">
            {/* Destination & Vendor */}
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
                  {availableHospitals.map((h) => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                  {availableHospitals.length === 0 && (
                    <>
                      <option value="City Hospital North Wing">City Hospital North Wing</option>
                      <option value="Primary Health Centre, Malda">Primary Health Centre, Malda</option>
                      <option value="District Alpha Medical Complex">District Alpha Medical Complex</option>
                      <option value="Siliguri Regional Depot">Siliguri Regional Depot</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Supply Vendor Partner
                </label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm font-medium"
                >
                  {availableVendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                  {availableVendors.length === 0 && (
                    <option value="">MediEquip Global</option>
                  )}
                </select>
              </div>
            </div>

            {/* Priority & SLA */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={priority}
                  onChange={(e) => setPriority(e.target.checked)}
                  className="w-4 h-4 text-blue-900 rounded focus:ring-blue-800 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800">
                  Mark as Priority Rush Delivery
                </span>
              </label>
              <span className="text-xs font-mono text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                SLA: {priority ? '4 Hours (Rush)' : slaHours}
              </span>
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
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px]">
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
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <p className="text-xs font-semibold text-slate-700">Add Item to Manifest:</p>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5">
                  <select
                    value={selectedDrugId}
                    onChange={(e) => handleDrugSelectChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-800 font-medium"
                  >
                    {availableDrugs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} (₹{d.unit_price || 10})
                      </option>
                    ))}
                    <option value="custom">+ Custom Entry</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Batch (e.g. B-902)"
                    value={newBatch}
                    onChange={(e) => setNewBatch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-800 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={newQty}
                    onChange={(e) => setNewQty(parseInt(e.target.value) || 100)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-800 font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full bg-[#00236f] text-white rounded-lg p-2 text-xs font-semibold hover:bg-blue-900 flex items-center justify-center gap-1 shadow-xs"
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
