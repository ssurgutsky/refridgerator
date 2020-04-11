<template>
  <div></div>
</template>

<script>

import commonUtils from '@/components/utils/CommonUtils.js'

import scenario from '@/assets/data/scenario.json'

export default {
  data: () => ({
    scenario,
    marksDictionary: {},
    scriptsDictionary: {},
    sessions: 0,
    gameData: {},
    currentNode: null,
    prevQuestionNodes: null,
    nextNode: null,
    currentQuestionLabel: '',
    isFinal: false,
    currentAnswers: null,
    inputSVarName: null,
    inputSVarValue: null,
    answerTime: 0,
    timeExpiredMark: '',
    currentVideoSequence: [],
    currentVideoIndex: 0,
    currentAudioSequence: [],
    currentAudioIndex: 0,
    currentBgndImages: null,
    currentImages: null,
    currentAmbientName: '',
    currentMusicSequence: [],
    currentMusicIndex: 0,
    currentSoundFxName: '',
    isNewMusic: false,
    navigateUrl: '',
    episodeNo: 1
  }),
  mounted () {
    // console.log(this.scenario)
    this.prepareData()
  },
  computed: {
    gameScriptsDictionary () {
      const requireContext = require.context('@/assets/scripts', false, /\.(txt|qsp)(\?.*)?$/)
      let result = requireContext.keys().map(file =>
        [file.replace(/(^.\/)|(\.(txt|qsp)(\?.*)?$)/g, ''), requireContext(file)]
      )
        .reduce((scripts, [name, script]) => {
          scripts[name] = script.default || script
          return scripts
        }, {})
      return result
    }
  },
  methods: {
    prepareData () {
      this.createMarksDictionary(scenario)
      // console.log(this.marksDictionary)

      // console.log('this.$debug', this.$debug)
      if (this.$debug) {
        // console.log('gameScriptsDictionary:', this.gameScriptsDictionary)

        commonUtils.runTests()
        this.runTests()

        this.initStore()
      } else {
        document.addEventListener('deviceready', this.initStore)
      }
    },

    initStore () {
      console.log('window.store', window.store)

      if (!window.store) {
        console.log('%c Store not available', 'background: #FF0000; color: #FFFFFF')
        return
      }

      // window.store.verbosity = window.store.DEBUG

      window.store.register({
        id: 'com.kri_games.voenkomat.coin1',
        alias: 'coin1',
        type: window.store.CONSUMABLE
      })

      window.store.register({
        id: 'com.kri_games.voenkomat.episodes',
        alias: 'episodes',
        type: window.store.CONSUMABLE
      })

      // Store global error handler (to see errors in console in Chrome inspect)
      window.store.error(function (error) {
        console.log('%c ERROR ' + error.code + ': ' + error.message, 'background: #FF0000; color: #FFFFFF')
      })

      window.store.refresh()

      this.gameData.store = window.store
    },

    saveGameData () {
      let markName = this.getCurrentNodeFirstMark()
      if (markName) {
        console.log('Saving... markName:', markName)
        localStorage.setItem('markName', markName)

        // Temporary remove IAP store from gameData but remember IAP store link
        let storeLink = this.gameData.store
        this.gameData.store = null

        // Remove Vue's reactivity
        const saveObj = { ...this.gameData }

        // Save the copy to local storage
        localStorage.setItem('gameData', JSON.stringify(saveObj))

        // Restore link to the IAP store
        this.gameData.store = storeLink

        console.log('gameData:', saveObj)
        return true
      }
      return false
    },

    loadGameData () {
      let markName = localStorage.getItem('markName')
      console.log('Loading... markName:', markName)
      if (markName) {
        // Remember link to the IAP store
        let storeLink = this.gameData.store

        // Load data from the local storage
        this.gameData = JSON.parse(localStorage.getItem('gameData'))

        // Restore link to the IAP store
        this.gameData.store = storeLink

        console.log('gameData:', this.gameData)
        this.gotoMark(markName)
        return true
      }
      return false
    },

    savePurchasedItem (purchaseItem) {
      console.log('Saving... purchaseItem:', purchaseItem)
      localStorage.setItem(purchaseItem, true)
    },

    loadPurchasedItem (purchaseItem) {
      console.log('Loading... purchaseItem:', purchaseItem)
      return localStorage.getItem(purchaseItem)
    },

    restartGame () {
      this.currentNode = scenario.node[0].node[0]
      if (this.sessions > 0) {
        let startNode = this.findNodeWithMark(scenario, 'GAME_SAVEPOINT')
        if (startNode) {
          this.currentNode = startNode
        }
      }
      this.sessions++
      this.prevQuestionNodes = []
      this.answerTime = 0
      this.timeExpiredMark = ''
      this.episodeNo = 1
    },

    createMarksDictionary (node) {
      if (node._mark) {
        let marks = node._mark.split(',')
        for (let m in marks) {
          this.marksDictionary[marks[m].trim()] = node
        }
      }
      for (let i in node.node) {
        this.createMarksDictionary(node.node[i])
      }
    },

    findNodeWithMark (node, markName) {
      let trimmedMarkName = markName.trim()
      let result = this.marksDictionary[trimmedMarkName]
      return result
    },

    getCurrentNodeFirstMark () {
      if (this.currentNode && this.currentNode._mark) {
        let marks = this.currentNode._mark.split(',')
        return marks[0]
      }
      return null
    },

    processGOTONode (node) {
      let result = node

      // console.log('1.Node content BEFORE eval:', this.currentNode._content)
      result._parsedContent = this.evalString(result._content)
      // console.log('1.Node content AFTER eval:', this.currentNode._parsedContent)

      let markNames = commonUtils.getTagValueGOTO(result._parsedContent)
      // console.log('GameModel::markNames', markNames)

      while (markNames.length > 0) {
        let markName = commonUtils.getArrayRandomElement(markNames)
        result = this.findNodeWithMark(scenario, markName)
        if (!result) {
          console.log('Cant find mark in scenario!', markName)
          return node
        }

        //        console.log('2.Node content BEFORE eval:', this.currentNode._content)
        result._parsedContent = this.evalString(result._content)
        //        console.log('2.Node content AFTER eval:', this.currentNode._parsedContent)

        markNames = commonUtils.getTagValueGOTO(result._parsedContent)
      }
      return result
    },

    prepareCurrentQuestion () {
      this.prevQuestionNodes.push(this.currentNode)

      this.currentNode = this.processGOTONode(this.currentNode)

      const saveObj = { ...this.gameData }
      this.currentNode._gameData = JSON.parse(JSON.stringify(saveObj))

      // console.log('gameData:', this.gameData)

      let label = commonUtils.getTagValueFINAL(this.currentNode._parsedContent)
      this.isFinal = label !== ''
      if (!this.isFinal) {
        label = commonUtils.getTagValueLABEL(this.currentNode._parsedContent)
      }

      this.currentQuestionLabel = label

      this.navigateUrl = commonUtils.getTagValueNAVIGATEURL(this.currentNode._parsedContent)

      this.purchaseItem = commonUtils.getTagValuePURCHASE(this.currentNode._parsedContent)
      console.log('purchaseItem:', this.purchaseItem)

      const bgndImagesSequence = commonUtils.getTagValueBGNDIMAGE(this.currentNode._parsedContent)
      this.currentBgndImages = commonUtils.getArrayRandomElement(bgndImagesSequence)

      const imagesSequence = commonUtils.getTagValueIMAGE(this.currentNode._parsedContent)
      this.currentImages = commonUtils.getArrayRandomElement(imagesSequence)

      this.currentVideoSequence = commonUtils.getTagValueVIDEO(this.currentNode._parsedContent)
      this.currentVideoIndex = 0
      this.currentAudioSequence = commonUtils.getTagValueAUDIO(this.currentNode._parsedContent)
      this.currentAudioIndex = 0

      this.currentAmbientName = commonUtils.getTagValueAMBIENT(this.currentNode._parsedContent)

      this.currentSoundFxName = commonUtils.getTagValueSOUNDFX(this.currentNode._parsedContent)

      this.processNodeMusic(this.currentNode)
    },

    hasEmptyQuestion () {
      return (this.currentNode._content === '')
    },

    prepareAfterQuestion () {
      this.currentVideoSequence = commonUtils.getTagValueBGNDVIDEO(this.currentNode._parsedContent)
      this.currentVideoIndex = 0
      this.currentAudioSequence = commonUtils.getTagValueBGNDAUDIO(this.currentNode._parsedContent)
      this.currentAudioIndex = 0
    },

    getCurrentQuestionLabel () {
      return this.currentQuestionLabel
    },

    getCurrentNavigateUrl () {
      return this.navigateUrl
    },

    getCurrentVideoName () {
      let result = this.currentVideoSequence[this.currentVideoIndex]
      return result
    },

    getCurrentAudioName () {
      let result = this.currentAudioSequence[this.currentAudioIndex]
      return result
    },

    getCurrentAmbientName () {
      return this.currentAmbientName
    },

    getCurrentMusicName () {
      let result = this.currentMusicSequence[this.currentMusicIndex]
      return result
    },

    setNextVideo () {
      this.currentVideoIndex++
    },

    setNextAudio () {
      this.currentAudioIndex++
    },

    setNextRandomMusic () {
      if (this.hasMusicEmpty()) return
      const oldIndex = this.currentMusicIndex

      while (this.currentMusicSequence.length > 1 && oldIndex === this.currentMusicIndex) {
        this.currentMusicIndex = commonUtils.getArrayRandomIndex(this.currentMusicSequence)
      }
    },

    setCurrentVideoIndex (value) {
      this.currentVideoIndex = value
    },

    setCurrentAudioIndex (value) {
      this.currentAudioIndex = value
    },

    setCurrentMusicIndex (value) {
      this.currentMusicIndex = value
    },

    hasCurrentVideo () {
      return this.currentVideoSequence.length > this.currentVideoIndex
    },

    hasCurrentAudio () {
      return this.currentAudioSequence.length > this.currentAudioIndex
    },

    hasCurrentMusic () {
      return this.currentMusicSequence.length > this.currentMusicIndex
    },

    hasVideoEmpty () {
      return this.currentVideoSequence.length === 0
    },

    hasAudioEmpty () {
      return this.currentAudioSequence.length === 0
    },

    hasMusicEmpty () {
      return this.currentMusicSequence.length === 0
    },

    prepareCurrentAnswers () {
      this.currentAnswers = []

      if (!this.currentNode.node) return

      let totalAnswersCount = this.currentNode.node.length

      // Check INPUTS tag
      let gotoNode = this.processGOTONode(this.currentNode.node[0])
      this.inputSVarName = commonUtils.getTagValueINPUTS(gotoNode._parsedContent)
      this.inputSVarValue = this.getGameDataVarValue(this.inputSVarName)

      // console.log('gameData:', this.gameData)

      if (totalAnswersCount === 1 && this.inputSVarName !== '') {
        this.currentAnswers.push({id: 0, text: 'inputS', node: gotoNode, nextNode: gotoNode.node})
      } else {
        for (let i in this.currentNode.node) {
          let gotoNode = this.processGOTONode(this.currentNode.node[i])

          let text = commonUtils.getTagValueLABEL(gotoNode._parsedContent)

          if (totalAnswersCount > 1 && text === '') continue

          this.currentAnswers.push({id: i, text: text, node: gotoNode, nextNode: gotoNode.node})
        }

        let answersOrder = commonUtils.getTagValueANSWERSORDER(this.currentNode._parsedContent)
        if (answersOrder.toUpperCase() !== 'OFF' && !this.$debug) {
          commonUtils.shuffle(this.currentAnswers)
        }
      }

      this.answerTime = commonUtils.getTagValueANSWERTIME(this.currentNode._parsedContent)
      this.timeExpiredMark = commonUtils.getTagValueTIMEEXPIRED(this.currentNode._parsedContent)
    },

    hasEmptyAnswer () {
      const result = (this.currentAnswers.length === 1 && this.currentAnswers[0].text === '' && !this.inputSVarName)
      return result
    },

    getCurrentAnswers () {
      return this.currentAnswers
    },

    getAnswerTime () {
      return this.answerTime || 0
    },

    setInputSVarValue (value) {
      this.inputSVarValue = value
    },

    setAnswerById (id) {
      const item = this.currentAnswers.filter(item => {
        return item.id === id
      })

      if (this.inputSVarName !== '' && this.inputSVarValue !== '') {
        this.setGameDataVarValue(this.inputSVarName, this.inputSVarValue)
        // console.log('INPUTS:', this.inputSVarName + ' = ' + this.getGameDataVarValue(this.inputSVarName))
      }

      this.currentNode = item[0].node
      this.currentVideoSequence = commonUtils.getTagValueVIDEO(this.currentNode._parsedContent)
      this.currentVideoIndex = 0
      this.currentAudioSequence = commonUtils.getTagValueAUDIO(this.currentNode._parsedContent)
      this.currentAudioIndex = 0

      const imagesSequence = commonUtils.getTagValueIMAGE(this.currentNode._parsedContent)
      this.currentImages = commonUtils.getArrayRandomElement(imagesSequence)

      this.nextNode = this.currentNode.node[0]

      this.currentAmbientName = commonUtils.getTagValueAMBIENT(this.currentNode._parsedContent)
      this.currentSoundFxName = commonUtils.getTagValueSOUNDFX(this.currentNode._parsedContent)

      this.processNodeMusic(this.currentNode)
    },

    processNodeMusic (node) {
      const musicSequence = commonUtils.getTagValueMUSIC(node._parsedContent)
      this.isNewMusic = musicSequence.length > 0
      if (this.isNewMusic) {
        this.currentMusicSequence = musicSequence
        this.currentMusicIndex = 0
      }
    },

    setNextQuestion () {
      this.currentNode = this.nextNode
    },

    setPrevQuestion () {
      //      console.log(this.prevQuestionNodes)
      this.currentNode = this.prevQuestionNodes.pop()
      if (this.prevQuestionNodes.length) {
        this.currentNode = this.prevQuestionNodes.pop()
        this.gameData = JSON.parse(JSON.stringify(this.currentNode._gameData))
      }
    },

    setEpisode () {
      console.log('setEpisode', this.episodeNo)
      const episodeNode = this.findNodeWithMark(scenario, 'EPISODE' + this.episodeNo)
      if (episodeNode) {
        this.currentNode = episodeNode
        this.episodeNo++
      } else {
        this.episodeNo = 1
        this.setEpisode()
      }
    },

    gotoMark (markName) {
      console.log('gotoMark', markName)
      const gotoNode = this.findNodeWithMark(scenario, markName)
      if (gotoNode) {
        this.currentNode = gotoNode
      } else {
        console.log('Cant find mark name', markName)
      }
    },

    processTimeExpired () {
      if (this.timeExpiredMark !== '') {
        let gotoNode = this.findNodeWithMark(scenario, this.timeExpiredMark)
        if (gotoNode) {
          this.currentNode = gotoNode
        }
      }
    },

    evalString (str) {
      return commonUtils.evalString.call(this.gameData, str, this.gameScriptsDictionary)
    },

    setGameDataVarValue (varName, varValue) {
      this.gameData[varName.replace('this.', '')] = varValue
    },

    getGameDataVarValue (varName) {
      let result = this.gameData[varName.replace('this.', '')]
      return result
    },

    runTests () {
      let input = 'Mark_Final1'
      let output = true
      let result = this.findNodeWithMark(scenario, 'Mark_Final1') !== null
      commonUtils.checkCondition(input, output, result)

      this.gameData = {a: 1}
      input = 'test_{this.a=2;let b=3;this.a=b;"";}'
      output = 'test_'
      result = this.evalString(input)
      commonUtils.checkCondition(input, output, result)

      input = '{if (Math.random() < 0.5) this.actorName="rock"; else this.actorName="kanye";"";}Hey brother stop!'
      output = 'Hey brother stop!'
      result = this.evalString(input)
      commonUtils.checkCondition(input, output, result)

      // Clear after tests
      this.gameData = {}
    }
  }
}
</script>
