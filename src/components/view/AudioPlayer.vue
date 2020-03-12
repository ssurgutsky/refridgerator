<template>
  <div>
    <audio autoplay :loop="loop" ref="audioPlayer" @ended="onAudioEnded">
      <source type="audio/mp3" />
    </audio>
    <audio autoplay ref="ambientPlayer">
      <source type="audio/mp3" />
    </audio>
    <audio autoplay ref="musicPlayer" @ended="onMusicEnded">
      <source type="audio/mp3" />
    </audio>
    <audio autoplay ref="sfxPlayer">
      <source type="audio/mp3" />
    </audio>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'AudioPlayer',
  data () {
    return {
      audioPlayer: null,
      ambientPlayer: null,
      musicPlayer: null,
      sfxPlayer: null,
      currentAudioName: '',
      currentAmbientName: '',
      currentMusicName: '',
      silentTimerId: 0,
      loop: false
    }
  },
  mounted () {
    if (!this.audioPlayer) {
      this.initialize()
    }
  },
  methods: {
    initialize () {
      this.audioPlayer = this.$refs.audioPlayer
      this.ambientPlayer = this.$refs.ambientPlayer
      this.musicPlayer = this.$refs.musicPlayer
      this.sfxPlayer = this.$refs.sfxPlayer
    },

    playAudio (name, loop) {
      console.log(name)

      this.clearSilentTimer()

      this.currentAudioName = name

      if (name.toUpperCase().includes('SILENT_')) {
        let seconds = name.toUpperCase().replace('SILENT_', '')
        this.silentTimerId = setTimeout(this.onAudioEnded, seconds * 1000)
        return
      }
      if (this.musicPlayer.src !== '') {
        this.musicPlayer.volume = 0.05
      }
      this.audioPlayer.loop = loop
      this.audioPlayer.src = require('@/assets/audio/' + name + '.mp3')
    },

    stopAudio () {
      this.audioPlayer.pause()
      if (this.musicPlayer.src !== '') {
        this.musicPlayer.volume = 0.4
      }
    },

    clearSilentTimer () {
      clearTimeout(this.silentTimerId)
      this.silentTimerId = 0
    },

    onAudioEnded () {
      //      console.log('audioEnded', this.currentAudioName)
      this.$emit('audioEnded', this.currentAudioName)
    },

    playAmbient (name) {
      console.log('ambient', name)

      if (name === '' || name === this.currentAmbientName) {
        return
      }

      this.currentAmbientName = name

      if (name.toUpperCase() === 'NONE' || name.toUpperCase() === 'OFF') {
        this.ambientPlayer.src = ''
        return
      }

      this.ambientPlayer.loop = true
      this.ambientPlayer.src = require('@/assets/audio/' + name + '.mp3')
    },

    playMusic (name) {
      console.log(name)

      if (name === '') {
        return
      }

      this.currentMusicName = name

      if (name.toUpperCase() === 'NONE' || name.toUpperCase() === 'OFF') {
        this.musicPlayer.src = ''
        return
      }

      this.musicPlayer.src = require('@/assets/audio/' + name + '.mp3')
    },

    onMusicEnded () {
      //      console.log('musicEnded', this.currentMusicName)
      this.$emit('musicEnded', this.currentMusicName)
    },

    playSFX (name) {
      console.log('SFX', name)
      this.sfxPlayer.src = require('@/assets/audio/' + name + '.mp3')
    },

    stopSFX () {
      this.sfxPlayer.pause()
    }
  }
}
</script>

<style scoped>
</style>
