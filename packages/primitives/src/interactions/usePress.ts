import { type PressEvents, type PointerType, isVirtualClick, isVirtualPointerEvent, type PressEvent as IPressEvent, useGlobalListeners } from '@/shared';
import { mergeEvents } from '@/shared/utils/dom';
import { focusWithoutScrolling } from '@/shared/utils/dom/focusWithoutScrolling';
import { ref } from 'vue';
import type { Ref } from 'vue';
export interface PressOptions extends PressEvents {
  // /** Whether the target is in a controlled press state (e.g. an overlay it triggers is open). */
  // isPressed?: boolean,
  /** Whether the press events should be disabled. */
  isDisabled?: boolean,
  /** Whether the target should not receive focus on press. */
  preventFocusOnPress?: boolean,
  /**
   * Whether press events should be canceled when the pointer leaves the target while pressed.
   * By default, this is `false`, which means if the pointer returns back over the target while
   * still pressed, onPressStart will be fired again. If set to `true`, the press is canceled
   * when the pointer leaves the target and onPressStart will not be fired if the pointer returns.
   */
  shouldCancelOnPointerExit?: boolean,
}

export interface PressResult {
  /** Whether the target is currently pressed. */
  isPressed: Ref<boolean>,
  pressProps: PressProps
}

interface PressState {
  isPressed: boolean,
  ignoreEmulatedMouseEvents: boolean,
  ignoreClickAfterPress: boolean,
  didFirePressStart: boolean,
  activePointerId: any,
  target: EventTarget | null,
  isOverTarget: boolean,
  pointerType: PointerType | null,
  userSelect?: string
}

interface EventBase {
  currentTarget: EventTarget,
  shiftKey: boolean,
  ctrlKey: boolean,
  metaKey: boolean,
  altKey: boolean
}

interface PressProps {
  keydown: (e: KeyboardEvent) => void
  keyup: (e: KeyboardEvent) => void
  click: (e: MouseEvent) => void
  pointerdown?(e: PointerEvent): void
  mousedown?(e: MouseEvent): void
  pointerup?(e: PointerEvent): void
  dragstart?(e: DragEvent): void
}


class PressEvent implements IPressEvent {
  type: IPressEvent['type'];
  pointerType: PointerType;
  target: Element;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  #shouldStopPropagation = true;

  constructor(type: IPressEvent['type'], pointerType: PointerType, originalEvent: EventBase) {
    this.type = type;
    this.pointerType = pointerType;
    this.target = originalEvent.currentTarget as Element;
    this.shiftKey = originalEvent.shiftKey;
    this.metaKey = originalEvent.metaKey;
    this.ctrlKey = originalEvent.ctrlKey;
    this.altKey = originalEvent.altKey;
  }

  continuePropagation() {
    this.#shouldStopPropagation = false;
  }

  get shouldStopPropagation() {
    return this.#shouldStopPropagation;
  }
}

