<template>
  <el-skeleton :loading="loading" animated class="img-skeleton">
    <template #template>
      <el-skeleton-item variant="image" style="width: 100%;height: 100%"></el-skeleton-item>
    </template>
    <template #default>
      <div class="content-container relative-position">
        <img :src="imgUrl" alt="" class="img-sl" v-if="!showErrorImg">
        <div class="full-width full-height flex-row flex-jst-center flex-ali-center" v-else>
          <el-empty description="图片加载出错" :image-size="50"></el-empty>
        </div>
        <div class="preview-control flex-row flex-jst-center flex-ali-center" v-if="!showErrorImg">
          <i class="el-icon-view font-28 text-white" @click="openPreview"></i>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import urls from '@/service/urls'
export default defineComponent({
  name: 'item',
  props: {
    info: {
      type: Object
    }
  },
  setup (props, ctx) {
    const loading = ref(true)
    const showErrorImg = ref(false)
    const imgUrl = computed(() => {
      return `${urls.imgHost}${props.info?.url}`
    })
    onMounted(() => {
      const imgEle = document.createElement('img')
      imgEle.onload = () => {
        loading.value = false
      }
      imgEle.onerror = () => {
        showErrorImg.value = true
        loading.value = false
      }
      imgEle.src = imgUrl.value
    })
    const openPreview = () => {
      ctx.emit('openPreview', imgUrl.value)
    }
    return {
      openPreview,
      loading,
      imgUrl,
      showErrorImg
    }
  }
})
</script>

<style lang="scss" scoped>
.img-skeleton{
  width: 100%;
  height: 100%;
}
.content-container{
  width: 100%;
  height: 100%;
  overflow: hidden;
  .img-sl{
    width: 100%;
  }
  &:hover{
    .preview-control{
      top: 0;
    }
  }
  .preview-control{
    position: absolute;
    width: 100%;
    height: 100%;
    top: -100%;
    left: 0;
    background: rgba(0,0,0,0.5);
    transition: all .3s ease-out;
    .text-white{
      cursor: pointer;
    }
  }
}
</style>
