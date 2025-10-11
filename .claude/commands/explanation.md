---
description: "Type Challenges の問題の解説を生成します"
---

問題番号 **$1** の解説を以下の手順で作成してください：

1. `playground/**/*$1*.ts` パターンでファイルを検索して読み込む
2. ファイルの内容から以下を特定：
   - 問題の難易度（easy/medium/hard/extreme）
   - 完全なファイル名（例: 00004-easy-pick.ts）
3. 以下のマークダウンフォーマットで解説を作成：

```markdown
# TypeScript Type Challenges 解説

## {問題番号} - {問題名}

### 問題
{問題文の引用}

### 解答
```typescript
{解答コード}
```

### 解説

#### 構文要素

**1. {要素名1}**
- 説明
- 例

**2. {要素名2}**
- 説明
- 例

#### 実行フロー

{ステップバイステップの説明}

#### 実行例

```typescript
{具体例}
```

### {必要に応じて}比較・注意点など
```

4. 作成した解説を `explanations/{難易度}/{ファイル名}.md` として保存
   - 例: `explanations/easy/00004-easy-pick.md`
   - ディレクトリが存在しない場合は作成

`explanations/easy/00004-easy-pick.md` の解説を参考に、同じレベルの詳細さで解説を作成してください。
