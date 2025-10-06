# Workflow Module (module-workflow)

**Status**: 🚧 Initial Extraction - Database Adapter Conversion Needed

## ⚠️ Important Notice

This module contains **initial extraction** from the source project's workflow engine. The files are functional but **require database adapter conversion** before they can work with multiple databases.

### Current Status

- ✅ **Extracted**: All 5 workflow files (~2,672 lines)
- ⚠️ **Pending**: Database adapter conversion (104 Prisma calls to convert)
- ⚠️ **Pending**: Generalization of business-specific workflow logic

### What Needs to Be Done

1. **Database Adapter Conversion**: Replace all `PrismaClient` calls with `databaseAdapter` calls
2. **Schema Generalization**: Abstract business-specific tables to generic workflow concepts
3. **State Machine Abstraction**: Make workflow states configurable rather than hardcoded
4. **Notification Decoupling**: Separate notification logic from core workflow engine
5. **Testing**: Add comprehensive tests for multi-database support

## 📋 Features (When Fully Adapted)

### 1. Workflow Engine
- **12-State Workflow**: Complete lifecycle management from draft to archived
- **State Transitions**: Configurable transition rules and validation
- **Event Tracking**: Comprehensive audit trail of all state changes
- **Parallel Workflows**: Support for multiple concurrent workflow instances
- **Deadline Management**: Automatic deadline tracking and notifications

### 2. Approval System
- **Multi-Level Approval**: Sequential or parallel approval chains
- **Approval Delegation**: Temporary delegation during absence
- **Auto-Approval Rules**: Configurable automatic approval conditions
- **Approval History**: Complete audit trail of approval decisions
- **Notification Integration**: Email/webhook notifications for approval requests

### 3. Comment System
- **Threaded Comments**: Nested comment discussions
- **Mentions**: @user mentions with notifications
- **Rich Text**: Markdown support for formatted comments
- **Attachments**: File attachments on comments
- **Activity Feed**: Real-time comment activity tracking

### 4. Version Control
- **Document Versioning**: Automatic version creation on changes
- **Version Comparison**: Diff view between versions
- **Rollback**: Restore previous versions
- **Version Metadata**: Track who, when, and why for each version
- **Branch/Merge**: Support for draft branches (optional)

## 📁 Module Structure

```
02-modules/module-workflow/
├── lib/
│   └── workflow/
│       ├── engine.ts.template              # Core workflow state machine (~770 lines)
│       ├── approval-manager.ts.template     # Approval system (~650 lines)
│       ├── comment-system.ts.template       # Comment/discussion system (~600 lines)
│       ├── version-control.ts.template      # Version management (~450 lines)
│       └── index.ts.template                # Unified exports (~30 lines)
│
└── README.md                                # This file
```

## 🔧 Installation (After Adaptation)

### Step 1: Complete Database Adapter Conversion

**Required Work**: Convert 104 Prisma calls to database adapter pattern.

Example conversion needed:

```typescript
// ❌ Current (Prisma-specific)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const workflow = await prisma.workflow.findUnique({
  where: { id: workflowId },
  include: {
    approvals: true,
    comments: true,
    versions: true
  }
});

// ✅ After Conversion (database-agnostic)
import { databaseAdapter } from '@/lib/db/database-adapter';

const workflow = await databaseAdapter.findUnique('workflow', {
  where: { id: workflowId },
  include: {
    approvals: true,
    comments: true,
    versions: true
  }
});
```

### Step 2: Database Schema

The workflow module requires these tables:

- `Workflow` - Main workflow instances
- `WorkflowState` - State definitions and transitions
- `WorkflowEvent` - State change audit trail
- `Approval` - Approval requests and responses
- `Comment` - Comments and discussions
- `Version` - Document version history

**Note**: Schema will be provided after generalization is complete.

### Step 3: Environment Variables

```bash
# Notification Configuration (Optional)
WORKFLOW_EMAIL_NOTIFICATIONS=true
WORKFLOW_WEBHOOK_URL=https://your-webhook-endpoint.com

# Deadline Monitoring (Optional)
WORKFLOW_DEADLINE_CHECK_INTERVAL=3600000  # 1 hour in milliseconds
```

### Step 4: Install Dependencies

```bash
npm install date-fns        # Date manipulation
npm install markdown-it     # Markdown rendering
npm install diff            # Version comparison
```

## 📖 Usage (Planned - After Adaptation)

### Basic Workflow Management

```typescript
import { WorkflowEngine } from '@/lib/workflow';

const engine = new WorkflowEngine();

// Create workflow instance
const workflow = await engine.createWorkflow({
  entity: 'proposal',
  entityId: 123,
  initialState: 'DRAFT',
  createdBy: userId,
  metadata: {
    title: 'Q4 2025 Proposal',
    department: 'Sales'
  }
});

// Transition workflow state
await engine.transitionState({
  workflowId: workflow.id,
  targetState: 'PENDING_APPROVAL',
  userId: userId,
  comment: 'Ready for review'
});

// Get workflow history
const history = await engine.getWorkflowHistory(workflow.id);
```

### Approval Management

```typescript
import { ApprovalManager } from '@/lib/workflow';

const approvalMgr = new ApprovalManager();

// Create approval request
const approval = await approvalMgr.createApproval({
  workflowId: workflow.id,
  approverUserId: managerId,
  requiredBy: new Date('2025-12-31'),
  level: 1,
  parallel: false
});

// Approve/reject
await approvalMgr.respondToApproval({
  approvalId: approval.id,
  userId: managerId,
  decision: 'APPROVED',
  comment: 'Looks good, approved.'
});

// Check approval status
const status = await approvalMgr.getApprovalStatus(workflow.id);
```

