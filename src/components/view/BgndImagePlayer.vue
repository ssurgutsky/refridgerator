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

      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')

      imageUtils.showImages(value, canvas, ctx)
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
