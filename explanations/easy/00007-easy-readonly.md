# TypeScript Type Challenges 解説

## 00007 - Readonly

### 問題

組み込みの型ユーティリティ`Readonly<T>`を使用せず、`T` のすべてのプロパティを読み取り専用にする型を実装します。実装された型のプロパティは再割り当てできません。

例えば：

```typescript
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
```

### 解答

```typescript
type MyReadonly<T> = { readonly [P in keyof T]: T[P] }
```

### 解説

#### 構文要素

**1. `readonly` 修飾子**

- プロパティを読み取り専用にするTypeScriptの修飾子
- `readonly` が付いたプロパティは、初期化後に再代入できなくなる
- オブジェクトの不変性を型レベルで保証する
- 例: `readonly title: string` は代入不可

**2. `[P in keyof T]`**

- Mapped Types（マップ型）の構文
- `keyof T` で T のすべてのキーをユニオン型として取得
  - 例: `Todo` なら `'title' | 'description'`
- `P in ...` により、各キーに対してループ処理を行う
- すべてのプロパティに対して一括で変換を適用できる

**3. `T[P]`**

- Indexed Access Types（インデックスアクセス型）
- T から P というキーの型を取得
- 例: `Todo['title']` は `string`、`Todo['description']` は `string`
- 元のプロパティの型を正確に保持する

#### 実行フロー

1. **ジェネリック型の受け取り**
   - `T`: 元のオブジェクト型（例: `Todo`）
   - すべてのプロパティに `readonly` を適用する

2. **keyof による全キーの取得**
   - `keyof T` により、T のすべてのプロパティキーをユニオン型として取得
   - 例: `keyof Todo` = `'title' | 'description'`

3. **Mapped Types による型の構築**
   - `[P in keyof T]` により、T の各キーに対してループ
   - 各キー P に対して：
     - `readonly` 修飾子を追加
     - `T[P]` で元の型を取得
   - 新しい読み取り専用のオブジェクト型が生成される

#### 実行例

```typescript
type MyReadonlyTodo = MyReadonly<Todo>
```

1. `T` は `Todo`
2. `keyof Todo` = `'title' | 'description'`
3. Mapped Types により：
   - `P = 'title'` のとき → `readonly title: Todo['title']` → `readonly title: string`
   - `P = 'description'` のとき → `readonly description: Todo['description']` → `readonly description: string`
4. 結果の型:
```typescript
{
  readonly title: string
  readonly description: string
}
```

5. 使用例:
```typescript
const todo: MyReadonlyTodo = {
  title: "Hey",
  description: "foobar"
}

// コンパイルエラー: Cannot assign to 'title' because it is a read-only property
todo.title = "Hello"
```

### なぜこのように書くのか

**不変性の保証**
- `readonly` 修飾子により、オブジェクトのプロパティが変更されないことを型レベルで保証
- バグの原因となる予期しない変更を防ぐ
- 関数型プログラミングのパラダイムに適合

**型安全性の確保**
- コンパイル時にプロパティへの再代入を検出
- ランタイムエラーを防ぎ、開発時に問題を発見できる
- IDEによる警告やエラー表示で、コーディング中に気づける

**柔軟性**
- 任意のオブジェクト型に対応
- 再利用可能な汎用的な型ユーティリティ
- ネストしたオブジェクトにも適用可能（ただし、この実装では1階層のみ）

**元の型の保持**
- `T[P]` により、元のプロパティの型が正確に保たれる
- 型情報の損失がない
- プロパティの型に応じた適切な型チェックが行われる

**宣言的な記述**
- Mapped Types により、各プロパティを個別に列挙する必要がない
- コードが簡潔で保守しやすい
- プロパティが追加・削除されても自動的に対応
