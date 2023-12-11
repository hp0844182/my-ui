
<script setup lang="ts">
import { PresenceGroup, Motion, Presence } from '@/components/motion';
type RippleType = {
  key: number;
  x: number;
  y: number;
  size: number;
};
interface RippleProps {
  ripples: RippleType[]
  color?: string
}
withDefaults(defineProps<RippleProps>(), {
  ripples: () => [],
  color: 'currentColor'
})

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
const getDuration = (ripple: RippleType)=>{
  return clamp(0.01 * ripple.size, 0.2, ripple.size > 100 ? 0.75 : 0.5)
}
</script>

<template>
  <PresenceGroup>
    <Motion
      v-for="ripple in ripples"
      :key="ripple.key"
      :initial="{
        transform: 'scale(0)',
        opacity: 0.35
      }"
      :styles="{
        transform: 'scale(0)',
        opacity: 0.35,
        position:'absolute',
        backgroundColor: color,
        borderRadius: '100%',
        transformOrigin:'center',
        pointerEvents:'none',
        zIndex:10,
        top:ripple.y+'px',
        left:ripple.x+'px',
        width: `${ripple.size}px`,
        height: `${ripple.size}px`,
      }"
      :data-x="ripple.x"
      :transition="{
        duration:getDuration(ripple)
      }"
      :animate="{
        transform: 'scale(2)',
        opacity: 0
      }"
      :exit="{
        opacity: 0
      }"
    />
  </PresenceGroup>
</template>
