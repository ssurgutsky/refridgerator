<template>
  <div>
    <canvas id="canvas" style="width: 100%; height: 100%; object-fit: contain" width="640px" height="480px"></canvas>
  </div>
</template>

<script>

import imageUtils from '@/components/utils/ImageUtils.js'

export default {
  name: 'BgndImagePlayer',
  data () {
    return {
      bgndImagePlayer: null,
      currentBgndImages: ''
    }
  },
  mounted () {
    if (!this.bgndImagePlayer) {
      this.initialize()
    }
  },

  methods: {
    initialize () {
      // console.log(this.$refs)
      this.bgndImagePlayer = this.$refs.bgndImagePlayer
    },

    showBgndImages (value) {
      if (!value || value === '') return

      this.currentBgndImages = value

      //      console.log('showImages', value)
      const arr = value.split('&')
      //      console.log(arr)
      const imageItems = arr.map(function (imageStr) {
        let result = {}
        const str = imageStr.split('|')
        if (str[0]) {
          result.name = str[0]
          result.path = require('@/assets/images/' + result.name)
        }

        if (str[1]) {
          let params = {}
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

      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')

      imageUtils.loadDrawImageItems(imageItems, canvas, ctx)
    },

    clearBgndImages () {
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.currentBgndImages = ''
    }
  }
}
</script>

<style scoped>
</style>
