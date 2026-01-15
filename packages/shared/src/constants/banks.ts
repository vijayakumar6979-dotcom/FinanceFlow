export interface Institution {
    id: string;
    name: string;
    fullName?: string;
    logo: string;
    color: string;
    website?: string;
    types?: string[]; // For credit cards
}

export const malaysianBanks: Institution[] = [
    {
        id: 'maybank',
        name: 'Maybank',
        fullName: 'Malayan Banking Berhad',
        logo: '/logos/banks/maybank-logo.png',
        color: '#FFD700',
        website: 'https://www.maybank.com.my'
    },
    {
        id: 'cimb',
        name: 'CIMB Bank',
        fullName: 'CIMB Bank Berhad',
        logo: '/logos/banks/cimb-logo.png',
        color: '#E31837',
        website: 'https://www.cimb.com.my'
    },
    {
        id: 'public-bank',
        name: 'Public Bank',
        fullName: 'Public Bank Berhad',
        logo: '/logos/banks/public-bank-logo.png',
        color: '#ED1C24',
        website: 'https://www.pbebank.com'
    },
    {
        id: 'rhb',
        name: 'RHB Bank',
        fullName: 'RHB Bank Berhad',
        logo: '/logos/banks/rhb-logo.png',
        color: '#003DA5',
        website: 'https://www.rhbgroup.com'
    },
    {
        id: 'hong-leong',
        name: 'Hong Leong Bank',
        fullName: 'Hong Leong Bank Berhad',
        logo: '/logos/banks/hong-leong-logo.png',
        color: '#0047AB',
        website: 'https://www.hlb.com.my'
    },
    {
        id: 'ambank',
        name: 'AmBank',
        fullName: 'AmBank (M) Berhad',
        logo: '/logos/banks/ambank-logo.png',
        color: '#C8102E',
        website: 'https://www.ambank.com.my'
    },
    {
        id: 'bsn',
        name: 'Bank Simpanan Nasional',
        fullName: 'Bank Simpanan Nasional',
        logo: '/logos/banks/bsn-logo.png',
        color: '#003DA5',
        website: 'https://www.bsn.com.my'
    },
    {
        id: 'affin',
        name: 'Affin Bank',
        fullName: 'Affin Bank Berhad',
        logo: '/logos/banks/affin-logo.png',
        color: '#00A651',
        website: 'https://www.affinbank.com.my'
    },
    {
        id: 'alliance',
        name: 'Alliance Bank',
        fullName: 'Alliance Bank Malaysia Berhad',
        logo: '/logos/banks/alliance-logo.png',
        color: '#E31937',
        website: 'https://www.allianceonline.com.my'
    },
    {
        id: 'bank-islam',
        name: 'Bank Islam',
        fullName: 'Bank Islam Malaysia Berhad',
        logo: '/logos/banks/bank-islam-logo.png',
        color: '#00A651',
        website: 'https://www.bankislam.com.my'
    },
    {
        id: 'bank-rakyat',
        name: 'Bank Rakyat',
        fullName: 'Bank Rakyat',
        logo: '/logos/banks/bank-rakyat-logo.png',
        color: '#FF6B35',
        website: 'https://www.bankrakyat.com.my'
    },
    {
        id: 'ocbc',
        name: 'OCBC Bank',
        fullName: 'OCBC Bank (Malaysia) Berhad',
        logo: '/logos/banks/ocbc-logo.png',
        color: '#EC1C24',
        website: 'https://www.ocbc.com.my'
    },
    {
        id: 'hsbc',
        name: 'HSBC Bank',
        fullName: 'HSBC Bank Malaysia Berhad',
        logo: '/logos/banks/hsbc-logo.png',
        color: '#DB0011',
        website: 'https://www.hsbc.com.my'
    },
    {
        id: 'standard-chartered',
        name: 'Standard Chartered',
        fullName: 'Standard Chartered Bank Malaysia Berhad',
        logo: '/logos/banks/sc-logo.png',
        color: '#007A33',
        website: 'https://www.sc.com/my'
    },
    {
        id: 'uob',
        name: 'UOB Bank',
        fullName: 'United Overseas Bank (Malaysia) Bhd',
        logo: '/logos/banks/uob-logo.png',
        color: '#0B3B8C',
        website: 'https://www.uob.com.my'
    },
    {
        id: 'agro-bank',
        name: 'Agro Bank',
        fullName: 'Bank Pertanian Malaysia Berhad',
        logo: '/logos/banks/agro-bank-logo.png',
        color: '#228B22',
        website: 'https://www.agrobank.com.my'
    },
    {
        id: 'muamalat',
        name: 'Bank Muamalat',
        fullName: 'Bank Muamalat Malaysia Berhad',
        logo: '/logos/banks/muamalat-logo.png',
        color: '#008B8B',
        website: 'https://www.muamalat.com.my'
    },
    {
        id: 'other',
        name: 'Other Bank',
        fullName: 'Other Financial Institution',
        logo: '/logos/banks/bank-generic-logo.png',
        color: '#6B7280',
        website: ''
    }
];

