/**
 * Code to calculate time needed for a 90 degress turn at (45, 45) otuput force
 */

//useful enums
enum UpDown {
    Up = 1,
    Down = -1,
}

//known constants
const MS_PER_SECOND = 1e6; //ms in one second
const NINETY_DEGREES = 90; //the number 90
const MAX_DEGREES = 360; //max numbers of degrees we can turn

//we will start assuming that it takes 1 second to turn 200 degrees
const INITIAL_DEGREES_PER_SECOND = 200;

//we will jump through degrees with step. Initially set at 5, it decreases as we get closer to desired degrees per second.
const INITIAL_STEP_JUMP = 100;

//make sure pins begin at 0 speed
pins.servoWritePin(AnalogPin.P1, 90);
pins.servoWritePin(AnalogPin.P2, 90);

//start displaying the initial degrees per second in the LED screen
basic.showNumber(INITIAL_DEGREES_PER_SECOND)


/**
 * Set both pins for a few seconds trying to get it 90 degrees to the left
 */
const test90 = () => {    

    //update LED display
    if(currentDegreesPerSecond > MAX_DEGREES) currentDegreesPerSecond -= MAX_DEGREES;
    if(currentDegreesPerSecond < 0) currentDegreesPerSecond += MAX_DEGREES;
    basic.showNumber(currentDegreesPerSecond)

    //time to wait has been calculated as follows:

    /**
    * 90 degrees / (x degrees / second) = 90 / x seconds
    * Where x is the currently assumed number of degrees that are turned in one second
    * And then converted to miliseconds
    */
    const timeToWait = NINETY_DEGREES / currentDegreesPerSecond * MS_PER_SECOND;

    //Ask robot to turn at (45, 45)
    pins.servoWritePin(AnalogPin.P1, 45);
    pins.servoWritePin(AnalogPin.P2, 45);

    //wait calculated time that we hope is needed for 90 degrees
    control.waitMicros(timeToWait);

    //stop robot
    pins.servoWritePin(AnalogPin.P1, 90);
    pins.servoWritePin(AnalogPin.P2, 90);
}


//degrees per second set to initial state
let currentDegreesPerSecond = INITIAL_DEGREES_PER_SECOND;

//jump step set to initial step jump
let currentStepJump = INITIAL_STEP_JUMP;

//mark if it's the first time we test or not
let firstTest = true;

//mark if we were previously going up or down
let currentDirection = UpDown.Up;

const updateCurrentDegreesPerSecond = (direction: UpDown) => {
    //if new direction matches previosu direction, simply update degreesPerSecond
    if (currentDirection === direction) {
        currentDegreesPerSecond = currentDegreesPerSecond + (direction * currentStepJump);
        return;
    }

    //if directions don't match:

    //update currentStepJump
    currentStepJump = Math.ceil(currentStepJump/2);

    //update degrees per second
    currentDegreesPerSecond = currentDegreesPerSecond + (direction * currentStepJump);

    //update current direction
    currentDirection = -currentDirection;
}

//code to execute when a button is pressed
input.onButtonPressed(Button.A, function () {
    
    //wait half a second to let hand move away 
    control.waitMicros(0.5 * MS_PER_SECOND);

    //if it's not the first time we test, update degree before testing
    if(!firstTest)
        updateCurrentDegreesPerSecond(UpDown.Up)
    firstTest = false;

    //attempt 90 degrees turn
    test90();
})

//code to execute when b button is pressed
input.onButtonPressed(Button.B, function () {

    if(firstTest) 
        currentDirection = UpDown.Down

    //wait half a second to let hand move away 
    control.waitMicros(0.5 * MS_PER_SECOND);

    //if it's not the first time we test, update degree before testing
    if(!firstTest)
        updateCurrentDegreesPerSecond(UpDown.Down)

    firstTest = false;

    //attempt 90 degrees turn
    test90();
})