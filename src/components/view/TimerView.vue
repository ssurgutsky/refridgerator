<template>
  <div class="progressbar orange">
    <span :style="styleObject"></span>
  </div>
</template>

<script>
import { setTimeout, clearTimeout } from 'timers'

export default {
  data () {
    return {
      totalMS: 0,
      currentMS: 0,
      timerId: 0,
      interval: 100,
      styleObject: {
        width: '0%'
      }
    }
  },
  methods: {

    setTimer (seconds) {
      this.clearTimer()

      if (seconds <= 0) return

      this.totalMS = seconds * 1000
      this.currentMS = 0
      this.processTimerUpdate()
    },

    processTimerUpdate () {
      this.currentMS += this.interval

      this.updateIndicator()

      if (this.currentMS > this.totalMS) {
        this.onTimeExpired()
        this.currentMS = this.totalMS
        return
      }

      this.timerId = setTimeout(this.processTimerUpdate, this.interval)
    },

    onTimeExpired () {
      // console.log('timeExpired')
      this.$emit('timeExpired')
    },

    clearTimer () {
      clearTimeout(this.timerId)
      this.timerId = 0
      this.totalMS = 100
      this.currentMS = 100
      this.updateIndicator()
    },

    updateIndicator () {
      this.styleObject.width = '' + (100 - this.currentMS * 100 / this.totalMS) + '%'
    }

  }
}
</script>

<style scoped>
  .progressbar {
    height: 3px;
    position: relative;
    background: #555;
    /*padding: 3px;*/
    box-shadow: inset 0 -1px 1px rgba(255,255,255,0.3);
  }
  .progressbar > span {
    display: block;
    height: 100%;
    background-color: rgb(43,194,83);
    background-image: linear-gradient(
      center bottom,
      rgb(43,194,83) 37%,
      rgb(84,240,84) 69%
    );
    box-shadow:
      inset 0 2px 9px  rgba(255,255,255,0.3),
      inset 0 -2px 6px rgba(0,0,0,0.4);
    position: relative;
    overflow: hidden;
  }
  .orange > span {
    background-color: #f1a165;
    background-image: linear-gradient(to bottom, #f1a165, #f36d0a);
  }

  .red > span {
    background-color: #f0a3a3;
    background-image: linear-gradient(to bottom, #f0a3a3, #f42323);
  }
  .progressbar > span:after {
    content: "";
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, .2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, .2) 50%,
      rgba(255, 255, 255, .2) 75%,
      transparent 75%,
      transparent
    );
    z-index: 1;
    background-size: 50px 50px;
    animation: move 2s linear infinite;
    overflow: hidden;
  }
  @keyframes move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 50px 50px;
    }
  }
</style>
