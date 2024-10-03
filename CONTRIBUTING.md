# Contributing to BARK BaaS Platform

Thank you for considering contributing to the BARK BaaS Platform! We value your input and are excited to work with you to make the platform even better. Please take a moment to review the guidelines for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by the [BARK Code of Conduct](./CODE_OF_CONDUCT.md). Please be respectful to others and follow the community standards.

## Getting Started

### 1. Fork the Repository

To start contributing:

1. Fork the repository by clicking the "Fork" button at the top-right corner of the page.
2. Clone your forked repository:

   ```bash
   git clone https://github.com/barkprotocol/baas-platform.git
   ```

3. Navigate to the project directory:

   ```bash
   cd baas-platform
   ```

### 2. Install Dependencies

We use **pnpm** for managing dependencies. If you don't have **pnpm** installed, you can install it globally:

```bash
npm install -g pnpm
```

Afterwards, install the project dependencies:

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the environment variables with appropriate values.

### 4. Run the Project Locally

To start the development server:

```bash
pnpm dev
```

This will start the server on [http://localhost:3000](http://localhost:3000).

### 5. Run Tests

Make sure all tests pass before submitting any code:

```bash
pnpm test
```

## Submitting a Pull Request

When you're ready to contribute, follow these steps:

1. **Create a new branch**: Always work on a new branch for your changes. Name it according to the feature or fix you're working on:

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes**: Implement your feature or fix. Be sure to follow the coding standards outlined below.

3. **Test your changes**: Run the project locally to ensure that everything works as expected and all tests pass.

4. **Commit your changes**: Use meaningful and concise commit messages. Follow this convention:

   ```bash
   git commit -m "Add feature to support NFT staking"
   ```

5. **Push to your fork**:

   ```bash
   git push origin feature/new-feature
   ```

6. **Open a Pull Request**: Go to your forked repository on GitHub, and click the "New Pull Request" button. Provide a detailed description of your changes and reference any relevant issues or discussions.

7. **Review Process**: A project maintainer will review your pull request, provide feedback, and request changes if necessary. Once everything is approved, your pull request will be merged.

## Coding Guidelines

Please ensure that your code follows the style and quality guidelines below:

- **TypeScript**: The platform uses TypeScript. Ensure that your code is strongly typed and follows TypeScript best practices.
- **Prettier and ESLint**: The project uses **Prettier** and **ESLint** for formatting and linting. Run the following command to format your code:

  ```bash
  pnpm lint
  ```

- **Comments**: Write comments for complex sections of code, explaining the logic and any important considerations.
- **Tests**: If you're adding new functionality, please write unit tests to cover your changes.

## Reporting Issues

If you find any bugs or have suggestions for new features, feel free to open an issue on the repository. Please follow these steps:

1. Search existing issues to see if the problem or feature has already been reported.
2. If it hasn't, create a new issue and provide the following information:
   - Description of the issue.
   - Steps to reproduce the issue (if applicable).
   - Expected behavior and actual behavior.
   - Relevant screenshots, logs, or code snippets.

## Feature Requests

We welcome feature requests and suggestions! If you have a feature in mind that would improve the platform, please:

1. Open an issue titled "Feature Request: [Your Feature Name]".
2. Provide a clear description of the feature and how it would benefit the platform or users.
3. Discuss potential implementation details or challenges.

## Community and Support

For support or general questions, you can reach out to the BARK Protocol team:

- Email: [support@barkprotocol.com](mailto:support@barkprotocol.com)
- Discord: [Join our community](https://discord.gg/barkprotocol)

We encourage everyone to join our **Discord community** where we discuss new features, offer support, and collaborate on the future of the platform.

## Acknowledgements

Thank you to everyone who contributes to the BARK BaaS Platform! We deeply appreciate the time and effort you invest in improving the platform. Together, we can build something amazing!

---

Built with ❤️ by the BARK Protocol
```