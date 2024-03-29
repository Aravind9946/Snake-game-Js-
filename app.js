// Game variables
const gridSize=20
let snake=[{x:10,y:10}]
let food=foodPosition()
let direction='left'               //set left as the default direction
let gameInterval
let snakeSpeedDelay=200              //set 200 as the beginning speeddelay
let gameStarted=false
let newHighScore=0
const image=document.querySelector('#image')
const text=document.querySelector('#text')
const gameOverText=document.querySelector('.gameOverText')
const board=document.querySelector('.game-area')            //This is the game area where the food and snake always present in

//this function makes game area empty during every new start and also begins the game by creating new food and snake 
function draw(){
    board.innerHTML=''
    drawSnake();
    drawfood();
}

//this function is used to visually generate and append the snake at a postion in the game area
//(This function executes the inside function createGameElement when mapping each value from the array which create that element and then save to a variable)
function drawSnake(){
    if(gameStarted){
    snake.forEach((s)=>{
        const snakeElement=createGameElement('div','snake')
        setPosition(snakeElement,s)
        board.appendChild(snakeElement)
    })
}
}

//this is the function which is actually creating the food and the snake by passing the tag(div) and classname(snake/food) as arguments 
function createGameElement(tag,className){
    const element=document.createElement(tag)       //here the tag is created in the document and saved into a variable called element
    element.className=className                     //Now we are assigning a class to that tag by the attribute className using argument className
    return element
}

//this is the function which determines the postion of the food and and the snake
function setPosition(element,position){
    element.style.gridColumn=position.x
    element.style.gridRow=position.y
}

//this function is used to generate and append the food. It is similar to drawSnake function
function drawfood(){
    if(gameStarted){
    const foodElement=createGameElement('div','food')
    setPosition(foodElement,food)
    board.appendChild(foodElement)
    }
}

//this function returns a random x and y values which is used for making random positions for food
function foodPosition(){
    const x=Math.floor(Math.random()*gridSize)+1;
    const y=Math.floor(Math.random()*gridSize)+1;
    return {x,y}
}

//this function is used to make the snake movements,snake length,food eating illusion,etc
function moveSnake(){
    const head={...snake[0]}                    //here actually we are taking the copy of the 1st element from the array of snake
    switch(direction){
        case 'up':head.y--   ;
        break;
        case 'down':head.y++   ;
        break;
        case 'right':head.x++   ;
        break;
        case 'left':head.x--   ;
        break;
       
    }
    snake.unshift(head)
    if(head.x===food.x && head.y===food.y){
        food=foodPosition()
        updateScore()
        increaseSpeed()
        clearInterval(gameInterval)
        gameInterval=setInterval(()=>{
            moveSnake()
            isgameOver()
            draw()
        },snakeSpeedDelay)

    }else{
        snake.pop()
    }
}

//this function is used for starting the game.
function startGame(){
    gameStarted=true;
    gameOverText.style.display='none'
    image.style.display='none';
    text.style.display='none';
    gameInterval=setInterval(()=>{
        moveSnake()
        isgameOver()
        draw()
    },snakeSpeedDelay)
    board.style. backgroundColor='#f4a261';

}

//function used to accept the pressed key from keyboard by the user and make changes or moves according to that key
function movingKeys(e){
    if((!gameStarted && e.code==='Space') || (!gameStarted && e.key===' ')){
        startGame();
    }else{
        switch (e.key){
            case 'ArrowUp':
                direction='up';
                break;
            case 'ArrowDown':
                direction='down';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
            case 'ArrowRight':
                direction='right';
                break;
        }
    }
}

//this actually helps the above function.It passes the code which is corresponds to the key pressed by the user.So when key down,the above 
//function will call.
document.addEventListener('keydown',movingKeys) 

//this function is called at snakeMove function.So that the snakeSpeedDelay decrease at the given rate when it reaches corresponding snakeSpeedDelay
function increaseSpeed(){
    if(snakeSpeedDelay>150){
        snakeSpeedDelay-=5
    }else if(snakeSpeedDelay>100){
        snakeSpeedDelay -=3
    }else if(snakeSpeedDelay>60){
        snakeSpeedDelay -=2
    }else if(snakeSpeedDelay>30){
        snakeSpeedDelay -=1
    }
}


//this is the function used to check whether the game is over (by checking collision in walls or collide by snake itself)
function isgameOver(){
    const head=snake[0]
    if(head.x<1 || head.x>gridSize || head.y<1 || head.y>gridSize) {
        resetGame()
    }

    for(let i=1;i<snake.length;i++){
        if(head.x===snake[i].x && head.y===snake[i].y){
            resetGame()
        }
    }
}

//function used to reset all the previous properties
function resetGame(){
    stopGame();
    updateHighScore();
    snake=[{x:10,y:10}];
    snakeSpeedDelay=200;
    direction='left';
    food=foodPosition();
    updateScore();
}

//function used to update the score according to the length of snake/when eating the food
function updateScore(){
    const currentScore=snake.length-1
    const score=document.querySelector('.score')    
    score.textContent=currentScore.toString().padStart(3,'0')
}

//This function will work when the game gets over. So it will change the game board as like before the game starts,and also shows "game over"
function stopGame(){
    clearInterval(gameInterval)
    gameStarted=false
    image.style.display='block';
    text.style.display='block';
    gameOverText.style.display='block'
    board.style.backgroundColor='white';
    
}

//This function will updates the highscore, when the current score gets greater than the highscore
function updateHighScore(){
    const currentScore=snake.length-1
    const dispHighScore=`High:${currentScore}`
    const highScore=document.querySelector('.high-score')
    if(currentScore>newHighScore){
        highScore.textContent=dispHighScore.toString().padStart(3,'0')
        newHighScore=currentScore
    }
    

}


