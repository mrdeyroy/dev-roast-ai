# Contributing to Dev Roast AI 🚀

First off, thank you for considering contributing to **Dev Roast AI**! It's people like you that make this platform such a savage but great place for developers to improve their profiles.

## 🛠 How to Contribute

### 1. Reporting Bugs
This section guides you through submitting a bug report for Dev Roast AI.
- Ensure the bug was not already reported by searching on GitHub under Issues.
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### 2. Suggesting Enhancements
This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.
- Open a new issue with the label `enhancement`.
- Provide a clear and detailed explanation of the feature you want and why it's important.

### 3. Pull Requests
Please follow these steps to have your contribution considered by the maintainers:

1. **Fork the repository** and create your branch from `main`.
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Set up the project** following the "Getting Started" guide in `README.md`.
3. **Make your changes**. If you've added code that should be tested, please try to test it! 
4. **Ensure the project builds** without errors:
   ```bash
   npm run build
   ```
5. **Format your code**. We use ESLint and typical Next.js formatting.
   ```bash
   npm run lint
   ```
6. **Commit your changes**. Use descriptive commit messages.
   ```bash
   git commit -m "feat: add new LinkedIn roast metrics"
   ```
7. **Push to your fork** and submit a Pull Request.

## 🧠 What can you work on?

We are always looking for help with:
- **Adding new roast categories** (e.g., CodePen, StackOverflow profile roasts).
- **Improving AI prompts** in `lib/ai/prompts.ts` to make the roasts even funnier and more accurate.
- **UI/UX improvements** using Tailwind CSS and Framer Motion.
- **Performance optimizations** and fixing edge cases with AI API limits.
- **Documentation** updates and typo fixes.

## 🧑‍💻 Code Style & Standards

- **TypeScript**: We use TypeScript across the codebase. Please ensure strict typing where possible.
- **Components**: Follow the existing structure in `components/`. Keep components modular and reusable.
- **Styling**: We rely on Tailwind CSS. Avoid writing custom CSS unless absolutely necessary.
- **Commit Messages**: We follow conventional commits structure (`feat:`, `fix:`, `docs:`, `chore:`, etc.).

Thank you for contributing to Dev Roast AI! Let's build something awesome (and slightly savage) together.
