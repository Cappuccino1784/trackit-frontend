# 💸 Expense Tracker - Frontend

Modern, responsive web application for tracking expenses built with React 19, TypeScript, Material-UI, and Recharts.

## 🛠️ Tech Stack

- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe JavaScript
- **Material-UI v7** - Modern Material Design components
- **Recharts** - Beautiful data visualization
- **React Router v7** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Lightning-fast build tool
- **Emotion** - CSS-in-JS styling

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Running backend API (see server/README.md)

## 🚀 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
```

## 🎯 Running the Application

### Development Mode
```bash
npm run dev
```
Application will run on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📁 Project Structure

```
web/
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable components
│   │   ├── accounts/
│   │   │   ├── AccountsForm.tsx      # Create/Edit account form
│   │   │   └── AccountsList.tsx      # Display accounts
│   │   ├── common/
│   │   │   ├── CurrencySelector.tsx  # Currency dropdown
│   │   │   └── TimeFilter.tsx        # Date filter component
│   │   ├── expense/
│   │   │   └── ExpenseList.tsx       # Expense transactions
│   │   ├── income/
│   │   │   └── IncomeList.tsx        # Income transactions
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx         # Main layout wrapper
│   │   │   ├── Navbar.tsx            # Top navigation bar
│   │   │   ├── PageContainer.tsx     # Page wrapper
│   │   │   ├── ProtectedRoute.tsx    # Auth guard
│   │   │   └── Sidebar.tsx           # Side navigation
│   │   └── transactions/
│   │       ├── TransactionForm.tsx   # Add/Edit transaction
│   │       └── TransactionList.tsx   # Display transactions
│   ├── context/
│   │   └── AuthContext.tsx           # Authentication context
│   ├── pages/                        # Page components
│   │   ├── Accounts.tsx              # Accounts management
│   │   ├── Analytics.tsx             # Charts & reports
│   │   ├── Dashboard.tsx             # Overview page
│   │   ├── Expense.tsx               # Expenses page
│   │   ├── Income.tsx                # Income page
│   │   ├── Login.tsx                 # Login page
│   │   ├── Signup.tsx                # Registration page
│   │   └── Transactions.tsx          # All transactions
│   ├── services/                     # API service layer
│   │   ├── account.service.ts        # Account API calls
│   │   ├── api.ts                    # Axios instance
│   │   ├── auth.service.ts           # Authentication API
│   │   ├── currency.service.ts       # Currency API
│   │   ├── transaction.service.ts    # Transaction API
│   │   └── user.service.ts           # User API
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Global styles
├── .env                              # Environment variables (create this)
├── eslint.config.js                  # ESLint configuration
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tsconfig.app.json                 # App TypeScript config
├── tsconfig.node.json                # Node TypeScript config
└── vite.config.ts                    # Vite configuration
```

## 🎨 Features

### 📊 Dashboard
- **Overview Cards**: Total income, expenses, and net savings
- **Quick Stats**: Current balance across all accounts
- **Recent Transactions**: Latest financial activities
- **Time Filtering**: View data by day, month, year, or all time
- **Currency Conversion**: Unified view in preferred currency

### 📈 Analytics
- **Income vs Expenses**: Pie chart comparison
- **Expense by Category**: Visual breakdown of spending
- **Income by Category**: Revenue source analysis
- **Top Categories**: Ranked spending categories with progress bars
- **Interactive Charts**: Hover for detailed information
- **Time-Based Analysis**: Filter by custom time periods

### 💰 Accounts Management
- **Multi-Account Support**: Create unlimited accounts
- **Multi-Currency**: Support for 50+ currencies
- **Balance Tracking**: Real-time account balances
- **Account Operations**: Create, edit, and delete accounts
- **Currency Conversion**: View all accounts in single currency

### 💸 Transaction Management
- **Three Types**: Income, Expense, Transfer
- **Categories**: Organize by custom categories
- **Search & Filter**: Find transactions quickly
- **Date Selection**: Schedule transactions
- **Descriptions**: Add notes to transactions
- **Bulk Operations**: Manage multiple transactions

### 🔐 Authentication
- **User Registration**: Create new accounts
- **Secure Login**: JWT-based authentication
- **Protected Routes**: Secure pages for authenticated users
- **Auto Logout**: Session management
- **Profile Management**: Update user information

### 🎨 UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material Design**: Modern, intuitive interface
- **Dark Mode Ready**: Prepared for theme switching
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time input validation

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000 |

## 🎯 Pages & Routes

| Route | Component | Description | Protected |
|-------|-----------|-------------|-----------|
| `/` | Dashboard | Main overview page | ✅ |
| `/login` | Login | User login | ❌ |
| `/signup` | Signup | User registration | ❌ |
| `/accounts` | Accounts | Account management | ✅ |
| `/transactions` | Transactions | All transactions | ✅ |
| `/income` | Income | Income transactions | ✅ |
| `/expense` | Expense | Expense transactions | ✅ |
| `/analytics` | Analytics | Charts & reports | ✅ |

## 🚀 Deployment

### Build for Production
```bash
npm run build
```
Output: `dist/` directory

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables in Production
Set `VITE_API_URL` to your production API URL:
```env
VITE_API_URL=https://api.yourapp.com
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Follow React best practices
2. Use TypeScript for type safety
3. Follow component structure conventions
4. Write meaningful commit messages
5. Test responsive design

## 📄 License

MIT License

---

Built with ❤️ using React and Material-UI
