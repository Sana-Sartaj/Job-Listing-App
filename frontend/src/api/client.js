import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
})

export const getAllPosts = () => client.get('/allPosts')
export const searchPosts = (text) => client.get(`/posts/${encodeURIComponent(text)}`)
export const createPost = (post) => client.post('/post', post)
