
<script setup lang="ts">
import { useSpinner } from './use-spinner';
import type { UseSpinnerProps } from './use-spinner';
// import type { SpinnerVariantProps } from '@/theme';
// import type { SpinnerSlots } from '@/theme';
// import type { Props } from './use-spinner'
interface SpinnerProps {
  className?: UseSpinnerProps['className'],
  classNames?: UseSpinnerProps['classNames']
  label?: UseSpinnerProps['label'],
  labelColor?: UseSpinnerProps['labelColor'],
  size?: UseSpinnerProps['size'],
  color: UseSpinnerProps['color'],
}
const props = defineProps<SpinnerProps>()

const { slots } = useSpinner(props)
</script>

<template>
  <div :class="slots.base({ className: classNames?.base })">
    <div
      :class="slots.wrapper(
        {
          className: classNames?.wrapper
        }
      )"
    >
      <i
        :class="slots.circle1(
          {
            className: classNames?.circle1
          }
        )"
      />
      <i
        :class="slots.circle2(
          {
            className: classNames?.circle2
          }
        )"
      />
    </div>
    <slot name="label">
      <span
        v-if="label"
        :class="slots.label()"
      >{{ label }}</span>
    </slot>
  </div>
</template>