export function usePress(props: PressOptions,listeners?:Record<string,Function|Function[]>): PressResult {

  const { onPressStart, onPressChange, onPressEnd, onPress, preventFocusOnPress, isDisabled, shouldCancelOnPointerExit, onPressUp } = props
  const isPressed = ref(false)

  const {addGlobalListener,removeAllGlobalListeners } = useGlobalListeners()

  const state: PressState = {
    isPressed: false,
    ignoreEmulatedMouseEvents: false,
    ignoreClickAfterPress: false,
    didFirePressStart: false,
    activePointerId: null,
    target: null,
    isOverTarget: false,
    pointerType: null
  }

  const cancel = (e: EventBase) => {
    if (state.isPressed) {
      if (state.isOverTarget) {
        triggerPressEnd(createEvent(state.target!, e), state.pointerType!, false);
      }
      state.isPressed = false;
      state.isOverTarget = false;
      state.activePointerId = null;
      state.pointerType = null;
      removeAllGlobalListeners();
    }
  }

  const cancelOnPointerExit = (e: EventBase) => {
    if (shouldCancelOnPointerExit) {
      cancel(e);
    }
  }

  const triggerPressStart = (originalEvent: EventBase, pointerType: PointerType) => {

    if (isDisabled || state.didFirePressStart) {
      return false;
    }

    let shouldStopPropagation = true;
    if (onPressStart) {
      const event = new PressEvent('pressstart', pointerType, originalEvent);
      onPressStart(event);
      shouldStopPropagation = event.shouldStopPropagation;
    }

    if (onPressChange) {
      onPressChange(true);
    }

    state.didFirePressStart = true;
    isPressed.value = true
    return shouldStopPropagation;
  };

  const triggerPressEnd = (originalEvent: EventBase, pointerType: PointerType, wasPressed = true) => {
    if (!state.didFirePressStart) {
      return false;
    }

    state.ignoreClickAfterPress = true;
    state.didFirePressStart = false;

    let shouldStopPropagation = true;
    if (onPressEnd) {
      const event = new PressEvent('pressend', pointerType, originalEvent);
      onPressEnd(event);
      shouldStopPropagation = event.shouldStopPropagation;
    }

    if (onPressChange) {
      onPressChange(false);
    }

    isPressed.value = false
    if (onPress && wasPressed && !isDisabled) {
      const event = new PressEvent('press', pointerType, originalEvent);
      onPress(event);
      shouldStopPropagation &&= event.shouldStopPropagation;
    }

    return shouldStopPropagation;
  };

  const triggerPressUp = (originalEvent: EventBase, pointerType: PointerType) => {
    if (isDisabled) {
      return false;
    }

    if (onPressUp) {
      const event = new PressEvent('pressup', pointerType, originalEvent);
      onPressUp(event);
      return event.shouldStopPropagation;
    }

    return true;
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (state.isPressed && isValidKeyboardEvent(e, state.target!)) {
      if (shouldPreventDefaultKeyboard(e.target as Element, e.key)) {
        e.preventDefault();
      }
      e.stopPropagation();

      state.isPressed = false;
      const target = e.target as Element;
      triggerPressEnd(createEvent(state.target!, e as any), 'keyboard', (state.target as any)?.contains(target));
      removeAllGlobalListeners();
      // If the target is a link, trigger the click method to open the URL,
      // but defer triggering pressEnd until onClick event handler.
      if (state.target instanceof HTMLElement && state.target.contains(target) && (isHTMLAnchorLink(state.target) || state.target.getAttribute('role') === 'link')) {
        state.target.click();
      }
    }
  };
  // Safari on iOS < 13.2 does not implement pointerenter/pointerleave events correctly.
  // Use pointer move events instead to implement our own hit testing.
  // See https://bugs.webkit.org/show_bug.cgi?id=199803
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== state.activePointerId) {
      return;
    }

    if (isOverTarget(e, state.target as Element)) {
      if (!state.isOverTarget) {
        state.isOverTarget = true;
        triggerPressStart(createEvent(state.target!, e as any), state.pointerType!);
      }
    } else if (state.isOverTarget) {
      state.isOverTarget = false;
      triggerPressEnd(createEvent(state.target!, e as EventBase), state.pointerType!, false);
      cancelOnPointerExit(e as EventBase);
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerId === state.activePointerId && state.isPressed && e.button === 0) {
      if (isOverTarget(e, state.target as Element)) {
        triggerPressEnd(createEvent(state.target!, e as EventBase), state.pointerType!);
      } else if (state.isOverTarget) {
        triggerPressEnd(createEvent(state.target!, e as EventBase), state.pointerType!, false);
      }

      state.isPressed = false;
      state.isOverTarget = false;
      state.activePointerId = null;
      state.pointerType = null;
      
      removeAllGlobalListeners();
    }
  };

  const pressProps: PressProps = {
    keydown(e) {
      if (isValidKeyboardEvent(e, e.currentTarget!) && (e.currentTarget as any)?.contains(e.target as Element)) {
        if (shouldPreventDefaultKeyboard(e.target as Element, e.key)) {
          e.preventDefault();
        }
        e.stopPropagation();

        // If the event is repeating, it may have started on a different element
        // after which focus moved to the current element. Ignore these events and
        // only handle the first key down event.
        const shouldStopPropagation = true;
        if (!state.isPressed && !e.repeat) {
          state.target = e.currentTarget;
          state.isPressed = true;
          triggerPressStart(e as any, 'keyboard');

          // Focus may move before the key up event, so register the event on the document
          // instead of the same element where the key down event occurred.
          addGlobalListener(document, 'keyup', onKeyUp,false)
        }

        if (shouldStopPropagation) {
          e.stopPropagation();
        }
      } else if (e.key === 'Enter' && isHTMLAnchorLink(e.currentTarget as Element)) {
        // If the target is a link, we won't have handled this above because we want the default
        // browser behavior to open the link when pressing Enter. But we still need to prevent
        // default so that elements above do not also handle it (e.g. table row).
        e.stopPropagation();
      }
    },
    keyup(e) {
      if (isValidKeyboardEvent(e, e.currentTarget!) && !e.repeat && (e.currentTarget as any).contains(e.target as Element)) {
        triggerPressUp(createEvent(state.target!, e as EventBase), 'keyboard');
      }
    },
    click(e) {
      if (e && !(e.currentTarget as any).contains(e.target as Element)) {
        return;
      }
      if (e && e.button === 0) {
        let shouldStopPropagation = true;
        if (isDisabled) {
          e.preventDefault();
        }

        // If triggered from a screen reader or by using element.click(),
        // trigger as if it were a keyboard click.
        if (!state.ignoreClickAfterPress && !state.ignoreEmulatedMouseEvents && (state.pointerType === 'virtual' || isVirtualClick(e))) {
          // Ensure the element receives focus (VoiceOver on iOS does not do this)
          if (!isDisabled && !preventFocusOnPress) {
            focusWithoutScrolling(e.currentTarget as any);
          }

          const stopPressStart = triggerPressStart(e as EventBase, 'virtual');
          const stopPressUp = triggerPressUp(e as EventBase, 'virtual');
          const stopPressEnd = triggerPressEnd(e as EventBase, 'virtual');
          shouldStopPropagation = stopPressStart && stopPressUp && stopPressEnd;
        }

        state.ignoreEmulatedMouseEvents = false;
        state.ignoreClickAfterPress = false;
        if (shouldStopPropagation) {
          e.stopPropagation();
        }
      }
    }
  }

  if (typeof PointerEvent !== 'undefined') {
    pressProps.pointerdown = (e) => {
      // Only handle left clicks, and ignore events that bubbled through portals.
      if (e.button !== 0 || !(e.currentTarget as any).contains(e.target as Element)) {
        return;
      }
      // iOS safari fires pointer events from VoiceOver with incorrect coordinates/target.
      // Ignore and let the onClick handler take care of it instead.
      // https://bugs.webkit.org/show_bug.cgi?id=222627
      // https://bugs.webkit.org/show_bug.cgi?id=223202
      if (isVirtualPointerEvent(e)) {
        state.pointerType = 'virtual';
        return;
      }

      // Due to browser inconsistencies, especially on mobile browsers, we prevent
      // default on pointer down and handle focusing the pressable element ourselves.
      if (shouldPreventDefault(e.currentTarget as Element)) {
        e.preventDefault();
      }

      state.pointerType = e.pointerType as PointerType;

      let shouldStopPropagation = true;
      if (!state.isPressed) {
        state.isPressed = true;
        state.isOverTarget = true;
        state.activePointerId = e.pointerId;
        state.target = e.currentTarget;

        if (!isDisabled && !preventFocusOnPress) {
          focusWithoutScrolling(e.currentTarget as any);
        }

        shouldStopPropagation = triggerPressStart(e as any, state.pointerType);
        addGlobalListener(document, 'pointermove', onPointerMove,false);
        addGlobalListener(document, 'pointerup', onPointerUp,false);
        addGlobalListener(document, 'pointercancel', cancel as any,false);
      }
    }

    pressProps.mousedown = (e) => {
      console.log('mousedown',e)
      if (!(e.currentTarget as any).contains(e.target as Element)) {
        return;
      }
      if (e.button === 0) {
        // Chrome and Firefox on touch Windows devices require mouse down events
        // to be canceled in addition to pointer events, or an extra asynchronous
        // focus event will be fired.
        if (shouldPreventDefault(e.currentTarget as Element)) {
          e.preventDefault();
        }

        e.stopPropagation();
      }
    }

    pressProps.pointerup = (e) => {
      // iOS fires pointerup with zero width and height, so check the pointerType recorded during pointerdown.
      if (!(e.currentTarget as any).contains(e.target as Element) || state.pointerType === 'virtual') {
        return;
      }

      // Only handle left clicks
      // Safari on iOS sometimes fires pointerup events, even
      // when the touch isn't over the target, so double check.
      if (e.button === 0 && isOverTarget(e, e.currentTarget as Element)) {
        triggerPressUp(e as any, state.pointerType! || e.pointerType);
      }
    };

    pressProps.dragstart = (e) => {
      if (!(e.currentTarget as any).contains(e.target as Element)) {
        return;
      }

      // Safari does not call onPointerCancel when a drag starts, whereas Chrome and Firefox do.
      cancel(e as EventBase);
    }

  }

  return {
    isPressed,
    pressProps:mergeEvents(pressProps,listeners)
  }
}


