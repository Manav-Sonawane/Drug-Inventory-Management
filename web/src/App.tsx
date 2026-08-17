'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  ShipmentItem,
  Order,
  LowStockAlert,
  ConsumptionLog,
  Vendor,
  HeatmapNode,
  UrgentAlert,
  Invoice,
} from '@/lib/types';
import {
  initialShipments,
  initialOrders,
  initialLowStockAlerts,
  initialConsumptionLogs,
  initialVendors,
  initialHeatmapNodes,
  initialUrgentAlerts,
  initialInvoices,
} from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/screens/LoginScreen';
import {
  analyticsApi,
  warehouseApi,
  procurementApi,
  shipmentsApi,
  consumptionApi,
  adminApi,
} from '@/lib/api';

import SidebarNav from '@/components/SidebarNav';
import TopHeader from '@/components/TopHeader';
import MobileBottomNav from '@/components/MobileBottomNav';
import StatewideDashboard from '@/components/screens/StatewideDashboard';
import PHCClinicDashboard from '@/components/screens/PHCClinicDashboard';
import WarehousePortal from '@/components/screens/WarehousePortal';
import VendorPortal from '@/components/screens/VendorPortal';
import { InventoryScreen } from '@/components/screens/InventoryScreen';
import { OrdersScreen } from '@/components/screens/OrdersScreen';
import { WarehousesScreen } from '@/components/screens/WarehousesScreen';
import { PartnersScreen } from '@/components/screens/PartnersScreen';
import { AnalyticsReportsScreen } from '@/components/screens/AnalyticsReportsScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { SupportScreen } from '@/components/screens/SupportScreen';
import { AuditLogScreen } from '@/components/screens/AuditLogScreen';
import ReceiptView from '@/components/screens/ReceiptView';

