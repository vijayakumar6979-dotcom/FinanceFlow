// Malaysian Bill Providers
// Official utility and service providers in Malaysia

export interface BillProvider {
    id: string;
    name: string;
    fullName: string;
    category: string;
    logo: string;
    color: string;
    website: string;
    paymentMethods: string[];
    isVariable: boolean;
    averageAmount: number;
    dueDay?: number | null;
}

export const malaysianBillProviders: BillProvider[] = [
    // Electricity
    {
        id: 'tnb',
        name: 'TNB',
        fullName: 'Tenaga Nasional Berhad',
        category: 'Electricity',
        logo: '/providers/tnb-logo.png',
        color: '#FFD700',
        website: 'https://www.tnb.com.my',
        paymentMethods: ['Online Banking', 'ATM', 'TNB App', 'Auto Debit'],
        isVariable: true,
        averageAmount: 150,
        dueDay: null
    },
    {
        id: 'sabah-electricity',
        name: 'SESB',
        fullName: 'Sabah Electricity Sdn Bhd',
        category: 'Electricity',
        logo: '/providers/sesb-logo.png',
        color: '#0066CC',
        website: 'https://www.sesb.com.my',
        paymentMethods: ['Online Banking', 'ATM', 'Counter'],
        isVariable: true,
        averageAmount: 120,
        dueDay: null
    },
    {
        id: 'sarawak-electricity',
        name: 'SEB',
        fullName: 'Sarawak Energy Berhad',
        category: 'Electricity',
        logo: '/providers/seb-logo.png',
        color: '#00A651',
        website: 'https://www.sarawakenergy.com',
        paymentMethods: ['Online Banking', 'ATM', 'Counter'],
        isVariable: true,
        averageAmount: 130,
        dueDay: null
    },

    // Water
    {
        id: 'air-selangor',
        name: 'Air Selangor',
        fullName: 'Air Selangor Sdn Bhd',
        category: 'Water',
        logo: '/providers/air-selangor-logo.png',
        color: '#0066CC',
        website: 'https://www.airselangor.com',
        paymentMethods: ['Online Banking', 'ATM', 'JomPAY'],
        isVariable: true,
        averageAmount: 30,
        dueDay: null
    },
    {
        id: 'indah-water',
        name: 'Indah Water',
        fullName: 'Indah Water Konsortium',
        category: 'Sewerage',
        logo: '/providers/indah-water-logo.png',
        color: '#0099CC',
        website: 'https://www.iwk.com.my',
        paymentMethods: ['Online Banking', 'ATM', 'JomPAY'],
        isVariable: false,
        averageAmount: 8,
        dueDay: 15
    },
    {
        id: 'saj',
        name: 'SAJ',
        fullName: 'SAJ Holdings Sdn Bhd',
        category: 'Water',
        logo: '/providers/saj-logo.png',
        color: '#0066CC',
        website: 'https://www.saj.com.my',
        paymentMethods: ['Online Banking', 'Counter'],
        isVariable: true,
        averageAmount: 25,
        dueDay: null
    },
    {
        id: 'pba',
        name: 'PBA',
        fullName: 'Perbadanan Bekalan Air Pulau Pinang',
        category: 'Water',
        logo: '/providers/pba-logo.png',
        color: '#0099FF',
        website: 'https://www.pba.com.my',
        paymentMethods: ['Online Banking', 'Counter'],
        isVariable: true,
        averageAmount: 20,
        dueDay: null
    },

    // Internet & TV
    {
        id: 'time',
        name: 'TIME',
        fullName: 'TIME dotCom Berhad',
        category: 'Internet',
        logo: '/providers/time-logo.png',
        color: '#FF0000',
        website: 'https://www.time.com.my',
        paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
        isVariable: false,
        averageAmount: 139,
        dueDay: 1
    },
    {
        id: 'tm',
        name: 'TM',
        fullName: 'Telekom Malaysia',
        category: 'Internet & Phone',
        logo: '/providers/tm-logo.png',
        color: '#E31937',
        website: 'https://www.tm.com.my',
        paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit', 'TM App'],
        isVariable: false,
        averageAmount: 129,
        dueDay: 1
    },
    {
        id: 'maxis',
        name: 'Maxis',
        fullName: 'Maxis Broadband',
        category: 'Internet & Mobile',
        logo: '/providers/maxis-logo.png',
        color: '#00A651',
        website: 'https://www.maxis.com.my',
        paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
        isVariable: false,
        averageAmount: 99,
        dueDay: null
    },
    {
        id: 'celcom',
        name: 'Celcom',
        fullName: 'Celcom Axiata Berhad',
        category: 'Mobile & Internet',
        logo: '/providers/celcom-logo.png',
        color: '#0066CC',
        website: 'https://www.celcom.com.my',
        paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
        isVariable: false,
        averageAmount: 88,
        dueDay: null
    },
    {
        id: 'digi',
        name: 'Digi',
        fullName: 'Digi Telecommunications',
        category: 'Mobile & Internet',
        logo: '/providers/digi-logo.png',
        color: '#FFD700',
        website: 'https://www.digi.com.my',
        paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
        isVariable: false,
        averageAmount: 75,
        dueDay: null
    },
    {
        id: 'unifi',
        name: 'Unifi',
        fullName: 'Unifi by TM',
        category: 'Internet & TV',
        logo: '/providers/unifi-logo.png',
        color: '#E31937',
        website: 'https://unifi.com.my',
        paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
        isVariable: false,
        averageAmount: 199,
        dueDay: null
    },
    {
        id: 'astro',
        name: 'Astro',
        fullName: 'Astro Malaysia Holdings',
        category: 'TV & Streaming',
        logo: '/providers/astro-logo.png',
        color: '#FF6600',
        website: 'https://www.astro.com.my',
        paymentMethods: ['Credit Card', 'Online Banking', 'Auto Debit'],
        isVariable: false,
        averageAmount: 99,
        dueDay: null
    },

    // Insurance
    {
        id: 'prudential',
        name: 'Prudential',
        fullName: 'Prudential Assurance Malaysia',
        category: 'Insurance',
        logo: '/providers/prudential-logo.png',
        color: '#ED1C24',
        website: 'https://www.prudential.com.my',
        paymentMethods: ['Credit Card', 'Auto Debit', 'Bank Transfer'],
        isVariable: false,
        averageAmount: 300,
        dueDay: null
    },
    {
        id: 'aia',
        name: 'AIA',
        fullName: 'AIA Malaysia',
        category: 'Insurance',
        logo: '/providers/aia-logo.png',
        color: '#E4002B',
        website: 'https://www.aia.com.my',
        paymentMethods: ['Credit Card', 'Auto Debit', 'Bank Transfer'],
        isVariable: false,
        averageAmount: 350,
        dueDay: null
    },
    {
        id: 'great-eastern',
        name: 'Great Eastern',
        fullName: 'Great Eastern Life Assurance',
        category: 'Insurance',
        logo: '/providers/great-eastern-logo.png',
        color: '#D71920',
        website: 'https://www.greateasternlife.com',
        paymentMethods: ['Credit Card', 'Auto Debit', 'Bank Transfer'],
        isVariable: false,
        averageAmount: 280,
        dueDay: null
    },

    // Subscriptions
    {
        id: 'netflix',
        name: 'Netflix',
        fullName: 'Netflix Malaysia',
        category: 'Streaming',
        logo: '/providers/netflix-logo.png',
        color: '#E50914',
        website: 'https://www.netflix.com',
        paymentMethods: ['Credit Card'],
        isVariable: false,
        averageAmount: 55,
        dueDay: null
    },
    {
        id: 'spotify',
        name: 'Spotify',
        fullName: 'Spotify Premium',
        category: 'Music Streaming',
        logo: '/providers/spotify-logo.png',
        color: '#1DB954',
        website: 'https://www.spotify.com',
        paymentMethods: ['Credit Card'],
        isVariable: false,
        averageAmount: 17.90,
        dueDay: null
    },
    {
        id: 'disney-plus',
        name: 'Disney+',
        fullName: 'Disney+ Hotstar',
        category: 'Streaming',
        logo: '/providers/disney-plus-logo.png',
        color: '#113CCF',
        website: 'https://www.hotstar.com',
        paymentMethods: ['Credit Card'],
        isVariable: false,
        averageAmount: 54.90,
        dueDay: null
    },

    // Custom
    {
        id: 'custom',
        name: 'Custom Bill',
        fullName: 'Other Service Provider',
        category: 'Other',
        logo: '/providers/bill-generic-logo.png',
        color: '#6B7280',
        website: '',
        paymentMethods: ['Custom'],
        isVariable: false,
        averageAmount: 100,
        dueDay: null
    }
];

// Helper functions
export function getBillProviderById(id: string): BillProvider | undefined {
    return malaysianBillProviders.find(provider => provider.id === id);
}

export function getBillProvidersByCategory(category: string): BillProvider[] {
    return malaysianBillProviders.filter(provider => provider.category === category);
}

export function getAllBillCategories(): string[] {
    const categories = new Set(malaysianBillProviders.map(p => p.category));
    return Array.from(categories).sort();
}