interface Rect {
  top: number,
  right: number,
  bottom: number,
  left: number
}
function getPointClientRect(point: any): Rect {
  const offsetX = (point.width / 2) || point.radiusX || 0;
  const offsetY = (point.height / 2) || point.radiusY || 0;

  return {
    top: point.clientY - offsetY,
    right: point.clientX + offsetX,
    bottom: point.clientY + offsetY,
    left: point.clientX - offsetX
  };
}
function areRectanglesOverlapping(a: Rect, b: Rect) {
  // check if they cannot overlap on x axis
  if (a.left > b.right || b.left > a.right) {
    return false;
  }
  // check if they cannot overlap on y axis
  if (a.top > b.bottom || b.top > a.bottom) {
    return false;
  }
  return true;
}
function isOverTarget(point: PointerEvent, target: Element) {
  const rect = target.getBoundingClientRect();
  const pointRect = getPointClientRect(point);
  return areRectanglesOverlapping(rect, pointRect);
}

function shouldPreventDefault(target: Element) {
  // We cannot prevent default if the target is a draggable element.
  return !(target instanceof HTMLElement) || !target.draggable;
}


function createEvent(target: EventTarget, e: EventBase): EventBase {
  return {
    currentTarget: target,
    shiftKey: e.shiftKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey
  };
}


