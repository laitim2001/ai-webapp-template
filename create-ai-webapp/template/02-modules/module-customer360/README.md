# Customer 360 Module

Comprehensive customer 360-degree view service with multi-source data aggregation and intelligent insights.

## 📋 Overview

This module provides a unified customer view by aggregating data from multiple sources:
- Local customer database
- CRM system (Dynamics 365)
- Knowledge base interactions
- Sales opportunities and proposals
- Communication history
- AI-powered customer insights

## 📦 Module Contents

**Total**: 1 file, 784 lines of code

### Core Files
- `lib/integrations/customer-360/service.ts` (784 lines) - Customer 360 service

## 🚀 Features

### 1. Multi-Source Data Aggregation
- **Local Database** - Customer, Contact, Opportunity data
- **CRM Integration** - Dynamics 365 account sync
- **Knowledge Base** - Content interaction tracking
- **Documents** - Proposals, presentations, contracts
- **Communications** - Calls, emails, meetings

### 2. Customer Information Views
- Basic customer profile
- Contact persons list
- Sales opportunities pipeline
- Interaction history timeline
- Document library
- Statistical summaries

### 3. Intelligent Insights
- Customer engagement scoring
- Purchase pattern analysis
- Risk indicators
- Opportunity predictions
- Relationship health metrics
- Next best action recommendations

### 4. Timeline Visualization
- Chronological event tracking
- Interaction milestones
- Opportunity progression
- Document sharing history
- Communication logs

### 5. Summary Analytics
- Total opportunities value
- Win rate calculation
- Average deal size
- Customer lifetime value (CLV)
- Engagement frequency
- Last interaction tracking

### 6. Real-Time Updates
- Automatic data refresh
- Cross-system synchronization
- Change notifications
- Activity alerts

## 🔧 Installation

### Dependencies
```bash
npm install @prisma/client     # Database ORM
npm install date-fns           # Date utilities (optional)
```

### Database Schema
Ensure the following models exist in your Prisma schema:
- `Customer` - Customer entity
- `Contact` - Contact persons
- `Opportunity` - Sales opportunities
- `KnowledgeItem` - Knowledge base content
- `CustomerInteraction` - Interaction logs
- `Document` - Document storage

## 📖 Usage Examples

### Get Complete Customer 360 View
```typescript
import { getCustomer360View } from '@/lib/integrations/customer-360/service';

const customerId = 123;
const customer360 = await getCustomer360View(customerId);

// Access different aspects
console.log('Company:', customer360.basicInfo.companyName);
console.log('Contacts:', customer360.contacts.length);
console.log('Open Opportunities:', customer360.opportunities.filter(o => o.status === 'open').length);
console.log('Total Value:', customer360.summary.totalOpportunityValue);
console.log('Recent Activity:', customer360.timeline[0]);
```

### Customer Profile Component
```typescript
'use client';

import { useEffect, useState } from 'react';
import { Customer360View } from '@/lib/integrations/customer-360/service';

export function CustomerProfile({ customerId }: { customerId: number }) {
  const [customer, setCustomer] = useState<Customer360View | null>(null);

  useEffect(() => {
    fetch(`/api/customers/${customerId}/360`)
      .then(res => res.json())
      .then(data => setCustomer(data));
  }, [customerId]);

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <section>
        <h2>{customer.basicInfo.companyName}</h2>
        <p>Industry: {customer.basicInfo.industry}</p>
        <p>Status: {customer.basicInfo.status}</p>
      </section>

      {/* Summary Stats */}
      <section className="grid grid-cols-4 gap-4">
        <div>
          <h3>Total Value</h3>
          <p>${customer.summary.totalOpportunityValue.toLocaleString()}</p>
        </div>
        <div>
          <h3>Win Rate</h3>
          <p>{(customer.summary.winRate * 100).toFixed(1)}%</p>
        </div>
        <div>
          <h3>Opportunities</h3>
          <p>{customer.summary.opportunityCount}</p>
        </div>
        <div>
          <h3>Last Contact</h3>
          <p>{customer.summary.lastInteractionDate?.toLocaleDateString()}</p>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h3>Recent Activity</h3>
        <ul>
          {customer.timeline.slice(0, 5).map(event => (
            <li key={event.id}>
              <span>{event.type}</span>: {event.description}
              <time>{event.timestamp.toLocaleString()}</time>
            </li>
          ))}
        </ul>
      </section>

      {/* AI Insights */}
      {customer.insights.length > 0 && (
        <section>
          <h3>AI Insights</h3>
          {customer.insights.map((insight, idx) => (
            <div key={idx} className={`insight-${insight.type}`}>
              <strong>{insight.title}</strong>
              <p>{insight.description}</p>
              {insight.recommendation && (
                <p><em>Recommendation: {insight.recommendation}</em></p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
```

