Following the global rules, implement complete authentication system with user registration, login, profile management, and Row Level Security (RLS) for data protection across all tables for BOTH web and mobile platforms.

---

## 🎯 OVERVIEW

Build a complete authentication and user management system that:
- User registration with email verification
- Login with email/password
- Social login (Google, Apple, Facebook)
- Password reset and recovery
- User profile management
- Profile picture upload
- User preferences and settings
- Multi-currency selection
- Theme preferences (dark/light)
- Row Level Security (RLS) on all database tables
- Session management
- Token refresh
- Logout functionality
- Account deletion
- Multi-device support
- Secure credential storage
- Biometric authentication (mobile)

---

## 🔒 SUPABASE AUTHENTICATION SETUP

### Enable Authentication Providers

**In Supabase Dashboard:**
1. Go to Authentication → Providers
2. Enable:
   - Email (with email confirmation)
   - Google OAuth
   - Apple OAuth (for iOS)
   - Facebook OAuth (optional)

**Configuration:**
```javascript
// Supabase Auth Config
const supabaseAuthConfig = {
  providers: {
    email: {
      enabled: true,
      confirmEmail: true,
      emailRedirectTo: 'https://yourapp.com/auth/callback'
    },
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: 'https://yourapp.com/auth/callback'
    },
    apple: {
      enabled: true,
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET
    }
  },
  jwt: {
    expiryMargin: 10,
    autoRefresh: true
  },
  persistSession: true,
  detectSessionInUrl: true
}
```

---

## 🗄️ DATABASE SCHEMA - USER PROFILES

### Profiles Table (Enhanced)
```sql
-- Extend existing profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Info
  full_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  
  -- Profile Picture
  avatar_url TEXT,
  
  -- Preferences
  currency TEXT DEFAULT 'MYR',
  timezone TEXT DEFAULT 'Asia/Kuala_Lumpur',
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'auto')),
  
  -- Notification Preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  
  -- Privacy Settings
  profile_visibility TEXT DEFAULT 'private' CHECK (profile_visibility IN ('public', 'private')),
  data_sharing BOOLEAN DEFAULT FALSE,
  
  -- Financial Preferences
  default_account_id UUID REFERENCES accounts(id),
  budget_start_day INTEGER DEFAULT 1 CHECK (budget_start_day BETWEEN 1 AND 31),
  
  -- Biometric Settings (Mobile)
  biometric_enabled BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔐 ROW LEVEL SECURITY (RLS) FOR ALL TABLES

### Apply RLS to All Tables
```sql
-- CRITICAL: Enable RLS on ALL tables
-- This ensures users can only access their own data

-- Accounts
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own accounts"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts"
  ON accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
  ON accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts"
  ON accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  USING (auth.uid() = user_id OR is_system = TRUE);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id AND is_system = FALSE);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id AND is_system = FALSE);

-- Budgets
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own budgets"
  ON budgets FOR ALL
  USING (auth.uid() = user_id);

-- Bills
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bills"
  ON bills FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bill_payments"
  ON bill_payments FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM bills WHERE bills.id = bill_payments.bill_id)
  );

-- Loans
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own loans"
  ON loans FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own loan_payments"
  ON loan_payments FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM loans WHERE loans.id = loan_payments.loan_id)
  );

-- Goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals"
  ON goals FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own goal_contributions"
  ON goal_contributions FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM goals WHERE goals.id = goal_contributions.goal_id)
  );

-- Investments
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own investments"
  ON investments FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own investment_transactions"
  ON investment_transactions FOR ALL
  USING (auth.uid() = user_id);

-- Analytics & Reports
ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own snapshots"
  ON financial_snapshots FOR SELECT
  USING (auth.uid() = user_id);

ALTER TABLE analytics_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own insights"
  ON analytics_insights FOR ALL
  USING (auth.uid() = user_id);

