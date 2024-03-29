<template>
  <page-layout
    page-desc="通往程序员之路"
    :loading="loading && firstLoad"
    :flex="{ md8: false, sm10: false }"
    style="max-width: 700px;"
  >
    <template v-if="days.length">
      <v-expansion-panel expand>
        <v-expansion-panel-content
          v-for="day of days"
          :key="day"
          expand-icon
        >
          <div
            slot="header"
            class="progress-wrapper"
          >
            <div>{{ day }}</div>
            <div class="progress">
              <v-progress-linear
                color="info"
                height="21"
                :value="groupedByDay[day].sum / maxSum * 100"
              />
              <span class="sum">看了 {{ groupedByDay[day].sum }} 页</span>
            </div>
          </div>
          <div
            class="books"
            v-for="(r, index) of groupedByDay[day].books"
            :key="index"
          >
            <router-link
              v-if="r.book"
              :to="`/books/${r.book_id}`"
            >
              《{{ r.book.title }}》
            </router-link>
            <span v-else>《神秘书籍》</span>
            <span class="book-sum">看了 {{ r.sum }} 页</span>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>
    <empty v-else/>
    <div class="text-xs-center">
      <v-btn
        @click="onLoadMore"
        flat
        :loading="loading && !firstLoad"
        class="load-more"
        :disabled="isEnd"
      >
        {{ loadMoreText }}
      </v-btn>
    </div>
  </page-layout>
</template>

<script>
import { getReadRecords } from '@/api/read_records'

export default {
  name: 'Index',
  data: () => ({
    currentPage: 0,
    perPage: 15,
    loading: false,
    groupedByDay: {},
    days: [],
    maxSum: 0,
    isEnd: false,
    firstLoad: true,
  }),
  created() {
    this.getData()
  },
  computed: {
    loadMoreText() {
      return this.isEnd ? '~~ 路的起点 ~~' : '我是怎么来的？'
    },
  },
  methods: {
    async getData() {
      this.loading = true
      try {
        const { data } = await getReadRecords(this.currentPage + 1)
        this.currentPage = data.meta.current_page
        this.perPage = data.meta.per_page
        this.groupRecords(data.data)
        if (this.firstLoad) {
          this.firstLoad = false
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * 格式化 records 记录
     */
    groupRecords(records) {
      // 上一个不同的日期
      let preDay
      // 本次请求的数据中的天数
      let daysCount = 0

      records.forEach(r => {
        if (!this.groupedByDay[r.day]) {
          this.groupedByDay[r.day] = {
            sum: 0,
            books: [],
          }
          this.days.push(r.day)
          daysCount++

          // 如果 day，不在 grouped 中，说明是一个新的日期了，
          // 由于日期是排序过的，所以后面肯定不会出现再出现之前的日期了，
          // 可以把上一个日期的总页数与当前最大值比较了
          if (preDay && (this.groupedByDay[preDay].sum > this.maxSum)) {
            this.maxSum = this.groupedByDay[preDay].sum
          }

          preDay = r.day
        }

        this.groupedByDay[r.day].sum += Number(r.sum)
        this.groupedByDay[r.day].books.push(r)
      })

      // 如果每页数大于本次请求获取的数据的天数，说明数据已经没有了
      this.isEnd = this.perPage > daysCount
    },

    onLoadMore() {
      this.getData()
    },
  },
}
</script>

<style scoped lang="scss">
@import "~@/styles/variables";

.v-expansion-panel {
  box-shadow: none;

  .v-expansion-panel__container {
    border-top: none;
    background: initial;
  }
}

/deep/ {
  .v-expansion-panel__header {
    padding: 12px 16px;
  }
}

.books {
  padding: 12px 16px;
}

.progress-wrapper {
  > div {
    display: inline-block;
    vertical-align: middle;
  }

  .v-progress-linear {
    margin: 0;
  }

  .progress {
    position: relative;
    width: calc(100% - 100px);
    margin-left: 15px;
  }
}

.sum {
  left: 5px;
  top: 1px;
  color: white;
  position: absolute;
  z-index: 1;
}

.book-sum {
  margin-left: 20px;
}

.load-more {
  color: $non-important-color;
  font-size: 16px;
  font-weight: 900;
}
</style>