import ScannerModal from '@/components/modals/ScannerModal';
import LogConsumptionModal from '@/components/modals/LogConsumptionModal';
import CreateOrderModal from '@/components/modals/CreateOrderModal';
import RerouteStockModal from '@/components/modals/RerouteStockModal';
import TransportQRModal from '@/components/modals/TransportQRModal';
import CreateInvoiceModal from '@/components/modals/CreateInvoiceModal';
import ExportReportModal from '@/components/modals/ExportReportModal';
import { BatchTraceabilityModal } from '@/components/modals/BatchTraceabilityModal';
import { ColdChainLiveTelemetryModal } from '@/components/modals/ColdChainLiveTelemetryModal';
import { AiLogisticsAssistantDrawer } from '@/components/AiLogisticsAssistantDrawer';
import { CommandPaletteModal } from '@/components/CommandPaletteModal';
import { CheckCircle2, ShieldAlert, Sparkles, Smartphone, Monitor } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Map backend role to frontend UserRole
  const roleMap: Record<string, UserRole> = {
    ADMIN: 'super_admin',
    PROCUREMENT: 'super_admin',
    WAREHOUSE: 'warehouse',
    VENDOR: 'vendor',
    HOSPITAL: 'phc_clinic',
    DELIVERY: 'phc_clinic',
  };

  // Global State
  const [currentRole, setCurrentRole] = useState<UserRole>('phc_clinic');

  // UI Navigation
  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileTab, setMobileTab] = useState('home');

  // Interactive Data States (fallback to mock while API loads)
  const [shipments, setShipments] = useState<ShipmentItem[]>(initialShipments);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>(initialLowStockAlerts);
  const [consumptionLogs, setConsumptionLogs] = useState<ConsumptionLog[]>(initialConsumptionLogs);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [heatmapNodes, setHeatmapNodes] = useState<HeatmapNode[]>(initialHeatmapNodes);
  const [urgentAlerts, setUrgentAlerts] = useState<UrgentAlert[]>(initialUrgentAlerts);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  // Modal Visibility States
  const [scannerOpen, setScannerOpen] = useState(false);
  const [logConsumptionOpen, setLogConsumptionOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [rerouteModalOpen, setRerouteModalOpen] = useState(false);
  const [rerouteTargetTitle, setRerouteTargetTitle] = useState('Insulin Depletion - Zone B');
  const [transportQROpen, setTransportQROpen] = useState(false);
  const [selectedOrderForQR, setSelectedOrderForQR] = useState<Order | null>(null);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [exportReportOpen, setExportReportOpen] = useState(false);

  // New Enhanced Modals
  const [batchTraceModalOpen, setBatchTraceModalOpen] = useState(false);
  const [selectedBatchForTrace, setSelectedBatchForTrace] = useState<any>(null);
  const [coldChainModalOpen, setColdChainModalOpen] = useState(false);
  const [aiAdvisorDrawerOpen, setAiAdvisorDrawerOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // API-driven state
  const [apiDashboardKpis, setApiDashboardKpis] = useState<any>(null);
  const [apiShipments, setApiShipments] = useState<any[]>([]);
  const [apiOrders, setApiOrders] = useState<any[]>([]);
  const [apiVendors, setApiVendors] = useState<any[]>([]);
  const [apiInventory, setApiInventory] = useState<any[]>([]);
  const [apiExpiryAlerts, setApiExpiryAlerts] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Set role from logged-in user
  useEffect(() => {
    if (user?.role) {
      setCurrentRole(roleMap[user.role] || 'phc_clinic');
    }
  }, [user]);

  // Fetch all real data on login
  const fetchAllData = useCallback(async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      const [kpis, shipmentsRes, ordersRes, vendorsRes, inventoryRes, expiryRes] = await Promise.allSettled([
        analyticsApi.dashboard(),
        shipmentsApi.list(),
        procurementApi.list(),
        adminApi.vendors.list(),
        warehouseApi.inventory(),
        warehouseApi.expiryAlerts(),
      ]);

      if (kpis.status === 'fulfilled') setApiDashboardKpis(kpis.value?.data);

      if (shipmentsRes.status === 'fulfilled' && shipmentsRes.value?.data?.length > 0) {
        setApiShipments(shipmentsRes.value.data);
        const mappedShipments: ShipmentItem[] = shipmentsRes.value.data.map((s: any) => ({
          id: s.tracking_number || `#SHP-${s.id.slice(0, 4)}`,
          origin: s.from_warehouse_name || 'Central Warehouse',
          destination: s.to_hospital_name || 'Primary Health Centre',
          status: s.status === 'delivered' ? 'Received' : s.status === 'in_transit' ? 'In Transit' : 'Packing',
          date: s.created_date ? new Date(s.created_date).toLocaleDateString('en-IN') : 'Recent',
          itemsCount: 500,
          priority: false,
        }));
        setShipments(mappedShipments);
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data?.length > 0) {
        setApiOrders(ordersRes.value.data);
        const mappedOrders: Order[] = ordersRes.value.data.map((po: any) => {
          let dest = po.vendor_name || 'City Hospital North Wing';
          let batchStr = `LOT-${po.id.slice(0, 6)}`;
          if (po.notes) {
            if (po.notes.includes('Destination:')) {
              const part = po.notes.split('Destination:')[1].split('|')[0].trim();
              if (part) dest = part;
            } else if (po.notes.includes('destination:')) {
              const part = po.notes.split('destination:')[1].split('|')[0].trim();
              if (part) dest = part;
            }
            if (po.notes.includes('Batch:')) {
              const bPart = po.notes.split('Batch:')[1].trim();
              if (bPart) batchStr = bPart;
            }
          }
          return {
            id: po.id,
            orderNumber: po.po_number || `ORD-${po.id.slice(0, 4)}`,
            destination: dest,
            requestedDate: po.created_at ? new Date(po.created_at).toLocaleDateString('en-IN') : 'Today',
            status: po.status === 'approved' ? 'Ready for Dispatch' : po.status === 'rejected' ? 'Pending Approval' : 'Packing',
            priority: (po.total_cost > 50000) || (po.notes?.includes('Priority')),
            clearedForDispatch: po.status === 'approved',
            slaLimit: '24 hrs remaining',
            totalValue: `₹${(po.total_cost || 0).toLocaleString()}`,
            transportDocStatus: po.status === 'approved' ? 'Generated' : 'Pending Generation',
            manifest: [
              {
                id: `m-${po.id}`,
                drugName: po.drug_name || 'Pharmaceutical Batch',
                batchNo: batchStr,
                quantity: po.quantity || 100,
                unit: 'Units',
                status: po.status === 'approved' ? 'Inspected' : 'Packed',
              }
            ]
          };
        });
        setOrders(mappedOrders);
      }

      if (vendorsRes.status === 'fulfilled' && vendorsRes.value?.data?.length > 0) {
        setApiVendors(vendorsRes.value.data);
        const mappedVendors: Vendor[] = vendorsRes.value.data.map((v: any) => ({
          id: v.id,
          name: v.name,
          fulfillmentRate: v.on_time_delivery_pct || 96.5,
          avgDelay: '0.4 days',
          qualityRating: v.quality_score || 4.8,
          status: v.approval_status === 'active' ? 'Excellent' : 'Under Review',
          activeOrders: 4,
          contactEmail: v.contact || 'contact@partner.in',
        }));
        setVendors(mappedVendors);
      }

      if (inventoryRes.status === 'fulfilled') setApiInventory(inventoryRes.value?.data || []);

      if (expiryRes.status === 'fulfilled' && expiryRes.value?.data?.length > 0) {
        setApiExpiryAlerts(expiryRes.value.data);
        const mappedAlerts: LowStockAlert[] = expiryRes.value.data.map((e: any) => ({
          id: e.id,
          drugName: e.drug_name,
          batchNo: e.batch_number,
          currentUnits: e.current_qty,
          minThreshold: e.expiry_threshold_days || 30,
          unitType: 'Units',
          severity: (e.severity as any) || 'warning',
          location: e.warehouse_name || 'Central Bay',
          daysSupplyRemaining: e.days_to_expiry ?? 15,
        }));
        setLowStockAlerts(mappedAlerts);
      }
    } catch (err: any) {
      setApiError('Failed to load data from server.');
      console.error('API fetch error:', err);
    } finally {
      setApiLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated, fetchAllData]);

  // Keyboard shortcut for Cmd+K / Ctrl+K (registered here so it's above early-return guards)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0f172a', color: '#7c3aed', fontFamily: 'Inter, sans-serif',
      }}>
        Loading...
      </div>
    );
  }

  // Check if URL has receipt parameter (e.g. when scanned by camera from phone)
  const isReceiptRoute = typeof window !== 'undefined' && (
    window.location.search.includes('receipt=') ||
    window.location.pathname.startsWith('/receipt') ||
    window.location.search.includes('view=waybill_receipt')
  );

  if (isReceiptRoute) {
    return <ReceiptView onBackToApp={() => { window.location.href = '/'; }} />;
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers
  const handleScanComplete = (scannedData: {
    code: string;
    type: string;
    origin: string;
    items: string;
    batchNo: string;
    temperature: string;
  }) => {
    const newShipment: ShipmentItem = {
      id: `#SHP-${Math.floor(8000 + Math.random() * 900)}`,
      origin: scannedData.origin,
      destination: 'Primary Health Centre, Malda',
      status: 'Received',
      date: 'Today, Just now',
      itemsCount: 650,
      priority: false,
    };

    setShipments([newShipment, ...shipments]);

    // Increase stock for Paracetamol and Amoxicillin
    setLowStockAlerts((prev) =>
      prev.map((item) => {
        if (item.drugName.includes('Paracetamol')) {
          return { ...item, currentUnits: item.currentUnits + 500, severity: 'normal' };
        }
        if (item.drugName.includes('Amoxicillin')) {
          return { ...item, currentUnits: item.currentUnits + 250, severity: 'normal' };
        }
        return item;
      })
    );

    showToast(`Consignment ${scannedData.code} successfully verified & received into pharmacy stock!`);
  };

  const handleAddConsumption = async (newLog: ConsumptionLog) => {
    // Optimistic UI update
    setConsumptionLogs([newLog, ...consumptionLogs]);
    showToast(`Logged consumption: ${newLog.items[0]?.name} issued to ${newLog.wardName}`);

    // POST to backend SQLite database
    try {
      let batchId = (newLog as any).batch_id;
      let hospitalId = (newLog as any).hospital_id;

      if (!batchId || !hospitalId) {
        const [invRes, hospRes] = await Promise.all([
          warehouseApi.inventory(),
          adminApi.hospitals.list(),
        ]);
        if (!batchId && invRes?.data?.length > 0) {
          const match = invRes.data.find((b: any) => 
            b.drug_name?.toLowerCase().includes(newLog.items[0]?.name?.toLowerCase()) || 
            b.batch_number === (newLog as any).batchNo
          );
          batchId = match ? match.id : invRes.data[0].id;
        }
        if (!hospitalId && hospRes?.data?.length > 0) {
          hospitalId = hospRes.data[0].id;
        }
      }

      if (batchId && hospitalId) {
        await consumptionApi.log({
          hospital_id: hospitalId,
          batch_id: batchId,
          quantity: newLog.items[0]?.quantity || 1,
          ward: newLog.wardName,
          notes: `Logged via PHC portal`,
        });
        // Refresh inventory & alerts after stock deduction
        const [updatedInv, updatedAlerts] = await Promise.all([
          warehouseApi.inventory(),
          warehouseApi.expiryAlerts(),
        ]);
        setApiInventory(updatedInv?.data || []);
        if (updatedAlerts?.data?.length > 0) {
          setApiExpiryAlerts(updatedAlerts.data);
        }
      }
    } catch (err) {
      console.warn('Consumption log to API failed (non-blocking):', err);
    }
  };

  const handleCreateOrder = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id && o.orderNumber !== newOrder.orderNumber)]);
    showToast(`Order #${newOrder.orderNumber} added to dispatch pipeline!`);

    // Refresh POs from backend
    try {
      const refreshed = await procurementApi.list();
      if (refreshed?.data?.length > 0) {
        setApiOrders(refreshed.data);
      }
    } catch (err) {
      console.warn('PO refresh failed:', err);
    }
  };

  const handleRerouteComplete = (details: {
    drug: string;
    quantity: number;
    from: string;
    to: string;
  }) => {
    // Add shipment
    const newShp: ShipmentItem = {
      id: `#REROUTE-${Math.floor(1000 + Math.random() * 9000)}`,
      origin: details.from.split('(')[0].trim(),
      destination: details.to.split('(')[0].trim(),
      status: 'In Transit',
      date: 'Today, Priority Express',
      itemsCount: details.quantity,
      priority: true,
    };
    setShipments([newShp, ...shipments]);

    // Update heatmap nodes
    setHeatmapNodes((prev) =>
      prev.map((node) => {
        if (node.status === 'critical') {
          return { ...node, status: 'warning', stockLevelPercent: node.stockLevelPercent + 25 };
        }
        return node;
      })
    );

    showToast(`Emergency re-route authorized: ${details.quantity} units dispatched to ${details.to.split('(')[0]}`);
  };

  const handleConfirmDispatch = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'Shipped', transportDocStatus: 'Dispatched' }
          : o
      )
    );
    showToast(`Order #${orderId} marked as Shipped. QR Waybill active.`);
  };

  const handleCreateInvoice = (newInvoice: Invoice) => {
    setInvoices([newInvoice, ...invoices]);
    showToast(`Invoice #${newInvoice.invoiceNumber} submitted for Rs ${newInvoice.amount.toLocaleString()}`);
  };

  const handleAcknowledgeOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'Preparing' } : o
      )
    );
    showToast(`Order #${orderId} acknowledged by vendor partner.`);
  };

  const handleOpenReroute = (alertTitle?: string) => {
    if (alertTitle) setRerouteTargetTitle(alertTitle);
    setRerouteModalOpen(true);
  };

  const handleOpenTransportQR = (order: Order) => {
    setSelectedOrderForQR(order);
    setTransportQROpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-blue-400/40 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header with Portal Role Switcher & Phone Simulator Toggle */}
      <TopHeader
        currentRole={currentRole}
        onSelectRole={(role) => {
          setCurrentRole(role);
          // If switching to PHC clinic, default to home
          if (role === 'phc_clinic') setActiveNav('dashboard');
        }}
        onOpenCreateOrder={() => setCreateOrderOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenTelemetryModal={() => setColdChainModalOpen(true)}
        onOpenAiAdvisor={() => setAiAdvisorDrawerOpen(true)}
      />

      {/* Desktop Enterprise Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <SidebarNav
            currentRole={currentRole}
            onSelectRole={setCurrentRole}
            activeNav={activeNav}
            onSelectNav={setActiveNav}
            onOpenCreateOrder={() => setCreateOrderOpen(true)}
            onOpenAiAdvisor={() => setAiAdvisorDrawerOpen(true)}
            onOpenTelemetryModal={() => setColdChainModalOpen(true)}
          />

          {/* Main Content Workspace Canvas */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f8f9fb]">
            <div className="max-w-[1440px] mx-auto">
              {activeNav === 'dashboard' && (
                <>
                  {currentRole === 'super_admin' && (
                    <StatewideDashboard
                      onOpenReroute={handleOpenReroute}
                      onOpenExport={() => setExportReportOpen(true)}
                      urgentAlerts={urgentAlerts}
                      vendors={vendors}
                      heatmapNodes={heatmapNodes}
                    />
                  )}

                  {currentRole === 'phc_clinic' && (
                    <PHCClinicDashboard
                      onOpenScanner={() => setScannerOpen(true)}
                      onOpenLogConsumption={() => setLogConsumptionOpen(true)}
                      shipments={shipments}
                      lowStockAlerts={lowStockAlerts}
                      consumptionLogs={consumptionLogs}
                    />
                  )}

                  {currentRole === 'warehouse' && (
                    <WarehousePortal
                      orders={orders}
                      onOpenTransportQR={handleOpenTransportQR}
                      onCreateNewOrder={() => setCreateOrderOpen(true)}
                    />
                  )}

                  {currentRole === 'vendor' && (
                    <VendorPortal
                      orders={orders}
                      invoices={invoices}
                      onOpenCreateInvoice={() => setCreateInvoiceOpen(true)}
                      onAcknowledgeOrder={handleAcknowledgeOrder}
                    />
                  )}
                </>
              )}

              {activeNav === 'inventory' && (
                <InventoryScreen
                  onOpenOrderModal={() => setCreateOrderOpen(true)}
                  onOpenRerouteModal={handleOpenReroute}
                  onOpenBatchTrace={(batch) => {
                    setSelectedBatchForTrace(batch);
                    setBatchTraceModalOpen(true);
                  }}
                />
              )}

              {activeNav === 'orders' && (
                <OrdersScreen
                  orders={orders}
                  onOpenTransportQR={handleOpenTransportQR}
                  onCreateNewOrder={() => setCreateOrderOpen(true)}
                />
              )}

              {activeNav === 'warehouses' && (
                <WarehousesScreen
                  onOpenRerouteModal={handleOpenReroute}
                />
              )}

              {activeNav === 'partners' && (
                <PartnersScreen
                  vendors={vendors}
                  onOpenOrderModal={() => setCreateOrderOpen(true)}
                />
              )}

              {activeNav === 'reports' && (
                <AnalyticsReportsScreen
                  onOpenExportModal={() => setExportReportOpen(true)}
                />
              )}

              {activeNav === 'settings' && <SettingsScreen />}

              {activeNav === 'support' && <SupportScreen />}

              {activeNav === 'audit' && <AuditLogScreen />}
            </div>
          </main>
        </div>

      {/* Mobile Floating Action Button & Nav for actual small screen viewport if not in frame mode */}
      {currentRole === 'phc_clinic' && (
        <div className="md:hidden">
          <MobileBottomNav
            activeTab={mobileTab}
            onSelectTab={setMobileTab}
            onOpenScanner={() => setScannerOpen(true)}
          />
        </div>
      )}

      {/* Modals */}
      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      <LogConsumptionModal
        isOpen={logConsumptionOpen}
        onClose={() => setLogConsumptionOpen(false)}
        onAddConsumption={handleAddConsumption}
        stockList={lowStockAlerts}
      />

      <CreateOrderModal
        isOpen={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
        onCreateOrder={handleCreateOrder}
      />

      <RerouteStockModal
        isOpen={rerouteModalOpen}
        onClose={() => setRerouteModalOpen(false)}
        targetAlertTitle={rerouteTargetTitle}
        onRerouteComplete={handleRerouteComplete}
      />

      <TransportQRModal
        isOpen={transportQROpen}
        onClose={() => setTransportQROpen(false)}
        order={selectedOrderForQR}
        onConfirmDispatch={handleConfirmDispatch}
      />

      <CreateInvoiceModal
        isOpen={createInvoiceOpen}
        onClose={() => setCreateInvoiceOpen(false)}
        onCreateInvoice={handleCreateInvoice}
      />

      <ExportReportModal
        isOpen={exportReportOpen}
        onClose={() => setExportReportOpen(false)}
      />

      {/* Advanced Batch Traceability Modal */}
      <BatchTraceabilityModal
        isOpen={batchTraceModalOpen}
        onClose={() => setBatchTraceModalOpen(false)}
        batch={selectedBatchForTrace}
        onOpenTelemetry={() => setColdChainModalOpen(true)}
        onOpenReroute={(batchNo) => {
          handleOpenReroute(`Transfer Batch ${batchNo}`);
        }}
      />

      {/* Real-time Cold Chain IoT Telemetry Modal */}
      <ColdChainLiveTelemetryModal
        isOpen={coldChainModalOpen}
        onClose={() => setColdChainModalOpen(false)}
        onEmergencyReroute={(vaultName) => {
          handleOpenReroute(`Cold Excursion in ${vaultName}`);
        }}
      />

      {/* AI Logistics & Outbreak Advisor Drawer */}
      <AiLogisticsAssistantDrawer
        isOpen={aiAdvisorDrawerOpen}
        onClose={() => setAiAdvisorDrawerOpen(false)}
        onOpenRerouteModal={(title) => handleOpenReroute(title)}
      />

      {/* Command Palette (Cmd + K) Modal */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(screen) => setActiveNav(screen)}
        onOpenScanner={() => setScannerOpen(true)}
        onOpenOrderModal={() => setCreateOrderOpen(true)}
        onOpenRerouteModal={(title) => handleOpenReroute(title)}
        onOpenTelemetryModal={() => setColdChainModalOpen(true)}
        onOpenAiAdvisor={() => setAiAdvisorDrawerOpen(true)}
        onSelectBatch={(batchNo) => {
          setSelectedBatchForTrace({
            batchNumber: batchNo,
            drugName: 'Rotavirus / Vaccine Lot',
            manufacturer: 'Serum BioTech Ltd',
            manufacturingDate: 'Jan 2024',
            expiryDate: 'Dec 2024',
            currentStock: 8400,
            unit: 'Doses',
            facilityName: 'Central State Medical Warehouse',
            temperatureRequirement: '2°C to 8°C (Cold Chain)',
            location: 'Central Hub - Cold Vault 02',
            qcStatus: 'Passed',
            inStock: true,
          });
          setBatchTraceModalOpen(true);
        }}
      />
    </div>
  );
}
