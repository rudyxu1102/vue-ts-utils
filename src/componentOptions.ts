import { Component, ComponentCustomOptions, ComponentInjectOptions, ComponentObjectPropsOptions, ComponentProvideOptions, ComputedOptions, ConcreteComponent, Directive, EmitsOptions, ExtractDefaultPropTypes, ExtractPropTypes, MethodOptions, RenderFunction, RuntimeCompilerOptions, WatchCallback, WatchOptions } from "vue"
import { DebuggerHook, ErrorCapturedHook } from "./apiLifecycle"
import { ComponentInternalInstance, ComponentInternalOptions, Data, SetupContext } from "./component";
import { EmitsToProps } from "./componentEmits"
import { ComponentPublicInstanceConstructor, CreateComponentPublicInstance } from './componentPublicInstance';
import { LooseRequired, UnionToIntersection, Prettify } from '@vue/shared'
import { CompatConfig } from "./compatConfig";
import { SlotsType } from "./componentSlots";

export type OptionTypesKeys = 'P' | 'B' | 'D' | 'C' | 'M' | 'Defaults'
type MergedHook<T = () => void> = T | T[]

declare const AttrSymbol: unique symbol
export type AttrsType<T extends Record<string, any> = Record<string, any>> = {
  [AttrSymbol]?: T extends ComponentPublicInstanceConstructor
    ? InstanceType<T>['$props']
    : T
}
export type ExtractPropsAndEvents<T extends abstract new (...args: any) => any> = InstanceType<T>['$props'];
export type UnwrapAttrsType<
  Attrs extends AttrsType,
  T = NonNullable<Attrs[typeof AttrSymbol]>
> = [keyof Attrs] extends [never]
  ? Data
  : Readonly<
      Prettify<{
        [K in keyof T]: T[K]
      }>
    >
export type ComponentOptionsMixin = ComponentOptionsBase<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

export type ObjectWatchOptionItem = {
  handler: WatchCallback | string
} & WatchOptions

type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

type ComponentWatchOptionItem = WatchOptionItem | WatchOptionItem[]
type ComponentWatchOptions = Record<string, ComponentWatchOptionItem>

type ExtractOptionProp<T> = T extends ComponentOptionsBase<
  infer P, // Props
  any, // RawBindings
  any, // D
  any, // C
  any, // M
  any, // Mixin
  any, // Extends
  any // EmitsOptions
>
  ? unknown extends P
    ? {}
    : P
  : {}

interface LegacyOptions<
  Props,
  D,
  C extends ComputedOptions,
  M extends MethodOptions,
  Mixin extends ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin,
  I extends ComponentInjectOptions,
  II extends string
> {
  compatConfig?: CompatConfig

  // allow any custom options
  [key: string]: any

  // state
  // Limitation: we cannot expose RawBindings on the `this` context for data
  // since that leads to some sort of circular inference and breaks ThisType
  // for the entire component.
  data?: (
    this: CreateComponentPublicInstance<
      Props,
      {},
      {},
      {},
      MethodOptions,
      Mixin,
      Extends
    >,
    vm: CreateComponentPublicInstance<
      Props,
      {},
      {},
      {},
      MethodOptions,
      Mixin,
      Extends
    >
  ) => D
  computed?: C
  methods?: M
  watch?: ComponentWatchOptions
  provide?: ComponentProvideOptions
  inject?: I | II[]

  // assets
  filters?: Record<string, Function>

  // composition
  mixins?: Mixin[]
  extends?: Extends

  // lifecycle
  beforeCreate?(): void
  created?(): void
  beforeMount?(): void
  mounted?(): void
  beforeUpdate?(): void
  updated?(): void
  activated?(): void
  deactivated?(): void
  /** @deprecated use `beforeUnmount` instead */
  beforeDestroy?(): void
  beforeUnmount?(): void
  /** @deprecated use `unmounted` instead */
  destroyed?(): void
  unmounted?(): void
  renderTracked?: DebuggerHook
  renderTriggered?: DebuggerHook
  errorCaptured?: ErrorCapturedHook

  /**
   * runtime compile only
   * @deprecated use `compilerOptions.delimiters` instead.
   */
  delimiters?: [string, string]

  /**
   * #3468
   *
   * type-only, used to assist Mixin's type inference,
   * typescript will try to simplify the inferred `Mixin` type,
   * with the `__differentiator`, typescript won't be able to combine different mixins,
   * because the `__differentiator` will be different
   */
  __differentiator?: keyof D | keyof C | keyof M
}


export interface ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C extends ComputedOptions,
  M extends MethodOptions,
  Mixin extends ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin,
  E extends EmitsOptions,
  EE extends string = string,
  Defaults = {},
  I extends ComponentInjectOptions = {},
  II extends string = string,
  S extends SlotsType = {},
  Attrs extends AttrsType = Record<string, unknown>
