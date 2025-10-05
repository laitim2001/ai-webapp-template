# Search Module (module-search)

**Status**: 🚧 Partial Extraction - Core Query Processing Only

## ⚠️ Important Notice

This module contains **partial extraction** from the source project's search functionality. Due to the complexity and business-specific nature of the full search system, we've extracted only the most reusable and generic components.

### What's Included

**Core Query Processing**:
- ✅ `query-processor.ts` - Intelligent query parsing, intent detection, and keyword extraction (~700 lines)

### What's NOT Included (Requires Custom Implementation)

The following components from the source project are **NOT extracted** because they contain heavy business logic or dependencies that require significant customization:

1. **semantic-query-processor.ts** (~930 lines)
   - Reason: Heavily coupled with GPT-4 and sales/CRM-specific business logic
   - Recommendation: Implement your own semantic processing based on your business needs

2. **contextual-result-enhancer.ts** (~1,430 lines)
   - Reason: Sales scenario-specific result enhancement logic
   - Recommendation: Build custom enhancers for your domain

3. **search-analytics.ts** (~1,110 lines)
   - Reason: Sales-specific KPIs and business metrics
   - Note: Similar functionality available in `module-knowledge-base/lib/knowledge/analytics-service.ts`

4. **result-ranker.ts** (~530 lines)
   - Reason: Complex ranking algorithms with business-specific weights
   - Recommendation: Implement domain-specific ranking based on your priorities

5. **search-suggestions.ts** (~960 lines)
   - Reason: Tightly integrated with search history and user behavior analytics
   - Note: Basic suggestion functionality available in `module-knowledge-base/lib/knowledge/search-history-manager.ts`

6. **crm-search-adapter.ts** (~1,010 lines)
   - Reason: Dynamics 365 CRM-specific integration
   - Recommendation: Create your own external data source adapters as needed

## 📁 Module Structure

```
02-modules/module-search/
├── lib/
│   └── search/
│       └── query-processor.ts.template     # Intelligent query processing
│
└── README.md                                # This file
```

## 🔧 Installation

### During Project Initialization

Select the Search module when prompted by `node init-project.js`.

### Manual Installation

Copy files from this module to your project:
```bash
cp 02-modules/module-search/lib/search/* your-project/lib/search/
```

## 📖 Usage

### Query Processing

```typescript
import { QueryProcessor, parseQuery } from '@/lib/search/query-processor';

// Parse natural language query
const result = await parseQuery('如何配置 API 認證');

console.log(result.cleanedQuery);  // Normalized query
console.log(result.keywords);       // ['配置', 'API', '認證']
console.log(result.intent);         // 'how_to_guide'
console.log(result.confidence);     // 0.9
console.log(result.language);       // 'zh-TW' or 'mixed'
console.log(result.suggestions);    // Alternative query suggestions
```

### Intent Detection

```typescript
import { detectQueryIntent } from '@/lib/search/query-processor';

const intent = await detectQueryIntent('最新 API 文檔');
// Returns: 'latest_updates'

// Supported intents:
// - 'specific_document' - Looking for specific doc
// - 'category_browse' - Browsing by category
// - 'concept_learning' - Learning concepts
// - 'how_to_guide' - How-to instructions
// - 'troubleshooting' - Problem solving
// - 'comparison' - Comparing options
// - 'latest_updates' - Recent changes
// - 'general_search' - General search
```

### Query Expansion

```typescript
import { expandQuery } from '@/lib/search/query-processor';

const expansions = await expandQuery('數據庫配置');
// Returns: [
//   '數據庫配置',
//   '資料庫配置',     // Synonym
//   'database配置',   // Related term
//   '數據庫設置',     // Synonym variation
//   ...
// ]
```

### Keyword Extraction

```typescript
import { extractQueryKeywords } from '@/lib/search/query-processor';

const keywords = await extractQueryKeywords('如何安裝 Docker 容器');
// Returns: ['安裝', 'Docker', '容器']
```

## 🎯 Features

### Query Parsing
- **Language Detection**: Auto-detect zh-TW, zh-CN, en, or mixed
- **Query Cleaning**: Normalize whitespace, remove special characters
- **Keyword Extraction**: Multi-level keyword classification
  - Primary keywords
  - Secondary keywords
  - Technical terms
  - Entity words
  - Modifiers

### Intent Recognition
- Pattern-based intent detection
- Confidence scoring
- 8 predefined intent types
- Extensible for custom intents

### Entity Extraction
- Date/time expressions
- Product/technology names
- Process/action words
- Automatic filter generation

### Query Enhancement
- **Spell checking**: Common error corrections
- **Synonym expansion**: Built-in synonym dictionary
- **Related terms**: Technical term relationships
- **Query suggestions**: Automatic query improvements

