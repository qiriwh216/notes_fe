<template>
  <el-card class="note-item">
    <div slot="header">
      <div class="time">
        <human-time :time="item.created_at" prefix="发布于："/>
      </div>
      <div>
        <div class="belong">
          <div v-if="item.book">
            <router-link v-if="!disableBook" :to="`/books/${item.book.id}`">{{ item.book.title }}</router-link>
            <span v-if="!disableBook">•</span>
            <router-link :to="`/books/${item.book.id}/pages/${item.page}`">第{{ item.page }}页</router-link>
          </div>
          <div v-else>书不见啦~</div>
        </div>
        <div v-if="item.title" class="title">
          <router-link :to="`/notes/${item.id}`">{{ item.title }}</router-link>
        </div>
      </div>
    </div>
    <div>
      <router-link :to="`/notes/${item.id}`">{{ item.desc }}</router-link>
    </div>
    <div class="card-footer">
      <el-tag
        v-for="tag of item.tags"
        :key="tag.id"
        size="small"
        disable-transitions
      >
        <router-link :to="`/tags/${tag.id}`">{{ tag.name }}</router-link>
      </el-tag>
    </div>
  </el-card>
</template>

<script>
import HumanTime from '@/components/HumanTime'

export default {
  name: 'BookNoteItem',
  components: { HumanTime },
  props: {
    item: Object,
    disableBook: Boolean,
  },
}
</script>

<style scoped>

</style>