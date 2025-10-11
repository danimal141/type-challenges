/*
  33763 - Union to Object from key
  -------
  by clen cat (@a145789) #上級

  ### 質問

  Find the object containing the key in the union type by the key. It  takes two parameters: a union of object types and a key name.

  > GitHubで確認する：https://tsch.js.org/33763/ja
*/

/* _____________ ここにコードを記入 _____________ */

type UnionToObjectFromKey<Union, Key> = any

/* _____________ テストケース _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type Foo = {
  foo: string
  common: boolean
}

type Bar = {
  bar: number
  common: boolean
}

type Other = {
  other: string
}

type cases = [
  Expect<Equal<UnionToObjectFromKey<Foo | Bar, 'foo'>, Foo>>,
  Expect<Equal<UnionToObjectFromKey<Foo | Bar, 'common'>, {
    foo: string
    common: boolean
  } | {
    bar: number
    common: boolean
  }>>,
  Expect<Equal<UnionToObjectFromKey<Foo | Bar | Other, 'common'>, {
    foo: string
    common: boolean
  } | {
    bar: number
    common: boolean
  }>>,
]

/* _____________ 次のステップ _____________ */
/*
  > 解答を共有する：https://tsch.js.org/33763/answer/ja
  > 解答を見る：https://tsch.js.org/33763/solutions
  > その他の課題：https://tsch.js.org/ja
*/
