import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const cachedComponents = ref(new Set())
const visitHistory = ref([]) // 记录访问历史

export function useKeepAlive() {
  const router = useRouter()
  
  // 计算当前需要缓存的组件列表
  const keepAliveComponents = computed(() => {
    return Array.from(cachedComponents.value)
  })
  
  // 处理路由变化
  const handleRouteChange = (to, from) => {
    if (!from) {
      // 首次进入应用，如果页面需要缓存就直接缓存
      if (to.meta?.keepAlive) {
        cachedComponents.value.add(to.name)
      }
      visitHistory.value = [{ name: to.name, path: to.path, depth: to.meta?.depth || 1 }]
      return
    }
    
    // 更新访问历史
    visitHistory.value.push({ 
      name: to.name, 
      path: to.path, 
      depth: to.meta?.depth || 1 
    })
    
    // 保持历史记录在合理范围内
    if (visitHistory.value.length > 20) {
      visitHistory.value = visitHistory.value.slice(-10)
    }
    
    // 处理缓存逻辑
    handleCacheLogic(to, from)
    
    console.log('当前缓存:', Array.from(cachedComponents.value))
    console.log('访问历史:', visitHistory.value.map(h => h.name))
  }
  
  // 核心缓存逻辑
  const handleCacheLogic = (to, from) => {
    // 1. 如果目标页面需要缓存，立即缓存
    if (to.meta?.keepAlive) {
      cachedComponents.value.add(to.name)
      console.log(`缓存页面: ${to.name}`)
    }
    
    // 2. 处理特殊的清理逻辑
    const toDepth = to.meta?.depth || 1
    const fromDepth = from.meta?.depth || 1
    
    // 2.1 如果有明确的清理规则
    if (to.meta?.clearCache) {
      handleClearCache(to.meta.clearCache, to, from)
    }
    
    // 2.2 默认清理规则：返回到较浅层级时，清理更深层级的缓存
    if (toDepth < fromDepth) {
      clearDeeperCache(toDepth)
    }
    
    // 2.3 特殊规则：返回到根页面时的处理
    if (toDepth === 1 && to.meta?.clearOnRootEntry) {
      cachedComponents.value.delete(to.name)
      console.log(`根页面重新进入，清理缓存: ${to.name}`)
    }
  }
  
  // 处理自定义清理规则
  const handleClearCache = (clearRule, to, from) => {
    if (typeof clearRule === 'function') {
      // 自定义函数
      const shouldClear = clearRule(to, from, visitHistory.value)
      if (shouldClear) {
        const toClear = Array.isArray(shouldClear) ? shouldClear : [to.name]
        toClear.forEach(name => {
          cachedComponents.value.delete(name)
          console.log(`自定义清理: ${name}`)
        })
      }
    } else if (Array.isArray(clearRule)) {
      // 清理指定页面
      clearRule.forEach(name => {
        cachedComponents.value.delete(name)
        console.log(`指定清理: ${name}`)
      })
    }
  }
  
  // 清理更深层级的缓存
  const clearDeeperCache = (currentDepth) => {
    const allRoutes = router.getRoutes()
    const toClear = []
    allRoutes.forEach(route => {
      const routeDepth = route.meta?.depth || 1
      if (routeDepth > currentDepth && route.name && cachedComponents.value.has(route.name)) {
        toClear.push(route.name)
      }
    })
    
    toClear.forEach(name => {
      cachedComponents.value.delete(name)
      console.log(`深度清理: ${name}`)
    })
  }

  
  // 手动清理缓存
  const clearCache = (componentName) => {
    cachedComponents.value.delete(componentName)
  }
  
  // 清理所有缓存
  const clearAllCache = () => {
    cachedComponents.value.clear()
    visitHistory.value = []
  }
  
  return {
    keepAliveComponents,
    handleRouteChange,
    clearCache,
    clearAllCache,
  }
}

/**
 * const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/page-a',
      name: 'PageA',
      component: () => import('@/views/PageA.vue'),
      meta: { 
        depth: 1,
        keepAlive: false
      }
    },
    {
      path: '/page-b',
      name: 'PageB', 
      component: () => import('@/views/PageB.vue'),
      meta: { 
        depth: 2,
        keepAlive: true,
        clearOnRootEntry: true // 从根页面重新进入时清理缓存
      }
    },
    {
      path: '/page-c',
      name: 'PageC',
      component: () => import('@/views/PageC.vue'), 
      meta: { 
        depth: 3,
        keepAlive: false
      }
    },
    {
      path: '/page-d',
      name: 'PageD',
      component: () => import('@/views/PageD.vue'),
      meta: { 
        depth: 1, // 同样是根级页面
        keepAlive: true, // 但需要缓存
        clearCache: (to, from, history) => {
          // 自定义清理逻辑：如果从其他根页面进入，不清理；如果是深层返回，清理
          const fromDepth = from.meta?.depth || 1
          return fromDepth > 2 // 只有从很深的页面返回才清理
        }
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: { 
        depth: 1,
        keepAlive: true, // 个人中心需要缓存
        // 不设置任何清理规则，始终保持缓存
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: { 
        depth: 2,
        keepAlive: true,
        clearCache: ['PageB', 'PageD'] // 进入设置页面时清理特定页面
      }
    }
  ]
})

 */