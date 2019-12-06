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
const uploadImage = async function(imgData: string /*base64*/) {
  return imgurApi
    .post('image', {
      image: imgData,
      type: 'file',
    })
    .then(res => res.data)
}

export default { uploadImage }