-- IMPORTANT: Repeat for ALL other tables
-- Pattern: auth.uid() = user_id
```

---

## 🌐 WEB APPLICATION - AUTHENTICATION

### Page: /auth/login

**Layout:**
- Split screen design (50/50 on desktop)
- Left side: Branding, gradient background, animated illustrations
- Right side: Login form

**Left Side (Branding):**
- App logo (large, centered)
- App name: "FinanceFlow AI"
- Tagline: "Master Your Money with AI"
- Animated features showcase:
  - "Track expenses effortlessly"
  - "AI-powered insights"
  - "Achieve financial goals"
- Background: Gradient mesh animation
- Floating cards showing app features

**Right Side (Login Form):**

**Form Container:**
- Glass effect card
- Centered vertically
- Max width: 400px
- Padding: 40px

**Form Fields:**

1. **Email Input**
   - Label: "Email Address"
   - Type: email
   - Placeholder: "you@example.com"
   - Validation: Valid email format
   - Error message: "Please enter a valid email"

2. **Password Input**
   - Label: "Password"
   - Type: password
   - Placeholder: "Enter your password"
   - Show/Hide toggle
   - Validation: Not empty
   - Error message: "Password is required"

3. **Remember Me Checkbox**
   - "Remember me on this device"
   - Default: Checked

**Actions:**

1. **Login Button**
   - Full width
   - Gradient background
   - Text: "Sign In"
   - Loading state: Spinner + "Signing in..."
   - Disabled when loading

2. **Forgot Password Link**
   - Text link below button
   - "Forgot your password?"
   - Opens password reset modal

3. **Divider**
   - "OR" text with horizontal lines

4. **Social Login Buttons**
   - Google: "Continue with Google" (white button, Google logo)
   - Apple: "Continue with Apple" (black button, Apple logo)
   - Each full width
   - Proper OAuth flow

5. **Sign Up Link**
   - Below social buttons
   - "Don't have an account? Sign up"
   - Links to /auth/signup

**Error Handling:**
- Toast notification for errors
- Inline validation errors
- Common errors:
  - "Invalid credentials"
  - "Email not verified. Check your inbox."
  - "Account not found"
  - "Too many attempts. Try again later."

**Mobile Responsive:**
- Single column layout
- Branding section collapses to top
- Full-screen form
- Bottom sheet for social login

---

### Page: /auth/signup

**Similar Layout to Login**

**Right Side (Signup Form):**

**Form Fields:**

1. **Full Name**
   - Label: "Full Name"
   - Placeholder: "John Doe"
   - Validation: Min 2 characters
   - Required

2. **Email**
   - Label: "Email Address"
   - Placeholder: "you@example.com"
   - Validation: Valid email, not already registered
   - Required

3. **Password**
   - Label: "Password"
   - Placeholder: "Create a strong password"
   - Requirements shown:
     - ✓ At least 8 characters
     - ✓ Contains uppercase letter
     - ✓ Contains lowercase letter
     - ✓ Contains number
     - ✓ Contains special character
   - Strength indicator: Weak, Medium, Strong
   - Required

4. **Confirm Password**
   - Label: "Confirm Password"
   - Placeholder: "Re-enter your password"
   - Validation: Must match password
   - Required

5. **Currency Preference**
   - Label: "Default Currency"
   - Dropdown: MYR (default), USD, SGD, EUR, etc.
   - Optional (defaults to MYR)

6. **Terms & Privacy**
   - Checkbox: "I agree to the Terms of Service and Privacy Policy"
   - Required
   - Links open in new tab

**Actions:**

1. **Sign Up Button**
   - Full width
   - Gradient background
   - Text: "Create Account"
   - Loading state
   - Disabled until all valid

2. **Social Signup**
   - Same as login page
   - "Sign up with Google"
   - "Sign up with Apple"

3. **Login Link**
   - "Already have an account? Sign in"

**After Signup:**
- Show success message
- "Check your email to verify your account"
- Redirect to email verification page
- Auto-send verification email

---

### Page: /auth/verify-email

**Layout:**
- Centered card
- Email icon
- Title: "Verify Your Email"
- Message: "We sent a verification link to [email]"
- Instructions: "Click the link in the email to verify your account"
- "Didn't receive email?" button
- Resend verification email button
- "Change email address" link

**Logic:**
- Auto-verify when user clicks email link
- Redirect to onboarding after verification
- Handle expired links
- Show success/error states

---

### Page: /auth/forgot-password

**Modal or Page:**

**Form:**

1. **Email Input**
   - "Enter your email address"
   - Validation: Valid email

2. **Submit Button**
   - "Send Reset Link"
   - Loading state

**After Submit:**
- Success message: "Check your email for reset instructions"
- Email with reset link sent
- Link expires in 1 hour

---

### Page: /auth/reset-password

**Accessed via email link**

**Form:**

1. **New Password**
   - Same validation as signup
   - Strength indicator

2. **Confirm New Password**
   - Must match

3. **Submit Button**
   - "Reset Password"
   - Loading state

**After Reset:**
- Success message
- Redirect to login
- Old sessions invalidated

---

### Page: /onboarding (First-time Setup)

**Multi-step wizard for new users:**

**Step 1: Welcome**
- Welcome message
- App overview
- "Get Started" button

**Step 2: Profile Setup**
- Upload profile picture (optional)
- Enter phone number (optional)
- Select timezone (auto-detected)
- Select language

**Step 3: Currency & Region**
- Default currency (MYR pre-selected)
- Country (Malaysia pre-selected)
- Can add multiple currencies

**Step 4: Add First Account**
- Skip or add bank account
- Quick account setup
- "Add account" or "Skip for now"

**Step 5: Set Budget Start Day**
- "When does your month start?"
- Dropdown: 1st, 15th, Custom
- Explanation: "This affects budget periods"

**Step 6: Notification Preferences**
- Email notifications
- Push notifications
- SMS notifications (optional)
- Can change later

**Step 7: Complete**
- "You're all set!" message
- "Go to Dashboard" button
- Create default categories automatically

---

### Page: /profile

**Layout:**
- User profile page
- Sidebar with sections
- Main content area

**Sections:**

**1. Profile Information**
- Profile picture (upload/change)
- Full name (editable)
- Email (display only, verified badge)
- Phone number (editable)
- Date of birth (editable)
- "Save Changes" button

**2. Preferences**
- Currency
- Timezone
- Language
- Theme (Dark/Light/Auto)
- Budget start day
- Default account

**3. Security**
- Change password
- Two-factor authentication (if available)
- Active sessions list
- "Sign out all devices" button

**4. Notifications**
- Email notifications toggle
- Push notifications toggle
- SMS notifications toggle
- Notification frequency
- Quiet hours (Do Not Disturb)

**5. Privacy**
- Profile visibility
- Data sharing preferences
- Download my data (GDPR)
- Delete account

**6. Connected Accounts**
- Linked social accounts (Google, Apple)
- Bank connections (if API integration)
- Disconnect option

**7. Account Management**
- Account created date
- Last login
- Account status
- Delete account button (with confirmation)

---

## 📱 MOBILE APPLICATION - AUTHENTICATION

### Screen: LoginScreen

**Layout:**
- Full screen
- App logo at top (animated)
- Form in center
- Social buttons at bottom

**Components:**

**Logo Section:**
- App logo (large, 120px)
- App name
- Tagline
- Gradient background

**Form Section:**

1. **Email Input**
   - Floating label
   - Email keyboard type
   - Auto-capitalize: none

2. **Password Input**
   - Floating label
   - Secure entry
   - Show/hide toggle (eye icon)

3. **Remember Me**
   - Checkbox with label

4. **Login Button**
   - Full width
   - Gradient background
   - Haptic feedback on press
   - Loading indicator

5. **Forgot Password Link**
   - Text button
   - Opens forgot password screen

**Social Login Section:**
- "Or continue with"
- Google button
- Apple button (iOS only)
- Native OAuth flow

**Bottom Section:**
- "Don't have an account?"
- "Sign up" link (blue, bold)

**Features:**
- Keyboard aware scroll
- Auto-focus on email
- Tab between fields
- Submit on keyboard "Done"
- Error toast notifications
- Biometric prompt (if enabled)

---

### Screen: SignupScreen

**Similar to Login**

**Form Fields:**
1. Full Name
2. Email
3. Password (with strength indicator)
4. Confirm Password
5. Currency Selector
6. Terms checkbox

**Actions:**
- Sign Up button
- Social signup
- Login link

---

### Screen: ForgotPasswordScreen

**Simple Form:**
- Email input
- "Send Reset Link" button
- Back to login link

---

### Screen: EmailVerificationScreen

**Display:**
- Email icon
- "Verify Your Email" title
- Instructions
- "Resend Email" button
- "Change Email" button
- "Open Email App" button (opens native email)

---

### Screen: OnboardingScreen

**Swipeable wizard:**
- Horizontal swiper
- Progress indicator (dots or bar)
- "Skip" button (top-right)
- "Next" button (bottom)
- "Get Started" on last screen

**Screens:**
1. Welcome
2. Profile Setup
3. Currency
4. Add Account
5. Notifications
6. Complete

---

### Screen: ProfileScreen

**Scrollable List:**

**Header Section:**
- Large profile picture (120px)
- Tap to change
- Name (editable inline)
- Email (with verified badge)

**Settings List:**
- Grouped sections
- Each item navigates to detail screen

**Groups:**

1. **Account**
   - Edit Profile
   - Change Password
   - Security

2. **Preferences**
   - Currency
   - Language
   - Theme
   - Notifications

3. **Data & Privacy**
   - Privacy Settings
   - Download Data
   - Delete Account

4. **About**
   - Version
   - Terms & Conditions
   - Privacy Policy
   - Support

5. **Actions**
   - Sign Out (confirmation alert)

---

### Screen: EditProfileScreen

**Form:**
- Profile picture selector
- Full name input
- Phone input
- Date of birth picker
- Save button (sticky bottom)

---

### Screen: ChangePasswordScreen

**Form:**
- Current password
- New password (with strength)
- Confirm new password
- Save button

---

### Screen: SecurityScreen

**Options:**
- Biometric Authentication toggle
  - Face ID (iOS)
  - Fingerprint (Android)
- Active Sessions list
- Sign out all devices button

---

## 🔑 BIOMETRIC AUTHENTICATION (MOBILE)

### iOS (Face ID / Touch ID)
```typescript
import * as LocalAuthentication from 'expo-local-authentication'

