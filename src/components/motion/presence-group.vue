
<script setup lang="ts">
import { onBeforeUpdate, provide } from 'vue'
import { presenceId } from './context';
import { mountedStates } from '@motionone/dom';
export interface PresenceState {
  initial?: boolean | undefined
}
defineOptions({
  name: 'PresenceGroup'
})
interface PresenceGroupProps {
  name?: string
  initial?: boolean
}

const props = withDefaults(defineProps<PresenceGroupProps>(), {
  initial: true
})

const doneCallbacks = new WeakMap<Element, VoidFunction>()
function removeDoneCallback(element: Element) {
  const prevDoneCallback = doneCallbacks.get(element)
  prevDoneCallback &&
    element.removeEventListener("motioncomplete", prevDoneCallback)
  doneCallbacks.delete(element)
}
const state: PresenceState = { initial: props.initial }

provide(presenceId, state)

onBeforeUpdate(() => {
  state.initial = undefined;
});

const enter = (element: Element) => {
  const state = mountedStates.get(element);

  if (!state) return;

  removeDoneCallback(element);
  state.setActive('exit', false);
}
const exit = (element: Element, done: VoidFunction) => {
  const state = mountedStates.get(element);

  if (!state) return done();

  state.setActive('exit', true);

  removeDoneCallback(element);
  doneCallbacks.set(element, done);
  element.addEventListener('motioncomplete', done);
}
</script>

<template>
  <transition-group
    :name="name"
    :css="false"
    @enter="enter"
    @leave="exit"
  >
    <slot />
  </transition-group>
</template>
