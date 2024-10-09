# Changelog

All notable changes to the BARK BaaS Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2024-10-9

1. Added BARK token balances and USDC balances to the token holders data.
2. Updated the users data to include Solana addresses.
3. Modified the accounts data to include SOL, BARK, and USDC balances.
4. Added a new `tokenMetrics` section with BARK-specific information such as total supply, circulating supply, price, market cap, and 24-hour volume.
5. Updated the CSV output to reflect these new data points, providing a more comprehensive view of the BARK protocol ecosystem.


The CSV file now includes the following sections:

1. BARK Token Metrics
2. Token Holders (with SOL, BARK, and USDC balances)
3. Users (with Solana addresses)
4. Accounts (with SOL, BARK, and USDC balances)

## [0.1.3] - 2024-10-6

### Added
- Implemented Solana actions and donation system for SOL, USDC, and BARK tokens
- Created API routes for handling donation transactions
- Added support for Solana Actions API
- Added Metaplax packages
- Integrated shadcn/ui components for improved UI consistency
- Implemented dark mode support across the platform
- Created legal pages including Terms of Service, Privacy Policy, and Cookie Policy
- Comprehensive Solana utility functions in `lib/solana/solana.ts`
- Flexible Solana network connection management in `lib/solana/connections.ts`
- SPL token utilities and management in `lib/solana/tokens.ts`
- Developed a comprehensive Tokenomics page
- Added a Footer component with links to legal pages and social media
- Implemented error boundaries and loading states in the main layout
- Enhanced security headers in Next.js configuration

### Checkout: Solana Pay

- Added error handling for the case when `process.env.MERCHANT_WALLET` is undefined.
- Used `Math.round()` when calculating token amounts to ensure we're dealing with whole numbers.
- Added `lastValidBlockHeight` to the transaction for better validity management.
- Included the calculated `amount` and `token` in the response JSON for easier tracking and verification.
- Used `BigInt` for all token amount calculations to prevent precision loss.
- Improved type safety by explicitly declaring `tokenAmount` as `bigint`.
- Kept the `OPTIONS` method for CORS support.
- Ensured all necessary imports are included.
- Maintained the structure of the original code while improving its robustness and error handling.

### Changed
- Updated Next.js configuration to use ECMAScript modules (ESM) syntax
- Improved error handling and logging in API routes
- Refactored API routes to use Next.js 13+ App Router conventions
- Updated metadata configuration to comply with latest Next.js standards
- Improved responsiveness of UI components

### Fixed
- Resolved CORS issues for Solana Actions API
- Fixed file structure inconsistencies in legal pages
- Corrected theme color configuration in metadata
- Addressed warnings related to deprecated Next.js configuration options

## [0.1.2] - 2024-09-20

### Added
- Initial project setup with Next.js framework
- Integration with Solana blockchain
- Solana programs (smart contract) development support using Anchor
- User authentication system
- Dashboard for managing Solana blockchain operations
- API endpoints for interacting with the platform
- Wallet integration using @solana/wallet-adapter
- Payment processing with Stripe and Solana Pay
- Database setup with PostgreSQL and Drizzle ORM
- UI components using Shadcn/ui and Tailwind CSS
- Deployment configuration for Vercel
- Multi-factor authentication (MFA) for enhanced security
- Real-time blockchain transaction monitoring
- Automated smart contract auditing tools
- Integration with decentralized storage solutions (IPFS)
- Support for custom token creation and management
- Advanced analytics dashboard with data visualization
- Webhook system for real-time event notifications
- Rate limiting and DDoS protection for API endpoints
- Solana program (smart contract) versioning and upgrade system
- Integration with popular blockchain explorers for transaction verification
- Added icons BARK, SOL, USDC
- Support for multiple wallet providers
- Automated daily backups of user data and transaction history
- Integration with decentralized identity (DID) solutions
- Implementation of a referral system with token rewards
- Customized wallet connect button

### Changed
- Updated README with comprehensive project information
- Improved error handling in API routes
- Changed Typescript to next.config.mjs
- Enhanced wallet connection process for better user experience
- Optimized database queries for improved performance
- Upgraded Solana SDK to latest version for improved compatibility
- Refactored Solana interaction logic for better modularity
- Improved transaction signing process for enhanced security
- Updated UI design for better accessibility and responsiveness
- Enhanced error messages for better user understanding
- Optimized smart contract gas usage for cost-efficiency

### Fixed
- Resolved issues with wallet connection persistence
- Resolved and fix issues with next.config.mjs
- Fixed styling inconsistencies in the dashboard
- Addressed potential security vulnerabilities in API authentication
- Corrected calculation errors in transaction fee estimation
- Fixed cross-browser compatibility issues in the user interface
- Resolved race conditions in concurrent transaction processing
- Fixed memory leaks in real-time data subscriptions
- Corrected timezone-related issues in transaction timestamps
- Addressed edge cases in token balance calculations
- Fixed inconsistencies in error handling across different modules

## [0.1.0] - 2024-09-10

### Added
- Initial alpha release of BARK BaaS Platform
- Basic Solana integration features
- User registration and login functionality
- Simple dashboard for viewing blockchain data
- Preliminary documentation for API usage

[Unreleased]: https://github.com/barkprotocol/baas-platform/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/barkprotocol/baas-platform/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/barkprotocol/baas-platform/compare/v0.1.0...v0.1.2
[0.1.0]: https://github.com/barkprotocol/baas-platform/releases/tag/v0.1.0