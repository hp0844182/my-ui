import { usePress } from "@/interactions/usePress";
import { type PressEvents} from '@/shared';

interface UseButtonProps{
  props:{
    isDisabled?:boolean
    as?:string
  }&PressEvents,
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
  const { isDisabled,as = 'button' } = props;
  const { href,target,type,rel } = attrs
  const { isPressed ,pressProps} = usePress(props as any ,events)

  let additionalProps;
  if(as === 'button'){
    additionalProps = {
      ...attrs,
      type:attrs.type,
      disabled: isDisabled
    };
  }else{
    additionalProps = {
      ...attrs,
      role: 'button',
      tabIndex: isDisabled ? undefined : 0,
      href: as === 'a' && isDisabled ? undefined : href,
      target: as === 'a' ? target : undefined,
      type: as === 'input' ? type : undefined,
      disabled: as === 'input' ? isDisabled : undefined,
      'aria-disabled': !isDisabled || as === 'input' ? undefined : isDisabled,
      rel: as === 'a' ? rel : undefined
    };
  }

  return {
    isPressed,
    attrs:additionalProps,
    listeners:pressProps
  }
}
