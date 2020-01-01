import axios from 'axios'

const imgurClientID = '36f102b737b2f5f'
const imgurApi = axios.create({
  baseURL: 'https://api.imgur.com/3',
  headers: {
    Authorization: 'Client-ID ' + imgurClientID,
  },
  responseType: 'json',
})

/**
 * Uploads an image via the imgur API.
 *
 * @param {string} imgData Image data as a base64 string.
 */
const uploadImage = async function(imgData: string /*base64*/): Promise<string> {
  const res = await imgurApi.post('image', {
    image: imgData,
    type: 'base64',
  })
  return res.data.data.link
}

export default { uploadImage }
