# 推薦模組 (Recommendation Module)

企業級推薦系統模組，提供基於內容過濾、協同過濾和混合推薦策略。

## 功能特性

### 🎯 核心功能

- **基於內容過濾 (Content-Based Filtering)**
  - TF-IDF 特徵提取
  - 餘弦相似度計算
  - 項目特徵分析
  - 用戶畫像建立

- **協同過濾 (Collaborative Filtering)**
  - 基於用戶的協同過濾 (User-Based CF)
  - 基於項目的協同過濾 (Item-Based CF)
  - 矩陣分解 (Matrix Factorization/SVD)
  - Pearson 相關係數
  - 餘弦相似度

- **混合推薦 (Hybrid Recommendations)**
  - 加權組合策略
  - 多策略融合
  - 動態權重調整

- **實時更新**
  - 即時推薦更新
  - 增量模型訓練
  - 快取優化

- **個性化**
  - 用戶偏好學習
  - 行為分析
  - 動態調整

- **A/B 測試支援**
  - 多策略對比
  - 效果評估
  - 統計顯著性檢驗

## 安裝依賴

```bash
npm install ml-matrix natural
```

## 快速開始

### 基於內容的推薦

```typescript
import { ContentBasedRecommender } from '@/lib/recommendation/content-based';

// 初始化推薦器
const recommender = new ContentBasedRecommender();

// 添加項目
const items = [
  {
    id: 'product-1',
    features: {
      category: 'electronics',
      brand: 'Apple',
      tags: ['smartphone', 'iOS', '5G']
    },
    metadata: {
      name: 'iPhone 14 Pro',
      description: 'Latest flagship smartphone with advanced camera'
    }
  },
  {
    id: 'product-2',
    features: {
      category: 'electronics',
      brand: 'Samsung',
      tags: ['smartphone', 'Android', '5G']
    },
    metadata: {
      name: 'Galaxy S23',
      description: 'Premium Android smartphone with excellent display'
    }
  }
];

// 建立項目索引
await recommender.buildIndex(items);

// 獲取相似項目推薦
const recommendations = await recommender.getSimilarItems('product-1', {
  limit: 5,
  threshold: 0.3
});

console.log(recommendations);
// [
//   { itemId: 'product-2', score: 0.85, reason: 'Similar features' },
//   ...
// ]
```

### 協同過濾推薦

```typescript
import { CollaborativeFilterRecommender } from '@/lib/recommendation/collaborative-filter';

// 初始化推薦器
const recommender = new CollaborativeFilterRecommender({
  algorithm: 'user-based', // 'user-based' | 'item-based' | 'hybrid'
  similarityMetric: 'cosine', // 'cosine' | 'pearson'
  minSimilarity: 0.3,
  neighborhoodSize: 20
});

// 訓練模型
const interactions = [
  { userId: 'user-1', itemId: 'product-1', rating: 5.0, timestamp: Date.now() },
  { userId: 'user-1', itemId: 'product-2', rating: 4.0, timestamp: Date.now() },
  { userId: 'user-2', itemId: 'product-1', rating: 4.5, timestamp: Date.now() },
  { userId: 'user-2', itemId: 'product-3', rating: 5.0, timestamp: Date.now() }
];

await recommender.train(interactions);

// 獲取用戶推薦
const recommendations = await recommender.recommendForUser('user-1', {
  limit: 10,
  excludeInteracted: true
});

console.log(recommendations);
// [
//   { itemId: 'product-3', score: 4.8, reason: 'Users similar to you liked this' },
//   ...
// ]
```

### 混合推薦策略

```typescript
import { ContentBasedRecommender } from '@/lib/recommendation/content-based';
import { CollaborativeFilterRecommender } from '@/lib/recommendation/collaborative-filter';

// 初始化兩種推薦器
const contentRecommender = new ContentBasedRecommender();
const cfRecommender = new CollaborativeFilterRecommender();

// 訓練模型
await contentRecommender.buildIndex(items);
await cfRecommender.train(interactions);

// 混合推薦
async function hybridRecommend(userId: string, options: {
  limit: number;
  contentWeight: number; // 0-1
  cfWeight: number; // 0-1
}) {
  const { limit, contentWeight, cfWeight } = options;

  // 獲取基於內容的推薦
  const userHistory = await getUserHistory(userId);
  const contentRecs = await Promise.all(
    userHistory.map(itemId =>
      contentRecommender.getSimilarItems(itemId, { limit: limit * 2 })
    )
  );

  // 獲取協同過濾推薦
  const cfRecs = await cfRecommender.recommendForUser(userId, {
    limit: limit * 2
  });

  // 合併和重新排序
  const combined = new Map();

  contentRecs.flat().forEach(rec => {
    combined.set(rec.itemId, (combined.get(rec.itemId) || 0) + rec.score * contentWeight);
  });

  cfRecs.forEach(rec => {
    combined.set(rec.itemId, (combined.get(rec.itemId) || 0) + rec.score * cfWeight);
  });

  return Array.from(combined.entries())
    .map(([itemId, score]) => ({ itemId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// 使用混合推薦
const recommendations = await hybridRecommend('user-1', {
  limit: 10,
  contentWeight: 0.4,
  cfWeight: 0.6
});
```

