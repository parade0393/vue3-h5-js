import { ref, computed } from 'vue'

const cachedComponents = ref(new Set())
const routeStack = ref([])

export function useKeepAlive() {
  
  // 计算当前需要缓存的组件列表
  const keepAliveComponents = computed(() => {
    return Array.from(cachedComponents.value)
  })
  
  // 处理路由变化
  const handleRouteChange = (to, from) => {
    if (!from) {
      // 首次进入应用
      routeStack.value = [{ name: to.name, depth: to.meta?.depth || 1 }]
      return
    }
    
    const toDepth = to.meta?.depth || 1
    const fromDepth = from.meta?.depth || 1
    
    if (toDepth > fromDepth) {
      // 前进：只有当页面配置了keepAlive: true时才缓存
      if (to.meta?.keepAlive) {
        cachedComponents.value.add(to.name)
        console.log(`前进: ${from.name} -> ${to.name}, 缓存 ${to.name}`)
      } else {
        console.log(`前进: ${from.name} -> ${to.name}, ${to.name}不需要缓存`)
      }
      
      // 更新路由栈
      routeStack.value.push({ 
        name: to.name, 
        depth: toDepth,
        keepAlive: to.meta?.keepAlive || false
      })
      
    } else if (toDepth < fromDepth) {
      // 后退：清理比目标深度更深的页面缓存
      
      // 找出需要清理的页面（只清理那些原本被缓存的）
      const toRemove = routeStack.value.filter(route => 
        route.depth > toDepth && route.keepAlive
      )
      toRemove.forEach(route => {
        cachedComponents.value.delete(route.name)
        console.log(`清理缓存: ${route.name}`)
      })
      
      // 更新路由栈
      routeStack.value = routeStack.value.filter(route => route.depth <= toDepth)
      
      // 特殊处理：如果返回到根页面（depth=1），清除目标页面的缓存
      // 这样下次进入时就是全新状态
      if (toDepth === 1 && to.meta?.keepAlive) {
        cachedComponents.value.delete(to.name)
        console.log(`回到根级别，清理 ${to.name} 的缓存`)
      }
      
      console.log(`后退: ${from.name} -> ${to.name}`)
    }
    
    console.log('当前缓存:', Array.from(cachedComponents.value))
    console.log('路由栈:', routeStack.value)
  }
  
  // 手动清理缓存
  const clearCache = (componentName) => {
    cachedComponents.value.delete(componentName)
  }
  
  // 清理所有缓存
  const clearAllCache = () => {
    cachedComponents.value.clear()
    routeStack.value = []
  }
  
  return {
    keepAliveComponents,
    handleRouteChange,
    clearCache,
    clearAllCache
  }
}