export const creditCardProviders: Institution[] = [
    {
        id: 'maybank-cc',
        name: 'Maybank Credit Card',
        fullName: 'Maybank',
        logo: '/logos/banks/maybank-logo.png',
        color: '#FFD700',
        types: ['Visa', 'Mastercard', 'American Express']
    },
    {
        id: 'cimb-cc',
        name: 'CIMB Credit Card',
        fullName: 'CIMB',
        logo: '/logos/banks/cimb-logo.png',
        color: '#E31837',
        types: ['Visa', 'Mastercard']
    },
    // Add other banks as needed
    {
        id: 'visa',
        name: 'Visa',
        logo: '/logos/banks/visa-logo.png',
        color: '#1A1F71'
    },
    {
        id: 'mastercard',
        name: 'Mastercard',
        logo: '/logos/banks/mastercard-logo.png',
        color: '#EB001B'
    },
    {
        id: 'amex',
        name: 'American Express',
        logo: '/logos/banks/amex-logo.png',
        color: '#006FCF'
    }
];

export const ewalletProviders: Institution[] = [
    {
        id: 'tng',
        name: 'Touch \'n Go eWallet',
        logo: '/logos/banks/tng-logo.png',
        color: '#1658A6',
        website: 'https://www.touchngo.com.my'
    },
    {
        id: 'grabpay',
        name: 'GrabPay',
        logo: '/logos/banks/grabpay-logo.png',
        color: '#00B14F',
        website: 'https://www.grab.com/my'
    },
    {
        id: 'boost',
        name: 'Boost',
        logo: '/logos/banks/boost-logo.png',
        color: '#8B21A8',
        website: 'https://www.myboost.com.my'
    },
    {
        id: 'shopeepay',
        name: 'ShopeePay',
        logo: '/logos/banks/shopeepay-logo.png',
        color: '#EE4D2D',
        website: 'https://shopee.com.my'
    },
    {
        id: 'bigpay',
        name: 'BigPay',
        logo: '/logos/banks/bigpay-logo.png',
        color: '#0056D2',
        website: 'https://www.bigpayme.com'
    },
    {
        id: 'mcash',
        name: 'MAE by Maybank',
        logo: '/logos/banks/mae-logo.png',
        color: '#FFD700',
        website: 'https://www.maybank.com/mae'
    },
    {
        id: 'duitnow',
        name: 'DuitNow',
        logo: '/logos/banks/duitnow-logo.png',
        color: '#FF6B00',
        website: 'https://www.duitnow.my'
    },
    {
        id: 'other-ewallet',
        name: 'Other E-Wallet',
        logo: '/logos/banks/ewallet-generic-logo.png',
        color: '#6B7280',
        website: ''
    }
];

export const accountTypeColors = {
    bank_checking: '#0066FF',
    bank_savings: '#10B981',
    credit_card: '#EF4444',
    ewallet: '#8B5CF6',
    cash: '#F59E0B'
};
