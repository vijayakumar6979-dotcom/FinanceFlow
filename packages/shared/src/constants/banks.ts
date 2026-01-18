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
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=maybank2u.com.my',
        color: '#FFD700',
        website: 'https://www.maybank.com.my'
    },
    {
        id: 'cimb',
        name: 'CIMB Bank',
        fullName: 'CIMB Bank Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=cimb.com.my',
        color: '#E31837',
        website: 'https://www.cimb.com.my'
    },
    {
        id: 'public-bank',
        name: 'Public Bank',
        fullName: 'Public Bank Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=pbebank.com',
        color: '#ED1C24',
        website: 'https://www.pbebank.com'
    },
    {
        id: 'rhb',
        name: 'RHB Bank',
        fullName: 'RHB Bank Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=rhbgroup.com',
        color: '#003DA5',
        website: 'https://www.rhbgroup.com'
    },
    {
        id: 'hong-leong',
        name: 'Hong Leong Bank',
        fullName: 'Hong Leong Bank Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=hlb.com.my',
        color: '#0047AB',
        website: 'https://www.hlb.com.my'
    },
    {
        id: 'ambank',
        name: 'AmBank',
        fullName: 'AmBank (M) Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=ambank.com.my',
        color: '#C8102E',
        website: 'https://www.ambank.com.my'
    },
    {
        id: 'bsn',
        name: 'Bank Simpanan Nasional',
        fullName: 'Bank Simpanan Nasional',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=bsn.com.my',
        color: '#003DA5',
        website: 'https://www.bsn.com.my'
    },
    {
        id: 'affin',
        name: 'Affin Bank',
        fullName: 'Affin Bank Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=affinbank.com.my',
        color: '#00A651',
        website: 'https://www.affinbank.com.my'
    },
    {
        id: 'alliance',
        name: 'Alliance Bank',
        fullName: 'Alliance Bank Malaysia Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=allianceonline.com.my',
        color: '#E31937',
        website: 'https://www.allianceonline.com.my'
    },
    {
        id: 'bank-islam',
        name: 'Bank Islam',
        fullName: 'Bank Islam Malaysia Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=bankislam.com.my',
        color: '#00A651',
        website: 'https://www.bankislam.com.my'
    },
    {
        id: 'bank-rakyat',
        name: 'Bank Rakyat',
        fullName: 'Bank Rakyat',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=bankrakyat.com.my',
        color: '#FF6B35',
        website: 'https://www.bankrakyat.com.my'
    },
    {
        id: 'ocbc',
        name: 'OCBC Bank',
        fullName: 'OCBC Bank (Malaysia) Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=ocbc.com.my',
        color: '#EC1C24',
        website: 'https://www.ocbc.com.my'
    },
    {
        id: 'hsbc',
        name: 'HSBC Bank',
        fullName: 'HSBC Bank Malaysia Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=hsbc.com.my',
        color: '#DB0011',
        website: 'https://www.hsbc.com.my'
    },
    {
        id: 'standard-chartered',
        name: 'Standard Chartered',
        fullName: 'Standard Chartered Bank Malaysia Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=sc.com',
        color: '#007A33',
        website: 'https://www.sc.com/my'
    },
    {
        id: 'uob',
        name: 'UOB Bank',
        fullName: 'United Overseas Bank (Malaysia) Bhd',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=uob.com.my',
        color: '#0B3B8C',
        website: 'https://www.uob.com.my'
    },
    {
        id: 'agro-bank',
        name: 'Agro Bank',
        fullName: 'Bank Pertanian Malaysia Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=agrobank.com.my',
        color: '#228B22',
        website: 'https://www.agrobank.com.my'
    },
    {
        id: 'muamalat',
        name: 'Bank Muamalat',
        fullName: 'Bank Muamalat Malaysia Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=muamalat.com.my',
        color: '#008B8B',
        website: 'https://www.muamalat.com.my'
    },
    {
        id: 'other',
        name: 'Other Bank',
        fullName: 'Other Financial Institution',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=google.com',
        color: '#6B7280',
        website: ''
    }
];

