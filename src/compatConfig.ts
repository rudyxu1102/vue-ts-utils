import { DeprecationTypes, Component } from "vue"

export type CompatConfig = Partial<
Record<DeprecationTypes, boolean | 'suppress-warning'>
> & {
MODE?: 2 | 3 | ((comp: Component | null) => 2 | 3)
}
