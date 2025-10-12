# AI Integration Module (module-ai-integration)

Complete Azure OpenAI integration module with chat, embeddings, and content generation capabilities.

## 📋 Features

### 1. Azure OpenAI Core Infrastructure
- **Client Management**: Automatic Azure OpenAI client initialization and configuration
- **Error Handling**: Comprehensive error handling with custom `AzureOpenAIError` class
- **Retry Logic**: Automatic retry with exponential backoff for transient failures
- **Rate Limiting**: Built-in rate limiting to prevent API quota exhaustion
- **Health Monitoring**: Service health checks and status validation

### 2. Text Embeddings (Vector Generation)
- **Single Embedding**: Generate embeddings for individual texts
- **Batch Embeddings**: Process multiple texts efficiently in batches
- **Document Embeddings**: Smart chunking for long documents
- **Similarity Calculation**: Cosine similarity computation for vector comparison
- **Model**: Uses `text-embedding-ada-002` (1536 dimensions)

### 3. Chat Completions (GPT-4)
- **Standard Chat**: Synchronous chat completions
- **Streaming Chat**: Real-time streaming responses
- **Context Management**: Conversation history and context handling
- **Customizable Parameters**: Temperature, max tokens, top-p, penalties
- **Model**: Uses GPT-4 or GPT-4 Turbo deployments

### 4. Enhanced Embeddings (Optional)
- **Caching**: Redis-based embedding cache for performance
- **Batch Optimization**: Efficient batch processing with deduplication
- **Cost Savings**: Reduces API calls through intelligent caching

### 5. Business-Specific Example (Proposal Generation) - OPTIONAL
- **⚠️ Status**: Business-specific example, **NOT FULLY ADAPTED**
- **Note**: This file (`proposal-generation-service.ts`) is from the source project
- **Purpose**: Demonstrates how to build domain-specific AI features
- **Schema**: Requires custom database tables (`proposalTemplate`, `proposalGeneration`, `proposal`)
- **Database**: **Still uses Prisma directly** (not database adapter)
- **Recommendation**: Use as **reference only**, rewrite for your business needs
- **Alternative**: Remove this file if not needed for your use case

## 📁 Module Structure

```
02-modules/module-ai-integration/
├── lib/
│   └── ai/
│       ├── index.ts.template                        # Unified API exports
│       ├── openai.ts.template                       # Azure OpenAI client (core)
│       ├── embeddings.ts.template                   # Text embeddings (core)
│       ├── chat.ts.template                         # GPT chat completions (core)
│       ├── enhanced-embeddings.ts.template          # Cached embeddings (optional)
│       ├── azure-openai-service.ts.template         # High-level service wrapper
│       └── proposal-generation-service.ts.template  # Business example
│
├── types/
│   └── ai.ts.template                               # TypeScript type definitions
│
└── README.md                                        # This file
```

## 🔧 Installation

### Step 1: Copy Module Files

During project initialization, the CLI will copy this module to your project root.

### Step 2: Environment Variables

Add to `.env.local`:

```bash
# Azure OpenAI Configuration (Required)
AZURE_OPENAI_API_KEY={{YOUR_API_KEY}}
AZURE_OPENAI_ENDPOINT={{YOUR_ENDPOINT}}
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Deployment Names (Required)
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4              # Chat completions deployment
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002  # Embeddings deployment

# Optional: Redis for Enhanced Embeddings
REDIS_URL=redis://localhost:6379
REDIS_EMBEDDING_TTL=86400  # 24 hours in seconds
```

### Step 3: Install Dependencies

```bash
npm install openai  # Azure OpenAI SDK
npm install ioredis # Optional: for enhanced embeddings with caching
```

### Step 4: Azure OpenAI Setup

1. Create Azure OpenAI resource in Azure Portal
2. Deploy models:
   - **GPT-4** or **GPT-4 Turbo** for chat
   - **text-embedding-ada-002** for embeddings
3. Copy endpoint and API key to `.env.local`

## 📖 Usage

### Text Embeddings

```typescript
import { generateEmbedding, generateBatchEmbeddings, calculateCosineSimilarity } from '@/lib/ai';

// Single embedding
const result = await generateEmbedding('Hello, world!');
console.log(result.embedding);  // number[] with 1536 dimensions
console.log(result.tokenCount); // Tokens used

// Batch embeddings
const batchResults = await generateBatchEmbeddings([
  'First text',
  'Second text',
  'Third text'
]);

// Similarity calculation
const similarity = calculateCosineSimilarity(
  result.embedding,
  batchResults.embeddings[0]
);
console.log(similarity);  // 0.0 to 1.0
```

### Chat Completions

```typescript
import { generateChatCompletion, generateStreamingChatCompletion } from '@/lib/ai';

// Standard chat
const response = await generateChatCompletion([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Explain embeddings in one sentence.' }
], {
  temperature: 0.7,
  maxTokens: 500
});

console.log(response.message);     // Assistant's response
console.log(response.totalTokens); // Tokens used

// Streaming chat
const stream = await generateStreamingChatCompletion([
  { role: 'user', content: 'Tell me a story.' }
]);

for await (const chunk of stream) {
  process.stdout.write(chunk.delta);  // Real-time output
}
```

### Service Health Check

```typescript
import { checkAIServicesHealth, checkOpenAIStatus } from '@/lib/ai';

// Basic connectivity check
const isConnected = await checkOpenAIStatus();
console.log('Azure OpenAI connected:', isConnected);

// Comprehensive health check
const health = await checkAIServicesHealth();
console.log('OpenAI:', health.openai);      // true/false
console.log('Embeddings:', health.embeddings); // true/false
console.log('Chat:', health.chat);           // true/false
console.log('Overall:', health.overall);     // true/false
```