## API 參考

### ContentBasedRecommender

#### 構造函數

```typescript
constructor(options?: ContentBasedOptions)
```

**選項**:
- `tfidfOptions?: TFIDFOptions` - TF-IDF 配置
- `similarityThreshold?: number` - 相似度閾值 (默認: 0.0)
- `maxFeatures?: number` - 最大特徵數 (默認: 1000)

#### 方法

##### `buildIndex(items: RecommendationItem[]): Promise<void>`

建立項目索引，計算 TF-IDF 向量。

**參數**:
- `items` - 推薦項目陣列

**返回**: Promise<void>

##### `getSimilarItems(itemId: string, options?: SimilarItemsOptions): Promise<RecommendationResult[]>`

獲取相似項目推薦。

**參數**:
- `itemId` - 目標項目 ID
- `options` - 推薦選項
  - `limit?: number` - 返回數量 (默認: 10)
  - `threshold?: number` - 相似度閾值 (默認: 0.0)
  - `includeScores?: boolean` - 是否包含分數 (默認: true)

**返回**: Promise<RecommendationResult[]>

##### `recommendForUserProfile(profile: UserProfile, options?: RecommendOptions): Promise<RecommendationResult[]>`

基於用戶畫像推薦。

**參數**:
- `profile` - 用戶畫像
- `options` - 推薦選項

**返回**: Promise<RecommendationResult[]>

##### `updateItem(item: RecommendationItem): Promise<void>`

更新單個項目。

**參數**:
- `item` - 更新的項目

**返回**: Promise<void>

##### `removeItem(itemId: string): Promise<void>`

移除項目。

**參數**:
- `itemId` - 項目 ID

**返回**: Promise<void>

### CollaborativeFilterRecommender

#### 構造函數

```typescript
constructor(options?: CollaborativeFilterOptions)
```

**選項**:
- `algorithm?: 'user-based' | 'item-based' | 'hybrid'` - 算法類型 (默認: 'user-based')
- `similarityMetric?: 'cosine' | 'pearson'` - 相似度度量 (默認: 'cosine')
- `minSimilarity?: number` - 最小相似度 (默認: 0.0)
- `neighborhoodSize?: number` - 鄰居數量 (默認: 20)
- `matrixFactorization?: boolean` - 是否使用矩陣分解 (默認: false)
- `numFactors?: number` - 潛在因子數量 (默認: 10)

#### 方法

##### `train(interactions: UserInteraction[]): Promise<void>`

訓練推薦模型。

**參數**:
- `interactions` - 用戶交互數據

**返回**: Promise<void>

##### `recommendForUser(userId: string, options?: RecommendOptions): Promise<RecommendationResult[]>`

為用戶生成推薦。

**參數**:
- `userId` - 用戶 ID
- `options` - 推薦選項
  - `limit?: number` - 返回數量 (默認: 10)
  - `excludeInteracted?: boolean` - 排除已交互項目 (默認: true)
  - `minScore?: number` - 最小分數閾值

**返回**: Promise<RecommendationResult[]>

##### `getSimilarUsers(userId: string, options?: SimilarityOptions): Promise<SimilarityResult[]>`

獲取相似用戶。

**參數**:
- `userId` - 用戶 ID
- `options` - 相似度選項

**返回**: Promise<SimilarityResult[]>

##### `getSimilarItems(itemId: string, options?: SimilarityOptions): Promise<SimilarityResult[]>`

獲取相似項目。

**參數**:
- `itemId` - 項目 ID
- `options` - 相似度選項

**返回**: Promise<SimilarityResult[]>

##### `predictRating(userId: string, itemId: string): Promise<number>`

預測用戶對項目的評分。

**參數**:
- `userId` - 用戶 ID
- `itemId` - 項目 ID

**返回**: Promise<number>

##### `updateInteraction(interaction: UserInteraction): Promise<void>`

更新單個交互。

