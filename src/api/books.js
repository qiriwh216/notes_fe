import axios from '@/plugins/axios'

export function getBooks(params) {
  return axios({
    url: 'books',
    method: 'get',
    params,
  })
}

export function getBook(id, query) {
  return axios({
    url: `books/${id}`,
    method: 'get',
    params: query,
  })
}

export function postCreateBook(data) {
  return axios({
    url: 'books',
    method: 'post',
    data,
  })
}

export function updateBook(bookId, data) {
  return axios({
    url: `books/${bookId}`,
    method: 'put',
    data,
  })
}

export function deleteBook(bookId) {
  return axios({
    url: `books/${bookId}`,
    method: 'delete',
  })
}

export function forceDeleteBook(bookId) {
  return axios({
    url: `deleted-books/${bookId}`,
    method: 'delete',
  })
}
