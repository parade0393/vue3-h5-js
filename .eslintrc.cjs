/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  // rules 的规则配置有三种：
  // off 或 0 关闭对该规则的校验
  // warn 或 1 启用规则，不满足时抛出警告，不会退出编译进程
  // error 或 2 启用规则，不满足时抛出错误，会退出编译进程
  rules: {
    semi: 0, // 禁止尾部使用分号
    "no-debugger": "warn", // 禁止出现 debugger
    'vue/multi-word-component-names': [//vue组件名称必须使用多单词
      'error',
      {
        ignores: ['Index', 'Header']//允许的组件名称
      }
    ]
  },
}
