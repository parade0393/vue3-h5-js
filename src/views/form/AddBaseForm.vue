<script setup>
import { ref, watch, computed, reactive } from 'vue'
import { trueValue } from '@/util/common.js'
import FileAdd from './FileAdd.vue'
import PopPickerField from './PopPickerField.vue'
import PopPickerDateTime from './PopPickerDateTime.vue'
import PopPickerCalendar from './PopPickerCalendar.vue'
const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['onSubimitComplete'])

const formConfig = ref(props.config)
const formData = reactive({})
const formErrors = reactive({})

// 初始化表单数据
formConfig.value.forEach((field) => {
  formData[field.name] = trueValue(field.defaultValue)
})

// 计算可见字段,field.visible返回值发生改变后，会重新计算
const visibleFields = computed(() => {
  return formConfig.value.filter((field) => {
    console.log('visibleFields')
    if (typeof field.visible === 'function') {
      return field.visible(formData)
    }
    return true
  })
})

// 验证单个字段
const validateField = (field, value) => {
  console.log('validateField')

  if (field.rules) {
    for (let rule of field.rules) {
      if (!rule.validator(value, formData)) {
        formErrors[field.name] = rule.message
        return rule.message
      }
    }
  }
  delete formErrors[field.name]
  return true
}

// 验证所有可见字段
const validateAllFields = () => {
  console.log('validateAllFields')

  visibleFields.value.forEach((field) => {
    validateField(field, formData[field.name])
  })
}

// 处理字段变化
const onChange = (fieldName) => {
  console.log('onChange')

  const changedField = formConfig.value.find((field) => field.name === fieldName)
  if (changedField && changedField.dependencies) {
    changedField.dependencies.forEach((dep) => {
      const depField = formConfig.value.find((field) => field.name === dep.field)
      if (depField) {
        formData[dep.field] = dep.getValue(formData[fieldName], formData)
      }
    })
  }
  validateAllFields()
}

// 监听表单数据变化
watch(
  formData,
  () => {
    console.log('watch formData')

    validateAllFields()
  },
  { deep: true }
)

// 监听配置变化
watch(
  () => props.config,
  (newConfig) => {
    console.log('props config')

    formConfig.value = newConfig
    // 更新表单数据，保留已有值
    newConfig.forEach((field) => {
      if (!(field.name in formData)) {
        formData[field.name] = trueValue(field.defaultValue)
      }
    })
    validateAllFields()
  }
)

const eventHandlersCache = new Map() //缓存每个字段配置的事件

const generateEventHandlers = (field) => {
  if (!eventHandlersCache.has(field.name)) {
    const handlers = {}
    if (field.events) {
      //配置了events字段
      for (const [eventName, handler] of Object.entries(field.events)) {
        handlers[eventName] = createHandler(handler, field)
      }
    }
    if (field.listenChange) {
      handlers['update:modelValue'] = createHandler(onChange, field)
    }
    eventHandlersCache.set(field.name, handlers)
  }

  return eventHandlersCache.get(field.name)
}

const createHandler = (handler, eventField) => {
  return (...args) => {
    const field = visibleFields.value.find((f) => f.name === eventField.name)
    if (field && field.show) {
      const currentValue = formData[field.name]
      handler.call(this, currentValue, formData, args)
    }
    if (eventField.listenChange) {
      handler.call(this, eventField.name)
    }
  }
}

const onSubmit = () => {
  validateAllFields()
  if (Object.keys(formErrors).length > 0) {
    console.error('表单验证失败', formErrors)
    return
  }

  let submitValue = {}
  visibleFields.value.forEach((el) => {
    submitValue[el.name] = formData[el.name]
  })
  console.log(submitValue)
  emits('onSubimitComplete', submitValue)
}
</script>

