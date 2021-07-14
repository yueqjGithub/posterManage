<template>
  <div class="router-page">
    <div class="tit-container flex-row flex-jst-btw flex-ali-end">
      <h2>海报列表</h2>
    </div>
    <div class="search-container flex-row flex-jst-btw flex-ali-center pa-col-md">
      <div class="flex-row flex-jst-start flex-ali-center">
        <div style="margin-right: .1rem">
          <el-input v-model="searchName" size="small" placeholder="请输入内容" inline></el-input>
        </div>
        <el-select v-model="curType" placeholder="请选择海报类型" size="small" clearable>
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="searchHandler" size="small" class="ma-lf-05">搜索</el-button>
        <div style="width: 4rem;margin-left: .4rem">
          <el-radio-group v-model="directRef" size="small">
            <el-radio-button v-for="k in direction_types" :key="k.value" :label="k.value">{{k.label}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog = true">添加</el-button>
    </div>
<!--    内容-->
    <div class="pa-col-md full-width flex-row flex-wrap flex-jst-start flex-ali-center" v-loading="queryLoading" :class="directRef === 1 ? 'row-list' : 'col-list'">
      <div v-for="k in list" :key="k.id" class="img-out">
        <div class="img-container">
          <img-item :info="k" @openPreview="openPreview"></img-item>
        </div>
        <div class="pa-col-sm flex-col flex-jst-start flex-ali-start name-container">
          <p class="title">{{k.pic_name}}</p>
<!--          <p></p>-->
          <div class="flex-row flex-jst-start flex-ali-center full-width">
            <p>{{k.pic_direction === 1 ? '横屏' : '竖屏'}}</p>
            <el-divider direction="vertical" v-if="k.category_id"></el-divider>
            <p>{{k.category_id ? typeList.find(item => item.value === String(k.category_id)).label : ''}}</p>
          </div>
<!--          <p>{{k.created_at}}</p>-->
        </div>
      </div>
    </div>
<!--    分页-->
    <div class="full-width flex-row flex-jst-center flex-ali-center pa-col-md">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="pageChange"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
    </div>
<!--    图片上传-->
    <el-dialog v-model="showDialog" destroy-on-close @close="closeDialog">
      <el-form :model="saveTarget" label-width="100px" label-position="right" v-loading="saveLoading" v-if="showDialog">
        <el-form-item label="方向：">
          <el-radio-group v-model="saveTarget.pic_direction">
            <el-radio v-for="k in direction_types" :key="k.value" :label="k.value">{{k.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="海报类型：">
          <el-radio-group v-model="saveTarget.category_id" size="small">
            <el-radio v-for="k in typeList" :key="k.value" :label="k.value">{{k.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片上传：">
          <h5>图片不能超过500Kb</h5>
          <div class="flex-row flex-jst-start flex-ali-start">
            <transition enter-active-class="animate__animated animate__fadeInDown" leave-active-class="animate__animated animate__fadeOutDown" mode="out-in">
              <img :src="`${imgHost}${saveTarget.url}`" alt="" v-if="saveTarget.url" class="img-pre">
              <div class="upload-control flex-row flex-jst-center flex-ali-center" v-else @click="openUpload">
                <el-button type="text" class="font-26" icon="el-icon-plus"></el-button>
              </div>
            </transition>
          </div>
          <input type="file" accept="image/*" ref="uploadInput" style="display: none;" @change="uploadHandler"/>
        </el-form-item>
        <div class="full-width flex-row flex-jst-center flex-ali-center">
          <el-button type="primary" size="small" :loading="saveLoading" :disabled="saveLoading" @click="saveHandler">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
<!--    预览区域-->
    <el-scrollbar class="preview-container flex-col flex-jst-center flex-ali-center" v-if="showPreview">
      <el-button icon="el-icon-close" type="text" class="close-preview" @click="closePreview"></el-button>
      <div class="full-width flex-row flex-jst-center flex-ali-center pa-col-md" style="min-height: 100vh">
        <img :src="previewTarget" alt="" style="max-width: 70vw">
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch, computed } from 'vue'
import { httpGet, upload, httpPost } from '@/service/http'
import urls from '@/service/urls'
import { ElMessage } from 'element-plus'
import imgItem from './item.vue'
import { useStore } from 'vuex'

type queryObj = {
  page: number
  page_size: number
  name?: string | undefined
  pic_direction: number
  pic_type: 1
}
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}
export default defineComponent({
  name: 'list',
  components: {
    imgItem
  },
  setup () {
    const { state } = useStore()
    const typeList = ref<{ label:string, value: string }[]>([])
    const curType = ref<string | never>()
    const directRef = ref<number>(1) // 列表横竖向
    const page = ref(1)
    const pageSize = ref(8)
    const searchName = ref<undefined | string>('')
    const list = ref([])
    const total = ref(0)
    const showDialog = ref(false)
    const uploadInput = ref()
    const queryLoading = ref<boolean>(false)
    const saveLoading = ref(false)
    const showPreview = ref(false)
    const previewTarget = ref('')
    const saveTarget = reactive({
      pic_direction: 1,
      url: '',
      pic_name: '',
      category_id: '1'
    })
    const direction_types = [
      { label: '横屏', value: 1 },
      { label: '竖屏', value: 2 }
    ]
    const imgHost = computed<string>(() => urls.imgHost)
    const queryInfo = async () => {
      const obj:queryObj & { category_id?: string } = {
        page: page.value as number,
        page_size: pageSize.value as number,
        pic_direction: directRef.value,
        pic_type: 1
      }
      if (searchName.value) {
        obj.name = searchName.value
      }
      if (curType.value) {
        obj.category_id = curType.value
      }
      try {
        queryLoading.value = true
        const res = await httpGet(urls.queryList, obj)
        queryLoading.value = false
        const { data } = res
        list.value = data.list
        total.value = data.total
      } catch (e) {
        ElMessage.error(e.message)
      }
    }
    const searchHandler = async () => {
      page.value = 1
      pageSize.value = 20
      const obj:queryObj & { category_id?: string } = {
        page: page.value,
        page_size: pageSize.value,
        pic_direction: directRef.value,
        pic_type: 1
      }
      if (searchName.value !== '') {
        obj.name = searchName.value
      }
      if (curType.value) {
        obj.category_id = curType.value
      }
      try {
        queryLoading.value = true
        const res = await httpGet(urls.queryList, obj)
        queryLoading.value = false
        const { data } = res
        list.value = data.list
        total.value = data.total
      } catch (e) {
        ElMessage.error(e.message)
      }
    }
    onMounted(() => {
      typeList.value = [...state.typeList]
      queryInfo()
    })
    const openUpload = () => {
      uploadInput.value.click()
    }
    const uploadHandler = (e:HTMLInputEvent) => {
      const file = e.target.files ? e.target.files[0] : ''
      const fm = new FormData()
      fm.append('file', file)
      fm.append('pic_type', '1')
      saveLoading.value = true
      upload(urls.upload, fm).then(res => {
        saveLoading.value = false
        const { data } = res
        if (data.code) {
          saveTarget.url = data.path
          saveTarget.pic_name = data.pic_name
        } else {
          ElMessage.error(data.msg)
        }
      }, err => {
        saveLoading.value = false
        ElMessage.error(err.message)
      })
    }
    const saveHandler = () => {
      if (saveTarget.url === '') {
        ElMessage.error('请上传海报')
        return false
      }
      const obj:typeof saveTarget & { pic_type: string } = {
        ...saveTarget,
        pic_type: '1'
      }
      saveLoading.value = true
      httpPost(urls.save, obj).then(res => {
        saveLoading.value = false
        const { data } = res
        if (data.code === 200) {
          ElMessage.success(data.msg)
          showDialog.value = false
          page.value = 1
          queryInfo()
        } else {
          ElMessage.error(data.msg)
        }
      }, err => {
        saveLoading.value = false
        ElMessage.error(err.message)
      })
    }
    const openPreview = (url:string | undefined) => {
      showPreview.value = true
      previewTarget.value = url as string
    }
    const closePreview = () => {
      showPreview.value = false
    }
    const pageChange = (cur:number) => {
      page.value = cur
      queryInfo()
    }
    const closeDialog = ():void => {
      saveTarget.pic_direction = 1
      saveTarget.url = ''
    }
    watch(directRef, (val) => {
      page.value = 1
      pageSize.value = val === 1 ? 8 : 20
      queryInfo()
    }, {
      immediate: false
    })
    return {
      imgHost,
      curType,
      typeList,
      directRef,
      closeDialog,
      pageChange,
      closePreview,
      showPreview,
      previewTarget,
      openPreview,
      saveLoading,
      saveHandler,
      page, // 页码
      pageSize, // 每页条数
      searchName, // 搜索关键字
      list,
      queryLoading,
      total,
      showDialog,
      saveTarget,
      direction_types,
      uploadInput,
      uploadHandler,
      openUpload,
      searchHandler, // 搜索
      queryInfo // 获取信息
    }
  }
})
</script>

<style lang="scss" scoped>
.name-container{
  width: 100%;
  height: 1rem;
  .title{
    width: 100%;
    overflow-wrap: break-word;
  }
}
.row-list{
  .img-out{
    width: 48%;
    &:not(:nth-of-type(2n)){
      margin-right: 3%;
    }
    .img-container{
      width: 100%;
      border-radius: .05rem;
      overflow: hidden;
      background: #EBEEF5;
      height: calc((100vw - 2.74rem) * 0.2 * (375 / 812) );
    }
  }
}
.col-list{
  .img-out{
    width: 16%;
    &:not(:nth-of-type(5n)){
      margin-right: 4%;
    }
    .img-container{
      width: 100%;
      border-radius: .05rem;
      overflow: hidden;
      background: #EBEEF5;
      height: calc((100vw - 2.74rem) * 0.1 );
    }
  }
}
.upload-control{
  width: 1rem;
  height: 1rem;
  border-radius: .05rem;
  border: 1px dashed #333333;
  cursor: pointer;
  &:hover{
    border-color: #409EFF;
  }
}
.img-pre{
  width: 3.5rem
}
.preview-container{
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  position: fixed;
  left: 0;
  top: 0;
  .close-preview{
    color: #ffffff;
    font-size: .25rem;
    position: fixed;
    right: .2rem;
    top: .2rem;
  }
}
</style>
