I need to add a secure password vault module to my existing React + Tailwind PWA + Supabase personal finance app. This module should allow users to safely store and manage their financial account credentials with provider logos.
1. DATABASE SCHEMA (Supabase)
Create a 'vault_items' table with the following fields:

id (uuid, primary key)
user_id (uuid, foreign key to auth.users)
provider_name (text) - bank/service provider name
provider_domain (text) - for logo fetching (e.g., maybank.com)
website_url (text) - provider's website URL
encrypted_username (text) - encrypted username
encrypted_password (text) - encrypted password
due_date (date, nullable) - payment due date if applicable
category (text) - e.g., 'bank', 'credit_card', 'utility', 'loan', 'investment', 'e-wallet'
notes (text, nullable) - encrypted additional notes
logo_url (text, nullable) - cached logo URL
created_at (timestamp)
updated_at (timestamp)

Enable Row Level Security (RLS) policies so users can only access their own vault items.
Optional: Create a 'providers' reference table with common Malaysian providers:

id, provider_name, domain, category, logo_url, default_due_day

2. SECURITY IMPLEMENTATION (CRITICAL - TOP PRIORITY)
Encryption Requirements:

Implement client-side encryption using the Web Crypto API
Use AES-GCM encryption algorithm for all sensitive fields (username, password, notes)
Generate a user-specific encryption key derived from their master password using PBKDF2 with at least 100,000 iterations
Use a unique salt per user (store salt in Supabase user metadata)
Store only encrypted data in Supabase - NEVER store plaintext passwords
The master password should NEVER be sent to the backend or stored anywhere (memory only)

Master Password Flow:

One-time master password setup for new vault users
Master password requirements: minimum 12 characters, mix of uppercase, lowercase, numbers, symbols
Password strength indicator during setup
Clear warning that master password CANNOT be recovered if lost
Require master password confirmation during setup

Vault Session Management:

Require master password entry to unlock the vault
Session-based unlock (keeps encryption key in memory)
Auto-lock after 5 minutes of inactivity
Manual lock button available
Session timeout on browser/tab close

Additional Security:

Clipboard auto-clear after 60 seconds when password is copied
No autocomplete on password fields
Optional: Biometric authentication (fingerprint/face ID) for unlock if browser supports it
Warning message about backing up master password safely

3. PROVIDER LOGOS
Supported Malaysian Providers:
Banks: Maybank, CIMB, Public Bank, RHB, Hong Leong Bank, AmBank, Bank Islam, OCBC, Standard Chartered, HSBC, UOB, Affin Bank, Alliance Bank, BSN, Muamalat
Utilities: TNB (Tenaga Nasional), Syabas/Air Selangor, Indah Water, PBA (Penang Water), SAJ (Johor Water)
Telco/Internet: Time, Maxis, Celcom, Digi, Unifi, TM, Yes, Astro
E-wallets: Touch 'n Go eWallet, GrabPay, Boost, ShopeePay, MAE by Maybank, BigPay
Credit Cards: Visa, Mastercard, American Express
Others: EPF, LHDN, PTPTN, Insurance providers, Takaful
Logo Implementation:

Use Clearbit Logo API: https://logo.clearbit.com/{domain} (Example: https://logo.clearbit.com/maybank.com)
Auto-fetch logo based on provider_domain field
Cache logos locally using service worker for offline PWA support
Fallback to category-based icons (lucide-react) if logo not found:

Building2 for banks
Zap for utilities
Smartphone for telco
Wallet for e-wallets
CreditCard for credit cards
FileText for others



Logo Display:

40x40px rounded logo in list view cards
64x64px rounded logo in detail/edit view
Subtle border or shadow around logos
Alt text with provider name for accessibility
Handle loading states and errors gracefully

Logo Selection in Forms:

Auto-detect domain from website URL and fetch logo preview
Searchable dropdown with popular Malaysian providers (pre-populated with logos)
Manual URL entry option
Show logo preview as user types or selects

4. UI/UX FEATURES
Vault Unlock Screen:

Master password input with show/hide toggle
"Unlock Vault" button
Forgot master password warning (cannot be recovered)
Optional: Biometric unlock button if supported

Vault List View:

Grid/card layout of all stored credentials
Each card shows: provider logo, provider name, category badge, username (partially masked), due date
Search bar to filter by provider name
Filter chips by category (All, Banks, Utilities, Credit Cards, E-wallets, Others)
Sort options: Name, Due Date, Recently Added
Empty state with illustration when no items exist
Floating "Add New" button (+ icon)

Vault Item Card:

Provider logo (top-left)
Provider name (bold)
Category badge (colored pill)
Username (with copy icon)
Password (masked ••••••• with show/copy icons)
Website URL (clickable link with external icon)
Due date with color coding:

Green: >7 days away
Yellow/Orange: 3-7 days
Red: <3 days or overdue


