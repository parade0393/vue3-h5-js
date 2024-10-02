<script setup>
import AddBaseForm from './AddBaseForm.vue';
import { formConfig } from './config/textFormConfig';

const onSubmit = (value) => {};
</script>

<template>
  <AddBaseForm :config="formConfig" input-align="right" @onSubimitComplete="onSubmit">
    <template #slider="config">
      <van-slider v-model="config.formData[config.field.name]" v-bind="config.field.props">
        <template #button>
          <div class="custom-button">{{ config.formData[config.field.name] }}</div>
        </template>
      </van-slider>
    </template>
  </AddBaseForm>
</template>

<style lang="scss" scoped></style>
