import mock from '../mock'
import detail from '../data/post_detail'
import utils from '@/libs/utils'

const Mock = require('mockjs')
const Random = Mock.Random

// 博客列表
mock(/\/posts(\?.*)?$/, 'get', {
  'posts|15': [
    {
      'id|+1': 1,
      title: '@ctitle',
      desc: '@cparagraph',
      content: '@cparagraph',
      created_at: '@datetime',
      updated_at: '@datetime',
      'tags|5-15': [
        {
          'id|+1': 1,
          'name|3-5': '@cword',
        },
      ],
    },
  ],
}, (tmpl, options) => {
  const postInfoTmpl = tmpl['posts|15'][0]
  const q = utils.queryFromUrl(options.url)

  if (q.edit_mode) {
    postInfoTmpl.deleted_at = () => {
      return Math.random() > 0.5 ? Random.datetime() : null
    }
    postInfoTmpl.hidden = () => {
      return Math.random() > 0.5
    }
  } else {
    postInfoTmpl.deleted_at = null
    postInfoTmpl.hidden = false
  }
})

// 博客详情
mock(/\/posts\/\d+/, 'get', {
  post: {
    'id|+1': 1,
    title: '@ctitle',
    desc: '@cparagraph',
    content: '@cparagraph',
    html_content: detail,
    created_at: '@datetime',
    updated_at: '@datetime',
    'tags|5-15': [
      {
        'id|+1': 1,
        'name|3-5': '@cword',
      },
    ],
  },
})

mock('/posts', 'post', {
  post: {
    'id|1-999': 1,
  },
})

mock(/\/posts\/\d+/, 'delete', {
  deleted_at: '@datetime',
})

// 更新
mock(/\/posts\/\d+/, 'put', {}, (tmpl, options) => {
  const data = typeof options.body == 'string'
    ? utils.safeJsonParse(options.body, {})
    : options.body

  if (data.hidden !== undefined) {
    tmpl.hidden = data.hidden
  } else if (data.deleted_at === null) {
    tmpl.deleted_at = null
  } else {
    // 编辑保存
    // 获取id
    // bookInfoTmpl.id = Number(options.url.match(/\/posts\/(\d+)/)[1])
    // tmpl.book = bookInfoTmpl
  }
})
