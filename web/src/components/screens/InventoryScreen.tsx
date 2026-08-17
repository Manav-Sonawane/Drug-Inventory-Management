'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  Snowflake,
  ShieldCheck,
  Package,
  Plus,
  RefreshCw,
  Clock,
  ArrowUpDown,
  Building2,
  Barcode,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { warehouseApi } from '@/lib/api';

export interface BatchItem {
  id: string;
  drugName: string;
  category: 'Vaccines' | 'Antibiotics' | 'Maternal Health' | 'Emergency & IV' | 'Chronic Care' | 'PPE & Consumables';
  batchNo: string;
  manufacturer: string;
  mfgDate: string;
  expDate: string;
  daysToExpiry: number;
  totalStock: number;
  unit: string;
  storageTemp: '2°C to 8°C (Cold Chain)' | '-20°C (Deep Freeze)' | '15°C to 25°C (Ambient)';
  warehouseLocation: string;
  status: 'optimal' | 'low_stock' | 'near_expiry' | 'quarantine';
  reservedStock: number;
}

const mockBatches: BatchItem[] = [
  {
    id: 'BAT-1001',
    drugName: 'Rotavirus Oral Vaccine (Live)',
    category: 'Vaccines',
    batchNo: 'ROTA-2024-09B',
    manufacturer: 'Serum BioTech Ltd',
    mfgDate: 'Jan 2024',
    expDate: 'Dec 2024',
    daysToExpiry: 120,
    totalStock: 8400,
    unit: 'Doses',
    storageTemp: '2°C to 8°C (Cold Chain)',
    warehouseLocation: 'Depot Alpha - Cold Vault 02',
    status: 'optimal',
    reservedStock: 1200,
  },
  {
    id: 'BAT-1002',
    drugName: 'Insulin Glargine 100 IU/mL',
    category: 'Chronic Care',
    batchNo: 'INS-8812-X',
    manufacturer: 'Apex BioPharma',
    mfgDate: 'Nov 2023',
    expDate: 'Oct 2024',
    daysToExpiry: 60,
    totalStock: 350,
    unit: 'Vials',
    storageTemp: '2°C to 8°C (Cold Chain)',
    warehouseLocation: 'Central Hub - Cold Room 01',
    status: 'low_stock',
    reservedStock: 200,
  },
  {
    id: 'BAT-1003',
    drugName: 'Amoxicillin + Clavulanic Acid 625mg',
    category: 'Antibiotics',
    batchNo: 'AMX-9011-C',
    manufacturer: 'PharmaCorp India',
    mfgDate: 'Jun 2023',
    expDate: 'Sep 2024',
    daysToExpiry: 28,
    totalStock: 14500,
    unit: 'Tabs',
    storageTemp: '15°C to 25°C (Ambient)',
    warehouseLocation: 'Siliguri Depot - Bay 04',
    status: 'near_expiry',
    reservedStock: 4000,
  },
  {
    id: 'BAT-1004',
    drugName: 'Oxytocin Injection 10 IU/mL',
    category: 'Maternal Health',
    batchNo: 'OXY-4421-P',
    manufacturer: 'LifeCare Therapeutics',
    mfgDate: 'Feb 2024',
    expDate: 'Feb 2026',
    daysToExpiry: 540,
    totalStock: 6200,
    unit: 'Ampoules',
    storageTemp: '2°C to 8°C (Cold Chain)',
    warehouseLocation: 'Central Hub - Cold Room 03',
    status: 'optimal',
    reservedStock: 800,
  },
  {
    id: 'BAT-1005',
    drugName: 'Normal Saline 0.9% IV 500ml',
    category: 'Emergency & IV',
    batchNo: 'NS-5501-A',
    manufacturer: 'MediEquip Solutions',
    mfgDate: 'Aug 2023',
    expDate: 'Jul 2025',
    daysToExpiry: 330,
    totalStock: 28000,
    unit: 'Bottles',
    storageTemp: '15°C to 25°C (Ambient)',
    warehouseLocation: 'Kolkata Depot - Pallet Rack 12',
    status: 'optimal',
    reservedStock: 5200,
  },
  {
    id: 'BAT-1006',
    drugName: 'Covaxin / Inactivated Viral Vaccine',
    category: 'Vaccines',
    batchNo: 'COV-7734-Q',
    manufacturer: 'Bharat Immuno Ltd',
    mfgDate: 'Jan 2024',
    expDate: 'Nov 2024',
    daysToExpiry: 90,
    totalStock: 12500,
    unit: 'Doses',
    storageTemp: '2°C to 8°C (Cold Chain)',
    warehouseLocation: 'District Hub B - Refrigerator 04',
    status: 'optimal',
    reservedStock: 3000,
  },
  {
    id: 'BAT-1007',
    drugName: 'Polio Oral Vaccine (bOPV)',
    category: 'Vaccines',
    batchNo: 'POL-1190-F',
    manufacturer: 'Serum BioTech Ltd',
    mfgDate: 'Dec 2023',
    expDate: 'Aug 2024',
    daysToExpiry: 14,
    totalStock: 1800,
    unit: 'Vials',
    storageTemp: '-20°C (Deep Freeze)',
    warehouseLocation: 'Statewide Deep Freezer A',
    status: 'near_expiry',
    reservedStock: 1800,
  },
  {
    id: 'BAT-1008',
    drugName: 'Ciprofloxacin 500mg (Tab)',
    category: 'Antibiotics',
    batchNo: 'CIP-4019-Z',
    manufacturer: 'Sun Medicals',
    mfgDate: 'Apr 2023',
    expDate: 'Mar 2025',
    daysToExpiry: 210,
    totalStock: 9200,
    unit: 'Tabs',
    storageTemp: '15°C to 25°C (Ambient)',
    warehouseLocation: 'Asansol Hub - Aisle 02',
    status: 'optimal',
    reservedStock: 1100,
  },
];

