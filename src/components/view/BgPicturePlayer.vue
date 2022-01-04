<template>
  <div>
    <canvas
      id="bgcanvas"
      style="width: 100%; height: 100%; object-fit: contain"
      width="640px"
      height="480px"
    ></canvas>
    <canvas
      id="bgcanvasHidden"
      width="640px"
      height="480px"
      style="visibility: hidden"
    ></canvas>
  </div>
</template>

<script>

import imageUtils from '@/components/utils/ImageUtils.js'

export default {
  name: 'BgPicturePlayer',
  data () {
    return {
      bgPicturePlayer: null,
      currentImages: '',
      prevImages: ''
    }
  },
  mounted () {
    if (!this.bgPicturePlayer) {
      this.initialize()
    }
  },

  methods: {
    initialize () {
      // console.log(this.$refs)
      this.bgPicturePlayer = this.$refs.bgPicturePlayer
    },

    showBgPictures (value) {
      this.prevImages = this.currentImages
      this.currentImages = value

      // Clear hidden canvas, draw pics for new and copy to visible canvas
      let canvas = document.getElementById('bgcanvasHidden')
      let ctx = canvas.getContext('2d')

      imageUtils.showImages(value, canvas, ctx, true)
        .finally(() => {
          this.copyHiddenToVisibleCanvas()
        })
    },

    copyHiddenToVisibleCanvas () {
      let destCanvas = document.getElementById('bgcanvas')
      let sourceCanvas = document.getElementById('bgcanvasHidden')

      // grab the context from your destination canvas
      let destCtx = destCanvas.getContext('2d')

      // Force clear cause sourceCanvas can be zero
      if (this.prevImages !== this.currentImages) {
        destCtx.clearRect(0, 0, destCanvas.width, destCanvas.height)
      }

      // call its drawImage() function passing it the source canvas directly
      destCtx.drawImage(sourceCanvas, 0, 0)
    }
  }
}
</script>

<style scoped></style>
