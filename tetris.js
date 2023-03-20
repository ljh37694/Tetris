import BLOCKS from "./blocks.js";

// DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");

// Setting
const GAME_ROWS = 20; // 테트리스 행 개수
const GAME_COLS = 10; // 테트리스 열 개수

// Variables
let score = 0; // 점수
let duration = 500; // 블럭이 다시 떨어지는 데 걸리는 시간
let downInterval; // 블럭이 떨어지는 주기
let tempMovingItem; // 현재 블럭을 임시 저장

// 현재 활성화된 블럭
const movingItem = {
    type: "", // 블럭의 종류
    direction: 1, // 어느 방향으로 회전한 상태인지
    top: 0, // 맨 위 칸부터의 거리
    left: 0, // 맨 왼쪽 칸부터의 거리
}

init();

// Functions
function init() { // 초기화
    const blocksArray = Object.entries(BLOCKS); // 모든 종류의 블럭 배열
    const randomIndex = Math.floor(Math.random() * blocksArray.length); // blockArray에서 랜덤으로 블럭을 선택하기 위한 변수
    movingItem.type = blocksArray[randomIndex][0]; // 현재 블럭에 랜덤으로 1가지 타입을 부여

    tempMovingItem = { ...movingItem }; // 깊은 복사
    
    // 행열의 길이에 맞춰 테트리스 맵 만들기
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    }

    // 새로운 블럭 만들기
    generateNewBlock();

    console.log(playground.childNodes);
}

function prependNewLine() { // 열 길이만큼 칸을 가진 라인 만들기
    const li = document.createElement("li");
    const ul = document.createElement("ul");

    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");

        ul.prepend(matrix);
    }

    li.prepend(ul);
    playground.prepend(li);
}

function renderBlocks(moveType = "") {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");

    // 현재 블록의 moving을 없앤다.
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })

    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);

        // target이 유효할 때
        if (isAvailable) {
            target.classList.add(type, "moving");
        }

        else {
            tempMovingItem = { ...movingItem };

            if (moveType === "retry") {
                clearInterval(downInterval);
                showGameOverText();
            }

            setTimeout(() => {
                renderBlocks("retry");

                if (moveType == "top") {
                    seizeBlock();
                }
            }, 0);

            return true;
        }
    });

    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

function seizeBlock() { // 블럭이 내려갈 수 있을만큼 내려갔을 때
    const movingBlocks = document.querySelectorAll(".moving");

    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })

    checkMatch();
}

function checkMatch() {
    const childNodes = playground.childNodes;

    // 테트리스의 각 줄마다 모든 칸이 seized라면 그 줄을 빈칸으로 바꾼다.
    childNodes.forEach(child => {
        let matched = true;

        child.childNodes[0].childNodes.forEach(li => {
            if (!li.classList.contains("seized")) {
                matched = false; 
            }
        })

        // 현재 줄의 모든 칸이 seized이면 현재 줄 없애고 맨 위에 새로운 줄을 추가한다.
        if (matched) {
            child.remove();
            prependNewLine();
            score += 100;
            scoreDisplay.innerText = score;
        }
    })

    generateNewBlock();
}

function generateNewBlock() { // 새로운 블럭 생성
    clearInterval(downInterval);

    downInterval = setInterval(() => {
        moveBlock('top', 1);
    }, duration);

    const blocksArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blocksArray.length);

    movingItem.type = blocksArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;

    tempMovingItem = { ...movingItem };

    renderBlocks();
}

function checkEmpty(target) {
    if (!target || target.classList.contains("seized")) {
        return false;
    }

    return true;
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function changeDirection() {
    tempMovingItem.direction++;
    tempMovingItem.direction %= 4;

    renderBlocks();
}

function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1);
    }, 10);
}

function showGameOverText() {
    gameText.style.display = "flex";
}

// Event Handling
document.addEventListener("keydown", e=> {
    console.log(e);

    switch(e.key) {
        case "ArrowLeft":
            moveBlock("left", -1);
            break;

        case "ArrowRight":
            moveBlock("left", 1);
            break;
        
        case "ArrowDown":
            moveBlock("top", 1);
            break;

        case "ArrowUp":
            changeDirection();
            break;

        case " ":
            dropBlock();
            break;
        
        default:
            break;
    }
})


restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    gameText.style.display = "none";
    init();
})