async function authenticateWithBiometrics() {
  // Check if biometrics available
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  if (!hasHardware) {
    return { success: false, error: 'No biometric hardware' }
  }
  
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  if (!isEnrolled) {
    return { success: false, error: 'No biometrics enrolled' }
  }
  
  // Authenticate
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access FinanceFlow',
    fallbackLabel: 'Use Passcode',
    disableDeviceFallback: false
  })
  
  return result
}
```

### Android (Fingerprint)
```typescript
// Same API as iOS with expo-local-authentication
// Automatically handles fingerprint on Android
```

**Implementation:**
- Enable in profile settings
- Store encrypted credentials in SecureStore
- Prompt on app launch
- Fallback to password if biometric fails
- Auto-lock after X minutes in background

---

## 🔐 AUTHENTICATION HOOKS & SERVICES

### Shared Auth Hook

**Location:** `/packages/shared/src/hooks/useAuth.ts`
```typescript
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])
  
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }
  
  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: 'https://yourapp.com/auth/callback'
      }
    })
    
    if (error) throw error
    return data
  }
  
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://yourapp.com/auth/callback'
      }
    })
    
    if (error) throw error
    return data
  }
  
  const signInWithApple = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'https://yourapp.com/auth/callback'
      }
    })
    
    if (error) throw error
    return data
  }
  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://yourapp.com/auth/reset-password'
    })
    
    if (error) throw error
    return data
  }
  
  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
    return data
  }
  
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile
  }
}
```

---

## 🛡️ PROTECTED ROUTES

### Web Protected Route Component

**Location:** `/apps/web/src/components/auth/ProtectedRoute.tsx`
```typescript
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }
  
  return <>{children}</>
}
```

**Usage:**
```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