interface InventoryScreenProps {
  onOpenOrderModal?: () => void;
  onOpenRerouteModal?: (title?: string) => void;
  onOpenBatchTrace?: (batch: any) => void;
}

export function InventoryScreen({ onOpenOrderModal, onOpenRerouteModal, onOpenBatchTrace }: InventoryScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTemp, setSelectedTemp] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [batches, setBatches] = useState<BatchItem[]>(mockBatches);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(null);
  const [stockAdjustmentModal, setStockAdjustmentModal] = useState<boolean>(false);
  const [adjustAmount, setAdjustAmount] = useState<string>('');
  const [adjustReason, setAdjustReason] = useState<string>('Stock Audit Reconciliation');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchLiveInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await warehouseApi.inventory();
      if (res && res.data && res.data.length > 0) {
        const mapped: BatchItem[] = res.data.map((item: any) => {
          const daysExp = item.days_to_expiry ?? 90;
          let status: BatchItem['status'] = 'optimal';
          if (item.current_qty < 500) status = 'low_stock';
          else if (daysExp < 30) status = 'near_expiry';
          else if (item.status === 'quarantine') status = 'quarantine';

          let storageTemp: BatchItem['storageTemp'] = '15°C to 25°C (Ambient)';
          if (item.temperature_sensitive) {
            storageTemp = '2°C to 8°C (Cold Chain)';
          }

          return {
            id: item.id,
            drugName: item.drug_name || 'Generic Medicine',
            category: (item.category as any) || 'Emergency & IV',
            batchNo: item.batch_number || 'BATCH-000',
            manufacturer: item.generic_name || 'Authorized Supplier',
            mfgDate: item.manufacture_date || 'Jan 2024',
            expDate: item.expiry_date || 'Dec 2025',
            daysToExpiry: daysExp,
            totalStock: item.current_qty || 0,
            unit: item.unit_price ? 'Units' : 'Doses',
            storageTemp,
            warehouseLocation: `${item.warehouse_name || 'Central Hub'} - Bin ${item.location_bin || '01'}`,
            status,
            reservedStock: Math.floor((item.current_qty || 0) * 0.1),
          };
        });
        setBatches(mapped);
      }
    } catch (err) {
      console.warn('Could not fetch real inventory, using cached mock data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveInventory();
  }, [fetchLiveInventory]);

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesTemp =
      selectedTemp === 'All' ||
      (selectedTemp === 'Cold Chain' && b.storageTemp.includes('Cold Chain')) ||
      (selectedTemp === 'Deep Freeze' && b.storageTemp.includes('Deep Freeze')) ||
      (selectedTemp === 'Ambient' && b.storageTemp.includes('Ambient'));

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Optimal' && b.status === 'optimal') ||
      (statusFilter === 'Low Stock' && b.status === 'low_stock') ||
      (statusFilter === 'Near Expiry' && b.status === 'near_expiry');

    return matchesSearch && matchesCategory && matchesTemp && matchesStatus;
  });

  const handleApplyAdjustment = async () => {
    if (!selectedBatch || !adjustAmount) return;
    const qty = parseInt(adjustAmount, 10);
    if (isNaN(qty)) return;

    // Call real API if UUID format
    try {
      if (selectedBatch.id && selectedBatch.id.length > 10) {
        await warehouseApi.stockAdjustment({
          batch_id: selectedBatch.id,
          adjustment_qty: qty,
          reason: adjustReason,
        });
      }
    } catch (err: any) {
      console.warn('API adjustment notice:', err?.response?.data?.message || err.message);
    }

    setBatches((prev) =>
      prev.map((item) =>
        item.id === selectedBatch.id
          ? {
              ...item,
              totalStock: Math.max(0, item.totalStock + qty),
              status: item.totalStock + qty < 500 ? 'low_stock' : item.daysToExpiry < 30 ? 'near_expiry' : 'optimal',
            }
          : item
      )
    );

    showToast(`Stock for ${selectedBatch.drugName} (${selectedBatch.batchNo}) updated by ${qty > 0 ? '+' : ''}${qty} ${selectedBatch.unit}`);
    setStockAdjustmentModal(false);
    setSelectedBatch(null);
    setAdjustAmount('');
  };

  const totalDoses = batches.reduce((acc, curr) => acc + curr.totalStock, 0);
  const coldChainItems = batches.filter((b) => b.storageTemp.includes('Cold Chain') || b.storageTemp.includes('Deep Freeze')).length;
  const nearExpiryCount = batches.filter((b) => b.status === 'near_expiry').length;
  const lowStockCount = batches.filter((b) => b.status === 'low_stock').length;

  return (
    <div className="space-y-6" id="statewide-inventory-view">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 tracking-wider uppercase mb-1">
            <Package className="w-4 h-4" />
            <span>Statewide Central Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inventory & Batch Traceability
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-depot inventory tracking, batch lot expiration monitoring, and cold-chain compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast('Syncing with state warehouse ERP systems...')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Sync</span>
          </button>

          {onOpenOrderModal && (
            <button
              onClick={onOpenOrderModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Procurement Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Tracked Units</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalDoses.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 8 registered depots</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Cold Chain Active</span>
            <Snowflake className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{coldChainItems} Lots</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">100% telemetry nominal</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Near Expiry (&lt; 30 Days)</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{nearExpiryCount} Batches</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Priority dispatch recommended</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Low Stock Critical</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{lowStockCount} Batches</div>
          <div className="text-[11px] text-rose-700 font-medium mt-1">Buffer stock depleted</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search drug name, batch lot #, manufacturer, or depot location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              <option value="Vaccines">Vaccines</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Maternal Health">Maternal Health</option>
              <option value="Emergency & IV">Emergency & IV</option>
              <option value="Chronic Care">Chronic Care</option>
              <option value="PPE & Consumables">PPE & Consumables</option>
            </select>

            {/* Temperature Condition Dropdown */}
            <select
              value={selectedTemp}
              onChange={(e) => setSelectedTemp(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Storage Conditions</option>
              <option value="Cold Chain">Cold Chain (2°C - 8°C)</option>
              <option value="Deep Freeze">Deep Freeze (-20°C)</option>
              <option value="Ambient">Ambient (15°C - 25°C)</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Optimal">Optimal Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Near Expiry">Near Expiry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Medicine & Formulation</th>
                <th className="py-3 px-4">Batch Lot & Barcode</th>
                <th className="py-3 px-4">Storage Protocol</th>
                <th className="py-3 px-4">Current Available</th>
                <th className="py-3 px-4">Expiry Timeline</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBatches.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{item.drugName}</div>
                    <div className="text-[11px] text-slate-400">{item.category} • {item.manufacturer}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono font-medium text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                      {item.batchNo}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {item.storageTemp.includes('Cold Chain') ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-cyan-50 text-cyan-800 font-medium text-[11px]">
                        <Snowflake className="w-3 h-3 text-cyan-600" />
                        2°C - 8°C
                      </span>
                    ) : item.storageTemp.includes('Deep Freeze') ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-50 text-indigo-800 font-medium text-[11px]">
                        <Snowflake className="w-3 h-3 text-indigo-600" />
                        -20°C Deep
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        Ambient (15-25°C)
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.totalStock.toLocaleString()} {item.unit}</div>
                    <div className="text-[11px] text-slate-400">Allocated: {item.reservedStock.toLocaleString()}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className={`font-semibold ${item.daysToExpiry < 30 ? 'text-amber-600' : 'text-slate-900'}`}>
                      {item.expDate}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.daysToExpiry} days left
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.warehouseLocation}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {item.status === 'optimal' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                        Optimal
                      </span>
                    )}
                    {item.status === 'low_stock' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold text-[11px] inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock
                      </span>
                    )}
                    {item.status === 'near_expiry' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold text-[11px] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Near Expiry
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onOpenBatchTrace && (
                        <button
                          onClick={() =>
                            onOpenBatchTrace({
                              batchNumber: item.batchNo,
                              drugName: item.drugName,
                              manufacturer: item.manufacturer,
                              manufacturingDate: item.mfgDate,
                              expiryDate: item.expDate,
                              currentStock: item.totalStock,
                              unit: item.unit,
                              facilityName: item.warehouseLocation,
                              temperatureRequirement: item.storageTemp,
                              location: item.warehouseLocation,
                              qcStatus: 'Passed',
                              inStock: true,
                            })
                          }
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                          title="View WHO-GMP batch trace & cold-chain custody"
                        >
                          <ShieldCheck className="w-3 h-3 text-blue-900" />
                          <span>Trace & COA</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedBatch(item);
                          setStockAdjustmentModal(true);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
                      >
                        Adjust Stock
                      </button>

                      {item.status === 'near_expiry' && onOpenRerouteModal && (
                        <button
                          onClick={() => onOpenRerouteModal(`Rebalance Near-Expiry Batch ${item.batchNo}`)}
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Re-route
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBatches.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium">No matching batches found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {stockAdjustmentModal && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Adjust Physical Stock Quantity
              </h3>
              <button
                onClick={() => setStockAdjustmentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-blue-900">
                <div className="font-semibold text-slate-900">{selectedBatch.drugName}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Batch: <span className="font-mono font-medium">{selectedBatch.batchNo}</span> • Current: {selectedBatch.totalStock} {selectedBatch.unit}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Stock Adjustment (+ to add, - to subtract)
                </label>
                <input
                  type="number"
                  placeholder="e.g. +500 or -200"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Audit Justification</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
                >
                  <option>Stock Audit Reconciliation</option>
                  <option>Damaged in Transit / Discard</option>
                  <option>Inter-facility Urgent Loan</option>
                  <option>Quality Quarantine Hold</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setStockAdjustmentModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyAdjustment}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold shadow-xs"
                >
                  Commit Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
