import { Slot } from "vue"

export type InternalSlots = {
  [name: string]: Slot | undefined
}