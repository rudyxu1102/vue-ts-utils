import { DebuggerEvent } from "vue";
import { ComponentPublicInstance } from "./componentPublicInstance";

export type DebuggerHook = (e: DebuggerEvent) => void

export type ErrorCapturedHook<TError = unknown> = (
  err: TError,
  instance: ComponentPublicInstance | null,
  info: string
) => boolean | void
