import fs from 'fs'
import path from 'path'

export default {
  allImagePaths (imageType, userDataPath) {
    var imagePaths = []
    // get built ins
    var builtInFolder = path.join(__static, '..', 'src', 'renderer', 'assets', 'img', imageType)
    if (fs.existsSync(builtInFolder)) {
      fs.readdirSync(builtInFolder).forEach(file => {
        console.log(file)
        imagePaths.push(file)
      })
    }
    // get user imgs
    var userFolder = path.join(userDataPath, 'img', imageType)
    if (fs.existsSync(userFolder)) {
      fs.readdirSync(userFolder).forEach(file => {
        console.log(file)
        imagePaths.push(file)
      })
    }
    console.log(imagePaths)
    return imagePaths
  },
  copyUserImage (sourcePath, imageType, userDataPath) {
    fs.copyFile('source.txt', 'destination.txt', (err) => {
      if (err) throw err
      console.log('source.txt was copied to destination.txt')
    })
  }
}
