# TypeScript Type Challenges 解説

## 00898 - Includes

### 問題

JavaScriptの`Array.includes`関数を型システムに実装します。この型は、2 つの引数を受け取り、`true`や`false`を出力しなければなりません。

例えば：

```typescript
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

### 解答

```typescript
type Includes<T extends readonly any[], U> = T extends [infer First, ...infer Rest]
  ? Equal<U, First> extends true
    ? true
    : Includes<Rest, U>
  : false
```

### 解説

#### 構文要素

**1. `T extends readonly any[]`**

- `readonly any[]`: 読み取り専用の配列型を示す制約
- `readonly`を付けることで、通常の配列だけでなく読み取り専用配列（`readonly`修飾子付き）も受け入れられる
- 例: `['a', 'b']` と `readonly ['a', 'b']` の両方に対応
- 配列型のジェネリック制約により、型安全性を保証

**2. `T extends [infer First, ...infer Rest]`**

- Conditional Types（条件型）とパターンマッチングの組み合わせ
- `infer First`: 配列の最初の要素の型を推論して`First`に代入
- `...infer Rest`: 残りの要素を配列型として推論して`Rest`に代入（Rest Parameters的な構文）
- 配列が1つ以上の要素を持つ場合に`true`分岐に入る
- 配列が空の場合は`false`分岐に入る（パターンマッチング失敗）
- この構文により、配列を先頭要素と残りに分解できる

**3. `Equal<U, First> extends true`**

- `Equal`は型の厳密な等価性をチェックするユーティリティ型
- 単純な`U extends First`や`First extends U`では不十分
  - 理由: `boolean extends true` は `false` だが、`true extends boolean` は `true` になる
  - 理由: `readonly`修飾子の違いなど、微妙な型の差異を検出できない
- `Equal<A, B>`は、AとBが完全に同じ型の場合のみ`true`を返す
- これにより、`boolean`と`true`、`{ a: 'A' }`と`{ readonly a: 'A' }`などを区別できる

**4. 再帰的な型定義**

- `Includes<Rest, U>`: 自分自身を呼び出すことで、配列の各要素を順番にチェック
- TypeScriptの型システムは再帰的な型定義をサポート（一定の深さ制限あり）
- 配列を1要素ずつ処理していくループのような動作を実現

#### 実行フロー

1. **ジェネリック型の受け取り**
   - `T`: チェック対象の配列型（例: `['Kars', 'Esidisi', 'Wamuu', 'Santana']`）
   - `U`: 検索する要素の型（例: `'Dio'`）

2. **配列の分解**
   - `T extends [infer First, ...infer Rest]`で配列をパターンマッチング
   - 成功した場合: 配列に要素があるので、先頭要素を`First`、残りを`Rest`に代入
   - 失敗した場合: 配列が空なので、`false`を返す（要素が見つからなかった）

3. **型の比較**
   - `Equal<U, First> extends true`で検索対象と先頭要素を厳密に比較
   - 一致する場合: `true`を返す（要素が見つかった）
   - 一致しない場合: 次のステップへ

4. **再帰呼び出し**
   - `Includes<Rest, U>`で残りの配列に対して同じ処理を繰り返す
   - これにより、配列の全要素を順番にチェック

5. **終了条件**
   - 要素が見つかった場合: `true`
   - 配列を全て調べて見つからなかった場合: `false`

#### 実行例

```typescript
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'>
```

1. `T` = `['Kars', 'Esidisi', 'Wamuu', 'Santana']`, `U` = `'Dio'`
2. 配列を分解: `First` = `'Kars'`, `Rest` = `['Esidisi', 'Wamuu', 'Santana']`
3. `Equal<'Dio', 'Kars'>` → `false`なので、再帰呼び出し
4. `Includes<['Esidisi', 'Wamuu', 'Santana'], 'Dio'>`
   - `First` = `'Esidisi'`, `Rest` = `['Wamuu', 'Santana']`
   - `Equal<'Dio', 'Esidisi'>` → `false`なので、再帰呼び出し
5. `Includes<['Wamuu', 'Santana'], 'Dio'>`
   - `First` = `'Wamuu'`, `Rest` = `['Santana']`
   - `Equal<'Dio', 'Wamuu'>` → `false`なので、再帰呼び出し
6. `Includes<['Santana'], 'Dio'>`
   - `First` = `'Santana'`, `Rest` = `[]`
   - `Equal<'Dio', 'Santana'>` → `false`なので、再帰呼び出し
7. `Includes<[], 'Dio'>`
   - `[] extends [infer First, ...infer Rest]` → `false`（空配列はパターンマッチング失敗）
   - 最終結果: `false`

```typescript
type hasKars = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>
```

1. `T` = `['Kars', 'Esidisi', 'Wamuu', 'Santana']`, `U` = `'Kars'`
2. 配列を分解: `First` = `'Kars'`, `Rest` = `['Esidisi', 'Wamuu', 'Santana']`
3. `Equal<'Kars', 'Kars'>` → `true`
4. 最終結果: `true`（最初の要素で一致）

### なぜ`Equal`が必要なのか

**`boolean`と`true`/`false`の区別**

```typescript
// Equal を使わない場合の問題
type Test1 = Includes<[boolean], false> // 期待: false、実際: true になってしまう可能性

// boolean は true | false のユニオン型
// false extends boolean は true だが、Equal<false, boolean> は false
type Test2 = Includes<[boolean, 2, 3], false> // 正しく false を返す
type Test3 = Includes<[true, 2, 3], boolean> // 正しく false を返す
```

**`readonly`修飾子の区別**

```typescript
type Test4 = Includes<[{ a: 'A' }], { readonly a: 'A' }> // false
type Test5 = Includes<[{ readonly a: 'A' }], { a: 'A' }> // false

