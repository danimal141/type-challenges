# TypeScript Type Challenges 解説

## 00004 - Pick

### 問題

組み込みの型ユーティリティ`Pick<T, K>`を使用せず、`T`から`K`のプロパティを抽出する型を実装します。

例えば：

```typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

### 解答

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

### 解説

#### 構文要素

**1. `K extends keyof T`**

- `keyof T`: T のすべてのキーをユニオン型として取得
  - 例: `Todo` なら `'title' | 'description' | 'completed'`
- `K extends ...`: K が T のキーでなければならないという制約（ジェネリック制約）
- これにより、存在しないキー（例: `'invalid'`）を指定するとコンパイルエラーになります
- 型安全性を保証する重要な仕組み

**2. `[P in K]`**

- Mapped Types（マップ型）の構文
- K に含まれる各キーに対してループ処理を行う
- 例: K が `'title' | 'completed'` なら、P は最初 `'title'`、次に `'completed'` となる
- この構文により、動的に型を生成できる

**3. `T[P]`**

- Indexed Access Types（インデックスアクセス型）
- T から P というキーの型を取得
- 例: `Todo['title']` は `string`、`Todo['completed']` は `boolean`
- 元のプロパティの型を正確に保持する

#### 実行フロー

1. **ジェネリック型の受け取り**
   - `T`: 元のオブジェクト型（例: `Todo`）
   - `K`: 抽出したいキーのユニオン型（例: `'title' | 'completed'`）

2. **制約チェック**
   - `K extends keyof T` により、K が T の有効なキーであることを検証
   - 無効なキーが含まれている場合、コンパイル時にエラーが発生

3. **Mapped Types による型の構築**
   - `[P in K]` により、K の各キーに対してループ
   - 各キー P に対して、`T[P]` で元の型を取得
   - 新しいオブジェクト型が生成される

#### 実行例

```typescript
type TodoPreview = MyPick<Todo, 'title' | 'completed'>
```

1. `T` は `Todo`、`K` は `'title' | 'completed'`
2. `K extends keyof Todo` をチェック
   - `keyof Todo` = `'title' | 'description' | 'completed'`
   - `'title' | 'completed'` はこのサブセットなので OK
3. Mapped Types により：
   - `P = 'title'` のとき → `title: Todo['title']` → `title: string`
   - `P = 'completed'` のとき → `completed: Todo['completed']` → `completed: boolean`
4. 結果の型:
```typescript
{
  title: string
  completed: boolean
}
```

### なぜこのように書くのか

**型安全性の確保**
- `extends keyof T` により、存在しないキーを指定した場合にコンパイルエラーが発生
- ランタイムエラーを防ぎ、開発時に問題を発見できる

**柔軟性**
- 任意のオブジェクト型と任意のキーの組み合わせに対応
- 再利用可能な汎用的な型ユーティリティ

**元の型の保持**
- `T[P]` により、元のプロパティの型が正確に保たれる
- 型情報の損失がない

**宣言的な記述**
- Mapped Types により、各プロパティを個別に列挙する必要がない
- コードが簡潔で保守しやすい
