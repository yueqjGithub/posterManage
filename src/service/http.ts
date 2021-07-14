import axios, { AxiosPromise } from 'axios'
import urls from './urls'
import { ElMessageBox } from 'element-plus'
import App from '../main'

const http = axios.create({
  baseURL: urls.baseUrl,
  timeout: 15000
})

http.interceptors.request.use(config => {
  const token:string | null = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(response => {
  const status = response.status
  if (status >= 200 && status < 300) {
    const code:number | undefined | never = Number(response.data?.code)
    if (code === 0) {
      window.localStorage.clear()
      ElMessageBox.alert('您的登录信息已过期，请重新登录', '提示', {
        confirmButtonText: '确定'
      }).then(() => {
        return App.$router.push({ name: 'Login' })
      })
      throw new Error('登录过期')
    } else if (code === 200) {
      return response
    } else {
      throw new Error(response.data.msg)
    }
  } else {
    throw new Error('error')
  }
}, error => {
  throw new Error(error.message)
})

type AxiosFunc = (url:string, params: {[key:string]: (string | number | undefined | null | [])}) => AxiosPromise
type AxiosUpload = (url:string, params: FormData) => AxiosPromise

const httpPost:AxiosFunc = (url:string, data = {}) => {
  return http({
    url,
    data,
    method: 'POST'
  })
}

const httpGet:AxiosFunc = (url, params = {}) => {
  return http({
    url,
    params,
    method: 'GET'
  })
}

const upload:AxiosUpload = (url, params) => {
  return http({
    url,
    data: params,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export { httpPost, httpGet, upload }
