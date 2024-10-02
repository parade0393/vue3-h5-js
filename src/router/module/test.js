export default [
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/form/testForm.vue'),
    meta:{
      title: '测试表单'
    }
  }
]
