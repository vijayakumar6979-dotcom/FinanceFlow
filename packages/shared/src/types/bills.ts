export type BillCategory = 'Electricity' | 'Water' | 'Sewerage' | 'Internet' | 'Mobile' | 'TV' | 'Insurance' | 'Streaming' | 'Other';
export type BillStatus = 'active' | 'archived';
export type PaymentStatus = 'paid' | 'unpaid' | 'overdue' | 'partial';
export type BillPaymentMethod = 'Online Banking' | 'Credit Card' | 'Auto Debit' | 'ATM' | 'Cash' | 'Other';

export type BillProvider = {
    id: string;
    name: string;
    fullName: string;
    category: BillCategory;
    logo?: string;
    color: string;
    website: string;
    isVariable: boolean;
    averageAmount: number;
    paymentMethods?: string[];
    dueDay?: number | null;
};

export interface Bill {
    id: string;
    user_id: string;

    // Provider Info
    provider_id: string;
    provider_name: string;
    provider_logo?: string;
    provider_category: BillCategory;

    // Bill Details
    bill_name: string;
    account_number?: string;
    account_number_masked?: string;

    // Amount
    is_variable: boolean;
    fixed_amount?: number;
    estimated_amount?: number;
    currency: string;

    // Schedule
    due_day: number;
    due_date_variable?: boolean;
    first_bill_date?: string;

    // Payment
    payment_method?: BillPaymentMethod;
    linked_account_id?: string;
    auto_pay_enabled: boolean;

    // Reminders
    reminder_days?: number[];
    notifications_enabled?: boolean;

    // Budget Integration
    budget_category_id?: string;
    auto_sync_budget: boolean;

    // Status
    is_active?: boolean;

    // Metadata
    notes?: string;
    created_at?: string;
    updated_at?: string;

    // Computed helpers (not in DB)
    next_due_date?: string;
    days_until_due?: number;
    current_status?: PaymentStatus;
}

export interface BillPayment {
    id: string;
    bill_id: string;
    user_id: string;

    // Payment Details
    amount: number;
    due_date: string;
    paid_date?: string;
    payment_method?: BillPaymentMethod;

    // Status
    status: PaymentStatus;

    // Links
    transaction_id?: string;
    account_id?: string;

    // Anomaly Detection
    is_anomaly?: boolean;
    anomaly_reason?: string;