<template>
  <van-form @submit="onSubmit">
    <template v-for="(field, index) in visibleFields" :key="index">
      <van-field
        v-if="field.type === 'input'"
        v-show="field.show"
        v-model="formData[field.name]"
        :label="field.label"
        :placeholder="field.placeholder"
        :rules="[{ validator: (val) => validateField(field, val) }]"
        :type="field.type"
        v-bind="field.props"
        v-on="generateEventHandlers(field)"
      />

      <!-- 时间选择 -->
      <pop-picker-date-time
        :rules="[{ validator: (val) => validateField(field, val) }]"
        v-else-if="field.type === 'dateTime'"
        :field="field"
        v-model="formData[field.name]"
        v-show="field.show"
      />

      <!-- 上传附件 -->
      <pop-picker-field
        :rules="[{ validator: (val) => validateField(field, val) }]"
        v-else-if="field.type === 'picker'"
        :field="field"
        v-model="formData[field.name]"
        v-show="field.show"
      />

      <!-- 日历 -->
      <pop-picker-calendar
        :rules="[{ validator: (val) => validateField(field, val) }]"
        v-else-if="field.type === 'calendar'"
        :field="field"
        v-model="formData[field.name]"
        v-show="field.show"
      />

      <van-field
        v-else
        v-show="field.show"
        :label="field.label"
        :placeholder="field.placeholder"
        :rules="[{ validator: (val) => validateField(field, val) }]"
        v-bind="field.props"
        :type="field.type"
      >
        <!-- 单选 -->
        <template #input v-if="field.type === 'radio-group'">
          <van-radio-group
            v-model="formData[field.name]"
            v-on="generateEventHandlers(field)"
            v-bind="field.childProps"
          >
            <van-radio
              v-for="option in field.options"
              :key="option.name"
              :name="option.value"
              v-bind="option.nestChildProps"
            >
              {{ option.label }}
            </van-radio>
          </van-radio-group>
        </template>
        <!-- 多选组 -->
        <template #input v-else-if="field.type === 'checkbox-group'">
          <van-checkbox-group
            v-model="formData[field.name]"
            v-on="field.listenChange ? { 'update:modelValue': () => onChange(field.name) } : {}"
            v-bind="field.childProps"
          >
            <van-checkbox
              v-for="option in field.options"
              :key="option.value"
              :name="option.value"
              v-bind="option.props"
            >
              {{ option.label }}
            </van-checkbox>
          </van-checkbox-group>
        </template>
        <!-- 多选 -->
        <template #input v-else-if="field.type === 'checkbox'">
          <van-checkbox
            v-model="formData[field.name]"
            v-on="field.listenChange ? { 'update:modelValue': () => onChange(field.name) } : {}"
            v-bind="field.childProps"
          />
        </template>
        <!-- 开关 -->
        <template #input v-else-if="field.type == 'switch'">
          <van-switch
            v-model="formData[field.name]"
            v-on="field.listenChange ? { 'update:modelValue': () => onChange(field.name) } : {}"
            v-bind="field.childProps"
          />
        </template>
        <!-- 步进器 -->
        <template #input v-else-if="field.type == 'stepper'">
          <van-stepper
            v-model="formData[field.name]"
            v-on="field.listenChange ? { 'update:modelValue': () => onChange(field.name) } : {}"
            v-bind="field.childProps"
          />
        </template>
        <!-- 评分 -->
        <template #input v-else-if="field.type == 'rate'">
          <van-rate
            v-model="formData[field.name]"
            v-on="field.listenChange ? { 'update:modelValue': () => onChange(field.name) } : {}"
            v-bind="field.childProps"
          />
        </template>
        <!-- 滑块 -->
        <template #input v-else-if="field.type == 'slider'">
          <slot name="slider" :field="field" :formData="formData" :onChange="onChange">
            <van-slider
              v-model="formData[field.name]"
              v-bind="field.childProps"
              v-on="field.listenChange ? { 'update:modelValue': () => onChange(field.name) } : {}"
            />
          </slot>
        </template>
        <template #input v-else-if="field.type === 'file'">
          <slot :name="field.type" :field="field" :formData="formData" :onChange="onChange">
            <file-add
              :field="field"
              v-model="formData[field.name]"
              :uploadApi="field.uploadApi"
              :handlerResponse="field.handlerResponse"
            />
          </slot>
        </template>
        <template #input v-else>
          <slot :name="field.name" :field="field" :formData="formData" :onChange="onChange"></slot>
        </template>
      </van-field>
    </template>

    <div style="margin: 16px">
      <slot name="submit">
        <van-button round block type="primary" native-type="submit">提交</van-button>
      </slot>
    </div>
  </van-form>
</template>

<style lang="less" scoped></style>
