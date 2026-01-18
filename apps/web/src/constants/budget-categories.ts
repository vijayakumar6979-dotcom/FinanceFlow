
export const MASTER_BUDGET_CATEGORIES = [
    {
        id: 'food',
        name: 'Food & Dining',
        icon: '🍔',
        color: 'bg-orange-500',
        subcategories: [
            { name: 'Groceries', icon: '🛒' },
            { name: 'Restaurants / Mamak', icon: '🍽️' },
            { name: 'Coffee / Tealive', icon: '🧋' },
            { name: 'Food Delivery (Grab/Panda)', icon: '🛵' },
            { name: 'Snacks / Pasar Malam', icon: '🍢' },
            { name: 'Alcohol', icon: '🍺' }
        ]
    },
    {
        id: 'transport',
        name: 'Transportation',
        icon: '🚗',
        color: 'bg-blue-500',
        subcategories: [
            { name: 'Fuel', icon: '⛽' },
            { name: 'Toll (RFID / TnG)', icon: '🅿️' },
            { name: 'Grab / E-Hailing', icon: '🚕' },
            { name: 'Public Transport (LRT/MRT)', icon: '🚆' },
            { name: 'Car Maintenance', icon: '🔧' },
            { name: 'Car Wash', icon: '🚿' },
            { name: 'Car Insurance / Road Tax', icon: '📄' },
            { name: 'Parking', icon: '🎫' }
        ]
    },
    {
        id: 'housing',
        name: 'Housing',
        icon: '🏠',
        color: 'bg-indigo-500',
        subcategories: [
            { name: 'Rent', icon: '🔑' },
            { name: 'Mortgage', icon: '🏦' },
            { name: 'Cukai Pintu / Tanah', icon: '📋' },
            { name: 'Home Maintenance', icon: '🛠️' },
            { name: 'Furniture', icon: '🛋️' },
            { name: 'Appliances', icon: '🔌' },
            { name: 'Maid Service', icon: '🧹' }
        ]
    },
    {
        id: 'utilities',
        name: 'Utilities',
        icon: '💡',
        color: 'bg-yellow-500',
        subcategories: [
            { name: 'Electricity (TNB)', icon: '⚡', image: '/logos/tnb.svg' },
            { name: 'Water (Air Selangor)', icon: '💧', image: '/logos/air_selangor.svg' },
            { name: 'Water (PBA)', icon: '💧', image: '/logos/pba.svg' },
            { name: 'Internet (Time)', icon: '📶', image: '/logos/time.svg' },
            { name: 'Mobile (Digi)', icon: '📱', image: '/logos/digi.svg' },
            { name: 'Mobile (Maxis)', icon: '📱', image: '/logos/maxis.svg' },
            { name: 'Indah Water', icon: '🚽', image: '/logos/indah_water.svg' },
            { name: 'Gas', icon: '🔥' }
        ]
    },
    {
        id: 'shopping',
        name: 'Shopping',
        icon: '🛍️',
        color: 'bg-pink-500',
        subcategories: [
            { name: 'Clothing', icon: '👕' },
            { name: 'Shoes', icon: '👟' },
            { name: 'Electronics & Gadgets', icon: '💻' },
            { name: 'Accessories', icon: '🕶️' },
            { name: 'Beauty & Skincare', icon: '💄' },
            { name: 'Hobbies', icon: '🎨' },
            { name: 'Online Shopping (Shopee/Lazada)', icon: '📦' }
        ]
    },
    {
        id: 'office',
        name: 'Office & Education',
        icon: '📚',
        color: 'bg-teal-500',
        subcategories: [
            { name: 'Stationery & Supplies', icon: '✏️' },
            { name: 'Books', icon: '📖' },
            { name: 'Courses / Workshops', icon: '🎓' },
            { name: 'Tuition Fees', icon: '🏫' },
            { name: 'Software Subscriptions', icon: '💾' },
            { name: 'Printing / Photocopy', icon: '🖨️' }
        ]
    },
    {
        id: 'health',
        name: 'Healthcare',
        icon: '⚕️',
        color: 'bg-emerald-500',
        subcategories: [
            { name: 'Klinik / Doctor', icon: '👨‍⚕️' },
            { name: 'Pharmacy / Guardian / Watson', icon: '💊' },
            { name: 'Dental', icon: '🦷' },
            { name: 'Vision / Glasses', icon: '👓' },
            { name: 'Supplements', icon: '🌿' },
            { name: 'Medical Insurance', icon: '🏥' }
        ]
    },
    {
        id: 'entertainment',
        name: 'Entertainment',
        icon: '🎮',
        color: 'bg-purple-500',
        subcategories: [
            { name: 'Astro / Netflix / Streaming', icon: '📺' },
            { name: 'Movies (GSC/TGV)', icon: '🍿' },
            { name: 'Games', icon: '🕹️' },
            { name: 'Concerts / Events', icon: '🎫' },
            { name: 'Sports / Gym', icon: '🏋️' },
            { name: 'Holidays / Staycation', icon: '🏖️' }
        ]
    },
    {
        id: 'finance',
        name: 'Financial',
        icon: '💰',
        color: 'bg-gray-500',
        subcategories: [
            { name: 'PTPTN Repayment', icon: '🎓' },
            { name: 'Loan Repayment', icon: '💳' },
            { name: 'Credit Card Bill', icon: '🧾' },
            { name: 'Taxes (LHDN)', icon: '🏛️' },
            { name: 'Investment (ASB/Tabung Haji)', icon: '📈' },
            { name: 'Savings / Emergency Fund', icon: '🐷' },
            { name: 'Zakat / Sedekah', icon: '🤲' }
        ]
    },
    {
        id: 'family',
        name: 'Family & Kids',
        icon: '👨‍👩‍👧‍👦',
        color: 'bg-rose-500',
        subcategories: [
            { name: 'Childcare / Nursery', icon: '🍼' },
            { name: 'School Fees & Bus', icon: '🚌' },
            { name: 'Toys', icon: '🧸' },
            { name: 'Pocket Money', icon: '💵' },
            { name: 'Pet Care / Vet', icon: '🐈' },
            { name: 'Parents Allowance', icon: '👴' }
        ]
    }
];
