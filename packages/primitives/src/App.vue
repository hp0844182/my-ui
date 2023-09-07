<script setup lang="ts">
import Button from '@/components/button/button.vue';
import { Motion,Presence,PresenceGroup } from '@/components/motion';
import { ref } from 'vue';

const show = ref(true)
const onPress = (e:any) => {
  // console.log('onPress',e)
}
const onPressStart = (e)=>{
  // console.log('onPressStart',e)
}
const onPressEnd = (e)=>{
  // console.log('onPressEnd',e)
}
const onPressUp = (e)=>{
  // console.log('onPressUp',e)
}
const onPressChange = (e)=>{
  // console.log('onPressChange',e)
}

const old = ()=>{
  console.log('old')
}
const newE = ()=>{
  console.log('newE')
}
</script>

<template>
  <div>
    <Button
      href="https://vitejs.dev"
      color="success"
      size="sm"
      variant="shadow"
      class-name="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
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
    <div>
      <PresenceGroup>
        <Motion
          v-show="show"
          key="1"
          as="div"
          :initial="{ opacity: 0, scale: 0 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.6 }"
          class="w-24 h-24 bg-purple-400"
        />
        <Motion
          v-show="show"
          key="2"
          as="div"
          :initial="{ opacity: 0, scale: 0 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.6 }"
          class="w-24 h-24 bg-purple-400"
        />
      </PresenceGroup>
      <button>
        sss
      </button>
      <Button
        :is-loading="!show"
        spinner-placement="end"
        color="primary"
        as="div"
        @click="show?old():newE()"
        @press="show = !show"
      >
        Toggle
      </Button>
    </div>
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
