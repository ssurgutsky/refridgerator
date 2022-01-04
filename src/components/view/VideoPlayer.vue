<template>
  <div>
    <video playsinline :style="styleObject1" autoplay :loop="loop" ref="videoPlayer1" @canplay="onCanPlay" @ended="onEnd">
    </video>
    <video playsinline :style="styleObject2" autoplay :loop="loop" ref="videoPlayer2" @canplay="onCanPlay" @ended="onEnd">
    </video>
  </div>
</template>

<script>
import CacheController from '@/components/controller/CacheController.js'
import Settings from '@/components/Settings.js'

export default {
  name: 'VideoPlayer',
  data () {
    return {
      isFirstRun: true,
      videoPlayer1: null,
      videoPlayer2: null,
      currentVideoPlayer: null,
      currentPlayerNo: 1,
      currentVideoName: '',
      loop: false,
      styleObject1: {
        'position': 'absolute',
        'display': 'none',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'z-index': 1
      },
      styleObject2: {
        'position': 'absolute',
        'display': 'none',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'z-index': 2
      }
    }
  },
  mounted () {
    if (!this.videoPlayer1) {
      this.initialize()
    }
  },
  methods: {
    initialize () {
      // console.log(this.$refs)
      this.videoPlayer1 = this.$refs.videoPlayer1
      this.videoPlayer2 = this.$refs.videoPlayer2
    },

    playVideo (name, loop) {
      console.log(name)
      this.currentVideoName = name

      if (name.toUpperCase() === 'NONE') {
        this.styleObject1.display = 'none'
        this.videoPlayer1.src = ''
        this.styleObject2.display = 'none'
        this.videoPlayer2.src = ''
        //        this.onEnd()
        return
      }

      if (this.currentPlayerNo === 1 || this.isFirstRun) {
        this.videoPlayer1.loop = loop
        this.videoPlayer1.src = this.getVideoSrc(name)
        this.videoPlayer1.load()
        // this.videoPlayer1.pause()
        // setTimeout(() => {
        //   this.videoPlayer1.play()
        // }, 10)
      }

      if (this.currentPlayerNo === 2 || this.isFirstRun) {
        this.videoPlayer2.loop = loop
        this.videoPlayer2.src = this.getVideoSrc(name)
        this.videoPlayer2.load()
        // this.videoPlayer2.pause()
        // setTimeout(() => {
        //   this.videoPlayer2.play()
        // }, 10)
      }
    },

    getVideoSrc (name) {
      let asset = CacheController.getAssetByName(CacheController.CATEGORY_VIDEO, name)

      if (Settings.CACHE_ENABLED) {
        if (asset) {
          return asset
        }
      }
      return this.getVideoPathByName(name)
    },

    getVideoPathByName (name) {
      let result = name
      if (result.indexOf('.') < 0) {
        result = result + '.mp4'
      }
      return require('@/assets/video/' + result)
    },

    stopVideo () {
      if (this.currentPlayerNo === 1) {
        this.videoPlayer1.pause()
      }

      if (this.currentPlayerNo === 2) {
        this.videoPlayer2.pause()
      }
    },

    onCanPlay (event) {
      // console.log('canPlay')

      if (this.currentPlayerNo === 1 || this.isFirstRun) {
        setTimeout(() => {
          this.videoPlayer1.play()
        }, 10)
      }

      if (this.currentPlayerNo === 2 || this.isFirstRun) {
        setTimeout(() => {
          this.videoPlayer2.play()
        }, 10)
      }

      this.switchVideoPlayer()

      this.isFirstRun = false
    },

    switchVideoPlayer () {
      if (this.currentPlayerNo === 1) {
        this.styleObject1.display = 'block'
        this.styleObject2.display = 'block'
        //        this.videoPlayer2.src = ''
        this.videoPlayer2.pause()
        this.styleObject2.width = 0
        this.styleObject2.height = 0
        this.styleObject1.width = '100%'
        this.styleObject1.height = '100%'
        this.currentVideoPlayer = this.videoPlayer1
      }

      if (this.currentPlayerNo === 2) {
        this.styleObject2.display = 'block'
        this.styleObject1.display = 'block'
        //        this.videoPlayer1.src = ''
        this.videoPlayer1.pause()
        this.styleObject1.width = 0
        this.styleObject1.height = 0
        this.styleObject2.width = '100%'
        this.styleObject2.height = '100%'
        this.currentVideoPlayer = this.videoPlayer2
      }
      this.currentPlayerNo = 3 - this.currentPlayerNo
    },

    onEnd () {
      //      console.log('videoEnded', this.currentVideoName)
      this.$emit('videoEnded', this.currentVideoName)
    }
  }
}
</script>

<style scoped>
</style>
