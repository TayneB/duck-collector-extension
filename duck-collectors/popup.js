document.addEventListener('DOMContentLoaded', function () {
  const variableInput = document.getElementById('duckHunter')
  const setVariableButton = document.getElementById('setUsername')

  setVariableButton.addEventListener('click', function () {
    const variableValue = variableInput.value

    chrome.storage.sync.set({ username: variableValue }, function () {
      console.log('Username set to: ' + variableValue)
    })
  })
})

document.addEventListener('DOMContentLoaded', function () {
  const userLoginSection = document.getElementById('userLoginSection')
  const loggedInSection = document.getElementById('loggedInSection')
  const usernameInput = document.getElementById('duckHunter')
  const setUsernameButton = document.getElementById('setUsername')
  const loggedInUsername = document.getElementById('loggedInUsername')
  const editUsernameButton = document.getElementById('editUsername')
  const cancelEditUserNameButton = document.getElementById('cancelEditUsername')

  chrome.storage.sync.get(['username'], function (result) {
    const savedUsername = result.username
    if (savedUsername) {
      showLoggedInSection(savedUsername)
    } else {
      showUserLoginSection()
    }
  })

  usernameInput.addEventListener('input', function () {
    usernameInput.value = usernameInput.value.toLowerCase()
  })

  setUsernameButton.addEventListener('click', function () {
    const newUsername = usernameInput.value.trim().toLowerCase()
    if (newUsername) {
      chrome.storage.sync.set({ username: newUsername }, function () {
        showLoggedInSection(newUsername)
      })
    }
  })

  editUsernameButton.addEventListener('click', function () {
    showUserLoginSection()
  })

  cancelEditUserNameButton.addEventListener('click', function () {
    chrome.storage.sync.get(['username'], function (result) {
      const savedUsername = result.username
      showLoggedInSection(savedUsername)
    })
  })

  function showUserLoginSection() {
    userLoginSection.style.display = 'block'
    loggedInSection.style.display = 'none'
  }

  function showLoggedInSection(username) {
    userLoginSection.style.display = 'none'
    loggedInSection.style.display = 'block'
    loggedInUsername.textContent = `Logged in as: ${username}`
  }
})
