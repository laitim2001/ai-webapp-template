# Knowledge Base Module (module-knowledge-base)

Enterprise-grade knowledge management system with vector search, version control, and AI-powered semantic search for the AI Web App Template.

## 📋 Features

### 1. Version Control System
- **Complete Modification History** - Track all document changes
- **Version Snapshots** - Create point-in-time document snapshots
- **Version Comparison** - Compare and analyze differences between versions
- **Version Rollback** - Revert to any previous version
- **Major/Minor Versioning** - Classify version importance
- **Version Tagging** - Organize versions with custom tags
- **Change Field Tracking** - Track which fields changed in each version

### 2. Vector Search Engine
- **Multiple Similarity Algorithms**
  - Cosine Similarity
  - Euclidean Distance
  - Hybrid Search (70% cosine + 30% euclidean)
- **Intelligent Scoring**
  - Similarity weighting
  - Time decay factor
  - User preference boosting
- **PostgreSQL pgvector Support** - Native vector search with HNSW index
- **Automatic Fallback** - JSON vector search for non-PostgreSQL databases
- **Chunk Search** - Find best matching chunks in long documents

### 3. AI Embedding Integration
- **Multiple Embedding Providers**
  - OpenAI embeddings API
  - Azure OpenAI Service
  - Custom embedding service (extensible)
- **Batch Processing** - Efficient multi-document embedding
- **Long Document Handling** - Smart text chunking with overlap
- **Similarity Calculation** - Cosine similarity for semantic matching

### 4. Database Adapter Pattern
- **Multi-Database Support** - PostgreSQL, MySQL, MongoDB, SQLite
- **Database-Specific Optimizations** - pgvector for PostgreSQL, JSON for others
- **Unified API** - Same code works across all databases

## 📁 Module Structure

```
02-modules/module-knowledge-base/
├── lib/
│   ├── knowledge/
│   │   └── version-control.ts.template       # Version control system
│   │
│   ├── search/
│   │   ├── vector-search.ts.template         # Generic vector search engine
│   │   └── pgvector-search.ts.template       # PostgreSQL pgvector search
│   │
│   └── ai/
│       └── embeddings.ts.template            # AI embedding service
│
└── README.md                                 # This file
```

## 🔧 Installation

### Step 1: Module Selection

During project initialization (`node init-project.js`), select the Knowledge Base module when prompted.

### Step 2: Environment Variables

Add to `.env.local`:

```bash
# AI Embedding Service (Required for vector search)
EMBEDDING_SERVICE=openai  # openai | azure | custom
OPENAI_API_KEY={{YOUR_OPENAI_API_KEY}}  # For OpenAI provider

# OR for Azure OpenAI
# EMBEDDING_SERVICE=azure
# AZURE_OPENAI_ENDPOINT={{YOUR_AZURE_ENDPOINT}}
# AZURE_OPENAI_API_KEY={{YOUR_AZURE_API_KEY}}
# AZURE_OPENAI_EMBEDDING_DEPLOYMENT={{DEPLOYMENT_NAME}}
# EMBEDDING_MODEL=text-embedding-ada-002

# Vector Search Configuration
VECTOR_SEARCH_TYPE=hybrid  # cosine | euclidean | hybrid
VECTOR_SIMILARITY_THRESHOLD=0.7
VECTOR_SEARCH_LIMIT=10
ENABLE_PGVECTOR=true  # PostgreSQL only, set to false for other databases

# Version Control
ENABLE_VERSION_CONTROL=true
MAX_VERSION_HISTORY=100  # Maximum versions to keep per document
```

### Step 3: Database Schema

The Knowledge Base module requires these tables (automatically created during init):

**PostgreSQL** (`schema.postgresql.prisma`):
- `KnowledgeBase` - Main knowledge documents
- `KnowledgeChunk` - Document chunks with vector embeddings
- `KnowledgeVersion` - Version history
- `KnowledgeTag` - Tags for categorization
- **pgvector extension** - Install with `CREATE EXTENSION vector;`

**MySQL/MongoDB/SQLite**:
- Same tables as PostgreSQL
- **No pgvector** - Uses JSON column for vector storage with fallback search

### Step 4: Install Dependencies

```bash
npm install
```

No additional dependencies required - uses base template dependencies.

## 📖 Usage

### Version Control

#### Create Version Snapshot

