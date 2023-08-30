
<script lang="ts">
import { useAttrs,useListeners } from 'vue';
import { useButton } from '@/button/src/useButton';
import type {  PressEvent} from '@/shared';
import { Primitive } from '@/primitive';
</script>


<script setup lang="ts">
interface ButtonProps {
  as?:any
  /**
   * Whether the button should display a ripple effect on press.
   * @default false
   */
  disableRipple?: boolean;
  /**
   * The spinner placement.
   * @default "start"
   */
  spinnerPlacement?: "start" | "end";
  /**
   * Whether the button should display a loading spinner.
   * @default false
   */
  isLoading?: boolean;
}
defineOptions({
  name: 'UiButton',
  inheritAttrs: false,
})

const emits = defineEmits<{
  (type:'press'|'press-start'|'press-end'|'press-up',e:PressEvent):void,
  (type:'press-change',e:boolean):void
}>()

const props = withDefaults(defineProps<ButtonProps>(),{
  as: 'button',
});
const attrsProps = useAttrs();
const listenersProps = useListeners();
const { isPressed,attrs,listeners } = useButton({
  props:{
    ...props,
    onPress:(e)=>{
      emits('press',e)
    },
    onPressStart:(e)=>{
      emits('press-start',e)
    },
    onPressChange:(e)=>{
      emits('press-change',e)
    },
    onPressEnd:(e)=>{
      emits('press-end',e)
    },
    onPressUp:(e)=>{
      emits('press-up',e)
    }
  },
  events:listenersProps,
  attrs:attrsProps
});
</script>

<template>
  <Primitive
    :as="as"
    v-bind="attrs"
    v-on="listeners"
  >
    {{ isPressed ? 'pressed' : 'not pressed' }}
    <slot />
  </Primitive>
</template>
