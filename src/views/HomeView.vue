<script setup>
import {showToast} from "vant"
function showToastTip(){
  showToast({
    message:"提示地方"
  })
}
</script>

<template>
  <main class="wrapper">
    <div class="header">
      <van-button @click="showToastTip" type="primary">点击测试</van-button>
    </div>
  </main>
</template>
<style lang="less" scoped>

</style>
