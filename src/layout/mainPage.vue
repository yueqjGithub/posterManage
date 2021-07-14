<template>
  <div class="page flex-row flex-jst-btw flex-ali-center">
    <el-scrollbar class="cus-side bg-white">
      <el-menu
        router
        :default-active='curRouterPath'
        class="el-menu-vertical-demo">
        <el-menu-item v-for="k in menuList" :key="k.path" :index="k.path">{{k.label}}</el-menu-item>
      </el-menu>
    </el-scrollbar>
    <el-scrollbar class="bg-white cus-main flex-1 relative-position">
      <router-view v-slot:default="{ Component }">
        <transition
          enter-active-class="animate__animated animate__fadeInDownBig"
          leave-active-class="animate__animated animate__fadeOutUp"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'mainLayout',
  setup () {
    const Router = useRouter()
    const curRouterPath = ref(Router.currentRoute.value.path)
    const menuList = [
      { name: 'List', path: '/list', label: '截图列表' },
      { name: 'poster', path: '/poster', label: '海报列表' }
    ]
    return {
      curRouterPath,
      menuList
    }
  }
})
</script>

<style lang="scss" scoped>
.page{
  .cus-side{
    width: 2rem;
    margin-right: .2rem;
  }
}
</style>
