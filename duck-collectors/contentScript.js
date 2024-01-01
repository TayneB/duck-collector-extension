;(() => {
  let whereDuckHidden
  let notCollected = true
  let countdownTimeout
  let loggedIn = false
  let ducksEnabled = false
  let duckImages = []

  const duckRarity1 = [
    { id: 0, image: 'ghost-duck.png', rarity: '!!!' },
    { id: 3, image: 'default-duck.png', rarity: 1, duckSound: 'quack.mp3' },
    { id: 6, image: 'green-duck.png', rarity: 1, duckSound: 'quack.mp3' },
    { id: 7, image: 'red-duck.png', rarity: 1, duckSound: 'quack.mp3' },
  ]

  const duckRarity2 = [
    { id: 0, image: 'ghost-duck.png', rarity: '!!!' },
    { id: 2, image: 'bow-duck.png', rarity: 2, duckSound: 'quack.mp3' },
    {
      id: 9,
      image: 'jojo_duck-removebg-preview.png',
      rarity: 2,
      duckSound: 'jojo-duck-bing-bong.mp3',
    },
    {
      id: 10,
      image: 'rubber-duck.png',
      rarity: 2,
      duckSound: 'rubber-duck-pop.mp3',
    },
    { id: 12, image: 'mike-duck.png', rarity: 2, duckSound: 'quack.mp3' },
    { id: 13, image: 'gojo-duck.png', rarity: 2, duckSound: 'quack.mp3' },
    { id: 14, image: 'blue-mike-duck.png', rarity: 2, duckSound: 'quack.mp3' },
  ]

  const duckRarity3 = [
    { id: 0, image: 'ghost-duck.png', rarity: '!!!' },
    {
      id: 1,
      image: 'gym-duck.png',
      rarity: 3,
      duckSound: 'gym-duck-gruntier.mp3',
    },
    { id: 4, image: 'fez-duck.png', rarity: 3, duckSound: 'fez-duck-riff.mp3' },
    {
      id: 5,
      image: 'golden-duck.png',
      rarity: 3,
      duckSound: 'gold-duck-chaching.mp3',
    },
    {
      id: 8,
      image: 'knife-duck.png',
      rarity: 3,
      duckSound: 'knife-duck-draw.mp3',
    },
    {
      id: 11,
      image: 'zebra-duck.png',
      rarity: 3,
      duckSound: 'zebra-duck-babyzebra-call.mp3',
    },
  ]

  const newDuckLoaded = async () => {
    await chrome.storage.sync.get(['ducksEnabled'], function (result) {
      ducksEnabled = result.ducksEnabled
      console.log(ducksEnabled)
    })

    if (ducksEnabled === undefined) {
      ducksEnabled = true
    }

    await chrome.storage.sync.get(['username'], function (result) {
      if (result.username) {
        loggedIn = true
      }
    })

    const duckExists = document.getElementsByClassName('duck-collect')[0]
    const elems = document.body.getElementsByTagName('*')
    const elemRandomIndex =
      Math.floor(Math.random() * (0 - elems.length + 1)) + elems.length

    const randomElement = elems[elemRandomIndex]

    if (!duckExists && ducksEnabled && loggedIn) {
      const duck = document.createElement('img')

      let randomRarityDecimal = Math.random()
      if (randomRarityDecimal < 0.6) {
        duckImages = duckRarity1
      } else if (randomRarityDecimal < 0.9) {
        duckImages = duckRarity2
      } else if (randomRarityDecimal < 1) {
        duckImages = duckRarity3
      }

      let randomDecimal = Math.random()
      let duckId = Math.floor(randomDecimal * (duckImages.length - 1)) + 1
      duck.src = chrome.runtime.getURL(`assets/${duckImages[duckId].image}`)
      duck.className = 'duck-collect'
      duck.title = 'Click to collect duck'
      duck.style.width = '6.25rem'
      duck.style.height = '6.25rem'
      duck.style.cursor = 'pointer'

      whereDuckHidden = randomElement

      let duckSound = `assets/${duckImages[duckId].duckSound}`

      countdownTimeout = setTimeout(() => {
        duck.remove()
        newDuckLoaded()
        // sound currently turned off because its driving me insane
        /* chrome.runtime.sendMessage({
          type: 'duck-NOT-clicked',
        }) */
      }, 10000)

      const duckClicked = (event) => {
        event.stopPropagation()
        event.preventDefault()
        if (notCollected) {
          duck.src = chrome.runtime.getURL(`assets/collected.png`)
          chrome.runtime.sendMessage({
            type: 'duck-clicked',
            duckId: duckImages[duckId].id,
            duckSound: duckSound,
          })
          duck.style.cursor = 'auto'
          notCollected = false
          clearTimeout(countdownTimeout)
          setTimeout(() => {
            duck.remove()
            notCollected = true
            newDuckLoaded()
          }, 1000)
        } else if (!notCollected) {
          console.log('duck already collected')
        }
      }

      whereDuckHidden.appendChild(duck)
      duck.addEventListener('click', (event) => duckClicked(event))
    } else if (!loggedIn && ducksEnabled) {
      const duck = document.createElement('img')

      duck.src = chrome.runtime.getURL(`assets/logged-out-notification.png`)
      duck.className = 'duck-collect'
      duck.title = 'Click to collect duck'
      duck.style.width = '6.25rem'
      duck.style.height = '6.25rem'
      duck.style.cursor = 'pointer'

      whereDuckHidden = randomElement

      let loggedOutSound = `assets/logged-out-sad-trombone.mp3`

      countdownTimeout = setTimeout(() => {
        duck.remove()
        newDuckLoaded()
        // sound currently turned off because its driving me insane
        /* chrome.runtime.sendMessage({
          type: 'duck-NOT-clicked',
        }) */
      }, 10000)

      const duckClicked = (event) => {
        event.stopPropagation()
        event.preventDefault()
        if (notCollected) {
          duck.src = chrome.runtime.getURL(`assets/logged-out-notification.png`)
          chrome.runtime.sendMessage({
            type: 'logged-out',
            loggedOutSound: loggedOutSound,
          })
          duck.style.cursor = 'auto'
          notCollected = false
          chrome.runtime.openPopup()
          clearTimeout(countdownTimeout)
          setTimeout(() => {
            duck.remove()
            notCollected = true
            newDuckLoaded()
          }, 3000)
        } else if (!notCollected) {
          console.log('logged out sound already played')
        }
      }

      whereDuckHidden.appendChild(duck)
      duck.addEventListener('click', (event) => duckClicked(event))
    } else if (!ducksEnabled) {
      setTimeout(() => {
        newDuckLoaded()
      }, 1000)
    }
  }
  newDuckLoaded()
})()
