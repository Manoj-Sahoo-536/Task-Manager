# Contributing Guide

Thank you for considering contributing to Task Manager! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

---

## How to Contribute

### Reporting Bugs

1. Check if the bug already exists in [Issues](https://github.com/Manoj-Sahoo-536/Task-Manager/issues)
2. If not, create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (browser, OS)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear feature description
   - Use case and benefits
   - Possible implementation approach
   - Mockups or examples (if applicable)

### Submitting Code

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## Development Setup

### Prerequisites

- Node.js v14+
- MongoDB
- Git

### Setup Steps

1. **Fork and Clone**
```bash
git clone https://github.com/Manoj-Sahoo-536/Task-Manager.git
cd Task-Manager
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

---

## Coding Standards

### JavaScript/React

- Use ES6+ features
- Follow functional programming patterns
- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic

### Code Style

```javascript
// Good
const getUserTasks = async (userId) => {
  const tasks = await Task.find({ user: userId });
  return tasks;
};

// Bad
const get = async (id) => {
  return await Task.find({ user: id });
};
```

### File Organization

```
frontend/src/
├── components/     # Reusable components
├── pages/         # Page components
├── context/       # Context providers
├── hooks/         # Custom hooks
├── utils/         # Utility functions
└── styles/        # Global styles
```

---

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation
- `refactor/what-changed` - Code refactoring

### Commit Messages

Follow conventional commits:

```
feat: add voice input feature
fix: resolve task deletion bug
docs: update API documentation
style: format code with prettier
refactor: simplify task filtering logic
test: add unit tests for auth
```

### Pull Request Process

1. **Create PR**
   - Clear title and description
   - Reference related issues
   - List changes made
   - Add screenshots for UI changes

2. **PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Tested on multiple browsers

## Screenshots
(if applicable)
```

3. **Review Process**
   - Wait for maintainer review
   - Address feedback
   - Make requested changes
   - Get approval

4. **Merge**
   - Maintainer will merge
   - Delete your branch after merge

---

## Testing Guidelines

### Manual Testing

Test your changes:
- Create, read, update, delete operations
- Edge cases and error handling
- Different screen sizes
- Multiple browsers
- Offline functionality

### Writing Tests

```javascript
// Example test
describe('Task Creation', () => {
  it('should create a new task', async () => {
    const task = await createTask({
      title: 'Test Task',
      priority: 'high'
    });
    expect(task.title).toBe('Test Task');
  });
});
```

---

## Documentation

### Code Documentation

```javascript
/**
 * Creates a new task for the user
 * @param {Object} taskData - Task information
 * @param {string} taskData.title - Task title
 * @param {string} taskData.priority - Task priority (low, medium, high)
 * @returns {Promise<Object>} Created task object
 */
const createTask = async (taskData) => {
  // Implementation
};
```

### README Updates

- Update README for new features
- Add usage examples
- Update screenshots
- Keep documentation in sync with code

---

## Areas to Contribute

### Good First Issues

- Fix typos in documentation
- Add missing error messages
- Improve UI/UX
- Add unit tests
- Update dependencies

### Feature Ideas

- Calendar view for tasks
- Kanban board layout
- Email notifications
- Mobile app (React Native)
- Browser extension
- Task templates
- Time tracking
- Pomodoro timer integration

### Bug Fixes

Check [Issues](https://github.com/Manoj-Sahoo-536/Task-Manager/issues) for bugs to fix

---

## Code Review

### What We Look For

- Code quality and readability
- Proper error handling
- Security considerations
- Performance implications
- Test coverage
- Documentation updates

### Review Timeline

- Initial review: 2-3 days
- Follow-up reviews: 1-2 days
- Be patient and responsive

---

## Getting Help

### Questions?

- Open a discussion on GitHub
- Comment on related issues
- Email: manojsahoo8940@gmail.com

### Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [MDN Web Docs](https://developer.mozilla.org)

---

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in commits

---

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing! 🎉
