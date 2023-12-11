
<script setup lang="ts">
import { provide,onBeforeUpdate, computed } from 'vue';
import { mountedStates } from "@motionone/dom"
import  { presenceId  } from './context';
export interface PresenceState {
  initial?: boolean | undefined
}
interface PresenceProps {
  name?: string
  initial?: boolean
  exitBeforeEnter?: boolean
}
const props = withDefaults(defineProps<PresenceProps>(), {
  initial: true,
  exitBeforeEnter: false
})
const doneCallbacks = new WeakMap<Element, VoidFunction>()

function removeDoneCallback(element: Element) {
  const prevDoneCallback = doneCallbacks.get(element)
  prevDoneCallback &&
    element.removeEventListener("motioncomplete", prevDoneCallback)
  doneCallbacks.delete(element)
}
const state: PresenceState = { initial:props.initial }

provide(presenceId, state)

onBeforeUpdate(() => {
  state.initial = undefined
})



const enter = (element: Element) => {
  const state = mountedStates.get(element)
  if (!state) return

  removeDoneCallback(element)
  state.setActive("exit", false)
}

const exit = (element: Element, done: VoidFunction) => {
  console.log('element',element)
  const state = mountedStates.get(element)

  if (!state) return done()

  state.setActive("exit", true)

  removeDoneCallback(element)
  doneCallbacks.set(element, done)
  element.addEventListener("motioncomplete", done)
}

const mode = computed(()=>{
  return props.exitBeforeEnter ? "out-in" : undefined
})

</script>

<template>
  <transition
    :name="name"
    :css="false"
    :mode="mode"
    @enter="enter"
    @leave="exit"
  >
    <slot />
  </transition>
</template>