function shouldPreventDefaultKeyboard(target: Element, key: string) {
  if (target instanceof HTMLInputElement) {
    return !isValidInputKey(target, key);
  }

  if (target instanceof HTMLButtonElement) {
    return target.type !== 'submit';
  }

  return true;
}

function isHTMLAnchorLink(target: Element): boolean {
  return target.tagName === 'A' && target.hasAttribute('href');
}


function isValidKeyboardEvent(event: KeyboardEvent, currentTarget: EventTarget): boolean {
  const { key, code } = event;
  const element = currentTarget as HTMLElement;
  const role = element.getAttribute('role');
  // Accessibility for keyboards. Space and Enter only.
  // "Spacebar" is for IE 11
  return (
    (key === 'Enter' || key === ' ' || key === 'Spacebar' || code === 'Space') &&
    !(
      (element instanceof HTMLInputElement && !isValidInputKey(element, key))
      ||
      element instanceof HTMLTextAreaElement
      ||
      element.isContentEditable
    )
    &&
    // A link with a valid href should be handled natively,
    // unless it also has role='button' and was triggered using Space.
    (!isHTMLAnchorLink(element) || (role === 'button' && key !== 'Enter'))
    &&
    // An element with role='link' should only trigger with Enter key
    !(role === 'link' && key !== 'Enter')
  );
}

const nonTextInputTypes = new Set([
  'checkbox',
  'radio',
  'range',
  'color',
  'file',
  'image',
  'button',
  'submit',
  'reset'
]);

/**
 * Checks if the input key is valid for a given target element.
 *
 * @param {HTMLInputElement} target - The target element.
 * @param {string} key - The input key to be checked.
 * @return {boolean} Returns true if the input key is valid, false otherwise.
 */
function isValidInputKey(target: HTMLInputElement, key: string) {
  // Only space should toggle checkboxes and radios, not enter.
  return target.type === 'checkbox' || target.type === 'radio'
    ? key === ' '
    : nonTextInputTypes.has(target.type);
}
