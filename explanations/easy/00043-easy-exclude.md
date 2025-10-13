# TypeScript Type Challenges 解説

## 00043 - Exclude

### 問題

組み込みの型ユーティリティ`Exclude <T, U>`を使用せず、`U`に割り当て可能な型を`T`から除外する型を実装します。

例えば：

```typescript
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

### 解答

```typescript
type MyExclude<T, U> = T extends U ? never : T
```

### 解説

#### 構文要素

**1. Conditional Types（条件型）**

- `T extends U ? X : Y` の形式で、条件に基づいて型を分岐
- `T extends U` が真なら `X`、偽なら `Y` の型を返す
- 例: `string extends object ? true : false` → `false`
- TypeScript の型システムにおける if 文のようなもの

**2. Distributive Conditional Types（分配的条件型）**

- Conditional Types の最も重要な特性
- **ユニオン型に対して適用すると、各メンバーに分配される**
- 例: `'a' | 'b' extends U ? X : Y` は `('a' extends U ? X : Y) | ('b' extends U ? X : Y)` として評価される
- この分配の仕組みにより、ユニオン型の各要素を個別に処理できる
- **注意**: 分配が起こるのは、チェックされる型（`T`）がジェネリック型パラメータで、かつ直接使用されている場合のみ

**3. `never` 型**

- TypeScript における「存在しない型」を表す特殊な型
- 値を持つことができない型（ボトム型）
- ユニオン型において、`never` は自動的に除外される
  - 例: `string | never` → `string`
  - 例: `'a' | 'b' | never` → `'a' | 'b'`
- この性質により、フィルタリングの実装が可能になる

#### 実行フロー

1. **ジェネリック型の受け取り**
   - `T`: 元のユニオン型（例: `'a' | 'b' | 'c'`）
   - `U`: 除外したい型（例: `'a'`）

2. **分配的条件型による展開**
   - T がユニオン型の場合、各メンバーに対して条件型が分配される
   - `MyExclude<'a' | 'b' | 'c', 'a'>` は以下のように展開：
     ```typescript
     ('a' extends 'a' ? never : 'a') |
     ('b' extends 'a' ? never : 'b') |
     ('c' extends 'a' ? never : 'c')
     ```

3. **各メンバーの条件チェック**
   - 各型が U に割り当て可能かをチェック
   - 割り当て可能（U のサブタイプ）なら `never`
   - 割り当て不可能なら元の型 `T`

4. **never の自動除外**
   - ユニオン型から `never` が自動的に除外される
   - 結果として、U に一致しない型のみが残る

#### 実行例

```typescript
type Result = MyExclude<'a' | 'b' | 'c', 'a'>
```

1. `T` は `'a' | 'b' | 'c'`、`U` は `'a'`
2. 分配的条件型により、各メンバーに展開：
   - `'a' extends 'a'` → `true` → `never`
   - `'b' extends 'a'` → `false` → `'b'`
   - `'c' extends 'a'` → `false` → `'c'`
3. 結果: `never | 'b' | 'c'`
4. never が除外され、最終結果: `'b' | 'c'`

**より複雑な例**

```typescript
type Result2 = MyExclude<'a' | 'b' | 'c', 'a' | 'b'>
```

1. `T` は `'a' | 'b' | 'c'`、`U` は `'a' | 'b'`
2. 各メンバーに展開：
   - `'a' extends ('a' | 'b')` → `true` → `never`
   - `'b' extends ('a' | 'b')` → `true` → `never`
   - `'c' extends ('a' | 'b')` → `false` → `'c'`
3. 結果: `'c'`

**関数型の除外**

```typescript
type Result3 = MyExclude<string | number | (() => void), Function>
```

1. `T` は `string | number | (() => void)`、`U` は `Function`
2. 各メンバーに展開：
   - `string extends Function` → `false` → `string`
   - `number extends Function` → `false` → `number`
   - `(() => void) extends Function` → `true` → `never`
3. 結果: `string | number`

### なぜこのように書くのか

**分配的条件型の活用**
- Conditional Types の分配の性質により、ユニオン型の各メンバーを個別に処理できる
- 明示的なループや再帰を必要とせず、宣言的に記述できる
- TypeScript の型システムが自動的に各メンバーを処理

**never 型によるフィルタリング**
- never がユニオン型から自動除外される性質を利用
- 条件に一致する型を never に変換することで、自然にフィルタリングが実現される
- 追加の処理やロジックが不要

**簡潔で強力**
- わずか1行で複雑なフィルタリングロジックを実装
- 任意のユニオン型と任意の除外条件に対応
- TypeScript の組み込み `Exclude<T, U>` と同じ動作を実現

**型安全性の確保**
- コンパイル時に型のチェックと除外が行われる
- ランタイムオーバーヘッドがゼロ
- 型レベルでのフィルタリングにより、誤った型の使用を防止

### 分配的条件型が起こらない場合

分配を防ぐには、型パラメータを配列やタプルで囲みます：

```typescript
type NoDistribute<T, U> = [T] extends [U] ? never : T

// 分配されない例
type Test1 = NoDistribute<'a' | 'b', 'a'> // 'a' | 'b'（除外されない）
// [T] = ['a' | 'b'] は ['a'] に extends しないため

// 通常の MyExclude（分配される）
type Test2 = MyExclude<'a' | 'b', 'a'> // 'b'（'a'が除外される）
```

この違いを理解することで、分配的条件型の動作原理がより深く理解できます。
