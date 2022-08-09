class Vehicle {
    constructor(x, y, velocity, staticRotation, moveSpeed, aiCallBack, crashCallback) {
        this.rotations = []
        this.rotations["left"] = staticRotation * 1;
        this.rotations["right"] = staticRotation * (-1);
        this.rotations["straight"] = staticRotation * 0;
        this.rotationLabel = "straight"
        this.captorRange = 150
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.rotation = 0;
        this.moveSpeed = moveSpeed
        this.captors = [PI / 4, -PI / 4, 0, PI / 2, -PI / 2];
        this.detections = []
        this.staticRotation = staticRotation
        this.dangerRange = 30;
        this.recordHistory = []
        this.isRecording = true;
        this.AIGuided = false;
        this.aiCallBack = aiCallBack;
        this.crashCallback = crashCallback;
        this.crashed = 0;

    }
    update(myCanvas) {

        this.x = map(sin(this.velocity), 0, 1, this.x, this.x + this.moveSpeed)
        this.y = map(cos(this.velocity), 0, 1, this.y, this.y + this.moveSpeed)
        this.velocity = this.velocity + this.rotation

        for (let index = 0; index < this.captors.length; index++) {
            const element = this.captors[index];
            let i;
            for (i = 0; i < this.captorRange; i++) {

                let myX = floor(sin(this.captors[index] + this.velocity) * i + this.x);
                let myY = floor(cos(this.captors[index] + this.velocity) * i + this.y);
                if (myCanvas.pixels[(myX + myY * width) * 4 + 1] == 0) {
                    break;
                }

            }
            if (i == 0) {
                this.crashCallback();
            }
            this.detections[index] = i;
            if (this.isRecording) {
                this.recordHistory.push({
                    label: this.rotationLabel,
                    cap1: this.detections[0],
                    cap2: this.detections[1],
                    cap3: this.detections[2],
                    cap4: this.detections[3],
                    cap5: this.detections[4],
                })
            }

            if (this.AIGuided) {
                let output = this.aiCallBack(this.detections)
                this.rotate(output)
            }
        }

    }
    record(isRecording) {
        if (isRecording) this.isRecording = true;
        else this.isRecording = false
    }
    draw(myCanvas) {
        rectMode(CENTER)
            //canvas.clear()
        fill(255, 0, 0)
        translate(this.x, this.y);
        rotate(-this.velocity)
        fill(0, 0, 255)
        noStroke()
        strokeWeight(1)
        rect(0, 0, 20, 50);

        stroke(255, 0, 0, 255)
        myCanvas.loadPixels();
        for (let index = 0; index < this.captors.length; index++) {
            if (index == 0)
                stroke(0, 0, 255) //blue
            if (index == 1)
                stroke(0, 255, 255) //cyon
            if (index == 2)
                stroke(0, 255, 0) //green
            if (index == 3)
                stroke(255, 255, 0) // jeune
            if (index == 4)
                stroke(255, 0, 0) //red

            const element = this.captors[index];

            if (this.detections[index] < this.dangerRange) {

                strokeWeight(2)
            }
            line(0, 0, sin(element) * this.captorRange, cos(element) * this.captorRange);
            strokeWeight(1)
        }
        // line(0, 0, sin(PI / 4) * 50, cos(PI / 4) * 50);
        // line(0, 0, sin(-PI / 4) * 50, cos(-PI / 4) * 50);
        // line(0, 0, sin(0) * 50, cos(0) * 50);
        // line(0, 0, sin(PI / 2) * 50, cos(PI / 2) * 50);
        // line(0, 0, sin(-PI / 2) * 50, cos(-PI / 2) * 50);



        let myX = floor(sin(this.velocity) * 50 + this.x);
        let myY = floor(cos(this.captors[0] + this.velocity) * 50 + this.y);
        //console.log(myCanvas.pixels[(myX + myY * width) * 4 + 1])


    }
    getDetections() {
        return this.detections;
    }
    turnLeft() {
        this.rotation = this.rotations.left

    }
    turnRight() {
        this.rotation = this.rotations.right
    }
    goStraight() {
        this.rotation = this.rotations.straight
    }
    rotate(direction) {
        switch (direction) {
            case "left":
                this.rotation = this.rotations.left
                this.rotationLabel = direction
                break;
            case "straight":
                this.rotation = this.rotations.straight
                this.rotationLabel = direction
                break;
            case "right":
                this.rotation = this.rotations.right
                this.rotationLabel = direction
                break;
            default:
                this.rotation = this.rotations.straight
                this.rotationLabel = direction
        }


    }
}