# TypeScript Type Challenges 解説

## 00011 - Tuple to Object

### 問題

タプルを受け取り、その各値のkey/valueを持つオブジェクトの型に変換する型を実装します。

例えば：

```typescript
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple> // expected { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

### 解答

```typescript
type TupleToObject<T extends readonly PropertyKey[]> = { [K in T[number]]: K }
```

### 解説

#### 構文要素

**1. `T extends readonly PropertyKey[]`**

- `readonly`: タプルが読み取り専用であることを示す修飾子
  - `as const` で定義されたタプルは readonly となる
  - 例: `['tesla', 'model 3'] as const` は `readonly ['tesla', 'model 3']` 型
- `PropertyKey`: オブジェクトのキーとして使用できる型の組み込みユニオン型
  - `PropertyKey = string | number | symbol`
  - オブジェクトのキーとして有効な値のみを受け入れる
- `T extends readonly PropertyKey[]`: T が readonly な PropertyKey の配列でなければならないという制約
  - これにより、オブジェクトや配列などの無効な値を含むタプルを拒否できる

**2. `T[number]`**

- Indexed Access Types でタプルのすべての要素の型をユニオン型として取得
- `number` はタプルのすべてのインデックスを表す
- 例: `['tesla', 'model 3', 'model X'] as const` の `T[number]` は `'tesla' | 'model 3' | 'model X'`
- タプルの各要素をループせずに、一度にすべての値の型を取得できる

**3. `[K in T[number]]: K`**

- Mapped Types（マップ型）の構文
- `K in T[number]`: T[number] で取得した各値に対してループ処理を行う
- `[K]: K`: 各値をキーとして、その値自体を値の型として使用
  - キーと値が同じ型になる
- この構文により、タプルの各要素からオブジェクト型を動的に生成できる

#### 実行フロー

1. **ジェネリック型の受け取り**
   - `T`: readonly な PropertyKey の配列型（例: `readonly ['tesla', 'model 3', 'model X', 'model Y']`）

2. **制約チェック**
   - `T extends readonly PropertyKey[]` により、T がオブジェクトのキーとして使用可能な値の配列であることを検証
   - 無効な値（例: オブジェクトや配列）が含まれている場合、コンパイル時にエラーが発生

3. **ユニオン型の抽出**
   - `T[number]` により、タプルのすべての要素の型をユニオン型として取得
   - 例: `'tesla' | 'model 3' | 'model X' | 'model Y'`

4. **Mapped Types による型の構築**
   - `[K in T[number]]` により、ユニオン型の各値に対してループ
   - 各値 K に対して、`K: K` でキーと値を同じ型として設定
   - 新しいオブジェクト型が生成される

#### 実行例

```typescript
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
type result = TupleToObject<typeof tuple>
```

1. `T` は `readonly ['tesla', 'model 3', 'model X', 'model Y']`
2. `T extends readonly PropertyKey[]` をチェック
   - すべての要素が string なので OK
3. `T[number]` を計算
   - 結果: `'tesla' | 'model 3' | 'model X' | 'model Y'`
4. Mapped Types により：
   - `K = 'tesla'` のとき → `'tesla': 'tesla'`
   - `K = 'model 3'` のとき → `'model 3': 'model 3'`
   - `K = 'model X'` のとき → `'model X': 'model X'`
   - `K = 'model Y'` のとき → `'model Y': 'model Y'`
5. 結果の型:
```typescript
{
  'tesla': 'tesla'
  'model 3': 'model 3'
  'model X': 'model X'
  'model Y': 'model Y'
}
```

**数値とシンボルの例:**

```typescript
const tupleNumber = [1, 2, 3, 4] as const
type result = TupleToObject<typeof tupleNumber>
// 結果: { 1: 1, 2: 2, 3: 3, 4: 4 }

const sym1 = Symbol(1)
const sym2 = Symbol(2)
const tupleSymbol = [sym1, sym2] as const
type result2 = TupleToObject<typeof tupleSymbol>
// 結果: { [sym1]: typeof sym1, [sym2]: typeof sym2 }
```

### なぜこのように書くのか

**型安全性の確保**
- `extends readonly PropertyKey[]` により、オブジェクトのキーとして使用できない値を拒否
- ランタイムエラーを防ぎ、開発時に問題を発見できる
- テストケースの `@ts-expect-error` が示すように、`[[1, 2], {}]` のような無効な値は型エラーになる

**readonly の必要性**
- `as const` で定義されたタプルは readonly となる
- readonly 修飾子がないと、const アサーションされたタプルを受け取れない
- TypeScript の型推論と整合性を保つために必要

**T[number] の活用**
- 配列のすべての要素の型を一度に取得できる便利な機能
- ループを書かずに、タプルの全要素をユニオン型として扱える
- コードが簡潔で読みやすい

**キーと値が同じ型**
- `[K in T[number]]: K` により、キーと値が同じになる
- タプルの要素をそのままオブジェクトのキーと値として使用
- 定数オブジェクトのようなマッピングを型レベルで表現できる

**柔軟性**
- string、number、symbol のすべてに対応
- PropertyKey により、JavaScript のオブジェクトキーの仕様に完全に準拠
- 実用的で汎用性の高い型ユーティリティ
