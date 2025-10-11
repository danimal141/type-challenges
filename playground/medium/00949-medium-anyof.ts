/*
  949 - AnyOf
  -------
  by null (@kynefuk) #中級 #array

  ### 質問

  Pythonの `any` 関数のような型を実装してください。実装する型は配列を受け取り、その配列のいずれかの要素が真ならば `true` を返します。なお、受け取った配列が空配列の場合は `false` を返します。

  例えば:

  ```ts
  type Sample1 = AnyOf<[1, "", false, [], {}]> // expected to be true.
  type Sample2 = AnyOf<[0, "", false, [], {}]> // expected to be false.
  ```

  > GitHubで確認する：https://tsch.js.org/949/ja
*/

/* _____________ ここにコードを記入 _____________ */

type AnyOf<T extends readonly any[]> = any

/* _____________ テストケース _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<AnyOf<[1, 'test', true, [1], { name: 'test' }, { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[1, '', false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, 'test', false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', true, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [1], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { name: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { name: 'test' }, { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], {}, undefined, null]>, false>>,
  Expect<Equal<AnyOf<[]>, false>>,
]

/* _____________ 次のステップ _____________ */
/*
  > 解答を共有する：https://tsch.js.org/949/answer/ja
  > 解答を見る：https://tsch.js.org/949/solutions
  > その他の課題：https://tsch.js.org/ja
*/
