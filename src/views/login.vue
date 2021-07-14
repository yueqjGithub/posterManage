<template>
  <div class="page flex-row flex-jst-center flex-ali-center">
    <div class="login-container slideInDown">
      <p class="login-tit font-18 font-bold">海报传图系统</p>
      <el-form ref="loginRef" :model="loginForm" :rules="rules" :disabled="loading" v-loading="loading">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-key" placeholder="请输入您的密码" type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="full-width flex-row flex-jst-center flex-ali-center">
            <el-button @click="loginHandler" type="primary" icon="el-icon-right" circle class="font-16 shake-shake"></el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { httpPost } from '@/service/http'
import urls from '@/service/urls'
import { ElMessage } from 'element-plus'
interface LoginForm {
  username:string,
  password:string
}

export default defineComponent({
  name: 'login',
  setup: () => {
    const router = useRouter()
    const loginRef = ref()
    const loading = ref(false)
    const loginForm = reactive<LoginForm>({
      username: '',
      password: ''
    })
    const rules = {
      username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    }
    onMounted(() => {
      // console.log(loginRef.value)
      const token = window.localStorage.getItem('token')
      if (token) {
        router.push({ name: 'List' })
      }
    })
    const loginHandler:()=>void = () => {
      loginRef.value.validate().then((valid: boolean) => {
        if (valid) {
          const obj = {
            username: loginForm.username,
            password: loginForm.password
          }
          loading.value = true
          httpPost(urls.login as string, obj).then(res => {
            loading.value = false
            const { data } = res
            if (data.code === 200) {
              window.localStorage.setItem('token', data.authorization)
              window.localStorage.setItem('user_id', data.user_id)
              router.push({ name: 'List' })
            } else {
              ElMessage.error(data.message)
            }
          }, (e:Error) => {
            loading.value = false
            ElMessage.error(e.message)
          })
        }
      })
    }
    return {
      loading,
      loginRef,
      loginForm,
      rules,
      loginHandler
    }
  }
})
</script>

<style lang="scss" scoped>
.page{
  background: #60a4e0;
  padding: .5rem;
  .login-container{
    min-width: 3.5rem;
    padding: .3rem .3rem 0 .3rem;
    border-radius: .05rem;
    background: white;
    .login-tit{
      margin-bottom: .3rem;
    }
  }
  .slideInDown{
    animation: slideInDown .5s linear;
  }
}
@keyframes slideInDown {
  from {
    transform: translate(0, -100%);
    opacity: 0;
  }
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
}
</style>
