const gamesBoardContainer = document.querySelector('#gamesboard-container')
const optionContainer = document.querySelector('.option-container')
const flipButton = document.querySelector('#flip-button')

// Option Choosing
let angle = 0
function flip () {
   const optionShips = Array.from(optionContainer.children)

   angle = angle === 0 ? 90 : 0

   optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`)
}


// Creating Boards
const width = 10
function createBoard(color, user) {
    const gameBoardContainer = document.createElement('div')
    gameBoardContainer.classList.add('game-board')
    gameBoardContainer.style.backgroundColor = color
    gameBoardContainer.id = user

    for (let i = 0; i < width * width; i++){
        const block = document.createElement('div')
        block.classList.add('block')
        block.id = i
        gameBoardContainer.append(block)
    }

    gamesBoardContainer.append(gameBoardContainer)
}

createBoard('gray', 'player')
createBoard('darkred', 'computer')

// Creating Ships
class Ship {
    constructor(name, length) {
        this.name = name
        this.length = length
    }
}

const destroyer = new Ship('destroyer', 2)
const submarine = new Ship('submarine', 3)
const cruiser = new Ship('cruiser', 3)
const battleship = new Ship('battleship', 4)
const carrier = new Ship('carrier', 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]
let notDropped

function getValidity(allBoardBlocks, isHorizontal, startIndex, ships) {
    let validStart = isHorizontal ? startIndex <= width * width - ships.length ? startIndex :
    width * width - ships.length :
// handle verticle
startIndex <= width * width - width * ships.length ? startIndex : 
    startIndex - ships.length * width + width
let shipBlocks = []
for (let i = 0; i < ships.length; i++) {
    if (isHorizontal) {
        shipBlocks.push(allBoardBlocks[Number(validStart) + i])
    } else {
        shipBlocks.push(allBoardBlocks[Number(validStart) + i * width])
    }
}

let valid

if (isHorizontal) {
shipBlocks.every((_shipBlock, index) => 
    valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)))
} else {
    shipBlocks.every((_shipBlock, index) => 
        valid = shipBlocks[0].id < 90 + (width * index + 1)
    )
}

const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))
return {shipBlocks, valid, notTaken}
}

function addShipPiece(user, ships, startId) {
    const allBoardBlocks = document.querySelectorAll(`#${user} div`)
    let randomBoolean = Math.random() < 0.5
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean
    let randomStartIndex = Math.floor(Math.random() * width * width)

    let startIndex = startId ? startId : randomStartIndex
    
const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ships)

    if (valid && notTaken) {
        shipBlocks.forEach((shipBlock, index) => {
        shipBlock.classList.add(ships.name)
        shipBlock.classList.add('taken')
        
    })
    } else {
        if (user === 'computer') addShipPiece(user, ships, startId)
        if (user === 'player') notDropped = true
    }

 }
  ships.forEach(ship => addShipPiece('computer', ship))

  //drag player ships
let draggedShip
  const optionShips = Array.from(optionContainer.children)
  optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))

  const allPlayerBlocks = document.querySelectorAll('#player div')
  allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener('dragover', dragOver)
    playerBlock.addEventListener('drop', dropShip)
  })

  function dragStart(e){
    notDropped = false
    draggedShip = e.target
  }

  function dragOver(e) {
    e.preventDefault()
    const ship = ships[draggedShip.id]
    highlightArea(e.target.id, ships)
  }

  function dropShip(e) {
    const startId = e.target.id
    const ship = ships[draggedShip.id]
    addShipPiece('player', ship, startId)
    if (!notDropped) {
        draggedShip.remove()
    }
  }

  // Add highlights

  function highlightArea(startIndex, ships) {
    const allBoardBlocks = document.querySelectorAll('#player div')
    let isHorizontal = angle === 0

    const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ships)

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add('hover')
            setTimeout(() =>  shipBlock.classList.remove('hover'), 500)
        })
    }
  }