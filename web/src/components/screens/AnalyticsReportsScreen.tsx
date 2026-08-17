'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  AlertTriangle,
  Snowflake,
  CheckCircle2,
  Package,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { analyticsApi } from '@/lib/api';

interface AnalyticsReportsScreenProps {
  onOpenExportModal: () => void;
}

export function AnalyticsReportsScreen({ onOpenExportModal }: AnalyticsReportsScreenProps) {
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [kpis, setKpis] = useState<any>(null);
  const [loadingKpis, setLoadingKpis] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    analyticsApi.dashboard()
      .then((res) => setKpis(res?.data))
      .catch(() => {})
      .finally(() => setLoadingKpis(false));
  }, []);

  // Mock trend data
  const weeklyConsumption = [
    { week: 'W1 (Oct 01)', consumed: 18400, forecast: 17500, stockRisk: 'Low' },
    { week: 'W2 (Oct 08)', consumed: 22100, forecast: 21000, stockRisk: 'Low' },
    { week: 'W3 (Oct 15)', consumed: 29800, forecast: 27000, stockRisk: 'Medium' },
    { week: 'W4 (Oct 22)', consumed: 34200, forecast: 32000, stockRisk: 'High (Insulin Surge)' },
  ];

  const categoryBreakdown = [
    { name: 'Vaccines & Immunization', share: 38, units: '124,500 doses', color: 'bg-cyan-500' },
    { name: 'Antibiotics & Anti-infectives', share: 26, units: '85,200 tabs/vials', color: 'bg-blue-600' },
    { name: 'Maternal & Child Health', share: 18, units: '58,900 ampoules', color: 'bg-emerald-500' },
    { name: 'IV Fluids & Critical Care', share: 12, units: '39,400 bottles', color: 'bg-amber-500' },
    { name: 'PPE & Surgical Disposables', share: 6, units: '19,700 items', color: 'bg-purple-500' },
  ];

  const districtPerformance = [
    { district: 'Kolkata Central & North', stockSufficiency: 96, slaOnTime: 98.2, wastagePercent: 0.4 },
    { district: 'Siliguri Foothills Division', stockSufficiency: 89, slaOnTime: 94.5, wastagePercent: 1.1 },
    { district: 'Malda Rural Sector', stockSufficiency: 82, slaOnTime: 91.0, wastagePercent: 1.8 },
    { district: 'Paschim Bardhaman & Asansol', stockSufficiency: 78, slaOnTime: 88.4, wastagePercent: 2.3 },
  ];

  return (
    <div className="space-y-6" id="analytics-reports-view">
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
            <BarChart3 className="w-4 h-4" />
            <span>Executive Forecasting Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Supply Chain Analytics & Demand Forecasting
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Predictive stockout modeling, epidemiological demand surges, and cold-chain compliance audit summaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeRange === range ? 'bg-white text-blue-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Official PDF Report</span>
          </button>
        </div>
      </div>

      {/* ── Live Backend KPI Bar ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Registered Drugs', value: kpis?.drug_count, icon: Package, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Low Stock Alerts', value: kpis?.low_stock_count, icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Active Batches', value: kpis?.batch_count, icon: BarChart3, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Pending Orders', value: kpis?.pending_po_count, icon: Activity, color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center shrink-0`}>
              <k.icon className={`w-5 h-5 ${k.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {loadingKpis ? (
                  <span className="inline-block w-10 h-6 bg-slate-100 rounded animate-pulse" />
                ) : (k.value ?? '—')}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Statewide Consumption Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">327,700 Units</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% demand surge this month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Stockout Prevention Index</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">97.8%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Zero critical stockouts reported in 45 days
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Cold Chain Integrity SLA</span>
            <Snowflake className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-cyan-700">99.4%</div>
          <div className="text-[11px] text-cyan-800 font-medium mt-1">
            3 temperature excursions auto-corrected
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Expiry Waste Reduction</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">0.82%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Far below WHO 5.0% threshold
          </div>
        </div>
      </div>

      {/* Consumption Trend & Category Allocation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Consumption vs Predicted Demand Bar Visualizer */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Consumption vs Predictive Forecast</h3>
              <p className="text-xs text-slate-500">Comparing actual distribution against seasonal surge models</p>
            </div>
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg">
              AI Forecast: +12% Surge Anticipated
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {weeklyConsumption.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-900 font-semibold">{item.week}</span>
                  <div className="space-x-4 text-slate-600">
                    <span>Actual: <strong className="text-slate-900">{item.consumed.toLocaleString()}</strong></span>
                    <span>Forecast: <strong className="text-blue-900">{item.forecast.toLocaleString()}</strong></span>
                    <span className="text-[11px] text-slate-400">Risk: {item.stockRisk}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex gap-0.5">
                  <div
                    className="bg-blue-900 h-full rounded-l-full"
                    style={{ width: `${(item.consumed / 40000) * 100}%` }}
                    title={`Consumed: ${item.consumed}`}
                  />
                  <div
                    className="bg-blue-300 h-full rounded-r-full"
                    style={{ width: `${(item.forecast / 40000) * 100}%` }}
                    title={`Forecast: ${item.forecast}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-900"></span>
              <span>Actual Dispensed Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-300"></span>
              <span>Predictive Model Baseline</span>
            </div>
          </div>
        </div>

        {/* Category Share Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">State Volume Share by Category</h3>
            <p className="text-xs text-slate-500">Proportional drug allocation this quarter</p>
          </div>

          <div className="space-y-3.5 text-xs">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{cat.name}</span>
                  <span className="font-bold text-slate-700">{cat.share}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.share}%` }} />
                </div>
                <div className="text-[11px] text-slate-400">{cat.units}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District Supply Chain Sufficiency Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Regional Division Performance Index</h3>
          <p className="text-xs text-slate-500">Stock sufficiency buffer, delivery fulfillment SLA, and wastage rate by district</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">District / Division</th>
                <th className="py-3 px-4">Stock Buffer Sufficiency</th>
                <th className="py-3 px-4">Dispatch SLA On-Time</th>
                <th className="py-3 px-4">Wastage / Expiry Rate</th>
                <th className="py-3 px-4 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {districtPerformance.map((dist, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{dist.district}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dist.stockSufficiency > 85 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${dist.stockSufficiency}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900">{dist.stockSufficiency}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-blue-900">{dist.slaOnTime}%</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{dist.wastagePercent}%</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                      Compliant
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