> extends LegacyOptions<Props, D, C, M, Mixin, Extends, I, II>,
    ComponentInternalOptions,
    ComponentCustomOptions {
  setup?: (
    this: void,
    props: Readonly<
      LooseRequired<
        Props &
          UnionToIntersection<ExtractOptionProp<Mixin>> &
          UnionToIntersection<ExtractOptionProp<Extends>>
      >
    >,
    ctx: SetupContext<E, S, Attrs>
  ) => Promise<RawBindings> | RawBindings | RenderFunction | void
  name?: string
  template?: string | object // can be a direct DOM node
  // Note: we are intentionally using the signature-less `Function` type here
  // since any type with signature will cause the whole inference to fail when
  // the return expression contains reference to `this`.
  // Luckily `render()` doesn't need any arguments nor does it care about return
  // type.
  render?: Function
  components?: Record<string, Component>
  directives?: Record<string, Directive>
  inheritAttrs?: boolean
  emits?: (E | EE[]) & ThisType<void>
  slots?: S
  attrs?: Attrs

  // TODO infer public instance type based on exposed keys
  expose?: string[]
  serverPrefetch?(): Promise<any>

  // Runtime compiler only -----------------------------------------------------
  compilerOptions?: RuntimeCompilerOptions

  // Internal ------------------------------------------------------------------

  /**
   * SSR only. This is produced by compiler-ssr and attached in compiler-sfc
   * not user facing, so the typing is lax and for test only.
   * @internal
   */
  ssrRender?: (
    ctx: any,
    push: (item: any) => void,
    parentInstance: ComponentInternalInstance,
    attrs: Data | undefined,
    // for compiler-optimized bindings
    $props: ComponentInternalInstance['props'],
    $setup: ComponentInternalInstance['setupState'],
    $data: ComponentInternalInstance['data'],
    $options: ComponentInternalInstance['ctx']
  ) => void

  /**
   * Only generated by compiler-sfc to mark a ssr render function inlined and
   * returned from setup()
   * @internal
   */
  __ssrInlineRender?: boolean

  /**
   * marker for AsyncComponentWrapper
   * @internal
   */
  __asyncLoader?: () => Promise<ConcreteComponent>
  /**
   * the inner component resolved by the AsyncComponentWrapper
   * @internal
   */
  __asyncResolved?: ConcreteComponent

  // Type differentiators ------------------------------------------------------

  // Note these are internal but need to be exposed in d.ts for type inference
  // to work!

  // type-only differentiator to separate OptionWithoutProps from a constructor
  // type returned by defineComponent() or FunctionalComponent
  call?: (this: unknown, ...args: unknown[]) => never
  // type-only differentiators for built-in Vnode types
  __isFragment?: never
  __isTeleport?: never
  __isSuspense?: never

  __defaults?: Defaults
}


export type MergedComponentOptionsOverride = {
  beforeCreate?: MergedHook
  created?: MergedHook
  beforeMount?: MergedHook
  mounted?: MergedHook
  beforeUpdate?: MergedHook
  updated?: MergedHook
  activated?: MergedHook
  deactivated?: MergedHook
  /** @deprecated use `beforeUnmount` instead */
  beforeDestroy?: MergedHook
  beforeUnmount?: MergedHook
  /** @deprecated use `unmounted` instead */
  destroyed?: MergedHook
  unmounted?: MergedHook
  renderTracked?: MergedHook<DebuggerHook>
  renderTriggered?: MergedHook<DebuggerHook>
  errorCaptured?: MergedHook<ErrorCapturedHook>
}


type ObjectInjectOptions = Record<
  string | symbol,
  string | symbol | { from?: string | symbol; default?: unknown }
>

export type InjectToObject<T extends ComponentInjectOptions> =
  T extends string[]
  ? {
    [K in T[number]]?: unknown
  }
  : T extends ObjectInjectOptions
  ? {
    [K in keyof T]?: unknown
  }
  : never

export type ExtractComputedReturns<T extends any> = {
  [key in keyof T]: T[key] extends { get: (...args: any[]) => infer TReturn }
  ? TReturn
  : T[key] extends (...args: any[]) => infer TReturn
  ? TReturn
  : never
}
export type ComponentOptionsWithoutProps<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  S extends SlotsType = {},
  Attrs extends AttrsType = Record<string, unknown>,
  PE = Props & EmitsToProps<E>
> = ComponentOptionsBase<
  PE,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  {},
  I,
  II,
  S,
  Attrs
> & {
  props?: undefined
} & ThisType<
  CreateComponentPublicInstance<
    PE,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    PE,
    {},
    false,
    I,
    S,
    Attrs
  >
>

export type ComponentOptionsWithArrayProps<
  PropNames extends string = string,
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  S extends SlotsType = {},
  Attrs extends AttrsType = Record<string, unknown>,
  Props = Readonly<{ [key in PropNames]?: any }> & EmitsToProps<E>
> = ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  {},
  I,
  II,
  S,
  Attrs
> & {
  props: PropNames[]
} & ThisType<
  CreateComponentPublicInstance<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    Props,
    {},
    false,
    I,
    S,
    Attrs
  >
>

export type ComponentOptionsWithObjectProps<
  PropsOptions = ComponentObjectPropsOptions,
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  S extends SlotsType = {},
  Attrs extends AttrsType = Record<string, unknown>,
  Props = Readonly<ExtractPropTypes<PropsOptions>> & EmitsToProps<E>,
  Defaults = ExtractDefaultPropTypes<PropsOptions>
> = ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  Defaults,
  I,
  II,
  S,
  Attrs
> & {
  props: PropsOptions & ThisType<void>
} & ThisType<
  CreateComponentPublicInstance<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    Props,
    Defaults,
    false,
    I,
    S,
    Attrs
  >
>