# Notification Module (module-notification)

Multi-channel notification system with email and in-app notification support.

## 📋 Features

### 1. Notification Engine
- **Multi-Channel**: Email, in-app, webhook support
- **Template System**: Handlebars template integration
- **Priority Levels**: Urgent, high, normal, low
- **Batch Processing**: Efficient bulk notification sending
- **Retry Logic**: Automatic retry for failed notifications
- **Delivery Tracking**: Status tracking and delivery confirmation

### 2. Email Service
- **SMTP Integration**: Nodemailer-based email sending
- **Template Rendering**: Dynamic email templates
- **Attachment Support**: File attachments in emails
- **HTML & Plain Text**: Dual format support
- **Rate Limiting**: Prevent email sending abuse
- **Send Grid/SES Ready**: Easy integration with cloud email services

### 3. In-App Notifications
- **Real-Time**: WebSocket-based push notifications
- **Notification Center**: Unread count and history
- **Action Buttons**: Clickable actions in notifications
- **Read/Unread Tracking**: Mark as read functionality
- **Notification Grouping**: Group similar notifications
- **Auto-Expiration**: Automatic cleanup of old notifications

## 📁 Module Structure

```
02-modules/module-notification/
├── lib/
│   └── notification/
│       ├── engine.ts.template           # Core notification engine (~530 lines)
│       ├── email-service.ts.template     # Email sending service (~380 lines)
│       ├── in-app-service.ts.template    # In-app notifications (~300 lines)
│       └── index.ts.template             # Unified exports (~35 lines)
│
└── README.md                             # This file
```

## 🔧 Installation

### Step 1: Copy Module Files

During project initialization, the CLI will copy this module to your project root.

### Step 2: Environment Variables

Add to `.env.local`:

```bash
# Email Configuration (Required for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourapp.com

# Email Service Providers (Optional - choose one)
SENDGRID_API_KEY=your-sendgrid-api-key
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY=your-access-key
AWS_SES_SECRET_KEY=your-secret-key

# Notification Settings
NOTIFICATION_RATE_LIMIT=100  # Max emails per hour
NOTIFICATION_RETRY_ATTEMPTS=3
NOTIFICATION_RETRY_DELAY=5000  # 5 seconds
```

### Step 3: Database Schema

Requires these tables:

- `Notification` - Notification records
- `NotificationTemplate` - Email/in-app templates
- `NotificationDelivery` - Delivery status tracking
- `UserNotificationSettings` - User preferences

### Step 4: Install Dependencies

```bash
npm install nodemailer  # Email sending
npm install handlebars  # Template rendering
npm install @sendgrid/mail  # Optional: SendGrid
npm install @aws-sdk/client-ses  # Optional: AWS SES
npm install -D @types/nodemailer
```

## 📖 Usage

### Send Email Notification

```typescript
import { sendEmail } from '@/lib/notification';

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to Our App',
  template: 'welcome-email',
  variables: {
    userName: 'John Doe',
    activationLink: 'https://app.com/activate/123'
  },
  priority: 'high'
});
```

### Send In-App Notification

```typescript
import { sendInAppNotification } from '@/lib/notification';

await sendInAppNotification({
  userId: 123,
  title: 'New Message',
  message: 'You have received a new message from Admin',
  type: 'message',
  actionUrl: '/messages/456',
  priority: 'normal'
});
```

### Batch Notifications

```typescript
import { sendBatchNotifications } from '@/lib/notification';

await sendBatchNotifications([
  {
    type: 'email',
    to: 'user1@example.com',
    subject: 'Update',
    template: 'update-email',
    variables: { content: 'New feature released' }
  },
  {
    type: 'in-app',
    userId: 123,
    title: 'Update',
    message: 'New feature available'
  }
]);
```

## ⚠️ Database Adapter Conversion Needed

**Status**: 🚧 Initial extraction - requires database adapter conversion

The module currently uses Prisma directly. Conversion needed:

- `engine.ts`: ~15 Prisma calls → database adapter
- `email-service.ts`: ~10 Prisma calls → database adapter
- `in-app-service.ts`: ~12 Prisma calls → database adapter

**Example conversion**:

```typescript
// ❌ Current
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const notification = await prisma.notification.create({ data: {...} });

// ✅ After conversion
import { databaseAdapter } from '@/lib/db/database-adapter';
const notification = await databaseAdapter.create('notification', { data: {...} });
```

## 📊 API Reference

### `sendEmail(options)`

Send email notification.

**Parameters**:
- `to` - Recipient email address
- `subject` - Email subject
- `template` - Template name (optional)
- `html` - HTML content (if no template)
- `text` - Plain text content
- `variables` - Template variables
- `priority` - 'urgent' | 'high' | 'normal' | 'low'
- `attachments` - File attachments (optional)

### `sendInAppNotification(options)`

Send in-app notification.

**Parameters**:
- `userId` - Target user ID
- `title` - Notification title
- `message` - Notification message
- `type` - Notification type ('info' | 'success' | 'warning' | 'error')
- `actionUrl` - Click action URL (optional)
- `priority` - Priority level

### `getUserNotifications(userId, options?)`

Get user's notifications.

**Returns**: Array of notifications with unread count.

## 🔐 Security Best Practices

1. **Email Validation**: Always validate email addresses before sending
2. **Rate Limiting**: Implement rate limits to prevent abuse
3. **Template Injection**: Sanitize all variables in templates
4. **User Preferences**: Respect user notification preferences
5. **Unsubscribe**: Include unsubscribe links in marketing emails

## 📝 Changelog

- **v5.0** (2025-10-06): Initial extraction
  - Core notification engine
  - Email service with SMTP support
  - In-app notification service
  - Multi-channel support
  - Database adapter conversion needed

## 📄 License

Part of AI Web App Template v5.0
