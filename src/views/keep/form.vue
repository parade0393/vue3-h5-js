<script lang="ts" setup>
defineOptions({
  name: 'keepForm'
})
import { reactive } from 'vue'
const formData = reactive({
  name: '',
  age: null,
  email: ''
})
</script>

<template>
  <div style="padding: 16px;">
    <van-form>
      <van-field v-model="formData.name" label="姓名" placeholder="请输入姓名" />
      <van-field v-model="formData.age" readonly label="年龄" type="number" placeholder="请输入年龄" />
    </van-form>
    <van-button type="primary" @click="$router.push('/keep/select')">跳转到选择页面</van-button>

    <van-button type="primary" @click="$router.back()">返回到首页</van-button>
  </div>
</template>

<style lang="less" scoped></style>
