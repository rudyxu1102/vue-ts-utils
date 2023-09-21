import { ComputedOptions, MethodOptions, EmitsOptions, ComponentInjectOptions, ComponentCustomProperties, nextTick, ShallowUnwrapRef, UnwrapNestedRefs, WatchOptions, WatchStopHandle } from "vue"
import { UnionToIntersection } from '@vue/shared'
import { ExtractComputedReturns, InjectToObject, MergedComponentOptionsOverride, OptionTypesKeys, ComponentOptionsBase, ComponentOptionsMixin, AttrsType, UnwrapAttrsType } from './componentOptions'
import { AllowedComponentProps, ComponentInternalInstance, Data, noAttrsDefine } from "./component"
import { EmitFn } from "./componentEmits"
import { SlotsType, UnwrapSlotsType } from "./componentSlots"
type IsDefaultMixinComponent<T> = T extends ComponentOptionsMixin
  ? ComponentOptionsMixin extends T
  ? true
  : false
  : false

export type OptionTypesType<
  P = {},
  B = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Defaults = {}
> = {
  P: P
  B: B
  D: D
  C: C
  M: M
  Defaults: Defaults
}


type MixinToOptionTypes<T> = T extends ComponentOptionsBase<
  infer P,
  infer B,
  infer D,
  infer C,
  infer M,
  infer Mixin,
  infer Extends,
  any,
  any,
  infer Defaults
>
  ? OptionTypesType<P & {}, B & {}, D & {}, C & {}, M & {}, Defaults & {}> &
  IntersectionMixin<Mixin> &
  IntersectionMixin<Extends>
  : never

// ExtractMixin(map type) is used to resolve circularly references
type ExtractMixin<T> = {
  Mixin: MixinToOptionTypes<T>
}[T extends ComponentOptionsMixin ? 'Mixin' : never]


type IntersectionMixin<T> = IsDefaultMixinComponent<T> extends true
  ? OptionTypesType<{}, {}, {}, {}, {}>
  : UnionToIntersection<ExtractMixin<T>>


type UnwrapMixinsType<
  T,
  Type extends OptionTypesKeys
> = T extends OptionTypesType ? T[Type] : never
type EnsureNonVoid<T> = T extends void ? {} : T

// public properties exposed on the proxy, which is used as the render context
// in templates (as `this` in the render option)
export type ComponentPublicInstance<
  P = {}, // props type extracted from props option
  B = {}, // raw bindings returned from setup()
  D = {}, // return from data()
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  E extends EmitsOptions = {},
  PublicProps = P,
  Defaults = {},
  MakeDefaultsOptional extends boolean = false,
  Options = ComponentOptionsBase<any, any, any, any, any, any, any, any, any>,
  I extends ComponentInjectOptions = {},
  S extends SlotsType = {},
  Attrs extends AttrsType = Record<string, unknown>, // Attrs type extracted from attrs option
  // AttrsProps type used for JSX validation of attrs
  AttrsProps = noAttrsDefine<Attrs> extends true // if attrs is not defined
    ? {} // no JSX validation of attrs
    : Omit<UnwrapAttrsType<Attrs>, keyof (P & PublicProps)> // exclude props from attrs, for JSX validation
> = {
  $: ComponentInternalInstance
  $data: D
  $props: MakeDefaultsOptional extends true
  ? Partial<Defaults> &
  Omit<P & PublicProps, keyof Defaults> & AttrsProps
  : P & PublicProps & AttrsProps
  $attrs: noAttrsDefine<Attrs> extends true
  ? Data
  : UnwrapAttrsType<Attrs>
  $refs: Data
  $slots: UnwrapSlotsType<S>
  $root: ComponentPublicInstance | null
  $parent: ComponentPublicInstance | null
  $emit: EmitFn<E>
  $el: any
  $options: Options & MergedComponentOptionsOverride
  $forceUpdate: () => void
  $nextTick: typeof nextTick
  $watch<T extends string | ((...args: any) => any)>(
    source: T,
    cb: T extends (...args: any) => infer R
      ? (...args: [R, R]) => any
      : (...args: any) => any,
    options?: WatchOptions
  ): WatchStopHandle
} & P &
  ShallowUnwrapRef<B> &
  UnwrapNestedRefs<D> &
  ExtractComputedReturns<C> &
  M &
  ComponentCustomProperties &
  InjectToObject<I>


export type CreateComponentPublicInstance<
  P = {},
  B = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  PublicProps = P,
  Defaults = {},
  MakeDefaultsOptional extends boolean = false,
  I extends ComponentInjectOptions = {},
  S extends SlotsType = {},
  Attrs extends AttrsType = Record<string, unknown>,
  PublicMixin = IntersectionMixin<Mixin> & IntersectionMixin<Extends>,
  PublicP = UnwrapMixinsType<PublicMixin, 'P'> & EnsureNonVoid<P>,
  PublicB = UnwrapMixinsType<PublicMixin, 'B'> & EnsureNonVoid<B>,
  PublicD = UnwrapMixinsType<PublicMixin, 'D'> & EnsureNonVoid<D>,
  PublicC extends ComputedOptions = UnwrapMixinsType<PublicMixin, 'C'> &
  EnsureNonVoid<C>,
  PublicM extends MethodOptions = UnwrapMixinsType<PublicMixin, 'M'> &
  EnsureNonVoid<M>,
  PublicDefaults = UnwrapMixinsType<PublicMixin, 'Defaults'> &
  EnsureNonVoid<Defaults>
> = ComponentPublicInstance<
  PublicP,
  PublicB,
  PublicD,
  PublicC,
  PublicM,
  E,
  PublicProps,
  PublicDefaults,
  MakeDefaultsOptional,
  ComponentOptionsBase<P, B, D, C, M, Mixin, Extends, E, string, Defaults>,
  I,
  S,
  Attrs
>


export type ComponentPublicInstanceConstructor<
  T extends ComponentPublicInstance<
    Props,
    RawBindings,
    D,
    C,
    M
  > = ComponentPublicInstance<any>,
  Props = any,
  RawBindings = any,
  D = any,
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions
> = {
  __isFragment?: never
  __isTeleport?: never
  __isSuspense?: never
  new(...args: any[]): T
}