<script setup lang="ts">
import Button from '@/components/button/button.vue';

const onPress = (e:any) => {
  console.log('onPress',e)
}
const onPressStart = (e)=>{
  console.log('onPressStart',e)
}
const onPressEnd = (e)=>{
  console.log('onPressEnd',e)
}
const onPressUp = (e)=>{
  console.log('onPressUp',e)
}
const onPressChange = (e)=>{
  console.log('onPressChange',e)
}
</script>

<template>
  <div>
    <Button
      as="button"
      @press="onPress"
      @press-start="onPressStart"
      @press-end="onPressEnd"
      @press-change="onPressChange"
      @press-up="onPressUp"
    >
      <!-- @press="onPress" -->
      <!-- @click="handleClick" -->
      button
    </Button>
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
