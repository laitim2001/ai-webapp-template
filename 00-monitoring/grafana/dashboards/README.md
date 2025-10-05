# Grafana Dashboards

## Overview

This directory contains Grafana dashboard templates for monitoring your application. Dashboards are auto-loaded through Grafana's provisioning system.

## Dashboard Categories

### 1. System Overview Dashboard
**Purpose**: High-level system health and performance metrics

**Key Panels**:
- Request rate and error rate trends
- Response time percentiles (P50, P95, P99)
- Active users and session metrics
- System resource usage (CPU, memory, disk)
- Database connection pool status

**Recommended for**: Operations teams, daily monitoring

### 2. API Performance Dashboard
**Purpose**: Detailed API endpoint analysis

**Key Panels**:
- Request duration by endpoint
- Error breakdown by status code (4xx, 5xx)
- Request volume by route
- Slow query detection
- API availability SLA tracking

**Recommended for**: Backend developers, performance optimization

### 3. Business Metrics Dashboard
**Purpose**: Application-specific business KPIs

**Key Panels**:
- User registrations and login trends
- Feature usage patterns
- Cache hit rates
- AI service calls and token usage (if applicable)
- Custom business events

**Recommended for**: Product managers, business analytics

### 4. Resource Usage Dashboard
**Purpose**: Infrastructure and resource monitoring

**Key Panels**:
- CPU usage by service
- Memory allocation and garbage collection
- Disk I/O and space usage
- Network traffic
- Container/process health

**Recommended for**: DevOps teams, capacity planning

## Creating Custom Dashboards

### Method 1: Grafana UI (Recommended for Beginners)

1. **Access Grafana**:
   ```bash
   # Start monitoring stack
   docker-compose -f 00-monitoring/docker-compose.monitoring.yml up -d

   # Access Grafana at http://localhost:3001
   # Default credentials: admin / admin
   ```

2. **Create Dashboard**:
   - Click "+" → "Dashboard" → "Add visualization"
   - Select "Prometheus" datasource
   - Build your panel with PromQL queries
   - Save dashboard

3. **Export Dashboard**:
   - Click "Share" → "Export" → "Save to file"
   - Save JSON to `00-monitoring/grafana/dashboards/`
   - Dashboard will auto-load on next restart

### Method 2: JSON Templates (Advanced)

**Basic Dashboard Template**:
```json
{
  "dashboard": {
    "title": "My Custom Dashboard",
    "tags": ["{{PROJECT_NAME}}"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      }
    ]
  }
}
```

## Common PromQL Queries

### HTTP Metrics
```promql
# Request rate per second
rate(http_requests_total[5m])

# Error rate percentage
(sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))) * 100

# P95 response time
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))

# Requests by status code
sum by (status) (rate(http_requests_total[5m]))
```

### User Metrics
```promql
# User registrations per hour
increase(user_registrations_total[1h])

# Active user sessions
active_user_sessions

# Login success rate
rate(user_logins_total{status="success"}[5m]) / rate(user_logins_total[5m])
```

### Database Metrics
```promql
# Query duration P95
histogram_quantile(0.95, sum(rate(database_query_duration_seconds_bucket[5m])) by (le))

# Connection pool usage
database_connection_pool_active / database_connection_pool_max

# Slow queries (>1s)
sum(rate(database_query_duration_seconds_bucket{le="1"}[5m])) by (operation)
```

### Cache Metrics
```promql
# Cache hit rate percentage
(sum(rate(cache_hits_total[5m])) / sum(rate(cache_requests_total[5m]))) * 100

# Cache operations per second
rate(cache_requests_total[5m])
```

### Resource Metrics
```promql
# CPU usage percentage
(1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))) * 100

# Memory usage percentage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk usage percentage
(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100
```

## Dashboard Best Practices

### Design Principles
- **Top-to-Bottom**: Most critical metrics at top
- **Left-to-Right**: Overview → Details
- **Color Coding**: Green (good) → Yellow (warning) → Red (critical)
- **Time Range**: Default to last 1 hour, allow user override

### Panel Configuration
- **Use appropriate visualization**: Graph for time series, Stat for single values, Table for lists
- **Set thresholds**: Define warning/critical levels with color changes
- **Add descriptions**: Help text for complex metrics
- **Link panels**: Click metrics to drill into details

### Performance Optimization
- **Limit time range**: Shorter ranges = faster queries
- **Use recording rules**: Pre-compute expensive queries in Prometheus
- **Avoid wildcards**: Specific label matchers are faster
- **Set refresh interval**: Balance freshness vs load (30s - 5m)

## Alerting Integration

Dashboards can link to alerts defined in `prometheus/alerts.yml`:

```json
{
  "panels": [
    {
      "alert": {
        "name": "High Error Rate",
        "conditions": [
          {
            "evaluator": { "type": "gt", "params": [5] },
            "query": { "model": "A" }
          }
        ]
      }
    }
  ]
}
```

## Variables and Templating

Create dynamic dashboards with variables:

```json
{
  "templating": {
    "list": [
      {
        "name": "instance",
        "type": "query",
        "query": "label_values(up, instance)",
        "refresh": 1
      },
      {
        "name": "route",
        "type": "query",
        "query": "label_values(http_requests_total{instance=\"$instance\"}, route)"
      }
    ]
  }
}
```

Use in panels: `rate(http_requests_total{instance="$instance", route="$route"}[5m])`

## Troubleshooting

**Dashboard not loading**:
- Check `grafana/provisioning/dashboards/dashboards.yml` configuration
- Verify JSON syntax with `jq . dashboard.json`
- Check Grafana logs: `docker logs {{PROJECT_NAME}}-grafana`

**No data in panels**:
- Verify Prometheus datasource is connected
- Test query in Prometheus UI (http://localhost:9090)
- Check metric names match your application's exports
- Verify time range includes data points

**Slow dashboard**:
- Reduce query complexity
- Increase refresh interval
- Use Prometheus recording rules
- Limit time range to recent data

## Resources

- [Grafana Documentation](https://grafana.com/docs/grafana/latest/)
- [PromQL Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Dashboard Best Practices](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)
- [Community Dashboards](https://grafana.com/grafana/dashboards/)
