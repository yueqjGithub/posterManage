class URLS {
  [key:string]: string
}
let baseUrl = ''
let imgHost = 'http://imgweb.8xgame.cn'
if (process.env.NODE_ENV === 'production') {
  baseUrl = process.env.VUE_APP_BASEURL as string
  imgHost = process.env.VUE_APP_IMGHOST as string
}

const urls:URLS = {
  baseUrl: baseUrl,
  imgHost,
  login: '/api/auth',
  queryList: '/api/poster',
  upload: '/api/poster/upload',
  save: '/api/poster'
}

export default urls
