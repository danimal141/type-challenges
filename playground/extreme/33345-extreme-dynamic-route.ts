/*
  33345 - Dynamic Route
  -------
  by 0753 (@0753Ljuc) #最上級

  ### 質問

  Given below routes, infer its dynamic params.
  | Route                          | Params Type Definition                                                                                     |
  |--------------------------------|------------------------------------------------------------------------------------------------------------|
  | `/blog/[slug]/page.js`         | `{ slug: string }`                                                                                         |
  | `/shop/[...slug]/page.js`      | `{ slug: string[] }`                                                                                       |
  | `/shop/[[...slug]]/page.js`    | `{ slug?: string[] }`                                                                                      |
  | `/[categoryId]/[itemId]/page.js` | `{ categoryId: string, itemId: string }`                                                                 |
  | `/app/[...foo]/[...bar]`       | `never` - It's ambiguous as we cannot decide if `b` on `/app/a/b/c` is belongs to `foo` or `bar`.          |
  | `/[[...foo]]/[slug]/[...bar]`  | `never`                                                                                                    |
  | `/[first]/[[...foo]]/stub/[...bar]/[last]` | `{ first: string, foo?: string[], bar: string[], last: string }`                               |

  > GitHubで確認する：https://tsch.js.org/33345/ja
*/

/* _____________ ここにコードを記入 _____________ */

type DynamicRoute<T extends string> = any

/* _____________ テストケース _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<DynamicRoute<'/shop'>, {}>>,
  Expect<Equal<DynamicRoute<'/shop/[]'>, {}>>,
  Expect<Equal<DynamicRoute<'/shop/[slug]'>, { slug: string }>>,
  Expect<Equal<DynamicRoute<'/shop/[slug]/'>, { slug: string }>>,
  Expect<
    Equal<DynamicRoute<'/shop/[slug]/[foo]'>, { slug: string, foo: string }>
  >,
  Expect<
    Equal<
      DynamicRoute<'/shop/[slug]/stub/[foo]'>,
      { slug: string, foo: string }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<'/shop/[slug]/stub/[foo]'>,
      { slug: string, foo: string }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<'/shop/[slug]/stub/[...foo]'>,
      { slug: string, foo: string[] }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<'/shop/[slug]/stub/[[...foo]]'>,
      { slug: string, foo?: string[] }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<'/shop/[slug]/stub/[[...foo]]/[]'>,
      { slug: string, foo?: string[] }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<'/shop/[slug]/stub/[[...foo]]/[...]'>,
      { slug: string, foo?: string[], '...': string }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<'/shop/[slug]/stub/[[...foo]]/[...]/[]index.html'>,
      { slug: string, foo?: string[], '...': string }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<'/shop/[slug]/stub/[[...foo]]/[...]/[...]index.html'>,
      { slug: string, foo?: string[], '...': string }
    >
  >,
  Expect<Equal<DynamicRoute<'/[slug]/[[...foo]]/[...bar]'>, never>>,
  Expect<Equal<DynamicRoute<'/[[...foo]]/[slug]/[...bar]'>, never>>,
  Expect<Equal<DynamicRoute<'/[[...foo]]/[...bar]/static'>, never>>,
  Expect<
    Equal<
      DynamicRoute<'[[...foo]]/stub/[...bar]'>,
      { foo?: string[], bar: string[] }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<'[first]/[[...foo]]/stub/[...bar]/[last]'>,
      { first: string, foo?: string[], bar: string[], last: string }
    >
  >,
]

/* _____________ 次のステップ _____________ */
/*
  > 解答を共有する：https://tsch.js.org/33345/answer/ja
  > 解答を見る：https://tsch.js.org/33345/solutions
  > その他の課題：https://tsch.js.org/ja
*/
