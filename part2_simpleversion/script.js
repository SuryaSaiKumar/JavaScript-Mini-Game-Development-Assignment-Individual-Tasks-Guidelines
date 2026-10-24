let randCell
let cell
let timeoutID
let score = 0
// Create an img element for the mole image
const mole = document.createElement('img')
const imgSrc = 'https://raw.githubusercontent.com/Educative-Content/blog-resources/main/big-ground-hog.png'
mole.setAttribute('src', imgSrc)
// Get access to the span that shows the score
const scoreSpan = document.getElementById('score')
// Display the first mole after a random amount of time
let timeout = 800 + Math.floor(Math.random() * 2201)
setTimeout(addMole, timeout)

const duration = 60000
setTimeout(gameOver, duration)

function removeMole() {
    cell.removeChild(cell.firstChild)
    cell.removeEventListener('click', hitit)
    timeout = 800 + Math.floor(Math.random() * 2201)
    timeoutID = setTimeout(addMole, timeout)
}

function addMole() {
    randCell = Math.ceil(Math.random()*9) 
    cell = document.getElementById(randCell)
    cell.appendChild(mole)
    cell.addEventListener('click', hitit)
    timeout = 800 + Math.floor(Math.random() * 2201)
    timeoutID = setTimeout(removeMole, timeout)
}

function hitit() {
    clearTimeout(timeoutID)
    score = score + 1
    scoreSpan.innerText = score
    removeMole()
}

function gameOver() {
    clearTimeout(timeoutID)
    cell.removeEventListener('click', hitit)
    // Create a "Game over" message div
    const gameOverDiv = document.createElement('div');
    gameOverDiv.innerText = 'Game over';
    // Apply CSS styles to the "Game over" div
    gameOverDiv.classList.add('gameover')
    // Append the "Game over" div to the body
    document.body.appendChild(gameOverDiv);
}