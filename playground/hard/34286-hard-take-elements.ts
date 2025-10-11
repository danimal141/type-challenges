/*
  34286 - Take Elements
  -------
  by Eirik Måseidvåg (@Eirmas) #上級 #array

  ### 質問

  Implement a type `Take<N, Arr>` that returns the first `N` elements from an array `Arr`. If `N` is negative, return the last `|N|` elements

  For example,
  ```ts
  type T0 = Take<2, [1, 2, 3]> // [1, 2]
  type T1 = Take<3, ['1', 2, true, false]> // ['1', 2, true]
  type T2 = Take<-2, [1, 2, 3]> // [2, 3]
  type T3 = Take<0, [1, 2, 3]> // []
  type T4 = Take<5, [1, 2, 3]> // [1, 2, 3]
  type T5 = Take<3, []> // []
  ```

  > GitHubで確認する：https://tsch.js.org/34286/ja
*/

/* _____________ ここにコードを記入 _____________ */

type Take<N, Arr> = Arr

/* _____________ テストケース _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Take<2, [1, 2, 3]>, [1, 2]>>,
  Expect<Equal<Take<3, ['1', 2, true, false]>, ['1', 2, true]>>,
  Expect<Equal<Take<-2, [1, 2, 3]>, [2, 3]>>,
  Expect<Equal<Take<0, [1, 2, 3]>, []>>,
  Expect<Equal<Take<5, [1, 2, 3]>, [1, 2, 3]>>,
  Expect<Equal<Take<3, []>, []>>,
]

/* _____________ 次のステップ _____________ */
/*
  > 解答を共有する：https://tsch.js.org/34286/answer/ja
  > 解答を見る：https://tsch.js.org/34286/solutions
  > その他の課題：https://tsch.js.org/ja
*/