### Mobile Protected Navigation

**Location:** `/apps/mobile/src/navigation/RootNavigator.tsx`
```typescript
import { useAuth } from '@/hooks/useAuth'
import AuthNavigator from './AuthNavigator'
import AppNavigator from './AppNavigator'
import { ActivityIndicator, View } from 'react-native'

export default function RootNavigator() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-base">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    )
  }
  
  return user ? <AppNavigator /> : <AuthNavigator />
}
```

---

## 📦 DELIVERABLES

### Web:
1. ✅ Login page with email/password
2. ✅ Signup page with validation
3. ✅ Email verification flow
4. ✅ Password reset flow
5. ✅ Social login (Google, Apple)
6. ✅ Onboarding wizard
7. ✅ Profile management page
8. ✅ Settings page
9. ✅ Protected route wrapper
10. ✅ Session management
11. ✅ Auto token refresh

### Mobile:
12. ✅ Login screen
13. ✅ Signup screen
14. ✅ Email verification screen
15. ✅ Password reset screen
16. ✅ Onboarding screens
17. ✅ Profile screen
18. ✅ Edit profile screen
19. ✅ Security settings
20. ✅ Biometric authentication
21. ✅ Protected navigation
22. ✅ Secure credential storage

### Backend & Security:
23. ✅ RLS enabled on ALL tables
24. ✅ RLS policies for ALL tables
25. ✅ Profile creation trigger
26. ✅ Email verification system
27. ✅ Password reset system
28. ✅ OAuth providers configured
29. ✅ Session management
30. ✅ Token refresh logic
31. ✅ Secure password hashing
32. ✅ GDPR compliance (data export/delete)

---

Create all components following global design rules with complete authentication flow, secure RLS implementation, and seamless user experience across web and mobile platforms.