let car
let x, y;
let snap;
let roadCanvas;
let roadWidth;
let roadHardness;
let roadNoiseSeed;
let displayedData;
let neuralNetwork
let started = false;

function setup() {
    displayedData = {}
    displayedData.mainCanvas = createCanvas(500, 500);
    displayedData.mainCanvas.addClass('flex-child');

    pixelDensity(1)

    //road init
    initRoad()

    //car init 
    initCar()

    //data display init
    addDisplay();

    neuralNetwork = new NeuralNetwork()

}
function draw() {
    background(0, 0, 0)
    generateRoad()
    if (started) {

        car.update(roadCanvas)
        car.draw(roadCanvas)
        updateDisplay()
    }

}

function initCar() {
    //initial car+ starting road position
    xoff = 0
    x = 0
    y = noise(xoff) * height

    //car init(x, y, velocity, staticRotation, moveSpeed, AICallBack)
    car = new Vehicle(x, y, PI / 2, 0.01, 0.5, AIHelper, ()=>{initCar(); car.recordHistory = [];})
}
function initRoad() {
    roadCanvas = createGraphics(500, 500)
    roadWidth = 50
    roadHardness = 0.06
    roadNoiseSeed = 0;

    if (roadNoiseSeed == 0) {
        roadNoiseSeed = floor(random(-100000, 100000))
        noiseSeed(roadNoiseSeed)
    }
    else {
        noiseSeed(roadNoiseSeed)
    }
}
function generateRoad() {
    xoff = 0
    oldY = noise(xoff) * height
    oldX = 0;
    for (let x = 10; x < width; x = x + 10) {
        var y = noise(xoff) * height
        roadCanvas.stroke(255)
        roadCanvas.point(x, y)
        roadCanvas.strokeWeight(roadWidth)
        roadCanvas.line(oldX, oldY, x, y)
        xoff += roadHardness
        oldX = x;
        oldY = y;
    }
    image(roadCanvas, 0, 0)

}
function addDisplay() {
    displayedData.alldisplays = createDiv("")
    displayedData.alldisplays.addClass('flex-container');

    displayedData.mainCanvas.parent(displayedData.alldisplays)

    displayedData.buttonsArea = createDiv("")

    displayedData.statsArea = createDiv("")
    displayedData.statsArea.addClass('flex-child');
    displayedData.statsArea.parent(displayedData.alldisplays)

    displayedData.rotation = createP('');
    displayedData.rotation.parent(displayedData.statsArea)
    displayedData.captors = []
    for (let index = 0; index < car.captors.length; index++) {
        displayedData.captors[index] = createP('');
        displayedData.captors[index].parent(displayedData.statsArea)
    }
    displayedData.historyRecordsCount = createP('')
    displayedData.historyRecordsCount.parent(displayedData.statsArea)

    displayedData.currentNoiseSeed = createP('')
    displayedData.currentNoiseSeed.parent(displayedData.statsArea)

    displayedData.recordButton = createButton("START")
    displayedData.recordButton.parent(displayedData.buttonsArea)
    displayedData.recordButton.mousePressed(() => {
        started = true;
    })
    displayedData.recordButton = createButton("RESTART")
    displayedData.recordButton.parent(displayedData.buttonsArea)
    displayedData.recordButton.mousePressed(() => {
        initCar();
    })

    displayedData.recordButton = createButton("REC")
    displayedData.recordButton.parent(displayedData.buttonsArea)
    displayedData.recordButton.mousePressed(() => {
        car.isRecording = true;
    })

    displayedData.recordButton = createButton("STOP")
    displayedData.recordButton.parent(displayedData.buttonsArea)
    displayedData.recordButton.mousePressed(() => {
        car.isRecording = false;
    })

    displayedData.recordButton = createButton("RESET")
    displayedData.recordButton.parent(displayedData.buttonsArea)
    displayedData.recordButton.mousePressed(() => {
        car.recordHistory = [];
    })
    displayedData.recordButton = createButton("SEND")
    displayedData.recordButton.parent(displayedData.buttonsArea)
    displayedData.recordButton.mousePressed(() => {
        neuralNetwork.sendData(car.recordHistory, () => {
            car.recordHistory = [];
            console.log("rrr")
        })
    })

    displayedData.recordButton = createButton("CHANGE ROAD")
    displayedData.recordButton.parent(displayedData.buttonsArea)
    displayedData.recordButton.mousePressed(() => {
        started = false;
        //road init
        initRoad()

        //car init 
        initCar()
    })
}
function updateDisplay() {
    displayedData.rotation.html("rotation: " + car.rotationLabel);
    for (let index = 0; index < car.captors.length; index++) {
        displayedData.captors[index].html("captor " + (index + 1) + ": " + car.detections[index]);
    }
    displayedData.historyRecordsCount.html('records count: ' + car.recordHistory.length)
    displayedData.currentNoiseSeed.html('current road number: ' + roadNoiseSeed)
}
function mousePressed() {
    //detection()

}
function keyPressed() {
    if (keyCode == LEFT_ARROW) {
        car.rotate("left")

    } else if (keyCode == RIGHT_ARROW) {
        car.rotate("right")

    }
    else if (keyCode == UP_ARROW) {
        car.rotate("straight")
    }
    else if (keyCode == 32) {
        started = true
    }
    else if (keyCode == BACKSPACE) {
        initCar();
    }
    else if (keyCode == DELETE) {
        car.recordHistory = [];
    }
    else if (keyCode == ENTER) {
        car.isRecording = !car.isRecording;
    }
}
function AIHelper(data) {
    //console.log(data)
    decision = neuralNetwork.processing(data)
    return decision
}




