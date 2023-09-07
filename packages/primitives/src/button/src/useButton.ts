import { usePress } from "@/interactions/usePress";
import { type PressEvents} from '@/shared';
import type { ButtonVariantProps } from '@/theme';
import { computed } from "vue";
import { button } from '@/theme';
import { useRipple } from "@/components/ripple";

export interface BaseButtonProps extends ButtonVariantProps,PressEvents{
  as?: any
  /**
   * cause vue2 can not get class prop, so use className instead
   */
  className?: string
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
interface UseButtonProps{
  props:BaseButtonProps,
  attrs:any,
  events:Record<string,Function|Function[]>
}
// IntrinsicElementAttributes/
// type A = keyof JSX.IntrinsicElements
export function useButton({
  props,
  attrs,
  events
}:UseButtonProps) {
  const { href,target,type,rel } = attrs
  const {onClick: onRippleClickHandler, ripples} = useRipple();

  const isDisabled = computed(()=>{
    return props.isDisabled || props.isLoading
  })

  const click = events?.click as Function
  const { isPressed ,pressProps} = usePress(props as any ,{
    ...events,
    click:(e:any)=>{
        console.log('isDisabled',isDisabled.value)
      if (!(props.disableRipple || isDisabled.value || props.disableAnimation)){
        onRippleClickHandler(e)
      }
      click?.(e)
    }
  })
  


  const additionalProps = computed(()=>{
     let resProps:any = {}
    if(props.as === 'button'){
      resProps =  {
        ...attrs,
        type:attrs.type,
        disabled: props.isDisabled,
      };
    }else{
      resProps = {
        ...attrs,
        role: 'button',
        tabIndex: isDisabled.value ? undefined : 0,
        href: props.as === 'a' && isDisabled.value ? undefined : href,
        target: props.as === 'a' ? target : undefined,
        type: props.as === 'input' ? type : undefined,
        disabled: props.as === 'input' ? isDisabled.value : undefined,
        'aria-disabled': !isDisabled.value || props.as === 'input' ? undefined : props.isDisabled,
        rel: props.as === 'a' ? rel : undefined,
      };
    }
    resProps['data-pressed'] = !isDisabled.value&&isPressed.value
    resProps['data-disabled'] = isDisabled.value

    return resProps
  })

  const classes = computed(()=>{
    return button({
      variant:props.variant,
      size:props.size,
      color:props.color,
      disableAnimation:props.disableAnimation,
      isDisabled:isDisabled.value,
      fullWidth:props.fullWidth,
      radius:props.radius,
      isIconOnly:props.isIconOnly,
      isInGroup:props.isInGroup,
      className:props.className,
    })
  })

  const spinnerSize = computed(() => {
    const buttonSpinnerSizeMap = {
      sm: "sm",
      md: "sm",
      lg: "md",
    };

    return buttonSpinnerSizeMap[props.size!] as 'sm';
  });

  return {
    isPressed,
    attrs:additionalProps,
    listeners:pressProps,
    classes,
    ripples,
    spinnerSize
  }
}
