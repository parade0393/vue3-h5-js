<script setup>
import { computed } from 'vue'
const props = defineProps({
  modelValue: {
    required: true,
    default() {
      return []
    }
  },
  uploadApi: {
    required: true,
    type: Function
  },
  handlerResponse: {
    required: true,
    type: Function
  },
  field: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])

const fileList = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const uploadImageToServer = (file) => {
  let govId = sessionStorage.getItem('govId')
  let userInfoUser = JSON.parse(sessionStorage.getItem('userInfo'))
  let formData = new FormData()
  formData.append('file', file.file)
  formData.append('govId', govId)
  formData.append('guid', 'wu_1fvepbekmth21i8g1u321emkuve0' + file.file.size)
  formData.append('type', 1)
  formData.append('deptId', userInfoUser.departId)
  formData.append('uploadPersonPhone', userInfoUser.mobile)
  formData.append('uploadPersonName', userInfoUser.name)
  formData.append('tags', 0)
  formData.append('name', file.name)
  formData.append('lastModifiedDate', new Date())
  formData.append('size', file.file.size)
  props
    .uploadApi(formData)
    .then((res) => {
      file.status = 'success'
      file.message = '上传成功'
      file.imgUrl = props.handlerResponse(res)
    })
    .catch(() => {
      file.status = 'failed'
      file.message = '上传失败'
    })
}
const afterRead = (file) => {
  file.status = 'uploading'
  file.message = '上传中...'
  uploadImageToServer(file)
}
const beforeRead = () => {
  return true
}
</script>

<template>
  <van-uploader
    v-model="fileList"
    accept="*"
    :before-read="beforeRead"
    :max-count="9"
    :after-read="afterRead"
    v-bind="field.childProps"
  >
    <div class="upload-button">
      <img src="@/assets/a.svg" alt="" srcset="" />
      <div>附件上传</div>
    </div>
  </van-uploader>
</template>

<style lang="less" scoped>
.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--van-uploader-size);
  height: var(--van-uploader-size);
  overflow: hidden;
  img {
    width: 70%;
  }
}
</style>
