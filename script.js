const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const model = document.querySelector('.model');
const startGameModel = document.querySelector('.start-game');
const gameOverModel = document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');

const highScoreElement = document.querySelector('#high-score');
const timeElement = document.querySelector('#time');
const scoreElement = document.querySelector('#score');

let highScore = localStorage.getItem("highscore") || 0;
let score = 0;
let time =`00-00`;

highScoreElement.innerText = highScore;


const blockWidth =50;
const blockHeight =50;

const cols = Math.floor(board.clientWidth/blockWidth);
const rows = Math.floor(board.clientHeight/blockHeight);

let intervalID =null;
let timeIntervalID = null;

let food = {
    x:Math.floor(Math.random()*rows) ,y: Math.floor(Math.random()*cols)
}

const blocks =[];
let snake = [
    {x:1,y:3},
    {x:1,y:4},
]

for(let row= 0; row < rows ;row++){
    for(let col=0;col<cols;col++){
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        // block.innerText = `${row} - ${col}`;
        blocks[`${row}-${col}`] = block;
    }
}

function renderSnake(){

    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add('food');

    //for direction of snake
    if(direction == "left"){
        head = {x: snake[0].x , y:snake[0].y -1}
    }else if(direction =="right"){
        head = {x: snake[0].x , y:snake[0].y +1}
    }else if(direction == "up"){
        head = {x: snake[0].x -1 , y:snake[0].y }
    }else if(direction=="down"){
        head = {x: snake[0].x +1 , y:snake[0].y}
    }

    //to get game over after hitting any end
    if(head.x <0 || head.x>=rows || head.y>=cols || head.y<0){
        clearInterval(intervalID);

        model.style.display = "flex";
        startGameModel.style.display = "none";
        gameOverModel.style.display = "flex";

        return;
    }

    //to add food and increase snake length
    if(head.x == food.x && head.y == food.y){
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {
            x:Math.floor(Math.random()*rows) ,y: Math.floor(Math.random()*cols)
        }
        blocks[`${food.x}-${food.y}`].classList.add('food');
        snake.unshift(head);

        score+=10;
        scoreElement.innerText = score;

        if(score>highScore){
            highScore = score;
            localStorage.setItem("highscore",highScore);
            highScoreElement.innerText = highScore;
        }
    }


    //to remove tail (means to remove snake)
    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    })
    
    snake.unshift(head);
    snake.pop();
    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    })
    
}

let direction = "right";

//to move snake through keyboard
addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        direction = "up";
    } else if (event.key === "ArrowDown") {
        direction = "down";
    } else if (event.key === "ArrowRight") {
        direction = "right";
    } else if (event.key === "ArrowLeft") {
        direction = "left";
    }


    
});

restartButton.addEventListener("click",restartGame)

function restartGame(){
    blocks[`${food.x}-${food.y}`].classList.remove('food');
    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    })

    model.style.display ="none";
    snake = [
         {x:1,y:3},
        {x:1,y:4},
    ]
    direction ="down";
    food = {
            x:Math.floor(Math.random()*rows) ,y: Math.floor(Math.random()*cols)
    }
    intervalID = setInterval(()=>{renderSnake()},300);
    score = 0;
    time = `00-00`;
    scoreElement.innerText = score;
}

startButton.addEventListener("click", ()=>{
    clearInterval(intervalID);
    model.style.display= "none";
    intervalID = setInterval(()=>{renderSnake()},300);
    timeIntervalID = setInterval(()=>{
        let [min, sec] = time.split("-").map(Number)

        if(sec == 59){
            min+=1
        }else{
            sec+=1
        }

        time = `${min}-${sec}`
        timeElement.innerText = time
    },1000)
})