### Filtering
- **Category filters**: Auto-extracted from query
- **Date range filters**: Natural language date parsing
- **File type filters**: Extension-based filtering

## 🔑 Key Components

### QueryProcessor Class

Main class for intelligent query processing.

**Methods**:
- `parseQuery(query: string)` - Full query analysis pipeline
- `expandQuery(query: string)` - Generate query expansions
- `detectQueryIntent(query: string)` - Detect search intent
- `extractQueryKeywords(query: string)` - Extract keywords

**Configuration**:
- Stop words (Chinese + English)
- Synonym dictionary
- Technical terms database
- Category keyword mappings

### Data Structures

**ParsedQuery**:
```typescript
{
  originalQuery: string;
  cleanedQuery: string;
  keywords: string[];
  entities: QueryEntity[];
  intent: SearchIntent;
  confidence: number;
  language: 'zh-TW' | 'zh-CN' | 'en' | 'mixed';
  suggestions: QuerySuggestion[];
  filters: QueryFilters;
}
```

**QueryEntity**:
```typescript
{
  text: string;
  type: 'product' | 'category' | 'author' | 'date' | 'technology' | 'process';
  confidence: number;
  start: number;
  end: number;
}
```

## 🚀 Integration with Other Modules

This module works well with:

- **module-knowledge-base**: Use parsed queries for vector search
  ```typescript
  const parsed = await parseQuery(userQuery);
  const results = await vectorSearchEngine.search({
    query: parsed.cleanedQuery,
    ...parsed.filters
  });
  ```

- **module-knowledge-base/search-history-manager**: Combine with client-side history
  ```typescript
  const suggestions = SearchHistoryManager.getSuggestions(query);
  const parsed = await parseQuery(query);
  // Merge suggestions
  ```

## 🔧 Customization

### Adding Custom Intents

```typescript
// Extend SearchIntent type
type CustomSearchIntent = SearchIntent | 'custom_intent';

// Add to intent patterns in query-processor.ts
```

### Custom Synonym Dictionary

```typescript
// In initializeSynonyms()
this.synonyms.set('your_term', ['synonym1', 'synonym2']);
```

### Custom Technical Terms

```typescript
// In initializeTechnicalTerms()
this.technicalTerms.add('YOUR_TECH_TERM');
```

## 📝 Recommendations for Full Search System

To build a complete search system for your application, consider implementing:

1. **Semantic Query Processing**
   - Integrate with your LLM provider (OpenAI, Azure OpenAI, etc.)
   - Define domain-specific prompts for your business
   - Implement entity relationship extraction for your domain

2. **Result Ranking**
   - Define ranking factors relevant to your use case
   - Implement scoring algorithms based on:
     - Relevance score
     - Recency/freshness
     - User preferences
     - Content quality
     - Click-through rate

3. **Search Analytics**
   - Track search queries and results
   - Monitor zero-result queries
   - Analyze search patterns
   - A/B test ranking algorithms

4. **Contextual Enhancement**
   - Implement result highlighting for your content
   - Generate summaries/snippets
   - Add related content suggestions
   - Provide contextual recommendations

5. **Advanced Suggestions**
   - Auto-complete based on user input
   - Spell checking with domain-specific dictionary
   - Popular searches tracking
   - Personalized suggestions

## 📊 Integration Example

Complete search flow combining multiple modules:

```typescript
import { parseQuery } from '@/lib/search/query-processor';
import { vectorSearchEngine } from '@/lib/search/vector-search';
import { SearchHistoryManager } from '@/lib/knowledge/search-history-manager';

async function performSearch(userQuery: string, userId: number) {
  // 1. Parse query
  const parsed = await parseQuery(userQuery);

  // 2. Search with vector engine
  const results = await vectorSearchEngine.search({
    query: parsed.cleanedQuery,
    limit: 20,
    filters: parsed.filters
  });

  // 3. Record search history
  SearchHistoryManager.addHistory({
    query: userQuery,
    type: 'semantic',
    results_count: results.results.length,
    clicked_result_ids: []
  });

  // 4. Return enhanced results
  return {
    query: parsed,
    results: results.results,
    suggestions: parsed.suggestions,
    intent: parsed.intent
  };
}
```

## 📝 Changelog

- **v5.0** (2025-10-05): Initial partial extraction
  - Core query processor with intent detection
  - Multi-language support (zh-TW, zh-CN, en, mixed)
  - Keyword extraction and entity recognition
  - Query expansion and suggestions
  - Filter extraction from natural language

## 🤝 Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/laitim2001/ai-webapp-template/issues
- Documentation: See `/docs` directory in main project

## 📄 License

Part of AI Web App Template v5.0