```typescript
import { KnowledgeVersionControl } from '@/lib/knowledge/version-control';

const versionControl = new KnowledgeVersionControl();

// Create version when document is updated
const version = await versionControl.createVersion(
  knowledgeBaseId,
  userId,
  'Updated product information',
  {
    isMajor: true,
    tags: ['product-update', 'q1-2025']
  }
);
```

#### Compare Versions

```typescript
const diff = await versionControl.compareVersions(
  versionId1,
  versionId2
);

console.log(diff);
// [
//   {
//     field: 'title',
//     oldValue: 'Old Title',
//     newValue: 'New Title',
//     changeType: 'modified'
//   },
//   ...
// ]
```

#### Revert to Previous Version

```typescript
const restoredDocument = await versionControl.revertToVersion(
  knowledgeBaseId,
  targetVersionId,
  userId
);
```

#### Get Version History

```typescript
const history = await versionControl.getVersionHistory(
  knowledgeBaseId,
  50,  // limit
  0    // offset
);

history.forEach(version => {
  console.log(`v${version.version}: ${version.change_summary}`);
  console.log(`By: ${version.creatorName}`);
  if (version.diffFromParent) {
    console.log(`Changes:`, version.diffFromParent);
  }
});
```

### Vector Search

#### Basic Vector Search

```typescript
import { vectorSearchEngine } from '@/lib/search/vector-search';

const result = await vectorSearchEngine.search({
  query: 'How do I reset my password?',
  limit: 10,
  threshold: 0.7,
  searchType: 'hybrid'
});

console.log(`Found ${result.results.length} documents`);
result.results.forEach(doc => {
  console.log(`- ${doc.title} (similarity: ${doc.similarity})`);
});
```

#### Advanced Search with Filters

```typescript
const result = await vectorSearchEngine.search({
  query: 'product documentation',
  limit: 20,
  threshold: 0.75,
  searchType: 'cosine',
  category: 'PRODUCT',
  tags: ['documentation', 'tutorial'],
  timeDecay: true,
  userPreferences: {
    preferredCategories: ['PRODUCT', 'TUTORIAL'],
    recentActivityWeight: 0.3
  }
});
```

#### PostgreSQL pgvector Search

```typescript
import { pgVectorSearchService } from '@/lib/search/pgvector-search';

// Only works with PostgreSQL database
const result = await pgVectorSearchService.search({
  query: 'customer support best practices',
  limit: 10,
  threshold: 0.8,
  distanceMetric: 'cosine',
  category: 'SUPPORT'
});

console.log(`Index used: ${result.metadata.indexUsed}`);
console.log(`Query time: ${result.metadata.queryTime}ms`);
```

#### Hybrid Search (Vector + Text)

```typescript
const result = await pgVectorSearchService.hybridSearch({
  query: 'troubleshooting network issues',
  limit: 15,
  vectorWeight: 0.7,  // 70% semantic search
  textWeight: 0.3     // 30% keyword matching
});
```

### AI Embeddings

#### Generate Single Embedding

```typescript
import { generateEmbedding } from '@/lib/ai/embeddings';

const result = await generateEmbedding('This is a test document');
console.log(`Vector dimension: ${result.embedding.length}`); // 1536
console.log(`Tokens used: ${result.tokenCount}`);
```

#### Batch Embeddings

```typescript
import { generateBatchEmbeddings } from '@/lib/ai/embeddings';

const texts = [
  'Document 1 content',
  'Document 2 content',
  'Document 3 content'
];

const result = await generateBatchEmbeddings(texts, {
  batchSize: 10,
  parallel: false  // Avoid rate limits
});

console.log(`Total tokens: ${result.totalTokens}`);
console.log(`Processing time: ${result.processingTime}ms`);
```

#### Long Document Processing

```typescript
import { generateDocumentEmbeddings } from '@/lib/ai/embeddings';

const longDocument = '... very long document text ...';

const result = await generateDocumentEmbeddings(longDocument, {
  chunkSize: 1000,
  overlapSize: 100,
  batchSize: 5,
  includeMetadata: true
});

console.log(`Document split into ${result.totalChunks} chunks`);
result.embeddings.forEach(chunk => {
  console.log(`Chunk ${chunk.chunkIndex}: ${chunk.text.substring(0, 50)}...`);
});
```

### Similarity Calculation

```typescript
import { calculateCosineSimilarity } from '@/lib/ai/embeddings';

const query = await generateEmbedding('search query');
const doc = await generateEmbedding('document content');

const similarity = calculateCosineSimilarity(
  query.embedding,
  doc.embedding
);

if (similarity > 0.8) {
  console.log('Highly relevant');
} else if (similarity > 0.5) {
  console.log('Moderately relevant');
} else {
  console.log('Low relevance');
}
```