export const creditCardProviders: Institution[] = [
    {
        id: 'maybank-cc',
        name: 'Maybank',
        fullName: 'Malayan Banking Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=maybank2u.com.my',
        color: '#FFD700',
        types: ['Visa', 'Mastercard', 'American Express'],
        website: 'https://www.maybank.com.my'
    },
    {
        id: 'cimb-cc',
        name: 'CIMB Bank',
        fullName: 'CIMB Bank Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=cimb.com.my',
        color: '#E31837',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.cimb.com.my'
    },
    {
        id: 'public-bank-cc',
        name: 'Public Bank',
        fullName: 'Public Bank Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=pbebank.com',
        color: '#ED1C24',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.pbebank.com'
    },
    {
        id: 'rhb-cc',
        name: 'RHB Bank',
        fullName: 'RHB Bank Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=rhbgroup.com',
        color: '#003DA5',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.rhbgroup.com'
    },
    {
        id: 'hong-leong-cc',
        name: 'Hong Leong Bank',
        fullName: 'Hong Leong Bank Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=hlb.com.my',
        color: '#0047AB',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.hlb.com.my'
    },
    {
        id: 'ambank-cc',
        name: 'AmBank',
        fullName: 'AmBank (M) Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=ambank.com.my',
        color: '#C8102E',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.ambank.com.my'
    },
    {
        id: 'bsn-cc',
        name: 'Bank Simpanan Nasional',
        fullName: 'Bank Simpanan Nasional',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=bsn.com.my',
        color: '#003DA5',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.bsn.com.my'
    },
    {
        id: 'affin-cc',
        name: 'Affin Bank',
        fullName: 'Affin Bank Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=affinbank.com.my',
        color: '#00A651',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.affinbank.com.my'
    },
    {
        id: 'alliance-cc',
        name: 'Alliance Bank',
        fullName: 'Alliance Bank Malaysia Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=allianceonline.com.my',
        color: '#E31937',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.allianceonline.com.my'
    },
    {
        id: 'bank-islam-cc',
        name: 'Bank Islam',
        fullName: 'Bank Islam Malaysia Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=bankislam.com.my',
        color: '#00A651',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.bankislam.com.my'
    },
    {
        id: 'bank-rakyat-cc',
        name: 'Bank Rakyat',
        fullName: 'Bank Rakyat',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=bankrakyat.com.my',
        color: '#FF6B35',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.bankrakyat.com.my'
    },
    {
        id: 'ocbc-cc',
        name: 'OCBC Bank',
        fullName: 'OCBC Bank (Malaysia) Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=ocbc.com.my',
        color: '#EC1C24',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.ocbc.com.my'
    },
    {
        id: 'hsbc-cc',
        name: 'HSBC Bank',
        fullName: 'HSBC Bank Malaysia Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=hsbc.com.my',
        color: '#DB0011',
        types: ['Visa', 'Mastercard', 'American Express'],
        website: 'https://www.hsbc.com.my'
    },
    {
        id: 'standard-chartered-cc',
        name: 'Standard Chartered',
        fullName: 'Standard Chartered Bank Malaysia Berhad',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=sc.com',
        color: '#007A33',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.sc.com/my'
    },
    {
        id: 'uob-cc',
        name: 'UOB Bank',
        fullName: 'United Overseas Bank (Malaysia) Bhd',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=uob.com.my',
        color: '#0B3B8C',
        types: ['Visa', 'Mastercard'],
        website: 'https://www.uob.com.my'
    },
    {
        id: 'other-cc',
        name: 'Other Bank',
        fullName: 'Other Credit Card Provider',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=google.com',
        color: '#6B7280',
        types: ['Visa', 'Mastercard', 'American Express'],
        website: ''
    }
];

export const ewalletProviders: Institution[] = [
    {
        id: 'tng',
        name: 'Touch \'n Go eWallet',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=touchngo.com.my',
        color: '#1658A6',
        website: 'https://www.touchngo.com.my'
    },
    {
        id: 'grabpay',
        name: 'GrabPay',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=grab.com',
        color: '#00B14F',
        website: 'https://www.grab.com/my'
    },
    {
        id: 'boost',
        name: 'Boost',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=myboost.com.my',
        color: '#8B21A8',
        website: 'https://www.myboost.com.my'
    },
    {
        id: 'shopeepay',
        name: 'ShopeePay',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=shopee.com.my',
        color: '#EE4D2D',
        website: 'https://shopee.com.my'
    },
    {
        id: 'bigpay',
        name: 'BigPay',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=bigpayme.com',
        color: '#0056D2',
        website: 'https://www.bigpayme.com'
    },
    {
        id: 'mcash',
        name: 'MAE by Maybank',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=maybank2u.com.my',
        color: '#FFD700',
        website: 'https://www.maybank.com/mae'
    },
    {
        id: 'duitnow',
        name: 'DuitNow',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=duitnow.my',
        color: '#FF6B00',
        website: 'https://www.duitnow.my'
    },
    {
        id: 'other-ewallet',
        name: 'Other E-Wallet',
        logo: 'https://www.google.com/s2/favicons?sz=64&domain=google.com',
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
