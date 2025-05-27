export default[
    {
        path:"/keep",
        name:"keep",
        component: () => import('@/views/keep/index.vue'),
        meta: {
            title: 'KeepAlive',
        },
    },
    {
        path:"/keep/form",
        name:"keepForm",
        component: () => import('@/views/keep/form.vue'),
        meta: {
            title: 'KeepAlive-Form',
            keepAlive: true,
            resetOnEnter: true, // 进入时重置
            showIndex: false,
            exceptFrom: ['keepSelect'], // 进入时不清除缓存
        },
    },
    {
        path:"/keep/select",
        name:"keepSelect",
        component: () => import('@/views/keep/select.vue'), 
        meta: {
            title: 'KeepAlive-Select',
            showIndex: false,
        },
    }
]