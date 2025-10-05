# 🔭 Enterprise Monitoring System

**Version**: 1.0
**Status**: ✅ Production-Ready
**Architecture**: OpenTelemetry + Prometheus + Grafana + Jaeger

---

## 📋 Overview

Complete monitoring solution with vendor-neutral OpenTelemetry API, supporting multiple backends:

- **✅ Prometheus** - Self-hosted metrics (recommended for production)
- **✅ Azure Monitor** - Cloud-hosted, zero maintenance
- **✅ Jaeger** - Distributed tracing
- **✅ Console** - Development debugging

**Key Features**:
- 🔄 **Switch backends in 5-10 minutes** via environment variables
- 📊 **Pre-configured Grafana dashboards** for system, API, and business metrics
- ⚡ **13 alert rules** across P1-P4 severity levels (Critical to Low priority)
- 🚀 **Zero-code instrumentation** for HTTP, Express, and PostgreSQL
- 📦 **One-command deployment** with Docker Compose
- 📧 **Multi-channel alerting** with email, Slack, and Teams support

---

## 🚀 Quick Start

### 1. Environment Configuration

Create `.env.local` (or add to existing):

```bash
# Monitoring Configuration
MONITORING_BACKEND=prometheus  # Options: prometheus | azure | jaeger | console
SERVICE_NAME={{SERVICE_NAME}}
PROMETHEUS_PORT=9464

# Optional: Azure Monitor
# APPLICATIONINSIGHTS_CONNECTION_STRING=your-connection-string
# AZURE_SAMPLING_RATE=1.0
# AZURE_LIVE_METRICS=true
```

### 2. Start Monitoring Stack

```bash
# Start Prometheus + Grafana + Jaeger
docker-compose -f docker-compose.monitoring.yml up -d

# Verify services are running
docker-compose -f docker-compose.monitoring.yml ps

# View logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

### 3. Access Dashboards

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| **Grafana** | http://localhost:3001 | admin / admin |
| **Prometheus** | http://localhost:9090 | N/A |
| **Jaeger UI** | http://localhost:16686 | N/A |
| **App Metrics** | http://localhost:9464/metrics | N/A |

### 4. Initialize in Your App

```typescript
// app/layout.tsx or instrumentation.ts
import { startTelemetry } from '@/lib/monitoring/backend-factory';
import { initializeTelemetry } from '@/lib/monitoring/telemetry';

export async function register() {
  // Start OpenTelemetry SDK
  await startTelemetry();

  // Initialize business metrics
  initializeTelemetry('{{SERVICE_NAME}}');
}
```

---

## 📊 Available Metrics

### HTTP Metrics
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration histogram
- `http_request_size_bytes` - Request payload size
- `http_response_size_bytes` - Response payload size

### User Metrics
- `user_registrations_total` - User registration events
- `user_logins_total` - User login attempts
- `user_activity_total` - User activity events
- `active_user_sessions` - Current active sessions

### Database Metrics
- `database_query_duration_seconds` - Query execution time histogram
- `database_connection_pool_active` - Active connections gauge
- `database_connection_pool_max` - Maximum connections
- `database_connection_errors_total` - Connection failures

### Cache Metrics
- `cache_hits_total` - Cache hit count
- `cache_requests_total` - Total cache requests
- Cache hit rate = `cache_hits / cache_requests`

### Feature Usage
- `feature_usage_total` - Feature usage tracking

### AI Service Metrics (Optional)
- `ai_service_calls_total` - AI API call count
- `ai_service_response_time_seconds` - AI response duration
- `ai_tokens_used_total` - Token consumption tracking

---

## 💡 Usage Examples

### Track User Registration

```typescript
import { BusinessMetrics } from '@/lib/monitoring/telemetry';

await BusinessMetrics.trackUserRegistration(userId, {
  source: 'web',
  plan: 'free'
});
```

### Track HTTP Request (Automatic via Middleware)

```typescript
// Automatically tracked by OpenTelemetry HTTP instrumentation
// No code changes needed
```

### Track Custom Event

```typescript
import { trackEvent } from '@/lib/monitoring/telemetry';

await trackEvent('OrderCompleted', {
  orderId: '12345',
  amount: 99.99,
  currency: 'USD'
});
```

### Track Database Query

```typescript
import { BusinessMetrics } from '@/lib/monitoring/telemetry';

const startTime = Date.now();
await prisma.user.findMany();
const duration = (Date.now() - startTime) / 1000;

BusinessMetrics.trackDatabaseQuery('findMany', duration, { model: 'User' });
```

---

## 🔄 Switching Monitoring Backends

### Switch to Azure Monitor

```bash
# .env.local
MONITORING_BACKEND=azure
APPLICATIONINSIGHTS_CONNECTION_STRING=your-connection-string
AZURE_SAMPLING_RATE=1.0  # 100% sampling
```

Restart your application. **No code changes required.**

### Switch to Console (Development)

```bash
# .env.local
MONITORING_BACKEND=console
CONSOLE_TELEMETRY=true
```

Telemetry will be printed to console every minute.

---

## 📦 Package Dependencies

Add to your `package.json`:

```json
{
  "dependencies": {
    "@opentelemetry/api": "^1.4.0",
    "@opentelemetry/sdk-node": "^0.41.0",
    "@opentelemetry/resources": "^1.15.0",
    "@opentelemetry/semantic-conventions": "^1.15.0",
    "@opentelemetry/exporter-prometheus": "^0.41.0",
    "@opentelemetry/instrumentation-http": "^0.41.0",
    "@opentelemetry/instrumentation-express": "^0.33.0",
    "@opentelemetry/instrumentation-pg": "^0.36.0",
    "@azure/monitor-opentelemetry-exporter": "^1.0.0",
    "@opentelemetry/exporter-jaeger": "^1.15.0"
  }
}
```

---

## 🛠️ Maintenance

### Stop Monitoring Stack

```bash
docker-compose -f docker-compose.monitoring.yml down
```

### Stop and Remove Data

```bash
docker-compose -f docker-compose.monitoring.yml down -v
```

### Restart Services

```bash
docker-compose -f docker-compose.monitoring.yml restart
```

### View Service Logs

```bash
# All services
docker-compose -f docker-compose.monitoring.yml logs -f

