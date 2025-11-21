/* eslint-disable @typescript-eslint/no-explicit-any */
export type DropFirstArg<T> = T extends (first: any, ...rest: infer R) => infer Ret
  ? (...args: R) => Ret
  : T

export type RemoveFirstParamFromFunctions<T> = {
  [K in keyof T]: DropFirstArg<T[K]>
}
