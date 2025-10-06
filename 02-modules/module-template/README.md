# Template Module (module-template)

Handlebars-based template engine with CRUD management for dynamic content generation.

## 📋 Features

### 1. Template Engine
- **Handlebars Integration**: Full Handlebars template rendering support
- **Custom Helpers**: 20+ built-in helper functions for data formatting
- **Template Compilation**: Pre-compile templates for better performance
- **Variable Validation**: Type-safe variable validation with error messages
- **Preview Mode**: Test templates with sample data before deployment
- **Safe Rendering**: HTML escaping and XSS prevention

### 2. Template Manager
- **CRUD Operations**: Create, read, update, delete template management
- **Version Control**: Automatic version tracking for template changes
- **Access Control**: Private, organization, and public access levels
- **Category System**: Organize templates by business categories
- **Search & Filter**: Full-text search with category and tag filtering
- **Usage Tracking**: Monitor template usage statistics
- **Default Templates**: Support for default templates per category

### 3. Custom Handlebars Helpers
- **Date Formatting**: `{{formatDate date 'YYYY-MM-DD'}}`
- **Currency**: `{{formatCurrency amount 'TWD'}}`
- **Numbers**: `{{formatNumber value 2}}` (2 decimals)
- **Percentages**: `{{formatPercent 0.85 1}}` → 85.0%
- **String Operations**: uppercase, lowercase, capitalize, truncate
- **Math Operations**: add, subtract, multiply, divide
- **Comparisons**: eq, ne, gt, lt, gte, lte
- **Logic**: and, or, not
- **Arrays**: length, includes, join
- **Utilities**: default, json

## 📁 Module Structure

```
02-modules/module-template/
├── lib/
│   └── template/
│       ├── template-engine.ts.template      # Handlebars rendering engine (~430 lines)
│       ├── template-manager.ts.template     # Template CRUD manager (~588 lines)
│       └── handlebars-helpers.ts.template   # Custom helper functions (~120 lines)
│
└── README.md                                 # This file
```

## 🔧 Installation

### Step 1: Copy Module Files

During project initialization, the CLI will copy this module to your project root.

### Step 2: Database Schema

Requires these tables:

- `ProposalTemplate` - Template records with content and variables
- `User` - Template creators and updaters (creator/updater relationships)

### Step 3: Install Dependencies

```bash
npm install handlebars  # Template engine
npm install -D @types/handlebars
```

## 📖 Usage

### Basic Template Rendering

```typescript
import { templateEngine } from '@/lib/template/template-engine';

// Simple template rendering
const template = 'Hello {{name}}!';
const result = templateEngine.render(template, { name: 'John' });
// → Hello John!

// Template with helpers
const template = `
  Date: {{formatDate created_at 'YYYY-MM-DD'}}
  Price: {{formatCurrency price 'USD'}}
  Discount: {{formatPercent discount 1}}
`;

const result = templateEngine.render(template, {
  created_at: new Date('2025-01-15'),
  price: 99.99,
  discount: 0.15
});
// → Date: 2025-01-15
//   Price: $99.99
//   Discount: 15.0%
```

### Template Manager - CRUD Operations

