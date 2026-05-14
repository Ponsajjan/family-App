
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Auth
 * 
 */
export type Auth = $Result.DefaultSelection<Prisma.$AuthPayload>
/**
 * Model Member
 * 
 */
export type Member = $Result.DefaultSelection<Prisma.$MemberPayload>
/**
 * Model RequestDetails
 * 
 */
export type RequestDetails = $Result.DefaultSelection<Prisma.$RequestDetailsPayload>
/**
 * Model nonDescendantRelation
 * 
 */
export type nonDescendantRelation = $Result.DefaultSelection<Prisma.$nonDescendantRelationPayload>
/**
 * Model ModeratorList
 * 
 */
export type ModeratorList = $Result.DefaultSelection<Prisma.$ModeratorListPayload>
/**
 * Model FamilyTree
 * 
 */
export type FamilyTree = $Result.DefaultSelection<Prisma.$FamilyTreePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Auths
 * const auths = await prisma.auth.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Auths
   * const auths = await prisma.auth.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.auth`: Exposes CRUD operations for the **Auth** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Auths
    * const auths = await prisma.auth.findMany()
    * ```
    */
  get auth(): Prisma.AuthDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.member`: Exposes CRUD operations for the **Member** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Members
    * const members = await prisma.member.findMany()
    * ```
    */
  get member(): Prisma.MemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.requestDetails`: Exposes CRUD operations for the **RequestDetails** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RequestDetails
    * const requestDetails = await prisma.requestDetails.findMany()
    * ```
    */
  get requestDetails(): Prisma.RequestDetailsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.nonDescendantRelation`: Exposes CRUD operations for the **nonDescendantRelation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NonDescendantRelations
    * const nonDescendantRelations = await prisma.nonDescendantRelation.findMany()
    * ```
    */
  get nonDescendantRelation(): Prisma.nonDescendantRelationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.moderatorList`: Exposes CRUD operations for the **ModeratorList** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ModeratorLists
    * const moderatorLists = await prisma.moderatorList.findMany()
    * ```
    */
  get moderatorList(): Prisma.ModeratorListDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.familyTree`: Exposes CRUD operations for the **FamilyTree** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FamilyTrees
    * const familyTrees = await prisma.familyTree.findMany()
    * ```
    */
  get familyTree(): Prisma.FamilyTreeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Auth: 'Auth',
    Member: 'Member',
    RequestDetails: 'RequestDetails',
    nonDescendantRelation: 'nonDescendantRelation',
    ModeratorList: 'ModeratorList',
    FamilyTree: 'FamilyTree'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "auth" | "member" | "requestDetails" | "nonDescendantRelation" | "moderatorList" | "familyTree"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Auth: {
        payload: Prisma.$AuthPayload<ExtArgs>
        fields: Prisma.AuthFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          findFirst: {
            args: Prisma.AuthFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          findMany: {
            args: Prisma.AuthFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>[]
          }
          create: {
            args: Prisma.AuthCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          createMany: {
            args: Prisma.AuthCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>[]
          }
          delete: {
            args: Prisma.AuthDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          update: {
            args: Prisma.AuthUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          deleteMany: {
            args: Prisma.AuthDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>[]
          }
          upsert: {
            args: Prisma.AuthUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          aggregate: {
            args: Prisma.AuthAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuth>
          }
          groupBy: {
            args: Prisma.AuthGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthCountArgs<ExtArgs>
            result: $Utils.Optional<AuthCountAggregateOutputType> | number
          }
        }
      }
      Member: {
        payload: Prisma.$MemberPayload<ExtArgs>
        fields: Prisma.MemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          findFirst: {
            args: Prisma.MemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          findMany: {
            args: Prisma.MemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>[]
          }
          create: {
            args: Prisma.MemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          createMany: {
            args: Prisma.MemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>[]
          }
          delete: {
            args: Prisma.MemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          update: {
            args: Prisma.MemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          deleteMany: {
            args: Prisma.MemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>[]
          }
          upsert: {
            args: Prisma.MemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          aggregate: {
            args: Prisma.MemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMember>
          }
          groupBy: {
            args: Prisma.MemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<MemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.MemberCountArgs<ExtArgs>
            result: $Utils.Optional<MemberCountAggregateOutputType> | number
          }
        }
      }
      RequestDetails: {
        payload: Prisma.$RequestDetailsPayload<ExtArgs>
        fields: Prisma.RequestDetailsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RequestDetailsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RequestDetailsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload>
          }
          findFirst: {
            args: Prisma.RequestDetailsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RequestDetailsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload>
          }
          findMany: {
            args: Prisma.RequestDetailsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload>[]
          }
          create: {
            args: Prisma.RequestDetailsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload>
          }
          createMany: {
            args: Prisma.RequestDetailsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RequestDetailsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload>[]
          }
          delete: {
            args: Prisma.RequestDetailsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload>
          }
          update: {
            args: Prisma.RequestDetailsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload>
          }
          deleteMany: {
            args: Prisma.RequestDetailsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RequestDetailsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RequestDetailsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload>[]
          }
          upsert: {
            args: Prisma.RequestDetailsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestDetailsPayload>
          }
          aggregate: {
            args: Prisma.RequestDetailsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRequestDetails>
          }
          groupBy: {
            args: Prisma.RequestDetailsGroupByArgs<ExtArgs>
            result: $Utils.Optional<RequestDetailsGroupByOutputType>[]
          }
          count: {
            args: Prisma.RequestDetailsCountArgs<ExtArgs>
            result: $Utils.Optional<RequestDetailsCountAggregateOutputType> | number
          }
        }
      }
      nonDescendantRelation: {
        payload: Prisma.$nonDescendantRelationPayload<ExtArgs>
        fields: Prisma.nonDescendantRelationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.nonDescendantRelationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.nonDescendantRelationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload>
          }
          findFirst: {
            args: Prisma.nonDescendantRelationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.nonDescendantRelationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload>
          }
          findMany: {
            args: Prisma.nonDescendantRelationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload>[]
          }
          create: {
            args: Prisma.nonDescendantRelationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload>
          }
          createMany: {
            args: Prisma.nonDescendantRelationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.nonDescendantRelationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload>[]
          }
          delete: {
            args: Prisma.nonDescendantRelationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload>
          }
          update: {
            args: Prisma.nonDescendantRelationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload>
          }
          deleteMany: {
            args: Prisma.nonDescendantRelationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.nonDescendantRelationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.nonDescendantRelationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload>[]
          }
          upsert: {
            args: Prisma.nonDescendantRelationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$nonDescendantRelationPayload>
          }
          aggregate: {
            args: Prisma.NonDescendantRelationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNonDescendantRelation>
          }
          groupBy: {
            args: Prisma.nonDescendantRelationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NonDescendantRelationGroupByOutputType>[]
          }
          count: {
            args: Prisma.nonDescendantRelationCountArgs<ExtArgs>
            result: $Utils.Optional<NonDescendantRelationCountAggregateOutputType> | number
          }
        }
      }
      ModeratorList: {
        payload: Prisma.$ModeratorListPayload<ExtArgs>
        fields: Prisma.ModeratorListFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ModeratorListFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ModeratorListFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload>
          }
          findFirst: {
            args: Prisma.ModeratorListFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ModeratorListFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload>
          }
          findMany: {
            args: Prisma.ModeratorListFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload>[]
          }
          create: {
            args: Prisma.ModeratorListCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload>
          }
          createMany: {
            args: Prisma.ModeratorListCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ModeratorListCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload>[]
          }
          delete: {
            args: Prisma.ModeratorListDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload>
          }
          update: {
            args: Prisma.ModeratorListUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload>
          }
          deleteMany: {
            args: Prisma.ModeratorListDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ModeratorListUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ModeratorListUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload>[]
          }
          upsert: {
            args: Prisma.ModeratorListUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorListPayload>
          }
          aggregate: {
            args: Prisma.ModeratorListAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateModeratorList>
          }
          groupBy: {
            args: Prisma.ModeratorListGroupByArgs<ExtArgs>
            result: $Utils.Optional<ModeratorListGroupByOutputType>[]
          }
          count: {
            args: Prisma.ModeratorListCountArgs<ExtArgs>
            result: $Utils.Optional<ModeratorListCountAggregateOutputType> | number
          }
        }
      }
      FamilyTree: {
        payload: Prisma.$FamilyTreePayload<ExtArgs>
        fields: Prisma.FamilyTreeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FamilyTreeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FamilyTreeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload>
          }
          findFirst: {
            args: Prisma.FamilyTreeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FamilyTreeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload>
          }
          findMany: {
            args: Prisma.FamilyTreeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload>[]
          }
          create: {
            args: Prisma.FamilyTreeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload>
          }
          createMany: {
            args: Prisma.FamilyTreeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FamilyTreeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload>[]
          }
          delete: {
            args: Prisma.FamilyTreeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload>
          }
          update: {
            args: Prisma.FamilyTreeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload>
          }
          deleteMany: {
            args: Prisma.FamilyTreeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FamilyTreeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FamilyTreeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload>[]
          }
          upsert: {
            args: Prisma.FamilyTreeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FamilyTreePayload>
          }
          aggregate: {
            args: Prisma.FamilyTreeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFamilyTree>
          }
          groupBy: {
            args: Prisma.FamilyTreeGroupByArgs<ExtArgs>
            result: $Utils.Optional<FamilyTreeGroupByOutputType>[]
          }
          count: {
            args: Prisma.FamilyTreeCountArgs<ExtArgs>
            result: $Utils.Optional<FamilyTreeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    auth?: AuthOmit
    member?: MemberOmit
    requestDetails?: RequestDetailsOmit
    nonDescendantRelation?: nonDescendantRelationOmit
    moderatorList?: ModeratorListOmit
    familyTree?: FamilyTreeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AuthCountOutputType
   */

  export type AuthCountOutputType = {
    moderatorList: number
    members: number
  }

  export type AuthCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    moderatorList?: boolean | AuthCountOutputTypeCountModeratorListArgs
    members?: boolean | AuthCountOutputTypeCountMembersArgs
  }

  // Custom InputTypes
  /**
   * AuthCountOutputType without action
   */
  export type AuthCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthCountOutputType
     */
    select?: AuthCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AuthCountOutputType without action
   */
  export type AuthCountOutputTypeCountModeratorListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModeratorListWhereInput
  }

  /**
   * AuthCountOutputType without action
   */
  export type AuthCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberWhereInput
  }


  /**
   * Count Type MemberCountOutputType
   */

  export type MemberCountOutputType = {
    pendingVerification: number
    nonDescendantRelation: number
    partnerOf: number
    fatherOf: number
    motherOf: number
  }

  export type MemberCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pendingVerification?: boolean | MemberCountOutputTypeCountPendingVerificationArgs
    nonDescendantRelation?: boolean | MemberCountOutputTypeCountNonDescendantRelationArgs
    partnerOf?: boolean | MemberCountOutputTypeCountPartnerOfArgs
    fatherOf?: boolean | MemberCountOutputTypeCountFatherOfArgs
    motherOf?: boolean | MemberCountOutputTypeCountMotherOfArgs
  }

  // Custom InputTypes
  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberCountOutputType
     */
    select?: MemberCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountPendingVerificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequestDetailsWhereInput
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountNonDescendantRelationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: nonDescendantRelationWhereInput
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountPartnerOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberWhereInput
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountFatherOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberWhereInput
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountMotherOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Auth
   */

  export type AggregateAuth = {
    _count: AuthCountAggregateOutputType | null
    _avg: AuthAvgAggregateOutputType | null
    _sum: AuthSumAggregateOutputType | null
    _min: AuthMinAggregateOutputType | null
    _max: AuthMaxAggregateOutputType | null
  }

  export type AuthAvgAggregateOutputType = {
    id: number | null
    mainMemberId: number | null
  }

  export type AuthSumAggregateOutputType = {
    id: number | null
    mainMemberId: number | null
  }

  export type AuthMinAggregateOutputType = {
    id: number | null
    mainMemberId: number | null
    moderatorPassword: string | null
    password: string | null
    memberAuthId: string | null
    moderatorAuthId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthMaxAggregateOutputType = {
    id: number | null
    mainMemberId: number | null
    moderatorPassword: string | null
    password: string | null
    memberAuthId: string | null
    moderatorAuthId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthCountAggregateOutputType = {
    id: number
    mainMemberId: number
    moderatorPassword: number
    password: number
    memberAuthId: number
    moderatorAuthId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuthAvgAggregateInputType = {
    id?: true
    mainMemberId?: true
  }

  export type AuthSumAggregateInputType = {
    id?: true
    mainMemberId?: true
  }

  export type AuthMinAggregateInputType = {
    id?: true
    mainMemberId?: true
    moderatorPassword?: true
    password?: true
    memberAuthId?: true
    moderatorAuthId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthMaxAggregateInputType = {
    id?: true
    mainMemberId?: true
    moderatorPassword?: true
    password?: true
    memberAuthId?: true
    moderatorAuthId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthCountAggregateInputType = {
    id?: true
    mainMemberId?: true
    moderatorPassword?: true
    password?: true
    memberAuthId?: true
    moderatorAuthId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuthAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auth to aggregate.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Auths
    **/
    _count?: true | AuthCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuthAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuthSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthMaxAggregateInputType
  }

  export type GetAuthAggregateType<T extends AuthAggregateArgs> = {
        [P in keyof T & keyof AggregateAuth]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuth[P]>
      : GetScalarType<T[P], AggregateAuth[P]>
  }




  export type AuthGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthWhereInput
    orderBy?: AuthOrderByWithAggregationInput | AuthOrderByWithAggregationInput[]
    by: AuthScalarFieldEnum[] | AuthScalarFieldEnum
    having?: AuthScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthCountAggregateInputType | true
    _avg?: AuthAvgAggregateInputType
    _sum?: AuthSumAggregateInputType
    _min?: AuthMinAggregateInputType
    _max?: AuthMaxAggregateInputType
  }

  export type AuthGroupByOutputType = {
    id: number
    mainMemberId: number | null
    moderatorPassword: string
    password: string
    memberAuthId: string | null
    moderatorAuthId: string | null
    createdAt: Date
    updatedAt: Date
    _count: AuthCountAggregateOutputType | null
    _avg: AuthAvgAggregateOutputType | null
    _sum: AuthSumAggregateOutputType | null
    _min: AuthMinAggregateOutputType | null
    _max: AuthMaxAggregateOutputType | null
  }

  type GetAuthGroupByPayload<T extends AuthGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthGroupByOutputType[P]>
            : GetScalarType<T[P], AuthGroupByOutputType[P]>
        }
      >
    >


  export type AuthSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mainMemberId?: boolean
    moderatorPassword?: boolean
    password?: boolean
    memberAuthId?: boolean
    moderatorAuthId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    moderatorList?: boolean | Auth$moderatorListArgs<ExtArgs>
    familyTree?: boolean | Auth$familyTreeArgs<ExtArgs>
    members?: boolean | Auth$membersArgs<ExtArgs>
    _count?: boolean | AuthCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auth"]>

  export type AuthSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mainMemberId?: boolean
    moderatorPassword?: boolean
    password?: boolean
    memberAuthId?: boolean
    moderatorAuthId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["auth"]>

  export type AuthSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mainMemberId?: boolean
    moderatorPassword?: boolean
    password?: boolean
    memberAuthId?: boolean
    moderatorAuthId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["auth"]>

  export type AuthSelectScalar = {
    id?: boolean
    mainMemberId?: boolean
    moderatorPassword?: boolean
    password?: boolean
    memberAuthId?: boolean
    moderatorAuthId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuthOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "mainMemberId" | "moderatorPassword" | "password" | "memberAuthId" | "moderatorAuthId" | "createdAt" | "updatedAt", ExtArgs["result"]["auth"]>
  export type AuthInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    moderatorList?: boolean | Auth$moderatorListArgs<ExtArgs>
    familyTree?: boolean | Auth$familyTreeArgs<ExtArgs>
    members?: boolean | Auth$membersArgs<ExtArgs>
    _count?: boolean | AuthCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuthIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AuthIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AuthPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Auth"
    objects: {
      moderatorList: Prisma.$ModeratorListPayload<ExtArgs>[]
      familyTree: Prisma.$FamilyTreePayload<ExtArgs> | null
      members: Prisma.$MemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      mainMemberId: number | null
      moderatorPassword: string
      password: string
      memberAuthId: string | null
      moderatorAuthId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["auth"]>
    composites: {}
  }

  type AuthGetPayload<S extends boolean | null | undefined | AuthDefaultArgs> = $Result.GetResult<Prisma.$AuthPayload, S>

  type AuthCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthCountAggregateInputType | true
    }

  export interface AuthDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Auth'], meta: { name: 'Auth' } }
    /**
     * Find zero or one Auth that matches the filter.
     * @param {AuthFindUniqueArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthFindUniqueArgs>(args: SelectSubset<T, AuthFindUniqueArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Auth that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthFindUniqueOrThrowArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auth that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthFindFirstArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthFindFirstArgs>(args?: SelectSubset<T, AuthFindFirstArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auth that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthFindFirstOrThrowArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Auths that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Auths
     * const auths = await prisma.auth.findMany()
     * 
     * // Get first 10 Auths
     * const auths = await prisma.auth.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authWithIdOnly = await prisma.auth.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthFindManyArgs>(args?: SelectSubset<T, AuthFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Auth.
     * @param {AuthCreateArgs} args - Arguments to create a Auth.
     * @example
     * // Create one Auth
     * const Auth = await prisma.auth.create({
     *   data: {
     *     // ... data to create a Auth
     *   }
     * })
     * 
     */
    create<T extends AuthCreateArgs>(args: SelectSubset<T, AuthCreateArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Auths.
     * @param {AuthCreateManyArgs} args - Arguments to create many Auths.
     * @example
     * // Create many Auths
     * const auth = await prisma.auth.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthCreateManyArgs>(args?: SelectSubset<T, AuthCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Auths and returns the data saved in the database.
     * @param {AuthCreateManyAndReturnArgs} args - Arguments to create many Auths.
     * @example
     * // Create many Auths
     * const auth = await prisma.auth.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Auths and only return the `id`
     * const authWithIdOnly = await prisma.auth.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Auth.
     * @param {AuthDeleteArgs} args - Arguments to delete one Auth.
     * @example
     * // Delete one Auth
     * const Auth = await prisma.auth.delete({
     *   where: {
     *     // ... filter to delete one Auth
     *   }
     * })
     * 
     */
    delete<T extends AuthDeleteArgs>(args: SelectSubset<T, AuthDeleteArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Auth.
     * @param {AuthUpdateArgs} args - Arguments to update one Auth.
     * @example
     * // Update one Auth
     * const auth = await prisma.auth.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthUpdateArgs>(args: SelectSubset<T, AuthUpdateArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Auths.
     * @param {AuthDeleteManyArgs} args - Arguments to filter Auths to delete.
     * @example
     * // Delete a few Auths
     * const { count } = await prisma.auth.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthDeleteManyArgs>(args?: SelectSubset<T, AuthDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Auths
     * const auth = await prisma.auth.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthUpdateManyArgs>(args: SelectSubset<T, AuthUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auths and returns the data updated in the database.
     * @param {AuthUpdateManyAndReturnArgs} args - Arguments to update many Auths.
     * @example
     * // Update many Auths
     * const auth = await prisma.auth.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Auths and only return the `id`
     * const authWithIdOnly = await prisma.auth.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Auth.
     * @param {AuthUpsertArgs} args - Arguments to update or create a Auth.
     * @example
     * // Update or create a Auth
     * const auth = await prisma.auth.upsert({
     *   create: {
     *     // ... data to create a Auth
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Auth we want to update
     *   }
     * })
     */
    upsert<T extends AuthUpsertArgs>(args: SelectSubset<T, AuthUpsertArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Auths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthCountArgs} args - Arguments to filter Auths to count.
     * @example
     * // Count the number of Auths
     * const count = await prisma.auth.count({
     *   where: {
     *     // ... the filter for the Auths we want to count
     *   }
     * })
    **/
    count<T extends AuthCountArgs>(
      args?: Subset<T, AuthCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Auth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthAggregateArgs>(args: Subset<T, AuthAggregateArgs>): Prisma.PrismaPromise<GetAuthAggregateType<T>>

    /**
     * Group by Auth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthGroupByArgs['orderBy'] }
        : { orderBy?: AuthGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Auth model
   */
  readonly fields: AuthFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Auth.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    moderatorList<T extends Auth$moderatorListArgs<ExtArgs> = {}>(args?: Subset<T, Auth$moderatorListArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    familyTree<T extends Auth$familyTreeArgs<ExtArgs> = {}>(args?: Subset<T, Auth$familyTreeArgs<ExtArgs>>): Prisma__FamilyTreeClient<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    members<T extends Auth$membersArgs<ExtArgs> = {}>(args?: Subset<T, Auth$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Auth model
   */
  interface AuthFieldRefs {
    readonly id: FieldRef<"Auth", 'Int'>
    readonly mainMemberId: FieldRef<"Auth", 'Int'>
    readonly moderatorPassword: FieldRef<"Auth", 'String'>
    readonly password: FieldRef<"Auth", 'String'>
    readonly memberAuthId: FieldRef<"Auth", 'String'>
    readonly moderatorAuthId: FieldRef<"Auth", 'String'>
    readonly createdAt: FieldRef<"Auth", 'DateTime'>
    readonly updatedAt: FieldRef<"Auth", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Auth findUnique
   */
  export type AuthFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth findUniqueOrThrow
   */
  export type AuthFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth findFirst
   */
  export type AuthFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auths.
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auths.
     */
    distinct?: AuthScalarFieldEnum | AuthScalarFieldEnum[]
  }

  /**
   * Auth findFirstOrThrow
   */
  export type AuthFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auths.
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auths.
     */
    distinct?: AuthScalarFieldEnum | AuthScalarFieldEnum[]
  }

  /**
   * Auth findMany
   */
  export type AuthFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auths to fetch.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Auths.
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    distinct?: AuthScalarFieldEnum | AuthScalarFieldEnum[]
  }

  /**
   * Auth create
   */
  export type AuthCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * The data needed to create a Auth.
     */
    data: XOR<AuthCreateInput, AuthUncheckedCreateInput>
  }

  /**
   * Auth createMany
   */
  export type AuthCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Auths.
     */
    data: AuthCreateManyInput | AuthCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Auth createManyAndReturn
   */
  export type AuthCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * The data used to create many Auths.
     */
    data: AuthCreateManyInput | AuthCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Auth update
   */
  export type AuthUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * The data needed to update a Auth.
     */
    data: XOR<AuthUpdateInput, AuthUncheckedUpdateInput>
    /**
     * Choose, which Auth to update.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth updateMany
   */
  export type AuthUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Auths.
     */
    data: XOR<AuthUpdateManyMutationInput, AuthUncheckedUpdateManyInput>
    /**
     * Filter which Auths to update
     */
    where?: AuthWhereInput
    /**
     * Limit how many Auths to update.
     */
    limit?: number
  }

  /**
   * Auth updateManyAndReturn
   */
  export type AuthUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * The data used to update Auths.
     */
    data: XOR<AuthUpdateManyMutationInput, AuthUncheckedUpdateManyInput>
    /**
     * Filter which Auths to update
     */
    where?: AuthWhereInput
    /**
     * Limit how many Auths to update.
     */
    limit?: number
  }

  /**
   * Auth upsert
   */
  export type AuthUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * The filter to search for the Auth to update in case it exists.
     */
    where: AuthWhereUniqueInput
    /**
     * In case the Auth found by the `where` argument doesn't exist, create a new Auth with this data.
     */
    create: XOR<AuthCreateInput, AuthUncheckedCreateInput>
    /**
     * In case the Auth was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthUpdateInput, AuthUncheckedUpdateInput>
  }

  /**
   * Auth delete
   */
  export type AuthDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter which Auth to delete.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth deleteMany
   */
  export type AuthDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auths to delete
     */
    where?: AuthWhereInput
    /**
     * Limit how many Auths to delete.
     */
    limit?: number
  }

  /**
   * Auth.moderatorList
   */
  export type Auth$moderatorListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
    where?: ModeratorListWhereInput
    orderBy?: ModeratorListOrderByWithRelationInput | ModeratorListOrderByWithRelationInput[]
    cursor?: ModeratorListWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ModeratorListScalarFieldEnum | ModeratorListScalarFieldEnum[]
  }

  /**
   * Auth.familyTree
   */
  export type Auth$familyTreeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
    where?: FamilyTreeWhereInput
  }

  /**
   * Auth.members
   */
  export type Auth$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    where?: MemberWhereInput
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    cursor?: MemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Auth without action
   */
  export type AuthDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
  }


  /**
   * Model Member
   */

  export type AggregateMember = {
    _count: MemberCountAggregateOutputType | null
    _avg: MemberAvgAggregateOutputType | null
    _sum: MemberSumAggregateOutputType | null
    _min: MemberMinAggregateOutputType | null
    _max: MemberMaxAggregateOutputType | null
  }

  export type MemberAvgAggregateOutputType = {
    id: number | null
    authId: number | null
    birthDate: number | null
    birthMonth: number | null
    birthYear: number | null
    deathDate: number | null
    deathMonth: number | null
    deathYear: number | null
    order: number | null
    fatherId: number | null
    motherId: number | null
    partnerId: number | null
  }

  export type MemberSumAggregateOutputType = {
    id: number | null
    authId: number | null
    birthDate: number | null
    birthMonth: number | null
    birthYear: number | null
    deathDate: number | null
    deathMonth: number | null
    deathYear: number | null
    order: number | null
    fatherId: number | null
    motherId: number | null
    partnerId: number | null
  }

  export type MemberMinAggregateOutputType = {
    id: number | null
    authId: number | null
    verified: boolean | null
    name: string | null
    birthDate: number | null
    birthMonth: number | null
    birthYear: number | null
    deceased: boolean | null
    deathDate: number | null
    deathMonth: number | null
    deathYear: number | null
    gender: string | null
    phoneNumber: string | null
    birthPlace: string | null
    currentAddress: string | null
    city: string | null
    state: string | null
    country: string | null
    occupation: string | null
    education: string | null
    additionalInfo: string | null
    descendant: boolean | null
    order: number | null
    fatherId: number | null
    motherId: number | null
    partnerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MemberMaxAggregateOutputType = {
    id: number | null
    authId: number | null
    verified: boolean | null
    name: string | null
    birthDate: number | null
    birthMonth: number | null
    birthYear: number | null
    deceased: boolean | null
    deathDate: number | null
    deathMonth: number | null
    deathYear: number | null
    gender: string | null
    phoneNumber: string | null
    birthPlace: string | null
    currentAddress: string | null
    city: string | null
    state: string | null
    country: string | null
    occupation: string | null
    education: string | null
    additionalInfo: string | null
    descendant: boolean | null
    order: number | null
    fatherId: number | null
    motherId: number | null
    partnerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MemberCountAggregateOutputType = {
    id: number
    authId: number
    verified: number
    name: number
    birthDate: number
    birthMonth: number
    birthYear: number
    deceased: number
    deathDate: number
    deathMonth: number
    deathYear: number
    gender: number
    phoneNumber: number
    birthPlace: number
    currentAddress: number
    city: number
    state: number
    country: number
    occupation: number
    education: number
    additionalInfo: number
    descendant: number
    order: number
    fatherId: number
    motherId: number
    partnerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MemberAvgAggregateInputType = {
    id?: true
    authId?: true
    birthDate?: true
    birthMonth?: true
    birthYear?: true
    deathDate?: true
    deathMonth?: true
    deathYear?: true
    order?: true
    fatherId?: true
    motherId?: true
    partnerId?: true
  }

  export type MemberSumAggregateInputType = {
    id?: true
    authId?: true
    birthDate?: true
    birthMonth?: true
    birthYear?: true
    deathDate?: true
    deathMonth?: true
    deathYear?: true
    order?: true
    fatherId?: true
    motherId?: true
    partnerId?: true
  }

  export type MemberMinAggregateInputType = {
    id?: true
    authId?: true
    verified?: true
    name?: true
    birthDate?: true
    birthMonth?: true
    birthYear?: true
    deceased?: true
    deathDate?: true
    deathMonth?: true
    deathYear?: true
    gender?: true
    phoneNumber?: true
    birthPlace?: true
    currentAddress?: true
    city?: true
    state?: true
    country?: true
    occupation?: true
    education?: true
    additionalInfo?: true
    descendant?: true
    order?: true
    fatherId?: true
    motherId?: true
    partnerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MemberMaxAggregateInputType = {
    id?: true
    authId?: true
    verified?: true
    name?: true
    birthDate?: true
    birthMonth?: true
    birthYear?: true
    deceased?: true
    deathDate?: true
    deathMonth?: true
    deathYear?: true
    gender?: true
    phoneNumber?: true
    birthPlace?: true
    currentAddress?: true
    city?: true
    state?: true
    country?: true
    occupation?: true
    education?: true
    additionalInfo?: true
    descendant?: true
    order?: true
    fatherId?: true
    motherId?: true
    partnerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MemberCountAggregateInputType = {
    id?: true
    authId?: true
    verified?: true
    name?: true
    birthDate?: true
    birthMonth?: true
    birthYear?: true
    deceased?: true
    deathDate?: true
    deathMonth?: true
    deathYear?: true
    gender?: true
    phoneNumber?: true
    birthPlace?: true
    currentAddress?: true
    city?: true
    state?: true
    country?: true
    occupation?: true
    education?: true
    additionalInfo?: true
    descendant?: true
    order?: true
    fatherId?: true
    motherId?: true
    partnerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Member to aggregate.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Members
    **/
    _count?: true | MemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MemberAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MemberSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MemberMaxAggregateInputType
  }

  export type GetMemberAggregateType<T extends MemberAggregateArgs> = {
        [P in keyof T & keyof AggregateMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMember[P]>
      : GetScalarType<T[P], AggregateMember[P]>
  }




  export type MemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberWhereInput
    orderBy?: MemberOrderByWithAggregationInput | MemberOrderByWithAggregationInput[]
    by: MemberScalarFieldEnum[] | MemberScalarFieldEnum
    having?: MemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MemberCountAggregateInputType | true
    _avg?: MemberAvgAggregateInputType
    _sum?: MemberSumAggregateInputType
    _min?: MemberMinAggregateInputType
    _max?: MemberMaxAggregateInputType
  }

  export type MemberGroupByOutputType = {
    id: number
    authId: number
    verified: boolean | null
    name: string
    birthDate: number | null
    birthMonth: number | null
    birthYear: number | null
    deceased: boolean
    deathDate: number | null
    deathMonth: number | null
    deathYear: number | null
    gender: string
    phoneNumber: string | null
    birthPlace: string | null
    currentAddress: string | null
    city: string | null
    state: string | null
    country: string | null
    occupation: string | null
    education: string | null
    additionalInfo: string | null
    descendant: boolean
    order: number
    fatherId: number | null
    motherId: number | null
    partnerId: number | null
    createdAt: Date
    updatedAt: Date
    _count: MemberCountAggregateOutputType | null
    _avg: MemberAvgAggregateOutputType | null
    _sum: MemberSumAggregateOutputType | null
    _min: MemberMinAggregateOutputType | null
    _max: MemberMaxAggregateOutputType | null
  }

  type GetMemberGroupByPayload<T extends MemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MemberGroupByOutputType[P]>
            : GetScalarType<T[P], MemberGroupByOutputType[P]>
        }
      >
    >


  export type MemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authId?: boolean
    verified?: boolean
    name?: boolean
    birthDate?: boolean
    birthMonth?: boolean
    birthYear?: boolean
    deceased?: boolean
    deathDate?: boolean
    deathMonth?: boolean
    deathYear?: boolean
    gender?: boolean
    phoneNumber?: boolean
    birthPlace?: boolean
    currentAddress?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    occupation?: boolean
    education?: boolean
    additionalInfo?: boolean
    descendant?: boolean
    order?: boolean
    fatherId?: boolean
    motherId?: boolean
    partnerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pendingVerification?: boolean | Member$pendingVerificationArgs<ExtArgs>
    nonDescendantRelation?: boolean | Member$nonDescendantRelationArgs<ExtArgs>
    father?: boolean | Member$fatherArgs<ExtArgs>
    mother?: boolean | Member$motherArgs<ExtArgs>
    partner?: boolean | Member$partnerArgs<ExtArgs>
    partnerOf?: boolean | Member$partnerOfArgs<ExtArgs>
    fatherOf?: boolean | Member$fatherOfArgs<ExtArgs>
    motherOf?: boolean | Member$motherOfArgs<ExtArgs>
    auth?: boolean | AuthDefaultArgs<ExtArgs>
    _count?: boolean | MemberCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["member"]>

  export type MemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authId?: boolean
    verified?: boolean
    name?: boolean
    birthDate?: boolean
    birthMonth?: boolean
    birthYear?: boolean
    deceased?: boolean
    deathDate?: boolean
    deathMonth?: boolean
    deathYear?: boolean
    gender?: boolean
    phoneNumber?: boolean
    birthPlace?: boolean
    currentAddress?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    occupation?: boolean
    education?: boolean
    additionalInfo?: boolean
    descendant?: boolean
    order?: boolean
    fatherId?: boolean
    motherId?: boolean
    partnerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    father?: boolean | Member$fatherArgs<ExtArgs>
    mother?: boolean | Member$motherArgs<ExtArgs>
    partner?: boolean | Member$partnerArgs<ExtArgs>
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["member"]>

  export type MemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authId?: boolean
    verified?: boolean
    name?: boolean
    birthDate?: boolean
    birthMonth?: boolean
    birthYear?: boolean
    deceased?: boolean
    deathDate?: boolean
    deathMonth?: boolean
    deathYear?: boolean
    gender?: boolean
    phoneNumber?: boolean
    birthPlace?: boolean
    currentAddress?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    occupation?: boolean
    education?: boolean
    additionalInfo?: boolean
    descendant?: boolean
    order?: boolean
    fatherId?: boolean
    motherId?: boolean
    partnerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    father?: boolean | Member$fatherArgs<ExtArgs>
    mother?: boolean | Member$motherArgs<ExtArgs>
    partner?: boolean | Member$partnerArgs<ExtArgs>
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["member"]>

  export type MemberSelectScalar = {
    id?: boolean
    authId?: boolean
    verified?: boolean
    name?: boolean
    birthDate?: boolean
    birthMonth?: boolean
    birthYear?: boolean
    deceased?: boolean
    deathDate?: boolean
    deathMonth?: boolean
    deathYear?: boolean
    gender?: boolean
    phoneNumber?: boolean
    birthPlace?: boolean
    currentAddress?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    occupation?: boolean
    education?: boolean
    additionalInfo?: boolean
    descendant?: boolean
    order?: boolean
    fatherId?: boolean
    motherId?: boolean
    partnerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authId" | "verified" | "name" | "birthDate" | "birthMonth" | "birthYear" | "deceased" | "deathDate" | "deathMonth" | "deathYear" | "gender" | "phoneNumber" | "birthPlace" | "currentAddress" | "city" | "state" | "country" | "occupation" | "education" | "additionalInfo" | "descendant" | "order" | "fatherId" | "motherId" | "partnerId" | "createdAt" | "updatedAt", ExtArgs["result"]["member"]>
  export type MemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pendingVerification?: boolean | Member$pendingVerificationArgs<ExtArgs>
    nonDescendantRelation?: boolean | Member$nonDescendantRelationArgs<ExtArgs>
    father?: boolean | Member$fatherArgs<ExtArgs>
    mother?: boolean | Member$motherArgs<ExtArgs>
    partner?: boolean | Member$partnerArgs<ExtArgs>
    partnerOf?: boolean | Member$partnerOfArgs<ExtArgs>
    fatherOf?: boolean | Member$fatherOfArgs<ExtArgs>
    motherOf?: boolean | Member$motherOfArgs<ExtArgs>
    auth?: boolean | AuthDefaultArgs<ExtArgs>
    _count?: boolean | MemberCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    father?: boolean | Member$fatherArgs<ExtArgs>
    mother?: boolean | Member$motherArgs<ExtArgs>
    partner?: boolean | Member$partnerArgs<ExtArgs>
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }
  export type MemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    father?: boolean | Member$fatherArgs<ExtArgs>
    mother?: boolean | Member$motherArgs<ExtArgs>
    partner?: boolean | Member$partnerArgs<ExtArgs>
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }

  export type $MemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Member"
    objects: {
      pendingVerification: Prisma.$RequestDetailsPayload<ExtArgs>[]
      nonDescendantRelation: Prisma.$nonDescendantRelationPayload<ExtArgs>[]
      father: Prisma.$MemberPayload<ExtArgs> | null
      mother: Prisma.$MemberPayload<ExtArgs> | null
      partner: Prisma.$MemberPayload<ExtArgs> | null
      partnerOf: Prisma.$MemberPayload<ExtArgs>[]
      fatherOf: Prisma.$MemberPayload<ExtArgs>[]
      motherOf: Prisma.$MemberPayload<ExtArgs>[]
      auth: Prisma.$AuthPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      authId: number
      verified: boolean | null
      name: string
      birthDate: number | null
      birthMonth: number | null
      birthYear: number | null
      deceased: boolean
      deathDate: number | null
      deathMonth: number | null
      deathYear: number | null
      gender: string
      phoneNumber: string | null
      birthPlace: string | null
      currentAddress: string | null
      city: string | null
      state: string | null
      country: string | null
      occupation: string | null
      education: string | null
      additionalInfo: string | null
      descendant: boolean
      order: number
      fatherId: number | null
      motherId: number | null
      partnerId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["member"]>
    composites: {}
  }

  type MemberGetPayload<S extends boolean | null | undefined | MemberDefaultArgs> = $Result.GetResult<Prisma.$MemberPayload, S>

  type MemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MemberCountAggregateInputType | true
    }

  export interface MemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Member'], meta: { name: 'Member' } }
    /**
     * Find zero or one Member that matches the filter.
     * @param {MemberFindUniqueArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MemberFindUniqueArgs>(args: SelectSubset<T, MemberFindUniqueArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Member that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MemberFindUniqueOrThrowArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MemberFindUniqueOrThrowArgs>(args: SelectSubset<T, MemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Member that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberFindFirstArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MemberFindFirstArgs>(args?: SelectSubset<T, MemberFindFirstArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Member that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberFindFirstOrThrowArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MemberFindFirstOrThrowArgs>(args?: SelectSubset<T, MemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Members that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Members
     * const members = await prisma.member.findMany()
     * 
     * // Get first 10 Members
     * const members = await prisma.member.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const memberWithIdOnly = await prisma.member.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MemberFindManyArgs>(args?: SelectSubset<T, MemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Member.
     * @param {MemberCreateArgs} args - Arguments to create a Member.
     * @example
     * // Create one Member
     * const Member = await prisma.member.create({
     *   data: {
     *     // ... data to create a Member
     *   }
     * })
     * 
     */
    create<T extends MemberCreateArgs>(args: SelectSubset<T, MemberCreateArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Members.
     * @param {MemberCreateManyArgs} args - Arguments to create many Members.
     * @example
     * // Create many Members
     * const member = await prisma.member.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MemberCreateManyArgs>(args?: SelectSubset<T, MemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Members and returns the data saved in the database.
     * @param {MemberCreateManyAndReturnArgs} args - Arguments to create many Members.
     * @example
     * // Create many Members
     * const member = await prisma.member.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Members and only return the `id`
     * const memberWithIdOnly = await prisma.member.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MemberCreateManyAndReturnArgs>(args?: SelectSubset<T, MemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Member.
     * @param {MemberDeleteArgs} args - Arguments to delete one Member.
     * @example
     * // Delete one Member
     * const Member = await prisma.member.delete({
     *   where: {
     *     // ... filter to delete one Member
     *   }
     * })
     * 
     */
    delete<T extends MemberDeleteArgs>(args: SelectSubset<T, MemberDeleteArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Member.
     * @param {MemberUpdateArgs} args - Arguments to update one Member.
     * @example
     * // Update one Member
     * const member = await prisma.member.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MemberUpdateArgs>(args: SelectSubset<T, MemberUpdateArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Members.
     * @param {MemberDeleteManyArgs} args - Arguments to filter Members to delete.
     * @example
     * // Delete a few Members
     * const { count } = await prisma.member.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MemberDeleteManyArgs>(args?: SelectSubset<T, MemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Members
     * const member = await prisma.member.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MemberUpdateManyArgs>(args: SelectSubset<T, MemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Members and returns the data updated in the database.
     * @param {MemberUpdateManyAndReturnArgs} args - Arguments to update many Members.
     * @example
     * // Update many Members
     * const member = await prisma.member.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Members and only return the `id`
     * const memberWithIdOnly = await prisma.member.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MemberUpdateManyAndReturnArgs>(args: SelectSubset<T, MemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Member.
     * @param {MemberUpsertArgs} args - Arguments to update or create a Member.
     * @example
     * // Update or create a Member
     * const member = await prisma.member.upsert({
     *   create: {
     *     // ... data to create a Member
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Member we want to update
     *   }
     * })
     */
    upsert<T extends MemberUpsertArgs>(args: SelectSubset<T, MemberUpsertArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberCountArgs} args - Arguments to filter Members to count.
     * @example
     * // Count the number of Members
     * const count = await prisma.member.count({
     *   where: {
     *     // ... the filter for the Members we want to count
     *   }
     * })
    **/
    count<T extends MemberCountArgs>(
      args?: Subset<T, MemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Member.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MemberAggregateArgs>(args: Subset<T, MemberAggregateArgs>): Prisma.PrismaPromise<GetMemberAggregateType<T>>

    /**
     * Group by Member.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MemberGroupByArgs['orderBy'] }
        : { orderBy?: MemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Member model
   */
  readonly fields: MemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Member.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pendingVerification<T extends Member$pendingVerificationArgs<ExtArgs> = {}>(args?: Subset<T, Member$pendingVerificationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    nonDescendantRelation<T extends Member$nonDescendantRelationArgs<ExtArgs> = {}>(args?: Subset<T, Member$nonDescendantRelationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    father<T extends Member$fatherArgs<ExtArgs> = {}>(args?: Subset<T, Member$fatherArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    mother<T extends Member$motherArgs<ExtArgs> = {}>(args?: Subset<T, Member$motherArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    partner<T extends Member$partnerArgs<ExtArgs> = {}>(args?: Subset<T, Member$partnerArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    partnerOf<T extends Member$partnerOfArgs<ExtArgs> = {}>(args?: Subset<T, Member$partnerOfArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    fatherOf<T extends Member$fatherOfArgs<ExtArgs> = {}>(args?: Subset<T, Member$fatherOfArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    motherOf<T extends Member$motherOfArgs<ExtArgs> = {}>(args?: Subset<T, Member$motherOfArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auth<T extends AuthDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthDefaultArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Member model
   */
  interface MemberFieldRefs {
    readonly id: FieldRef<"Member", 'Int'>
    readonly authId: FieldRef<"Member", 'Int'>
    readonly verified: FieldRef<"Member", 'Boolean'>
    readonly name: FieldRef<"Member", 'String'>
    readonly birthDate: FieldRef<"Member", 'Int'>
    readonly birthMonth: FieldRef<"Member", 'Int'>
    readonly birthYear: FieldRef<"Member", 'Int'>
    readonly deceased: FieldRef<"Member", 'Boolean'>
    readonly deathDate: FieldRef<"Member", 'Int'>
    readonly deathMonth: FieldRef<"Member", 'Int'>
    readonly deathYear: FieldRef<"Member", 'Int'>
    readonly gender: FieldRef<"Member", 'String'>
    readonly phoneNumber: FieldRef<"Member", 'String'>
    readonly birthPlace: FieldRef<"Member", 'String'>
    readonly currentAddress: FieldRef<"Member", 'String'>
    readonly city: FieldRef<"Member", 'String'>
    readonly state: FieldRef<"Member", 'String'>
    readonly country: FieldRef<"Member", 'String'>
    readonly occupation: FieldRef<"Member", 'String'>
    readonly education: FieldRef<"Member", 'String'>
    readonly additionalInfo: FieldRef<"Member", 'String'>
    readonly descendant: FieldRef<"Member", 'Boolean'>
    readonly order: FieldRef<"Member", 'Int'>
    readonly fatherId: FieldRef<"Member", 'Int'>
    readonly motherId: FieldRef<"Member", 'Int'>
    readonly partnerId: FieldRef<"Member", 'Int'>
    readonly createdAt: FieldRef<"Member", 'DateTime'>
    readonly updatedAt: FieldRef<"Member", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Member findUnique
   */
  export type MemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member findUniqueOrThrow
   */
  export type MemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member findFirst
   */
  export type MemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Members.
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Members.
     */
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member findFirstOrThrow
   */
  export type MemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Members.
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Members.
     */
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member findMany
   */
  export type MemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Members to fetch.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Members.
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member create
   */
  export type MemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * The data needed to create a Member.
     */
    data: XOR<MemberCreateInput, MemberUncheckedCreateInput>
  }

  /**
   * Member createMany
   */
  export type MemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Members.
     */
    data: MemberCreateManyInput | MemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Member createManyAndReturn
   */
  export type MemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * The data used to create many Members.
     */
    data: MemberCreateManyInput | MemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Member update
   */
  export type MemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * The data needed to update a Member.
     */
    data: XOR<MemberUpdateInput, MemberUncheckedUpdateInput>
    /**
     * Choose, which Member to update.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member updateMany
   */
  export type MemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Members.
     */
    data: XOR<MemberUpdateManyMutationInput, MemberUncheckedUpdateManyInput>
    /**
     * Filter which Members to update
     */
    where?: MemberWhereInput
    /**
     * Limit how many Members to update.
     */
    limit?: number
  }

  /**
   * Member updateManyAndReturn
   */
  export type MemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * The data used to update Members.
     */
    data: XOR<MemberUpdateManyMutationInput, MemberUncheckedUpdateManyInput>
    /**
     * Filter which Members to update
     */
    where?: MemberWhereInput
    /**
     * Limit how many Members to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Member upsert
   */
  export type MemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * The filter to search for the Member to update in case it exists.
     */
    where: MemberWhereUniqueInput
    /**
     * In case the Member found by the `where` argument doesn't exist, create a new Member with this data.
     */
    create: XOR<MemberCreateInput, MemberUncheckedCreateInput>
    /**
     * In case the Member was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MemberUpdateInput, MemberUncheckedUpdateInput>
  }

  /**
   * Member delete
   */
  export type MemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter which Member to delete.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member deleteMany
   */
  export type MemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Members to delete
     */
    where?: MemberWhereInput
    /**
     * Limit how many Members to delete.
     */
    limit?: number
  }

  /**
   * Member.pendingVerification
   */
  export type Member$pendingVerificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
    where?: RequestDetailsWhereInput
    orderBy?: RequestDetailsOrderByWithRelationInput | RequestDetailsOrderByWithRelationInput[]
    cursor?: RequestDetailsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RequestDetailsScalarFieldEnum | RequestDetailsScalarFieldEnum[]
  }

  /**
   * Member.nonDescendantRelation
   */
  export type Member$nonDescendantRelationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
    where?: nonDescendantRelationWhereInput
    orderBy?: nonDescendantRelationOrderByWithRelationInput | nonDescendantRelationOrderByWithRelationInput[]
    cursor?: nonDescendantRelationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NonDescendantRelationScalarFieldEnum | NonDescendantRelationScalarFieldEnum[]
  }

  /**
   * Member.father
   */
  export type Member$fatherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    where?: MemberWhereInput
  }

  /**
   * Member.mother
   */
  export type Member$motherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    where?: MemberWhereInput
  }

  /**
   * Member.partner
   */
  export type Member$partnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    where?: MemberWhereInput
  }

  /**
   * Member.partnerOf
   */
  export type Member$partnerOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    where?: MemberWhereInput
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    cursor?: MemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member.fatherOf
   */
  export type Member$fatherOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    where?: MemberWhereInput
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    cursor?: MemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member.motherOf
   */
  export type Member$motherOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    where?: MemberWhereInput
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    cursor?: MemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member without action
   */
  export type MemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
  }


  /**
   * Model RequestDetails
   */

  export type AggregateRequestDetails = {
    _count: RequestDetailsCountAggregateOutputType | null
    _avg: RequestDetailsAvgAggregateOutputType | null
    _sum: RequestDetailsSumAggregateOutputType | null
    _min: RequestDetailsMinAggregateOutputType | null
    _max: RequestDetailsMaxAggregateOutputType | null
  }

  export type RequestDetailsAvgAggregateOutputType = {
    id: number | null
    authId: number | null
    memberId: number | null
  }

  export type RequestDetailsSumAggregateOutputType = {
    id: number | null
    authId: number | null
    memberId: number | null
  }

  export type RequestDetailsMinAggregateOutputType = {
    id: number | null
    authId: number | null
    type: string | null
    details: string | null
    memberId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RequestDetailsMaxAggregateOutputType = {
    id: number | null
    authId: number | null
    type: string | null
    details: string | null
    memberId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RequestDetailsCountAggregateOutputType = {
    id: number
    authId: number
    type: number
    details: number
    memberId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RequestDetailsAvgAggregateInputType = {
    id?: true
    authId?: true
    memberId?: true
  }

  export type RequestDetailsSumAggregateInputType = {
    id?: true
    authId?: true
    memberId?: true
  }

  export type RequestDetailsMinAggregateInputType = {
    id?: true
    authId?: true
    type?: true
    details?: true
    memberId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RequestDetailsMaxAggregateInputType = {
    id?: true
    authId?: true
    type?: true
    details?: true
    memberId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RequestDetailsCountAggregateInputType = {
    id?: true
    authId?: true
    type?: true
    details?: true
    memberId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RequestDetailsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RequestDetails to aggregate.
     */
    where?: RequestDetailsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestDetails to fetch.
     */
    orderBy?: RequestDetailsOrderByWithRelationInput | RequestDetailsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RequestDetailsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RequestDetails
    **/
    _count?: true | RequestDetailsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RequestDetailsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RequestDetailsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RequestDetailsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RequestDetailsMaxAggregateInputType
  }

  export type GetRequestDetailsAggregateType<T extends RequestDetailsAggregateArgs> = {
        [P in keyof T & keyof AggregateRequestDetails]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRequestDetails[P]>
      : GetScalarType<T[P], AggregateRequestDetails[P]>
  }




  export type RequestDetailsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequestDetailsWhereInput
    orderBy?: RequestDetailsOrderByWithAggregationInput | RequestDetailsOrderByWithAggregationInput[]
    by: RequestDetailsScalarFieldEnum[] | RequestDetailsScalarFieldEnum
    having?: RequestDetailsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RequestDetailsCountAggregateInputType | true
    _avg?: RequestDetailsAvgAggregateInputType
    _sum?: RequestDetailsSumAggregateInputType
    _min?: RequestDetailsMinAggregateInputType
    _max?: RequestDetailsMaxAggregateInputType
  }

  export type RequestDetailsGroupByOutputType = {
    id: number
    authId: number
    type: string
    details: string
    memberId: number
    createdAt: Date
    updatedAt: Date
    _count: RequestDetailsCountAggregateOutputType | null
    _avg: RequestDetailsAvgAggregateOutputType | null
    _sum: RequestDetailsSumAggregateOutputType | null
    _min: RequestDetailsMinAggregateOutputType | null
    _max: RequestDetailsMaxAggregateOutputType | null
  }

  type GetRequestDetailsGroupByPayload<T extends RequestDetailsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RequestDetailsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RequestDetailsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RequestDetailsGroupByOutputType[P]>
            : GetScalarType<T[P], RequestDetailsGroupByOutputType[P]>
        }
      >
    >


  export type RequestDetailsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authId?: boolean
    type?: boolean
    details?: boolean
    memberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requestDetails"]>

  export type RequestDetailsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authId?: boolean
    type?: boolean
    details?: boolean
    memberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requestDetails"]>

  export type RequestDetailsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authId?: boolean
    type?: boolean
    details?: boolean
    memberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requestDetails"]>

  export type RequestDetailsSelectScalar = {
    id?: boolean
    authId?: boolean
    type?: boolean
    details?: boolean
    memberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RequestDetailsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authId" | "type" | "details" | "memberId" | "createdAt" | "updatedAt", ExtArgs["result"]["requestDetails"]>
  export type RequestDetailsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type RequestDetailsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type RequestDetailsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }

  export type $RequestDetailsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RequestDetails"
    objects: {
      member: Prisma.$MemberPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      authId: number
      type: string
      details: string
      memberId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["requestDetails"]>
    composites: {}
  }

  type RequestDetailsGetPayload<S extends boolean | null | undefined | RequestDetailsDefaultArgs> = $Result.GetResult<Prisma.$RequestDetailsPayload, S>

  type RequestDetailsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RequestDetailsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RequestDetailsCountAggregateInputType | true
    }

  export interface RequestDetailsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RequestDetails'], meta: { name: 'RequestDetails' } }
    /**
     * Find zero or one RequestDetails that matches the filter.
     * @param {RequestDetailsFindUniqueArgs} args - Arguments to find a RequestDetails
     * @example
     * // Get one RequestDetails
     * const requestDetails = await prisma.requestDetails.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RequestDetailsFindUniqueArgs>(args: SelectSubset<T, RequestDetailsFindUniqueArgs<ExtArgs>>): Prisma__RequestDetailsClient<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RequestDetails that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RequestDetailsFindUniqueOrThrowArgs} args - Arguments to find a RequestDetails
     * @example
     * // Get one RequestDetails
     * const requestDetails = await prisma.requestDetails.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RequestDetailsFindUniqueOrThrowArgs>(args: SelectSubset<T, RequestDetailsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RequestDetailsClient<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RequestDetails that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestDetailsFindFirstArgs} args - Arguments to find a RequestDetails
     * @example
     * // Get one RequestDetails
     * const requestDetails = await prisma.requestDetails.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RequestDetailsFindFirstArgs>(args?: SelectSubset<T, RequestDetailsFindFirstArgs<ExtArgs>>): Prisma__RequestDetailsClient<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RequestDetails that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestDetailsFindFirstOrThrowArgs} args - Arguments to find a RequestDetails
     * @example
     * // Get one RequestDetails
     * const requestDetails = await prisma.requestDetails.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RequestDetailsFindFirstOrThrowArgs>(args?: SelectSubset<T, RequestDetailsFindFirstOrThrowArgs<ExtArgs>>): Prisma__RequestDetailsClient<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RequestDetails that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestDetailsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RequestDetails
     * const requestDetails = await prisma.requestDetails.findMany()
     * 
     * // Get first 10 RequestDetails
     * const requestDetails = await prisma.requestDetails.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const requestDetailsWithIdOnly = await prisma.requestDetails.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RequestDetailsFindManyArgs>(args?: SelectSubset<T, RequestDetailsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RequestDetails.
     * @param {RequestDetailsCreateArgs} args - Arguments to create a RequestDetails.
     * @example
     * // Create one RequestDetails
     * const RequestDetails = await prisma.requestDetails.create({
     *   data: {
     *     // ... data to create a RequestDetails
     *   }
     * })
     * 
     */
    create<T extends RequestDetailsCreateArgs>(args: SelectSubset<T, RequestDetailsCreateArgs<ExtArgs>>): Prisma__RequestDetailsClient<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RequestDetails.
     * @param {RequestDetailsCreateManyArgs} args - Arguments to create many RequestDetails.
     * @example
     * // Create many RequestDetails
     * const requestDetails = await prisma.requestDetails.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RequestDetailsCreateManyArgs>(args?: SelectSubset<T, RequestDetailsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RequestDetails and returns the data saved in the database.
     * @param {RequestDetailsCreateManyAndReturnArgs} args - Arguments to create many RequestDetails.
     * @example
     * // Create many RequestDetails
     * const requestDetails = await prisma.requestDetails.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RequestDetails and only return the `id`
     * const requestDetailsWithIdOnly = await prisma.requestDetails.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RequestDetailsCreateManyAndReturnArgs>(args?: SelectSubset<T, RequestDetailsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RequestDetails.
     * @param {RequestDetailsDeleteArgs} args - Arguments to delete one RequestDetails.
     * @example
     * // Delete one RequestDetails
     * const RequestDetails = await prisma.requestDetails.delete({
     *   where: {
     *     // ... filter to delete one RequestDetails
     *   }
     * })
     * 
     */
    delete<T extends RequestDetailsDeleteArgs>(args: SelectSubset<T, RequestDetailsDeleteArgs<ExtArgs>>): Prisma__RequestDetailsClient<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RequestDetails.
     * @param {RequestDetailsUpdateArgs} args - Arguments to update one RequestDetails.
     * @example
     * // Update one RequestDetails
     * const requestDetails = await prisma.requestDetails.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RequestDetailsUpdateArgs>(args: SelectSubset<T, RequestDetailsUpdateArgs<ExtArgs>>): Prisma__RequestDetailsClient<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RequestDetails.
     * @param {RequestDetailsDeleteManyArgs} args - Arguments to filter RequestDetails to delete.
     * @example
     * // Delete a few RequestDetails
     * const { count } = await prisma.requestDetails.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RequestDetailsDeleteManyArgs>(args?: SelectSubset<T, RequestDetailsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RequestDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestDetailsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RequestDetails
     * const requestDetails = await prisma.requestDetails.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RequestDetailsUpdateManyArgs>(args: SelectSubset<T, RequestDetailsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RequestDetails and returns the data updated in the database.
     * @param {RequestDetailsUpdateManyAndReturnArgs} args - Arguments to update many RequestDetails.
     * @example
     * // Update many RequestDetails
     * const requestDetails = await prisma.requestDetails.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RequestDetails and only return the `id`
     * const requestDetailsWithIdOnly = await prisma.requestDetails.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RequestDetailsUpdateManyAndReturnArgs>(args: SelectSubset<T, RequestDetailsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RequestDetails.
     * @param {RequestDetailsUpsertArgs} args - Arguments to update or create a RequestDetails.
     * @example
     * // Update or create a RequestDetails
     * const requestDetails = await prisma.requestDetails.upsert({
     *   create: {
     *     // ... data to create a RequestDetails
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RequestDetails we want to update
     *   }
     * })
     */
    upsert<T extends RequestDetailsUpsertArgs>(args: SelectSubset<T, RequestDetailsUpsertArgs<ExtArgs>>): Prisma__RequestDetailsClient<$Result.GetResult<Prisma.$RequestDetailsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RequestDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestDetailsCountArgs} args - Arguments to filter RequestDetails to count.
     * @example
     * // Count the number of RequestDetails
     * const count = await prisma.requestDetails.count({
     *   where: {
     *     // ... the filter for the RequestDetails we want to count
     *   }
     * })
    **/
    count<T extends RequestDetailsCountArgs>(
      args?: Subset<T, RequestDetailsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RequestDetailsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RequestDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestDetailsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RequestDetailsAggregateArgs>(args: Subset<T, RequestDetailsAggregateArgs>): Prisma.PrismaPromise<GetRequestDetailsAggregateType<T>>

    /**
     * Group by RequestDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestDetailsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RequestDetailsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RequestDetailsGroupByArgs['orderBy'] }
        : { orderBy?: RequestDetailsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RequestDetailsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRequestDetailsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RequestDetails model
   */
  readonly fields: RequestDetailsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RequestDetails.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RequestDetailsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    member<T extends MemberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MemberDefaultArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RequestDetails model
   */
  interface RequestDetailsFieldRefs {
    readonly id: FieldRef<"RequestDetails", 'Int'>
    readonly authId: FieldRef<"RequestDetails", 'Int'>
    readonly type: FieldRef<"RequestDetails", 'String'>
    readonly details: FieldRef<"RequestDetails", 'String'>
    readonly memberId: FieldRef<"RequestDetails", 'Int'>
    readonly createdAt: FieldRef<"RequestDetails", 'DateTime'>
    readonly updatedAt: FieldRef<"RequestDetails", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RequestDetails findUnique
   */
  export type RequestDetailsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
    /**
     * Filter, which RequestDetails to fetch.
     */
    where: RequestDetailsWhereUniqueInput
  }

  /**
   * RequestDetails findUniqueOrThrow
   */
  export type RequestDetailsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
    /**
     * Filter, which RequestDetails to fetch.
     */
    where: RequestDetailsWhereUniqueInput
  }

  /**
   * RequestDetails findFirst
   */
  export type RequestDetailsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
    /**
     * Filter, which RequestDetails to fetch.
     */
    where?: RequestDetailsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestDetails to fetch.
     */
    orderBy?: RequestDetailsOrderByWithRelationInput | RequestDetailsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RequestDetails.
     */
    cursor?: RequestDetailsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RequestDetails.
     */
    distinct?: RequestDetailsScalarFieldEnum | RequestDetailsScalarFieldEnum[]
  }

  /**
   * RequestDetails findFirstOrThrow
   */
  export type RequestDetailsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
    /**
     * Filter, which RequestDetails to fetch.
     */
    where?: RequestDetailsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestDetails to fetch.
     */
    orderBy?: RequestDetailsOrderByWithRelationInput | RequestDetailsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RequestDetails.
     */
    cursor?: RequestDetailsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RequestDetails.
     */
    distinct?: RequestDetailsScalarFieldEnum | RequestDetailsScalarFieldEnum[]
  }

  /**
   * RequestDetails findMany
   */
  export type RequestDetailsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
    /**
     * Filter, which RequestDetails to fetch.
     */
    where?: RequestDetailsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestDetails to fetch.
     */
    orderBy?: RequestDetailsOrderByWithRelationInput | RequestDetailsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RequestDetails.
     */
    cursor?: RequestDetailsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestDetails.
     */
    skip?: number
    distinct?: RequestDetailsScalarFieldEnum | RequestDetailsScalarFieldEnum[]
  }

  /**
   * RequestDetails create
   */
  export type RequestDetailsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
    /**
     * The data needed to create a RequestDetails.
     */
    data: XOR<RequestDetailsCreateInput, RequestDetailsUncheckedCreateInput>
  }

  /**
   * RequestDetails createMany
   */
  export type RequestDetailsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RequestDetails.
     */
    data: RequestDetailsCreateManyInput | RequestDetailsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RequestDetails createManyAndReturn
   */
  export type RequestDetailsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * The data used to create many RequestDetails.
     */
    data: RequestDetailsCreateManyInput | RequestDetailsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RequestDetails update
   */
  export type RequestDetailsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
    /**
     * The data needed to update a RequestDetails.
     */
    data: XOR<RequestDetailsUpdateInput, RequestDetailsUncheckedUpdateInput>
    /**
     * Choose, which RequestDetails to update.
     */
    where: RequestDetailsWhereUniqueInput
  }

  /**
   * RequestDetails updateMany
   */
  export type RequestDetailsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RequestDetails.
     */
    data: XOR<RequestDetailsUpdateManyMutationInput, RequestDetailsUncheckedUpdateManyInput>
    /**
     * Filter which RequestDetails to update
     */
    where?: RequestDetailsWhereInput
    /**
     * Limit how many RequestDetails to update.
     */
    limit?: number
  }

  /**
   * RequestDetails updateManyAndReturn
   */
  export type RequestDetailsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * The data used to update RequestDetails.
     */
    data: XOR<RequestDetailsUpdateManyMutationInput, RequestDetailsUncheckedUpdateManyInput>
    /**
     * Filter which RequestDetails to update
     */
    where?: RequestDetailsWhereInput
    /**
     * Limit how many RequestDetails to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RequestDetails upsert
   */
  export type RequestDetailsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
    /**
     * The filter to search for the RequestDetails to update in case it exists.
     */
    where: RequestDetailsWhereUniqueInput
    /**
     * In case the RequestDetails found by the `where` argument doesn't exist, create a new RequestDetails with this data.
     */
    create: XOR<RequestDetailsCreateInput, RequestDetailsUncheckedCreateInput>
    /**
     * In case the RequestDetails was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RequestDetailsUpdateInput, RequestDetailsUncheckedUpdateInput>
  }

  /**
   * RequestDetails delete
   */
  export type RequestDetailsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
    /**
     * Filter which RequestDetails to delete.
     */
    where: RequestDetailsWhereUniqueInput
  }

  /**
   * RequestDetails deleteMany
   */
  export type RequestDetailsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RequestDetails to delete
     */
    where?: RequestDetailsWhereInput
    /**
     * Limit how many RequestDetails to delete.
     */
    limit?: number
  }

  /**
   * RequestDetails without action
   */
  export type RequestDetailsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestDetails
     */
    select?: RequestDetailsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestDetails
     */
    omit?: RequestDetailsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestDetailsInclude<ExtArgs> | null
  }


  /**
   * Model nonDescendantRelation
   */

  export type AggregateNonDescendantRelation = {
    _count: NonDescendantRelationCountAggregateOutputType | null
    _avg: NonDescendantRelationAvgAggregateOutputType | null
    _sum: NonDescendantRelationSumAggregateOutputType | null
    _min: NonDescendantRelationMinAggregateOutputType | null
    _max: NonDescendantRelationMaxAggregateOutputType | null
  }

  export type NonDescendantRelationAvgAggregateOutputType = {
    id: number | null
    memberId: number | null
  }

  export type NonDescendantRelationSumAggregateOutputType = {
    id: number | null
    memberId: number | null
  }

  export type NonDescendantRelationMinAggregateOutputType = {
    id: number | null
    memberId: number | null
    fatherName: string | null
    motherName: string | null
    siblingNames: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NonDescendantRelationMaxAggregateOutputType = {
    id: number | null
    memberId: number | null
    fatherName: string | null
    motherName: string | null
    siblingNames: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NonDescendantRelationCountAggregateOutputType = {
    id: number
    memberId: number
    fatherName: number
    motherName: number
    siblingNames: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NonDescendantRelationAvgAggregateInputType = {
    id?: true
    memberId?: true
  }

  export type NonDescendantRelationSumAggregateInputType = {
    id?: true
    memberId?: true
  }

  export type NonDescendantRelationMinAggregateInputType = {
    id?: true
    memberId?: true
    fatherName?: true
    motherName?: true
    siblingNames?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NonDescendantRelationMaxAggregateInputType = {
    id?: true
    memberId?: true
    fatherName?: true
    motherName?: true
    siblingNames?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NonDescendantRelationCountAggregateInputType = {
    id?: true
    memberId?: true
    fatherName?: true
    motherName?: true
    siblingNames?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NonDescendantRelationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which nonDescendantRelation to aggregate.
     */
    where?: nonDescendantRelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of nonDescendantRelations to fetch.
     */
    orderBy?: nonDescendantRelationOrderByWithRelationInput | nonDescendantRelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: nonDescendantRelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` nonDescendantRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` nonDescendantRelations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned nonDescendantRelations
    **/
    _count?: true | NonDescendantRelationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NonDescendantRelationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NonDescendantRelationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NonDescendantRelationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NonDescendantRelationMaxAggregateInputType
  }

  export type GetNonDescendantRelationAggregateType<T extends NonDescendantRelationAggregateArgs> = {
        [P in keyof T & keyof AggregateNonDescendantRelation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNonDescendantRelation[P]>
      : GetScalarType<T[P], AggregateNonDescendantRelation[P]>
  }




  export type nonDescendantRelationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: nonDescendantRelationWhereInput
    orderBy?: nonDescendantRelationOrderByWithAggregationInput | nonDescendantRelationOrderByWithAggregationInput[]
    by: NonDescendantRelationScalarFieldEnum[] | NonDescendantRelationScalarFieldEnum
    having?: nonDescendantRelationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NonDescendantRelationCountAggregateInputType | true
    _avg?: NonDescendantRelationAvgAggregateInputType
    _sum?: NonDescendantRelationSumAggregateInputType
    _min?: NonDescendantRelationMinAggregateInputType
    _max?: NonDescendantRelationMaxAggregateInputType
  }

  export type NonDescendantRelationGroupByOutputType = {
    id: number
    memberId: number
    fatherName: string | null
    motherName: string | null
    siblingNames: string | null
    createdAt: Date
    updatedAt: Date
    _count: NonDescendantRelationCountAggregateOutputType | null
    _avg: NonDescendantRelationAvgAggregateOutputType | null
    _sum: NonDescendantRelationSumAggregateOutputType | null
    _min: NonDescendantRelationMinAggregateOutputType | null
    _max: NonDescendantRelationMaxAggregateOutputType | null
  }

  type GetNonDescendantRelationGroupByPayload<T extends nonDescendantRelationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NonDescendantRelationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NonDescendantRelationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NonDescendantRelationGroupByOutputType[P]>
            : GetScalarType<T[P], NonDescendantRelationGroupByOutputType[P]>
        }
      >
    >


  export type nonDescendantRelationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberId?: boolean
    fatherName?: boolean
    motherName?: boolean
    siblingNames?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nonDescendantRelation"]>

  export type nonDescendantRelationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberId?: boolean
    fatherName?: boolean
    motherName?: boolean
    siblingNames?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nonDescendantRelation"]>

  export type nonDescendantRelationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberId?: boolean
    fatherName?: boolean
    motherName?: boolean
    siblingNames?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nonDescendantRelation"]>

  export type nonDescendantRelationSelectScalar = {
    id?: boolean
    memberId?: boolean
    fatherName?: boolean
    motherName?: boolean
    siblingNames?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type nonDescendantRelationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "memberId" | "fatherName" | "motherName" | "siblingNames" | "createdAt" | "updatedAt", ExtArgs["result"]["nonDescendantRelation"]>
  export type nonDescendantRelationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type nonDescendantRelationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type nonDescendantRelationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }

  export type $nonDescendantRelationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "nonDescendantRelation"
    objects: {
      member: Prisma.$MemberPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      memberId: number
      fatherName: string | null
      motherName: string | null
      siblingNames: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["nonDescendantRelation"]>
    composites: {}
  }

  type nonDescendantRelationGetPayload<S extends boolean | null | undefined | nonDescendantRelationDefaultArgs> = $Result.GetResult<Prisma.$nonDescendantRelationPayload, S>

  type nonDescendantRelationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<nonDescendantRelationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NonDescendantRelationCountAggregateInputType | true
    }

  export interface nonDescendantRelationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['nonDescendantRelation'], meta: { name: 'nonDescendantRelation' } }
    /**
     * Find zero or one NonDescendantRelation that matches the filter.
     * @param {nonDescendantRelationFindUniqueArgs} args - Arguments to find a NonDescendantRelation
     * @example
     * // Get one NonDescendantRelation
     * const nonDescendantRelation = await prisma.nonDescendantRelation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends nonDescendantRelationFindUniqueArgs>(args: SelectSubset<T, nonDescendantRelationFindUniqueArgs<ExtArgs>>): Prisma__nonDescendantRelationClient<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NonDescendantRelation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {nonDescendantRelationFindUniqueOrThrowArgs} args - Arguments to find a NonDescendantRelation
     * @example
     * // Get one NonDescendantRelation
     * const nonDescendantRelation = await prisma.nonDescendantRelation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends nonDescendantRelationFindUniqueOrThrowArgs>(args: SelectSubset<T, nonDescendantRelationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__nonDescendantRelationClient<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NonDescendantRelation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {nonDescendantRelationFindFirstArgs} args - Arguments to find a NonDescendantRelation
     * @example
     * // Get one NonDescendantRelation
     * const nonDescendantRelation = await prisma.nonDescendantRelation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends nonDescendantRelationFindFirstArgs>(args?: SelectSubset<T, nonDescendantRelationFindFirstArgs<ExtArgs>>): Prisma__nonDescendantRelationClient<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NonDescendantRelation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {nonDescendantRelationFindFirstOrThrowArgs} args - Arguments to find a NonDescendantRelation
     * @example
     * // Get one NonDescendantRelation
     * const nonDescendantRelation = await prisma.nonDescendantRelation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends nonDescendantRelationFindFirstOrThrowArgs>(args?: SelectSubset<T, nonDescendantRelationFindFirstOrThrowArgs<ExtArgs>>): Prisma__nonDescendantRelationClient<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NonDescendantRelations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {nonDescendantRelationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NonDescendantRelations
     * const nonDescendantRelations = await prisma.nonDescendantRelation.findMany()
     * 
     * // Get first 10 NonDescendantRelations
     * const nonDescendantRelations = await prisma.nonDescendantRelation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nonDescendantRelationWithIdOnly = await prisma.nonDescendantRelation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends nonDescendantRelationFindManyArgs>(args?: SelectSubset<T, nonDescendantRelationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NonDescendantRelation.
     * @param {nonDescendantRelationCreateArgs} args - Arguments to create a NonDescendantRelation.
     * @example
     * // Create one NonDescendantRelation
     * const NonDescendantRelation = await prisma.nonDescendantRelation.create({
     *   data: {
     *     // ... data to create a NonDescendantRelation
     *   }
     * })
     * 
     */
    create<T extends nonDescendantRelationCreateArgs>(args: SelectSubset<T, nonDescendantRelationCreateArgs<ExtArgs>>): Prisma__nonDescendantRelationClient<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NonDescendantRelations.
     * @param {nonDescendantRelationCreateManyArgs} args - Arguments to create many NonDescendantRelations.
     * @example
     * // Create many NonDescendantRelations
     * const nonDescendantRelation = await prisma.nonDescendantRelation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends nonDescendantRelationCreateManyArgs>(args?: SelectSubset<T, nonDescendantRelationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NonDescendantRelations and returns the data saved in the database.
     * @param {nonDescendantRelationCreateManyAndReturnArgs} args - Arguments to create many NonDescendantRelations.
     * @example
     * // Create many NonDescendantRelations
     * const nonDescendantRelation = await prisma.nonDescendantRelation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NonDescendantRelations and only return the `id`
     * const nonDescendantRelationWithIdOnly = await prisma.nonDescendantRelation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends nonDescendantRelationCreateManyAndReturnArgs>(args?: SelectSubset<T, nonDescendantRelationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NonDescendantRelation.
     * @param {nonDescendantRelationDeleteArgs} args - Arguments to delete one NonDescendantRelation.
     * @example
     * // Delete one NonDescendantRelation
     * const NonDescendantRelation = await prisma.nonDescendantRelation.delete({
     *   where: {
     *     // ... filter to delete one NonDescendantRelation
     *   }
     * })
     * 
     */
    delete<T extends nonDescendantRelationDeleteArgs>(args: SelectSubset<T, nonDescendantRelationDeleteArgs<ExtArgs>>): Prisma__nonDescendantRelationClient<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NonDescendantRelation.
     * @param {nonDescendantRelationUpdateArgs} args - Arguments to update one NonDescendantRelation.
     * @example
     * // Update one NonDescendantRelation
     * const nonDescendantRelation = await prisma.nonDescendantRelation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends nonDescendantRelationUpdateArgs>(args: SelectSubset<T, nonDescendantRelationUpdateArgs<ExtArgs>>): Prisma__nonDescendantRelationClient<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NonDescendantRelations.
     * @param {nonDescendantRelationDeleteManyArgs} args - Arguments to filter NonDescendantRelations to delete.
     * @example
     * // Delete a few NonDescendantRelations
     * const { count } = await prisma.nonDescendantRelation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends nonDescendantRelationDeleteManyArgs>(args?: SelectSubset<T, nonDescendantRelationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NonDescendantRelations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {nonDescendantRelationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NonDescendantRelations
     * const nonDescendantRelation = await prisma.nonDescendantRelation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends nonDescendantRelationUpdateManyArgs>(args: SelectSubset<T, nonDescendantRelationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NonDescendantRelations and returns the data updated in the database.
     * @param {nonDescendantRelationUpdateManyAndReturnArgs} args - Arguments to update many NonDescendantRelations.
     * @example
     * // Update many NonDescendantRelations
     * const nonDescendantRelation = await prisma.nonDescendantRelation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NonDescendantRelations and only return the `id`
     * const nonDescendantRelationWithIdOnly = await prisma.nonDescendantRelation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends nonDescendantRelationUpdateManyAndReturnArgs>(args: SelectSubset<T, nonDescendantRelationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NonDescendantRelation.
     * @param {nonDescendantRelationUpsertArgs} args - Arguments to update or create a NonDescendantRelation.
     * @example
     * // Update or create a NonDescendantRelation
     * const nonDescendantRelation = await prisma.nonDescendantRelation.upsert({
     *   create: {
     *     // ... data to create a NonDescendantRelation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NonDescendantRelation we want to update
     *   }
     * })
     */
    upsert<T extends nonDescendantRelationUpsertArgs>(args: SelectSubset<T, nonDescendantRelationUpsertArgs<ExtArgs>>): Prisma__nonDescendantRelationClient<$Result.GetResult<Prisma.$nonDescendantRelationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NonDescendantRelations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {nonDescendantRelationCountArgs} args - Arguments to filter NonDescendantRelations to count.
     * @example
     * // Count the number of NonDescendantRelations
     * const count = await prisma.nonDescendantRelation.count({
     *   where: {
     *     // ... the filter for the NonDescendantRelations we want to count
     *   }
     * })
    **/
    count<T extends nonDescendantRelationCountArgs>(
      args?: Subset<T, nonDescendantRelationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NonDescendantRelationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NonDescendantRelation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NonDescendantRelationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NonDescendantRelationAggregateArgs>(args: Subset<T, NonDescendantRelationAggregateArgs>): Prisma.PrismaPromise<GetNonDescendantRelationAggregateType<T>>

    /**
     * Group by NonDescendantRelation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {nonDescendantRelationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends nonDescendantRelationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: nonDescendantRelationGroupByArgs['orderBy'] }
        : { orderBy?: nonDescendantRelationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, nonDescendantRelationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNonDescendantRelationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the nonDescendantRelation model
   */
  readonly fields: nonDescendantRelationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for nonDescendantRelation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__nonDescendantRelationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    member<T extends MemberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MemberDefaultArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the nonDescendantRelation model
   */
  interface nonDescendantRelationFieldRefs {
    readonly id: FieldRef<"nonDescendantRelation", 'Int'>
    readonly memberId: FieldRef<"nonDescendantRelation", 'Int'>
    readonly fatherName: FieldRef<"nonDescendantRelation", 'String'>
    readonly motherName: FieldRef<"nonDescendantRelation", 'String'>
    readonly siblingNames: FieldRef<"nonDescendantRelation", 'String'>
    readonly createdAt: FieldRef<"nonDescendantRelation", 'DateTime'>
    readonly updatedAt: FieldRef<"nonDescendantRelation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * nonDescendantRelation findUnique
   */
  export type nonDescendantRelationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
    /**
     * Filter, which nonDescendantRelation to fetch.
     */
    where: nonDescendantRelationWhereUniqueInput
  }

  /**
   * nonDescendantRelation findUniqueOrThrow
   */
  export type nonDescendantRelationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
    /**
     * Filter, which nonDescendantRelation to fetch.
     */
    where: nonDescendantRelationWhereUniqueInput
  }

  /**
   * nonDescendantRelation findFirst
   */
  export type nonDescendantRelationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
    /**
     * Filter, which nonDescendantRelation to fetch.
     */
    where?: nonDescendantRelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of nonDescendantRelations to fetch.
     */
    orderBy?: nonDescendantRelationOrderByWithRelationInput | nonDescendantRelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for nonDescendantRelations.
     */
    cursor?: nonDescendantRelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` nonDescendantRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` nonDescendantRelations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of nonDescendantRelations.
     */
    distinct?: NonDescendantRelationScalarFieldEnum | NonDescendantRelationScalarFieldEnum[]
  }

  /**
   * nonDescendantRelation findFirstOrThrow
   */
  export type nonDescendantRelationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
    /**
     * Filter, which nonDescendantRelation to fetch.
     */
    where?: nonDescendantRelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of nonDescendantRelations to fetch.
     */
    orderBy?: nonDescendantRelationOrderByWithRelationInput | nonDescendantRelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for nonDescendantRelations.
     */
    cursor?: nonDescendantRelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` nonDescendantRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` nonDescendantRelations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of nonDescendantRelations.
     */
    distinct?: NonDescendantRelationScalarFieldEnum | NonDescendantRelationScalarFieldEnum[]
  }

  /**
   * nonDescendantRelation findMany
   */
  export type nonDescendantRelationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
    /**
     * Filter, which nonDescendantRelations to fetch.
     */
    where?: nonDescendantRelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of nonDescendantRelations to fetch.
     */
    orderBy?: nonDescendantRelationOrderByWithRelationInput | nonDescendantRelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing nonDescendantRelations.
     */
    cursor?: nonDescendantRelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` nonDescendantRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` nonDescendantRelations.
     */
    skip?: number
    distinct?: NonDescendantRelationScalarFieldEnum | NonDescendantRelationScalarFieldEnum[]
  }

  /**
   * nonDescendantRelation create
   */
  export type nonDescendantRelationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
    /**
     * The data needed to create a nonDescendantRelation.
     */
    data: XOR<nonDescendantRelationCreateInput, nonDescendantRelationUncheckedCreateInput>
  }

  /**
   * nonDescendantRelation createMany
   */
  export type nonDescendantRelationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many nonDescendantRelations.
     */
    data: nonDescendantRelationCreateManyInput | nonDescendantRelationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * nonDescendantRelation createManyAndReturn
   */
  export type nonDescendantRelationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * The data used to create many nonDescendantRelations.
     */
    data: nonDescendantRelationCreateManyInput | nonDescendantRelationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * nonDescendantRelation update
   */
  export type nonDescendantRelationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
    /**
     * The data needed to update a nonDescendantRelation.
     */
    data: XOR<nonDescendantRelationUpdateInput, nonDescendantRelationUncheckedUpdateInput>
    /**
     * Choose, which nonDescendantRelation to update.
     */
    where: nonDescendantRelationWhereUniqueInput
  }

  /**
   * nonDescendantRelation updateMany
   */
  export type nonDescendantRelationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update nonDescendantRelations.
     */
    data: XOR<nonDescendantRelationUpdateManyMutationInput, nonDescendantRelationUncheckedUpdateManyInput>
    /**
     * Filter which nonDescendantRelations to update
     */
    where?: nonDescendantRelationWhereInput
    /**
     * Limit how many nonDescendantRelations to update.
     */
    limit?: number
  }

  /**
   * nonDescendantRelation updateManyAndReturn
   */
  export type nonDescendantRelationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * The data used to update nonDescendantRelations.
     */
    data: XOR<nonDescendantRelationUpdateManyMutationInput, nonDescendantRelationUncheckedUpdateManyInput>
    /**
     * Filter which nonDescendantRelations to update
     */
    where?: nonDescendantRelationWhereInput
    /**
     * Limit how many nonDescendantRelations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * nonDescendantRelation upsert
   */
  export type nonDescendantRelationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
    /**
     * The filter to search for the nonDescendantRelation to update in case it exists.
     */
    where: nonDescendantRelationWhereUniqueInput
    /**
     * In case the nonDescendantRelation found by the `where` argument doesn't exist, create a new nonDescendantRelation with this data.
     */
    create: XOR<nonDescendantRelationCreateInput, nonDescendantRelationUncheckedCreateInput>
    /**
     * In case the nonDescendantRelation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<nonDescendantRelationUpdateInput, nonDescendantRelationUncheckedUpdateInput>
  }

  /**
   * nonDescendantRelation delete
   */
  export type nonDescendantRelationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
    /**
     * Filter which nonDescendantRelation to delete.
     */
    where: nonDescendantRelationWhereUniqueInput
  }

  /**
   * nonDescendantRelation deleteMany
   */
  export type nonDescendantRelationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which nonDescendantRelations to delete
     */
    where?: nonDescendantRelationWhereInput
    /**
     * Limit how many nonDescendantRelations to delete.
     */
    limit?: number
  }

  /**
   * nonDescendantRelation without action
   */
  export type nonDescendantRelationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the nonDescendantRelation
     */
    select?: nonDescendantRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the nonDescendantRelation
     */
    omit?: nonDescendantRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: nonDescendantRelationInclude<ExtArgs> | null
  }


  /**
   * Model ModeratorList
   */

  export type AggregateModeratorList = {
    _count: ModeratorListCountAggregateOutputType | null
    _avg: ModeratorListAvgAggregateOutputType | null
    _sum: ModeratorListSumAggregateOutputType | null
    _min: ModeratorListMinAggregateOutputType | null
    _max: ModeratorListMaxAggregateOutputType | null
  }

  export type ModeratorListAvgAggregateOutputType = {
    id: number | null
    authId: number | null
  }

  export type ModeratorListSumAggregateOutputType = {
    id: number | null
    authId: number | null
  }

  export type ModeratorListMinAggregateOutputType = {
    id: number | null
    moderatorName: string | null
    moderatorContact: string | null
    authId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ModeratorListMaxAggregateOutputType = {
    id: number | null
    moderatorName: string | null
    moderatorContact: string | null
    authId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ModeratorListCountAggregateOutputType = {
    id: number
    moderatorName: number
    moderatorContact: number
    authId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ModeratorListAvgAggregateInputType = {
    id?: true
    authId?: true
  }

  export type ModeratorListSumAggregateInputType = {
    id?: true
    authId?: true
  }

  export type ModeratorListMinAggregateInputType = {
    id?: true
    moderatorName?: true
    moderatorContact?: true
    authId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ModeratorListMaxAggregateInputType = {
    id?: true
    moderatorName?: true
    moderatorContact?: true
    authId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ModeratorListCountAggregateInputType = {
    id?: true
    moderatorName?: true
    moderatorContact?: true
    authId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ModeratorListAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ModeratorList to aggregate.
     */
    where?: ModeratorListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModeratorLists to fetch.
     */
    orderBy?: ModeratorListOrderByWithRelationInput | ModeratorListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ModeratorListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModeratorLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModeratorLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ModeratorLists
    **/
    _count?: true | ModeratorListCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ModeratorListAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ModeratorListSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ModeratorListMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ModeratorListMaxAggregateInputType
  }

  export type GetModeratorListAggregateType<T extends ModeratorListAggregateArgs> = {
        [P in keyof T & keyof AggregateModeratorList]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateModeratorList[P]>
      : GetScalarType<T[P], AggregateModeratorList[P]>
  }




  export type ModeratorListGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModeratorListWhereInput
    orderBy?: ModeratorListOrderByWithAggregationInput | ModeratorListOrderByWithAggregationInput[]
    by: ModeratorListScalarFieldEnum[] | ModeratorListScalarFieldEnum
    having?: ModeratorListScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ModeratorListCountAggregateInputType | true
    _avg?: ModeratorListAvgAggregateInputType
    _sum?: ModeratorListSumAggregateInputType
    _min?: ModeratorListMinAggregateInputType
    _max?: ModeratorListMaxAggregateInputType
  }

  export type ModeratorListGroupByOutputType = {
    id: number
    moderatorName: string
    moderatorContact: string
    authId: number
    createdAt: Date
    updatedAt: Date
    _count: ModeratorListCountAggregateOutputType | null
    _avg: ModeratorListAvgAggregateOutputType | null
    _sum: ModeratorListSumAggregateOutputType | null
    _min: ModeratorListMinAggregateOutputType | null
    _max: ModeratorListMaxAggregateOutputType | null
  }

  type GetModeratorListGroupByPayload<T extends ModeratorListGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ModeratorListGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ModeratorListGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ModeratorListGroupByOutputType[P]>
            : GetScalarType<T[P], ModeratorListGroupByOutputType[P]>
        }
      >
    >


  export type ModeratorListSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    moderatorName?: boolean
    moderatorContact?: boolean
    authId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    moderator?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moderatorList"]>

  export type ModeratorListSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    moderatorName?: boolean
    moderatorContact?: boolean
    authId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    moderator?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moderatorList"]>

  export type ModeratorListSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    moderatorName?: boolean
    moderatorContact?: boolean
    authId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    moderator?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moderatorList"]>

  export type ModeratorListSelectScalar = {
    id?: boolean
    moderatorName?: boolean
    moderatorContact?: boolean
    authId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ModeratorListOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "moderatorName" | "moderatorContact" | "authId" | "createdAt" | "updatedAt", ExtArgs["result"]["moderatorList"]>
  export type ModeratorListInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    moderator?: boolean | AuthDefaultArgs<ExtArgs>
  }
  export type ModeratorListIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    moderator?: boolean | AuthDefaultArgs<ExtArgs>
  }
  export type ModeratorListIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    moderator?: boolean | AuthDefaultArgs<ExtArgs>
  }

  export type $ModeratorListPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ModeratorList"
    objects: {
      moderator: Prisma.$AuthPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      moderatorName: string
      moderatorContact: string
      authId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["moderatorList"]>
    composites: {}
  }

  type ModeratorListGetPayload<S extends boolean | null | undefined | ModeratorListDefaultArgs> = $Result.GetResult<Prisma.$ModeratorListPayload, S>

  type ModeratorListCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ModeratorListFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ModeratorListCountAggregateInputType | true
    }

  export interface ModeratorListDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ModeratorList'], meta: { name: 'ModeratorList' } }
    /**
     * Find zero or one ModeratorList that matches the filter.
     * @param {ModeratorListFindUniqueArgs} args - Arguments to find a ModeratorList
     * @example
     * // Get one ModeratorList
     * const moderatorList = await prisma.moderatorList.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ModeratorListFindUniqueArgs>(args: SelectSubset<T, ModeratorListFindUniqueArgs<ExtArgs>>): Prisma__ModeratorListClient<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ModeratorList that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ModeratorListFindUniqueOrThrowArgs} args - Arguments to find a ModeratorList
     * @example
     * // Get one ModeratorList
     * const moderatorList = await prisma.moderatorList.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ModeratorListFindUniqueOrThrowArgs>(args: SelectSubset<T, ModeratorListFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ModeratorListClient<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ModeratorList that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorListFindFirstArgs} args - Arguments to find a ModeratorList
     * @example
     * // Get one ModeratorList
     * const moderatorList = await prisma.moderatorList.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ModeratorListFindFirstArgs>(args?: SelectSubset<T, ModeratorListFindFirstArgs<ExtArgs>>): Prisma__ModeratorListClient<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ModeratorList that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorListFindFirstOrThrowArgs} args - Arguments to find a ModeratorList
     * @example
     * // Get one ModeratorList
     * const moderatorList = await prisma.moderatorList.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ModeratorListFindFirstOrThrowArgs>(args?: SelectSubset<T, ModeratorListFindFirstOrThrowArgs<ExtArgs>>): Prisma__ModeratorListClient<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ModeratorLists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorListFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ModeratorLists
     * const moderatorLists = await prisma.moderatorList.findMany()
     * 
     * // Get first 10 ModeratorLists
     * const moderatorLists = await prisma.moderatorList.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moderatorListWithIdOnly = await prisma.moderatorList.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ModeratorListFindManyArgs>(args?: SelectSubset<T, ModeratorListFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ModeratorList.
     * @param {ModeratorListCreateArgs} args - Arguments to create a ModeratorList.
     * @example
     * // Create one ModeratorList
     * const ModeratorList = await prisma.moderatorList.create({
     *   data: {
     *     // ... data to create a ModeratorList
     *   }
     * })
     * 
     */
    create<T extends ModeratorListCreateArgs>(args: SelectSubset<T, ModeratorListCreateArgs<ExtArgs>>): Prisma__ModeratorListClient<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ModeratorLists.
     * @param {ModeratorListCreateManyArgs} args - Arguments to create many ModeratorLists.
     * @example
     * // Create many ModeratorLists
     * const moderatorList = await prisma.moderatorList.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ModeratorListCreateManyArgs>(args?: SelectSubset<T, ModeratorListCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ModeratorLists and returns the data saved in the database.
     * @param {ModeratorListCreateManyAndReturnArgs} args - Arguments to create many ModeratorLists.
     * @example
     * // Create many ModeratorLists
     * const moderatorList = await prisma.moderatorList.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ModeratorLists and only return the `id`
     * const moderatorListWithIdOnly = await prisma.moderatorList.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ModeratorListCreateManyAndReturnArgs>(args?: SelectSubset<T, ModeratorListCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ModeratorList.
     * @param {ModeratorListDeleteArgs} args - Arguments to delete one ModeratorList.
     * @example
     * // Delete one ModeratorList
     * const ModeratorList = await prisma.moderatorList.delete({
     *   where: {
     *     // ... filter to delete one ModeratorList
     *   }
     * })
     * 
     */
    delete<T extends ModeratorListDeleteArgs>(args: SelectSubset<T, ModeratorListDeleteArgs<ExtArgs>>): Prisma__ModeratorListClient<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ModeratorList.
     * @param {ModeratorListUpdateArgs} args - Arguments to update one ModeratorList.
     * @example
     * // Update one ModeratorList
     * const moderatorList = await prisma.moderatorList.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ModeratorListUpdateArgs>(args: SelectSubset<T, ModeratorListUpdateArgs<ExtArgs>>): Prisma__ModeratorListClient<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ModeratorLists.
     * @param {ModeratorListDeleteManyArgs} args - Arguments to filter ModeratorLists to delete.
     * @example
     * // Delete a few ModeratorLists
     * const { count } = await prisma.moderatorList.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ModeratorListDeleteManyArgs>(args?: SelectSubset<T, ModeratorListDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ModeratorLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorListUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ModeratorLists
     * const moderatorList = await prisma.moderatorList.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ModeratorListUpdateManyArgs>(args: SelectSubset<T, ModeratorListUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ModeratorLists and returns the data updated in the database.
     * @param {ModeratorListUpdateManyAndReturnArgs} args - Arguments to update many ModeratorLists.
     * @example
     * // Update many ModeratorLists
     * const moderatorList = await prisma.moderatorList.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ModeratorLists and only return the `id`
     * const moderatorListWithIdOnly = await prisma.moderatorList.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ModeratorListUpdateManyAndReturnArgs>(args: SelectSubset<T, ModeratorListUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ModeratorList.
     * @param {ModeratorListUpsertArgs} args - Arguments to update or create a ModeratorList.
     * @example
     * // Update or create a ModeratorList
     * const moderatorList = await prisma.moderatorList.upsert({
     *   create: {
     *     // ... data to create a ModeratorList
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ModeratorList we want to update
     *   }
     * })
     */
    upsert<T extends ModeratorListUpsertArgs>(args: SelectSubset<T, ModeratorListUpsertArgs<ExtArgs>>): Prisma__ModeratorListClient<$Result.GetResult<Prisma.$ModeratorListPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ModeratorLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorListCountArgs} args - Arguments to filter ModeratorLists to count.
     * @example
     * // Count the number of ModeratorLists
     * const count = await prisma.moderatorList.count({
     *   where: {
     *     // ... the filter for the ModeratorLists we want to count
     *   }
     * })
    **/
    count<T extends ModeratorListCountArgs>(
      args?: Subset<T, ModeratorListCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ModeratorListCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ModeratorList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorListAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ModeratorListAggregateArgs>(args: Subset<T, ModeratorListAggregateArgs>): Prisma.PrismaPromise<GetModeratorListAggregateType<T>>

    /**
     * Group by ModeratorList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorListGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ModeratorListGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ModeratorListGroupByArgs['orderBy'] }
        : { orderBy?: ModeratorListGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ModeratorListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModeratorListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ModeratorList model
   */
  readonly fields: ModeratorListFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ModeratorList.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ModeratorListClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    moderator<T extends AuthDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthDefaultArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ModeratorList model
   */
  interface ModeratorListFieldRefs {
    readonly id: FieldRef<"ModeratorList", 'Int'>
    readonly moderatorName: FieldRef<"ModeratorList", 'String'>
    readonly moderatorContact: FieldRef<"ModeratorList", 'String'>
    readonly authId: FieldRef<"ModeratorList", 'Int'>
    readonly createdAt: FieldRef<"ModeratorList", 'DateTime'>
    readonly updatedAt: FieldRef<"ModeratorList", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ModeratorList findUnique
   */
  export type ModeratorListFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
    /**
     * Filter, which ModeratorList to fetch.
     */
    where: ModeratorListWhereUniqueInput
  }

  /**
   * ModeratorList findUniqueOrThrow
   */
  export type ModeratorListFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
    /**
     * Filter, which ModeratorList to fetch.
     */
    where: ModeratorListWhereUniqueInput
  }

  /**
   * ModeratorList findFirst
   */
  export type ModeratorListFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
    /**
     * Filter, which ModeratorList to fetch.
     */
    where?: ModeratorListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModeratorLists to fetch.
     */
    orderBy?: ModeratorListOrderByWithRelationInput | ModeratorListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ModeratorLists.
     */
    cursor?: ModeratorListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModeratorLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModeratorLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ModeratorLists.
     */
    distinct?: ModeratorListScalarFieldEnum | ModeratorListScalarFieldEnum[]
  }

  /**
   * ModeratorList findFirstOrThrow
   */
  export type ModeratorListFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
    /**
     * Filter, which ModeratorList to fetch.
     */
    where?: ModeratorListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModeratorLists to fetch.
     */
    orderBy?: ModeratorListOrderByWithRelationInput | ModeratorListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ModeratorLists.
     */
    cursor?: ModeratorListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModeratorLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModeratorLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ModeratorLists.
     */
    distinct?: ModeratorListScalarFieldEnum | ModeratorListScalarFieldEnum[]
  }

  /**
   * ModeratorList findMany
   */
  export type ModeratorListFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
    /**
     * Filter, which ModeratorLists to fetch.
     */
    where?: ModeratorListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModeratorLists to fetch.
     */
    orderBy?: ModeratorListOrderByWithRelationInput | ModeratorListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ModeratorLists.
     */
    cursor?: ModeratorListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModeratorLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModeratorLists.
     */
    skip?: number
    distinct?: ModeratorListScalarFieldEnum | ModeratorListScalarFieldEnum[]
  }

  /**
   * ModeratorList create
   */
  export type ModeratorListCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
    /**
     * The data needed to create a ModeratorList.
     */
    data: XOR<ModeratorListCreateInput, ModeratorListUncheckedCreateInput>
  }

  /**
   * ModeratorList createMany
   */
  export type ModeratorListCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ModeratorLists.
     */
    data: ModeratorListCreateManyInput | ModeratorListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ModeratorList createManyAndReturn
   */
  export type ModeratorListCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * The data used to create many ModeratorLists.
     */
    data: ModeratorListCreateManyInput | ModeratorListCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ModeratorList update
   */
  export type ModeratorListUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
    /**
     * The data needed to update a ModeratorList.
     */
    data: XOR<ModeratorListUpdateInput, ModeratorListUncheckedUpdateInput>
    /**
     * Choose, which ModeratorList to update.
     */
    where: ModeratorListWhereUniqueInput
  }

  /**
   * ModeratorList updateMany
   */
  export type ModeratorListUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ModeratorLists.
     */
    data: XOR<ModeratorListUpdateManyMutationInput, ModeratorListUncheckedUpdateManyInput>
    /**
     * Filter which ModeratorLists to update
     */
    where?: ModeratorListWhereInput
    /**
     * Limit how many ModeratorLists to update.
     */
    limit?: number
  }

  /**
   * ModeratorList updateManyAndReturn
   */
  export type ModeratorListUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * The data used to update ModeratorLists.
     */
    data: XOR<ModeratorListUpdateManyMutationInput, ModeratorListUncheckedUpdateManyInput>
    /**
     * Filter which ModeratorLists to update
     */
    where?: ModeratorListWhereInput
    /**
     * Limit how many ModeratorLists to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ModeratorList upsert
   */
  export type ModeratorListUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
    /**
     * The filter to search for the ModeratorList to update in case it exists.
     */
    where: ModeratorListWhereUniqueInput
    /**
     * In case the ModeratorList found by the `where` argument doesn't exist, create a new ModeratorList with this data.
     */
    create: XOR<ModeratorListCreateInput, ModeratorListUncheckedCreateInput>
    /**
     * In case the ModeratorList was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ModeratorListUpdateInput, ModeratorListUncheckedUpdateInput>
  }

  /**
   * ModeratorList delete
   */
  export type ModeratorListDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
    /**
     * Filter which ModeratorList to delete.
     */
    where: ModeratorListWhereUniqueInput
  }

  /**
   * ModeratorList deleteMany
   */
  export type ModeratorListDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ModeratorLists to delete
     */
    where?: ModeratorListWhereInput
    /**
     * Limit how many ModeratorLists to delete.
     */
    limit?: number
  }

  /**
   * ModeratorList without action
   */
  export type ModeratorListDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModeratorList
     */
    select?: ModeratorListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModeratorList
     */
    omit?: ModeratorListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModeratorListInclude<ExtArgs> | null
  }


  /**
   * Model FamilyTree
   */

  export type AggregateFamilyTree = {
    _count: FamilyTreeCountAggregateOutputType | null
    _avg: FamilyTreeAvgAggregateOutputType | null
    _sum: FamilyTreeSumAggregateOutputType | null
    _min: FamilyTreeMinAggregateOutputType | null
    _max: FamilyTreeMaxAggregateOutputType | null
  }

  export type FamilyTreeAvgAggregateOutputType = {
    id: number | null
    authId: number | null
  }

  export type FamilyTreeSumAggregateOutputType = {
    id: number | null
    authId: number | null
  }

  export type FamilyTreeMinAggregateOutputType = {
    id: number | null
    authId: number | null
    status: string | null
    lastBuildStartedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FamilyTreeMaxAggregateOutputType = {
    id: number | null
    authId: number | null
    status: string | null
    lastBuildStartedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FamilyTreeCountAggregateOutputType = {
    id: number
    authId: number
    data: number
    status: number
    lastBuildStartedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FamilyTreeAvgAggregateInputType = {
    id?: true
    authId?: true
  }

  export type FamilyTreeSumAggregateInputType = {
    id?: true
    authId?: true
  }

  export type FamilyTreeMinAggregateInputType = {
    id?: true
    authId?: true
    status?: true
    lastBuildStartedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FamilyTreeMaxAggregateInputType = {
    id?: true
    authId?: true
    status?: true
    lastBuildStartedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FamilyTreeCountAggregateInputType = {
    id?: true
    authId?: true
    data?: true
    status?: true
    lastBuildStartedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FamilyTreeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FamilyTree to aggregate.
     */
    where?: FamilyTreeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FamilyTrees to fetch.
     */
    orderBy?: FamilyTreeOrderByWithRelationInput | FamilyTreeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FamilyTreeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FamilyTrees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FamilyTrees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FamilyTrees
    **/
    _count?: true | FamilyTreeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FamilyTreeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FamilyTreeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FamilyTreeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FamilyTreeMaxAggregateInputType
  }

  export type GetFamilyTreeAggregateType<T extends FamilyTreeAggregateArgs> = {
        [P in keyof T & keyof AggregateFamilyTree]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFamilyTree[P]>
      : GetScalarType<T[P], AggregateFamilyTree[P]>
  }




  export type FamilyTreeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FamilyTreeWhereInput
    orderBy?: FamilyTreeOrderByWithAggregationInput | FamilyTreeOrderByWithAggregationInput[]
    by: FamilyTreeScalarFieldEnum[] | FamilyTreeScalarFieldEnum
    having?: FamilyTreeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FamilyTreeCountAggregateInputType | true
    _avg?: FamilyTreeAvgAggregateInputType
    _sum?: FamilyTreeSumAggregateInputType
    _min?: FamilyTreeMinAggregateInputType
    _max?: FamilyTreeMaxAggregateInputType
  }

  export type FamilyTreeGroupByOutputType = {
    id: number
    authId: number
    data: JsonValue | null
    status: string
    lastBuildStartedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: FamilyTreeCountAggregateOutputType | null
    _avg: FamilyTreeAvgAggregateOutputType | null
    _sum: FamilyTreeSumAggregateOutputType | null
    _min: FamilyTreeMinAggregateOutputType | null
    _max: FamilyTreeMaxAggregateOutputType | null
  }

  type GetFamilyTreeGroupByPayload<T extends FamilyTreeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FamilyTreeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FamilyTreeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FamilyTreeGroupByOutputType[P]>
            : GetScalarType<T[P], FamilyTreeGroupByOutputType[P]>
        }
      >
    >


  export type FamilyTreeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authId?: boolean
    data?: boolean
    status?: boolean
    lastBuildStartedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["familyTree"]>

  export type FamilyTreeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authId?: boolean
    data?: boolean
    status?: boolean
    lastBuildStartedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["familyTree"]>

  export type FamilyTreeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authId?: boolean
    data?: boolean
    status?: boolean
    lastBuildStartedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["familyTree"]>

  export type FamilyTreeSelectScalar = {
    id?: boolean
    authId?: boolean
    data?: boolean
    status?: boolean
    lastBuildStartedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FamilyTreeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authId" | "data" | "status" | "lastBuildStartedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["familyTree"]>
  export type FamilyTreeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }
  export type FamilyTreeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }
  export type FamilyTreeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auth?: boolean | AuthDefaultArgs<ExtArgs>
  }

  export type $FamilyTreePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FamilyTree"
    objects: {
      auth: Prisma.$AuthPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      authId: number
      data: Prisma.JsonValue | null
      status: string
      lastBuildStartedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["familyTree"]>
    composites: {}
  }

  type FamilyTreeGetPayload<S extends boolean | null | undefined | FamilyTreeDefaultArgs> = $Result.GetResult<Prisma.$FamilyTreePayload, S>

  type FamilyTreeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FamilyTreeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FamilyTreeCountAggregateInputType | true
    }

  export interface FamilyTreeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FamilyTree'], meta: { name: 'FamilyTree' } }
    /**
     * Find zero or one FamilyTree that matches the filter.
     * @param {FamilyTreeFindUniqueArgs} args - Arguments to find a FamilyTree
     * @example
     * // Get one FamilyTree
     * const familyTree = await prisma.familyTree.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FamilyTreeFindUniqueArgs>(args: SelectSubset<T, FamilyTreeFindUniqueArgs<ExtArgs>>): Prisma__FamilyTreeClient<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FamilyTree that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FamilyTreeFindUniqueOrThrowArgs} args - Arguments to find a FamilyTree
     * @example
     * // Get one FamilyTree
     * const familyTree = await prisma.familyTree.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FamilyTreeFindUniqueOrThrowArgs>(args: SelectSubset<T, FamilyTreeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FamilyTreeClient<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FamilyTree that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyTreeFindFirstArgs} args - Arguments to find a FamilyTree
     * @example
     * // Get one FamilyTree
     * const familyTree = await prisma.familyTree.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FamilyTreeFindFirstArgs>(args?: SelectSubset<T, FamilyTreeFindFirstArgs<ExtArgs>>): Prisma__FamilyTreeClient<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FamilyTree that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyTreeFindFirstOrThrowArgs} args - Arguments to find a FamilyTree
     * @example
     * // Get one FamilyTree
     * const familyTree = await prisma.familyTree.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FamilyTreeFindFirstOrThrowArgs>(args?: SelectSubset<T, FamilyTreeFindFirstOrThrowArgs<ExtArgs>>): Prisma__FamilyTreeClient<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FamilyTrees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyTreeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FamilyTrees
     * const familyTrees = await prisma.familyTree.findMany()
     * 
     * // Get first 10 FamilyTrees
     * const familyTrees = await prisma.familyTree.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const familyTreeWithIdOnly = await prisma.familyTree.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FamilyTreeFindManyArgs>(args?: SelectSubset<T, FamilyTreeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FamilyTree.
     * @param {FamilyTreeCreateArgs} args - Arguments to create a FamilyTree.
     * @example
     * // Create one FamilyTree
     * const FamilyTree = await prisma.familyTree.create({
     *   data: {
     *     // ... data to create a FamilyTree
     *   }
     * })
     * 
     */
    create<T extends FamilyTreeCreateArgs>(args: SelectSubset<T, FamilyTreeCreateArgs<ExtArgs>>): Prisma__FamilyTreeClient<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FamilyTrees.
     * @param {FamilyTreeCreateManyArgs} args - Arguments to create many FamilyTrees.
     * @example
     * // Create many FamilyTrees
     * const familyTree = await prisma.familyTree.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FamilyTreeCreateManyArgs>(args?: SelectSubset<T, FamilyTreeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FamilyTrees and returns the data saved in the database.
     * @param {FamilyTreeCreateManyAndReturnArgs} args - Arguments to create many FamilyTrees.
     * @example
     * // Create many FamilyTrees
     * const familyTree = await prisma.familyTree.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FamilyTrees and only return the `id`
     * const familyTreeWithIdOnly = await prisma.familyTree.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FamilyTreeCreateManyAndReturnArgs>(args?: SelectSubset<T, FamilyTreeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FamilyTree.
     * @param {FamilyTreeDeleteArgs} args - Arguments to delete one FamilyTree.
     * @example
     * // Delete one FamilyTree
     * const FamilyTree = await prisma.familyTree.delete({
     *   where: {
     *     // ... filter to delete one FamilyTree
     *   }
     * })
     * 
     */
    delete<T extends FamilyTreeDeleteArgs>(args: SelectSubset<T, FamilyTreeDeleteArgs<ExtArgs>>): Prisma__FamilyTreeClient<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FamilyTree.
     * @param {FamilyTreeUpdateArgs} args - Arguments to update one FamilyTree.
     * @example
     * // Update one FamilyTree
     * const familyTree = await prisma.familyTree.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FamilyTreeUpdateArgs>(args: SelectSubset<T, FamilyTreeUpdateArgs<ExtArgs>>): Prisma__FamilyTreeClient<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FamilyTrees.
     * @param {FamilyTreeDeleteManyArgs} args - Arguments to filter FamilyTrees to delete.
     * @example
     * // Delete a few FamilyTrees
     * const { count } = await prisma.familyTree.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FamilyTreeDeleteManyArgs>(args?: SelectSubset<T, FamilyTreeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FamilyTrees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyTreeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FamilyTrees
     * const familyTree = await prisma.familyTree.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FamilyTreeUpdateManyArgs>(args: SelectSubset<T, FamilyTreeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FamilyTrees and returns the data updated in the database.
     * @param {FamilyTreeUpdateManyAndReturnArgs} args - Arguments to update many FamilyTrees.
     * @example
     * // Update many FamilyTrees
     * const familyTree = await prisma.familyTree.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FamilyTrees and only return the `id`
     * const familyTreeWithIdOnly = await prisma.familyTree.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FamilyTreeUpdateManyAndReturnArgs>(args: SelectSubset<T, FamilyTreeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FamilyTree.
     * @param {FamilyTreeUpsertArgs} args - Arguments to update or create a FamilyTree.
     * @example
     * // Update or create a FamilyTree
     * const familyTree = await prisma.familyTree.upsert({
     *   create: {
     *     // ... data to create a FamilyTree
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FamilyTree we want to update
     *   }
     * })
     */
    upsert<T extends FamilyTreeUpsertArgs>(args: SelectSubset<T, FamilyTreeUpsertArgs<ExtArgs>>): Prisma__FamilyTreeClient<$Result.GetResult<Prisma.$FamilyTreePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FamilyTrees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyTreeCountArgs} args - Arguments to filter FamilyTrees to count.
     * @example
     * // Count the number of FamilyTrees
     * const count = await prisma.familyTree.count({
     *   where: {
     *     // ... the filter for the FamilyTrees we want to count
     *   }
     * })
    **/
    count<T extends FamilyTreeCountArgs>(
      args?: Subset<T, FamilyTreeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FamilyTreeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FamilyTree.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyTreeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FamilyTreeAggregateArgs>(args: Subset<T, FamilyTreeAggregateArgs>): Prisma.PrismaPromise<GetFamilyTreeAggregateType<T>>

    /**
     * Group by FamilyTree.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyTreeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FamilyTreeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FamilyTreeGroupByArgs['orderBy'] }
        : { orderBy?: FamilyTreeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FamilyTreeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFamilyTreeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FamilyTree model
   */
  readonly fields: FamilyTreeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FamilyTree.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FamilyTreeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auth<T extends AuthDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthDefaultArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FamilyTree model
   */
  interface FamilyTreeFieldRefs {
    readonly id: FieldRef<"FamilyTree", 'Int'>
    readonly authId: FieldRef<"FamilyTree", 'Int'>
    readonly data: FieldRef<"FamilyTree", 'Json'>
    readonly status: FieldRef<"FamilyTree", 'String'>
    readonly lastBuildStartedAt: FieldRef<"FamilyTree", 'DateTime'>
    readonly createdAt: FieldRef<"FamilyTree", 'DateTime'>
    readonly updatedAt: FieldRef<"FamilyTree", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FamilyTree findUnique
   */
  export type FamilyTreeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
    /**
     * Filter, which FamilyTree to fetch.
     */
    where: FamilyTreeWhereUniqueInput
  }

  /**
   * FamilyTree findUniqueOrThrow
   */
  export type FamilyTreeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
    /**
     * Filter, which FamilyTree to fetch.
     */
    where: FamilyTreeWhereUniqueInput
  }

  /**
   * FamilyTree findFirst
   */
  export type FamilyTreeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
    /**
     * Filter, which FamilyTree to fetch.
     */
    where?: FamilyTreeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FamilyTrees to fetch.
     */
    orderBy?: FamilyTreeOrderByWithRelationInput | FamilyTreeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FamilyTrees.
     */
    cursor?: FamilyTreeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FamilyTrees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FamilyTrees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FamilyTrees.
     */
    distinct?: FamilyTreeScalarFieldEnum | FamilyTreeScalarFieldEnum[]
  }

  /**
   * FamilyTree findFirstOrThrow
   */
  export type FamilyTreeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
    /**
     * Filter, which FamilyTree to fetch.
     */
    where?: FamilyTreeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FamilyTrees to fetch.
     */
    orderBy?: FamilyTreeOrderByWithRelationInput | FamilyTreeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FamilyTrees.
     */
    cursor?: FamilyTreeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FamilyTrees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FamilyTrees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FamilyTrees.
     */
    distinct?: FamilyTreeScalarFieldEnum | FamilyTreeScalarFieldEnum[]
  }

  /**
   * FamilyTree findMany
   */
  export type FamilyTreeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
    /**
     * Filter, which FamilyTrees to fetch.
     */
    where?: FamilyTreeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FamilyTrees to fetch.
     */
    orderBy?: FamilyTreeOrderByWithRelationInput | FamilyTreeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FamilyTrees.
     */
    cursor?: FamilyTreeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FamilyTrees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FamilyTrees.
     */
    skip?: number
    distinct?: FamilyTreeScalarFieldEnum | FamilyTreeScalarFieldEnum[]
  }

  /**
   * FamilyTree create
   */
  export type FamilyTreeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
    /**
     * The data needed to create a FamilyTree.
     */
    data: XOR<FamilyTreeCreateInput, FamilyTreeUncheckedCreateInput>
  }

  /**
   * FamilyTree createMany
   */
  export type FamilyTreeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FamilyTrees.
     */
    data: FamilyTreeCreateManyInput | FamilyTreeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FamilyTree createManyAndReturn
   */
  export type FamilyTreeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * The data used to create many FamilyTrees.
     */
    data: FamilyTreeCreateManyInput | FamilyTreeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FamilyTree update
   */
  export type FamilyTreeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
    /**
     * The data needed to update a FamilyTree.
     */
    data: XOR<FamilyTreeUpdateInput, FamilyTreeUncheckedUpdateInput>
    /**
     * Choose, which FamilyTree to update.
     */
    where: FamilyTreeWhereUniqueInput
  }

  /**
   * FamilyTree updateMany
   */
  export type FamilyTreeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FamilyTrees.
     */
    data: XOR<FamilyTreeUpdateManyMutationInput, FamilyTreeUncheckedUpdateManyInput>
    /**
     * Filter which FamilyTrees to update
     */
    where?: FamilyTreeWhereInput
    /**
     * Limit how many FamilyTrees to update.
     */
    limit?: number
  }

  /**
   * FamilyTree updateManyAndReturn
   */
  export type FamilyTreeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * The data used to update FamilyTrees.
     */
    data: XOR<FamilyTreeUpdateManyMutationInput, FamilyTreeUncheckedUpdateManyInput>
    /**
     * Filter which FamilyTrees to update
     */
    where?: FamilyTreeWhereInput
    /**
     * Limit how many FamilyTrees to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FamilyTree upsert
   */
  export type FamilyTreeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
    /**
     * The filter to search for the FamilyTree to update in case it exists.
     */
    where: FamilyTreeWhereUniqueInput
    /**
     * In case the FamilyTree found by the `where` argument doesn't exist, create a new FamilyTree with this data.
     */
    create: XOR<FamilyTreeCreateInput, FamilyTreeUncheckedCreateInput>
    /**
     * In case the FamilyTree was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FamilyTreeUpdateInput, FamilyTreeUncheckedUpdateInput>
  }

  /**
   * FamilyTree delete
   */
  export type FamilyTreeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
    /**
     * Filter which FamilyTree to delete.
     */
    where: FamilyTreeWhereUniqueInput
  }

  /**
   * FamilyTree deleteMany
   */
  export type FamilyTreeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FamilyTrees to delete
     */
    where?: FamilyTreeWhereInput
    /**
     * Limit how many FamilyTrees to delete.
     */
    limit?: number
  }

  /**
   * FamilyTree without action
   */
  export type FamilyTreeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyTree
     */
    select?: FamilyTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FamilyTree
     */
    omit?: FamilyTreeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FamilyTreeInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AuthScalarFieldEnum: {
    id: 'id',
    mainMemberId: 'mainMemberId',
    moderatorPassword: 'moderatorPassword',
    password: 'password',
    memberAuthId: 'memberAuthId',
    moderatorAuthId: 'moderatorAuthId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuthScalarFieldEnum = (typeof AuthScalarFieldEnum)[keyof typeof AuthScalarFieldEnum]


  export const MemberScalarFieldEnum: {
    id: 'id',
    authId: 'authId',
    verified: 'verified',
    name: 'name',
    birthDate: 'birthDate',
    birthMonth: 'birthMonth',
    birthYear: 'birthYear',
    deceased: 'deceased',
    deathDate: 'deathDate',
    deathMonth: 'deathMonth',
    deathYear: 'deathYear',
    gender: 'gender',
    phoneNumber: 'phoneNumber',
    birthPlace: 'birthPlace',
    currentAddress: 'currentAddress',
    city: 'city',
    state: 'state',
    country: 'country',
    occupation: 'occupation',
    education: 'education',
    additionalInfo: 'additionalInfo',
    descendant: 'descendant',
    order: 'order',
    fatherId: 'fatherId',
    motherId: 'motherId',
    partnerId: 'partnerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MemberScalarFieldEnum = (typeof MemberScalarFieldEnum)[keyof typeof MemberScalarFieldEnum]


  export const RequestDetailsScalarFieldEnum: {
    id: 'id',
    authId: 'authId',
    type: 'type',
    details: 'details',
    memberId: 'memberId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RequestDetailsScalarFieldEnum = (typeof RequestDetailsScalarFieldEnum)[keyof typeof RequestDetailsScalarFieldEnum]


  export const NonDescendantRelationScalarFieldEnum: {
    id: 'id',
    memberId: 'memberId',
    fatherName: 'fatherName',
    motherName: 'motherName',
    siblingNames: 'siblingNames',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NonDescendantRelationScalarFieldEnum = (typeof NonDescendantRelationScalarFieldEnum)[keyof typeof NonDescendantRelationScalarFieldEnum]


  export const ModeratorListScalarFieldEnum: {
    id: 'id',
    moderatorName: 'moderatorName',
    moderatorContact: 'moderatorContact',
    authId: 'authId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ModeratorListScalarFieldEnum = (typeof ModeratorListScalarFieldEnum)[keyof typeof ModeratorListScalarFieldEnum]


  export const FamilyTreeScalarFieldEnum: {
    id: 'id',
    authId: 'authId',
    data: 'data',
    status: 'status',
    lastBuildStartedAt: 'lastBuildStartedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FamilyTreeScalarFieldEnum = (typeof FamilyTreeScalarFieldEnum)[keyof typeof FamilyTreeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AuthWhereInput = {
    AND?: AuthWhereInput | AuthWhereInput[]
    OR?: AuthWhereInput[]
    NOT?: AuthWhereInput | AuthWhereInput[]
    id?: IntFilter<"Auth"> | number
    mainMemberId?: IntNullableFilter<"Auth"> | number | null
    moderatorPassword?: StringFilter<"Auth"> | string
    password?: StringFilter<"Auth"> | string
    memberAuthId?: StringNullableFilter<"Auth"> | string | null
    moderatorAuthId?: StringNullableFilter<"Auth"> | string | null
    createdAt?: DateTimeFilter<"Auth"> | Date | string
    updatedAt?: DateTimeFilter<"Auth"> | Date | string
    moderatorList?: ModeratorListListRelationFilter
    familyTree?: XOR<FamilyTreeNullableScalarRelationFilter, FamilyTreeWhereInput> | null
    members?: MemberListRelationFilter
  }

  export type AuthOrderByWithRelationInput = {
    id?: SortOrder
    mainMemberId?: SortOrderInput | SortOrder
    moderatorPassword?: SortOrder
    password?: SortOrder
    memberAuthId?: SortOrderInput | SortOrder
    moderatorAuthId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    moderatorList?: ModeratorListOrderByRelationAggregateInput
    familyTree?: FamilyTreeOrderByWithRelationInput
    members?: MemberOrderByRelationAggregateInput
  }

  export type AuthWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    mainMemberId?: number
    password?: string
    memberAuthId?: string
    moderatorAuthId?: string
    AND?: AuthWhereInput | AuthWhereInput[]
    OR?: AuthWhereInput[]
    NOT?: AuthWhereInput | AuthWhereInput[]
    moderatorPassword?: StringFilter<"Auth"> | string
    createdAt?: DateTimeFilter<"Auth"> | Date | string
    updatedAt?: DateTimeFilter<"Auth"> | Date | string
    moderatorList?: ModeratorListListRelationFilter
    familyTree?: XOR<FamilyTreeNullableScalarRelationFilter, FamilyTreeWhereInput> | null
    members?: MemberListRelationFilter
  }, "id" | "mainMemberId" | "password" | "memberAuthId" | "moderatorAuthId">

  export type AuthOrderByWithAggregationInput = {
    id?: SortOrder
    mainMemberId?: SortOrderInput | SortOrder
    moderatorPassword?: SortOrder
    password?: SortOrder
    memberAuthId?: SortOrderInput | SortOrder
    moderatorAuthId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuthCountOrderByAggregateInput
    _avg?: AuthAvgOrderByAggregateInput
    _max?: AuthMaxOrderByAggregateInput
    _min?: AuthMinOrderByAggregateInput
    _sum?: AuthSumOrderByAggregateInput
  }

  export type AuthScalarWhereWithAggregatesInput = {
    AND?: AuthScalarWhereWithAggregatesInput | AuthScalarWhereWithAggregatesInput[]
    OR?: AuthScalarWhereWithAggregatesInput[]
    NOT?: AuthScalarWhereWithAggregatesInput | AuthScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Auth"> | number
    mainMemberId?: IntNullableWithAggregatesFilter<"Auth"> | number | null
    moderatorPassword?: StringWithAggregatesFilter<"Auth"> | string
    password?: StringWithAggregatesFilter<"Auth"> | string
    memberAuthId?: StringNullableWithAggregatesFilter<"Auth"> | string | null
    moderatorAuthId?: StringNullableWithAggregatesFilter<"Auth"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Auth"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Auth"> | Date | string
  }

  export type MemberWhereInput = {
    AND?: MemberWhereInput | MemberWhereInput[]
    OR?: MemberWhereInput[]
    NOT?: MemberWhereInput | MemberWhereInput[]
    id?: IntFilter<"Member"> | number
    authId?: IntFilter<"Member"> | number
    verified?: BoolNullableFilter<"Member"> | boolean | null
    name?: StringFilter<"Member"> | string
    birthDate?: IntNullableFilter<"Member"> | number | null
    birthMonth?: IntNullableFilter<"Member"> | number | null
    birthYear?: IntNullableFilter<"Member"> | number | null
    deceased?: BoolFilter<"Member"> | boolean
    deathDate?: IntNullableFilter<"Member"> | number | null
    deathMonth?: IntNullableFilter<"Member"> | number | null
    deathYear?: IntNullableFilter<"Member"> | number | null
    gender?: StringFilter<"Member"> | string
    phoneNumber?: StringNullableFilter<"Member"> | string | null
    birthPlace?: StringNullableFilter<"Member"> | string | null
    currentAddress?: StringNullableFilter<"Member"> | string | null
    city?: StringNullableFilter<"Member"> | string | null
    state?: StringNullableFilter<"Member"> | string | null
    country?: StringNullableFilter<"Member"> | string | null
    occupation?: StringNullableFilter<"Member"> | string | null
    education?: StringNullableFilter<"Member"> | string | null
    additionalInfo?: StringNullableFilter<"Member"> | string | null
    descendant?: BoolFilter<"Member"> | boolean
    order?: IntFilter<"Member"> | number
    fatherId?: IntNullableFilter<"Member"> | number | null
    motherId?: IntNullableFilter<"Member"> | number | null
    partnerId?: IntNullableFilter<"Member"> | number | null
    createdAt?: DateTimeFilter<"Member"> | Date | string
    updatedAt?: DateTimeFilter<"Member"> | Date | string
    pendingVerification?: RequestDetailsListRelationFilter
    nonDescendantRelation?: NonDescendantRelationListRelationFilter
    father?: XOR<MemberNullableScalarRelationFilter, MemberWhereInput> | null
    mother?: XOR<MemberNullableScalarRelationFilter, MemberWhereInput> | null
    partner?: XOR<MemberNullableScalarRelationFilter, MemberWhereInput> | null
    partnerOf?: MemberListRelationFilter
    fatherOf?: MemberListRelationFilter
    motherOf?: MemberListRelationFilter
    auth?: XOR<AuthScalarRelationFilter, AuthWhereInput>
  }

  export type MemberOrderByWithRelationInput = {
    id?: SortOrder
    authId?: SortOrder
    verified?: SortOrderInput | SortOrder
    name?: SortOrder
    birthDate?: SortOrderInput | SortOrder
    birthMonth?: SortOrderInput | SortOrder
    birthYear?: SortOrderInput | SortOrder
    deceased?: SortOrder
    deathDate?: SortOrderInput | SortOrder
    deathMonth?: SortOrderInput | SortOrder
    deathYear?: SortOrderInput | SortOrder
    gender?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    birthPlace?: SortOrderInput | SortOrder
    currentAddress?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    occupation?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    additionalInfo?: SortOrderInput | SortOrder
    descendant?: SortOrder
    order?: SortOrder
    fatherId?: SortOrderInput | SortOrder
    motherId?: SortOrderInput | SortOrder
    partnerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pendingVerification?: RequestDetailsOrderByRelationAggregateInput
    nonDescendantRelation?: nonDescendantRelationOrderByRelationAggregateInput
    father?: MemberOrderByWithRelationInput
    mother?: MemberOrderByWithRelationInput
    partner?: MemberOrderByWithRelationInput
    partnerOf?: MemberOrderByRelationAggregateInput
    fatherOf?: MemberOrderByRelationAggregateInput
    motherOf?: MemberOrderByRelationAggregateInput
    auth?: AuthOrderByWithRelationInput
  }

  export type MemberWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MemberWhereInput | MemberWhereInput[]
    OR?: MemberWhereInput[]
    NOT?: MemberWhereInput | MemberWhereInput[]
    authId?: IntFilter<"Member"> | number
    verified?: BoolNullableFilter<"Member"> | boolean | null
    name?: StringFilter<"Member"> | string
    birthDate?: IntNullableFilter<"Member"> | number | null
    birthMonth?: IntNullableFilter<"Member"> | number | null
    birthYear?: IntNullableFilter<"Member"> | number | null
    deceased?: BoolFilter<"Member"> | boolean
    deathDate?: IntNullableFilter<"Member"> | number | null
    deathMonth?: IntNullableFilter<"Member"> | number | null
    deathYear?: IntNullableFilter<"Member"> | number | null
    gender?: StringFilter<"Member"> | string
    phoneNumber?: StringNullableFilter<"Member"> | string | null
    birthPlace?: StringNullableFilter<"Member"> | string | null
    currentAddress?: StringNullableFilter<"Member"> | string | null
    city?: StringNullableFilter<"Member"> | string | null
    state?: StringNullableFilter<"Member"> | string | null
    country?: StringNullableFilter<"Member"> | string | null
    occupation?: StringNullableFilter<"Member"> | string | null
    education?: StringNullableFilter<"Member"> | string | null
    additionalInfo?: StringNullableFilter<"Member"> | string | null
    descendant?: BoolFilter<"Member"> | boolean
    order?: IntFilter<"Member"> | number
    fatherId?: IntNullableFilter<"Member"> | number | null
    motherId?: IntNullableFilter<"Member"> | number | null
    partnerId?: IntNullableFilter<"Member"> | number | null
    createdAt?: DateTimeFilter<"Member"> | Date | string
    updatedAt?: DateTimeFilter<"Member"> | Date | string
    pendingVerification?: RequestDetailsListRelationFilter
    nonDescendantRelation?: NonDescendantRelationListRelationFilter
    father?: XOR<MemberNullableScalarRelationFilter, MemberWhereInput> | null
    mother?: XOR<MemberNullableScalarRelationFilter, MemberWhereInput> | null
    partner?: XOR<MemberNullableScalarRelationFilter, MemberWhereInput> | null
    partnerOf?: MemberListRelationFilter
    fatherOf?: MemberListRelationFilter
    motherOf?: MemberListRelationFilter
    auth?: XOR<AuthScalarRelationFilter, AuthWhereInput>
  }, "id">

  export type MemberOrderByWithAggregationInput = {
    id?: SortOrder
    authId?: SortOrder
    verified?: SortOrderInput | SortOrder
    name?: SortOrder
    birthDate?: SortOrderInput | SortOrder
    birthMonth?: SortOrderInput | SortOrder
    birthYear?: SortOrderInput | SortOrder
    deceased?: SortOrder
    deathDate?: SortOrderInput | SortOrder
    deathMonth?: SortOrderInput | SortOrder
    deathYear?: SortOrderInput | SortOrder
    gender?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    birthPlace?: SortOrderInput | SortOrder
    currentAddress?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    occupation?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    additionalInfo?: SortOrderInput | SortOrder
    descendant?: SortOrder
    order?: SortOrder
    fatherId?: SortOrderInput | SortOrder
    motherId?: SortOrderInput | SortOrder
    partnerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MemberCountOrderByAggregateInput
    _avg?: MemberAvgOrderByAggregateInput
    _max?: MemberMaxOrderByAggregateInput
    _min?: MemberMinOrderByAggregateInput
    _sum?: MemberSumOrderByAggregateInput
  }

  export type MemberScalarWhereWithAggregatesInput = {
    AND?: MemberScalarWhereWithAggregatesInput | MemberScalarWhereWithAggregatesInput[]
    OR?: MemberScalarWhereWithAggregatesInput[]
    NOT?: MemberScalarWhereWithAggregatesInput | MemberScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Member"> | number
    authId?: IntWithAggregatesFilter<"Member"> | number
    verified?: BoolNullableWithAggregatesFilter<"Member"> | boolean | null
    name?: StringWithAggregatesFilter<"Member"> | string
    birthDate?: IntNullableWithAggregatesFilter<"Member"> | number | null
    birthMonth?: IntNullableWithAggregatesFilter<"Member"> | number | null
    birthYear?: IntNullableWithAggregatesFilter<"Member"> | number | null
    deceased?: BoolWithAggregatesFilter<"Member"> | boolean
    deathDate?: IntNullableWithAggregatesFilter<"Member"> | number | null
    deathMonth?: IntNullableWithAggregatesFilter<"Member"> | number | null
    deathYear?: IntNullableWithAggregatesFilter<"Member"> | number | null
    gender?: StringWithAggregatesFilter<"Member"> | string
    phoneNumber?: StringNullableWithAggregatesFilter<"Member"> | string | null
    birthPlace?: StringNullableWithAggregatesFilter<"Member"> | string | null
    currentAddress?: StringNullableWithAggregatesFilter<"Member"> | string | null
    city?: StringNullableWithAggregatesFilter<"Member"> | string | null
    state?: StringNullableWithAggregatesFilter<"Member"> | string | null
    country?: StringNullableWithAggregatesFilter<"Member"> | string | null
    occupation?: StringNullableWithAggregatesFilter<"Member"> | string | null
    education?: StringNullableWithAggregatesFilter<"Member"> | string | null
    additionalInfo?: StringNullableWithAggregatesFilter<"Member"> | string | null
    descendant?: BoolWithAggregatesFilter<"Member"> | boolean
    order?: IntWithAggregatesFilter<"Member"> | number
    fatherId?: IntNullableWithAggregatesFilter<"Member"> | number | null
    motherId?: IntNullableWithAggregatesFilter<"Member"> | number | null
    partnerId?: IntNullableWithAggregatesFilter<"Member"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Member"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Member"> | Date | string
  }

  export type RequestDetailsWhereInput = {
    AND?: RequestDetailsWhereInput | RequestDetailsWhereInput[]
    OR?: RequestDetailsWhereInput[]
    NOT?: RequestDetailsWhereInput | RequestDetailsWhereInput[]
    id?: IntFilter<"RequestDetails"> | number
    authId?: IntFilter<"RequestDetails"> | number
    type?: StringFilter<"RequestDetails"> | string
    details?: StringFilter<"RequestDetails"> | string
    memberId?: IntFilter<"RequestDetails"> | number
    createdAt?: DateTimeFilter<"RequestDetails"> | Date | string
    updatedAt?: DateTimeFilter<"RequestDetails"> | Date | string
    member?: XOR<MemberScalarRelationFilter, MemberWhereInput>
  }

  export type RequestDetailsOrderByWithRelationInput = {
    id?: SortOrder
    authId?: SortOrder
    type?: SortOrder
    details?: SortOrder
    memberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    member?: MemberOrderByWithRelationInput
  }

  export type RequestDetailsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RequestDetailsWhereInput | RequestDetailsWhereInput[]
    OR?: RequestDetailsWhereInput[]
    NOT?: RequestDetailsWhereInput | RequestDetailsWhereInput[]
    authId?: IntFilter<"RequestDetails"> | number
    type?: StringFilter<"RequestDetails"> | string
    details?: StringFilter<"RequestDetails"> | string
    memberId?: IntFilter<"RequestDetails"> | number
    createdAt?: DateTimeFilter<"RequestDetails"> | Date | string
    updatedAt?: DateTimeFilter<"RequestDetails"> | Date | string
    member?: XOR<MemberScalarRelationFilter, MemberWhereInput>
  }, "id">

  export type RequestDetailsOrderByWithAggregationInput = {
    id?: SortOrder
    authId?: SortOrder
    type?: SortOrder
    details?: SortOrder
    memberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RequestDetailsCountOrderByAggregateInput
    _avg?: RequestDetailsAvgOrderByAggregateInput
    _max?: RequestDetailsMaxOrderByAggregateInput
    _min?: RequestDetailsMinOrderByAggregateInput
    _sum?: RequestDetailsSumOrderByAggregateInput
  }

  export type RequestDetailsScalarWhereWithAggregatesInput = {
    AND?: RequestDetailsScalarWhereWithAggregatesInput | RequestDetailsScalarWhereWithAggregatesInput[]
    OR?: RequestDetailsScalarWhereWithAggregatesInput[]
    NOT?: RequestDetailsScalarWhereWithAggregatesInput | RequestDetailsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RequestDetails"> | number
    authId?: IntWithAggregatesFilter<"RequestDetails"> | number
    type?: StringWithAggregatesFilter<"RequestDetails"> | string
    details?: StringWithAggregatesFilter<"RequestDetails"> | string
    memberId?: IntWithAggregatesFilter<"RequestDetails"> | number
    createdAt?: DateTimeWithAggregatesFilter<"RequestDetails"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RequestDetails"> | Date | string
  }

  export type nonDescendantRelationWhereInput = {
    AND?: nonDescendantRelationWhereInput | nonDescendantRelationWhereInput[]
    OR?: nonDescendantRelationWhereInput[]
    NOT?: nonDescendantRelationWhereInput | nonDescendantRelationWhereInput[]
    id?: IntFilter<"nonDescendantRelation"> | number
    memberId?: IntFilter<"nonDescendantRelation"> | number
    fatherName?: StringNullableFilter<"nonDescendantRelation"> | string | null
    motherName?: StringNullableFilter<"nonDescendantRelation"> | string | null
    siblingNames?: StringNullableFilter<"nonDescendantRelation"> | string | null
    createdAt?: DateTimeFilter<"nonDescendantRelation"> | Date | string
    updatedAt?: DateTimeFilter<"nonDescendantRelation"> | Date | string
    member?: XOR<MemberScalarRelationFilter, MemberWhereInput>
  }

  export type nonDescendantRelationOrderByWithRelationInput = {
    id?: SortOrder
    memberId?: SortOrder
    fatherName?: SortOrderInput | SortOrder
    motherName?: SortOrderInput | SortOrder
    siblingNames?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    member?: MemberOrderByWithRelationInput
  }

  export type nonDescendantRelationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    memberId?: number
    AND?: nonDescendantRelationWhereInput | nonDescendantRelationWhereInput[]
    OR?: nonDescendantRelationWhereInput[]
    NOT?: nonDescendantRelationWhereInput | nonDescendantRelationWhereInput[]
    fatherName?: StringNullableFilter<"nonDescendantRelation"> | string | null
    motherName?: StringNullableFilter<"nonDescendantRelation"> | string | null
    siblingNames?: StringNullableFilter<"nonDescendantRelation"> | string | null
    createdAt?: DateTimeFilter<"nonDescendantRelation"> | Date | string
    updatedAt?: DateTimeFilter<"nonDescendantRelation"> | Date | string
    member?: XOR<MemberScalarRelationFilter, MemberWhereInput>
  }, "id" | "memberId">

  export type nonDescendantRelationOrderByWithAggregationInput = {
    id?: SortOrder
    memberId?: SortOrder
    fatherName?: SortOrderInput | SortOrder
    motherName?: SortOrderInput | SortOrder
    siblingNames?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: nonDescendantRelationCountOrderByAggregateInput
    _avg?: nonDescendantRelationAvgOrderByAggregateInput
    _max?: nonDescendantRelationMaxOrderByAggregateInput
    _min?: nonDescendantRelationMinOrderByAggregateInput
    _sum?: nonDescendantRelationSumOrderByAggregateInput
  }

  export type nonDescendantRelationScalarWhereWithAggregatesInput = {
    AND?: nonDescendantRelationScalarWhereWithAggregatesInput | nonDescendantRelationScalarWhereWithAggregatesInput[]
    OR?: nonDescendantRelationScalarWhereWithAggregatesInput[]
    NOT?: nonDescendantRelationScalarWhereWithAggregatesInput | nonDescendantRelationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"nonDescendantRelation"> | number
    memberId?: IntWithAggregatesFilter<"nonDescendantRelation"> | number
    fatherName?: StringNullableWithAggregatesFilter<"nonDescendantRelation"> | string | null
    motherName?: StringNullableWithAggregatesFilter<"nonDescendantRelation"> | string | null
    siblingNames?: StringNullableWithAggregatesFilter<"nonDescendantRelation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"nonDescendantRelation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"nonDescendantRelation"> | Date | string
  }

  export type ModeratorListWhereInput = {
    AND?: ModeratorListWhereInput | ModeratorListWhereInput[]
    OR?: ModeratorListWhereInput[]
    NOT?: ModeratorListWhereInput | ModeratorListWhereInput[]
    id?: IntFilter<"ModeratorList"> | number
    moderatorName?: StringFilter<"ModeratorList"> | string
    moderatorContact?: StringFilter<"ModeratorList"> | string
    authId?: IntFilter<"ModeratorList"> | number
    createdAt?: DateTimeFilter<"ModeratorList"> | Date | string
    updatedAt?: DateTimeFilter<"ModeratorList"> | Date | string
    moderator?: XOR<AuthScalarRelationFilter, AuthWhereInput>
  }

  export type ModeratorListOrderByWithRelationInput = {
    id?: SortOrder
    moderatorName?: SortOrder
    moderatorContact?: SortOrder
    authId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    moderator?: AuthOrderByWithRelationInput
  }

  export type ModeratorListWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ModeratorListWhereInput | ModeratorListWhereInput[]
    OR?: ModeratorListWhereInput[]
    NOT?: ModeratorListWhereInput | ModeratorListWhereInput[]
    moderatorName?: StringFilter<"ModeratorList"> | string
    moderatorContact?: StringFilter<"ModeratorList"> | string
    authId?: IntFilter<"ModeratorList"> | number
    createdAt?: DateTimeFilter<"ModeratorList"> | Date | string
    updatedAt?: DateTimeFilter<"ModeratorList"> | Date | string
    moderator?: XOR<AuthScalarRelationFilter, AuthWhereInput>
  }, "id">

  export type ModeratorListOrderByWithAggregationInput = {
    id?: SortOrder
    moderatorName?: SortOrder
    moderatorContact?: SortOrder
    authId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ModeratorListCountOrderByAggregateInput
    _avg?: ModeratorListAvgOrderByAggregateInput
    _max?: ModeratorListMaxOrderByAggregateInput
    _min?: ModeratorListMinOrderByAggregateInput
    _sum?: ModeratorListSumOrderByAggregateInput
  }

  export type ModeratorListScalarWhereWithAggregatesInput = {
    AND?: ModeratorListScalarWhereWithAggregatesInput | ModeratorListScalarWhereWithAggregatesInput[]
    OR?: ModeratorListScalarWhereWithAggregatesInput[]
    NOT?: ModeratorListScalarWhereWithAggregatesInput | ModeratorListScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ModeratorList"> | number
    moderatorName?: StringWithAggregatesFilter<"ModeratorList"> | string
    moderatorContact?: StringWithAggregatesFilter<"ModeratorList"> | string
    authId?: IntWithAggregatesFilter<"ModeratorList"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ModeratorList"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ModeratorList"> | Date | string
  }

  export type FamilyTreeWhereInput = {
    AND?: FamilyTreeWhereInput | FamilyTreeWhereInput[]
    OR?: FamilyTreeWhereInput[]
    NOT?: FamilyTreeWhereInput | FamilyTreeWhereInput[]
    id?: IntFilter<"FamilyTree"> | number
    authId?: IntFilter<"FamilyTree"> | number
    data?: JsonNullableFilter<"FamilyTree">
    status?: StringFilter<"FamilyTree"> | string
    lastBuildStartedAt?: DateTimeNullableFilter<"FamilyTree"> | Date | string | null
    createdAt?: DateTimeFilter<"FamilyTree"> | Date | string
    updatedAt?: DateTimeFilter<"FamilyTree"> | Date | string
    auth?: XOR<AuthScalarRelationFilter, AuthWhereInput>
  }

  export type FamilyTreeOrderByWithRelationInput = {
    id?: SortOrder
    authId?: SortOrder
    data?: SortOrderInput | SortOrder
    status?: SortOrder
    lastBuildStartedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    auth?: AuthOrderByWithRelationInput
  }

  export type FamilyTreeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    authId?: number
    AND?: FamilyTreeWhereInput | FamilyTreeWhereInput[]
    OR?: FamilyTreeWhereInput[]
    NOT?: FamilyTreeWhereInput | FamilyTreeWhereInput[]
    data?: JsonNullableFilter<"FamilyTree">
    status?: StringFilter<"FamilyTree"> | string
    lastBuildStartedAt?: DateTimeNullableFilter<"FamilyTree"> | Date | string | null
    createdAt?: DateTimeFilter<"FamilyTree"> | Date | string
    updatedAt?: DateTimeFilter<"FamilyTree"> | Date | string
    auth?: XOR<AuthScalarRelationFilter, AuthWhereInput>
  }, "id" | "authId">

  export type FamilyTreeOrderByWithAggregationInput = {
    id?: SortOrder
    authId?: SortOrder
    data?: SortOrderInput | SortOrder
    status?: SortOrder
    lastBuildStartedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FamilyTreeCountOrderByAggregateInput
    _avg?: FamilyTreeAvgOrderByAggregateInput
    _max?: FamilyTreeMaxOrderByAggregateInput
    _min?: FamilyTreeMinOrderByAggregateInput
    _sum?: FamilyTreeSumOrderByAggregateInput
  }

  export type FamilyTreeScalarWhereWithAggregatesInput = {
    AND?: FamilyTreeScalarWhereWithAggregatesInput | FamilyTreeScalarWhereWithAggregatesInput[]
    OR?: FamilyTreeScalarWhereWithAggregatesInput[]
    NOT?: FamilyTreeScalarWhereWithAggregatesInput | FamilyTreeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FamilyTree"> | number
    authId?: IntWithAggregatesFilter<"FamilyTree"> | number
    data?: JsonNullableWithAggregatesFilter<"FamilyTree">
    status?: StringWithAggregatesFilter<"FamilyTree"> | string
    lastBuildStartedAt?: DateTimeNullableWithAggregatesFilter<"FamilyTree"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FamilyTree"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FamilyTree"> | Date | string
  }

  export type AuthCreateInput = {
    mainMemberId?: number | null
    moderatorPassword: string
    password: string
    memberAuthId?: string | null
    moderatorAuthId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    moderatorList?: ModeratorListCreateNestedManyWithoutModeratorInput
    familyTree?: FamilyTreeCreateNestedOneWithoutAuthInput
    members?: MemberCreateNestedManyWithoutAuthInput
  }

  export type AuthUncheckedCreateInput = {
    id?: number
    mainMemberId?: number | null
    moderatorPassword: string
    password: string
    memberAuthId?: string | null
    moderatorAuthId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    moderatorList?: ModeratorListUncheckedCreateNestedManyWithoutModeratorInput
    familyTree?: FamilyTreeUncheckedCreateNestedOneWithoutAuthInput
    members?: MemberUncheckedCreateNestedManyWithoutAuthInput
  }

  export type AuthUpdateInput = {
    mainMemberId?: NullableIntFieldUpdateOperationsInput | number | null
    moderatorPassword?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    memberAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    moderatorList?: ModeratorListUpdateManyWithoutModeratorNestedInput
    familyTree?: FamilyTreeUpdateOneWithoutAuthNestedInput
    members?: MemberUpdateManyWithoutAuthNestedInput
  }

  export type AuthUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    mainMemberId?: NullableIntFieldUpdateOperationsInput | number | null
    moderatorPassword?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    memberAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    moderatorList?: ModeratorListUncheckedUpdateManyWithoutModeratorNestedInput
    familyTree?: FamilyTreeUncheckedUpdateOneWithoutAuthNestedInput
    members?: MemberUncheckedUpdateManyWithoutAuthNestedInput
  }

  export type AuthCreateManyInput = {
    id?: number
    mainMemberId?: number | null
    moderatorPassword: string
    password: string
    memberAuthId?: string | null
    moderatorAuthId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthUpdateManyMutationInput = {
    mainMemberId?: NullableIntFieldUpdateOperationsInput | number | null
    moderatorPassword?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    memberAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    mainMemberId?: NullableIntFieldUpdateOperationsInput | number | null
    moderatorPassword?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    memberAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberCreateInput = {
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationCreateNestedManyWithoutMemberInput
    father?: MemberCreateNestedOneWithoutFatherOfInput
    mother?: MemberCreateNestedOneWithoutMotherOfInput
    partner?: MemberCreateNestedOneWithoutPartnerOfInput
    partnerOf?: MemberCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberCreateNestedManyWithoutFatherInput
    motherOf?: MemberCreateNestedManyWithoutMotherInput
    auth: AuthCreateNestedOneWithoutMembersInput
  }

  export type MemberUncheckedCreateInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsUncheckedCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationUncheckedCreateNestedManyWithoutMemberInput
    partnerOf?: MemberUncheckedCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberUncheckedCreateNestedManyWithoutFatherInput
    motherOf?: MemberUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MemberUpdateInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUpdateManyWithoutMemberNestedInput
    father?: MemberUpdateOneWithoutFatherOfNestedInput
    mother?: MemberUpdateOneWithoutMotherOfNestedInput
    partner?: MemberUpdateOneWithoutPartnerOfNestedInput
    partnerOf?: MemberUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUpdateManyWithoutMotherNestedInput
    auth?: AuthUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUncheckedUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUncheckedUpdateManyWithoutMemberNestedInput
    partnerOf?: MemberUncheckedUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUncheckedUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type MemberCreateManyInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberUpdateManyMutationInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestDetailsCreateInput = {
    authId: number
    type: string
    details: string
    createdAt?: Date | string
    updatedAt?: Date | string
    member: MemberCreateNestedOneWithoutPendingVerificationInput
  }

  export type RequestDetailsUncheckedCreateInput = {
    id?: number
    authId: number
    type: string
    details: string
    memberId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequestDetailsUpdateInput = {
    authId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    member?: MemberUpdateOneRequiredWithoutPendingVerificationNestedInput
  }

  export type RequestDetailsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    memberId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestDetailsCreateManyInput = {
    id?: number
    authId: number
    type: string
    details: string
    memberId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequestDetailsUpdateManyMutationInput = {
    authId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestDetailsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    memberId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type nonDescendantRelationCreateInput = {
    fatherName?: string | null
    motherName?: string | null
    siblingNames?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    member: MemberCreateNestedOneWithoutNonDescendantRelationInput
  }

  export type nonDescendantRelationUncheckedCreateInput = {
    id?: number
    memberId: number
    fatherName?: string | null
    motherName?: string | null
    siblingNames?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type nonDescendantRelationUpdateInput = {
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    motherName?: NullableStringFieldUpdateOperationsInput | string | null
    siblingNames?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    member?: MemberUpdateOneRequiredWithoutNonDescendantRelationNestedInput
  }

  export type nonDescendantRelationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    memberId?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    motherName?: NullableStringFieldUpdateOperationsInput | string | null
    siblingNames?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type nonDescendantRelationCreateManyInput = {
    id?: number
    memberId: number
    fatherName?: string | null
    motherName?: string | null
    siblingNames?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type nonDescendantRelationUpdateManyMutationInput = {
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    motherName?: NullableStringFieldUpdateOperationsInput | string | null
    siblingNames?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type nonDescendantRelationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    memberId?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    motherName?: NullableStringFieldUpdateOperationsInput | string | null
    siblingNames?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModeratorListCreateInput = {
    moderatorName: string
    moderatorContact: string
    createdAt?: Date | string
    updatedAt?: Date | string
    moderator: AuthCreateNestedOneWithoutModeratorListInput
  }

  export type ModeratorListUncheckedCreateInput = {
    id?: number
    moderatorName: string
    moderatorContact: string
    authId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModeratorListUpdateInput = {
    moderatorName?: StringFieldUpdateOperationsInput | string
    moderatorContact?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    moderator?: AuthUpdateOneRequiredWithoutModeratorListNestedInput
  }

  export type ModeratorListUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    moderatorName?: StringFieldUpdateOperationsInput | string
    moderatorContact?: StringFieldUpdateOperationsInput | string
    authId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModeratorListCreateManyInput = {
    id?: number
    moderatorName: string
    moderatorContact: string
    authId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModeratorListUpdateManyMutationInput = {
    moderatorName?: StringFieldUpdateOperationsInput | string
    moderatorContact?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModeratorListUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    moderatorName?: StringFieldUpdateOperationsInput | string
    moderatorContact?: StringFieldUpdateOperationsInput | string
    authId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FamilyTreeCreateInput = {
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    lastBuildStartedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auth: AuthCreateNestedOneWithoutFamilyTreeInput
  }

  export type FamilyTreeUncheckedCreateInput = {
    id?: number
    authId: number
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    lastBuildStartedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FamilyTreeUpdateInput = {
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastBuildStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auth?: AuthUpdateOneRequiredWithoutFamilyTreeNestedInput
  }

  export type FamilyTreeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastBuildStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FamilyTreeCreateManyInput = {
    id?: number
    authId: number
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    lastBuildStartedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FamilyTreeUpdateManyMutationInput = {
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastBuildStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FamilyTreeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastBuildStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ModeratorListListRelationFilter = {
    every?: ModeratorListWhereInput
    some?: ModeratorListWhereInput
    none?: ModeratorListWhereInput
  }

  export type FamilyTreeNullableScalarRelationFilter = {
    is?: FamilyTreeWhereInput | null
    isNot?: FamilyTreeWhereInput | null
  }

  export type MemberListRelationFilter = {
    every?: MemberWhereInput
    some?: MemberWhereInput
    none?: MemberWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ModeratorListOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthCountOrderByAggregateInput = {
    id?: SortOrder
    mainMemberId?: SortOrder
    moderatorPassword?: SortOrder
    password?: SortOrder
    memberAuthId?: SortOrder
    moderatorAuthId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthAvgOrderByAggregateInput = {
    id?: SortOrder
    mainMemberId?: SortOrder
  }

  export type AuthMaxOrderByAggregateInput = {
    id?: SortOrder
    mainMemberId?: SortOrder
    moderatorPassword?: SortOrder
    password?: SortOrder
    memberAuthId?: SortOrder
    moderatorAuthId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthMinOrderByAggregateInput = {
    id?: SortOrder
    mainMemberId?: SortOrder
    moderatorPassword?: SortOrder
    password?: SortOrder
    memberAuthId?: SortOrder
    moderatorAuthId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthSumOrderByAggregateInput = {
    id?: SortOrder
    mainMemberId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type RequestDetailsListRelationFilter = {
    every?: RequestDetailsWhereInput
    some?: RequestDetailsWhereInput
    none?: RequestDetailsWhereInput
  }

  export type NonDescendantRelationListRelationFilter = {
    every?: nonDescendantRelationWhereInput
    some?: nonDescendantRelationWhereInput
    none?: nonDescendantRelationWhereInput
  }

  export type MemberNullableScalarRelationFilter = {
    is?: MemberWhereInput | null
    isNot?: MemberWhereInput | null
  }

  export type AuthScalarRelationFilter = {
    is?: AuthWhereInput
    isNot?: AuthWhereInput
  }

  export type RequestDetailsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type nonDescendantRelationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MemberCountOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    verified?: SortOrder
    name?: SortOrder
    birthDate?: SortOrder
    birthMonth?: SortOrder
    birthYear?: SortOrder
    deceased?: SortOrder
    deathDate?: SortOrder
    deathMonth?: SortOrder
    deathYear?: SortOrder
    gender?: SortOrder
    phoneNumber?: SortOrder
    birthPlace?: SortOrder
    currentAddress?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    occupation?: SortOrder
    education?: SortOrder
    additionalInfo?: SortOrder
    descendant?: SortOrder
    order?: SortOrder
    fatherId?: SortOrder
    motherId?: SortOrder
    partnerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MemberAvgOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    birthDate?: SortOrder
    birthMonth?: SortOrder
    birthYear?: SortOrder
    deathDate?: SortOrder
    deathMonth?: SortOrder
    deathYear?: SortOrder
    order?: SortOrder
    fatherId?: SortOrder
    motherId?: SortOrder
    partnerId?: SortOrder
  }

  export type MemberMaxOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    verified?: SortOrder
    name?: SortOrder
    birthDate?: SortOrder
    birthMonth?: SortOrder
    birthYear?: SortOrder
    deceased?: SortOrder
    deathDate?: SortOrder
    deathMonth?: SortOrder
    deathYear?: SortOrder
    gender?: SortOrder
    phoneNumber?: SortOrder
    birthPlace?: SortOrder
    currentAddress?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    occupation?: SortOrder
    education?: SortOrder
    additionalInfo?: SortOrder
    descendant?: SortOrder
    order?: SortOrder
    fatherId?: SortOrder
    motherId?: SortOrder
    partnerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MemberMinOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    verified?: SortOrder
    name?: SortOrder
    birthDate?: SortOrder
    birthMonth?: SortOrder
    birthYear?: SortOrder
    deceased?: SortOrder
    deathDate?: SortOrder
    deathMonth?: SortOrder
    deathYear?: SortOrder
    gender?: SortOrder
    phoneNumber?: SortOrder
    birthPlace?: SortOrder
    currentAddress?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    occupation?: SortOrder
    education?: SortOrder
    additionalInfo?: SortOrder
    descendant?: SortOrder
    order?: SortOrder
    fatherId?: SortOrder
    motherId?: SortOrder
    partnerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MemberSumOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    birthDate?: SortOrder
    birthMonth?: SortOrder
    birthYear?: SortOrder
    deathDate?: SortOrder
    deathMonth?: SortOrder
    deathYear?: SortOrder
    order?: SortOrder
    fatherId?: SortOrder
    motherId?: SortOrder
    partnerId?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type MemberScalarRelationFilter = {
    is?: MemberWhereInput
    isNot?: MemberWhereInput
  }

  export type RequestDetailsCountOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    type?: SortOrder
    details?: SortOrder
    memberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RequestDetailsAvgOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    memberId?: SortOrder
  }

  export type RequestDetailsMaxOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    type?: SortOrder
    details?: SortOrder
    memberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RequestDetailsMinOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    type?: SortOrder
    details?: SortOrder
    memberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RequestDetailsSumOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    memberId?: SortOrder
  }

  export type nonDescendantRelationCountOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
    fatherName?: SortOrder
    motherName?: SortOrder
    siblingNames?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type nonDescendantRelationAvgOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
  }

  export type nonDescendantRelationMaxOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
    fatherName?: SortOrder
    motherName?: SortOrder
    siblingNames?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type nonDescendantRelationMinOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
    fatherName?: SortOrder
    motherName?: SortOrder
    siblingNames?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type nonDescendantRelationSumOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
  }

  export type ModeratorListCountOrderByAggregateInput = {
    id?: SortOrder
    moderatorName?: SortOrder
    moderatorContact?: SortOrder
    authId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ModeratorListAvgOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
  }

  export type ModeratorListMaxOrderByAggregateInput = {
    id?: SortOrder
    moderatorName?: SortOrder
    moderatorContact?: SortOrder
    authId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ModeratorListMinOrderByAggregateInput = {
    id?: SortOrder
    moderatorName?: SortOrder
    moderatorContact?: SortOrder
    authId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ModeratorListSumOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FamilyTreeCountOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    data?: SortOrder
    status?: SortOrder
    lastBuildStartedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FamilyTreeAvgOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
  }

  export type FamilyTreeMaxOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    status?: SortOrder
    lastBuildStartedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FamilyTreeMinOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
    status?: SortOrder
    lastBuildStartedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FamilyTreeSumOrderByAggregateInput = {
    id?: SortOrder
    authId?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ModeratorListCreateNestedManyWithoutModeratorInput = {
    create?: XOR<ModeratorListCreateWithoutModeratorInput, ModeratorListUncheckedCreateWithoutModeratorInput> | ModeratorListCreateWithoutModeratorInput[] | ModeratorListUncheckedCreateWithoutModeratorInput[]
    connectOrCreate?: ModeratorListCreateOrConnectWithoutModeratorInput | ModeratorListCreateOrConnectWithoutModeratorInput[]
    createMany?: ModeratorListCreateManyModeratorInputEnvelope
    connect?: ModeratorListWhereUniqueInput | ModeratorListWhereUniqueInput[]
  }

  export type FamilyTreeCreateNestedOneWithoutAuthInput = {
    create?: XOR<FamilyTreeCreateWithoutAuthInput, FamilyTreeUncheckedCreateWithoutAuthInput>
    connectOrCreate?: FamilyTreeCreateOrConnectWithoutAuthInput
    connect?: FamilyTreeWhereUniqueInput
  }

  export type MemberCreateNestedManyWithoutAuthInput = {
    create?: XOR<MemberCreateWithoutAuthInput, MemberUncheckedCreateWithoutAuthInput> | MemberCreateWithoutAuthInput[] | MemberUncheckedCreateWithoutAuthInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutAuthInput | MemberCreateOrConnectWithoutAuthInput[]
    createMany?: MemberCreateManyAuthInputEnvelope
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
  }

  export type ModeratorListUncheckedCreateNestedManyWithoutModeratorInput = {
    create?: XOR<ModeratorListCreateWithoutModeratorInput, ModeratorListUncheckedCreateWithoutModeratorInput> | ModeratorListCreateWithoutModeratorInput[] | ModeratorListUncheckedCreateWithoutModeratorInput[]
    connectOrCreate?: ModeratorListCreateOrConnectWithoutModeratorInput | ModeratorListCreateOrConnectWithoutModeratorInput[]
    createMany?: ModeratorListCreateManyModeratorInputEnvelope
    connect?: ModeratorListWhereUniqueInput | ModeratorListWhereUniqueInput[]
  }

  export type FamilyTreeUncheckedCreateNestedOneWithoutAuthInput = {
    create?: XOR<FamilyTreeCreateWithoutAuthInput, FamilyTreeUncheckedCreateWithoutAuthInput>
    connectOrCreate?: FamilyTreeCreateOrConnectWithoutAuthInput
    connect?: FamilyTreeWhereUniqueInput
  }

  export type MemberUncheckedCreateNestedManyWithoutAuthInput = {
    create?: XOR<MemberCreateWithoutAuthInput, MemberUncheckedCreateWithoutAuthInput> | MemberCreateWithoutAuthInput[] | MemberUncheckedCreateWithoutAuthInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutAuthInput | MemberCreateOrConnectWithoutAuthInput[]
    createMany?: MemberCreateManyAuthInputEnvelope
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ModeratorListUpdateManyWithoutModeratorNestedInput = {
    create?: XOR<ModeratorListCreateWithoutModeratorInput, ModeratorListUncheckedCreateWithoutModeratorInput> | ModeratorListCreateWithoutModeratorInput[] | ModeratorListUncheckedCreateWithoutModeratorInput[]
    connectOrCreate?: ModeratorListCreateOrConnectWithoutModeratorInput | ModeratorListCreateOrConnectWithoutModeratorInput[]
    upsert?: ModeratorListUpsertWithWhereUniqueWithoutModeratorInput | ModeratorListUpsertWithWhereUniqueWithoutModeratorInput[]
    createMany?: ModeratorListCreateManyModeratorInputEnvelope
    set?: ModeratorListWhereUniqueInput | ModeratorListWhereUniqueInput[]
    disconnect?: ModeratorListWhereUniqueInput | ModeratorListWhereUniqueInput[]
    delete?: ModeratorListWhereUniqueInput | ModeratorListWhereUniqueInput[]
    connect?: ModeratorListWhereUniqueInput | ModeratorListWhereUniqueInput[]
    update?: ModeratorListUpdateWithWhereUniqueWithoutModeratorInput | ModeratorListUpdateWithWhereUniqueWithoutModeratorInput[]
    updateMany?: ModeratorListUpdateManyWithWhereWithoutModeratorInput | ModeratorListUpdateManyWithWhereWithoutModeratorInput[]
    deleteMany?: ModeratorListScalarWhereInput | ModeratorListScalarWhereInput[]
  }

  export type FamilyTreeUpdateOneWithoutAuthNestedInput = {
    create?: XOR<FamilyTreeCreateWithoutAuthInput, FamilyTreeUncheckedCreateWithoutAuthInput>
    connectOrCreate?: FamilyTreeCreateOrConnectWithoutAuthInput
    upsert?: FamilyTreeUpsertWithoutAuthInput
    disconnect?: FamilyTreeWhereInput | boolean
    delete?: FamilyTreeWhereInput | boolean
    connect?: FamilyTreeWhereUniqueInput
    update?: XOR<XOR<FamilyTreeUpdateToOneWithWhereWithoutAuthInput, FamilyTreeUpdateWithoutAuthInput>, FamilyTreeUncheckedUpdateWithoutAuthInput>
  }

  export type MemberUpdateManyWithoutAuthNestedInput = {
    create?: XOR<MemberCreateWithoutAuthInput, MemberUncheckedCreateWithoutAuthInput> | MemberCreateWithoutAuthInput[] | MemberUncheckedCreateWithoutAuthInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutAuthInput | MemberCreateOrConnectWithoutAuthInput[]
    upsert?: MemberUpsertWithWhereUniqueWithoutAuthInput | MemberUpsertWithWhereUniqueWithoutAuthInput[]
    createMany?: MemberCreateManyAuthInputEnvelope
    set?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    disconnect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    delete?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    update?: MemberUpdateWithWhereUniqueWithoutAuthInput | MemberUpdateWithWhereUniqueWithoutAuthInput[]
    updateMany?: MemberUpdateManyWithWhereWithoutAuthInput | MemberUpdateManyWithWhereWithoutAuthInput[]
    deleteMany?: MemberScalarWhereInput | MemberScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ModeratorListUncheckedUpdateManyWithoutModeratorNestedInput = {
    create?: XOR<ModeratorListCreateWithoutModeratorInput, ModeratorListUncheckedCreateWithoutModeratorInput> | ModeratorListCreateWithoutModeratorInput[] | ModeratorListUncheckedCreateWithoutModeratorInput[]
    connectOrCreate?: ModeratorListCreateOrConnectWithoutModeratorInput | ModeratorListCreateOrConnectWithoutModeratorInput[]
    upsert?: ModeratorListUpsertWithWhereUniqueWithoutModeratorInput | ModeratorListUpsertWithWhereUniqueWithoutModeratorInput[]
    createMany?: ModeratorListCreateManyModeratorInputEnvelope
    set?: ModeratorListWhereUniqueInput | ModeratorListWhereUniqueInput[]
    disconnect?: ModeratorListWhereUniqueInput | ModeratorListWhereUniqueInput[]
    delete?: ModeratorListWhereUniqueInput | ModeratorListWhereUniqueInput[]
    connect?: ModeratorListWhereUniqueInput | ModeratorListWhereUniqueInput[]
    update?: ModeratorListUpdateWithWhereUniqueWithoutModeratorInput | ModeratorListUpdateWithWhereUniqueWithoutModeratorInput[]
    updateMany?: ModeratorListUpdateManyWithWhereWithoutModeratorInput | ModeratorListUpdateManyWithWhereWithoutModeratorInput[]
    deleteMany?: ModeratorListScalarWhereInput | ModeratorListScalarWhereInput[]
  }

  export type FamilyTreeUncheckedUpdateOneWithoutAuthNestedInput = {
    create?: XOR<FamilyTreeCreateWithoutAuthInput, FamilyTreeUncheckedCreateWithoutAuthInput>
    connectOrCreate?: FamilyTreeCreateOrConnectWithoutAuthInput
    upsert?: FamilyTreeUpsertWithoutAuthInput
    disconnect?: FamilyTreeWhereInput | boolean
    delete?: FamilyTreeWhereInput | boolean
    connect?: FamilyTreeWhereUniqueInput
    update?: XOR<XOR<FamilyTreeUpdateToOneWithWhereWithoutAuthInput, FamilyTreeUpdateWithoutAuthInput>, FamilyTreeUncheckedUpdateWithoutAuthInput>
  }

  export type MemberUncheckedUpdateManyWithoutAuthNestedInput = {
    create?: XOR<MemberCreateWithoutAuthInput, MemberUncheckedCreateWithoutAuthInput> | MemberCreateWithoutAuthInput[] | MemberUncheckedCreateWithoutAuthInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutAuthInput | MemberCreateOrConnectWithoutAuthInput[]
    upsert?: MemberUpsertWithWhereUniqueWithoutAuthInput | MemberUpsertWithWhereUniqueWithoutAuthInput[]
    createMany?: MemberCreateManyAuthInputEnvelope
    set?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    disconnect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    delete?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    update?: MemberUpdateWithWhereUniqueWithoutAuthInput | MemberUpdateWithWhereUniqueWithoutAuthInput[]
    updateMany?: MemberUpdateManyWithWhereWithoutAuthInput | MemberUpdateManyWithWhereWithoutAuthInput[]
    deleteMany?: MemberScalarWhereInput | MemberScalarWhereInput[]
  }

  export type RequestDetailsCreateNestedManyWithoutMemberInput = {
    create?: XOR<RequestDetailsCreateWithoutMemberInput, RequestDetailsUncheckedCreateWithoutMemberInput> | RequestDetailsCreateWithoutMemberInput[] | RequestDetailsUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: RequestDetailsCreateOrConnectWithoutMemberInput | RequestDetailsCreateOrConnectWithoutMemberInput[]
    createMany?: RequestDetailsCreateManyMemberInputEnvelope
    connect?: RequestDetailsWhereUniqueInput | RequestDetailsWhereUniqueInput[]
  }

  export type nonDescendantRelationCreateNestedManyWithoutMemberInput = {
    create?: XOR<nonDescendantRelationCreateWithoutMemberInput, nonDescendantRelationUncheckedCreateWithoutMemberInput> | nonDescendantRelationCreateWithoutMemberInput[] | nonDescendantRelationUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: nonDescendantRelationCreateOrConnectWithoutMemberInput | nonDescendantRelationCreateOrConnectWithoutMemberInput[]
    createMany?: nonDescendantRelationCreateManyMemberInputEnvelope
    connect?: nonDescendantRelationWhereUniqueInput | nonDescendantRelationWhereUniqueInput[]
  }

  export type MemberCreateNestedOneWithoutFatherOfInput = {
    create?: XOR<MemberCreateWithoutFatherOfInput, MemberUncheckedCreateWithoutFatherOfInput>
    connectOrCreate?: MemberCreateOrConnectWithoutFatherOfInput
    connect?: MemberWhereUniqueInput
  }

  export type MemberCreateNestedOneWithoutMotherOfInput = {
    create?: XOR<MemberCreateWithoutMotherOfInput, MemberUncheckedCreateWithoutMotherOfInput>
    connectOrCreate?: MemberCreateOrConnectWithoutMotherOfInput
    connect?: MemberWhereUniqueInput
  }

  export type MemberCreateNestedOneWithoutPartnerOfInput = {
    create?: XOR<MemberCreateWithoutPartnerOfInput, MemberUncheckedCreateWithoutPartnerOfInput>
    connectOrCreate?: MemberCreateOrConnectWithoutPartnerOfInput
    connect?: MemberWhereUniqueInput
  }

  export type MemberCreateNestedManyWithoutPartnerInput = {
    create?: XOR<MemberCreateWithoutPartnerInput, MemberUncheckedCreateWithoutPartnerInput> | MemberCreateWithoutPartnerInput[] | MemberUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutPartnerInput | MemberCreateOrConnectWithoutPartnerInput[]
    createMany?: MemberCreateManyPartnerInputEnvelope
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
  }

  export type MemberCreateNestedManyWithoutFatherInput = {
    create?: XOR<MemberCreateWithoutFatherInput, MemberUncheckedCreateWithoutFatherInput> | MemberCreateWithoutFatherInput[] | MemberUncheckedCreateWithoutFatherInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutFatherInput | MemberCreateOrConnectWithoutFatherInput[]
    createMany?: MemberCreateManyFatherInputEnvelope
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
  }

  export type MemberCreateNestedManyWithoutMotherInput = {
    create?: XOR<MemberCreateWithoutMotherInput, MemberUncheckedCreateWithoutMotherInput> | MemberCreateWithoutMotherInput[] | MemberUncheckedCreateWithoutMotherInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutMotherInput | MemberCreateOrConnectWithoutMotherInput[]
    createMany?: MemberCreateManyMotherInputEnvelope
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
  }

  export type AuthCreateNestedOneWithoutMembersInput = {
    create?: XOR<AuthCreateWithoutMembersInput, AuthUncheckedCreateWithoutMembersInput>
    connectOrCreate?: AuthCreateOrConnectWithoutMembersInput
    connect?: AuthWhereUniqueInput
  }

  export type RequestDetailsUncheckedCreateNestedManyWithoutMemberInput = {
    create?: XOR<RequestDetailsCreateWithoutMemberInput, RequestDetailsUncheckedCreateWithoutMemberInput> | RequestDetailsCreateWithoutMemberInput[] | RequestDetailsUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: RequestDetailsCreateOrConnectWithoutMemberInput | RequestDetailsCreateOrConnectWithoutMemberInput[]
    createMany?: RequestDetailsCreateManyMemberInputEnvelope
    connect?: RequestDetailsWhereUniqueInput | RequestDetailsWhereUniqueInput[]
  }

  export type nonDescendantRelationUncheckedCreateNestedManyWithoutMemberInput = {
    create?: XOR<nonDescendantRelationCreateWithoutMemberInput, nonDescendantRelationUncheckedCreateWithoutMemberInput> | nonDescendantRelationCreateWithoutMemberInput[] | nonDescendantRelationUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: nonDescendantRelationCreateOrConnectWithoutMemberInput | nonDescendantRelationCreateOrConnectWithoutMemberInput[]
    createMany?: nonDescendantRelationCreateManyMemberInputEnvelope
    connect?: nonDescendantRelationWhereUniqueInput | nonDescendantRelationWhereUniqueInput[]
  }

  export type MemberUncheckedCreateNestedManyWithoutPartnerInput = {
    create?: XOR<MemberCreateWithoutPartnerInput, MemberUncheckedCreateWithoutPartnerInput> | MemberCreateWithoutPartnerInput[] | MemberUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutPartnerInput | MemberCreateOrConnectWithoutPartnerInput[]
    createMany?: MemberCreateManyPartnerInputEnvelope
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
  }

  export type MemberUncheckedCreateNestedManyWithoutFatherInput = {
    create?: XOR<MemberCreateWithoutFatherInput, MemberUncheckedCreateWithoutFatherInput> | MemberCreateWithoutFatherInput[] | MemberUncheckedCreateWithoutFatherInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutFatherInput | MemberCreateOrConnectWithoutFatherInput[]
    createMany?: MemberCreateManyFatherInputEnvelope
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
  }

  export type MemberUncheckedCreateNestedManyWithoutMotherInput = {
    create?: XOR<MemberCreateWithoutMotherInput, MemberUncheckedCreateWithoutMotherInput> | MemberCreateWithoutMotherInput[] | MemberUncheckedCreateWithoutMotherInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutMotherInput | MemberCreateOrConnectWithoutMotherInput[]
    createMany?: MemberCreateManyMotherInputEnvelope
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type RequestDetailsUpdateManyWithoutMemberNestedInput = {
    create?: XOR<RequestDetailsCreateWithoutMemberInput, RequestDetailsUncheckedCreateWithoutMemberInput> | RequestDetailsCreateWithoutMemberInput[] | RequestDetailsUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: RequestDetailsCreateOrConnectWithoutMemberInput | RequestDetailsCreateOrConnectWithoutMemberInput[]
    upsert?: RequestDetailsUpsertWithWhereUniqueWithoutMemberInput | RequestDetailsUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: RequestDetailsCreateManyMemberInputEnvelope
    set?: RequestDetailsWhereUniqueInput | RequestDetailsWhereUniqueInput[]
    disconnect?: RequestDetailsWhereUniqueInput | RequestDetailsWhereUniqueInput[]
    delete?: RequestDetailsWhereUniqueInput | RequestDetailsWhereUniqueInput[]
    connect?: RequestDetailsWhereUniqueInput | RequestDetailsWhereUniqueInput[]
    update?: RequestDetailsUpdateWithWhereUniqueWithoutMemberInput | RequestDetailsUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: RequestDetailsUpdateManyWithWhereWithoutMemberInput | RequestDetailsUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: RequestDetailsScalarWhereInput | RequestDetailsScalarWhereInput[]
  }

  export type nonDescendantRelationUpdateManyWithoutMemberNestedInput = {
    create?: XOR<nonDescendantRelationCreateWithoutMemberInput, nonDescendantRelationUncheckedCreateWithoutMemberInput> | nonDescendantRelationCreateWithoutMemberInput[] | nonDescendantRelationUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: nonDescendantRelationCreateOrConnectWithoutMemberInput | nonDescendantRelationCreateOrConnectWithoutMemberInput[]
    upsert?: nonDescendantRelationUpsertWithWhereUniqueWithoutMemberInput | nonDescendantRelationUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: nonDescendantRelationCreateManyMemberInputEnvelope
    set?: nonDescendantRelationWhereUniqueInput | nonDescendantRelationWhereUniqueInput[]
    disconnect?: nonDescendantRelationWhereUniqueInput | nonDescendantRelationWhereUniqueInput[]
    delete?: nonDescendantRelationWhereUniqueInput | nonDescendantRelationWhereUniqueInput[]
    connect?: nonDescendantRelationWhereUniqueInput | nonDescendantRelationWhereUniqueInput[]
    update?: nonDescendantRelationUpdateWithWhereUniqueWithoutMemberInput | nonDescendantRelationUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: nonDescendantRelationUpdateManyWithWhereWithoutMemberInput | nonDescendantRelationUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: nonDescendantRelationScalarWhereInput | nonDescendantRelationScalarWhereInput[]
  }

  export type MemberUpdateOneWithoutFatherOfNestedInput = {
    create?: XOR<MemberCreateWithoutFatherOfInput, MemberUncheckedCreateWithoutFatherOfInput>
    connectOrCreate?: MemberCreateOrConnectWithoutFatherOfInput
    upsert?: MemberUpsertWithoutFatherOfInput
    disconnect?: MemberWhereInput | boolean
    delete?: MemberWhereInput | boolean
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutFatherOfInput, MemberUpdateWithoutFatherOfInput>, MemberUncheckedUpdateWithoutFatherOfInput>
  }

  export type MemberUpdateOneWithoutMotherOfNestedInput = {
    create?: XOR<MemberCreateWithoutMotherOfInput, MemberUncheckedCreateWithoutMotherOfInput>
    connectOrCreate?: MemberCreateOrConnectWithoutMotherOfInput
    upsert?: MemberUpsertWithoutMotherOfInput
    disconnect?: MemberWhereInput | boolean
    delete?: MemberWhereInput | boolean
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutMotherOfInput, MemberUpdateWithoutMotherOfInput>, MemberUncheckedUpdateWithoutMotherOfInput>
  }

  export type MemberUpdateOneWithoutPartnerOfNestedInput = {
    create?: XOR<MemberCreateWithoutPartnerOfInput, MemberUncheckedCreateWithoutPartnerOfInput>
    connectOrCreate?: MemberCreateOrConnectWithoutPartnerOfInput
    upsert?: MemberUpsertWithoutPartnerOfInput
    disconnect?: MemberWhereInput | boolean
    delete?: MemberWhereInput | boolean
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutPartnerOfInput, MemberUpdateWithoutPartnerOfInput>, MemberUncheckedUpdateWithoutPartnerOfInput>
  }

  export type MemberUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<MemberCreateWithoutPartnerInput, MemberUncheckedCreateWithoutPartnerInput> | MemberCreateWithoutPartnerInput[] | MemberUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutPartnerInput | MemberCreateOrConnectWithoutPartnerInput[]
    upsert?: MemberUpsertWithWhereUniqueWithoutPartnerInput | MemberUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: MemberCreateManyPartnerInputEnvelope
    set?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    disconnect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    delete?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    update?: MemberUpdateWithWhereUniqueWithoutPartnerInput | MemberUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: MemberUpdateManyWithWhereWithoutPartnerInput | MemberUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: MemberScalarWhereInput | MemberScalarWhereInput[]
  }

  export type MemberUpdateManyWithoutFatherNestedInput = {
    create?: XOR<MemberCreateWithoutFatherInput, MemberUncheckedCreateWithoutFatherInput> | MemberCreateWithoutFatherInput[] | MemberUncheckedCreateWithoutFatherInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutFatherInput | MemberCreateOrConnectWithoutFatherInput[]
    upsert?: MemberUpsertWithWhereUniqueWithoutFatherInput | MemberUpsertWithWhereUniqueWithoutFatherInput[]
    createMany?: MemberCreateManyFatherInputEnvelope
    set?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    disconnect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    delete?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    update?: MemberUpdateWithWhereUniqueWithoutFatherInput | MemberUpdateWithWhereUniqueWithoutFatherInput[]
    updateMany?: MemberUpdateManyWithWhereWithoutFatherInput | MemberUpdateManyWithWhereWithoutFatherInput[]
    deleteMany?: MemberScalarWhereInput | MemberScalarWhereInput[]
  }

  export type MemberUpdateManyWithoutMotherNestedInput = {
    create?: XOR<MemberCreateWithoutMotherInput, MemberUncheckedCreateWithoutMotherInput> | MemberCreateWithoutMotherInput[] | MemberUncheckedCreateWithoutMotherInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutMotherInput | MemberCreateOrConnectWithoutMotherInput[]
    upsert?: MemberUpsertWithWhereUniqueWithoutMotherInput | MemberUpsertWithWhereUniqueWithoutMotherInput[]
    createMany?: MemberCreateManyMotherInputEnvelope
    set?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    disconnect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    delete?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    update?: MemberUpdateWithWhereUniqueWithoutMotherInput | MemberUpdateWithWhereUniqueWithoutMotherInput[]
    updateMany?: MemberUpdateManyWithWhereWithoutMotherInput | MemberUpdateManyWithWhereWithoutMotherInput[]
    deleteMany?: MemberScalarWhereInput | MemberScalarWhereInput[]
  }

  export type AuthUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<AuthCreateWithoutMembersInput, AuthUncheckedCreateWithoutMembersInput>
    connectOrCreate?: AuthCreateOrConnectWithoutMembersInput
    upsert?: AuthUpsertWithoutMembersInput
    connect?: AuthWhereUniqueInput
    update?: XOR<XOR<AuthUpdateToOneWithWhereWithoutMembersInput, AuthUpdateWithoutMembersInput>, AuthUncheckedUpdateWithoutMembersInput>
  }

  export type RequestDetailsUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: XOR<RequestDetailsCreateWithoutMemberInput, RequestDetailsUncheckedCreateWithoutMemberInput> | RequestDetailsCreateWithoutMemberInput[] | RequestDetailsUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: RequestDetailsCreateOrConnectWithoutMemberInput | RequestDetailsCreateOrConnectWithoutMemberInput[]
    upsert?: RequestDetailsUpsertWithWhereUniqueWithoutMemberInput | RequestDetailsUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: RequestDetailsCreateManyMemberInputEnvelope
    set?: RequestDetailsWhereUniqueInput | RequestDetailsWhereUniqueInput[]
    disconnect?: RequestDetailsWhereUniqueInput | RequestDetailsWhereUniqueInput[]
    delete?: RequestDetailsWhereUniqueInput | RequestDetailsWhereUniqueInput[]
    connect?: RequestDetailsWhereUniqueInput | RequestDetailsWhereUniqueInput[]
    update?: RequestDetailsUpdateWithWhereUniqueWithoutMemberInput | RequestDetailsUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: RequestDetailsUpdateManyWithWhereWithoutMemberInput | RequestDetailsUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: RequestDetailsScalarWhereInput | RequestDetailsScalarWhereInput[]
  }

  export type nonDescendantRelationUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: XOR<nonDescendantRelationCreateWithoutMemberInput, nonDescendantRelationUncheckedCreateWithoutMemberInput> | nonDescendantRelationCreateWithoutMemberInput[] | nonDescendantRelationUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: nonDescendantRelationCreateOrConnectWithoutMemberInput | nonDescendantRelationCreateOrConnectWithoutMemberInput[]
    upsert?: nonDescendantRelationUpsertWithWhereUniqueWithoutMemberInput | nonDescendantRelationUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: nonDescendantRelationCreateManyMemberInputEnvelope
    set?: nonDescendantRelationWhereUniqueInput | nonDescendantRelationWhereUniqueInput[]
    disconnect?: nonDescendantRelationWhereUniqueInput | nonDescendantRelationWhereUniqueInput[]
    delete?: nonDescendantRelationWhereUniqueInput | nonDescendantRelationWhereUniqueInput[]
    connect?: nonDescendantRelationWhereUniqueInput | nonDescendantRelationWhereUniqueInput[]
    update?: nonDescendantRelationUpdateWithWhereUniqueWithoutMemberInput | nonDescendantRelationUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: nonDescendantRelationUpdateManyWithWhereWithoutMemberInput | nonDescendantRelationUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: nonDescendantRelationScalarWhereInput | nonDescendantRelationScalarWhereInput[]
  }

  export type MemberUncheckedUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<MemberCreateWithoutPartnerInput, MemberUncheckedCreateWithoutPartnerInput> | MemberCreateWithoutPartnerInput[] | MemberUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutPartnerInput | MemberCreateOrConnectWithoutPartnerInput[]
    upsert?: MemberUpsertWithWhereUniqueWithoutPartnerInput | MemberUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: MemberCreateManyPartnerInputEnvelope
    set?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    disconnect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    delete?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    update?: MemberUpdateWithWhereUniqueWithoutPartnerInput | MemberUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: MemberUpdateManyWithWhereWithoutPartnerInput | MemberUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: MemberScalarWhereInput | MemberScalarWhereInput[]
  }

  export type MemberUncheckedUpdateManyWithoutFatherNestedInput = {
    create?: XOR<MemberCreateWithoutFatherInput, MemberUncheckedCreateWithoutFatherInput> | MemberCreateWithoutFatherInput[] | MemberUncheckedCreateWithoutFatherInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutFatherInput | MemberCreateOrConnectWithoutFatherInput[]
    upsert?: MemberUpsertWithWhereUniqueWithoutFatherInput | MemberUpsertWithWhereUniqueWithoutFatherInput[]
    createMany?: MemberCreateManyFatherInputEnvelope
    set?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    disconnect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    delete?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    update?: MemberUpdateWithWhereUniqueWithoutFatherInput | MemberUpdateWithWhereUniqueWithoutFatherInput[]
    updateMany?: MemberUpdateManyWithWhereWithoutFatherInput | MemberUpdateManyWithWhereWithoutFatherInput[]
    deleteMany?: MemberScalarWhereInput | MemberScalarWhereInput[]
  }

  export type MemberUncheckedUpdateManyWithoutMotherNestedInput = {
    create?: XOR<MemberCreateWithoutMotherInput, MemberUncheckedCreateWithoutMotherInput> | MemberCreateWithoutMotherInput[] | MemberUncheckedCreateWithoutMotherInput[]
    connectOrCreate?: MemberCreateOrConnectWithoutMotherInput | MemberCreateOrConnectWithoutMotherInput[]
    upsert?: MemberUpsertWithWhereUniqueWithoutMotherInput | MemberUpsertWithWhereUniqueWithoutMotherInput[]
    createMany?: MemberCreateManyMotherInputEnvelope
    set?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    disconnect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    delete?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    connect?: MemberWhereUniqueInput | MemberWhereUniqueInput[]
    update?: MemberUpdateWithWhereUniqueWithoutMotherInput | MemberUpdateWithWhereUniqueWithoutMotherInput[]
    updateMany?: MemberUpdateManyWithWhereWithoutMotherInput | MemberUpdateManyWithWhereWithoutMotherInput[]
    deleteMany?: MemberScalarWhereInput | MemberScalarWhereInput[]
  }

  export type MemberCreateNestedOneWithoutPendingVerificationInput = {
    create?: XOR<MemberCreateWithoutPendingVerificationInput, MemberUncheckedCreateWithoutPendingVerificationInput>
    connectOrCreate?: MemberCreateOrConnectWithoutPendingVerificationInput
    connect?: MemberWhereUniqueInput
  }

  export type MemberUpdateOneRequiredWithoutPendingVerificationNestedInput = {
    create?: XOR<MemberCreateWithoutPendingVerificationInput, MemberUncheckedCreateWithoutPendingVerificationInput>
    connectOrCreate?: MemberCreateOrConnectWithoutPendingVerificationInput
    upsert?: MemberUpsertWithoutPendingVerificationInput
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutPendingVerificationInput, MemberUpdateWithoutPendingVerificationInput>, MemberUncheckedUpdateWithoutPendingVerificationInput>
  }

  export type MemberCreateNestedOneWithoutNonDescendantRelationInput = {
    create?: XOR<MemberCreateWithoutNonDescendantRelationInput, MemberUncheckedCreateWithoutNonDescendantRelationInput>
    connectOrCreate?: MemberCreateOrConnectWithoutNonDescendantRelationInput
    connect?: MemberWhereUniqueInput
  }

  export type MemberUpdateOneRequiredWithoutNonDescendantRelationNestedInput = {
    create?: XOR<MemberCreateWithoutNonDescendantRelationInput, MemberUncheckedCreateWithoutNonDescendantRelationInput>
    connectOrCreate?: MemberCreateOrConnectWithoutNonDescendantRelationInput
    upsert?: MemberUpsertWithoutNonDescendantRelationInput
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutNonDescendantRelationInput, MemberUpdateWithoutNonDescendantRelationInput>, MemberUncheckedUpdateWithoutNonDescendantRelationInput>
  }

  export type AuthCreateNestedOneWithoutModeratorListInput = {
    create?: XOR<AuthCreateWithoutModeratorListInput, AuthUncheckedCreateWithoutModeratorListInput>
    connectOrCreate?: AuthCreateOrConnectWithoutModeratorListInput
    connect?: AuthWhereUniqueInput
  }

  export type AuthUpdateOneRequiredWithoutModeratorListNestedInput = {
    create?: XOR<AuthCreateWithoutModeratorListInput, AuthUncheckedCreateWithoutModeratorListInput>
    connectOrCreate?: AuthCreateOrConnectWithoutModeratorListInput
    upsert?: AuthUpsertWithoutModeratorListInput
    connect?: AuthWhereUniqueInput
    update?: XOR<XOR<AuthUpdateToOneWithWhereWithoutModeratorListInput, AuthUpdateWithoutModeratorListInput>, AuthUncheckedUpdateWithoutModeratorListInput>
  }

  export type AuthCreateNestedOneWithoutFamilyTreeInput = {
    create?: XOR<AuthCreateWithoutFamilyTreeInput, AuthUncheckedCreateWithoutFamilyTreeInput>
    connectOrCreate?: AuthCreateOrConnectWithoutFamilyTreeInput
    connect?: AuthWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AuthUpdateOneRequiredWithoutFamilyTreeNestedInput = {
    create?: XOR<AuthCreateWithoutFamilyTreeInput, AuthUncheckedCreateWithoutFamilyTreeInput>
    connectOrCreate?: AuthCreateOrConnectWithoutFamilyTreeInput
    upsert?: AuthUpsertWithoutFamilyTreeInput
    connect?: AuthWhereUniqueInput
    update?: XOR<XOR<AuthUpdateToOneWithWhereWithoutFamilyTreeInput, AuthUpdateWithoutFamilyTreeInput>, AuthUncheckedUpdateWithoutFamilyTreeInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ModeratorListCreateWithoutModeratorInput = {
    moderatorName: string
    moderatorContact: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModeratorListUncheckedCreateWithoutModeratorInput = {
    id?: number
    moderatorName: string
    moderatorContact: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModeratorListCreateOrConnectWithoutModeratorInput = {
    where: ModeratorListWhereUniqueInput
    create: XOR<ModeratorListCreateWithoutModeratorInput, ModeratorListUncheckedCreateWithoutModeratorInput>
  }

  export type ModeratorListCreateManyModeratorInputEnvelope = {
    data: ModeratorListCreateManyModeratorInput | ModeratorListCreateManyModeratorInput[]
    skipDuplicates?: boolean
  }

  export type FamilyTreeCreateWithoutAuthInput = {
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    lastBuildStartedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FamilyTreeUncheckedCreateWithoutAuthInput = {
    id?: number
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    lastBuildStartedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FamilyTreeCreateOrConnectWithoutAuthInput = {
    where: FamilyTreeWhereUniqueInput
    create: XOR<FamilyTreeCreateWithoutAuthInput, FamilyTreeUncheckedCreateWithoutAuthInput>
  }

  export type MemberCreateWithoutAuthInput = {
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationCreateNestedManyWithoutMemberInput
    father?: MemberCreateNestedOneWithoutFatherOfInput
    mother?: MemberCreateNestedOneWithoutMotherOfInput
    partner?: MemberCreateNestedOneWithoutPartnerOfInput
    partnerOf?: MemberCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberCreateNestedManyWithoutFatherInput
    motherOf?: MemberCreateNestedManyWithoutMotherInput
  }

  export type MemberUncheckedCreateWithoutAuthInput = {
    id?: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsUncheckedCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationUncheckedCreateNestedManyWithoutMemberInput
    partnerOf?: MemberUncheckedCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberUncheckedCreateNestedManyWithoutFatherInput
    motherOf?: MemberUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MemberCreateOrConnectWithoutAuthInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutAuthInput, MemberUncheckedCreateWithoutAuthInput>
  }

  export type MemberCreateManyAuthInputEnvelope = {
    data: MemberCreateManyAuthInput | MemberCreateManyAuthInput[]
    skipDuplicates?: boolean
  }

  export type ModeratorListUpsertWithWhereUniqueWithoutModeratorInput = {
    where: ModeratorListWhereUniqueInput
    update: XOR<ModeratorListUpdateWithoutModeratorInput, ModeratorListUncheckedUpdateWithoutModeratorInput>
    create: XOR<ModeratorListCreateWithoutModeratorInput, ModeratorListUncheckedCreateWithoutModeratorInput>
  }

  export type ModeratorListUpdateWithWhereUniqueWithoutModeratorInput = {
    where: ModeratorListWhereUniqueInput
    data: XOR<ModeratorListUpdateWithoutModeratorInput, ModeratorListUncheckedUpdateWithoutModeratorInput>
  }

  export type ModeratorListUpdateManyWithWhereWithoutModeratorInput = {
    where: ModeratorListScalarWhereInput
    data: XOR<ModeratorListUpdateManyMutationInput, ModeratorListUncheckedUpdateManyWithoutModeratorInput>
  }

  export type ModeratorListScalarWhereInput = {
    AND?: ModeratorListScalarWhereInput | ModeratorListScalarWhereInput[]
    OR?: ModeratorListScalarWhereInput[]
    NOT?: ModeratorListScalarWhereInput | ModeratorListScalarWhereInput[]
    id?: IntFilter<"ModeratorList"> | number
    moderatorName?: StringFilter<"ModeratorList"> | string
    moderatorContact?: StringFilter<"ModeratorList"> | string
    authId?: IntFilter<"ModeratorList"> | number
    createdAt?: DateTimeFilter<"ModeratorList"> | Date | string
    updatedAt?: DateTimeFilter<"ModeratorList"> | Date | string
  }

  export type FamilyTreeUpsertWithoutAuthInput = {
    update: XOR<FamilyTreeUpdateWithoutAuthInput, FamilyTreeUncheckedUpdateWithoutAuthInput>
    create: XOR<FamilyTreeCreateWithoutAuthInput, FamilyTreeUncheckedCreateWithoutAuthInput>
    where?: FamilyTreeWhereInput
  }

  export type FamilyTreeUpdateToOneWithWhereWithoutAuthInput = {
    where?: FamilyTreeWhereInput
    data: XOR<FamilyTreeUpdateWithoutAuthInput, FamilyTreeUncheckedUpdateWithoutAuthInput>
  }

  export type FamilyTreeUpdateWithoutAuthInput = {
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastBuildStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FamilyTreeUncheckedUpdateWithoutAuthInput = {
    id?: IntFieldUpdateOperationsInput | number
    data?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    lastBuildStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberUpsertWithWhereUniqueWithoutAuthInput = {
    where: MemberWhereUniqueInput
    update: XOR<MemberUpdateWithoutAuthInput, MemberUncheckedUpdateWithoutAuthInput>
    create: XOR<MemberCreateWithoutAuthInput, MemberUncheckedCreateWithoutAuthInput>
  }

  export type MemberUpdateWithWhereUniqueWithoutAuthInput = {
    where: MemberWhereUniqueInput
    data: XOR<MemberUpdateWithoutAuthInput, MemberUncheckedUpdateWithoutAuthInput>
  }

  export type MemberUpdateManyWithWhereWithoutAuthInput = {
    where: MemberScalarWhereInput
    data: XOR<MemberUpdateManyMutationInput, MemberUncheckedUpdateManyWithoutAuthInput>
  }

  export type MemberScalarWhereInput = {
    AND?: MemberScalarWhereInput | MemberScalarWhereInput[]
    OR?: MemberScalarWhereInput[]
    NOT?: MemberScalarWhereInput | MemberScalarWhereInput[]
    id?: IntFilter<"Member"> | number
    authId?: IntFilter<"Member"> | number
    verified?: BoolNullableFilter<"Member"> | boolean | null
    name?: StringFilter<"Member"> | string
    birthDate?: IntNullableFilter<"Member"> | number | null
    birthMonth?: IntNullableFilter<"Member"> | number | null
    birthYear?: IntNullableFilter<"Member"> | number | null
    deceased?: BoolFilter<"Member"> | boolean
    deathDate?: IntNullableFilter<"Member"> | number | null
    deathMonth?: IntNullableFilter<"Member"> | number | null
    deathYear?: IntNullableFilter<"Member"> | number | null
    gender?: StringFilter<"Member"> | string
    phoneNumber?: StringNullableFilter<"Member"> | string | null
    birthPlace?: StringNullableFilter<"Member"> | string | null
    currentAddress?: StringNullableFilter<"Member"> | string | null
    city?: StringNullableFilter<"Member"> | string | null
    state?: StringNullableFilter<"Member"> | string | null
    country?: StringNullableFilter<"Member"> | string | null
    occupation?: StringNullableFilter<"Member"> | string | null
    education?: StringNullableFilter<"Member"> | string | null
    additionalInfo?: StringNullableFilter<"Member"> | string | null
    descendant?: BoolFilter<"Member"> | boolean
    order?: IntFilter<"Member"> | number
    fatherId?: IntNullableFilter<"Member"> | number | null
    motherId?: IntNullableFilter<"Member"> | number | null
    partnerId?: IntNullableFilter<"Member"> | number | null
    createdAt?: DateTimeFilter<"Member"> | Date | string
    updatedAt?: DateTimeFilter<"Member"> | Date | string
  }

  export type RequestDetailsCreateWithoutMemberInput = {
    authId: number
    type: string
    details: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequestDetailsUncheckedCreateWithoutMemberInput = {
    id?: number
    authId: number
    type: string
    details: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequestDetailsCreateOrConnectWithoutMemberInput = {
    where: RequestDetailsWhereUniqueInput
    create: XOR<RequestDetailsCreateWithoutMemberInput, RequestDetailsUncheckedCreateWithoutMemberInput>
  }

  export type RequestDetailsCreateManyMemberInputEnvelope = {
    data: RequestDetailsCreateManyMemberInput | RequestDetailsCreateManyMemberInput[]
    skipDuplicates?: boolean
  }

  export type nonDescendantRelationCreateWithoutMemberInput = {
    fatherName?: string | null
    motherName?: string | null
    siblingNames?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type nonDescendantRelationUncheckedCreateWithoutMemberInput = {
    id?: number
    fatherName?: string | null
    motherName?: string | null
    siblingNames?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type nonDescendantRelationCreateOrConnectWithoutMemberInput = {
    where: nonDescendantRelationWhereUniqueInput
    create: XOR<nonDescendantRelationCreateWithoutMemberInput, nonDescendantRelationUncheckedCreateWithoutMemberInput>
  }

  export type nonDescendantRelationCreateManyMemberInputEnvelope = {
    data: nonDescendantRelationCreateManyMemberInput | nonDescendantRelationCreateManyMemberInput[]
    skipDuplicates?: boolean
  }

  export type MemberCreateWithoutFatherOfInput = {
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationCreateNestedManyWithoutMemberInput
    father?: MemberCreateNestedOneWithoutFatherOfInput
    mother?: MemberCreateNestedOneWithoutMotherOfInput
    partner?: MemberCreateNestedOneWithoutPartnerOfInput
    partnerOf?: MemberCreateNestedManyWithoutPartnerInput
    motherOf?: MemberCreateNestedManyWithoutMotherInput
    auth: AuthCreateNestedOneWithoutMembersInput
  }

  export type MemberUncheckedCreateWithoutFatherOfInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsUncheckedCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationUncheckedCreateNestedManyWithoutMemberInput
    partnerOf?: MemberUncheckedCreateNestedManyWithoutPartnerInput
    motherOf?: MemberUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MemberCreateOrConnectWithoutFatherOfInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutFatherOfInput, MemberUncheckedCreateWithoutFatherOfInput>
  }

  export type MemberCreateWithoutMotherOfInput = {
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationCreateNestedManyWithoutMemberInput
    father?: MemberCreateNestedOneWithoutFatherOfInput
    mother?: MemberCreateNestedOneWithoutMotherOfInput
    partner?: MemberCreateNestedOneWithoutPartnerOfInput
    partnerOf?: MemberCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberCreateNestedManyWithoutFatherInput
    auth: AuthCreateNestedOneWithoutMembersInput
  }

  export type MemberUncheckedCreateWithoutMotherOfInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsUncheckedCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationUncheckedCreateNestedManyWithoutMemberInput
    partnerOf?: MemberUncheckedCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberUncheckedCreateNestedManyWithoutFatherInput
  }

  export type MemberCreateOrConnectWithoutMotherOfInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutMotherOfInput, MemberUncheckedCreateWithoutMotherOfInput>
  }

  export type MemberCreateWithoutPartnerOfInput = {
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationCreateNestedManyWithoutMemberInput
    father?: MemberCreateNestedOneWithoutFatherOfInput
    mother?: MemberCreateNestedOneWithoutMotherOfInput
    partner?: MemberCreateNestedOneWithoutPartnerOfInput
    fatherOf?: MemberCreateNestedManyWithoutFatherInput
    motherOf?: MemberCreateNestedManyWithoutMotherInput
    auth: AuthCreateNestedOneWithoutMembersInput
  }

  export type MemberUncheckedCreateWithoutPartnerOfInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsUncheckedCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationUncheckedCreateNestedManyWithoutMemberInput
    fatherOf?: MemberUncheckedCreateNestedManyWithoutFatherInput
    motherOf?: MemberUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MemberCreateOrConnectWithoutPartnerOfInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutPartnerOfInput, MemberUncheckedCreateWithoutPartnerOfInput>
  }

  export type MemberCreateWithoutPartnerInput = {
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationCreateNestedManyWithoutMemberInput
    father?: MemberCreateNestedOneWithoutFatherOfInput
    mother?: MemberCreateNestedOneWithoutMotherOfInput
    partnerOf?: MemberCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberCreateNestedManyWithoutFatherInput
    motherOf?: MemberCreateNestedManyWithoutMotherInput
    auth: AuthCreateNestedOneWithoutMembersInput
  }

  export type MemberUncheckedCreateWithoutPartnerInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsUncheckedCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationUncheckedCreateNestedManyWithoutMemberInput
    partnerOf?: MemberUncheckedCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberUncheckedCreateNestedManyWithoutFatherInput
    motherOf?: MemberUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MemberCreateOrConnectWithoutPartnerInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutPartnerInput, MemberUncheckedCreateWithoutPartnerInput>
  }

  export type MemberCreateManyPartnerInputEnvelope = {
    data: MemberCreateManyPartnerInput | MemberCreateManyPartnerInput[]
    skipDuplicates?: boolean
  }

  export type MemberCreateWithoutFatherInput = {
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationCreateNestedManyWithoutMemberInput
    mother?: MemberCreateNestedOneWithoutMotherOfInput
    partner?: MemberCreateNestedOneWithoutPartnerOfInput
    partnerOf?: MemberCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberCreateNestedManyWithoutFatherInput
    motherOf?: MemberCreateNestedManyWithoutMotherInput
    auth: AuthCreateNestedOneWithoutMembersInput
  }

  export type MemberUncheckedCreateWithoutFatherInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsUncheckedCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationUncheckedCreateNestedManyWithoutMemberInput
    partnerOf?: MemberUncheckedCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberUncheckedCreateNestedManyWithoutFatherInput
    motherOf?: MemberUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MemberCreateOrConnectWithoutFatherInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutFatherInput, MemberUncheckedCreateWithoutFatherInput>
  }

  export type MemberCreateManyFatherInputEnvelope = {
    data: MemberCreateManyFatherInput | MemberCreateManyFatherInput[]
    skipDuplicates?: boolean
  }

  export type MemberCreateWithoutMotherInput = {
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationCreateNestedManyWithoutMemberInput
    father?: MemberCreateNestedOneWithoutFatherOfInput
    partner?: MemberCreateNestedOneWithoutPartnerOfInput
    partnerOf?: MemberCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberCreateNestedManyWithoutFatherInput
    motherOf?: MemberCreateNestedManyWithoutMotherInput
    auth: AuthCreateNestedOneWithoutMembersInput
  }

  export type MemberUncheckedCreateWithoutMotherInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsUncheckedCreateNestedManyWithoutMemberInput
    nonDescendantRelation?: nonDescendantRelationUncheckedCreateNestedManyWithoutMemberInput
    partnerOf?: MemberUncheckedCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberUncheckedCreateNestedManyWithoutFatherInput
    motherOf?: MemberUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MemberCreateOrConnectWithoutMotherInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutMotherInput, MemberUncheckedCreateWithoutMotherInput>
  }

  export type MemberCreateManyMotherInputEnvelope = {
    data: MemberCreateManyMotherInput | MemberCreateManyMotherInput[]
    skipDuplicates?: boolean
  }

  export type AuthCreateWithoutMembersInput = {
    mainMemberId?: number | null
    moderatorPassword: string
    password: string
    memberAuthId?: string | null
    moderatorAuthId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    moderatorList?: ModeratorListCreateNestedManyWithoutModeratorInput
    familyTree?: FamilyTreeCreateNestedOneWithoutAuthInput
  }

  export type AuthUncheckedCreateWithoutMembersInput = {
    id?: number
    mainMemberId?: number | null
    moderatorPassword: string
    password: string
    memberAuthId?: string | null
    moderatorAuthId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    moderatorList?: ModeratorListUncheckedCreateNestedManyWithoutModeratorInput
    familyTree?: FamilyTreeUncheckedCreateNestedOneWithoutAuthInput
  }

  export type AuthCreateOrConnectWithoutMembersInput = {
    where: AuthWhereUniqueInput
    create: XOR<AuthCreateWithoutMembersInput, AuthUncheckedCreateWithoutMembersInput>
  }

  export type RequestDetailsUpsertWithWhereUniqueWithoutMemberInput = {
    where: RequestDetailsWhereUniqueInput
    update: XOR<RequestDetailsUpdateWithoutMemberInput, RequestDetailsUncheckedUpdateWithoutMemberInput>
    create: XOR<RequestDetailsCreateWithoutMemberInput, RequestDetailsUncheckedCreateWithoutMemberInput>
  }

  export type RequestDetailsUpdateWithWhereUniqueWithoutMemberInput = {
    where: RequestDetailsWhereUniqueInput
    data: XOR<RequestDetailsUpdateWithoutMemberInput, RequestDetailsUncheckedUpdateWithoutMemberInput>
  }

  export type RequestDetailsUpdateManyWithWhereWithoutMemberInput = {
    where: RequestDetailsScalarWhereInput
    data: XOR<RequestDetailsUpdateManyMutationInput, RequestDetailsUncheckedUpdateManyWithoutMemberInput>
  }

  export type RequestDetailsScalarWhereInput = {
    AND?: RequestDetailsScalarWhereInput | RequestDetailsScalarWhereInput[]
    OR?: RequestDetailsScalarWhereInput[]
    NOT?: RequestDetailsScalarWhereInput | RequestDetailsScalarWhereInput[]
    id?: IntFilter<"RequestDetails"> | number
    authId?: IntFilter<"RequestDetails"> | number
    type?: StringFilter<"RequestDetails"> | string
    details?: StringFilter<"RequestDetails"> | string
    memberId?: IntFilter<"RequestDetails"> | number
    createdAt?: DateTimeFilter<"RequestDetails"> | Date | string
    updatedAt?: DateTimeFilter<"RequestDetails"> | Date | string
  }

  export type nonDescendantRelationUpsertWithWhereUniqueWithoutMemberInput = {
    where: nonDescendantRelationWhereUniqueInput
    update: XOR<nonDescendantRelationUpdateWithoutMemberInput, nonDescendantRelationUncheckedUpdateWithoutMemberInput>
    create: XOR<nonDescendantRelationCreateWithoutMemberInput, nonDescendantRelationUncheckedCreateWithoutMemberInput>
  }

  export type nonDescendantRelationUpdateWithWhereUniqueWithoutMemberInput = {
    where: nonDescendantRelationWhereUniqueInput
    data: XOR<nonDescendantRelationUpdateWithoutMemberInput, nonDescendantRelationUncheckedUpdateWithoutMemberInput>
  }

  export type nonDescendantRelationUpdateManyWithWhereWithoutMemberInput = {
    where: nonDescendantRelationScalarWhereInput
    data: XOR<nonDescendantRelationUpdateManyMutationInput, nonDescendantRelationUncheckedUpdateManyWithoutMemberInput>
  }

  export type nonDescendantRelationScalarWhereInput = {
    AND?: nonDescendantRelationScalarWhereInput | nonDescendantRelationScalarWhereInput[]
    OR?: nonDescendantRelationScalarWhereInput[]
    NOT?: nonDescendantRelationScalarWhereInput | nonDescendantRelationScalarWhereInput[]
    id?: IntFilter<"nonDescendantRelation"> | number
    memberId?: IntFilter<"nonDescendantRelation"> | number
    fatherName?: StringNullableFilter<"nonDescendantRelation"> | string | null
    motherName?: StringNullableFilter<"nonDescendantRelation"> | string | null
    siblingNames?: StringNullableFilter<"nonDescendantRelation"> | string | null
    createdAt?: DateTimeFilter<"nonDescendantRelation"> | Date | string
    updatedAt?: DateTimeFilter<"nonDescendantRelation"> | Date | string
  }

  export type MemberUpsertWithoutFatherOfInput = {
    update: XOR<MemberUpdateWithoutFatherOfInput, MemberUncheckedUpdateWithoutFatherOfInput>
    create: XOR<MemberCreateWithoutFatherOfInput, MemberUncheckedCreateWithoutFatherOfInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutFatherOfInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutFatherOfInput, MemberUncheckedUpdateWithoutFatherOfInput>
  }

  export type MemberUpdateWithoutFatherOfInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUpdateManyWithoutMemberNestedInput
    father?: MemberUpdateOneWithoutFatherOfNestedInput
    mother?: MemberUpdateOneWithoutMotherOfNestedInput
    partner?: MemberUpdateOneWithoutPartnerOfNestedInput
    partnerOf?: MemberUpdateManyWithoutPartnerNestedInput
    motherOf?: MemberUpdateManyWithoutMotherNestedInput
    auth?: AuthUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberUncheckedUpdateWithoutFatherOfInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUncheckedUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUncheckedUpdateManyWithoutMemberNestedInput
    partnerOf?: MemberUncheckedUpdateManyWithoutPartnerNestedInput
    motherOf?: MemberUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type MemberUpsertWithoutMotherOfInput = {
    update: XOR<MemberUpdateWithoutMotherOfInput, MemberUncheckedUpdateWithoutMotherOfInput>
    create: XOR<MemberCreateWithoutMotherOfInput, MemberUncheckedCreateWithoutMotherOfInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutMotherOfInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutMotherOfInput, MemberUncheckedUpdateWithoutMotherOfInput>
  }

  export type MemberUpdateWithoutMotherOfInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUpdateManyWithoutMemberNestedInput
    father?: MemberUpdateOneWithoutFatherOfNestedInput
    mother?: MemberUpdateOneWithoutMotherOfNestedInput
    partner?: MemberUpdateOneWithoutPartnerOfNestedInput
    partnerOf?: MemberUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUpdateManyWithoutFatherNestedInput
    auth?: AuthUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberUncheckedUpdateWithoutMotherOfInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUncheckedUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUncheckedUpdateManyWithoutMemberNestedInput
    partnerOf?: MemberUncheckedUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUncheckedUpdateManyWithoutFatherNestedInput
  }

  export type MemberUpsertWithoutPartnerOfInput = {
    update: XOR<MemberUpdateWithoutPartnerOfInput, MemberUncheckedUpdateWithoutPartnerOfInput>
    create: XOR<MemberCreateWithoutPartnerOfInput, MemberUncheckedCreateWithoutPartnerOfInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutPartnerOfInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutPartnerOfInput, MemberUncheckedUpdateWithoutPartnerOfInput>
  }

  export type MemberUpdateWithoutPartnerOfInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUpdateManyWithoutMemberNestedInput
    father?: MemberUpdateOneWithoutFatherOfNestedInput
    mother?: MemberUpdateOneWithoutMotherOfNestedInput
    partner?: MemberUpdateOneWithoutPartnerOfNestedInput
    fatherOf?: MemberUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUpdateManyWithoutMotherNestedInput
    auth?: AuthUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberUncheckedUpdateWithoutPartnerOfInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUncheckedUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUncheckedUpdateManyWithoutMemberNestedInput
    fatherOf?: MemberUncheckedUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type MemberUpsertWithWhereUniqueWithoutPartnerInput = {
    where: MemberWhereUniqueInput
    update: XOR<MemberUpdateWithoutPartnerInput, MemberUncheckedUpdateWithoutPartnerInput>
    create: XOR<MemberCreateWithoutPartnerInput, MemberUncheckedCreateWithoutPartnerInput>
  }

  export type MemberUpdateWithWhereUniqueWithoutPartnerInput = {
    where: MemberWhereUniqueInput
    data: XOR<MemberUpdateWithoutPartnerInput, MemberUncheckedUpdateWithoutPartnerInput>
  }

  export type MemberUpdateManyWithWhereWithoutPartnerInput = {
    where: MemberScalarWhereInput
    data: XOR<MemberUpdateManyMutationInput, MemberUncheckedUpdateManyWithoutPartnerInput>
  }

  export type MemberUpsertWithWhereUniqueWithoutFatherInput = {
    where: MemberWhereUniqueInput
    update: XOR<MemberUpdateWithoutFatherInput, MemberUncheckedUpdateWithoutFatherInput>
    create: XOR<MemberCreateWithoutFatherInput, MemberUncheckedCreateWithoutFatherInput>
  }

  export type MemberUpdateWithWhereUniqueWithoutFatherInput = {
    where: MemberWhereUniqueInput
    data: XOR<MemberUpdateWithoutFatherInput, MemberUncheckedUpdateWithoutFatherInput>
  }

  export type MemberUpdateManyWithWhereWithoutFatherInput = {
    where: MemberScalarWhereInput
    data: XOR<MemberUpdateManyMutationInput, MemberUncheckedUpdateManyWithoutFatherInput>
  }

  export type MemberUpsertWithWhereUniqueWithoutMotherInput = {
    where: MemberWhereUniqueInput
    update: XOR<MemberUpdateWithoutMotherInput, MemberUncheckedUpdateWithoutMotherInput>
    create: XOR<MemberCreateWithoutMotherInput, MemberUncheckedCreateWithoutMotherInput>
  }

  export type MemberUpdateWithWhereUniqueWithoutMotherInput = {
    where: MemberWhereUniqueInput
    data: XOR<MemberUpdateWithoutMotherInput, MemberUncheckedUpdateWithoutMotherInput>
  }

  export type MemberUpdateManyWithWhereWithoutMotherInput = {
    where: MemberScalarWhereInput
    data: XOR<MemberUpdateManyMutationInput, MemberUncheckedUpdateManyWithoutMotherInput>
  }

  export type AuthUpsertWithoutMembersInput = {
    update: XOR<AuthUpdateWithoutMembersInput, AuthUncheckedUpdateWithoutMembersInput>
    create: XOR<AuthCreateWithoutMembersInput, AuthUncheckedCreateWithoutMembersInput>
    where?: AuthWhereInput
  }

  export type AuthUpdateToOneWithWhereWithoutMembersInput = {
    where?: AuthWhereInput
    data: XOR<AuthUpdateWithoutMembersInput, AuthUncheckedUpdateWithoutMembersInput>
  }

  export type AuthUpdateWithoutMembersInput = {
    mainMemberId?: NullableIntFieldUpdateOperationsInput | number | null
    moderatorPassword?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    memberAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    moderatorList?: ModeratorListUpdateManyWithoutModeratorNestedInput
    familyTree?: FamilyTreeUpdateOneWithoutAuthNestedInput
  }

  export type AuthUncheckedUpdateWithoutMembersInput = {
    id?: IntFieldUpdateOperationsInput | number
    mainMemberId?: NullableIntFieldUpdateOperationsInput | number | null
    moderatorPassword?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    memberAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    moderatorList?: ModeratorListUncheckedUpdateManyWithoutModeratorNestedInput
    familyTree?: FamilyTreeUncheckedUpdateOneWithoutAuthNestedInput
  }

  export type MemberCreateWithoutPendingVerificationInput = {
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    nonDescendantRelation?: nonDescendantRelationCreateNestedManyWithoutMemberInput
    father?: MemberCreateNestedOneWithoutFatherOfInput
    mother?: MemberCreateNestedOneWithoutMotherOfInput
    partner?: MemberCreateNestedOneWithoutPartnerOfInput
    partnerOf?: MemberCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberCreateNestedManyWithoutFatherInput
    motherOf?: MemberCreateNestedManyWithoutMotherInput
    auth: AuthCreateNestedOneWithoutMembersInput
  }

  export type MemberUncheckedCreateWithoutPendingVerificationInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    nonDescendantRelation?: nonDescendantRelationUncheckedCreateNestedManyWithoutMemberInput
    partnerOf?: MemberUncheckedCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberUncheckedCreateNestedManyWithoutFatherInput
    motherOf?: MemberUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MemberCreateOrConnectWithoutPendingVerificationInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutPendingVerificationInput, MemberUncheckedCreateWithoutPendingVerificationInput>
  }

  export type MemberUpsertWithoutPendingVerificationInput = {
    update: XOR<MemberUpdateWithoutPendingVerificationInput, MemberUncheckedUpdateWithoutPendingVerificationInput>
    create: XOR<MemberCreateWithoutPendingVerificationInput, MemberUncheckedCreateWithoutPendingVerificationInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutPendingVerificationInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutPendingVerificationInput, MemberUncheckedUpdateWithoutPendingVerificationInput>
  }

  export type MemberUpdateWithoutPendingVerificationInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nonDescendantRelation?: nonDescendantRelationUpdateManyWithoutMemberNestedInput
    father?: MemberUpdateOneWithoutFatherOfNestedInput
    mother?: MemberUpdateOneWithoutMotherOfNestedInput
    partner?: MemberUpdateOneWithoutPartnerOfNestedInput
    partnerOf?: MemberUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUpdateManyWithoutMotherNestedInput
    auth?: AuthUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberUncheckedUpdateWithoutPendingVerificationInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nonDescendantRelation?: nonDescendantRelationUncheckedUpdateManyWithoutMemberNestedInput
    partnerOf?: MemberUncheckedUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUncheckedUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type MemberCreateWithoutNonDescendantRelationInput = {
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsCreateNestedManyWithoutMemberInput
    father?: MemberCreateNestedOneWithoutFatherOfInput
    mother?: MemberCreateNestedOneWithoutMotherOfInput
    partner?: MemberCreateNestedOneWithoutPartnerOfInput
    partnerOf?: MemberCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberCreateNestedManyWithoutFatherInput
    motherOf?: MemberCreateNestedManyWithoutMotherInput
    auth: AuthCreateNestedOneWithoutMembersInput
  }

  export type MemberUncheckedCreateWithoutNonDescendantRelationInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pendingVerification?: RequestDetailsUncheckedCreateNestedManyWithoutMemberInput
    partnerOf?: MemberUncheckedCreateNestedManyWithoutPartnerInput
    fatherOf?: MemberUncheckedCreateNestedManyWithoutFatherInput
    motherOf?: MemberUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MemberCreateOrConnectWithoutNonDescendantRelationInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutNonDescendantRelationInput, MemberUncheckedCreateWithoutNonDescendantRelationInput>
  }

  export type MemberUpsertWithoutNonDescendantRelationInput = {
    update: XOR<MemberUpdateWithoutNonDescendantRelationInput, MemberUncheckedUpdateWithoutNonDescendantRelationInput>
    create: XOR<MemberCreateWithoutNonDescendantRelationInput, MemberUncheckedCreateWithoutNonDescendantRelationInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutNonDescendantRelationInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutNonDescendantRelationInput, MemberUncheckedUpdateWithoutNonDescendantRelationInput>
  }

  export type MemberUpdateWithoutNonDescendantRelationInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUpdateManyWithoutMemberNestedInput
    father?: MemberUpdateOneWithoutFatherOfNestedInput
    mother?: MemberUpdateOneWithoutMotherOfNestedInput
    partner?: MemberUpdateOneWithoutPartnerOfNestedInput
    partnerOf?: MemberUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUpdateManyWithoutMotherNestedInput
    auth?: AuthUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberUncheckedUpdateWithoutNonDescendantRelationInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUncheckedUpdateManyWithoutMemberNestedInput
    partnerOf?: MemberUncheckedUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUncheckedUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type AuthCreateWithoutModeratorListInput = {
    mainMemberId?: number | null
    moderatorPassword: string
    password: string
    memberAuthId?: string | null
    moderatorAuthId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    familyTree?: FamilyTreeCreateNestedOneWithoutAuthInput
    members?: MemberCreateNestedManyWithoutAuthInput
  }

  export type AuthUncheckedCreateWithoutModeratorListInput = {
    id?: number
    mainMemberId?: number | null
    moderatorPassword: string
    password: string
    memberAuthId?: string | null
    moderatorAuthId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    familyTree?: FamilyTreeUncheckedCreateNestedOneWithoutAuthInput
    members?: MemberUncheckedCreateNestedManyWithoutAuthInput
  }

  export type AuthCreateOrConnectWithoutModeratorListInput = {
    where: AuthWhereUniqueInput
    create: XOR<AuthCreateWithoutModeratorListInput, AuthUncheckedCreateWithoutModeratorListInput>
  }

  export type AuthUpsertWithoutModeratorListInput = {
    update: XOR<AuthUpdateWithoutModeratorListInput, AuthUncheckedUpdateWithoutModeratorListInput>
    create: XOR<AuthCreateWithoutModeratorListInput, AuthUncheckedCreateWithoutModeratorListInput>
    where?: AuthWhereInput
  }

  export type AuthUpdateToOneWithWhereWithoutModeratorListInput = {
    where?: AuthWhereInput
    data: XOR<AuthUpdateWithoutModeratorListInput, AuthUncheckedUpdateWithoutModeratorListInput>
  }

  export type AuthUpdateWithoutModeratorListInput = {
    mainMemberId?: NullableIntFieldUpdateOperationsInput | number | null
    moderatorPassword?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    memberAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    familyTree?: FamilyTreeUpdateOneWithoutAuthNestedInput
    members?: MemberUpdateManyWithoutAuthNestedInput
  }

  export type AuthUncheckedUpdateWithoutModeratorListInput = {
    id?: IntFieldUpdateOperationsInput | number
    mainMemberId?: NullableIntFieldUpdateOperationsInput | number | null
    moderatorPassword?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    memberAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    familyTree?: FamilyTreeUncheckedUpdateOneWithoutAuthNestedInput
    members?: MemberUncheckedUpdateManyWithoutAuthNestedInput
  }

  export type AuthCreateWithoutFamilyTreeInput = {
    mainMemberId?: number | null
    moderatorPassword: string
    password: string
    memberAuthId?: string | null
    moderatorAuthId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    moderatorList?: ModeratorListCreateNestedManyWithoutModeratorInput
    members?: MemberCreateNestedManyWithoutAuthInput
  }

  export type AuthUncheckedCreateWithoutFamilyTreeInput = {
    id?: number
    mainMemberId?: number | null
    moderatorPassword: string
    password: string
    memberAuthId?: string | null
    moderatorAuthId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    moderatorList?: ModeratorListUncheckedCreateNestedManyWithoutModeratorInput
    members?: MemberUncheckedCreateNestedManyWithoutAuthInput
  }

  export type AuthCreateOrConnectWithoutFamilyTreeInput = {
    where: AuthWhereUniqueInput
    create: XOR<AuthCreateWithoutFamilyTreeInput, AuthUncheckedCreateWithoutFamilyTreeInput>
  }

  export type AuthUpsertWithoutFamilyTreeInput = {
    update: XOR<AuthUpdateWithoutFamilyTreeInput, AuthUncheckedUpdateWithoutFamilyTreeInput>
    create: XOR<AuthCreateWithoutFamilyTreeInput, AuthUncheckedCreateWithoutFamilyTreeInput>
    where?: AuthWhereInput
  }

  export type AuthUpdateToOneWithWhereWithoutFamilyTreeInput = {
    where?: AuthWhereInput
    data: XOR<AuthUpdateWithoutFamilyTreeInput, AuthUncheckedUpdateWithoutFamilyTreeInput>
  }

  export type AuthUpdateWithoutFamilyTreeInput = {
    mainMemberId?: NullableIntFieldUpdateOperationsInput | number | null
    moderatorPassword?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    memberAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    moderatorList?: ModeratorListUpdateManyWithoutModeratorNestedInput
    members?: MemberUpdateManyWithoutAuthNestedInput
  }

  export type AuthUncheckedUpdateWithoutFamilyTreeInput = {
    id?: IntFieldUpdateOperationsInput | number
    mainMemberId?: NullableIntFieldUpdateOperationsInput | number | null
    moderatorPassword?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    memberAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    moderatorList?: ModeratorListUncheckedUpdateManyWithoutModeratorNestedInput
    members?: MemberUncheckedUpdateManyWithoutAuthNestedInput
  }

  export type ModeratorListCreateManyModeratorInput = {
    id?: number
    moderatorName: string
    moderatorContact: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberCreateManyAuthInput = {
    id?: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModeratorListUpdateWithoutModeratorInput = {
    moderatorName?: StringFieldUpdateOperationsInput | string
    moderatorContact?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModeratorListUncheckedUpdateWithoutModeratorInput = {
    id?: IntFieldUpdateOperationsInput | number
    moderatorName?: StringFieldUpdateOperationsInput | string
    moderatorContact?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModeratorListUncheckedUpdateManyWithoutModeratorInput = {
    id?: IntFieldUpdateOperationsInput | number
    moderatorName?: StringFieldUpdateOperationsInput | string
    moderatorContact?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberUpdateWithoutAuthInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUpdateManyWithoutMemberNestedInput
    father?: MemberUpdateOneWithoutFatherOfNestedInput
    mother?: MemberUpdateOneWithoutMotherOfNestedInput
    partner?: MemberUpdateOneWithoutPartnerOfNestedInput
    partnerOf?: MemberUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUpdateManyWithoutMotherNestedInput
  }

  export type MemberUncheckedUpdateWithoutAuthInput = {
    id?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUncheckedUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUncheckedUpdateManyWithoutMemberNestedInput
    partnerOf?: MemberUncheckedUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUncheckedUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type MemberUncheckedUpdateManyWithoutAuthInput = {
    id?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestDetailsCreateManyMemberInput = {
    id?: number
    authId: number
    type: string
    details: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type nonDescendantRelationCreateManyMemberInput = {
    id?: number
    fatherName?: string | null
    motherName?: string | null
    siblingNames?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberCreateManyPartnerInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    motherId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberCreateManyFatherInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    motherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberCreateManyMotherInput = {
    id?: number
    authId: number
    verified?: boolean | null
    name: string
    birthDate?: number | null
    birthMonth?: number | null
    birthYear?: number | null
    deceased?: boolean
    deathDate?: number | null
    deathMonth?: number | null
    deathYear?: number | null
    gender: string
    phoneNumber?: string | null
    birthPlace?: string | null
    currentAddress?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    occupation?: string | null
    education?: string | null
    additionalInfo?: string | null
    descendant?: boolean
    order?: number
    fatherId?: number | null
    partnerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RequestDetailsUpdateWithoutMemberInput = {
    authId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestDetailsUncheckedUpdateWithoutMemberInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestDetailsUncheckedUpdateManyWithoutMemberInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type nonDescendantRelationUpdateWithoutMemberInput = {
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    motherName?: NullableStringFieldUpdateOperationsInput | string | null
    siblingNames?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type nonDescendantRelationUncheckedUpdateWithoutMemberInput = {
    id?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    motherName?: NullableStringFieldUpdateOperationsInput | string | null
    siblingNames?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type nonDescendantRelationUncheckedUpdateManyWithoutMemberInput = {
    id?: IntFieldUpdateOperationsInput | number
    fatherName?: NullableStringFieldUpdateOperationsInput | string | null
    motherName?: NullableStringFieldUpdateOperationsInput | string | null
    siblingNames?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberUpdateWithoutPartnerInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUpdateManyWithoutMemberNestedInput
    father?: MemberUpdateOneWithoutFatherOfNestedInput
    mother?: MemberUpdateOneWithoutMotherOfNestedInput
    partnerOf?: MemberUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUpdateManyWithoutMotherNestedInput
    auth?: AuthUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberUncheckedUpdateWithoutPartnerInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUncheckedUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUncheckedUpdateManyWithoutMemberNestedInput
    partnerOf?: MemberUncheckedUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUncheckedUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type MemberUncheckedUpdateManyWithoutPartnerInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberUpdateWithoutFatherInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUpdateManyWithoutMemberNestedInput
    mother?: MemberUpdateOneWithoutMotherOfNestedInput
    partner?: MemberUpdateOneWithoutPartnerOfNestedInput
    partnerOf?: MemberUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUpdateManyWithoutMotherNestedInput
    auth?: AuthUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberUncheckedUpdateWithoutFatherInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUncheckedUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUncheckedUpdateManyWithoutMemberNestedInput
    partnerOf?: MemberUncheckedUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUncheckedUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type MemberUncheckedUpdateManyWithoutFatherInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    motherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberUpdateWithoutMotherInput = {
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUpdateManyWithoutMemberNestedInput
    father?: MemberUpdateOneWithoutFatherOfNestedInput
    partner?: MemberUpdateOneWithoutPartnerOfNestedInput
    partnerOf?: MemberUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUpdateManyWithoutMotherNestedInput
    auth?: AuthUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberUncheckedUpdateWithoutMotherInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pendingVerification?: RequestDetailsUncheckedUpdateManyWithoutMemberNestedInput
    nonDescendantRelation?: nonDescendantRelationUncheckedUpdateManyWithoutMemberNestedInput
    partnerOf?: MemberUncheckedUpdateManyWithoutPartnerNestedInput
    fatherOf?: MemberUncheckedUpdateManyWithoutFatherNestedInput
    motherOf?: MemberUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type MemberUncheckedUpdateManyWithoutMotherInput = {
    id?: IntFieldUpdateOperationsInput | number
    authId?: IntFieldUpdateOperationsInput | number
    verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    name?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableIntFieldUpdateOperationsInput | number | null
    birthMonth?: NullableIntFieldUpdateOperationsInput | number | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    deceased?: BoolFieldUpdateOperationsInput | boolean
    deathDate?: NullableIntFieldUpdateOperationsInput | number | null
    deathMonth?: NullableIntFieldUpdateOperationsInput | number | null
    deathYear?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    birthPlace?: NullableStringFieldUpdateOperationsInput | string | null
    currentAddress?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    additionalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    descendant?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    fatherId?: NullableIntFieldUpdateOperationsInput | number | null
    partnerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}