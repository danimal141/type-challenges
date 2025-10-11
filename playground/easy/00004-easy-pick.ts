/*
  4 - Pick
  -------
  by Anthony Fu (@antfu) #初級 #union #built-in

  ### 質問

  組み込みの型ユーティリティ`Pick<T, K>`を使用せず、`T`から`K`のプロパティを抽出する型を実装します。

  例えば：

  ```ts
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

  > GitHubで確認する：https://tsch.js.org/4/ja
*/

/* _____________ ここにコードを記入 _____________ */

/*
## 問題の目的

Pick<T, K> という組み込み型ユーティリティを自分で実装することです。これは、オブジェクト型 T から、指定したキー K だけを持つ新しい型を作ります。

## 解答
  type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
  }

## 各部分の説明

  1. K extends keyof T

  - keyof T: T のすべてのキーをユニオン型として取得
    - 例: Todo なら 'title' | 'description' | 'completed'
  - K extends ...: K が T のキーでなければならないという制約
  - これにより、存在しないキー（例: 'invalid'）を指定するとコンパイルエラーになります

  2. [P in K]

  - Mapped Types の構文
  - K に含まれる各キーに対してループ処理を行う
  - 例: K が 'title' | 'completed' なら、P は最初 'title'、次に 'completed' となる

  3. T[P]

  - Indexed Access Types
  - T から P というキーの型を取得
  - 例: Todo['title'] は string

## 実行例

  type TodoPreview = MyPick<Todo, 'title' | 'completed'>

  1. K は 'title' | 'completed'
  2. Mapped Types により：
    - P = 'title' のとき → title: Todo['title'] → title: string
    - P = 'completed' のとき → completed: Todo['completed'] → completed: boolean
  3. 結果:
  {
    title: string
    completed: boolean
  }

## なぜこのように書くのか

  - 型安全性: extends keyof T により、存在しないキーを防ぐ
  - 柔軟性: 任意のオブジェクト型と任意のキーの組み合わせに対応
  - 元の型を保持: T[P] により、元のプロパティの型が正確に保たれる
*/

type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

/* _____________ テストケース _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Expected1, MyPick<Todo, 'title'>>>,
  Expect<Equal<Expected2, MyPick<Todo, 'title' | 'completed'>>>,
  // @ts-expect-error
  MyPick<Todo, 'title' | 'completed' | 'invalid'>,
]

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
}

interface Expected2 {
  title: string
  completed: boolean
}

/* _____________ 次のステップ _____________ */
/*
  > 解答を共有する：https://tsch.js.org/4/answer/ja
  > 解答を見る：https://tsch.js.org/4/solutions
  > その他の課題：https://tsch.js.org/ja
*/
