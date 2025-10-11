/*
  35191 - Trace
  -------
  by csharpython (@csharpython) #中級

  ### 質問

  行列において、トレースは主対角成分の総和です。
  それを型システムを使って求めたいです。
  しかし、型で数を足すのは難しいため、代わりに主対角成分のユニオン型を求めてください。

  例：
  ```ts
  type Arr = [
    [1,2],
    [3,4]
  ]
  type Test = Trace<Arr> // expected to be 1 | 4
  ```

  > GitHubで確認する：https://tsch.js.org/35191/ja
*/

/* _____________ ここにコードを記入 _____________ */

type Trace<T extends any[][]> = any

/* _____________ テストケース _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Trace<[[1, 2], [3, 4]]>, 1 | 4>>,
  Expect<Equal<Trace<[[0, 1, 1], [2, 0, 2], [3, 3, 0]]>, 0>>,
  Expect<Equal<Trace<[['a', 'b', ''], ['c', '', ''], ['d', 'e', 'f']]>, 'a' | '' | 'f'>>,
]

/* _____________ 次のステップ _____________ */
/*
  > 解答を共有する：https://tsch.js.org/35191/answer/ja
  > 解答を見る：https://tsch.js.org/35191/solutions
  > その他の課題：https://tsch.js.org/ja
*/
