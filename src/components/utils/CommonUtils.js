/* eslint no-eval: 0 */
import CacheController from '@/components/controller/CacheController.js'
export default {
  ALL_TAGS: [
    'LABEL',
    'INPUTS',
    'FINAL',
    'GOTO',
    'NAVIGATEURL',
    'PURCHASE',
    'VIDEO',
    'AUDIO',
    'BGNDVIDEO',
    'BGNDAUDIO',
    'BGNDIMAGE',
    'IMAGE',
    'AMBIENT',
    'SOUNDFX',
    'MUSIC',
    'BGNDMUSIC',
    'ANSWERSORDER',
    'ANSWERTIME',
    'TIMEEXPIRED',
    'ANSWERIMAGE'
  ],

  getTagValueLABEL (content) {
    let result = this.getTagValue(content, 'LABEL')
    // console.log('getTagValueLABEL1::', result)
    result = this.removeBrackets(result, '[', ']')
    // console.log('getTagValueLABEL2::', result)
    return result
  },

  getTagValueINPUTS (content) {
    return this.getTagValue(content, 'INPUTS')
  },

  getTagValueANSWERSORDER (content) {
    return this.getTagValue(content, 'ANSWERSORDER')
  },

  getTagValueANSWERTIME (content) {
    return this.getTagValue(content, 'ANSWERTIME')
  },

  getTagValueTIMEEXPIRED (content) {
    return this.getTagValue(content, 'TIMEEXPIRED')
  },

  getTagValueFINAL (content) {
    return this.getTagValue(content, 'FINAL')
  },

  getTagValueGOTO (content) {
    return this.getTagValueSequence(content, 'GOTO')
  },

  getTagValueNAVIGATEURL (content) {
    return this.getTagValue(content, 'NAVIGATEURL')
  },

  getTagValuePURCHASE (content) {
    console.log(content)
    return this.getTagValue(content, 'PURCHASE')
  },

  getTagValueVIDEO (content) {
    return this.getTagValueVideoSequence(content, 'VIDEO')
  },

  getTagValueAUDIO (content) {
    return this.getTagValueAudioSequence(content, 'AUDIO')
  },

  getTagValueBGNDVIDEO (content) {
    return this.getTagValueVideoSequence(content, 'BGNDVIDEO')
  },

  getTagValueBGNDAUDIO (content) {
    return this.getTagValueVideoSequence(content, 'BGNDAUDIO')
  },

  getTagValueBGNDIMAGE (content) {
    return this.getTagValueSequence(content, 'BGNDIMAGE')
  },

  getTagValueIMAGE (content) {
    return this.getTagValueSequence(content, 'IMAGE')
  },

  getTagValueAMBIENT (content) {
    return this.getTagValue(content, 'AMBIENT').replace('.mp3', '')
  },

  getTagValueSOUNDFX (content) {
    return this.getTagValue(content, 'SOUNDFX').replace('.mp3', '')
  },

  getTagValueMUSIC (content) {
    return this.getTagValueAudioSequence(content, 'MUSIC')
  },

  getTagValueBGNDMUSIC (content) {
    return this.getTagValueAudioSequence(content, 'BGNDMUSIC')
  },

  getTagValueHIDEANSWERS (content) {
    return this.getTagValue(content, 'HIDEANSWERS')
  },

  getTagValueVideoSequence (content, tagName) {
    const sequence = this.getTagValueSequence(content, tagName)
    const result = sequence.map(item => item.trim().replace('.mp4', '').replace('.flv', ''))
    return result
  },

  getTagValueAudioSequence (content, tagName) {
    const sequence = this.getTagValueSequence(content, tagName)
    const result = sequence.map(item => item.trim().replace('.mp3', ''))
    return result
  },

  getTagValueSequence (content, tagName) {
    let sequence = this.getTagValue(content, tagName)
    if (sequence === '') {
      return []
    }
    let result = []
    if (sequence.indexOf('||') >= 0) {
      // by random
      result = sequence.split('||')
      result = this.shuffle(result)
    } else {
      // by sequence
      result = sequence.split(',')
    }
    return result
  },

  getTagValue (content, tagName) {
    let result = ''
    let subresult = ''
    // console.log('getTagValue::tagName', tagName)
    // console.log('getTagValue::content', content)
    let tmp = content.split('[' + tagName + ' ')
    // console.log(tagName, 'getTagValue::tmp', tmp)
    if (tmp[1]) {
      let isFound = false
      let tagValue = tmp[1]
      // console.log('getTagValue::tagValue', tagValue)
      // console.log('getTagValue::ALL_TAGS', this.ALL_TAGS)
      for (let i = 0; i < this.ALL_TAGS.length; i++) {
        let tag = this.ALL_TAGS[i]
        // console.log('getTagValue::tag', tag)
        if (tag !== tagName) {
          let tmp2 = tagValue.split(']][' + tag + ' ')
          if (tmp2.length === 1) {
            tmp2 = tagValue.split('][' + tag + ' ')
          }
          // console.log('getTagValue::tmp2', tmp2)
          if (tmp2.length > 1) {
            subresult = tmp2[0]
            // console.log('getTagValue::result', result, tag)
            isFound = true
            if (subresult.length < result.length || result === '') {
              result = subresult
            }
          } else {
            let tmp3 = tagValue.split('[' + tag + ' ')
            if (tmp3.length > 1) {
              subresult = tmp3[0]
              // console.log('getTagValue::result3', result, tag)
              isFound = true
              if (subresult.length < result.length || result === '') {
                result = subresult
              }
            }
          }
        }
      }
      // console.log('getTagValue::isFound', isFound)
      if (!isFound) {
        let pos = tagValue.lastIndexOf(']')
        if (tagName === 'LABEL') {
          if (pos >= 0) {
            // console.log('getTagValue::pos', pos, tagValue.substring(0, pos), tagValue.substring(pos + 1))
            result = tagValue.substring(0, pos) + '' + tagValue.substring(pos + 1)
            // console.log('getTagValue::result2', result)
          }
        } else {
          pos = tagValue.indexOf(']')
          if (pos >= 0) {
            // console.log('getTagValue::pos', pos, tagValue.substring(0, pos))
            result = tagValue.substring(0, pos)
            // console.log('getTagValue::result2', result)
          }
        }
      }
    }
    return result
  },

  getArrayRandomElement (arr) {
    if (arr && arr.length) {
      return arr[Math.floor(Math.random() * arr.length)]
    }
    // The undefined will be returned if the empty array was passed
  },

  getArrayRandomIndex (arr) {
    return Math.floor(Math.random() * arr.length)
    // The undefined will be returned if the empty array was passed
  },

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  shuffle (a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  },

  cloneObject (obj) {
    return JSON.parse(JSON.stringify(obj))
  },

  evalString (___str___) {
    // {{a=b}{c=d}{if (a=d) {d=b;{script test.qsp}}}}{script test2.qsp}

    let result = ___str___

    let preresult = ___str___

    const SCRIPT_KEYWORD = '{script '
    const SCRIPT_EXTENSION = '.qsp'
    const SCRIPT_SUFFIX = '}'

    // Replace all texts like {script name.qsp} to their bodies
    // console.log('preresult BEFORE:', preresult)
    let hasScript = false
    let firstRun = true
    while (hasScript || firstRun) {
      firstRun = false
      let pb = preresult.indexOf(SCRIPT_KEYWORD)
      hasScript = pb >= 0
      if (hasScript) {
        let bl = 0
        let hasScriptEnding = false
        while (pb + bl < preresult.length) {
          hasScriptEnding = preresult[pb + bl] === SCRIPT_SUFFIX
          if (hasScriptEnding) break
          bl++
        }

        if (hasScriptEnding) {
          let scriptStr = preresult.substr(pb, bl + 1)
          console.log('SCRIPT STR:', scriptStr)
          let scriptName = scriptStr
            .replace(SCRIPT_KEYWORD, '')
            .replace(SCRIPT_EXTENSION, '')
            .replace(SCRIPT_SUFFIX, '')
            .trim()

          // console.log('SCRIPT NAME:', scriptName)
          let scriptBody = CacheController.getAssetByName(CacheController.CATEGORY_SCRIPTS, scriptName)
          if (!scriptBody) {
            console.log('Script not found!', scriptName)
          }

          scriptBody = '{' + scriptBody + '}'
          // console.log('=============', scriptBody)

          preresult = preresult.replace(scriptStr, scriptBody)
          // console.log('replacing:', scriptStr, scriptBody)
        }
      }
    }
    // console.log('preresult AFTER:', preresult)

    let arr = []
    let bracesLeft = 0
    let startPos = 0
    let endPos = 0
    for (let i = 0; i < preresult.length; i++) {
      if (preresult[i] === '{') {
        if (bracesLeft === 0) {
          startPos = i
        }
        bracesLeft++
      }
      if (preresult[i] === '}') {
        bracesLeft--
        if (bracesLeft < 0) {
          console.log('Incorrect string!', preresult)
        }
        if (bracesLeft === 0) {
          endPos = i
          arr.push({startPos: startPos, endPos: endPos})
        }
      }
    }
    // console.log('arr', arr)

    if (arr.length) {
      result = ''
      let lastEnd = 0
      for (let i = 0; i < arr.length; i++) {
        let obj = arr[i]
        let start = obj.startPos
        let end = obj.endPos
        let length = end - start + 1
        result = result + preresult.substr(lastEnd, start - lastEnd)
        let jsCode = preresult.substr(start, length)
        // console.log(start, end, jsCode)

        console.log(']]]]]]]]]]]]]]]]]]]]]]]]]]]', jsCode)
        let jsCodeResult = eval(jsCode) || ''

        // console.log('jsCodeResult', jsCodeResult)

        result = result + jsCodeResult
        lastEnd = end + 1

        // console.log(i, result)
      }
      result = result + preresult.substr(lastEnd, preresult.length - lastEnd)
      // console.log('TOTAL:', result)
    }
    return result
  },

  removeBrackets (preresult, bracketLeft, bracketRight) {
    let result = preresult
    let arr = []
    let bracesLeft = 0
    let startPos = 0
    let endPos = 0
    for (let i = 0; i < preresult.length; i++) {
      if (preresult[i] === bracketLeft) {
        if (bracesLeft === 0) {
          startPos = i
        }
        bracesLeft++
      }
      if (preresult[i] === bracketRight) {
        bracesLeft--
        if (bracesLeft < 0) {
          console.log('Incorrect string!', preresult)
        }
        if (bracesLeft === 0) {
          endPos = i
          arr.push({startPos: startPos, endPos: endPos})
        }
      }
    }
    // console.log('arr', arr)

    if (arr.length) {
      result = ''
      let lastEnd = 0
      for (let i = 0; i < arr.length; i++) {
        let obj = arr[i]
        let start = obj.startPos
        let end = obj.endPos
        result = result + preresult.substr(lastEnd, start - lastEnd)
        lastEnd = end + 1
      }
      result = result + preresult.substr(lastEnd, preresult.length - lastEnd)
    }
    return result
  },

  runTests () {
    let input = ''
    let output = ''
    let result = ''

    input = '[LABEL test[ANSWERSORDER OFF][BGNDIMAGE Intro.jpg]'
    output = 'test'
    result = this.getTagValue(input, 'LABEL')
    this.checkCondition(input, output, result)

    input = '[LABEL [GOTO test]]'
    output = 'test'
    result = this.getTagValue(input, 'GOTO')
    this.checkCondition(input, output, result)

    input = '[GOTO test]'
    output = 'test'
    result = this.getTagValue(input, 'GOTO')
    this.checkCondition(input, output, result)

    input = '[LABEL test label[VIDEO video][AUDIO audio]]'
    output = 'test label'
    result = this.getTagValue(input, 'LABEL')
    this.checkCondition(input, output, result)

    input = '[LABEL test]]]]'
    output = 'test]]]'
    result = this.getTagValue(input, 'LABEL')
    this.checkCondition(input, output, result)

    input = '[LABEL test][VIDEO video]'
    output = 'test'
    result = this.getTagValue(input, 'LABEL')
    this.checkCondition(input, output, result)

    input = '[LABEL test[AUDIO 1]][VIDEO video]'
    output = 'test'
    result = this.getTagValueLABEL(input)
    this.checkCondition(input, output, result)

    // input = '[LABEL [AUDIO 1]test][VIDEO video]'
    // output = 'test'
    // result = this.getTagValueLABEL(input)
    // this.checkCondition(input, output, result)
  },

  checkCondition (input, output, result) {
    if (output !== result) {
      console.log('%c ERROR', 'background: #FF0000; color: #FFFFFF')
      console.log('INPUT:', input)
      console.log('EXPECTED:', output)
      console.log('RESULT:', result)
    }
  }
}
