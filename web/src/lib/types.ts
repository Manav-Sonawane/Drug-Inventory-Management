export type UserRole = 'super_admin' | 'phc_clinic' | 'warehouse' | 'vendor';

export interface ShipmentItem {
  id: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Received' | 'Delayed' | 'Packing' | 'Pending Approval' | 'Ready for Dispatch' | 'Shipped';
  date: string;
  itemsCount: number;
  priority?: boolean;
}

export interface ManifestItem {
  id: string;
  drugName: string;
  batchNo: string;
  quantity: number;
  unit: string;
  status: 'Packed' | 'Pending' | 'Inspected';
  location?: string;
  temperatureRequirement?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  destination: string;
  requestedDate: string;
  status: 'Pending Approval' | 'Packing' | 'Ready for Dispatch' | 'Shipped' | 'Pending Ack.' | 'Preparing' | 'In Transit';
  priority: boolean;
  clearedForDispatch: boolean;
  slaLimit: string;
  manifest: ManifestItem[];
  transportDocStatus: 'Pending Generation' | 'Generated' | 'Dispatched';
  totalValue?: string;
}

export interface LowStockAlert {
  id: string;
  drugName: string;
  batchNo: string;
  currentUnits: number;
  minThreshold: number;
  unitType: string;
  severity: 'critical' | 'warning' | 'normal';
  location: string;
  daysSupplyRemaining: number;
}

export interface ConsumptionLog {
  id: string;
  wardName: string;
  icon: 'local_hospital' | 'healing' | 'child_care' | 'emergency';
  timestamp: string;
  items: { name: string; quantity: number; unit: string }[];
  requestedBy: string;
  issuedBy: string;
}

export interface Vendor {
  id: string;
  name: string;
  fulfillmentRate: number;
  avgDelay: string;
  qualityRating: number;
  status: 'Excellent' | 'Good' | 'Under Review';
  activeOrders: number;
  contactEmail: string;
}

export interface HeatmapNode {
  id: string;
  name: string;
  type: 'District Hub' | 'PHC Clinic' | 'Major Hospital' | 'Central Warehouse';
  coordinates: { x: number; y: number }; // Percentage 0-100
  status: 'critical' | 'warning' | 'optimal';
  stockLevelPercent: number;
  criticalItems: string[];
  bedCapacity?: number;
  lastUpdated: string;
}

export interface UrgentAlert {
  id: string;
  type: 'depletion' | 'delay' | 'expiry';
  title: string;
  description: string;
  severity: 'critical' | 'warning';
  timestamp: string;
  canReroute?: boolean;
  associatedBatch?: string;
  associatedOrder?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  destination: string;
  amount: number;
  status: 'Draft' | 'Submitted' | 'Paid' | 'Awaiting Payment';
  issueDate: string;
  dueDate: string;
}

export interface Batch {
  batchNumber: string;
  drugName: string;
  manufacturer: string;
  manufacturingDate: string;
  expiryDate: string;
  currentStock: number;
  unit: string;
  facilityName: string;
  temperatureRequirement?: string;
  location?: string;
  qcStatus?: 'Passed' | 'Pending' | 'Quarantine';
  inStock?: boolean;
}