**參數**:
- `interaction` - 用戶交互

**返回**: Promise<void>

## 類型定義

### RecommendationItem

```typescript
interface RecommendationItem {
  id: string;
  features: Record<string, any>;
  metadata?: Record<string, any>;
}
```

### UserProfile

```typescript
interface UserProfile {
  userId: string;
  preferences: Record<string, number>;
  history: string[];
  metadata?: Record<string, any>;
}
```

### UserInteraction

```typescript
interface UserInteraction {
  userId: string;
  itemId: string;
  rating: number;
  timestamp: number;
  context?: Record<string, any>;
}
```

### RecommendationResult

```typescript
interface RecommendationResult {
  itemId: string;
  score: number;
  reason?: string;
  metadata?: Record<string, any>;
}
```

## 算法詳解

### 基於內容過濾

**工作原理**:
1. 提取項目特徵 (標籤、類別、描述等)
2. 使用 TF-IDF 將特徵向量化
3. 計算項目間餘弦相似度
4. 基於相似度排序推薦

**優點**:
- 不需要大量用戶數據
- 可以推薦新項目 (無冷啟動問題)
- 推薦結果可解釋性強

**缺點**:
- 難以發現用戶新興趣
- 特徵工程要求高
- 推薦多樣性較低

### 協同過濾

#### 基於用戶的協同過濾

**工作原理**:
1. 計算用戶間相似度
2. 找到最相似的 K 個鄰居
3. 基於鄰居的評分預測目標用戶評分
4. 推薦高分項目

**相似度計算**:
- **餘弦相似度**: `sim(u,v) = cos(θ) = (u·v) / (||u|| ||v||)`
- **Pearson 相關係數**: `sim(u,v) = Σ(ru,i - r̄u)(rv,i - r̄v) / sqrt(Σ(ru,i - r̄u)² Σ(rv,i - r̄v)²)`

#### 基於項目的協同過濾

**工作原理**:
1. 計算項目間相似度
2. 找到用戶已評分項目的相似項目
3. 基於相似項目的評分預測
4. 推薦高分項目

**優點**:
- 計算效率高 (項目數通常少於用戶數)
- 推薦穩定性好
- 可擴展性強

#### 矩陣分解 (SVD)

**工作原理**:
1. 將評分矩陣分解為用戶-特徵和特徵-項目矩陣
2. 學習潛在特徵表示
3. 通過矩陣乘法預測評分

**數學表示**:
```
R ≈ U × Σ × V^T
```

其中:
- R: 用戶-項目評分矩陣
- U: 用戶-特徵矩陣
- Σ: 奇異值對角矩陣
- V: 項目-特徵矩陣

### 混合推薦

**組合策略**:

1. **加權組合**:
   ```
   score = α × content_score + β × cf_score
   ```
   其中 α + β = 1

2. **級聯組合**:
   先用一種方法過濾，再用另一種方法排序

3. **特徵組合**:
   將兩種方法的特徵合併訓練新模型

4. **切換組合**:
   根據情況動態選擇不同策略

## 性能優化

### 快取策略

```typescript
import { LRUCache } from 'lru-cache';

// 快取推薦結果
const recommendationCache = new LRUCache<string, RecommendationResult[]>({
  max: 1000,
  ttl: 1000 * 60 * 60, // 1小時
});

async function getCachedRecommendations(
  userId: string,
  recommender: CollaborativeFilterRecommender
): Promise<RecommendationResult[]> {
  const cacheKey = `rec:${userId}`;

  let recommendations = recommendationCache.get(cacheKey);

  if (!recommendations) {
    recommendations = await recommender.recommendForUser(userId, { limit: 20 });
    recommendationCache.set(cacheKey, recommendations);
  }

  return recommendations;
}
```

### 批量處理

```typescript
// 批量生成推薦
async function batchRecommend(
  userIds: string[],
  recommender: CollaborativeFilterRecommender,
  options: { concurrency: number }
): Promise<Map<string, RecommendationResult[]>> {
  const results = new Map();
  const chunks = chunkArray(userIds, options.concurrency);

  for (const chunk of chunks) {
    const recommendations = await Promise.all(
      chunk.map(userId => recommender.recommendForUser(userId))
    );

    chunk.forEach((userId, index) => {
      results.set(userId, recommendations[index]);
    });
  }

  return results;
}
```

### 增量更新