### Enhanced Embeddings with Cache

```typescript
import { CachedEmbeddingService } from '@/lib/ai/enhanced-embeddings';

const cachedService = new CachedEmbeddingService();

// First call: generates embedding and caches it
const result1 = await cachedService.generateCachedEmbedding('Important text');
console.log('Cache hit:', result1.cacheHit);  // false

// Second call: retrieves from cache (much faster)
const result2 = await cachedService.generateCachedEmbedding('Important text');
console.log('Cache hit:', result2.cacheHit);  // true
```

### Error Handling

```typescript
import { AzureOpenAIError } from '@/lib/ai';

try {
  const result = await generateEmbedding('Some text');
} catch (error) {
  if (error instanceof AzureOpenAIError) {
    console.error('Azure OpenAI error:', error.message);
    console.error('Status:', error.statusCode);
    console.error('Details:', error.details);
  }
}
```

## 🔐 Security Best Practices

### 1. API Key Protection
- **Never** commit API keys to version control
- Store keys in environment variables only
- Use Azure Key Vault for production environments
- Rotate keys regularly

### 2. Rate Limiting
- Built-in rate limiting prevents quota exhaustion
- Configure limits based on your Azure OpenAI tier
- Monitor usage through Azure Portal

### 3. Cost Management
- Set budget alerts in Azure Portal
- Use caching (enhanced embeddings) to reduce API calls
- Monitor token usage with usage metrics
- Consider batch operations for cost efficiency

### 4. Content Filtering
- Azure OpenAI includes content filtering by default
- Configure content filters in Azure Portal
- Handle filter errors gracefully in your application

## 📊 API Reference

### Core Functions

#### `generateEmbedding(text: string): Promise<EmbeddingResult>`
Generate embedding vector for a single text.

**Parameters:**
- `text` - Text to embed (max ~8000 tokens)

**Returns:**
```typescript
{
  embedding: number[],      // 1536-dimensional vector
  tokenCount: number,        // Tokens used
  model: string             // Model name
}
```

#### `generateChatCompletion(messages, options?): Promise<ChatCompletionResult>`
Generate chat completion from message history.

**Parameters:**
- `messages` - Array of chat messages
- `options` - Optional configuration:
  ```typescript
  {
    temperature?: number,     // 0.0 - 2.0 (default: 0.7)
    maxTokens?: number,       // Max response tokens (default: 2000)
    topP?: number,           // 0.0 - 1.0 (default: 1.0)
    presencePenalty?: number, // -2.0 - 2.0 (default: 0)
    frequencyPenalty?: number // -2.0 - 2.0 (default: 0)
  }
  ```

**Returns:**
```typescript
{
  message: string,          // Assistant's response
  role: 'assistant',
  totalTokens: number,      // Total tokens used
  finishReason: string      // 'stop' | 'length' | 'content_filter'
}
```

### Utility Functions

#### `calculateCosineSimilarity(vec1: number[], vec2: number[]): number`
Calculate cosine similarity between two vectors.

**Returns:** Similarity score (0.0 to 1.0)

#### `splitTextIntoChunks(text: string, maxTokens?: number): string[]`
Split long text into chunks for embedding.

**Parameters:**
- `text` - Long text to split
- `maxTokens` - Max tokens per chunk (default: 8000)

**Returns:** Array of text chunks

## 🧪 Testing

### Manual Testing

1. **Health Check**:
```bash
# Create a test script
cat > test-ai.ts << 'EOF'
import { checkAIServicesHealth } from '@/lib/ai';

async function test() {
  const health = await checkAIServicesHealth();
  console.log('Health check:', health);
}

test();
EOF

npx tsx test-ai.ts
```

2. **Embedding Test**:
```bash
curl -X POST http://localhost:3000/api/test/embedding \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, AI!"}'
```

3. **Chat Test**:
```bash
curl -X POST http://localhost:3000/api/test/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is artificial intelligence?"}'
```

## 🚀 Production Deployment

### Environment Checklist

- [ ] Set Azure OpenAI API key securely
- [ ] Configure proper deployment names
- [ ] Set up Redis for caching (optional)
- [ ] Configure rate limits based on tier
- [ ] Set up Azure Monitor for logging
- [ ] Enable content filtering in Azure Portal
- [ ] Set budget alerts in Azure Portal

### Performance Optimization

1. **Use Batch Operations**: Process multiple texts together
2. **Enable Caching**: Use enhanced embeddings for frequently accessed content
3. **Optimize Chunking**: Tune chunk sizes for your use case
4. **Monitor Latency**: Track response times and optimize as needed

### Cost Optimization

1. **Embedding Cache**: Can reduce costs by 70-90% for repeated content
2. **Batch Processing**: More cost-effective than individual calls
3. **Token Optimization**: Minimize prompt tokens, optimize message history
4. **Model Selection**: Use GPT-4 Turbo for better cost efficiency

## 📝 Changelog

- **v5.0** (2025-10-06): Initial extraction from AI Sales Enablement Platform
  - Core OpenAI client infrastructure
  - Text embeddings with batch support
  - GPT-4 chat completions with streaming
  - Enhanced embeddings with caching
  - Comprehensive health monitoring
  - Business-specific example (proposal generation)

## 🤝 Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/laitim2001/ai-webapp-template/issues
- Documentation: See `/docs` directory in main project

## 📄 License

Part of AI Web App Template v5.0
