import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

type RouteBeforeAuth = (to:RouteLocationNormalized, from:RouteLocationNormalized, next:NavigationGuardNext) => boolean | void

const noAuthRoutes:string[] = ['Login']

const Auth:RouteBeforeAuth = (to, from, next) => {
  if (!noAuthRoutes.includes(to.name as string)) {
    const token = window.localStorage.getItem('token')
    if (token) {
      return next()
    } else {
      return next({ name: 'Login' })
    }
  } else {
    return next()
  }
}

export { Auth }
