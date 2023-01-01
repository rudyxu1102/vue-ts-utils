import { PropType } from "vue"
import { Data } from "./component"

type DefaultFactory<T> = (props: Data) => T | null | undefined

const enum BooleanFlags {
  shouldCast,
  shouldCastTrue
}
export interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null
  required?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object
  validator?(value: unknown): boolean
}

type NormalizedProp =
  | null
  | (PropOptions & {
    [BooleanFlags.shouldCast]?: boolean
    [BooleanFlags.shouldCastTrue]?: boolean
  })

// normalized value is a tuple of the actual normalized options
// and an array of prop keys that need value casting (booleans and defaults)
export type NormalizedProps = Record<string, NormalizedProp>
export type NormalizedPropsOptions = [NormalizedProps, string[]] | []
