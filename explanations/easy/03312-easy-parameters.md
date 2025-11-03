# TypeScript Type Challenges 解説

## 03312 - Parameters

### 問題

組み込みの型ユーティリティ`Parameters<T>`を使用せず、`T`からタプル型を構築する型を実装します。

例えば：

```typescript
const foo = (arg1: string, arg2: number): void => {}

type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
```

### 解答

```typescript
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never
```

### 解説

#### 構文要素

**1. `T extends (...args: any[]) => any`**

- `(...args: any[]) => any`: 任意の引数を取り、任意の値を返す関数型
- `T extends ...`: T が関数型でなければならないという制約（ジェネリック制約）
- これにより、関数型以外（例: `string` や `number`）を指定するとコンパイルエラーになります
- 型安全性を保証する重要な仕組み

**2. `infer P`**

- Conditional Types 内で型を推論するための特別なキーワード
- `infer P` は「この位置にある型を P として推論する」という意味
- この場合、関数の引数部分の型を P に推論させる
- `infer` は Conditional Types (`extends` を使った条件分岐) の中でのみ使用可能

**3. Conditional Types（条件付き型）**

- `T extends (...args: infer P) => any ? P : never` の構文
- `T extends パターン ? 真の場合 : 偽の場合` という条件分岐
- T がパターンにマッチすれば P を返し、マッチしなければ never を返す
- パターンマッチングと型推論を組み合わせた強力な機能

**4. タプル型**

- 関数の引数は内部的にタプル型として表現される
- 例: `(arg1: string, arg2: number)` は `[string, number]` というタプル型
- タプル型は配列と似ているが、各要素の型と順序が固定されている
- この型推論により、引数の型情報を正確に抽出できる

#### 実行フロー

1. **ジェネリック型の受け取りと制約チェック**
   - `T`: 関数型（例: `typeof foo`）
   - `T extends (...args: any[]) => any` により、T が関数型であることを検証
   - 関数型以外が渡された場合、コンパイル時にエラーが発生

2. **Conditional Types による型のパターンマッチング**
   - `T extends (...args: infer P) => any` で T を分解
   - T が関数型の場合、その引数部分の型を P に推論
   - 例: `(arg1: string, arg2: number) => void` の場合、P は `[string, number]` と推論される

3. **条件分岐の結果**
   - マッチに成功した場合: 推論された P（引数のタプル型）を返す
   - マッチに失敗した場合: never を返す（ただし制約により通常は発生しない）

#### 実行例

```typescript
const foo = (arg1: string, arg2: number): void => {}
type FunctionParamsType = MyParameters<typeof foo>
```

1. `T` は `typeof foo`、つまり `(arg1: string, arg2: number) => void`
2. `T extends (...args: any[]) => any` をチェック
   - 関数型なので OK
3. Conditional Types により：
   - `T extends (...args: infer P) => any` でパターンマッチング
   - 引数部分 `(arg1: string, arg2: number)` から P を推論
   - P は `[string, number]` と推論される
4. 条件が真なので P を返す
5. 結果の型:
```typescript
[string, number]
```

**引数なしの関数の場合**

```typescript
function baz(): void {}
type BazParams = MyParameters<typeof baz> // []
```

- 引数がない場合、P は空のタプル型 `[]` と推論される

### なぜこのように書くのか

**型レベルでの関数の分解**
- `infer` を使うことで、関数型を分解して引数部分だけを抽出できる
- 戻り値の型は `any` として無視し、引数部分だけに注目

**型安全性の確保**
- `extends (...args: any[]) => any` により、関数型以外を指定した場合にコンパイルエラーが発生
- ランタイムエラーを防ぎ、開発時に問題を発見できる

**タプル型による正確な型の保持**
- 引数はタプル型として抽出されるため、各引数の型と順序が完全に保持される
- 引数名は失われるが、型情報は完全に保たれる

**宣言的な記述**
- Conditional Types と infer により、複雑な型操作を簡潔に表現
- 一行で関数の引数型を抽出できる

**組み込み型との互換性**
- この実装は組み込みの `Parameters<T>` と同等の機能を提供
- TypeScript の型システムの仕組みを理解するための良い教材
