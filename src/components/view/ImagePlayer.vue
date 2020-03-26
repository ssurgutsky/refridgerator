<template>
  <div>
    <canvas
      id="canvas"
      style="width: 100%; height: 100%; object-fit: contain"
      width="640px"
      height="480px"
    ></canvas>
  </div>
</template>

<script>

import imageUtils from '@/components/utils/ImageUtils.js'

export default {
  name: 'ImagePlayer',
  data () {
    return {
      imagePlayer: null,
      currentImages: ''
    }
  },
  mounted () {
    if (!this.imagePlayer) {
      this.initialize()
    }
  },

  methods: {
    initialize () {
      // console.log(this.$refs)
      this.imagePlayer = this.$refs.imagePlayer
    },

    showImages (value) {
      if (!value || value === '') return

      this.currentImages = value

      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')

      imageUtils.showImages(value, canvas, ctx)
    },

    clearImages () {
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.currentImages = ''
    }
  }
}
</script>

<style scoped></style>
