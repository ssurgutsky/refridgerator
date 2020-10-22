<template>
  <div :style="styleControls">
    <button @click="onRestartClick">RESTART</button>
    <button :style="styleObjectCheat" v-show="isSaveButton" @click="onSaveClick">SAVE</button>
    <button :style="styleObjectCheat" v-show="isLoadButton" @click="onLoadClick">LOAD</button>
    <button :style="styleObjectCheat" v-show="isCheatPurchased || isSkipButton" @click="onSkipClick">SKIP</button>
    <button :style="styleObjectCheat" v-show="isBackButton" @click="onBackClick">BACK</button>
    <button :style="styleObjectCheat" v-show="isCheatPurchased || isEpisodesButton" @click="onEpisodeClick">EPISODE</button>
    <button :style="styleObjectCheat" v-show="isDonateButton" @click="onDonateClick">DONATE</button>
  </div>
</template>

<script>

import Settings from '@/components/Settings.js'

export default {
  data () {
    return {
      styleControls: {
        visibility: 'hidden'
      },
      // Hide cheat button in release
      styleObjectCheat: {
        display: this.$debug ? 'auto' : 'none'
      },
      // Can buy this cheat to enable button
      isCheatPurchased: this.$debug,
      isSaveButton: Settings.ENABLE_SAVE_BUTTON || this.$debug,
      isLoadButton: Settings.ENABLE_LOAD_BUTTON || this.$debug,
      isBackButton: Settings.ENABLE_BACK_BUTTON || this.$debug,
      isEpisodesButton: Settings.ENABLE_EPISODES_BUTTON || this.$debug,
      isSkipButton: Settings.ENABLE_SKIP_BUTTON || this.$debug,
      isDonateButton: Settings.ENABLE_DONATE_BUTTON || this.$debug
    }
  },
  methods: {

    showControls () {
      this.styleControls.visibility = 'visible'
    },

    hideControls () {
      this.styleControls.visibility = 'hidden'
    },

    onRestartClick () {
      console.log('RESTART')
      this.$emit('restartGame')
    },

    onSaveClick () {
      console.log('saveGame')
      this.$emit('saveGame')
    },

    onLoadClick () {
      console.log('loadGame')
      this.$emit('loadGame')
    },

    onBackClick () {
      console.log('cheatBack')
      this.$emit('cheatBack')
    },

    onSkipClick () {
      console.log('cheatSkip')
      this.$emit('cheatSkip')
    },

    onEpisodeClick () {
      console.log('cheatEpisode')
      this.$emit('cheatEpisode')
    },

    onDonateClick () {
      console.log('donate')
      this.$emit('donate')
    },

    enablePurchasedCheats () {
      console.log('enablePurchasedCheats')
      this.isCheatPurchased = true
    }
  }
}
</script>

<style scoped>
</style>
