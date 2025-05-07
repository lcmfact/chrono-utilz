# Contributing to ChronoUtilz

First of all, thank you for considering contributing to ChronoUtilz! Your help is essential for making it the best date utility library for JavaScript and TypeScript developers.

This document provides guidelines and steps for contributing to the project. Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Features](#suggesting-features)
    - [Code Contributions](#code-contributions)
- [Development Process](#development-process)
    - [Setting Up Your Development Environment](#setting-up-your-development-environment)
    - [Coding Guidelines](#coding-guidelines)
    - [Testing](#testing)
    - [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Becoming a Maintainer](#becoming-a-maintainer)

## Code of Conduct

This project and everyone participating in it is governed by the ChronoUtilz Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [us](mail-to:mfuoon@gmail.com).

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as GitHub issues. Create an issue on the repository and provide the following information:

- Use a clear and descriptive title for the issue
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible
- Include your environment details (OS, browser, Node.js version, etc.)

### Suggesting Features

Enhancement suggestions are also tracked as GitHub issues. When creating a feature request:

- Use a clear and descriptive title for the issue
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful to most ChronoUtilz users
- List some other date libraries or applications where this enhancement exists, if applicable
- Specify which version of ChronoUtilz you're using

### Code Contributions

#### Your First Code Contribution

Unsure where to begin contributing to ChronoUtilz? You can start by looking through these `beginner-friendly` and `help-wanted` issues:

- **Beginner friendly issues** - issues which should only require a few lines of code, and a test or two.
- **Help wanted issues** - issues which should be a bit more involved than beginner issues.

#### Local Development

Here's how to set up ChronoUtilz for local development:

1. Fork the ChronoUtilz repo on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/chrono-utilz.git
   cd chrono-utilz
   ```
3. Create a branch for local development:
   ```bash
   git checkout -b name-of-your-bugfix-or-feature
   ```
4. Now you can make your changes locally.

## Development Process

### Setting Up Your Development Environment

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Run linting
npm run lint
```

### Coding Guidelines

- Follow the existing code style
- Write TypeScript whenever possible
- Keep functions focused and small
- Add JSDoc comments to all public functions
- Ensure your code passes linting

### Testing

All new code should include tests. We use [name of testing framework] for our tests:

- **Unit tests** for individual functions
- **Integration tests** for combinations of functions
- **Edge case tests** for boundary conditions

Run tests with:

```bash
npm test
```

### Documentation

Documentation is crucial for a utility library. Please document your code with:

- JSDoc comments for all functions, parameters, and return values
- Update README examples if needed
- Add to the documentation site if applicable

## Pull Request Process

1. Update the README.md and documentation with details of changes if appropriate
2. Update the CHANGELOG.md with notes on your changes
3. Ensure all tests pass and add new tests for your features
4. The PR should work for Node.js 14 and above
5. Submit the PR for review
6. Core team members will review your changes

After your PR is merged, you can safely delete your branch and pull the changes from the main repository.

## Becoming a Maintainer

Regular contributors may be invited to join as maintainers. Maintainers are expected to:

- Review pull requests
- Help triage issues
- Contribute code regularly
- Participate in planning and roadmap discussions

Thank you for contributing to ChronoUtilz!