```typescript
import { templateManager } from '@/lib/template/template-manager';

// Create a new template
const template = await templateManager.createTemplate(userId, {
  name: 'Welcome Email',
  description: 'New user welcome email template',
  category: 'EMAIL',
  content: `
    <h1>Welcome {{user_name}}!</h1>
    <p>Your account was created on {{formatDate created_at 'long'}}.</p>
    <p>{{#if is_premium}}You are a premium member!{{/if}}</p>
  `,
  variables: {
    user_name: {
      type: 'text',
      label: 'User Name',
      required: true,
      placeholder: 'Enter user name'
    },
    created_at: {
      type: 'date',
      label: 'Account Creation Date',
      required: true
    },
    is_premium: {
      type: 'boolean',
      label: 'Premium Member',
      required: false,
      defaultValue: false
    }
  },
  accessLevel: 'ORGANIZATION',
  isDefault: true
});

// Get templates with filters
const result = await templateManager.getTemplates(userId, {
  category: 'EMAIL',
  search: 'welcome',
  sortBy: 'usage_count',
  sortOrder: 'desc',
  page: 1,
  pageSize: 20
});

console.log(result.templates); // Template list
console.log(result.total); // Total count
console.log(result.page); // Current page

// Update template
await templateManager.updateTemplate(templateId, userId, {
  content: '<h1>Welcome {{user_name}}! Updated version.</h1>',
  version: 2 // Auto-incremented
});

// Duplicate template
const copy = await templateManager.duplicateTemplate(
  templateId,
  userId,
  'Welcome Email (Copy)'
);

// Delete template (soft delete)
await templateManager.deleteTemplate(templateId, userId);
```

### Variable Validation

```typescript
import { templateEngine } from '@/lib/template/template-engine';

// Define template variables
const variables = {
  email: {
    type: 'text',
    label: 'Email Address',
    required: true,
    validation: {
      pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
      message: 'Invalid email format'
    }
  },
  age: {
    type: 'number',
    label: 'Age',
    required: true,
    validation: {
      min: 18,
      max: 120,
      message: 'Age must be between 18 and 120'
    }
  }
};

// Validate user input
const validation = templateEngine.validateVariables(variables, {
  email: 'invalid-email',
  age: 15
});

console.log(validation.valid); // false
console.log(validation.errors);
// [
//   'Variable "Email Address" format is incorrect',
//   'Variable "Age" cannot be less than 18'
// ]
```

### Advanced Template Features

```typescript
// Conditional rendering
const template = `
  {{#if user.is_admin}}
    <button>Admin Panel</button>
  {{else}}
    <p>You are not an admin</p>
  {{/if}}
`;

// Loops
const template = `
  <ul>
  {{#each products}}
    <li>{{name}} - {{formatCurrency price 'USD'}}</li>
  {{/each}}
  </ul>
`;

// Math operations
const template = `
  Subtotal: {{formatCurrency subtotal}}
  Tax: {{formatCurrency (multiply subtotal 0.1)}}
  Total: {{formatCurrency (add subtotal (multiply subtotal 0.1))}}
`;

// Comparisons
const template = `
  {{#if (gt score 90)}}
    Grade: A
  {{else if (gt score 80)}}
    Grade: B
  {{else}}
    Grade: C
  {{/if}}
`;

// Default values
const template = `
  Name: {{default user_name 'Guest'}}
  Role: {{default user_role 'Member'}}
`;
```

### Template Preview

```typescript
import { templateEngine } from '@/lib/template/template-engine';

// Preview with test data
const { html, data } = templateEngine.preview(
  template.content,
  template.variables,
  {
    user_name: 'Test User',
    created_at: new Date(),
    is_premium: true
  }
);

console.log(html); // Rendered HTML
console.log(data); // Data used for rendering
```

### Template Statistics

```typescript
import { templateManager } from '@/lib/template/template-manager';

// Get usage statistics
const stats = await templateManager.getTemplateStats(userId);

console.log(stats.totalTemplates); // 42
console.log(stats.templatesByCategory);
// { EMAIL: 15, PROPOSAL: 20, REPORT: 7 }

console.log(stats.mostUsedTemplates);
// Top 5 templates by usage_count

console.log(stats.recentTemplates);
// 5 most recently created templates
```

### Extract Template Variables

```typescript
import { templateEngine } from '@/lib/template/template-engine';

const template = `
  Hello {{user_name}}!
  Your order #{{order_id}} totaling {{formatCurrency total}}
  will be shipped to {{address}}.
`;

const variables = templateEngine.extractVariables(template);
// ['user_name', 'order_id', 'total', 'address']
```

## ⚠️ Database Adapter Conversion Needed

**Status**: 🚧 Initial extraction - requires database adapter conversion

The module currently uses Prisma directly. Conversion needed:

- `template-manager.ts`: ~36 Prisma calls → database adapter

**Example conversion**:

```typescript
// ❌ Current
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const template = await prisma.proposalTemplate.create({ data: {...} });

// ✅ After conversion
import { databaseAdapter } from '@/lib/db/database-adapter';
const template = await databaseAdapter.create('proposalTemplate', { data: {...} });
```

**Conversion Breakdown**:

| File | Prisma Calls | Complexity | Priority |
|------|--------------|------------|----------|
| template-manager.ts | ~36 | Medium | P1 |
| template-engine.ts | 0 | N/A | - |
| handlebars-helpers.ts | 0 | N/A | - |

## 📊 API Reference

### TemplateEngine

#### Rendering Methods
- `compile(template, options?)` - Compile template to function
- `render(template, data, options?)` - Render template with data
- `preview(template, variables, testData?)` - Preview with test data

#### Validation & Utilities
- `validateVariables(variables, data)` - Validate variable data
- `extractVariables(template)` - Extract variable names from template

### TemplateManager

#### CRUD Operations
- `createTemplate(userId, data)` - Create new template
- `getTemplates(userId, options?)` - Get template list with filters
- `getTemplateById(templateId, userId)` - Get single template
- `updateTemplate(templateId, userId, data)` - Update template
- `deleteTemplate(templateId, userId)` - Soft delete template

#### Advanced Operations
- `duplicateTemplate(templateId, userId, newName?)` - Copy template
- `incrementUsageCount(templateId)` - Track usage
- `getTemplateStats(userId)` - Get statistics

### Custom Helpers

#### Formatting
- `formatDate(date, format?)` - Date formatting
- `formatCurrency(amount, currency?)` - Currency formatting
- `formatNumber(num, decimals?)` - Number with decimals
- `formatPercent(num, decimals?)` - Percentage formatting

#### String Operations
- `uppercase(str)` - Convert to uppercase
- `lowercase(str)` - Convert to lowercase
- `capitalize(str)` - Capitalize first letter
- `truncate(str, length?)` - Truncate with ellipsis

#### Math Operations
- `add(a, b)` - Addition
- `subtract(a, b)` - Subtraction
- `multiply(a, b)` - Multiplication
- `divide(a, b)` - Division

#### Comparisons
- `eq(a, b)` - Equal
- `ne(a, b)` - Not equal
- `gt(a, b)` - Greater than
- `lt(a, b)` - Less than
- `gte(a, b)` - Greater than or equal
- `lte(a, b)` - Less than or equal

#### Logic
- `and(...args)` - Logical AND
- `or(...args)` - Logical OR
- `not(value)` - Logical NOT

#### Arrays
- `length(array)` - Array length
- `includes(array, value)` - Check if array includes value
- `join(array, separator?)` - Join array elements

#### Utilities
- `default(value, defaultValue)` - Provide default value
- `json(obj)` - JSON stringify (for debugging)

## 🔐 Security Best Practices

1. **HTML Escaping**: Always escape user input in templates (enabled by default)
2. **Template Injection**: Validate template content before saving
3. **Variable Validation**: Use strict validation rules for user input
4. **Access Control**: Enforce proper access levels (private/org/public)
5. **XSS Prevention**: Never use `{{{triple}}}` mustaches with user data

## 📝 Changelog

- **v5.0** (2025-10-06): Initial extraction
  - Handlebars template engine with 20+ helpers
  - Template CRUD manager with version control
  - Variable validation and preview system
  - Database adapter conversion needed (~36 calls)

## 📄 License

Part of AI Web App Template v5.0
