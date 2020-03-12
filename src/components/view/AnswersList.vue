<template>
  <div>
    <RecycleScroller :style="styleObjectList" class="scroller" :items="items" :item-size="40">
      <template v-slot="{ item }">
        <div class="item" :class="item.isActive ? 'active' : ''" @click="onAnswerClick(item)">{{ item.text }}</div>
      </template>
    </RecycleScroller>
    <input :style="styleObjectInput" id="inputS" class="input-style" ref="inputS" v-model="inputS" placeholder="input / набирай" v-on:keyup.enter="onEnter">
  </div>
</template>

<script>

export default {
  data () {
    return {
      items: [],
      isInputS: false,
      styleObjectList: {
        'visibility': 'none',
        'overflow-y': 'scroll'
      },
      styleObjectInput: {
        'visibility': 'none'
      },
      isBlocked: false,
      inputS: ''
    }
  },
  methods: {
    setAnswers (items, isInputS, inputSVal) {
      this.isInputS = isInputS
      this.inputSVal = inputSVal

      this.isBlocked = false

      this.items = items
      if (this.items.length) {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].isActive = i === 0
        }
      }
    },

    onAnswerClick (item) {
      console.log('onAnswerClick')
      item.inputS = ''

      // if (this.isBlocked) return

      this.isBlocked = true
      if (this.items.length) {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].isActive = item.id === this.items[i].id
        }
      }
      //      setTimeout(this.dispatchAnswerClick, 1000, item)

      this.dispatchAnswerClick(item)
    },

    onEnter () {
      console.log(this.inputS)

      if (this.inputS === '') return

      let item = this.items[0]
      item.inputS = this.inputS

      this.copyInputSToClipboard()

      this.dispatchAnswerClick(item)
    },

    dispatchAnswerClick (item) {
      this.$emit('answerClick', item)
    },

    showAnswers () {
      if (this.isInputS) {
        this.inputS = ''
        this.styleObjectInput.visibility = 'visible'
        this.styleObjectList.visibility = 'hidden'
        this.styleObjectList.height = 0
        setTimeout(() => {
          this.inputS = this.inputSVal
          this.$refs.inputS.focus()
        }, 10)
      } else {
        this.styleObjectInput.visibility = 'hidden'
        this.styleObjectList.visibility = 'visible'
        this.styleObjectList.height = '100%'
      }
    },

    hideAnswers () {
      this.styleObjectInput.visibility = 'hidden'
      this.styleObjectList.visibility = 'hidden'
    },

    copyInputSToClipboard () {
      let testingCodeToCopy = document.querySelector('#inputS')
      testingCodeToCopy.setAttribute('type', 'text')
      testingCodeToCopy.select()

      try {
        document.execCommand('copy')
      } catch (err) {
      }
    }
  }
}
</script>

<style scoped>
  div {
    background-color: #000000;
    color: #000000;
  }

  .scroller {
    background-color: #ffffff;
    height: 100%;
  }

  .item {
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
  }

  .active {
    background: rgba(0, 0, 255, 0.1);
  }

  .input-style {
    margin-top: 0;
    justify-content: top;
    font-size: 200%;
    width: 95%;
    text-align: center;
  }

</style>
