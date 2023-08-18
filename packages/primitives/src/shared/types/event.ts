export type PointerType = 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';


export interface PressEvent {
  /** The type of press event being fired. */
  type: 'pressstart' | 'pressend' | 'pressup' | 'press',
  /** The pointer type that triggered the press event. */
  pointerType: PointerType,
  /** The target element of the press event. */
  target: Element,
  /** Whether the shift keyboard modifier was held during the press event. */
  shiftKey: boolean,
  /** Whether the ctrl keyboard modifier was held during the press event. */
  ctrlKey: boolean,
  /** Whether the meta keyboard modifier was held during the press event. */
  metaKey: boolean,
  /** Whether the alt keyboard modifier was held during the press event. */
  altKey: boolean
}

export interface PressEvents {
  /** Handler that is called when the press is released over the target. */
  onPress?: (e: PressEvent) => void,
  /** Handler that is called when a press interaction starts. */
  onPressStart?: (e: PressEvent) => void,
  /**
   * Handler that is called when a press interaction ends, either
   * over the target or when the pointer leaves the target.
   */
  onPressEnd?: (e: PressEvent) => void,
  /** Handler that is called when the press state changes. */
  onPressChange?: (isPressed: boolean) => void,
  /**
   * Handler that is called when a press is released over the target, regardless of
   * whether it started on the target or not.
   */
  onPressUp?: (e: PressEvent) => void
}
