type ScreenShootType = {
  label: string,
  value: number | string
}

const typeList:ScreenShootType[] = [
  { label: '仙侠', value: '1' },
  { label: '传奇', value: '2' },
  { label: '魔兽', value: '3' },
  { label: '暗黑', value: '4' },
  { label: '三国', value: '5' },
  { label: '二次元', value: '6' }
]

export default {
  preUrl: '',
  typeList
}
