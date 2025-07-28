# Hedera Wallet - Frontend Application

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![Hedera](https://img.shields.io/badge/Hedera-Testnet-00D4AA.svg)](https://hedera.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive web-based wallet application for interacting with the Hedera Hashgraph network. Built with React, TypeScript, and modern web technologies, this wallet provides a complete suite of Hedera services including account management, HBAR transfers, token operations, and consensus topics.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [Security Considerations](#-security-considerations)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)


## 🌟 Features

### Core Functionality

- **🏦 Account Management**: Connect and view Hedera account information, balances, and associated tokens
- **💸 HBAR Transfers**: Send HBAR to other Hedera accounts with real-time transaction feedback
- **🪙 Token Operations**: Create fungible tokens, associate accounts with tokens, and transfer tokens
- **📢 Consensus Topics**: Create topics, send messages, and subscribe to real-time message updates

### Technical Features

- **🔒 Secure Storage**: Credentials stored locally in browser localStorage
- **⚡ Real-time Updates**: Live subscription to topic messages and account changes
- **📱 Responsive Design**: Modern, mobile-friendly interface with blue theme
- **🛡️ Error Handling**: Comprehensive error handling with user-friendly notifications
- **🔧 Type Safety**: Full TypeScript implementation for better developer experience

## 🛠 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18+ | Frontend framework |
| **TypeScript** | 5.0+ | Type safety |
| **Vite** | 5.0+ | Build tool |
| **pnpm** | Latest | Package manager |
| **Tailwind CSS** | Latest | Styling |
| **shadcn/ui** | Latest | UI components |
| **@hashgraph/sdk** | Latest | Hedera integration |
| **Jest** | Latest | Testing framework |

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 18 or higher)
- **pnpm** (recommended package manager)
- **Hedera Testnet Account**: Get credentials from [Hedera Portal](https://portal.hedera.com/register)

## 🚀 Getting Started

### Installation

   ```

. **Install dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install
   

   ```

### Development

1. **Start the development server**
   ```bash
   # Using pnpm
   pnpm dev
   
  
   ```

2. **Open your browser**
   
   Navigate to [http://localhost:4173/](http://localhost:4173/) to view the application

### Building for Production

1. **Build the application**
   ```bash
   # Using pnpm
   pnpm build
   

   ```

2. **Preview the production build**
   ```bash
   # Using pnpm
   pnpm preview
   

   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

```

### Test Structure

The project includes comprehensive tests for:

- **Component Testing**: React components with user interactions
- **Service Testing**: Hedera service integration and business logic
- **Validation Testing**: Input validation and error handling

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   ├── HederaWallet.tsx    # Main wallet component
│   ├── WalletConnect.tsx   # Credential input and connection
│   ├── WalletDashboard.tsx # Account overview and navigation
│   ├── SendHbar.tsx        # HBAR transfer functionality
│   ├── CreateToken.tsx     # Token creation interface
│   ├── TokenOperations.tsx # Token association and transfers
│   └── TopicManagement.tsx # Consensus topics management
├── services/               # Business logic and API integration
│   └── hederaService.ts    # Hedera SDK integration
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── pages/                  # Page components
```

## 🔧 Configuration

### Environment Setup

The application connects to **Hedera Testnet** by default. No additional environment variables are required.

### Credential Management

- Credentials are stored securely in browser localStorage
- Never share your private keys or store them in public repositories
- Use testnet credentials only for development

## 🎯 Usage Guide

<details>
<summary><strong>1. Connect Your Wallet</strong></summary>

1. Enter your Hedera testnet Account ID (format: `0.0.123456`)
2. Enter your private key (64 characters)
3. Click "Connect Wallet"

</details>

<details>
<summary><strong>2. View Account Information</strong></summary>

- See your HBAR balance
- View associated tokens
- Check account details

</details>

<details>
<summary><strong>3. Send HBAR</strong></summary>

1. Navigate to "Send HBAR"
2. Enter recipient Account ID
3. Specify amount to send
4. Confirm transaction

</details>

<details>
<summary><strong>4. Create Tokens</strong></summary>

1. Go to "Create Token"
2. Enter token name and symbol
3. Set initial supply
4. Execute creation

</details>

<details>
<summary><strong>5. Token Operations</strong></summary>

- **Associate Token**: Link your account with existing tokens
- **Transfer Tokens**: Send tokens to other accounts

</details>

<details>
<summary><strong>6. Consensus Topics</strong></summary>

- **Create Topic**: Set up new message topics
- **Send Messages**: Publish messages to topics
- **View Messages**: Subscribe to real-time message updates

</details>

## 🔐 Security Considerations

> **⚠️ Important Security Notes**

- **Local Storage**: Credentials are stored locally and never transmitted to external servers
- **Testnet Only**: This application is configured for Hedera Testnet
- **Private Keys**: Never share your private keys or commit them to version control
- **HTTPS**: Always use HTTPS in production environments

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><strong>Connection Failed</strong></summary>

- Verify Account ID format (`0.0.123456`)
- Check private key length (64 characters)
- Ensure testnet credentials are valid

</details>

<details>
<summary><strong>Transaction Errors</strong></summary>

- Check account balance for sufficient funds
- Verify recipient Account ID exists
- Ensure token is associated before transfer

</details>

<details>
<summary><strong>Build Issues</strong></summary>

- Clear `node_modules` and reinstall dependencies
- Check Node.js version compatibility
- Verify all dependencies are installed

</details>

### Getting Help

- Check browser console for detailed error messages
- Review network tab for failed requests
- Ensure stable internet connection
- Verify Hedera Testnet status

## 📚 Additional Resources

- [Hedera Documentation](https://docs.hedera.com/)
- [Hedera SDK Documentation](https://github.com/hashgraph/hedera-sdk-js)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`pnpm test`)
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request


## 🏷 Version

**Current Version**: 1.0.0

---
