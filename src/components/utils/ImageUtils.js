/* eslint no-eval: 0 */
export default {

  showImages (value, canvas, ctx) {
    if (!value || value === '') return

    this.currentImages = value

    // console.log('showImages', value)
    const arr = value.split('&')
    //      console.log(arr)
    const imageItems = arr.map(function (imageStr) {
      let result = {}
      const str = imageStr.split('|')
      if (str[0]) {
        result.name = str[0]
        result.path = require('@/assets/images/' + result.name)
      }
      let params = null
      if (str[1]) {
        params = {}
        let paramsArr = str[1].split(';')
        params.posX = paramsArr[0] || 0
        params.posY = paramsArr[1] || 0
        params.scaleX = paramsArr[2] || 1
        params.scaleY = paramsArr[3] || 1
        params.rotation = paramsArr[4] || 0
        params.alpha = paramsArr[5] || 1
        result.params = params
      }
      return result
    })
    //      console.log(images)
    this.loadAndDrawImageItems(imageItems, canvas, ctx)
  },

  loadAndDrawImageItems (imageItems, canvas, ctx) {
    Promise
      .all(imageItems.map(item => this.loadImageByItem(item)))
      .then((images) => {
        images.forEach((item) => {
          this.drawImageCustom(canvas, ctx, item.image, item.params)
        })
      }).catch((err) => {
        console.error(err)
      })
  },
  loadImageByItem (item) {
    return new Promise((resolve, reject) => {
      let image = new Image()
      image.addEventListener('load', () => {
        item.image = image
        resolve(item)
      })
      image.addEventListener('error', (err) => {
        reject(err)
      })
      image.src = item.path
    })
  },

  drawImageCustom (canvas, ctx, img, params) {
    //    console.log(params)

    params = params || {}
    let x = params.posX || 0
    let y = params.posY || 0
    let width = img.width * (Math.abs(params.scaleX || 1))
    let height = img.height * (Math.abs(params.scaleY || 1))
    let angle = Math.PI / 180 * (params.rotation || 0)
    let alpha = (params.alpha || 1)

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.scale(Math.sign(params.scaleX || 1), Math.sign(params.scaleY || 1))
    ctx.globalAlpha = alpha
    ctx.drawImage(img, 0, 0, width, height)
    ctx.restore()
  },

  getObjectFitSize (image) {
    var imageComputedStyle = window.getComputedStyle(image)
    var imageObjectFit = imageComputedStyle.getPropertyValue('object-fit')
    var coordinates = {}
    coordinates.width = image.width
    coordinates.height = image.height
    var imagePositions = imageComputedStyle.getPropertyValue('object-position').split(' ')
    var horizontalPercentage = parseInt(imagePositions[0]) / 100
    var verticalPercentage = parseInt(imagePositions[1]) / 100
    var naturalRatio = image.naturalWidth / image.naturalHeight
    var visibleRatio = image.width / image.height
    if (imageObjectFit === 'none') {
      coordinates.sourceWidth = image.width
      coordinates.sourceHeight = image.height
      coordinates.sourceX = (image.naturalWidth - image.width) * horizontalPercentage
      coordinates.sourceY = (image.naturalHeight - image.height) * verticalPercentage
      coordinates.destinationWidthPercentage = 1
      coordinates.destinationHeightPercentage = 1
      coordinates.destinationXPercentage = 0
      coordinates.destinationYPercentage = 0
    } else if (imageObjectFit === 'contain' || imageObjectFit === 'scale-down') {
      // TODO: handle the "scale-down" appropriately, once its meaning will be clear
      coordinates.sourceWidth = image.naturalWidth
      coordinates.sourceHeight = image.naturalHeight
      coordinates.sourceX = 0
      coordinates.sourceY = 0
      if (naturalRatio > visibleRatio) {
        coordinates.destinationWidthPercentage = 1
        coordinates.destinationHeightPercentage = (image.naturalHeight / image.height) / (image.naturalWidth / image.width)
        coordinates.destinationXPercentage = 0
        coordinates.destinationYPercentage = (1 - coordinates.destinationHeightPercentage) * verticalPercentage
      } else {
        coordinates.destinationWidthPercentage = (image.naturalWidth / image.width) / (image.naturalHeight / image.height)
        coordinates.destinationHeightPercentage = 1
        coordinates.destinationXPercentage = (1 - coordinates.destinationWidthPercentage) * horizontalPercentage
        coordinates.destinationYPercentage = 0
      }
    } else if (imageObjectFit === 'cover') {
      if (naturalRatio > visibleRatio) {
        coordinates.sourceWidth = image.naturalHeight * visibleRatio
        coordinates.sourceHeight = image.naturalHeight
        coordinates.sourceX = (image.naturalWidth - coordinates.sourceWidth) * horizontalPercentage
        coordinates.sourceY = 0
      } else {
        coordinates.sourceWidth = image.naturalWidth
        coordinates.sourceHeight = image.naturalWidth / visibleRatio
        coordinates.sourceX = 0
        coordinates.sourceY = (image.naturalHeight - coordinates.sourceHeight) * verticalPercentage
      }
      coordinates.destinationWidthPercentage = 1
      coordinates.destinationHeightPercentage = 1
      coordinates.destinationXPercentage = 0
      coordinates.destinationYPercentage = 0
    } else {
      if (imageObjectFit !== 'fill') {
        console.error("unexpected 'object-fit' attribute with value '" + imageObjectFit + "' relative to")
      }
      coordinates.sourceWidth = image.naturalWidth
      coordinates.sourceHeight = image.naturalHeight
      coordinates.sourceX = 0
      coordinates.sourceY = 0
      coordinates.destinationWidthPercentage = 1
      coordinates.destinationHeightPercentage = 1
      coordinates.destinationXPercentage = 0
      coordinates.destinationYPercentage = 0
    }
    return coordinates
  }
}
