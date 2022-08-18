<template>
<teleport to="body">
  <div class="alert" v-if="visible">
    <a class="close" @click.prevent="visible=false" href="#">X</a>
    <div class="title">{{title}}</div>
    <div class="message">
      {{message}}
    </div>
  </div>
</teleport>
</template>

<script setup>
  import { ref } from 'vue';

  defineProps({
    title: '',
    message: '',
  })

  const visible = ref(false)

  const show = () => {
    visible.value = true
  }

  defineExpose({
    show
  })
</script>

<style scoped>
  .alert {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 300px;
    height: 160px;
    background: rgba(255,255,255,1);
    border: 2px solid #ccc;
    padding: 20px;
    border-radius: 15px;
  }
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .message {
    padding: 25px;
  }
</style>