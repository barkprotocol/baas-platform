# BARK BaaS Platform

**Solana-based blockchain as a service platform built by BARK Protocol**

![BARK BaaS Platform Landing Page](.github/images/landing-page.png)

## Overview

The BARK BaaS Platform is a scalable, Solana-powered solution for building decentralized applications, with features like wallet integration, blinks, token management, staking mechanisms, and NFT minting. It comes with a robust API and a user-friendly interface to streamline blockchain interactions.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Blockchain**: [Solana](https://solana.com/)
- **Smart Contract Framework**: [Anchor](https://www.anchor-lang.com/)
- **Wallet Integration**: [@solana/wallet-adapter](https://github.com/solana-labs/wallet-adapter)
- **Solana Web3 Library**: [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **API Layer**: [tRPC](https://trpc.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Testing**: [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting**: [ESLint](https://eslint.org/)
- **Code Formatting**: [Prettier](https://prettier.io/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bark-baas-platform.git
```

### 2. Navigate to the project directory:

```bash
cd bark-baas-platform
```

### 3. Install dependencies:

```bash
pnpm install
```

### 4. Set up environment variables:

- Copy the `.env.example` file to `.env`.
- Fill in the required values in the `.env` file.

## Running Locally

Use the included setup script to create your `.env` file and set up the database:

```bash
pnpm db:setup
```

Then, run the database migrations and seed the database with a default user and team:

```bash
pnpm db:migrate
pnpm db:seed
```

This will create the following credentials:

- **User**: `test@test.com`
- **Password**: `admin123`

You can create new users via the `/sign-up` route.

### 5. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app in action.

## Testing Payments

To test Stripe payments, use the following card details:

- **Card Number**: `4242 4242 4242 4242`
- **Expiration**: Any future date.
- **CVC**: Any 3-digit number.

You can listen for Stripe webhooks locally via their CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Going to Production

### 1. Set up a production Stripe webhook

1. Go to the Stripe Dashboard and create a new webhook.
2. Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/stripe/webhook`).
3. Select events like `checkout.session.completed` and `customer.subscription.updated`.

### 2. Deploy to Vercel

1. Push your code to GitHub.
2. Connect your repository to Vercel and deploy it.
3. Add environment variables in Vercel's project settings:
    - `BASE_URL`: Your production domain.
    - `STRIPE_SECRET_KEY`: Your production Stripe secret key.
    - `STRIPE_WEBHOOK_SECRET`: The webhook secret for Stripe.
    - `POSTGRES_URL`: Production PostgreSQL database URL.
    - `AUTH_SECRET`: Generate using `openssl rand -base64 32`.

### Docker

To build and run Docker image:

1. Build the image:

```
docker build -t bark-baas-platform .
```

2. Run the container:

```
docker run -p 3000:3000 bark-baas-platform
```

## Usage

For detailed usage instructions and API documentation, visit the [official documentation](https://docs.barkprotocol.com).

## To-Do

- Implement Blinkboard

git clone https://github.com/barkprotocol/blinkboard

## Contributing

We welcome contributions to the BARK BaaS Platform! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For support, reach out to us at [support@barkprotocol.com](mailto:support@barkprotocol.com) or join our [X community](https://x.com/bark_protocol).
