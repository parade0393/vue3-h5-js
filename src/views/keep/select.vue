<script lang="ts" setup>
import { reactive } from 'vue'
const formData = reactive({
  name: '',
  age: null,
  email: ''
})
</script>

<template>
  <div style="padding: 16px;">
    选择页面
    <van-field v-model="formData.name" label="返回数据" placeholder="请输入返回数据" />
    <van-button type="primary" @click="$router.back()">返回到表单页面</van-button>
  </div>
</template>

<style lang="less" scoped></style>
