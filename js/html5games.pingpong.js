var KEY = {
    UP: 38,
    DOWN: 40,
    W: 87,
    S: 83
}
var pingpong = {
    scoreA : 0, // score for player A
    scoreB : 0  // score for player B
}
pingpong.ball = {
    speed: 5,
    x: 150,
    y: 150,
    directionX: 1,
    directionY: 1
}
pingpong.pressedKeys = [];

$(function(){
    // set interval to call gameloop  every 30 milliseconds
    pingpong.timer = setInterval(gameloop, 20);
    // mark down what key is down and up into an array called "pressedKeys"
    $(document).keydown(function(e){
        pingpong.pressedKeys[e.which] = true;
    });
    $(document).keyup(function(e){
        pingpong.pressedKeys[e.which] = false;
    });
});

function gameloop(){
    moveBall();
    movePaddles();
}

function moveBall(){
    // reference useful variables
    var playground = $("#playground");
    var playgroundHeight = parseInt(playground.height());
    var playgroundWidth = parseInt(playground.width());

    var ball = pingpong.ball;
    //check playground boundary
    //check bottom edge
    if(ball.y + ball.speed * ball.directionY > playgroundHeight - 10){
        ball.directionY = -1;
    }

    //check top edge
    if(ball.y + ball.speed * ball.directionY < -5){
        ball.directionY = 1;
    }

    //check right edge
    if(ball.x + ball.speed * ball.directionX > playgroundWidth - 10){
        // player B lost.
        pingpong.scoreA++;
        $("#scoreA").html(pingpong.scoreA);
        // rest the ball;
        ball.x = 250;
        ball.y = 100;
        $("#ball").css({
            "left": ball.x,
            "top": ball.y
        });
        ball.directionX = -1;
    }

    //check left edge
    if(ball.x + ball.speed * ball.directionX < -10){
        // player A lost
        pingpong.scoreB++;
        $("#scoreB").html(pingpong.scoreB);
        // reset the ball;
        ball.x = 150;
        ball.y = 100;
        $("#ball").css({
            "left": ball.x,
            "top": ball.y
        });
        ball.directionX= 1;
    }

    ball.x += ball.speed * ball.directionX;
    ball.y += ball.speed * ball.directionY;

    // check moving paddle here, later
    // actuall move the ball with speed and direction
    $("#ball").css({
        "left": ball.x,
        "top": ball.y
    });

    //check left paddle
    var paddlePosA = getPaddlePosition("#paddleA");
    if(collision(paddlePosA, ball, true)) ball.directionX = 1;
    //check right paddle
    var paddlePosB = getPaddlePosition("#paddleB");
    if(collision(paddlePosB, ball)) ball.directionX = -1;
}

function getPaddlePosition(paddleName){
    var paddle = $(paddleName);
    var width = parseInt(paddle.css("width"));
    var height = parseInt(paddle.css("height"));
    var top = parseInt(paddle.css("top"));
    var left = parseInt(paddle.css("left"));

    var paddle = {
        xLeft: left,
        xRight: left + width,
        yBottom: top + height,
        yTop: top
    };

    return paddle;
}

function collision(paddle, ball){
    var nextPosX = ball.x + (ball.speed * ball.directionX) + 10;
    var nextPosY = ball.y + (ball.speed * ball.directionY) + 10;
    if (nextPosX >= paddle.xLeft && 
        nextPosX <= paddle.xRight) {
        if (nextPosY <= paddle.yBottom &&
            nextPosY >= paddle.yTop) {            
            return true;
        }
    }
    return false;
}

function movePaddles(){
    //use our custom timer to continuosly check if a key is pressed.
    move(KEY.UP,    "#paddleB", -5);
    move(KEY.DOWN,  "#paddleB",  5);
    move(KEY.W,     "#paddleA", -5);
    move(KEY.S,     "#paddleA",  5);
}

function move(key, object, dist) {
    if(pingpong.pressedKeys[key]){
        //move the paddle B up 5 pixels
        var top = parseInt($(object).css("top"));
        $(object).css("top",top + dist);
    }
}