chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (const key in changes) {
    if (key === 'username') {
      const newUsername = changes[key].newValue
      console.log('Updated username:', newUsername)
    }
  }
})

chrome.runtime.onMessage.addListener(function (message) {
  chrome.storage.sync.get(['username'], function (result) {
    const username = result.username || 'duckhunter'
    if (message.type === 'duck-clicked') {
      playSound(message.duckSound)
      duckData(message.duckId, username)
    } else if (message.type === 'duck-NOT-clicked') {
      playSound('assets/duck-escaping.mp3')
    }
    return true
  })
})

// https://duck-finderz.pushed.nz/ deployed website
const duckData = async (duckId, username) => {
  try {
    const duckData = await fetch(
      'https://duck-finderz.pushed.nz/api/v1/routes/collect-duck',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duckId: duckId, username: username }),
      }
    )
    const ducks = await duckData.json()
    return ducks
  } catch (e) {
    console.log(e)
  }
}

async function playSound(source, volume = 1) {
  await createOffscreen()
  await chrome.runtime.sendMessage({ play: { source, volume } })
}

async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'ducks must quack',
  })
}
