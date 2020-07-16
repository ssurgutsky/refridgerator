<template>
  <div>
    <MainView
      @answerClick="processAnswer"
      @videoEnded="processVideoEnded"
      @audioEnded="processAudioEnded"
      @musicEnded="processMusicEnded"
      @restartGame="restartGame"
      @saveGame="saveGame"
      @loadGame="loadGame"
      @timeExpired="processTimeExpired"
      @cheatSkip="cheatSkip"
      @cheatBack="cheatBack"
      @cheatEpisode="cheatEpisode"
      ref="mainView"
    >
    </MainView>
    <GameModel ref="gameModel"></GameModel>
  </div>
</template>

<script>
import CacheController from '@/components/controller/CacheController.js'
import MainView from '@/components/view/MainView.vue'
import GameModel from '@/components/model/GameModel.vue'

export default {
  components: {
    MainView,
    GameModel
  },
  data () {
    return {
      mainView: null,
      gameModel: null,

      mode: 0,
      MODE_QUESTION: 1,
      MODE_AFTER_QUESTION: 2,
      MODE_ANSWER: 3,

      PURCHASE_ITEM_CHEATS: 'cheats'
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.mainView = this.$refs.mainView
      this.gameModel = this.$refs.gameModel

      this.loadPurchasedItems()

      this.mainView.showPreloading()
      this.onPreloadingUpdate()
      this.mainView.showImages('logo.jpg')

      CacheController.setPreloadingCallback(this.onPreloadingUpdate)
      this.onPreloadingUpdate()
      CacheController.loadAssets().then(res => {
        // console.log('cachedData:', CacheController.gameAssets)
        setTimeout(() => {
          this.assetsCached()
        }, 1000)
      })
    },

    onPreloadingUpdate (obj) {
      let text = 'Loading...'
      if (obj) {
        if (obj.current === obj.total) {
          text = text + ' done!'
        } else {
          text = text + obj.current + '/' + obj.total
          this.mainView.updateTimerViewPercent(obj.current, obj.total)
        }
      }
      this.mainView.setQuestionText(text)
    },

    assetsCached () {
      // Start the game once all assets have been cached
      this.mainView.showGameView()
      let jsonObj = CacheController.getAssetByName(CacheController.CATEGORY_DATA, 'scenario.json')
      // console.log('=======', jsonObj)
      this.gameModel.scenario = JSON.parse(jsonObj)
      // console.log('========', this.gameModel.scenario)
      this.gameModel.prepareData()
      this.restartGame()
    },

    loadPurchasedItems () {
      let value = this.gameModel.loadPurchasedItem(this.PURCHASE_ITEM_CHEATS)
      console.log('this.purchaseItems:', this.PURCHASE_ITEM_CHEATS, value)
      if (value) {
        this.mainView.enablePurchasedCheats()
      }
    },

    restartGame () {
      console.log('Restart')
      this.mainView.clearTimer()
      this.gameModel.restartGame()
      this.showCurrentQuestion()
    },

    showCurrentQuestion () {
      this.gameModel.prepareCurrentQuestion()
      this.mainView.clearAnswers()

      console.log('Q:', this.gameModel.getCurrentQuestionLabel())

      this.mainView.setQuestionText(this.gameModel.getCurrentQuestionLabel())

      // User purchased some of cheat buttons
      console.log('GC:purchaseItem:', this.PURCHASE_ITEM_CHEATS, this.gameModel.purchaseItem)
      if (this.gameModel.purchaseItem === this.PURCHASE_ITEM_CHEATS) {
        console.log('Save:purchaseItem:', this.PURCHASE_ITEM_CHEATS, this.gameModel.purchaseItem)
        this.mainView.enablePurchasedCheats()
        this.gameModel.savePurchasedItem(this.gameModel.purchaseItem)
      }

      if (this.gameModel.getCurrentNavigateUrl()) {
        console.log(this.gameModel.getCurrentNavigateUrl())
        // navigator.app.loadUrl(this.gameModel.getCurrentNavigateUrl(), {openExternal: true})
        // window.location = this.gameModel.getCurrentNavigateUrl()
        window.open(this.gameModel.getCurrentNavigateUrl(), '_system')
        // location.replace(this.gameModel.getCurrentNavigateUrl())
      }

      this.mode = this.MODE_QUESTION
      this.playVideoAndAudio()

      this.mainView.clearBgndImages()
      this.clearAndShowImages()

      this.playAmbient()
      this.playSoundFx()
      this.playMusic()
    },

    showAfterQuestion () {
      console.log('>>>after question')

      this.gameModel.prepareAfterQuestion()

      this.mode = this.MODE_AFTER_QUESTION

      this.playVideoAndAudio()
      this.clearAndShowBgndImages()
      this.mainView.clearImages()
    },

    showCurrentAnswers () {
      if (this.gameModel.isFinal) return

      this.gameModel.prepareCurrentAnswers()

      let isInputS = this.gameModel.inputSVarName !== ''
      let inputSVal = this.gameModel.inputSVarValue

      this.mainView.showAnswers(this.gameModel.getCurrentAnswers(), isInputS, inputSVal)
      this.mainView.setTimer(this.gameModel.getAnswerTime())
    },

    processAnswer (item) {
      console.log('>>>process answer', item.text)

      this.mainView.setQuestionText('')

      this.gameModel.setInputSVarValue(item.inputS)

      this.gameModel.setAnswerById(item.id)
      this.mainView.clearTimer()
      this.mainView.clearAnswers()

      this.mainView.clearBgndImages()
      this.clearAndShowImages()

      this.playAmbient()
      this.playSoundFx()
      this.playMusic()

      this.mode = this.MODE_ANSWER
      this.playVideoAndAudio()
    },

    processVideoEnded (name) {
      console.log('video ended:', name)
      this.gameModel.setNextVideo()
      if (!this.playVideoSequence()) {
        this.processVideoAndAudioEnding()
      }
    },

    processAudioEnded (name) {
      console.log('audio ended:', name)
      this.gameModel.setNextAudio()
      if (!this.playAudioSequence()) {
        this.processVideoAndAudioEnding()
      }
    },

    playVideoAndAudio () {
      let hasVideoEmpty = this.gameModel.hasVideoEmpty()
      let hasAudioEmpty = this.gameModel.hasAudioEmpty()

      if (hasVideoEmpty && hasAudioEmpty) {
        this.processVideoAndAudioEnding()
        return
      }

      if (!hasVideoEmpty) {
        this.playVideoSequence()
      }
      if (!hasAudioEmpty) {
        this.playAudioSequence()
      }
    },

    playVideoSequence () {
      if (!this.gameModel.hasCurrentVideo() && this.mode === this.MODE_QUESTION && !this.gameModel.isFinal) {
        this.gameModel.setCurrentVideoIndex(0)
      }

      if (!this.gameModel.hasCurrentVideo() && this.mode === this.MODE_AFTER_QUESTION) {
        this.gameModel.setCurrentVideoIndex(0)
      }

      if (this.gameModel.hasCurrentVideo()) {
        this.mainView.playVideo(this.gameModel.getCurrentVideoName(), false)
        return true
      }
      return false
    },

    playAudioSequence () {
      if (!this.gameModel.hasCurrentAudio() && this.mode === this.MODE_AFTER_QUESTION) {
        this.gameModel.setCurrentAudioIndex(0)
      }

      if (this.gameModel.hasCurrentAudio()) {
        this.mainView.playAudio(this.gameModel.getCurrentAudioName(), false)
        return true
      }
      return false
    },

    processVideoAndAudioEnding () {
      let hasVideoPlaying = this.gameModel.hasCurrentVideo()
      let hasAudioPlaying = this.gameModel.hasCurrentAudio()
      let hasVideoEmpty = this.gameModel.hasVideoEmpty()
      let hasAudioEmpty = this.gameModel.hasAudioEmpty()

      console.log(this.mode, hasVideoPlaying, hasAudioPlaying, hasVideoEmpty, hasAudioEmpty)

      if (this.mode === this.MODE_QUESTION) {
        if (
          (hasVideoEmpty && hasAudioEmpty) ||
          (hasVideoEmpty && !hasAudioPlaying) ||
          (hasAudioEmpty && !hasVideoPlaying) ||
          (hasVideoPlaying && !hasAudioPlaying && !this.gameModel.isFinal) ||
          (!hasVideoPlaying && !hasAudioPlaying)
        ) {
          console.log('case1')

          this.mainView.stopVideo()
          this.mainView.stopAudio()

          this.showCurrentAnswers()
          if (!this.gameModel.isFinal) {
            this.showAfterQuestion()
          }
          return
        }
      }

      if (this.mode === this.MODE_AFTER_QUESTION) {
        if (!hasVideoPlaying && !hasAudioPlaying) {
          if (this.gameModel.hasEmptyAnswer()) {
            console.log('case2')
            this.processAnswer(this.gameModel.getCurrentAnswers()[0])
            return
          }
        }
      }

      if (this.mode === this.MODE_ANSWER) {
        if (
          (hasVideoEmpty && hasAudioEmpty) ||
          (hasVideoEmpty && !hasAudioPlaying) ||
          (hasAudioEmpty && !hasVideoPlaying) ||
          (!hasVideoPlaying && !hasAudioPlaying)
        ) {
          console.log('case3')
          this.mainView.stopVideo()
          this.mainView.stopAudio()
          this.gameModel.setNextQuestion()
          this.showCurrentQuestion()
        }
      }
    },

    clearAndShowBgndImages () {
      // Hide video screen if there is no video but there is a background image
      let hasVideoEmpty = this.gameModel.hasVideoEmpty()
      if (hasVideoEmpty && this.gameModel.currentBgndImages) {
        this.mainView.playVideo('NONE', false)
      }

      this.mainView.clearBgndImages()
      this.mainView.showBgndImages(this.gameModel.currentBgndImages)
    },

    clearAndShowImages () {
      // Hide video screen if there is no video but there is a background image
      let hasVideoEmpty = this.gameModel.hasVideoEmpty()
      if (hasVideoEmpty && this.gameModel.currentImages) {
        this.mainView.playVideo('NONE', false)
      }

      this.mainView.clearImages()
      this.mainView.showImages(this.gameModel.currentImages)
    },

    playAmbient () {
      let name = this.gameModel.getCurrentAmbientName()
      this.mainView.playAmbient(name)
    },

    playSoundFx () {
      let name = this.gameModel.currentSoundFxName
      if (name && name !== '') {
        this.mainView.playSFX(name)
      }
    },

    playMusic (isNextRandomMusic) {
      if (this.gameModel.hasMusicEmpty()) return

      if (!this.gameModel.isNewMusic && !isNextRandomMusic) return

      this.gameModel.setNextRandomMusic()

      let name = this.gameModel.getCurrentMusicName()
      this.mainView.playMusic(name)
    },

    processMusicEnded (name) {
      console.log('music ended:', name)
      this.playMusic(true)
    },

    processTimeExpired () {
      console.log('Time expired!')
      this.gameModel.processTimeExpired()
      this.showCurrentQuestion()
    },

    saveGame () {
      if (!this.gameModel.saveGameData()) {
        console.log('Cant save game!')
      }
    },

    loadGame () {
      if (this.gameModel.loadGameData()) {
        this.mainView.stopVideo()
        this.mainView.stopAudio()
        this.mainView.clearTimer()
        this.showCurrentQuestion()
      } else {
        console.log('Cant load game!')
      }
    },

    /* CHEATS */
    cheatSkip () {
      if (this.mode === this.MODE_QUESTION) {
        this.mainView.stopVideo()
        this.mainView.stopAudio()
        this.showCurrentAnswers()
        if (!this.gameModel.isFinal) {
          this.showAfterQuestion()
        }
      }
      if (this.mode === this.MODE_ANSWER) {
        this.mainView.stopVideo()
        this.mainView.stopAudio()
        this.gameModel.setNextQuestion()
        this.showCurrentQuestion()
      }
    },

    cheatBack () {
      this.mainView.stopVideo()
      this.mainView.stopAudio()
      this.mainView.clearTimer()
      this.gameModel.setPrevQuestion()
      this.showCurrentQuestion()
    },

    cheatEpisode () {
      this.mainView.stopVideo()
      this.mainView.stopAudio()
      this.mainView.clearTimer()
      this.gameModel.setEpisode()
      this.showCurrentQuestion()
    }

  }
}
</script>
