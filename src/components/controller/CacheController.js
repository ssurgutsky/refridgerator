import Settings from '@/components/Settings.js'
export default {
  preloadingCallback: null,
  CATEGORY_VIDEO: 'video',
  CATEGORY_AUDIO: 'audio',
  CATEGORY_IMAGES: 'images',
  CATEGORY_SCRIPTS: 'scripts',
  CATEGORY_DATA: 'data',
  gameAssets: {},

  getAssetByName (category, name) {
    let assetName = name
    switch (category) {
      case this.CATEGORY_VIDEO:
        if (assetName.indexOf('.mp4') < 0) {
          assetName = name + '.mp4'
        }
        break
      case this.CATEGORY_AUDIO:
        if (assetName.indexOf('.mp3') < 0) {
          assetName = name + '.mp3'
        }
        break
      case this.CATEGORY_IMAGES:
        break
      case this.CATEGORY_SCRIPTS:
        if (assetName.indexOf('.qsp') < 0) {
          assetName = name + '.qsp'
        }
        break
      case this.CATEGORY_DATA:
        if (assetName.indexOf('.json') < 0) {
          assetName = name + '.json'
        }
        break
    }
    let path = category + '/' + assetName
    // console.log(path)
    return this.gameAssets[path]
  },

  setPreloadingCallback (cb) {
    this.preloadingCallback = cb
  },

  loadAssets () {
    return new Promise((resolve, reject) => {
      this.loadAssetsFromIndexedDB()
        .then(res => {
          this.gameAssets = res
          resolve(res)
        })
        .catch(reason => {
          this.loadGameAssetsDictionary()
            .then(res => {
              // console.log('gameAssets:', res)
              this.gameAssets = res
              if (Settings.CACHE_ENABLED) {
                this.saveAssetsToIndexedDB()
              }
              resolve(res)
            })
            .catch(reason => {
              reject(reason)
            })
        })
    })
  },

  loadAssetsFromIndexedDB () {
    return new Promise((resolve, reject) => {
      if (!Settings.CACHE_ENABLED) {
        reject(new TypeError('loadAssetsFromIndexedDB: CACHE_ENABLED = false'))
        return
      }
      if (('indexedDB' in window)) {
        let openRequest = indexedDB.open(Settings.INDEXEDDB_STORE_NAME, Settings.INDEXEDDB_VERSION)
        // console.log(openRequest)
        openRequest.onupgradeneeded = (event) => {
          let db = event.target.result
          // console.log('HERE!', db)
          if (db.objectStoreNames.contains('gameAssets')) {
            db.deleteObjectStore('gameAssets')
          }
          db.createObjectStore('gameAssets', {keyPath: 'id', autoIncrement: false})
          // NOTE: next will be openRequest.onsuccess!!!
        }
        openRequest.onsuccess = (event) => {
          let db = event.target.result
          // console.log('onsuccess', db)
          let tx = db.transaction(['gameAssets'], 'readwrite')
          // console.log(tx)
          let store = tx.objectStore('gameAssets')
          // console.log(store)

          let req = store.get(1)
          req.onsuccess = (event) => {
            let tmp = event.target.result
            if (tmp && tmp.value) {
              console.log('Taken gameAssets from IndexedDB v.' + Settings.INDEXEDDB_VERSION, tmp)
              resolve(tmp.value)
            } else {
              reject(new TypeError('No gameAssets record in IndexedDB!'))
            }
          }

          req.onerror = (event) => {
            reject(new TypeError('No gameAssets record in IndexedDB!'))
          }

          tx.oncomplete = () => {
            // console.log('tx complete')
          }
          tx.onerror = (event) => {
            reject(new TypeError('Error reading IndexedDB!'))
          }
        }
      } else {
        console.log('This browser doesnt support IndexedDB')
        reject(new TypeError('This browser doesnt support IndexedDB'))
      }
    })
  },

  saveAssetsToIndexedDB () {
    return new Promise((resolve, reject) => {
      if (!Settings.CACHE_ENABLED) {
        reject(new TypeError('saveAssetsToIndexedDB: CACHE_ENABLED = false'))
        return
      }
      if (('indexedDB' in window)) {
        let openRequest = indexedDB.open(Settings.INDEXEDDB_STORE_NAME, Settings.INDEXEDDB_VERSION)
        // console.log(openRequest)
        openRequest.onupgradeneeded = (event) => {
          let db = event.target.result
          // console.log('HERE!', db)
          if (!db.objectStoreNames.contains('gameAssets')) {
            db.createObjectStore('gameAssets', {keyPath: 'id', autoIncrement: false})
            // console.log('HERE!', objectStore)
            // NOTE: next will be openRequest.onsuccess!!!
          }
        }
        openRequest.onsuccess = (event) => {
          let db = event.target.result
          // console.log('onsuccess', db)
          let tx = db.transaction(['gameAssets'], 'readwrite')
          // console.log(tx)
          let store = tx.objectStore('gameAssets')
          // console.log(store)

          store.put({id: 1, value: this.gameAssets})
          console.log('Saving loaded assets to IndexedDB v.' + Settings.INDEXEDDB_VERSION)

          tx.oncomplete = () => {
            console.log('Save success')
            resolve(true)
          }
          tx.onerror = (event) => {
            console.log('Save error!')
            reject(new TypeError('Error saving loaded assets to IndexedDB! v.' + Settings.INDEXEDDB_VERSION))
          }
        }
      } else {
        console.log('This browser doesnt support IndexedDB')
        reject(new TypeError('This browser doesnt support IndexedDB'))
      }
    })
  },

  async loadGameAssetsDictionary () {
    const requireContext = Settings.CACHE_ENABLED ? require.context('@/assets/', true, /\.(mp3|mp4|jpg|png|qsp|json)(\?.*)?$/)
      : require.context('@/assets/', true, /\.(qsp|json)(\?.*)?$/)
    let arr = requireContext.keys().map(file =>
      [file.replace('./', ''), requireContext(file)]
    )
    // console.log('>>>>>>>', arr)
    let result = await this.processAssetsArray(arr)
    // console.log('>>>>>>>>>>>>', result)

    return new Promise((resolve, reject) => {
      resolve(result)
    })
  },

  async processAssetsArray (array) {
    let result = {}
    let counter = 0
    for (const item of array) {
      // console.log(item)
      let name = item[0]

      // For mobile version
      let url = require('@/assets/' + name)

      // For html version
      // url = 'https://github.com/ssurgutsky/t/tree/master/static/' + name
      // console.log(url)
      // console.log(counter, url)
      await this.fetchLocal(url).then(response => {
        // console.log(response)
        response.blob().then(blob => {
          // console.log(blob)

          // Update progress bar
          // console.log('cachedAsset', {'current': counter, 'total': array.length})

          if (name.indexOf('scripts') >= 0 || name.indexOf('scenario') >= 0) {
            const reader = new FileReader()

            // This fires after the blob has been read/loaded.
            reader.addEventListener('loadend', (e) => {
              const text = e.srcElement.result
              // console.log(text)
              result[name] = text
              counter = this.incCounter(counter, array.length)
            })

            // Start reading the blob as text.
            reader.readAsText(blob)
          } else {
            const reader = new FileReader()

            // This fires after the blob has been read/loaded.
            reader.addEventListener('loadend', (e) => {
              const media = e.srcElement.result
              // console.log(media)
              result[name] = media
              counter = this.incCounter(counter, array.length)
            })

            // Start reading the blob as text.
            reader.readAsDataURL(blob)
            result[name] = blob
          }
        })
      })
    }
    return result
  },

  incCounter (counter, total) {
    counter++
    if (this.preloadingCallback) {
      this.preloadingCallback({'current': counter, 'total': total})
    }
    return counter
  },

  fetchLocal (url, isBlob) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      xhr.onload = function () {
        resolve(new Response(xhr.response, {status: xhr.status}))
      }
      xhr.onerror = function () {
        reject(new TypeError('Local request failed'))
      }
      xhr.open('GET', url)
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      xhr.send(null)
    })
  }
}
