import { UnionToIntersection } from '@vue/shared';

export type ObjectEmitsOptions = Record<
  string,
  ((...args: any[]) => any) | null
>

export type EmitsOptions = ObjectEmitsOptions | string[]


export type EmitFn<
  Options = ObjectEmitsOptions,
  Event extends keyof Options = keyof Options
> = Options extends Array<infer V>
  ? (event: V, ...args: any[]) => void
  : {} extends Options // if the emit is empty object (usually the default value for emit) should be converted to function
  ? (event: string, ...args: any[]) => void
  : UnionToIntersection<
    {
      [key in Event]: Options[key] extends (...args: infer Args) => any
      ? (event: key, ...args: Args) => void
      : (event: key, ...args: any[]) => void
    }[Event]
  >


export type EmitsToProps<T extends EmitsOptions> = T extends string[]
  ? {
    [K in string & `on${Capitalize<T[number]>}`]?: (...args: any[]) => any
  }
  : T extends ObjectEmitsOptions
  ? {
    [K in string &
    `on${Capitalize<string & keyof T>}`]?: K extends `on${infer C}`
    ? T[Uncapitalize<C>] extends null
    ? (...args: any[]) => any
    : (
      ...args: T[Uncapitalize<C>] extends (...args: infer P) => any
        ? P
        : never
    ) => any
    : never
  }
  : {}
