/**
 * Malaysian Loan Providers and Loan Type Definitions
 * Used for loan creation wizard and lender selection
 */

export interface LoanProvider {
    id: string;
    name: string;
    fullName: string;
    logo: string;
    color: string;
    loanTypes: string[];
    website?: string;
    isIslamic?: boolean;
    description?: string;
    interestRates?: {
        [key: string]: { min: number; max: number };
    };
}

export interface LoanType {
    id: string;
    name: string;
    icon: string;
    color: string;
    typicalTerm: string;
    typicalRate: string;
    description: string;
    malaysianContext: string;
}

// Malaysian Loan Providers
export const MALAYSIAN_LOAN_PROVIDERS: LoanProvider[] = [
    // Major Banks
    {
        id: 'maybank',
        name: 'Maybank',
        fullName: 'Malayan Banking Berhad',
        logo: '/logos/lenders/maybank.svg',
        color: '#FFD700',
        loanTypes: ['home', 'personal', 'auto', 'education'],
        website: 'https://www.maybank.com.my',
        interestRates: {
            home: { min: 3.5, max: 4.5 },
            personal: { min: 5.5, max: 16.0 },
            auto: { min: 2.5, max: 3.5 },
            education: { min: 4.0, max: 6.0 }
        }
    },
    {
        id: 'cimb',
        name: 'CIMB Bank',
        fullName: 'CIMB Bank Berhad',
        logo: '/logos/lenders/cimb.svg',
        color: '#E31837',
        loanTypes: ['home', 'personal', 'auto', 'education'],
        website: 'https://www.cimb.com.my',
        interestRates: {
            home: { min: 3.4, max: 4.4 },
            personal: { min: 5.0, max: 15.5 },
            auto: { min: 2.4, max: 3.4 }
        }
    },
    {
        id: 'public-bank',
        name: 'Public Bank',
        fullName: 'Public Bank Berhad',
        logo: '/logos/lenders/public-bank.svg',
        color: '#ED1C24',
        loanTypes: ['home', 'personal', 'auto', 'education'],
        website: 'https://www.pbebank.com',
        interestRates: {
            home: { min: 3.6, max: 4.6 },
            personal: { min: 6.0, max: 16.5 },
            auto: { min: 2.6, max: 3.6 }
        }
    },
    {
        id: 'rhb',
        name: 'RHB Bank',
        fullName: 'RHB Bank Berhad',
        logo: '/logos/lenders/rhb.svg',
        color: '#003DA5',
        loanTypes: ['home', 'personal', 'auto', 'education'],
        website: 'https://www.rhbgroup.com'
    },
    {
        id: 'hong-leong',
        name: 'Hong Leong Bank',
        fullName: 'Hong Leong Bank Berhad',
        logo: '/logos/lenders/hong-leong.svg',
        color: '#0047AB',
        loanTypes: ['home', 'personal', 'auto', 'education'],
        website: 'https://www.hlb.com.my'
    },
    {
        id: 'ambank',
        name: 'AmBank',
        fullName: 'AmBank (M) Berhad',
        logo: '/logos/lenders/ambank.svg',
        color: '#C8102E',
        loanTypes: ['home', 'personal', 'auto', 'education'],
        website: 'https://www.ambank.com.my'
    },
    {
        id: 'bank-islam',
        name: 'Bank Islam',
        fullName: 'Bank Islam Malaysia Berhad',
        logo: '/logos/lenders/bank-islam.svg',
        color: '#00A651',
        loanTypes: ['home', 'personal', 'auto', 'education'],
        isIslamic: true,
        website: 'https://www.bankislam.com.my'
    },

    // Government Agencies
    {
        id: 'ptptn',
        name: 'PTPTN',
        fullName: 'Perbadanan Tabung Pendidikan Tinggi Nasional',
        logo: '/logos/lenders/ptptn.svg',
        color: '#0066CC',
        loanTypes: ['education'],
        website: 'https://www.ptptn.gov.my',
        description: 'National Higher Education Fund'
    },
    {
        id: 'kwsp',
        name: 'KWSP Housing Loan',
        fullName: 'Kumpulan Wang Simpanan Pekerja',
        logo: '/logos/lenders/kwsp.svg',
        color: '#006B3F',
        loanTypes: ['home'],
        website: 'https://www.kwsp.gov.my',
        description: 'EPF Housing Loan Withdrawal'
    },

    // Other
    {
        id: 'other',
        name: 'Other Lender',
        fullName: 'Custom Financial Institution',
        logo: '/logos/lenders/generic.svg',
        color: '#6B7280',
        loanTypes: ['home', 'personal', 'auto', 'education', 'business']
    }
];

// Loan Type Definitions
export const LOAN_TYPES: LoanType[] = [
    {
        id: 'home',
        name: 'Home Loan / Mortgage',
        icon: 'home',
        color: '#0066FF',
        typicalTerm: '25-35 years',
        typicalRate: '3.5% - 4.5%',
        description: 'House purchase, refinancing',
        malaysianContext: 'Housing loan for property purchase in Malaysia'
    },
    {
        id: 'auto',
        name: 'Car Loan / Auto Financing',
        icon: 'car',
        color: '#EF4444',
        typicalTerm: '5-9 years',
        typicalRate: '2.5% - 3.5%',
        description: 'New or used vehicle purchase',
        malaysianContext: 'Hire purchase for cars in Malaysia'
    },
    {
        id: 'personal',
        name: 'Personal Loan',
        icon: 'user',
        color: '#10B981',
        typicalTerm: '1-7 years',
        typicalRate: '5% - 16%',
        description: 'Debt consolidation, medical, renovation',
        malaysianContext: 'Unsecured personal financing'
    },
    {
        id: 'education',
        name: 'Education Loan',
        icon: 'book',
        color: '#F59E0B',
        typicalTerm: '10-20 years',
        typicalRate: '4% - 6%',
        description: 'University, college tuition fees',
        malaysianContext: 'PTPTN or bank education financing'
    },
    {
        id: 'business',
        name: 'Business Loan',
        icon: 'briefcase',
        color: '#8B5CF6',
        typicalTerm: '1-10 years',
        typicalRate: '6% - 12%',
        description: 'SME financing, working capital',
        malaysianContext: 'Business term loan or working capital'
    },
    {
        id: 'islamic',
        name: 'Islamic Financing',
        icon: 'star-half',
        color: '#06B6D4',
        typicalTerm: 'Varies',
        typicalRate: 'Profit rate: 3% - 8%',
        description: 'Shariah-compliant financing',
        malaysianContext: 'Murabahah, Ijarah, Musharakah financing'
    }
];

// Helper functions
export const getLoanProviderById = (id: string): LoanProvider | undefined => {
    return MALAYSIAN_LOAN_PROVIDERS.find(provider => provider.id === id);
};

export const getLoanTypeById = (id: string): LoanType | undefined => {
    return LOAN_TYPES.find(type => type.id === id);
};

export const getProvidersForLoanType = (loanTypeId: string): LoanProvider[] => {
    return MALAYSIAN_LOAN_PROVIDERS.filter(provider =>
        provider.loanTypes.includes(loanTypeId)
    );
};

export const getTypicalInterestRate = (providerId: string, loanTypeId: string): { min: number; max: number } | null => {
    const provider = getLoanProviderById(providerId);
    if (!provider || !provider.interestRates) return null;
    return provider.interestRates[loanTypeId] || null;
};
