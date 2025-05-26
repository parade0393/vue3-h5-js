export default[
    {
        path:"/keep",
        name:"keep",
        component: () => import('@/views/keep/index.vue'),
        meta: {
            title: 'KeepAlive',
            depth:1,
        },
    },
    {
        path:"/keep/form",
        name:"keepForm",
        component: () => import('@/views/keep/form.vue'),
        meta: {
            title: 'KeepAlive-Form',
            keepAlive: true,
            showIndex: false,
            depth:2,
            // clearOnBack: true // 返回到更浅层级时清除缓存
        },
    },
    {
        path:"/keep/select",
        name:"keepSelect",
        component: () => import('@/views/keep/select.vue'), 
        meta: {
            title: 'KeepAlive-Select',
            showIndex: false,
            depth:3,
        },
    }
]