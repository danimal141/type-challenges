# TypeScript Type Challenges 解説

## 00018 - Length of Tuple

### 問題

タプル`T`を受け取り、そのタプルの長さを返す型`Length<T>`を実装します。

例えば：

```typescript
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla>  // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

### 解答

```typescript
type Length<T extends readonly PropertyKey[]> = T['length']
```

### 解説

#### 構文要素

**1. `T extends readonly PropertyKey[]`**

- `readonly`: 配列やタプルが読み取り専用であることを示す修飾子
  - `as const` で定義された配列は自動的に `readonly` になります
  - 例: `['a', 'b'] as const` は `readonly ['a', 'b']` 型になる
- `PropertyKey`: TypeScriptの組み込み型で `string | number | symbol` のユニオン型
  - オブジェクトのキーとして使用できる型の総称
  - ここでは配列/タプルの要素型として使用
- `extends`: ジェネリック制約により、T が readonly な配列/タプルであることを保証
- この制約により、配列やタプル以外の型（数値、文字列など）を渡すとコンパイルエラーになります

**2. `T['length']`**

- Indexed Access Types（インデックスアクセス型）
- T の `length` プロパティの型を取得
- タプル型の場合、`length` は具体的な数値リテラル型になります
  - 例: `['a', 'b', 'c']` の `length` は `3` 型
  - 例: `string[]` の `length` は `number` 型
- これがこの問題の核心的なテクニック

**3. タプル型の `length` プロパティ**

- TypeScriptでは、タプル型は固定長の配列として扱われる
- タプル型の `length` プロパティは、その要素数を表す数値リテラル型
- 通常の配列型（`string[]` など）の `length` は `number` 型
- この違いにより、タプルの正確な長さを型レベルで取得できる

#### 実行フロー

1. **ジェネリック型の受け取り**
   - `T`: タプル型（例: `['tesla', 'model 3', 'model X', 'model Y']`）
   - `as const` により readonly タプル型として扱われる

2. **制約チェック**
   - `T extends readonly PropertyKey[]` により、T が readonly な配列/タプルであることを検証
   - 配列やタプル以外の型（数値、文字列など）が渡されるとコンパイルエラーが発生

3. **length プロパティの型を取得**
   - `T['length']` により、タプル型の length プロパティの型を取得
   - タプル型の場合、この型は具体的な数値リテラル型（例: `4`, `5`）

4. **結果の型を返す**
   - 取得した数値リテラル型がそのまま戻り値の型となる

#### 実行例

```typescript
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type teslaLength = Length<tesla>
```

1. `T` は `['tesla', 'model 3', 'model X', 'model Y']` 型
2. `T extends readonly PropertyKey[]` をチェック
   - タプル型は配列型のサブタイプなので OK
3. `T['length']` を評価:
   - `['tesla', 'model 3', 'model X', 'model Y']` の `length` プロパティの型は `4`
   - これは数値リテラル型 `4` です（`number` 型ではありません）
4. 結果: `teslaLength` の型は `4`

```typescript
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']
type spaceXLength = Length<spaceX>
```

1. `T` は 5要素のタプル型
2. `T['length']` は `5` 型
3. 結果: `spaceXLength` の型は `5`

### なぜこのように書くのか

**TypeScriptのタプル型の特性を活用**
- タプル型は固定長の配列として扱われ、その `length` プロパティは具体的な数値リテラル型
- この特性により、型レベルでタプルの長さを取得できる
- 通常の配列型では `length` は `number` 型なので、この手法は使えません

**インデックスアクセス型の活用**
- `T['length']` という簡潔な構文で、型の持つプロパティの型を取得
- Mapped Types や条件型などの複雑な構文を使う必要がない
- TypeScriptの型システムの強力さを示す好例

**readonly 修飾子の必要性**
- `as const` で定義されたタプルは readonly になる
- ジェネリック制約に `readonly` を含めることで、このようなケースに対応
- readonly を付けない場合、`as const` で定義されたタプルとの互換性がなくなる

**型安全性の確保**
- `extends readonly PropertyKey[]` により、配列/タプル以外の型を弾く
- テストケースにある `Length<5>` や `Length<'hello world'>` は型エラーになる
- コンパイル時に不正な使用を検出できる

**シンプルで直感的**
- 複雑なロジックは不要で、TypeScriptの型システムが持つ機能を直接利用
- コードが読みやすく、理解しやすい
- 保守性が高い
