/*
  35045 - Longest Common Prefix
  -------
  by Tom Cleary (@thomcleary) #中級

  ### 質問

  ### Longest Common Prefix

  Write a type, `LongestCommonPrefix` that returns the longest common prefix string amongst a tuple of strings.

  If there is no common prefix, return an empty string `""`.

  ```ts
  type Common = LongestCommonPrefix<["flower", "flow", "flight"]>
  //   ?^ "fl"

  type Uncommon = LongestCommonPrefix<["dog", "racecar", "race"]>
  //   ?^ ""
  ```
  Inspired by [LeetCode 14. Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/description/)

  > GitHubで確認する：https://tsch.js.org/35045/ja
*/

/* _____________ ここにコードを記入 _____________ */

type LongestCommonPrefix<T extends string[], P extends string = ''> = any

/* _____________ テストケース _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<LongestCommonPrefix<['flower', 'flow', 'flight']>, 'fl'>>,
  Expect<Equal<LongestCommonPrefix<['dog', 'racecar', 'race']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['', '', '']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['a', '', '']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['', 'a', '']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['', '', 'a']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['a', 'a', '']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['a', '', 'a']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['', 'a', 'a']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['a', 'a', 'a']>, 'a'>>,
  Expect<Equal<LongestCommonPrefix<['abc', 'abcd', 'abcde']>, 'abc'>>,
  Expect<Equal<LongestCommonPrefix<[' ', ' ', ' ']>, ' '>>,
  Expect<Equal<LongestCommonPrefix<['type-challenges', 'type-hero', 'typescript']>, 'type'>>,
]

/* _____________ 次のステップ _____________ */
/*
  > 解答を共有する：https://tsch.js.org/35045/answer/ja
  > 解答を見る：https://tsch.js.org/35045/solutions
  > その他の課題：https://tsch.js.org/ja
*/