// readonly の有無は型として異なるため、Equal で厳密にチェック
```

**ユニオン型との区別**

```typescript
type Test6 = Includes<[1], 1 | 2> // false（1 と 1|2 は異なる型）
type Test7 = Includes<[1 | 2], 1> // false（1|2 と 1 は異なる型）

// 単純な extends では、1 extends 1|2 は true になってしまう
// Equal を使うことで厳密な型の一致を判定
```

### 型レベル再帰の仕組み

この実装は、JavaScriptのループを型レベルで再現しています：

```typescript
// JavaScript の equivalent
function includes(arr, target) {
  if (arr.length === 0) return false;
  const [first, ...rest] = arr;
  if (first === target) return true;
  return includes(rest, target);
}
```

TypeScriptの型システムでは、以下の対応関係があります：
- JavaScript の `if (arr.length === 0)` → 型の `T extends [infer First, ...infer Rest]` のパターンマッチング失敗
- JavaScript の `const [first, ...rest] = arr` → 型の `infer First, ...infer Rest`
- JavaScript の `first === target` → 型の `Equal<U, First> extends true`
- JavaScript の `return includes(rest, target)` → 型の `Includes<Rest, U>`

この対応により、ランタイムのロジックを型レベルで表現しています。

### Equal型の実装

`Equal`型は `@type-challenges/utils` で以下のように実装されています：

```typescript
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false
```

#### ジェネリック関数の型互換性を利用したトリック

この実装は、TypeScriptの型システムの深い部分を利用した高度なテクニックです。

**基本原理：**
- TypeScriptでは、**2つのジェネリック関数の型が完全に同じ場合にのみ、互いに代入可能**
- この特性を利用して、型の厳密な等価性をチェックする

**通常の`extends`との違い：**

```typescript
// 通常の extends は包含関係をチェック
type Test1 = false extends boolean ? true : false  // true（falseはbooleanのサブタイプ）

// ジェネリック関数を使うと厳密に比較される
type Func1 = <T>() => T extends false ? 1 : 2
type Func2 = <T>() => T extends boolean ? 1 : 2
type Test2 = Func1 extends Func2 ? true : false  // false（関数の振る舞いが異なる）
```

#### 条件型の役割

`T extends X ? 1 : 2` という条件型は、**Xの型情報を関数のシグネチャに埋め込む**ために使われます。

```typescript
// X = false の場合
<T>() => T extends false ? 1 : 2

// X = boolean の場合
<T>() => T extends boolean ? 1 : 2

// X = 1 | 2 の場合
<T>() => T extends (1 | 2) ? 1 : 2
```

それぞれ**異なる関数型**になり、その違いが検出されます。

#### なぜ完全一致だけがtrueになるのか

ジェネリック型パラメータ `T` は**すべての可能な型**を表します。2つの関数型が `extends` で一致するには、**すべての可能なTに対して同じ結果を返す**必要があります。

**例1: `Equal<false, boolean>` の場合**

```typescript
type Left  = <T>() => T extends false ? 1 : 2
type Right = <T>() => T extends boolean ? 1 : 2

// 任意のTに対して：
//   - T = string のとき:  Left → 2, Right → 2 (同じ)
//   - T = number のとき:  Left → 2, Right → 2 (同じ)
//   - T = true のとき:    Left → 2, Right → 1 (違う！)
//   ↑ここで違いが検出される
// → Left extends Right は false
// → Equal<false, boolean> = false
```

**例2: `Equal<boolean, boolean>` の場合**

```typescript
type Left  = <T>() => T extends boolean ? 1 : 2
type Right = <T>() => T extends boolean ? 1 : 2

// 任意のTに対して：
//   - T = string のとき:  Left → 2, Right → 2
//   - T = number のとき:  Left → 2, Right → 2
//   - T = boolean のとき: Left → 1, Right → 1
//   - T = true のとき:    Left → 1, Right → 1
//   - すべてのケースで同じ結果！
// → Left extends Right は true
// → Equal<boolean, boolean> = true
```

#### 実際の比較例

**1. 包含関係がある型**

```typescript
type Test = Equal<1, number>
// <T>() => T extends 1 ? 1 : 2
// <T>() => T extends number ? 1 : 2
// T = 1.5 のとき: 左は2、右は1 → 違う → false
```

**2. Union型**

```typescript
type Test = Equal<1 | 2, 1>
// <T>() => T extends (1 | 2) ? 1 : 2
// <T>() => T extends 1 ? 1 : 2
// T = 2 のとき: 左は1、右は2 → 違う → false
```

**3. readonly修飾子の違い**

```typescript
type Test = Equal<{ a: string }, { readonly a: string }>
// <T>() => T extends { a: string } ? 1 : 2
// <T>() => T extends { readonly a: string } ? 1 : 2
// readonly の有無で extends の振る舞いが変わる → false
```

**4. 完全一致**

```typescript
type Test = Equal<{ a: string }, { a: string }>
// <T>() => T extends { a: string } ? 1 : 2
// <T>() => T extends { a: string } ? 1 : 2
// まったく同じ → true
```

#### まとめ

この実装の天才的なポイント：

1. **ジェネリック型パラメータ `T`** が「すべての可能な型」を走査する
2. **条件型** `T extends X ? 1 : 2` が型Xの特性を関数シグネチャに変換する
3. **2つの関数が同じシグネチャを持つ** = XとYがすべてのケースで同じ振る舞い = **完全に同じ型**

これにより、単純な `extends` では判別できない微妙な型の違い（readonly、Union型、リテラル型など）も正確に検出できます。
