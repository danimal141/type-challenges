/*
  34007 - Compare Array Length
  -------
  by alviner (@ScriptBloom) #中級 #recursion #array

  ### 質問

  Implement `CompareArrayLength` to compare two array length(T & U).

  If length of T array is greater than U, return 1;
  If length of U array is greater than T, return -1;
  If length of T array is equal to U, return 0.

  > GitHubで確認する：https://tsch.js.org/34007/ja
*/

/* _____________ ここにコードを記入 _____________ */

type CompareArrayLength<T extends any[], U extends any[]> = any

/* _____________ テストケース _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CompareArrayLength<[1, 2, 3, 4], [5, 6]>, 1>>,
  Expect<Equal<CompareArrayLength<[1, 2], [3, 4, 5, 6]>, -1>>,
  Expect<Equal<CompareArrayLength<[], []>, 0>>,
  Expect<Equal<CompareArrayLength<[1, 2, 3], [4, 5, 6]>, 0>>,
]

/* _____________ 次のステップ _____________ */
/*
  > 解答を共有する：https://tsch.js.org/34007/answer/ja
  > 解答を見る：https://tsch.js.org/34007/solutions
  > その他の課題：https://tsch.js.org/ja
*/
