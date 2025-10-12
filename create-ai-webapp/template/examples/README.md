# 📚 Examples and Sample Data

This directory contains example data, sample logs, and reference materials for the {{PROJECT_NAME}} template.

## 📁 Directory Structure

```
examples/
├── seed-data/          # Seed data for database initialization
├── sample-logs/        # Sample log file templates
└── ui-screenshots/     # UI reference screenshots (if included)
```

---

## 🌱 Seed Data

The `seed-data/` directory contains TypeScript files for initializing the database with example data.

### Available Seed Files

- **`users.ts.template`** - 5 example users with different roles
- **`knowledge-base.ts.template`** - Sample knowledge base documents
- **`workflows.ts.template`** - Example workflow definitions
- **`notifications.ts.template`** - Sample notifications
- **`seed.ts.template`** - Main seed script that runs all seeds

### Usage

```bash
# Run all seed data
npm run seed

# Run specific seed (after customization)
npx ts-node examples/seed-data/seed.ts
```

### Seed Data Details

**Users (5)**:
1. **Admin** - Full system administrator
2. **Sales Manager** - Team leader with management permissions
3. **Sales Representative** - Standard sales user
4. **Marketing Manager** - Marketing and content management
5. **Customer Support** - Support and service user

**Knowledge Base Documents (10+)**:
- Product documentation
- Sales playbooks
- Training materials
- FAQ documents

**Workflows (5+)**:
- Lead qualification process
- Quote approval workflow
- Contract review process
- Customer onboarding flow
- Support ticket resolution

**Notifications (20+)**:
- System notifications
- Workflow updates
- Assignment notifications
- Deadline reminders

---

## 📝 Sample Logs

The `sample-logs/` directory contains example log files that demonstrate the logging format and structure.

### Available Sample Logs

- **`DEVELOPMENT-LOG-example.md`** - Example development log with 2-3 entries
- **`FIXLOG-example.md`** - Example fix log with 2-3 entries

### Purpose

These sample logs serve as:
- Templates for your actual development logs
- Examples of proper log formatting
- Reference for AI assistants on log structure

### Note

The actual project will have empty log files following these structures. These samples are for reference only.

---

## 🎨 UI Screenshots (Optional)

The `ui-screenshots/` directory contains reference screenshots of the UI for 100% consistency verification.

### Screenshots Included

- Dashboard overview
- Login/registration pages
- Main navigation
- Form examples
- Modal dialogs
- Component showcase

### Usage

Use these screenshots to:
- Verify UI consistency when customizing
- Compare your implementation with the reference
- Ensure animations and effects match
- Validate responsive behavior

---

## 🔧 Customization Guide

### Modifying Seed Data

1. Edit the template files in `seed-data/`
2. Update user emails, names, and roles
3. Customize sample content for your domain
4. Adjust quantities as needed

### Using Sample Logs

1. Copy the structure from sample logs
2. Clear the example content
3. Use as templates for your actual logs
4. Maintain the same formatting

---

## ⚠️ Important Notes

- **Seed data is for development only** - Do not use in production
- **Sample logs are examples** - Your actual logs should be separate
- **UI screenshots are references** - For consistency verification
- **All data is fictional** - Names, emails, and content are made up

---

*Part of the {{PROJECT_NAME}} template - Version 5.0*

