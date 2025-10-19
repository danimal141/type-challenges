# TypeScript Type Challenges 解説

## 00533 - Concat

### 問題

JavaScript の`Array.concat`関数を型システムに実装します。この型は 2 つの引数を受け取り、受け取ったイテレータの要素を順に含む新しい配列を返します。

例えば：

```typescript
type Result = Concat<[1], [2]>; // expected to be [1, 2]
```

### 解答

```typescript
type Concat<T extends readonly any[], U extends readonly any[]> = [...T, ...U]
```

### 解説

#### 構文要素

**1. `T extends readonly any[]`**

- `readonly any[]`: 読み取り専用配列型の制約
  - `any[]` は通常の配列型
  - `readonly` を付けることで、読み取り専用配列（`as const` で作成されたタプル型など）も受け入れられる
- `extends ...`: T が配列型でなければならないという制約（ジェネリック制約）
- これにより、配列以外の型（例: `null`、`undefined`、オブジェクト型）を指定するとコンパイルエラーになります
- 型安全性を保証する重要な仕組み

**2. `[...T, ...U]`**

- タプル型におけるSpread構文（スプレッド構文）
- JavaScript の配列スプレッド構文に対応する型レベルの構文
- `...T` により、T の全要素を展開
- `...U` により、U の全要素を展開
- 結果として、T と U の要素が順番に結合された新しいタプル型が生成される

#### 実行フロー

1. **ジェネリック型の受け取り**
   - `T`: 最初の配列型（例: `[1]`）
   - `U`: 2 番目の配列型（例: `[2]`）

2. **制約チェック**
   - `T extends readonly any[]` により、T が配列型であることを検証
   - `U extends readonly any[]` により、U が配列型であることを検証
   - 配列型以外が渡された場合、コンパイル時にエラーが発生

3. **Spread構文による型の構築**
   - `[...T, ...U]` により、T の全要素と U の全要素を順に展開
   - 新しいタプル型が生成される

#### 実行例

**例1: 基本的な使用**

```typescript
type Result = Concat<[1], [2]>
```

1. `T` は `[1]`、`U` は `[2]`
2. 制約チェック
   - `[1] extends readonly any[]` → OK
   - `[2] extends readonly any[]` → OK
3. Spread構文により：
   - `[...T, ...U]` → `[...[1], ...[2]]` → `[1, 2]`
4. 結果の型: `[1, 2]`

**例2: 複数要素の配列**

```typescript
type Result = Concat<[1, 2], [3, 4]>
```

1. `T` は `[1, 2]`、`U` は `[3, 4]`
2. Spread構文により：
   - `[...[1, 2], ...[3, 4]]` → `[1, 2, 3, 4]`
3. 結果の型: `[1, 2, 3, 4]`

**例3: 異なる型の混在**

```typescript
type Result = Concat<['1', 2, '3'], [false, boolean, '4']>
```

1. `T` は `['1', 2, '3']`、`U` は `[false, boolean, '4']`
2. Spread構文により：
   - `[...[('1', 2, '3')], ...[false, boolean, '4']]`
   - → `['1', 2, '3', false, boolean, '4']`
3. 結果の型: `['1', 2, '3', false, boolean, '4']`
   - 各要素の型が正確に保持される

**例4: 空配列**

```typescript
type Result = Concat<[], [1]>
```

1. `T` は `[]`、`U` は `[1]`
2. Spread構文により：
   - `[...[], ...[1]]` → `[1]`
3. 結果の型: `[1]`

**例5: `as const` で作成されたタプル**

```typescript
const tuple = [1] as const
type Result = Concat<typeof tuple, typeof tuple>
```

1. `typeof tuple` は `readonly [1]`（読み取り専用タプル型）
2. `readonly` 制約により、このような読み取り専用配列も受け入れられる
3. 結果の型: `[1, 1]`

### なぜこのように書くのか

**型安全性の確保**
- `extends readonly any[]` により、配列以外の型を指定した場合にコンパイルエラーが発生
- テストケースの `Concat<null, undefined>` は `@ts-expect-error` でエラーが期待される
- ランタイムエラーを防ぎ、開発時に問題を発見できる

**`readonly` の重要性**
- `as const` で作成されたタプル型は `readonly` 属性を持つ
- `readonly any[]` とすることで、通常の配列と読み取り専用配列の両方に対応
- より柔軟で汎用的な型ユーティリティになる

**シンプルな実装**
- Spread構文を使うことで、配列の結合をシンプルに表現
- JavaScript の `Array.concat` の動作を型レベルで忠実に再現
- 直感的で理解しやすい

**元の型情報の保持**
- 各要素の型が正確に保たれる
- タプル型の順序も維持される
- 型情報の損失がない

### JavaScript の `Array.concat` との対応

```javascript
// JavaScript の実行時の動作
const arr1 = [1, 2];
const arr2 = [3, 4];
const result = arr1.concat(arr2); // [1, 2, 3, 4]
```

```typescript
// TypeScript の型レベルでの同等の動作
type Arr1 = [1, 2];
type Arr2 = [3, 4];
type Result = Concat<Arr1, Arr2>; // [1, 2, 3, 4]
```

型レベルでも実行時と同じように、2 つの配列を結合して新しい配列型を作成できます。
