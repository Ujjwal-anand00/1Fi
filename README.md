# 1Fi — Mobile EMI Marketplace & Repayment App

A mobile-first React Native application built with Expo for the **1Fi SDE Intern Assignment**. It provides an end-to-end shopping experience featuring flexible EMI options, dynamic variant pricing, order checkout, and a complete EMI dues & repayment dashboard.

---

## 📱 Features

- **Marketplace & Discovery**
  - Responsive top tab navigation (*Top Brands*, *Nearby Stores*, *Marketplace*).
  - Clean horizontal product cards displaying image, pricing, category tag, No-cost EMI badge, and navigation chevron.
  - Real-time product search and category filtering with loading, error, and empty states.

- **Product Details & Dynamic EMI Calculation**
  - Multi-attribute variant selectors (Storage, RAM, Color).
  - Dynamic price synchronization: selecting a variant instantly updates base price, interest breakdown, and EMI tenure options.
  - Flexible EMI plans (3, 6, 9, 12 months) with transparent breakdowns:
    $$\text{Total Payable} = \text{Product Price} + \text{Interest} + \text{Processing Fee}$$

- **Checkout & Order Flow**
  - Comprehensive order summary displaying selected variant, pricing, tenure, and monthly installments.
  - Multiple payment methods (UPI, Net Banking, Debit/Credit Card, Auto-Debit).
  - Order confirmation and detailed order invoice view.
  - Full state preservation when navigating back and forth between screens.

- **EMI Dues & Repayment Experience**
  - **Overview Dashboard:** Total outstanding balance, next due date, upcoming payment amount, and active plan count.
  - **Active EMI Plans:** Progress indicators, remaining balance, installments paid/total, and plan details.
  - **Repayment Flow:** Dedicated payment screen for upcoming installments with instant schedule updates and balance reconciliation.

---

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) (0.86.3) with [Expo](https://expo.dev/) (~57.0.20)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (~6.0.3)
- **Navigation:** [@react-navigation/bottom-tabs](https://reactnavigation.org/)
- **Icons:** [@expo/vector-icons](https://icons.expo.fyi/) (Ionicons)
- **Styling:** Vanilla React Native `StyleSheet` with centralized design tokens (colors, typography, spacing, radius)

---

## 📂 Project Structure

```text
1Fi/
├── assets/                 # App icons, splash screens, and product images
├── src/
│   ├── components/         # Reusable UI components (ProductCard, ShopTabs, PriceSummary, etc.)
│   ├── data/               # Centralized mock catalog and store datasets
│   ├── hooks/              # Custom React hooks (e.g., useProducts)
│   ├── screens/            # Main application screens:
│   │   ├── ShopScreen.tsx              # Main shop entry with tabs
│   │   ├── MarketplaceScreen.tsx       # Product listing & search
│   │   ├── ProductDetailsScreen.tsx    # Details, variant selection & EMI plans
│   │   ├── CheckoutScreen.tsx          # Order review & payment method
│   │   ├── OrderConfirmationScreen.tsx # Success confirmation screen
│   │   ├── OrderDetailsScreen.tsx      # Placed order details
│   │   ├── EmiDuesScreen.tsx           # Dues summary & active plans
│   │   ├── EmiDetailsScreen.tsx        # Specific EMI plan schedule
│   │   └── EmiPaymentScreen.tsx        # Installment repayment action
│   ├── services/           # Data services (marketplaceService, orderService, emiDuesService)
│   ├── theme/              # Design tokens (colors, typography, spacing, radius)
│   ├── types/              # TypeScript interfaces and domain types
│   └── utils/              # EMI math calculations, currency formatters, date helpers
├── App.tsx                 # Root component with Bottom Tab Navigator
├── app.json                # Expo configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [Expo Go](https://expo.dev/go) app on your Android or iOS device (or an Android/iOS emulator)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/1Fi.git
   cd 1Fi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on a device or emulator:**
   - Press <kbd>a</kbd> for **Android Emulator**.
   - Press <kbd>i</kbd> for **iOS Simulator**.
   - Press <kbd>w</kbd> for **Web**.
   - Scan the terminal QR code with the **Expo Go** app on your phone.

---

## 🧪 Verification & Quality Checks

Run the TypeScript type check:
```bash
npx tsc --noEmit
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
