let pontos = 0
let comecarJogo
let puloPermitido = false

const maxPipeHeight = -100
const minPipeHeight = -330


const flappyContainer = document.querySelector('[wm-flappy]')

const flappy = document.createElement('div')
flappy.classList.add('flappy')
flappyContainer.appendChild(flappy)

const topPipe = document.createElement('div')
topPipe.classList.add('top-pipe')

const bottomPipe = document.createElement('div')
bottomPipe.classList.add('bottom-pipe')

const pipeContainer = document.createElement('div')
pipeContainer.classList.add('pipe-container')
pipeContainer.appendChild(topPipe)
pipeContainer.appendChild(bottomPipe)
flappyContainer.appendChild(pipeContainer)

const grama = document.createElement('div')
grama.classList.add('grama')
flappyContainer.appendChild(grama)

const telaCinza = document.createElement('div')
telaCinza.classList.add('tela-cinza')
flappyContainer.appendChild(telaCinza)

const startButton = document.createElement('button')
startButton.innerHTML = "Iniciar"
startButton.classList.add('button')
startButton.classList.add('start')
flappyContainer.appendChild(startButton)

const countDown = document.createElement('p')
countDown.innerHTML = "3"
countDown.classList.add('count-down')
flappyContainer.appendChild(countDown)

const gameOverText = document.createElement('span')
gameOverText.classList.add('game-over-text')
gameOverText.innerHTML = `Você Perdeu! Total de pontos: ${pontos}`
const gameOverButton = document.createElement('button')
gameOverButton.classList.add('button')
gameOverButton.classList.add('play-again')
gameOverButton.innerHTML = 'Jogar Denovo?'
flappyContainer.appendChild(gameOverText)
flappyContainer.appendChild(gameOverButton)

const pontosNumber = document.createElement('p')
pontosNumber.classList.add('pontos')
pontosNumber.innerHTML = pontos
flappyContainer.appendChild(pontosNumber)


let flappyPositions = window.getComputedStyle(flappy)
let flappyHeight = parseFloat(flappyPositions.top)
let flappyRotation = parseFloat(flappyPositions.rotate)

let pipePositions = window.getComputedStyle(pipeContainer)
let pipeLeft = parseFloat(pipePositions.left)
let pipeTop = parseFloat(pipePositions.top)

startButton.onclick = () => {
    startButton.style.visibility = 'hidden'
    countDown.style.visibility = 'visible'
    startCountDown(3)
}

const startCountDown = (number) => {
    if (number > 0){
        countDown.innerHTML = number
        setTimeout(() => {
            startCountDown(number - 1);
        }, 1000)
    } else {
        countDown.style.visibility = 'hidden'
        telaCinza.style.visibility = 'hidden'
        pontosNumber.style.visibility = 'visible'
        pontos = 0
        comecarJogo = startGame()
    }
}


const flappyDown = () => {
    if(flappyRotation < 10){
        flappyRotation += 2
        flappy.style.rotate = `${flappyRotation}deg`
    }
    if(flappyHeight <= 369){
        flappyHeight += 1
        if(flappyHeight > 369){
            flappyHeight = 369
            flappy.style.top = `${flappyHeight}px`
            stopGame(comecarJogo)
        } else {
            flappy.style.top = `${flappyHeight}px`
        }
    }
}


const flappyUp = () => {
    if(flappyHeight < 20){
        flappyHeight = 0
    } else {
        flappyHeight -= 45
    }
    flappyRotation = -45
}

const pipeMovement = () => {
    if(pipeLeft > -50){
        pipeLeft -= 1
    } else {
        pipeLeft = 692
        pipeTop = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight
        pipeContainer.style.top = `${pipeTop}px`
    }
    pipeContainer.style.left = `${pipeLeft}px`
}

const detectarColisao = () => {
    const flappyBox = flappy.getBoundingClientRect();
    const topPipeBox = topPipe.getBoundingClientRect();
    const bottomPipeBox = bottomPipe.getBoundingClientRect();

    if (flappyBox.right >= topPipeBox.left && 
        flappyBox.left <= topPipeBox.right &&
        flappyBox.bottom >= topPipeBox.top &&
        flappyBox.top <= topPipeBox.bottom) {
        stopGame(comecarJogo)
    }

    if (flappyBox.right >= bottomPipeBox.left && 
        flappyBox.left <= bottomPipeBox.right &&
        flappyBox.bottom >= bottomPipeBox.top &&
        flappyBox.top <= bottomPipeBox.bottom) {
        stopGame(comecarJogo)
    }
}

const detectarPonto = () => {
    const flappyBox = flappy.getBoundingClientRect();
    const containerPipeBox = pipeContainer.getBoundingClientRect();
    if (flappyBox.right >= containerPipeBox.left && 
        flappyBox.left <= containerPipeBox.right &&
        flappyBox.bottom >= containerPipeBox.top &&
        flappyBox.top <= containerPipeBox.bottom) {
            pontos += 1
            pontosNumber.innerHTML = pontos
    }
}

const startGame = () => {
    const iniciarDetectarColisao = setInterval(detectarColisao, 10)
    const iniciarDetectarPonto = setInterval(detectarPonto, 350)
    const iniciarDescidaFlappy = setInterval(flappyDown, 10)
    const iniciarMovimentoPipe = setInterval(pipeMovement, 2 )
    puloPermitido = true
    document.onkeydown = () => {
        if(puloPermitido == true){
            flappyUp()
        }
    }
    return {
        iniciarDetectarColisao,
        iniciarDetectarPonto,
        iniciarDescidaFlappy,
        iniciarMovimentoPipe
    }
}

const stopGame = (comecarJogo) => {
    clearInterval(comecarJogo.iniciarDetectarColisao)
    clearInterval(comecarJogo.iniciarDetectarPonto)
    clearInterval(comecarJogo.iniciarMovimentoPipe)
    puloPermitido = false
    telaCinza.style.visibility = "visible"
    pontosNumber.style.visibility = "hidden"
    gameOverButton.style.visibility = "visible"
    gameOverText.innerHTML = `Você Perdeu! Total de pontos: ${pontos}`
    gameOverText.style.visibility = "visible"
    gameOverButton.onclick = playAgain

}

const playAgain = () =>{
    flappyHeight = 196.797
    pipeLeft = 346
    pipeTop = -180
    flappyRotation = 0
    clearInterval(comecarJogo.iniciarDescidaFlappy)
    pontosNumber.innerHTML = 0
    flappy.style.rotate = `${flappyRotation}deg`
    flappy.style.top = `${flappyHeight}px`
    pipeContainer.style.top = `${pipeTop}px`
    pipeContainer.style.left = `${pipeLeft}px`
    gameOverButton.style.visibility = 'hidden'
    gameOverText.style.visibility = 'hidden'
    countDown.style.visibility = 'visible'
    startCountDown(3)
}