## 🗄️ Database Adapter Integration

This module uses the **database adapter pattern** for multi-database support:

```typescript
import { databaseAdapter } from '@/lib/db/database-adapter';

// Find knowledge base document
const document = await databaseAdapter.findUnique('knowledgeBase', {
  where: { id: documentId }
});

// Create version
const version = await databaseAdapter.create('knowledgeVersion', {
  data: {
    knowledge_base_id: documentId,
    version: versionNumber,
    title: document.title,
    content: document.content
  }
});

// Search chunks
const chunks = await databaseAdapter.findMany('knowledgeChunk', {
  where: {
    knowledge_base_id: documentId,
    vector_embedding: { not: null }
  },
  include: {
    knowledge_base: true
  }
});
```

**Supported Databases**:
- PostgreSQL (with pgvector extension for optimal performance)
- MySQL (JSON vector storage)
- MongoDB (native JSON support)
- SQLite (development only)

## 🔧 Auxiliary Features

### Full-Text Search Enhancement

PostgreSQL full-text search with Chinese word segmentation support:

```typescript
import { FullTextSearch } from '@/lib/knowledge/full-text-search';

// Build search query
const whereClause = FullTextSearch.buildFullTextWhere(
  'search query',
  ['title', 'content']
);

// Highlight matches
const highlighted = FullTextSearch.highlightMatches(
  content,
  'search query',
  { highlightOptions: { startSel: '<mark>', stopSel: '</mark>' } }
);

// Generate snippet
const snippet = FullTextSearch.generateSnippet(content, 'search query');
```

### Search History Management

Client-side search history with intelligent suggestions:

```typescript
import { SearchHistoryManager } from '@/lib/knowledge/search-history-manager';

// Add search history
SearchHistoryManager.addHistory({
  query: 'product documentation',
  type: 'semantic',
  results_count: 15,
  clicked_result_ids: [1, 5, 8]
});

// Get intelligent suggestions
const suggestions = SearchHistoryManager.getSuggestions('product', 10);

// Get statistics
const stats = SearchHistoryManager.getStatistics();
console.log(`Total searches: ${stats.total_searches}`);
```

### Analytics Service

Comprehensive knowledge base analytics and statistics:

```typescript
import { knowledgeAnalyticsService, TimeRange } from '@/lib/knowledge/analytics-service';

// Get overview statistics
const overview = await knowledgeAnalyticsService.getOverview(TimeRange.MONTH);
console.log(`Total views: ${overview.totalViews}`);
console.log(`Growth: ${overview.viewsGrowth}%`);

// Get top viewed documents
const topDocs = await knowledgeAnalyticsService.getTopViewedDocuments(10);

// Get category distribution
const categoryDist = await knowledgeAnalyticsService.getCategoryDistribution();

// Get user activity
const userActivity = await knowledgeAnalyticsService.getUserActivity(10);
```

### Vector Cache Service

Dual-layer cache (Memory + Redis) for vector embeddings:

```typescript
import { getVectorCache } from '@/lib/cache/vector-cache';

const cache = getVectorCache({
  redis: {
    host: 'localhost',
    port: 6379
  },
  memory: {
    maxSize: 1000,
    ttl: 3600  // 1 hour
  },
  compression: {
    enabled: true,
    threshold: 1024  // 1KB
  }
});

// Get cached embedding
const cached = await cache.get('some text', 'text-embedding-ada-002');

// Set embedding to cache
await cache.set('some text', [0.1, 0.2, ...], {}, { ttl: 7200 });

// Batch operations
const batchResult = await cache.batchGet(['text1', 'text2', 'text3']);

// Get cache statistics
const stats = cache.getStats();
console.log(`Hit rate: ${(stats.hits / (stats.hits + stats.misses) * 100).toFixed(2)}%`);
```

## 🔍 Performance Optimization

### PostgreSQL with pgvector

**Best Performance** - Native vector operations with HNSW index:

```sql
-- Create pgvector extension
CREATE EXTENSION vector;

-- Create HNSW index
CREATE INDEX idx_chunks_vector_hnsw_cosine
ON knowledge_chunks
USING hnsw (vector_embedding_pgvector vector_cosine_ops);
```

**Query Performance**:
- < 100ms for million-scale data
- 95%+ accuracy with HNSW index
- Supports 1000+ QPS concurrent queries

