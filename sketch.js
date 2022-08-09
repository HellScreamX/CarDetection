let car
let x, y;
let snap;
let xoff;
let roadCanvas;
let roadWidth;
let displayedData = {}
let neuralNetwork
function setup() {
    createCanvas(800, 800);
    pixelDensity(1)

    //initial car+ starting road position
    xoff = 0
    x = 0
    y = noise(xoff) * height

    //road init
    roadCanvas = createGraphics(800, 800)
    roadWidth = 50

    //car init(x, y, velocity, staticRotation, moveSpeed)
    car = new Vehicle(x, y, PI / 2, 0.01, 0.2, AIHelper)

    //data display init
    addDispaly();

    neuralNetwork = new NeuralNetwork()

}
function draw() {
    background(0, 0, 0)
    generateRoad()
    car.update(roadCanvas)
    car.draw(roadCanvas)
    updateDispaly()
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
        xoff += 0.06
        oldX = x;
        oldY = y;
    }
    image(roadCanvas, 0, 0)

}
function addDispaly() {
    displayedData.rotation = createP('');
    displayedData.captors = []
    for (let index = 0; index < car.captors.length; index++) {
        displayedData.captors[index] = createP('');
    }
    displayedData.historyRecordsCount = createP('')

    displayedData.recordButton = createButton("REC")
    displayedData.recordButton.mousePressed(() => {
        car.isRecording = true;
    })

    displayedData.recordButton = createButton("STOP")
    displayedData.recordButton.mousePressed(()=>{
        car.isRecording=false;
    })

    displayedData.recordButton = createButton("RESET")
    displayedData.recordButton.mousePressed(()=>{
        car.recordHistory=[];
    })
    displayedData.recordButton = createButton("SEND")
    displayedData.recordButton.mousePressed(()=>{
        AISend(car.recordHistory)
    })


}
function updateDispaly() {
    displayedData.rotation.html("rotation: " + car.rotations.indexOf(car.rotation));
    for (let index = 0; index < car.captors.length; index++) {
        displayedData.captors[index].html("captor " + (index + 1) + ": " + car.detections[index]);
    }
    displayedData.historyRecordsCount.html('records count: ' + car.recordHistory.length)
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
}
function AIHelper(data){
    //console.log(data)
    decision = neuralNetwork.processing(data)
    
    
    return decision
}
function AISend(data){
    //console.log(data)
    neuralNetwork.send(data)
    
}