```typescript
// 增量更新模型
class IncrementalRecommender extends CollaborativeFilterRecommender {
  private updateQueue: UserInteraction[] = [];
  private updateInterval: number = 60000; // 1分鐘

  constructor(options?: CollaborativeFilterOptions) {
    super(options);
    this.startPeriodicUpdate();
  }

  async addInteraction(interaction: UserInteraction): Promise<void> {
    this.updateQueue.push(interaction);

    // 立即更新本地狀態
    await this.updateInteraction(interaction);
  }

  private startPeriodicUpdate(): void {
    setInterval(async () => {
      if (this.updateQueue.length > 0) {
        await this.train(this.updateQueue);
        this.updateQueue = [];
      }
    }, this.updateInterval);
  }
}
```

## 評估指標

### 準確性指標

```typescript
// 計算均方根誤差 (RMSE)
function calculateRMSE(predictions: number[], actuals: number[]): number {
  const squaredErrors = predictions.map((pred, i) =>
    Math.pow(pred - actuals[i], 2)
  );
  return Math.sqrt(squaredErrors.reduce((a, b) => a + b) / predictions.length);
}

// 計算平均絕對誤差 (MAE)
function calculateMAE(predictions: number[], actuals: number[]): number {
  const absoluteErrors = predictions.map((pred, i) =>
    Math.abs(pred - actuals[i])
  );
  return absoluteErrors.reduce((a, b) => a + b) / predictions.length;
}
```

### 排序指標

```typescript
// 計算精確率@K (Precision@K)
function precisionAtK(
  recommended: string[],
  relevant: string[],
  k: number
): number {
  const topK = recommended.slice(0, k);
  const relevantCount = topK.filter(id => relevant.includes(id)).length;
  return relevantCount / k;
}

// 計算召回率@K (Recall@K)
function recallAtK(
  recommended: string[],
  relevant: string[],
  k: number
): number {
  const topK = recommended.slice(0, k);
  const relevantCount = topK.filter(id => relevant.includes(id)).length;
  return relevantCount / relevant.length;
}

// 計算NDCG@K (Normalized Discounted Cumulative Gain)
function ndcgAtK(
  recommended: string[],
  relevance: Map<string, number>,
  k: number
): number {
  const dcg = recommended.slice(0, k).reduce((sum, id, index) => {
    const rel = relevance.get(id) || 0;
    return sum + rel / Math.log2(index + 2);
  }, 0);

  const idealOrder = Array.from(relevance.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k);

  const idcg = idealOrder.reduce((sum, [_, rel], index) => {
    return sum + rel / Math.log2(index + 2);
  }, 0);

  return idcg > 0 ? dcg / idcg : 0;
}
```

## 冷啟動處理

### 新用戶冷啟動

```typescript
// 新用戶推薦策略
async function recommendForNewUser(
  userId: string,
  options: {
    popularityWeight: number;
    demographicWeight: number;
  }
): Promise<RecommendationResult[]> {
  // 1. 獲取熱門項目
  const popularItems = await getPopularItems({ limit: 20 });

  // 2. 基於人口統計學特徵推薦
  const userDemographics = await getUserDemographics(userId);
  const demographicRecs = await getDemographicRecommendations(
    userDemographics,
    { limit: 20 }
  );

  // 3. 組合推薦
  const combined = new Map();

  popularItems.forEach(item => {
    combined.set(item.id, item.score * options.popularityWeight);
  });

  demographicRecs.forEach(item => {
    const score = combined.get(item.id) || 0;
    combined.set(item.id, score + item.score * options.demographicWeight);
  });

  return Array.from(combined.entries())
    .map(([itemId, score]) => ({ itemId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
```

### 新項目冷啟動

```typescript
// 新項目推薦策略
async function promoteNewItem(
  itemId: string,
  options: {
    targetUsers: number;
    selectionStrategy: 'random' | 'diverse' | 'active';
  }
): Promise<void> {
  let selectedUsers: string[];

  switch (options.selectionStrategy) {
    case 'random':
      selectedUsers = await getRandomUsers(options.targetUsers);
      break;
    case 'diverse':
      selectedUsers = await getDiverseUsers(options.targetUsers);
      break;
    case 'active':
      selectedUsers = await getActiveUsers(options.targetUsers);
      break;
  }

  // 將新項目注入推薦列表
  for (const userId of selectedUsers) {
    await injectItemIntoRecommendations(userId, itemId, {
      position: 'random', // 隨機位置
      probability: 0.2 // 20% 機會出現
    });
  }
}
```

## A/B 測試

