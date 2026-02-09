# Contributing to EthicsGate

Thank you for your interest in contributing to EthicsGate! We welcome contributions from the community.

## Open-Core Model

EthicsGate follows an **open-core** business model:

### What's Open Source (This Repository)
- Core IRB review platform
- Proposal submission and review workflow
- Inline annotation system
- Database schema and migrations
- Authentication flows
- User interface components

**License:** AGPL-3.0 (see LICENSE)

### What's Proprietary (Enterprise Edition)
The following features are available only in our commercial Enterprise Edition:
- SSO/SAML integration
- Advanced audit logging
- Custom branding and white-labeling
- Priority support
- Multi-region deployment tools
- Advanced analytics and reporting
- Compliance certifications (HIPAA, GDPR tools)

For enterprise licensing, contact: contact@paperplane-software.com

## How to Contribute

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Write or update tests if applicable
5. Commit your changes: `git commit -m "Add: your feature description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request

### Development Setup
```bash
cd ethicsgate-app
pnpm install
cp .env.local.example .env.local  # Add your Supabase credentials
pnpm dev
```

### Code Style
- Use TypeScript for all new code
- Follow the existing code formatting (Prettier)
- Write meaningful commit messages
- Add comments for complex logic

### Pull Request Guidelines
- Keep PRs focused on a single feature or fix
- Include a clear description of the changes
- Reference any related issues
- Ensure tests pass (when we add them)
- Update documentation if needed

## Code of Conduct

Be respectful and constructive in all interactions. We're building software to help research institutions, so professionalism matters.

## Questions?

- Open an issue for bugs or feature requests
- Reach out on our community Discord (coming soon)
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License.
