const playground = document.querySelector(".playground > ul");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// Variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const BLOCKS = {
    tree: [
        [[2, 1], [0, 1], [1, 0], [1, 1]],
        [],
        [],
        [],
    ]
}

const movingItem = {
    type: "tree",
    direction: 0,
    top: 0,
    left: 0,
}

init();

// Functions
function init() {
    tempMovingItem = { ...movingItem };
    
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    }

    renderBlocks();
}

function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");

    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");

        ul.prepend(matrix);
    }

    li.prepend(ul);
    playground.prepend(li);
}

function renderBlocks() {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");

    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })

    BLOCKS[type][direction].forEach(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);

        if (isAvailable) {
            target.classList.add(type, "moving");
        }

        else {
            tempMovingItem = { ...movingItem };
            setTimeout(() => {
                renderBlocks();

                if (movingType == "top") {
                    
                }
            }, 0);
        }
    });

    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

function seizeBlock() {

}

function checkEmpty(target) {
    if (!target) {
        return false;
    }

    return true;
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks();
}

// Event Handling
document.addEventListener("keydown", e=> {
    switch(e.key) {
        case "ArrowLeft":
            moveBlock("left", -1);
            break;

        case "ArrowRight":
            moveBlock("left", 1);
            break;

        case "ArrowUp":
            moveBlock("top", -1);
            break;
        
        case "ArrowDown":
            moveBlock("top", 1);
            break;
        
        default:
            break;
    }
})