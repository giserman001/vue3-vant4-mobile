import 'vue-router'

// 扩展路由 meta 类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    keepAlive?: boolean
    hiddenHeader?: boolean
    hideBreadcrumb?: boolean
    innerPage?: boolean
    icon?: string
    /** 是否启用路由过渡动画，默认 true，设为 false 关闭 */
    transition?: boolean
  }
}