Quick actions: Edit, Delete icons
Expand/collapse for notes section

Add/Edit Credential Form:

Provider name (text input with autocomplete from popular providers)
Website URL (with auto-domain extraction)
Logo preview (auto-fetched or manual select)
Username (text input)
Password (with show/hide toggle)
Password generator button with options:

Length slider (8-32 characters)
Include: uppercase, lowercase, numbers, symbols
Exclude ambiguous characters option
Generate & copy button


Category dropdown (Bank, Credit Card, Utility, Loan, Investment, E-wallet, Other)
Due date picker (optional, for bills/subscriptions)
Notes field (textarea, encrypted)
Save & Cancel buttons

Due Date Reminders:

Dashboard widget showing upcoming due dates
Notification badges on vault icon
List of items due in next 7 days
Visual indicators: 7 days (info), 3 days (warning), 1 day (urgent)

Additional Features:

Confirmation dialog before deleting items
Toast notifications for: copy success, save success, errors
Loading states for all async operations
Offline support (PWA) - queue changes when offline
Export vault (encrypted JSON) for backup
Import vault from encrypted backup

5. CODE STRUCTURE
Components:

VaultUnlock.jsx - Master password entry screen
VaultList.jsx - Main vault list view with search/filter
VaultItemCard.jsx - Individual credential card
AddVaultItem.jsx - Form to add new credential
EditVaultItem.jsx - Form to edit existing credential
PasswordGenerator.jsx - Password generation modal/dialog
DueDateReminders.jsx - Upcoming due dates widget
ProviderSelector.jsx - Searchable provider dropdown with logos

Custom Hooks:

useVaultEncryption.js - Encryption/decryption logic, key derivation
useVaultSession.js - Session management, auto-lock, timeout
useClipboard.js - Copy to clipboard with auto-clear

Context:

VaultContext.jsx - Global vault state, master password session, locked/unlocked state

Utilities:

encryption.js - Web Crypto API functions (encrypt, decrypt, deriveKey)
passwordGenerator.js - Password generation logic
providerLogos.js - Logo fetching and caching
validators.js - Password strength, form validation

Constants:

providers.js - List of popular Malaysian providers with domains and categories

6. STYLING & DESIGN

Use Tailwind CSS consistent with existing app design
Use lucide-react icons: Lock, Unlock, Eye, EyeOff, Copy, ExternalLink, Edit, Trash2, Plus, Search, Calendar, AlertCircle, Building2, Zap, CreditCard, Wallet, Smartphone
Responsive design: mobile-first, tablet, desktop breakpoints
Color palette:

Primary: Brand color from existing app
Success: Green for safe states
Warning: Yellow/Orange for upcoming due dates
Danger: Red for urgent/overdue
Neutral: Gray for secondary info


Card shadows and hover effects for interactivity
Smooth transitions and animations
Accessible: ARIA labels, keyboard navigation, focus states

7. TECHNICAL REQUIREMENTS

React 18+ with functional components and hooks
TypeScript preferred (or well-documented JavaScript)
Tailwind CSS for all styling (use only core utility classes, no custom config needed)
Supabase client for database operations
Follow existing app architecture and folder structure
PWA-ready: offline support, service worker integration
Performance: lazy loading, memoization where appropriate
Error boundaries for graceful error handling
Comprehensive JSDoc comments, especially for encryption functions

8. SECURITY CHECKLIST TO VERIFY

 All passwords encrypted client-side before saving
 Master password never sent to server
 Master password never stored (memory only during session)
 Encryption key derived using PBKDF2 with high iteration count
 Unique salt per user
 RLS policies prevent cross-user data access
 Session auto-locks after inactivity
 Clipboard clears after 60 seconds
 No autocomplete on sensitive fields
 HTTPS enforced (Supabase handles this)
 Input validation and sanitization

9. SETUP INSTRUCTIONS TO INCLUDE

Supabase table creation SQL
RLS policy setup
Environment variables needed
NPM packages to install
Migration guide if updating existing app
User guide for master password setup

10. EDGE CASES TO HANDLE

Lost master password (show recovery impossible warning)
Corrupted encrypted data (show error, allow deletion)
Failed logo fetching (show fallback icon)
Network errors during save (offline queue)
Browser/tab closed during unlock session (require re-unlock)
Concurrent edits (last-write-wins with timestamp check)
Empty vault state (friendly onboarding)
Very long provider names/URLs (truncate with ellipsis)


IMPORTANT NOTES:

Security is the ABSOLUTE TOP priority
All sensitive data MUST be encrypted before sending to Supabase
The master password should only exist in memory during the active session
Include CLEAR WARNINGS to users about master password importance and inability to recover
Follow React best practices and use TypeScript if possible
Provide complete, production-ready code with error handling
Include inline comments explaining encryption implementation
Make the UI intuitive and user-friendly for non-technical users