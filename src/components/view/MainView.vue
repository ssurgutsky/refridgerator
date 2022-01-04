<template>
  <div ref="mainView" class="main-view">
    <BgPicturePlayer class="bg-picture-container" ref="bgPicturePlayer"/>
    <VideoPlayer class="video-container" ref="videoPlayer" @videoEnded="processVideoEnded"/>
    <BgndImagePlayer class="bgnd-image-container" ref="bgndImagePlayer"/>
    <ImagePlayer class="image-container" ref="imagePlayer"/>
    <AudioPlayer class="audio-container" ref="audioPlayer"
      @audioEnded="processAudioEnded"
      @sfxEnded="processSFXEnded"
      @musicEnded="processMusicEnded"
      @bgndMusicEnded="processBgndMusicEnded"
    />
    <QuestionView class="questions-container" ref="questionView"/>
    <TimerView class="timer-container" ref="timerView" @timeExpired="processTimeExpired" />
    <AnswersList class="answers-container" ref="answersView" @answerClick="processAnswerClick" />
    <ControlsView class="controls-container" ref="controlsView"
      @restartGame="restartGame"
      @saveGame="saveGame"
      @loadGame="loadGame"
      @cheatSkip="cheatSkip"
      @cheatBack="cheatBack"
      @cheatEpisode="cheatEpisode"
      @donate="donate"
    />
  </div>
</template>

<script>
import BgPicturePlayer from './BgPicturePlayer.vue'
import VideoPlayer from './VideoPlayer.vue'
import BgndImagePlayer from './BgndImagePlayer.vue'
import ImagePlayer from './ImagePlayer.vue'
import AudioPlayer from './AudioPlayer.vue'
import TimerView from './TimerView.vue'
import QuestionView from './QuestionView.vue'
import AnswersList from './AnswersList.vue'
import ControlsView from './ControlsView.vue'

export default {
  components: {
    BgPicturePlayer,
    VideoPlayer,
    BgndImagePlayer,
    ImagePlayer,
    AudioPlayer,
    TimerView,
    QuestionView,
    AnswersList,
    ControlsView
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {

    },

    showPreloading () {
      this.$refs.answersView.hideAnswers()
      this.$refs.controlsView.hideControls()
    },

    showGameView () {
      this.$refs.controlsView.showControls()
    },

    setQuestionText (txt) {
      this.$refs.questionView.setQuestion(txt)
    },

    showAnswers (items, isInputS, inputSVal) {
      this.$refs.answersView.setAnswers(items, isInputS, inputSVal)
      this.$refs.answersView.showAnswers()
    },

    clearAnswers () {
      this.$refs.answersView.setAnswers([], null)
      this.$refs.answersView.hideAnswers()
    },

    hideAnswers () {
      this.$refs.answersView.hideAnswers()
    },

    setTimer (seconds, mark) {
      this.$refs.timerView.setTimer(seconds, mark)
    },

    clearTimer (seconds) {
      this.$refs.timerView.clearTimer()
    },

    showBgPictures (images) {
      this.$refs.bgPicturePlayer.showBgPictures(images)
    },

    playVideo (name, loop) {
      this.$refs.videoPlayer.playVideo(name, loop)
    },

    stopVideo () {
      this.$refs.videoPlayer.stopVideo()
    },

    playAudio (name, loop, text) {
      this.$refs.audioPlayer.playAudio(name, loop, text)
    },

    stopAudio () {
      this.$refs.audioPlayer.stopAudio()
    },

    showBgndImages (images) {
      this.$refs.bgndImagePlayer.showImages(images)
    },

    clearBgndImages () {
      this.$refs.bgndImagePlayer.clearImages()
    },

    showImages (images) {
      this.$refs.imagePlayer.showImages(images)
    },

    clearImages () {
      this.$refs.imagePlayer.clearImages()
    },

    playAmbient (name, loop) {
      this.$refs.audioPlayer.playAmbient(name)
    },

    playMusic (name, loop) {
      this.$refs.audioPlayer.playMusic(name)
    },

    stopMusic () {
      this.$refs.audioPlayer.stopMusic()
    },

    playBgndMusic (name, loop) {
      this.$refs.audioPlayer.playBgndMusic(name)
    },

    stopBgndMusic () {
      this.$refs.audioPlayer.stopBgndMusic()
    },

    playSFX (name, loop) {
      this.$refs.audioPlayer.playSFX(name)
    },

    stopSFX () {
      this.$refs.audioPlayer.stopSFX()
    },

    processAnswerClick (item) {
      // console.log(item)
      this.$emit('answerClick', item)
    },

    processVideoEnded (name) {
      // console.log('videoEnded', name)
      this.$emit('videoEnded', name)
    },

    processAudioEnded (name) {
      // console.log('audioEnded', name)
      this.$emit('audioEnded', name)
    },

    processSFXEnded (name) {
      // console.log('sfxEnded', name)
      this.$emit('sfxEnded', name)
    },

    processMusicEnded (name) {
      // console.log('musicEnded', name)
      this.$emit('musicEnded', name)
    },

    processBgndMusicEnded (name) {
      // console.log('bgndMusicEnded', name)
      this.$emit('bgndMusicEnded', name)
    },

    processTimeExpired () {
      // console.log('timeExpired')
      this.$emit('timeExpired')
    },

    updateTimerViewPercent (current, total) {
      this.$refs.timerView.updatePercent(current, total)
    },

    restartGame () {
      this.$emit('restartGame')
    },

    saveGame () {
      this.$emit('saveGame')
    },

    loadGame () {
      this.$emit('loadGame')
    },

    /* CHEATS */
    cheatSkip () {
      this.$emit('cheatSkip')
    },

    cheatBack () {
      this.$emit('cheatBack')
    },

    cheatEpisode () {
      console.log('cheatEpisode')
      this.$emit('cheatEpisode')
    },

    donate () {
      console.log('donate')
      this.$emit('donate')
    },

    enablePurchasedCheats () {
      this.$refs.controlsView.enablePurchasedCheats()
    }
  }
}
</script>

