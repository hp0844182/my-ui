import { mapPropsVariants } from '@/system';
import type { SpinnerSlots, SpinnerVariantProps } from '@/theme';
import { spinner } from '@/theme';
import type { SlotsToClasses } from '@/theme';
import { computed } from 'vue';



export interface UseSpinnerProps extends SpinnerVariantProps {
  /**
     * Spinner label, in case you passed it will be used as `aria-label`.
     */
  label?: string;
  /**
  * Classname or List of classes to change the classNames of the element.
  * if `className` is passed, it will be added to the base slot.
  *
  * @example
  * ```ts
  * <Spinner classNames={{
  *    base:"base-classes",
  *    wrapper: "wrapper-classes",
  *    circle1: "circle1-classes",
  *    circle2: "circle2-classes",
  *    label: "label-classes"
  * }} />
  * ```
  */
  classNames?: SlotsToClasses<SpinnerSlots>;
  className?: string;
}

export function useSpinner(originalProps: UseSpinnerProps) {

  const variants = computed(() => {
    return mapPropsVariants(originalProps, spinner.variantKeys);
  })

  const slots = computed(() => {
    return spinner(variants.value[1])
  })

  return {
    slots,
  }
}
