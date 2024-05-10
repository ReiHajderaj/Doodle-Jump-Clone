document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')


    //needed variables
    let doodlerSpaceLeft=0;
    let startPoint = 120;
    let doodlerSpaceButtom= startPoint;
    let isGameOver= false;
    let platformCount=5;
    let platforms= [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let score = 0;

    //appending doodler to screen

    function createDoodler (){
        doodlerSpaceLeft = platforms[0].left
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        
        doodlerSpaceLeft = platforms[0].left
        doodler.style.left=`${doodlerSpaceLeft}px`;
        doodler.style.bottom=`${doodlerSpaceButtom}px`;
    }


    //creating jumping platforms
    function createPlatforms (){
        for(let i=0; i<platformCount; i++){
            let platformGap = 600/platformCount;
            let newPlatBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)

        }
    }

    //platform class
    class Platform{
        constructor(newPlatBottom){
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315

            this.visual = document.createElement('div')

            const visual = this.visual

            visual.classList.add('platform')
            visual.style.left = `${this.left}px`
            visual.style.bottom = `${this.bottom}px`
            grid.appendChild(visual)

        }
    }
    function movePlatforms(){
        if(!isGameOver){
            platforms.forEach((platform) =>{
                platform.bottom-=2;

                let visual = platform.visual
                visual.style.bottom = `${platform.bottom}px`
                if(platform.bottom < 10){
                    let fisrtPlatform = platforms[0].visual;
                    fisrtPlatform.classList.remove('platform')
                    platforms.shift()
                    
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform)

                }
            })
        }
        // console.log('hello');

    }

    function jump(){
        upTimerId = setInterval(()=>{
            clearInterval(downTimerId)
            isJumping = true
            doodlerSpaceButtom += 7
            doodler.style.bottom = `${doodlerSpaceButtom}px`
            if ((doodlerSpaceButtom > startPoint + 200)
            || (doodlerSpaceButtom > 700)){
                fall()
            }
        },10)
    }

    function fall(){
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function(){
            doodlerSpaceButtom -=3.5
            doodler.style.bottom = `${doodlerSpaceButtom}px`
            if(doodlerSpaceButtom <=0){
                gameOver()
            }

            platforms.forEach((platform)=>{
                if((doodlerSpaceButtom>= platform.bottom)
                && (doodlerSpaceButtom <= (platform.bottom + 15))
                && ((doodlerSpaceLeft + 60) >= platform.left)
                && (doodlerSpaceLeft <= (platform.left + 85))
                && !isJumping){

                    
                    startPoint = doodlerSpaceButtom;
                    if(!isJumping){
                        score += 5;
                        isJumping = true
                        jump()
                    }
                }
            })
        },10)

        
    }

    function gameOver(){
        console.log('game over');
        isGameOver = true;

        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }

        grid.innerHTML = `Score: ${score}`
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)


    }

    function control(e){
        if(e.key ==='ArrowLeft'){
            moveLeft()
        }
        if(e.key ==='ArrowRight'){
            moveRight()
        }
        if(e.key ==='ArrowUp'){
            moveStraight()
        }
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        if(!isGoingLeft){
            isGoingLeft = true;
        leftTimerId = setInterval(()=>{
            
            if(doodlerSpaceLeft > 0){
                doodlerSpaceLeft -= 2;
                doodler.style.left = `${doodlerSpaceLeft}px`
            } else{
                moveRight()
            }
        
        
        },10)
    }
}

    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        
        if(!isGoingRight){
            isGoingRight = true
            rightTimerId = setInterval(()=>{
            if(doodlerSpaceLeft<= 340){
                doodlerSpaceLeft += 2
                doodler.style.left = `${doodlerSpaceLeft}px`

            } else{
                moveLeft()
            }
            
        
        
        },10)
    }
}

    function moveStraight(){
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)

    }

    function start(){
        if(!isGameOver){
            
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms,10);
            jump()
            document.addEventListener('keydown', control)
        }
    }

    start()
})