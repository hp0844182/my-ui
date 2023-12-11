
<script lang="ts">
import { useAttrs, useListeners } from 'vue';
import { useButton } from '@/button/src/useButton';
import type { BaseButtonProps } from '@/button/src/useButton';
import type { PressEvent } from '@/shared';
import { Primitive } from '@/primitive';
import { Ripple } from '@/components/ripple';
import { Spinner } from '@/components/spinner';
</script>


<script setup lang="ts">
interface ButtonProps {
  as?: BaseButtonProps['as']
  className?: BaseButtonProps['className'];
  disableRipple?: BaseButtonProps['disableRipple'];
  spinnerPlacement?: BaseButtonProps['spinnerPlacement'];
  isLoading?: BaseButtonProps['isLoading'];
  variant?: BaseButtonProps['variant']
  size?: BaseButtonProps['size']
  color?: BaseButtonProps['color']
  disableAnimation?: BaseButtonProps['disableAnimation']
  isDisabled?: BaseButtonProps['isDisabled']
  fullWidth?: BaseButtonProps['fullWidth']
  radius?: BaseButtonProps['radius']
  isIconOnly?: BaseButtonProps['isIconOnly']
  isInGroup?: BaseButtonProps['isInGroup']
}

defineOptions({
  name: 'UiButton',
  inheritAttrs: false,
})

const emits = defineEmits<{
  (type: 'press' | 'press-start' | 'press-end' | 'press-up', e: PressEvent): void,
  (type: 'press-change', e: boolean): void
}>()
const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  className: '',
  disableRipple: false,
  isLoading: false,
  spinnerPlacement: 'start',
  isIconOnly: false,
  variant: 'solid',
  size: 'md',
  color: 'default',
  disableAnimation: false,
  radius: 'md',
  isDisabled: false,
  fullWidth: false,
  isInGroup: false,
});

const attrsProps = useAttrs();
const listenersProps = useListeners();
const useButtonProps = Object.assign(props, {
    ...(props as any),
    onPress: (e) => {
      emits('press', e)
    },
    onPressStart: (e) => {
      emits('press-start', e)
    },
    onPressChange: (e) => {
      emits('press-change', e)
    },
    onPressEnd: (e) => {
      emits('press-end', e)
    },
    onPressUp: (e) => {
      emits('press-up', e)
    }
  } as BaseButtonProps)
  console.log('listenersProps',listenersProps)
const { attrs, listeners, classes, ripples, spinnerSize } = useButton({
  props:useButtonProps,
  events: listenersProps,
  attrs: attrsProps
});


</script>

<template>
  <Primitive
    :class="classes"
    :as="as"
    v-bind="attrs"
    v-on="listeners"
  >
    <slot name="startContent" />
    <slot
      v-if="isLoading && spinnerPlacement === 'start'"
      name="spinner"
    >
      <Spinner
        color="current"
        :size="spinnerSize"
      />
    </slot>
    <slot />
    <slot
      v-if="isLoading && spinnerPlacement === 'end'"
      name="spinner"
    >
      <Spinner
        color="current"
        :size="spinnerSize"
      />
    </slot>
    <slot name="endContent" />
    <Ripple
      v-if="!disableRipple"
      :ripples="ripples"
    />
  </Primitive>
</template>
