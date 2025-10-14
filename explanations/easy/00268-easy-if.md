# TypeScript Type Challenges 解説

## 00268 - If

### 問題

条件値`C`、 `C`が truthy である場合の戻り値の型`T`、`C`が falsy である場合の戻り値の型`F`を受け取る`If`を実装します。
条件値`C` は`true`か`false`のどちらかであることが期待されますが、`T` と `F` は任意の型をとることができます。

例えば：

```typescript
type A = If<true, 'a', 'b'>; // expected to be 'a'
type B = If<false, 'a', 'b'>; // expected to be 'b'
```

### 解答

```typescript
type If<C extends boolean, T, F> = C extends true ? T : F
```

### 解説

#### 構文要素

**1. `C extends boolean`**

- `C extends boolean`: C が boolean 型でなければならないという制約（ジェネリック制約）
- boolean 型は `true | false` のユニオン型
- この制約により、`null` や `undefined` など boolean 以外の値を指定するとコンパイルエラーになります
- 型安全性を保証する重要な仕組み
- 例: `If<null, 'a', 'b'>` はエラーになる

**2. `C extends true ? T : F`**

- Conditional Types（条件型）の構文
- `条件 ? 真の場合の型 : 偽の場合の型` という三項演算子に似た記法
- `C extends true` は「C が true 型に割り当て可能か」を判定
- C が `true` の場合 → 型 `T` を返す
- C が `false` の場合 → 型 `F` を返す
- C が `boolean`（= `true | false`）の場合 → `T | F` を返す（分配的条件型）

**3. 分配的条件型（Distributive Conditional Types）**

- ジェネリック型パラメータがユニオン型の場合、条件型は各メンバーに対して分配される
- 例: `boolean extends true ? T : F` は以下のように展開される
  - `(true extends true ? T : F) | (false extends true ? T : F)`
  - = `T | F`
- この動作により、`If<boolean, 'a', 'b'>` は `'a' | 'b'` になる

#### 実行フロー

1. **ジェネリック型の受け取り**
   - `C`: 条件値の型（`true`、`false`、または `boolean`）
   - `T`: C が true の場合に返す型
   - `F`: C が false の場合に返す型

2. **制約チェック**
   - `C extends boolean` により、C が boolean 型であることを検証
   - `null`、`undefined`、`string` などを渡すとコンパイル時にエラーが発生

3. **条件型による型の判定**
   - `C extends true` で C が true 型かどうかをチェック
   - true の場合 → 型 `T` を返す
   - false の場合 → 型 `F` を返す
   - boolean の場合 → 分配的条件型により `T | F` を返す

#### 実行例

**ケース1: `If<true, 'a', 'b'>`**

```typescript
type A = If<true, 'a', 'b'>
```

1. `C` は `true`、`T` は `'a'`、`F` は `'b'`
2. `true extends boolean` をチェック → OK
3. `true extends true` を評価 → true
4. 結果の型: `'a'`

**ケース2: `If<false, 'a', 2>`**

```typescript
type B = If<false, 'a', 2>
```

1. `C` は `false`、`T` は `'a'`、`F` は `2`
2. `false extends boolean` をチェック → OK
3. `false extends true` を評価 → false
4. 結果の型: `2`

**ケース3: `If<boolean, 'a', 2>`**

```typescript
type C = If<boolean, 'a', 2>
```

1. `C` は `boolean`（= `true | false`）、`T` は `'a'`、`F` は `2`
2. `boolean extends boolean` をチェック → OK
3. 分配的条件型により展開:
   - `true extends true ? 'a' : 2` → `'a'`
   - `false extends true ? 'a' : 2` → `2`
4. 結果の型: `'a' | 2`

**エラーケース: `If<null, 'a', 'b'>`**

```typescript
// @ts-expect-error
type error = If<null, 'a', 'b'>
```

- `null extends boolean` が false なのでコンパイルエラー
- 型安全性により、不正な型が渡されるのを防ぐ

### なぜこのように書くのか

**型レベルでの条件分岐**
- Conditional Types により、型レベルで if-else のような条件分岐が可能
- ランタイムではなく、コンパイル時に型が決定される
- これにより、型安全なコードを書くことができる

**型安全性の確保**
- `extends boolean` により、boolean 以外の値を指定した場合にコンパイルエラーが発生
- 問題文の要件「条件値 C は true か false のどちらかであることが期待される」を型レベルで強制
- ランタイムエラーを防ぎ、開発時に問題を発見できる

**柔軟性**
- `T` と `F` は任意の型を受け取れる（型パラメータに制約がない）
- 文字列、数値、オブジェクト型など、あらゆる型の組み合わせに対応
- 再利用可能な汎用的な型ユーティリティ

**分配的条件型の活用**
- `boolean` 型を渡した場合、自動的に `true` と `false` の両方のケースを考慮
- `T | F` というユニオン型が返される
- 型の網羅性が保証される

**実用例**

```typescript
// API レスポンスの型を条件によって変える
type ApiResponse<Success extends boolean> = If<
  Success,
  { data: string; status: 200 },
  { error: string; status: 400 }
>

type SuccessResponse = ApiResponse<true>
// { data: string; status: 200 }

type ErrorResponse = ApiResponse<false>
// { error: string; status: 400 }
```
