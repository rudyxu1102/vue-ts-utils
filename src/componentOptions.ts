import { ComponentInjectOptions, ComponentObjectPropsOptions, ComponentOptionsBase, ComponentOptionsMixin, ComputedOptions, EmitsOptions, ExtractDefaultPropTypes, ExtractPropTypes, MethodOptions } from "vue"
import { DebuggerHook, ErrorCapturedHook } from "./apiLifecycle"
import { EmitsToProps } from "./componentEmits"
import { CreateComponentPublicInstance } from './componentPublicInstance';
export type OptionTypesKeys = 'P' | 'B' | 'D' | 'C' | 'M' | 'Defaults'
type MergedHook<T = () => void> = T | T[]

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
  Attrs = {},
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
  II
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
  Attrs = {},
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
  II
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
  Attrs = {},
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
  II
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
    Attrs
  >
>