```typescript
// A/B 測試框架
class RecommendationABTest {
  private experiments: Map<string, {
    control: CollaborativeFilterRecommender;
    treatment: CollaborativeFilterRecommender;
    split: number;
  }> = new Map();

  async addExperiment(
    experimentId: string,
    control: CollaborativeFilterRecommender,
    treatment: CollaborativeFilterRecommender,
    split: number = 0.5
  ): Promise<void> {
    this.experiments.set(experimentId, { control, treatment, split });
  }

  async getRecommendations(
    experimentId: string,
    userId: string
  ): Promise<{
    recommendations: RecommendationResult[];
    variant: 'control' | 'treatment';
  }> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }

    // 確定性分流 (基於用戶 ID 哈希)
    const hash = hashString(userId);
    const variant = (hash % 100) / 100 < experiment.split ? 'control' : 'treatment';

    const recommender = variant === 'control'
      ? experiment.control
      : experiment.treatment;

    const recommendations = await recommender.recommendForUser(userId);

    // 記錄實驗數據
    await this.logExperimentData(experimentId, userId, variant, recommendations);

    return { recommendations, variant };
  }

  private async logExperimentData(
    experimentId: string,
    userId: string,
    variant: string,
    recommendations: RecommendationResult[]
  ): Promise<void> {
    // 記錄到分析系統
  }
}
```

## 最佳實踐

### 1. 數據質量

- 清理噪聲數據 (異常評分、機器人行為)
- 處理缺失值和稀疏性
- 定期更新訓練數據

### 2. 模型選擇

- 根據數據規模選擇算法
- 小數據集: 基於內容過濾
- 中等數據集: 協同過濾
- 大數據集: 矩陣分解或深度學習

### 3. 多樣性優化

```typescript
// 多樣性重排序
function diversifyRecommendations(
  recommendations: RecommendationResult[],
  items: Map<string, RecommendationItem>,
  diversityWeight: number = 0.3
): RecommendationResult[] {
  const selected: RecommendationResult[] = [];
  const remaining = [...recommendations];

  while (selected.length < 10 && remaining.length > 0) {
    let maxScore = -Infinity;
    let maxIndex = 0;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const relevanceScore = candidate.score;

      // 計算與已選項目的平均相似度
      let avgSimilarity = 0;
      if (selected.length > 0) {
        const similarities = selected.map(s =>
          calculateItemSimilarity(
            items.get(candidate.itemId)!,
            items.get(s.itemId)!
          )
        );
        avgSimilarity = similarities.reduce((a, b) => a + b) / similarities.length;
      }

      // 組合分數: 相關性 - 多樣性懲罰
      const diversityScore = (1 - diversityWeight) * relevanceScore -
                            diversityWeight * avgSimilarity;

      if (diversityScore > maxScore) {
        maxScore = diversityScore;
        maxIndex = i;
      }
    }

    selected.push(remaining[maxIndex]);
    remaining.splice(maxIndex, 1);
  }

  return selected;
}
```

### 4. 實時性優化

- 使用快取減少計算
- 預計算相似度矩陣
- 增量更新而非完全重訓練
- 異步處理非關鍵更新

### 5. 可解釋性

```typescript
// 生成推薦理由
function generateExplanation(
  recommendation: RecommendationResult,
  method: 'content' | 'collaborative'
): string {
  if (method === 'content') {
    return `因為此項目與您喜歡的項目具有相似特徵`;
  } else {
    return `與您有相似偏好的用戶也喜歡此項目`;
  }
}
```

## 故障排除

### 問題: 推薦結果不準確

**可能原因**:
- 訓練數據不足
- 特徵提取不當
- 參數設置不合理

**解決方案**:
- 檢查訓練數據質量和數量
- 優化特徵工程
- 調整算法參數 (相似度閾值、鄰居數量等)

### 問題: 推薦速度慢

**可能原因**:
- 未使用快取
- 相似度矩陣未預計算
- 數據量過大

**解決方案**:
- 實現快取層
- 預計算和存儲相似度矩陣
- 使用批量處理
- 考慮降維或採樣

### 問題: 推薦多樣性低

**可能原因**:
- 過度擬合用戶歷史
- 未實現多樣性優化

**解決方案**:
- 實現多樣性重排序
- 引入隨機性
- 結合多種推薦策略

## 參考資源

- [推薦系統實踐](https://www.manning.com/books/practical-recommender-systems)
- [Collaborative Filtering for Implicit Feedback Datasets](http://yifanhu.net/PUB/cf.pdf)
- [Matrix Factorization Techniques for Recommender Systems](https://datajobs.com/data-science-repo/Recommender-Systems-[Netflix].pdf)
- [Context-Aware Recommender Systems](https://www.springer.com/gp/book/9781489976383)

## 授權

MIT License
