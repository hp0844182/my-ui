<script setup lang="ts">
import { ref } from 'vue';
const events = ref<any>([])
import { useFocus } from './interactions/useFocus';
import { usePress } from './interactions/usePress';

const {isPressed,pressProps} = usePress({
  onPress(e){
    console.log('e',e)
  }
})
const handleClck = (e:MouseEvent) => {
  console.log('e',e.currentTarget)
}
</script>

<template>
  <div>
    <button
      type="button"
      v-on="pressProps"
      @click="handleClck"
    >
      {{ isPressed }}
    </button>
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
