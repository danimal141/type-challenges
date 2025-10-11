/*
  35991 - MyUppercase
  -------
  by NaNix (@fusheng33) #中級

  ### 質問

  Implement `Uppercase<T>`, convert all letter to uppercase

  > GitHubで確認する：https://tsch.js.org/35991/ja
*/

/* _____________ ここにコードを記入 _____________ */

type MyUppercase<T extends string> = any

/* _____________ テストケース _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MyUppercase<'a'>, 'A'>>,
  Expect<Equal<MyUppercase<'Z'>, 'Z'>>,
  Expect<Equal<MyUppercase<'A z h yy 😃cda\n\t  a   '>, 'A Z H YY 😃CDA\n\t  A   '>>,
]

/* _____________ 次のステップ _____________ */
/*
  > 解答を共有する：https://tsch.js.org/35991/answer/ja
  > 解答を見る：https://tsch.js.org/35991/solutions
  > その他の課題：https://tsch.js.org/ja
*/