    // Metadata
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface BillPrediction {
    id: string;
    bill_id: string;

    // Prediction Details
    prediction_month: string;
    predicted_amount: number;
    confidence_score: number;

    // Range
    amount_range_min: number;
    amount_range_max: number;

    // AI Reasoning
    reasoning?: string;
    factors?: string[];
    recommendations?: string[];

    // Metadata
    created_at?: string;
}

export interface CreateBillDTO {
    provider_id: string;
    provider_name: string;
    provider_logo?: string;
    provider_category: BillCategory;
    bill_name: string;
    account_number?: string;
    is_variable: boolean;
    fixed_amount?: number;
    estimated_amount?: number;
    currency?: string;
    due_day: number;
    first_bill_date?: string;
    payment_method?: BillPaymentMethod;
    linked_account_id?: string;
    auto_pay_enabled?: boolean;
    reminder_days?: number[];
    notifications_enabled?: boolean;
    budget_category_id?: string;
    auto_sync_budget?: boolean;
    notes?: string;
}

export interface UpdateBillDTO extends Partial<CreateBillDTO> {
    is_active?: boolean;
}

export interface CreateBillPaymentDTO {
    bill_id: string;
    amount: number;
    due_date: string;
    paid_date?: string;
    payment_method?: BillPaymentMethod;
    status?: PaymentStatus;
    account_id?: string;
    notes?: string;
}

export interface MarkBillAsPaidDTO {
    bill_id: string;
    payment_id: string;
    paid_date: string;
    paid_amount: number;
    payment_method?: BillPaymentMethod;
    account_id?: string;
    create_transaction?: boolean;
    notes?: string;
}

export interface BillSummary {
    total_monthly: number;
    due_this_month: {
        count: number;
        amount: number;
    };
    paid_this_month: {
        count: number;
        amount: number;
    };
    overdue: {
        count: number;
        amount: number;
    };
}

export interface BillAnomaly {
    bill_id: string;
    payment_id: string;
    is_anomaly: boolean;
    severity: 'low' | 'medium' | 'high';
    percentage_diff: number;
    message: string;
    recommendation: string;
}

export const MALAYSIAN_BILL_PROVIDERS: BillProvider[] = [
    // Electricity
    { id: 'tnb', name: 'TNB', fullName: 'Tenaga Nasional Berhad', category: 'Electricity', color: '#FFD700', website: 'https://www.tnb.com.my', logo: '/tnb.png', isVariable: true, averageAmount: 150 },
    { id: 'sabah_elec', name: 'SESB', fullName: 'Sabah Electricity', category: 'Electricity', color: '#0066CC', website: 'https://www.sesb.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=sesb.com.my', isVariable: true, averageAmount: 120 },
    { id: 'sarawak_elec', name: 'SEB', fullName: 'Sarawak Energy', category: 'Electricity', color: '#00A651', website: 'https://www.sarawakenergy.com', logo: 'https://www.google.com/s2/favicons?sz=64&domain=sarawakenergy.com', isVariable: true, averageAmount: 130 },

    // Water & Sewerage
    { id: 'air_selangor', name: 'Air Selangor', fullName: 'Air Selangor', category: 'Water', color: '#0066CC', website: 'https://www.airselangor.com', logo: 'https://www.google.com/s2/favicons?sz=64&domain=airselangor.com', isVariable: true, averageAmount: 30 },
    { id: 'indah_water', name: 'Indah Water', fullName: 'Indah Water Konsortium', category: 'Sewerage', color: '#0099CC', website: 'https://www.iwk.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=iwk.com.my', isVariable: false, averageAmount: 8 },
    { id: 'saj', name: 'SAJ', fullName: 'Ranhill SAJ', category: 'Water', color: '#0066CC', website: 'https://www.ranhillsaj.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=ranhillsaj.com.my', isVariable: true, averageAmount: 25 },
    { id: 'pba', name: 'PBA', fullName: 'PBA Penang', category: 'Water', color: '#0099FF', website: 'https://pba.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=pba.com.my', isVariable: true, averageAmount: 20 },

    // Internet & Mobile
    { id: 'time', name: 'TIME', fullName: 'TIME dotCom', category: 'Internet', color: '#FF0000', website: 'https://www.time.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=time.com.my', isVariable: false, averageAmount: 139 },
    { id: 'tm', name: 'Unifi / TM', fullName: 'Telekom Malaysia', category: 'Internet', color: '#E31937', website: 'https://unifi.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=unifi.com.my', isVariable: false, averageAmount: 159 },
    { id: 'maxis', name: 'Maxis', fullName: 'Maxis Broadband', category: 'Mobile', color: '#82D243', website: 'https://www.maxis.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=maxis.com.my', isVariable: false, averageAmount: 128 },
    { id: 'celcom', name: 'CelcomDigi', fullName: 'CelcomDigi', category: 'Mobile', color: '#0095DA', website: 'https://celcomdigi.com', logo: 'https://www.google.com/s2/favicons?sz=64&domain=celcomdigi.com', isVariable: false, averageAmount: 98 },
    { id: 'u_mobile', name: 'U Mobile', fullName: 'U Mobile', category: 'Mobile', color: '#FF6A00', website: 'https://www.u.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=u.com.my', isVariable: false, averageAmount: 68 },

    // Entertainment
    { id: 'astro', name: 'Astro', fullName: 'Astro Malaysia', category: 'TV', color: '#E5007D', website: 'https://www.astro.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=astro.com.my', isVariable: false, averageAmount: 99 },
    { id: 'netflix', name: 'Netflix', fullName: 'Netflix', category: 'TV', color: '#E50914', website: 'https://www.netflix.com', logo: 'https://www.google.com/s2/favicons?sz=64&domain=netflix.com', isVariable: false, averageAmount: 55 },
    { id: 'spotify', name: 'Spotify', fullName: 'Spotify', category: 'TV', color: '#1DB954', website: 'https://www.spotify.com', logo: 'https://www.google.com/s2/favicons?sz=64&domain=spotify.com', isVariable: false, averageAmount: 16 },

    // Insurance
    { id: 'aia', name: 'AIA', fullName: 'AIA Insurance', category: 'Insurance', color: '#D31145', website: 'https://www.aia.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=aia.com.my', isVariable: false, averageAmount: 300 },
    { id: 'prudential', name: 'Prudential', fullName: 'Prudential Assurance', category: 'Insurance', color: '#ED1B24', website: 'https://www.prudential.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=prudential.com.my', isVariable: false, averageAmount: 250 },
    { id: 'great_eastern', name: 'Great Eastern', fullName: 'Great Eastern Life', category: 'Insurance', color: '#E2231A', website: 'https://www.greateasternlife.com', logo: 'https://www.google.com/s2/favicons?sz=64&domain=greateasternlife.com', isVariable: false, averageAmount: 280 },
    { id: 'etiqa', name: 'Etiqa', fullName: 'Etiqa Takaful', category: 'Insurance', color: '#F4B223', website: 'https://www.etiqa.com.my', logo: 'https://www.google.com/s2/favicons?sz=64&domain=etiqa.com.my', isVariable: false, averageAmount: 200 },

    // Council Assessment (Cukai Pintu/Taksiran)
    { id: 'mbsp', name: 'MBSP', fullName: 'Majlis Bandaraya Seberang Perai', category: 'Other', color: '#F7941D', website: 'https://www.mbsp.gov.my', logo: '/mbsp.png', isVariable: false, averageAmount: 150 },
    { id: 'mbpp', name: 'MBPP', fullName: 'Majlis Bandaraya Pulau Pinang', category: 'Other', color: '#F7941D', website: 'https://www.mbpp.gov.my', logo: '/mbpp.png', isVariable: false, averageAmount: 180 },
];
