import type { HTMLAttributes } from "vue/types/jsx";

export type FocusEventS = {
  onFocus?:(e:FocusEvent)=>void
  onBlur?:(e:FocusEvent)=>void
  onFocusChange?: (isFocused: boolean) => void
}

export interface FocusProps extends FocusEventS {
  /** Whether the focus events should be disabled. */
  isDisabled?: boolean
}

export interface FocusResult {
  /** Props to spread onto the target element. */
  focusProps: {
    focus:HTMLAttributes['onFocus'],
    blur:HTMLAttributes['onBlur']
  }
}
export function useFocus(props:FocusProps):FocusResult{
  const {
    isDisabled,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onFocusChange
  } = props;
  const onBlur = (e:FocusEvent)=>{
    if (e.target === e.currentTarget) {
      if (onBlurProp) {
        onBlurProp(e);
      }
      if (onFocusChange) {
        onFocusChange(false);
      }

      return true;
    }
  }

  const onFocus = (e: FocusEvent) => {
    // Double check that document.activeElement actually matches e.target in case a previously chained
    // focus handler already moved focus somewhere else.
    if (e.target === e.currentTarget && document.activeElement === e.target) {
      if (onFocusProp) {
        onFocusProp(e);
      }

      if (onFocusChange) {
        onFocusChange(true);
      }

    }
  }

  return {
    focusProps:{
      focus: (!isDisabled && (onFocusProp || onFocusChange || onBlurProp)) ? onFocus : undefined,
      blur: (!isDisabled && (onBlurProp || onFocusChange)) ? onBlur : undefined
    }
  }

}