# Specific service
docker-compose -f docker-compose.monitoring.yml logs -f prometheus
```

---

## 📁 File Structure

```
00-monitoring/
├── lib/
│   ├── config.ts.template              # Configuration management (4 backends)
│   ├── telemetry.ts.template           # OpenTelemetry abstraction + business metrics
│   └── backend-factory.ts.template     # Backend factory (Prometheus/Azure/Jaeger/Console)
├── prometheus/
│   ├── prometheus.yml.template         # Prometheus scrape configuration
│   └── alerts.yml.template             # Alert rules (13 rules, P1-P4 severity)
├── alertmanager/
│   └── alertmanager.yml.template       # Multi-channel alert routing
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── prometheus.yml          # Auto-provision Prometheus + Jaeger datasources
│   │   └── dashboards/
│   │       └── dashboards.yml          # Dashboard auto-loading config
│   └── dashboards/
│       └── README.md                   # Dashboard guide + PromQL examples
├── docker-compose.monitoring.yml.template  # Complete monitoring stack
└── README.md                           # This file
```

---

## 🚨 Alert System

### Alert Severity Levels

**P1 - Critical** (Immediate Response Required):
- `APICompletelyDown` - API service unavailable for >1 minute
- `HighErrorRate` - 5xx error rate >10% for 2 minutes
- `DatabaseConnectionFailure` - DB connection errors detected
- `CriticalMemoryUsage` - Memory usage >95% for 5 minutes

**P2 - High** (Handle Within 1 Hour):
- `SlowAPIResponse` - P95 response time >2s for 5 minutes
- `ElevatedErrorRate` - 5xx error rate >5% for 5 minutes
- `SlowDatabaseQueries` - P95 query time >1s for 5 minutes
- `HighCPUUsage` - CPU usage >85% for 10 minutes

**P3 - Medium** (Handle Same Day):
- `Elevated4xxErrorRate` - Client errors >10% for 10 minutes
- `HighMemoryUsage` - Memory usage >80% for 15 minutes
- `HighDiskUsage` - Disk usage >80% for 15 minutes

**P4 - Low** (Handle Within Week):
- `LowAPITraffic` - Request rate <1 req/s for 30 minutes
- `LowCacheHitRate` - Cache hit rate <70% for 30 minutes
- `NoRecentDeployment` - No deployment for >7 days

### Alert Configuration

**Email Alerts** (configured in `alertmanager/alertmanager.yml.template`):
```yaml
# Set these environment variables:
SMTP_HOST=smtp.gmail.com:587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ALERT_EMAIL_TO=dev-team@example.com
ALERT_EMAIL_ONCALL=oncall@example.com  # For P1 alerts
```

**Slack Integration** (optional):
1. Create Slack Incoming Webhook: https://api.slack.com/messaging/webhooks
2. Uncomment Slack config in `alertmanager.yml.template`
3. Set `SLACK_WEBHOOK_URL` environment variable

**Teams Integration** (optional):
1. Create Teams Incoming Webhook in channel settings
2. Uncomment Teams config in `alertmanager.yml.template`
3. Set `TEAMS_WEBHOOK_URL` environment variable

### Testing Alerts

```bash
# Trigger test alert
curl -X POST http://localhost:9093/api/v1/alerts -d '[{
  "labels": {
    "alertname": "TestAlert",
    "severity": "P2"
  },
  "annotations": {
    "summary": "Test alert from CLI"
  }
}]'

# Check alert status
curl http://localhost:9093/api/v1/alerts
```

---

## ⚙️ Advanced Configuration

### Custom Metrics

```typescript
import { trackMetric } from '@/lib/monitoring/telemetry';

trackMetric('custom_metric_name', 100, {
  label1: 'value1',
  label2: 'value2'
});
```

### Distributed Tracing

```typescript
import { withSpan } from '@/lib/monitoring/telemetry';

await withSpan('ProcessOrder', async (span) => {
  span.setAttribute('orderId', orderId);

  // Your code here
  const result = await processOrder(orderId);

  span.setAttribute('amount', result.amount);
  return result;
}, { customer: customerId });
```

---

## 🔗 Resources

- **OpenTelemetry**: https://opentelemetry.io/
- **Prometheus**: https://prometheus.io/
- **Grafana**: https://grafana.com/
- **Jaeger**: https://www.jaegertracing.io/
- **Azure Monitor**: https://learn.microsoft.com/azure/azure-monitor/

---

## 🆘 Troubleshooting

### Metrics Not Showing in Prometheus

1. Check app is exposing metrics: `curl http://localhost:9464/metrics`
2. Check Prometheus targets: http://localhost:9090/targets
3. Verify `host.docker.internal` resolves (Windows/Mac Docker Desktop)

### Grafana Dashboards Not Loading

1. Check dashboard files exist in `monitoring/grafana/dashboards/`
2. Verify provisioning config in `monitoring/grafana/provisioning/`
3. Restart Grafana: `docker-compose -f docker-compose.monitoring.yml restart grafana`

### OpenTelemetry SDK Errors

1. Ensure all dependencies are installed: `npm install`
2. Check environment variables in `.env.local`
3. Verify backend configuration in `lib/monitoring/config.ts`

---

**For detailed operations guide, see `/docs/monitoring-operations-manual.md`**
