<template>
  <v-slide-y-reverse-transition @afterLeave="$emit('force-deleted', item)">
    <v-card class="note-item" v-show="!item.force_deleted">
      <v-card-title>
        <div class="belong">
          <v-btn
            @click="onToggleDetail"
            class="hide-detail"
            color="primary"
            flat
            icon
            small
          >
            <mdi-icon
              :icon="showDetail ? 'chevron-up' : 'chevron-down'"
              :loading="loading"
            />
          </v-btn>
          <template v-if="!disableBook">
            <router-link :class="{ hidden: item.book.hidden, deleted: item.book.deleted_at }" :to="`/books/${item.book.id}`">{{ item.book.title }}</router-link>
            <span> • </span>
          </template>
          <router-link class="page-link" :to="`/notes/${item.id}`">第{{ item.page }}页</router-link>
        </div>
      </v-card-title>

      <v-card-text
        v-show="!showDetail"
        class="note-title"
      >
        <span>{{ item.title }}</span>
      </v-card-text>
      <v-card-text
        v-show="showDetail"
        class="note-title"
      >
        <h2 class="detail-title">{{ item.title }}</h2>
        <markdown-body :content="item.html_content"/>
      </v-card-text>

      <tags :tags="item.tags"/>

      <item-actions
        class="actions"
        :item="item"
        v-if="username"
        v-show="editMode"
        :update-handler="updateNote"
        :delete-handler="deleteNote"
        :force-delete-handler="forceDeleteNote"
        :edit-handler="editNote"
        @force-deleted="item => $set(item, 'force_deleted', true)"
      />

      <hidden-mark v-show="item.hidden && !editMode"/>
    </v-card>
  </v-slide-y-reverse-transition>
</template>

<script>
import HumanTime from '@/components/HumanTime'
import Tags from '@/components/Tags'
import HiddenMark from '@/components/HiddenMark'
import ItemActions from '@/components/ItemActions'
import { mapState } from 'vuex'
import { updateNote, deleteNote, forceDeleteNote, getNote } from '@/api/notes'
import MarkdownBody from '@/components/MarkdownBody'

export default {
  name: 'BookNoteItem',
  components: {
    MarkdownBody,
    HumanTime,
    Tags,
    ItemActions,
    HiddenMark,
  },
  props: {
    item: Object,
    disableBook: Boolean,
    book: Object,
  },
  data: () => ({
    loading: false,
    showDetail: false,
  }),
  created() {
    this.updateNote = updateNote
    this.deleteNote = deleteNote
    this.forceDeleteNote = forceDeleteNote
    this.editNote = `/notes/${this.item.id}/edit`
  },
  computed: {
    ...mapState({
      username: state => state.user.name,
    }),
  },
  methods: {
    onToggleDetail() {
      if (this.showDetail) {
        this.showDetail = false
      } else {
        this.onLoadDetail()
      }
    },
    onLoadDetail() {
      if (this.loading) {
        return
      }

      if (this.item.html_content) {
        this.showDetail = true
        return
      }

      this.loading = true

      getNote(this.item.id, { only: 'html_content' })
        .then(res => {
          this.$set(this.item, 'html_content', res.data.html_content)
          this.showDetail = true
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables';

.note-item {
  margin-bottom: 10px;
  overflow: hidden;

  .v-card__title {
    padding-bottom: 10px;
    display: block;
  }

  .belong {
    font-size: 18px;
  }

  .note-title {
    font-size: 14px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .page-link {
    border-bottom: 2px solid #1976d2;
  }

  .hidden {
    color: #aaa;
  }

  .deleted {
    text-decoration: line-through;
  }

  .note-hidden-mark {
    color: #ccc;
  }

  /deep/ {
    .v-progress-linear {
      margin: 3px 0;
    }
  }
}

.actions {
  right: 0;
  top: 0;
  border-bottom-left-radius: 4px;
}

.hide-detail {
  margin: 0px 8px 0px 0px;
}

.detail-title {
  padding-bottom: .3em;
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  margin-bottom: 16px;
}
</style>
