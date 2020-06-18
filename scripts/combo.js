const square = document.querySelectorAll('.square')
const point = document.querySelectorAll('.point')
const timeLeft = document.querySelector('#timeLeft span')
let score = document.querySelector('#comboHits span')


let result = 0
function startCombo() {
let currentTime = timeLeft.textContent
  function randomSquare() {
    if(currentTime != 0) {    
      square.forEach(className => {
        className.classList.remove('point')
      })
      let randomPosition = square[Math.floor(Math.random() * 9)]
      randomPosition.classList.add('point')

      //assign the id of the randomPosition to hitPosition for us to use later
      hitPosition = randomPosition.id
    }
  }

  square.forEach(id => {
    id.addEventListener('mouseup', () => {
      if(id.id === hitPosition){
        result = result + 1
        score.textContent = result
        hitPosition=null
      }
    })
  })


  function movePoint() {
    result = 0
    score.textContent = result
    let timerId = null
    timerId = setInterval(randomSquare, 700)
  }

  movePoint()

  function countDown() {
    currentTime--
    timeLeft.textContent = currentTime

    if(currentTime === 0 ) {
      clearInterval(timerId)
      document.querySelector(".Combo").style.display= "none"
      timeLeft.textContent= "5"
      // timerId = null
      // result = 0

    }
  }

  let timerId = setInterval(countDown, 1000)
}