### API Route Implementation
```typescript
// app/api/customers/[id]/360/route.ts
import { getCustomer360View } from '@/lib/integrations/customer-360/service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    const customer360 = await getCustomer360View(customerId);

    return NextResponse.json(customer360);
  } catch (error) {
    console.error('Customer 360 error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer 360 view' },
      { status: 500 }
    );
  }
}
```

### Server Action for Customer Insights
```typescript
'use server';

import { getCustomerInsights } from '@/lib/integrations/customer-360/service';

export async function getCustomerAIInsights(customerId: number) {
  const insights = await getCustomerInsights(customerId);

  return {
    engagement: insights.find(i => i.type === 'engagement'),
    risk: insights.find(i => i.type === 'risk'),
    opportunity: insights.find(i => i.type === 'opportunity'),
    recommendations: insights.filter(i => i.type === 'recommendation')
  };
}
```

### Customer Timeline Component
```typescript
import { TimelineEvent } from '@/lib/integrations/customer-360/service';

export function CustomerTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="timeline">
      {events.map(event => (
        <div key={event.id} className={`timeline-item ${event.type}`}>
          <div className="timeline-marker" />
          <div className="timeline-content">
            <time>{event.timestamp.toLocaleDateString()}</time>
            <h4>{event.title || event.type}</h4>
            <p>{event.description}</p>
            {event.metadata && (
              <div className="metadata">
                {Object.entries(event.metadata).map(([key, value]) => (
                  <span key={key}>
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Opportunity Dashboard
```typescript
import { OpportunityInfo } from '@/lib/integrations/customer-360/service';

