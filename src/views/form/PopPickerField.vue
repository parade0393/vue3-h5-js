<script setup>
import { watch } from 'vue'
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
const pickerValue = ref()

const initPickValue = (value, element, arr) => {
  const op = value.find((el) => el.text == element)
  if (op) {
    arr.push(op.value)
    if (op.children) {
      initPickValue(op.children, element, arr)
    }
  } else {
    for (const child of value) {
      if (child.children) {
        initPickValue(child.children, element, arr)
      }
    }
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    const arr = []
    if (newValue) {
      if (props.field.options.length > 0) {
        if (Array.isArray(props.field.options[0])) {
          //多列选择
          for (const element of newValue.split(',')) {
            for (const nestItem of props.field.options) {
              const op = nestItem.find((el) => el.text == element)
              if (op) {
                arr.push(op.value)
              }
            }
          }
        } else {
          for (const element of newValue.split(',')) {
            initPickValue(props.field.options, element, arr)
          }
        }
      }
    }
    pickerValue.value = arr
  },
  {
    immediate: true
  }
)
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
        v-model="pickerValue"
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
