<!-- MyBook.vue -->
<template>
  <div>{{ readersNumber }} {{ book.title }}</div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'
interface bookType {
  title: string,
  date?: Date
}
export default defineComponent({
  setup () {
    const readersNumber = ref<number>(0)
    const book = reactive<bookType>({ title: 'Vue 3 Guide' })
    // expose to template
    return {
      readersNumber,
      book
    }
  }
})
</script>
