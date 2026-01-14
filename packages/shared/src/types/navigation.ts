export type RootStackParamList = {
    // Auth Routes
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;

    // Main Tab Routes
    Home: undefined;
    Transactions: undefined;
    Add: undefined;
    Budgets: undefined;
    More: undefined;

    // Feature Routes
    TransactionDetail: { id: string };
    AddTransaction: undefined;
    EditTransaction: { id: string };

    // Other Screens
    Accounts: undefined;
    Loans: undefined;
    Investments: undefined;
    Analytics: undefined;
    Settings: undefined;
    Profile: undefined;
    Notifications: undefined;
    Search: undefined;
};

export type TabParamList = {
    Home: undefined;
    Transactions: undefined;
    Add: undefined;
    Budgets: undefined;
    More: undefined;
};