### Other Databases

**Automatic Fallback** - JSON vector storage with similarity calculation:

- Vector stored as JSON array
- Similarity calculated in application layer
- Performance: ~500ms for 100K documents
- Suitable for small to medium datasets

### Caching Strategy

Dual-layer vector cache for maximum performance:

```typescript
import { getVectorCache } from '@/lib/cache/vector-cache';

const cache = getVectorCache();

// Automatic caching with get/set
const cached = await cache.get(text, model);
if (!cached) {
  const embedding = await generateEmbedding(text);
  await cache.set(text, embedding.embedding, {}, { model });
}
```

## 🚀 Production Deployment

### Environment Checklist

- [ ] Set `EMBEDDING_SERVICE` and API keys
- [ ] Configure PostgreSQL with pgvector extension (recommended)
- [ ] Set appropriate `VECTOR_SIMILARITY_THRESHOLD`
- [ ] Enable `ENABLE_VERSION_CONTROL` if needed
- [ ] Configure `MAX_VERSION_HISTORY` to manage storage
- [ ] Set up monitoring for embedding API usage

### Database Indexing

Ensure indexes on:
- `KnowledgeBase.id` (primary key, unique)
- `KnowledgeBase.created_by`
- `KnowledgeBase.category`
- `KnowledgeChunk.knowledge_base_id`
- `KnowledgeChunk.vector_embedding_pgvector` (HNSW index for PostgreSQL)
- `KnowledgeVersion.knowledge_base_id`
- `KnowledgeVersion.created_by`

### Embedding API Cost Management

**OpenAI Pricing** (text-embedding-ada-002):
- ~$0.0001 per 1K tokens
- Average document: 500 tokens = $0.00005
- 1M documents: ~$50

**Cost Optimization**:
- Cache embeddings in database
- Batch process documents
- Use incremental updates only

## 📊 API Reference

### Core Files
- `lib/knowledge/version-control.ts.template` - Version control system API
- `lib/search/vector-search.ts.template` - Multi-database vector search API
- `lib/search/pgvector-search.ts.template` - PostgreSQL pgvector-specific API
- `lib/ai/embeddings.ts.template` - Multi-provider AI embedding API

### Auxiliary Files
- `lib/knowledge/full-text-search.ts.template` - PostgreSQL full-text search utilities
- `lib/knowledge/search-history-manager.ts.template` - Client-side search history management
- `lib/knowledge/analytics-service.ts.template` - Knowledge base analytics and statistics
- `lib/cache/vector-cache.ts.template` - Dual-layer vector embedding cache

## 🧪 Testing

### Manual Testing

1. **Create Document with Embedding**:
```typescript
const embedding = await generateEmbedding(documentContent);
const document = await databaseAdapter.create('knowledgeBase', {
  data: {
    title: 'Test Document',
    content: documentContent,
    created_by: userId
  }
});

const chunk = await databaseAdapter.create('knowledgeChunk', {
  data: {
    knowledge_base_id: document.id,
    content: documentContent,
    chunk_index: 0,
    vector_embedding: JSON.stringify(embedding.embedding)
  }
});
```

2. **Search Test**:
```typescript
const results = await vectorSearchEngine.search({
  query: 'test query',
  limit: 5
});
console.log(results);
```

3. **Version Control Test**:
```typescript
const versionControl = new KnowledgeVersionControl();
const version = await versionControl.createVersion(documentId, userId, 'Initial version');
console.log(version);
```

## 📝 Changelog

- **v5.0** (2025-10-05): Initial extraction from AI Sales Enablement Platform

  **Core Features** (Day 9):
  - Version control system with snapshots, comparison, and rollback (530 lines)
  - Multi-algorithm vector search: cosine, euclidean, hybrid (704 lines)
  - PostgreSQL pgvector support with automatic fallback (729 lines)
  - Multi-provider AI embedding service: OpenAI, Azure, custom (490 lines)
  - Multi-database support via adapter pattern

  **Auxiliary Features** (Day 10):
  - Full-text search enhancement with Chinese word segmentation (462 lines)
  - Search history manager with intelligent suggestions (513 lines)
  - Analytics service with comprehensive statistics (723 lines)
  - Vector cache service with dual-layer architecture (642 lines)

  **Total**: 8 files, 4,793 lines of production-ready code

## 🤝 Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/laitim2001/ai-webapp-template/issues
- Documentation: See `/docs` directory in main project

## 📄 License

Part of AI Web App Template v5.0