export function OpportunityPipeline({ opportunities }: { opportunities: OpportunityInfo[] }) {
  const stages = ['Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  return (
    <div className="pipeline">
      {stages.map(stage => {
        const stageOpps = opportunities.filter(o => o.stage === stage);
        const stageValue = stageOpps.reduce((sum, o) => sum + (o.estimatedValue || 0), 0);

        return (
          <div key={stage} className="pipeline-stage">
            <h3>{stage}</h3>
            <p className="count">{stageOpps.length} opportunities</p>
            <p className="value">${stageValue.toLocaleString()}</p>
            <ul>
              {stageOpps.map(opp => (
                <li key={opp.id}>
                  <span>{opp.name}</span>
                  <span>${opp.estimatedValue?.toLocaleString()}</span>
                  <span>{opp.closeProbability}% probability</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
```

## 🏗️ Architecture

### Data Aggregation Flow
```typescript
async function getCustomer360View(customerId: number): Promise<Customer360View> {
  // 1. Fetch basic customer info from local DB
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { assignedUser: true }
  });

  // 2. Fetch contacts
  const contacts = await prisma.contact.findMany({
    where: { customerId }
  });

  // 3. Fetch opportunities
  const opportunities = await prisma.opportunity.findMany({
    where: { customerId }
  });

  // 4. Fetch interactions
  const interactions = await prisma.customerInteraction.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' }
  });

  // 5. Fetch documents
  const documents = await prisma.document.findMany({
    where: { customerId }
  });

  // 6. Generate insights
  const insights = await generateCustomerInsights(customer, {
    opportunities,
    interactions
  });

  // 7. Build timeline
  const timeline = await buildCustomerTimeline({
    opportunities,
    interactions,
    documents
  });

  // 8. Calculate summary
  const summary = calculateCustomerSummary({
    opportunities,
    interactions
  });

  return {
    basicInfo: transformCustomerBasicInfo(customer),
    contacts: transformContacts(contacts),
    opportunities: transformOpportunities(opportunities),
    interactions: transformInteractions(interactions),
    documents: transformDocuments(documents),
    summary,
    timeline,
    insights
  };
}
```

### Insight Generation
```typescript
async function generateCustomerInsights(
  customer: Customer,
  context: InsightContext
): Promise<CustomerInsight[]> {
  const insights: CustomerInsight[] = [];

  // 1. Engagement Score
  const engagementScore = calculateEngagementScore(context.interactions);
  if (engagementScore < 30) {
    insights.push({
      type: 'engagement',
      title: 'Low Engagement Alert',
      description: `Customer engagement has dropped by ${100 - engagementScore}%`,
      severity: 'high',
      recommendation: 'Schedule a check-in call to re-engage'
    });
  }

  // 2. Opportunity Health
  const staleOpportunities = context.opportunities.filter(
    o => o.status === 'open' &&
    daysSince(o.updatedAt) > 30
  );
  if (staleOpportunities.length > 0) {
    insights.push({
      type: 'opportunity',
      title: 'Stale Opportunities',
      description: `${staleOpportunities.length} opportunities haven't been updated in 30+ days`,
      severity: 'medium',
      recommendation: 'Review and update opportunity status'
    });
  }

  // 3. Risk Indicators
  const riskScore = calculateRiskScore(customer, context);
  if (riskScore > 70) {
    insights.push({
      type: 'risk',
      title: 'Churn Risk Detected',
      description: 'Customer shows signs of potential churn',
      severity: 'high',
      recommendation: 'Immediate customer success intervention required'
    });
  }

  // 4. Upsell Opportunities
  const upsellPotential = identifyUpsellOpportunities(customer, context);
  if (upsellPotential.score > 60) {
    insights.push({
      type: 'recommendation',
      title: 'Upsell Opportunity',
      description: upsellPotential.description,
      severity: 'low',
      recommendation: `Consider proposing ${upsellPotential.products.join(', ')}`
    });
  }

  return insights;
}
```

### Timeline Building
```typescript
function buildCustomerTimeline(data: TimelineData): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Add opportunity events
  data.opportunities.forEach(opp => {
    events.push({
      id: `opp-${opp.id}`,
      type: 'opportunity',
      title: opp.name,
      description: `Opportunity ${opp.stage || 'created'}`,
      timestamp: opp.createdAt,
      metadata: {
        value: opp.estimatedValue,
        probability: opp.closeProbability
      }
    });
  });

  // Add interaction events
  data.interactions.forEach(interaction => {
    events.push({
      id: `int-${interaction.id}`,
      type: interaction.type,
      title: interaction.subject || interaction.type,
      description: interaction.notes,
      timestamp: interaction.createdAt,
      metadata: {
        userId: interaction.userId,
        duration: interaction.duration
      }
    });
  });

  // Add document events
  data.documents.forEach(doc => {
    events.push({
      id: `doc-${doc.id}`,
      type: 'document',
      title: doc.name,
      description: `Document ${doc.type} shared`,
      timestamp: doc.createdAt,
      metadata: {
        size: doc.size,
        url: doc.url
      }
    });
  });

  // Sort by timestamp (newest first)
  return events.sort((a, b) =>
    b.timestamp.getTime() - a.timestamp.getTime()
  );
}
```

## 🔒 Security Considerations

### Data Access Control
```typescript
// Ensure user can access customer data
import { auth } from '@/lib/auth';

export async function getCustomer360ViewSecure(customerId: number) {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  // Check if user has permission to view this customer
  const hasAccess = await checkCustomerAccess(session.user.id, customerId);

  if (!hasAccess) {
    throw new Error('Forbidden: No access to this customer');
  }

  return getCustomer360View(customerId);
}
```

### Sensitive Data Filtering
```typescript
// Filter sensitive data based on user role
export function filterSensitiveData(
  customer360: Customer360View,
  userRole: string
): Customer360View {
  if (userRole !== 'admin' && userRole !== 'manager') {
    // Hide financial details for regular users
    customer360.opportunities.forEach(opp => {
      opp.estimatedValue = undefined;
    });

    // Hide personal contact details
    customer360.contacts.forEach(contact => {
      contact.mobile = undefined;
    });
  }

  return customer360;
}
```

## ⚡ Performance Tips

### 1. Data Caching
```typescript
import { cache } from 'react';

export const getCachedCustomer360 = cache(
  async (customerId: number) => {
    const cacheKey = `customer360:${customerId}`;
    const cached = await redis.get(cacheKey);

    if (cached) return JSON.parse(cached);

    const data = await getCustomer360View(customerId);

    // Cache for 5 minutes
    await redis.set(
      cacheKey,
      JSON.stringify(data),
      'EX',
      300
    );

    return data;
  }
);
```

### 2. Parallel Data Fetching
```typescript
// Fetch all data sources in parallel
const [customer, contacts, opportunities, interactions, documents] =
  await Promise.all([
    prisma.customer.findUnique({ where: { id: customerId }}),
    prisma.contact.findMany({ where: { customerId }}),
    prisma.opportunity.findMany({ where: { customerId }}),
    prisma.customerInteraction.findMany({ where: { customerId }}),
    prisma.document.findMany({ where: { customerId }})
  ]);
```

### 3. Lazy Loading Components
```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const OpportunityPipeline = dynamic(
  () => import('./OpportunityPipeline'),
  { loading: () => <div>Loading pipeline...</div> }
);

const CustomerTimeline = dynamic(
  () => import('./CustomerTimeline'),
  { loading: () => <div>Loading timeline...</div> }
);
```

### 4. Pagination for Large Datasets
```typescript
// Paginate timeline for better performance
export async function getCustomerTimeline(
  customerId: number,
  page: number = 1,
  pageSize: number = 20
) {
  const events = await buildCustomerTimeline(customerId);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    events: events.slice(start, end),
    total: events.length,
    page,
    pageSize,
    hasMore: end < events.length
  };
}
```

## 🧪 Testing

### Unit Tests
```typescript
import { getCustomer360View, calculateEngagementScore } from '@/lib/integrations/customer-360/service';

describe('Customer 360 Service', () => {
  it('should return complete customer view', async () => {
    const view = await getCustomer360View(1);

    expect(view.basicInfo).toBeDefined();
    expect(view.contacts).toBeInstanceOf(Array);
    expect(view.opportunities).toBeInstanceOf(Array);
    expect(view.summary).toBeDefined();
  });

  it('should calculate engagement score', () => {
    const interactions = [
      { createdAt: new Date(), type: 'call' },
      { createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), type: 'email' }
    ];

    const score = calculateEngagementScore(interactions);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
```

## 📊 Monitoring

### Key Metrics
- Customer 360 view generation time
- Data source response times
- Insight generation accuracy
- Cache hit rate
- API endpoint performance

### Example Monitoring
```typescript
import { metrics } from '@/lib/monitoring';

export async function getCustomer360View(customerId: number) {
  const startTime = Date.now();

  try {
    const view = await _getCustomer360View(customerId);

    metrics.recordCustomer360View({
      customerId,
      duration: Date.now() - startTime,
      dataSourcesCount: Object.keys(view).length,
      success: true
    });

    return view;
  } catch (error) {
    metrics.recordCustomer360View({
      customerId,
      duration: Date.now() - startTime,
      success: false,
      error: error.message
    });
    throw error;
  }
}
```

## 📚 Resources

- [Customer 360 Best Practices](https://www.salesforce.com/products/customer-360/)
- [Data Aggregation Patterns](https://martinfowler.com/eaaCatalog/dataMapper.html)

## 🔄 Version History

- **v1.0.0** - Initial extraction from AI Sales Enablement Platform
  - Multi-source data aggregation
  - Timeline visualization
  - AI-powered insights
  - Summary analytics
  - Real-time updates

---

Part of **AI Web App Template v5.0**
