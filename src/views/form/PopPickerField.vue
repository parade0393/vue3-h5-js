<script setup>
import { ref, computed } from 'vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  rules: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const showPicker = ref(false)

const onConfirm = (value) => {
  if (Array.isArray(value)) {
    fieldValue.value = value.join(',')
  } else {
    fieldValue.value = value
  }

  showPicker.value = false
}
const showPick = () => {
  showPicker.value = true
}
</script>

<template>
  <div>
    <van-field
      v-model="fieldValue"
      v-show="field.show"
      :label="field.label"
      :placeholder="field.placeholder"
      :type="field.type"
      v-bind="field.props"
      :rules="rules"
      @click="showPick"
    />
    <van-popup v-model:show="showPicker" v-bind="field.childProps">
      <van-picker
        :title="field.label"
        :columns="field.options"
        @confirm="onConfirm"
        @cancel="showPicker = false"
        v-bind="field.nestChildProps"
      ></van-picker>
    </van-popup>
  </div>
</template>

<style lang="less" scoped></style>
