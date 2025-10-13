# TypeScript Type Challenges 解説

## 00189 - Awaited

### 問題

Promise ライクな型が内包する型をどのように取得すればよいでしょうか。

例えば：`Promise<ExampleType>`という型がある場合、どのようにして ExampleType を取得すればよいでしょうか。

```typescript
type ExampleType = Promise<string>

type Result = MyAwaited<ExampleType> // string
```

### 解答

```typescript
type MyAwaited<T> = T extends Promise<infer E1>
  ? E1 extends Promise<any>
    ? MyAwaited<E1>
    : E1
  : T extends { then: (onfulfilled: (arg: infer A) => any) => any }
    ? A
    : never
```

### 解説

#### 構文要素

**1. `T extends Promise<infer E1>`**

- Conditional Types（条件型）の構文
- `T extends Promise<...>`: T が Promise 型に割り当て可能かどうかをチェック
- `infer E1`: Promise が内包する型を E1 として推論（型推論キーワード）
- 例: `Promise<string>` なら E1 は `string`
- 条件が真の場合、? の後の型が使われる

**2. `E1 extends Promise<any>`**

- ネストされた Promise のチェック
- E1 自体が Promise 型かどうかを判定
- `Promise<Promise<string>>` のような多重の Promise に対応するため
- `any` を使うことで、任意の型を内包する Promise を検出

**3. `MyAwaited<E1>`**

- 再帰的な型定義
- E1 が Promise の場合、さらに MyAwaited を適用して内包型を取得
- `Promise<Promise<Promise<string>>>` のような深いネストにも対応
- 再帰により、最終的に Promise でない型に到達するまで展開

**4. `T extends { then: (onfulfilled: (arg: infer A) => any) => any }`**

- Promise ライクな型（thenable）への対応
- `then` メソッドを持つオブジェクトを Promise として扱う
- `onfulfilled: (arg: infer A) => any`: then のコールバック関数の引数の型を推論
- `infer A` により、コールバックに渡される値の型を A として取得
- Promise の標準仕様に準拠（then メソッドを持つオブジェクトを Promise として扱う）

**5. `never`**

- どの条件にも該当しない場合の型
- Promise でも thenable でもない場合に返される
- 型安全性を確保し、予期しない型の使用を防ぐ

#### 実行フロー

1. **第一段階: Promise 型のチェック**
   - `T extends Promise<infer E1>` で T が Promise かどうかを判定
   - Promise の場合、内包する型を E1 として抽出

2. **第二段階: ネストされた Promise のチェック**
   - `E1 extends Promise<any>` で E1 が Promise かどうかを判定
   - Promise の場合: `MyAwaited<E1>` で再帰的に展開（ステップ1に戻る）
   - Promise でない場合: E1 をそのまま返す（最終的な型）

3. **第三段階: Thenable のチェック**
   - 最初の条件で Promise でない場合、thenable かどうかをチェック
   - `then` メソッドを持つ場合、そのコールバック引数の型を A として取得
   - A を返す

4. **第四段階: どれにも該当しない場合**
   - `never` を返す

#### 実行例

**例1: シンプルな Promise**

```typescript
type X = Promise<string>
type Result1 = MyAwaited<X>
```

1. `X extends Promise<infer E1>` → 真（E1 = `string`）
2. `E1 extends Promise<any>` → 偽（`string` は Promise ではない）
3. E1 を返す → `string`

結果: `Result1 = string`

**例2: ネストされた Promise**

```typescript
type Z = Promise<Promise<string | number>>
type Result2 = MyAwaited<Z>
```

1. 第1回の評価:
   - `Z extends Promise<infer E1>` → 真（E1 = `Promise<string | number>`）
   - `E1 extends Promise<any>` → 真
   - `MyAwaited<E1>` で再帰

2. 第2回の評価（E1 = `Promise<string | number>`）:
   - `E1 extends Promise<infer E2>` → 真（E2 = `string | number`）
   - `E2 extends Promise<any>` → 偽
   - E2 を返す → `string | number`

結果: `Result2 = string | number`

**例3: 深くネストされた Promise**

```typescript
type Z1 = Promise<Promise<Promise<string | boolean>>>
type Result3 = MyAwaited<Z1>
```

1. 第1回: E1 = `Promise<Promise<string | boolean>>` → 再帰
2. 第2回: E2 = `Promise<string | boolean>` → 再帰
3. 第3回: E3 = `string | boolean` → Promise でないので返す

結果: `Result3 = string | boolean`

**例4: Thenable オブジェクト**

```typescript
type T = { then: (onfulfilled: (arg: number) => any) => any }
type Result4 = MyAwaited<T>
```

1. `T extends Promise<infer E1>` → 偽（Promise 型ではない）
2. `T extends { then: (onfulfilled: (arg: infer A) => any) => any }` → 真
3. then のコールバック引数の型を取得（A = `number`）
4. A を返す → `number`

結果: `Result4 = number`

### なぜこのように書くのか

**ネストされた Promise への対応**
- 実際のコードでは `Promise<Promise<T>>` のような多重の Promise が発生する可能性がある
- 再帰的な型定義により、どれだけ深くネストされていても最終的な型を取得できる
- TypeScript の `async/await` の動作と一致

**Promise 標準への準拠**
- Promise/A+ 仕様では、`then` メソッドを持つオブジェクトを Promise として扱う
- 組み込みの Promise 型だけでなく、Promise ライクな型（thenable）にも対応
- より汎用的で実用的な型ユーティリティ

**型安全性の確保**
- `infer` により、内包する型を安全に推論
- どの条件にも該当しない場合は `never` を返すことで、予期しない型の使用を防ぐ
- コンパイル時に型のミスマッチを検出

**Conditional Types と infer の活用**
- TypeScript の強力な型システム機能を最大限に活用
- 型レベルでの条件分岐と再帰により、複雑なロジックを実現
- 実行時のコストがなく、完全にコンパイル時に解決される