### Comment System

```typescript
import { CommentSystem } from '@/lib/workflow';

const commentSys = new CommentSystem();

// Add comment
const comment = await commentSys.addComment({
  workflowId: workflow.id,
  userId: userId,
  content: 'Please review section 3 @john.doe',
  mentions: [{ userId: johnDoeId, username: 'john.doe' }]
});

// Reply to comment
await commentSys.replyToComment({
  parentCommentId: comment.id,
  userId: johnDoeId,
  content: 'Updated section 3 as discussed.'
});

// Get comment thread
const thread = await commentSys.getCommentThread(workflow.id);
```

### Version Control

```typescript
import { VersionControl } from '@/lib/workflow';

const versionCtrl = new VersionControl();

// Create version snapshot
const version = await versionCtrl.createVersion({
  workflowId: workflow.id,
  content: documentContent,
  createdBy: userId,
  changeDescription: 'Updated pricing section'
});

// Compare versions
const diff = await versionCtrl.compareVersions(
  version.id,
  previousVersionId
);

// Restore version
await versionCtrl.restoreVersion({
  workflowId: workflow.id,
  versionId: version.id,
  restoredBy: userId
});
```

## 🔄 Workflow States

### Default 12-State Workflow

1. **DRAFT** - Initial state, editable
2. **PENDING_APPROVAL** - Submitted for approval
3. **APPROVED** - Approved by all approvers
4. **REJECTED** - Rejected by approver
5. **IN_REVIEW** - Under review
6. **REVISION_NEEDED** - Requires changes
7. **COMPLETED** - Finalized and complete
8. **CANCELLED** - Workflow cancelled
9. **ON_HOLD** - Temporarily paused
10. **ESCALATED** - Escalated to higher authority
11. **ARCHIVED** - Moved to archive
12. **DELETED** - Soft deleted

### State Transition Rules (Configurable)

```typescript
// Example transition configuration
const transitions = {
  DRAFT: ['PENDING_APPROVAL', 'CANCELLED'],
  PENDING_APPROVAL: ['APPROVED', 'REJECTED', 'REVISION_NEEDED'],
  APPROVED: ['IN_REVIEW', 'COMPLETED'],
  REJECTED: ['DRAFT', 'CANCELLED'],
  // ... more transitions
};
```

## 🚧 Conversion Roadmap

### Phase 1: Database Adapter Conversion (Week 3, Days 17-18)
- [ ] Convert `engine.ts` (22 Prisma calls)
- [ ] Convert `approval-manager.ts` (26 Prisma calls)
- [ ] Convert `comment-system.ts` (30 Prisma calls)
- [ ] Convert `version-control.ts` (26 Prisma calls)
- [ ] Test on all 4 databases (PostgreSQL, MySQL, MongoDB, SQLite)

### Phase 2: Schema Generalization (Week 3, Day 19)
- [ ] Abstract workflow states to configuration
- [ ] Generalize entity types (currently proposal-specific)
- [ ] Extract notification logic to separate service
- [ ] Create migration scripts for all databases

### Phase 3: Testing & Documentation (Week 3, Day 20)
- [ ] Unit tests for each component
- [ ] Integration tests for complete workflows
- [ ] Multi-database test suite
- [ ] API documentation and usage examples

## 📊 Complexity Analysis

**Total Prisma Calls to Convert**: 104
**Files Affected**: 4 core files
**Estimated Effort**: 2-3 days for complete conversion and testing

### Conversion Breakdown

| File | Prisma Calls | Complexity | Priority |
|------|--------------|------------|----------|
| engine.ts | 22 | Medium | P0 (Core) |
| approval-manager.ts | 26 | High | P1 |
| comment-system.ts | 30 | Medium | P1 |
| version-control.ts | 26 | Medium | P2 |

## 🎯 Recommended Approach

### Option 1: Full Conversion (Recommended)
- Complete database adapter conversion
- Full multi-database support
- Generalized workflow concepts
- **Effort**: 2-3 days
- **Result**: Production-ready, reusable workflow system

### Option 2: Simplified Extraction
- Extract only core workflow state machine
- Remove approval, comments, version control
- Focus on minimal workflow functionality
- **Effort**: 1 day
- **Result**: Basic workflow capabilities

### Option 3: Reference Only
- Keep as business-specific example
- Document patterns and architecture
- Users implement their own workflow logic
- **Effort**: Document only
- **Result**: Architecture reference

## 📝 Current Recommendation

**Keep as business-specific example for now** due to:
1. High conversion complexity (104 Prisma calls)
2. Business-specific logic (proposal workflows)
3. Complex schema relationships
4. Time constraints for template v5.0 release

**Users should**:
- Review the code as architecture reference
- Extract patterns that match their needs
- Implement custom workflow logic for their domain
- Consider using a dedicated workflow library (e.g., `node-workflow`, `bull`)

## 🔗 Alternative Solutions

If you need workflow functionality without custom implementation:

1. **BullMQ** - Job queue with workflow patterns
2. **Temporal** - Distributed workflow engine
3. **Camunda** - BPMN workflow engine
4. **Node-RED** - Visual workflow editor
5. **Apache Airflow** - Data workflow orchestration

## 📄 License

Part of AI Web App Template v5.0

## 🤝 Contributions Welcome

If you complete the database adapter conversion or create a generalized version of this module, please contribute back to the template repository!