<style scoped>

  .main-view {
    overflow: none;
  }
  .audio-container {
    display: none;
  }

  @media screen and (max-aspect-ratio: 13/9) {
    .bg-picture-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 50vh;
      margin: 0;
      padding: 0;
      z-index: -5;
    }

    .video-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 50vh;
      margin: 0;
      padding: 0;
      z-index: -4;
    }

    .bgnd-image-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 50vh;
      margin: 0;
      padding: 0;
      z-index: -3;
    }

    .image-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 50vh;
      margin: 0;
      padding: 0;
      z-index: -2;
    }

    .questions-container {
      position: fixed;
      top: 51vh;
      left: 0;
      width: 100%;
      height: 19vh;
    }

    .timer-container {
      position: fixed;
      top: 70vh;
      left: 0;
      width: 100%;
      height: 1vh;
    }

    .answers-container {
      position: fixed;
      top: 72vh;
      left: 0;
      width: 100%;
      height: 20vh;
    }

    .controls-container {
      position: fixed;
      top: 94vh;
      left: 0;
      width: 100%;
      height: 4vh;
    }
  }

  @media screen and (min-aspect-ratio: 13/9) {
    .bg-picture-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 50vw;
      height: 100%;
      margin: 0;
      padding: 0;
      z-index: -5;
    }

    .video-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 50vw;
      height: 100%;
      margin: 0;
      padding: 0;
      z-index: -4;
    }

    .bgnd-image-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 50vw;
      height: 100%;
      margin: 0;
      padding: 0;
      z-index: -3;
    }

    .image-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 50vw;
      height: 100%;
      margin: 0;
      padding: 0;
      z-index: -2;
    }

    .questions-container {
      position: fixed;
      top: 5vh;
      left: 51vw;
      width: 48vw;
      height: 40vh;
    }

    .timer-container {
      position: fixed;
      top: 48vh;
      left: 50vw;
      width: 48vw;
      height: 1vh;
    }

    .answers-container {
      position: fixed;
      top: 52vh;
      left: 51vw;
      width: 48vw;
      height: 35vh;
    }

    .controls-container {
      position: fixed;
      top: 90vh;
      left: 51vw;
      width: 48vw;
      height: 4vh;
    }
  }
</style>
