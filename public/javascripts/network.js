const Layer = synaptic.Layer;
const Network = synaptic.Network;
const Trainer = synaptic.Trainer;

const input = new Layer(5);
const output = new Layer(4);

input.project(output);

const myNetwork = new Network({
    input: input,
    output: output
});

var trainingData = [
    // input: foodInRange, top_, right, bottom, left (the direction closer to the food is 1)
    // output: top_, right, bottom, left
    {input: [1, 0, 0, 0, 0], output: [0, 0, 0, 0]},
    {input: [1, 1, 0, 0, 0], output: [1, 0, 0, 0]},
    {input: [1, 0, 1, 0, 0], output: [0, 1, 0, 0]},
    {input: [1, 1, 1, 0, 0], output: [1, 1, 0, 0]},

    {input: [1, 0, 0, 1, 0], output: [0, 0, 1, 0]},
    {input: [1, 1, 0, 1, 0], output: [1, 0, 1, 0]},
    {input: [1, 0, 1, 1, 0], output: [0, 1, 1, 0]},
    {input: [1, 1, 1, 1, 0], output: [1, 1, 1, 0]},

    {input: [1, 0, 0, 0, 1], output: [0, 0, 0, 1]},
    {input: [1, 1, 0, 0, 1], output: [1, 0, 0, 1]},
    {input: [1, 0, 1, 0, 1], output: [0, 1, 0, 1]},
    {input: [1, 1, 1, 0, 1], output: [1, 1, 0, 1]},

    {input: [1, 0, 0, 1, 1], output: [0, 0, 1, 1]},
    {input: [1, 1, 0, 1, 1], output: [1, 0, 1, 1]},
    {input: [1, 0, 1, 1, 1], output: [0, 1, 1, 1]},
    {input: [1, 1, 1, 1, 1], output: [1, 1, 1, 1]},
//====================================================
    {input: [0, 0, 0, 0, 0], output: [0, 0, 0, 0]},
    {input: [0, 1, 0, 0, 0], output: [0, 0, 0, 0]},
    {input: [0, 0, 1, 0, 0], output: [0, 0, 0, 0]},
    {input: [0, 1, 1, 0, 0], output: [0, 0, 0, 0]},

    {input: [0, 0, 0, 1, 0], output: [0, 0, 0, 0]},
    {input: [0, 1, 0, 1, 0], output: [0, 0, 0, 0]},
    {input: [0, 0, 1, 1, 0], output: [0, 0, 0, 0]},
    {input: [0, 1, 1, 1, 0], output: [0, 0, 0, 0]},

    {input: [0, 0, 0, 0, 1], output: [0, 0, 0, 0]},
    {input: [0, 1, 0, 0, 1], output: [0, 0, 0, 0]},
    {input: [0, 0, 1, 0, 1], output: [0, 0, 0, 0]},
    {input: [0, 1, 1, 0, 1], output: [0, 0, 0, 0]},

    {input: [0, 0, 0, 1, 1], output: [0, 0, 0, 0]},
    {input: [0, 1, 0, 1, 1], output: [0, 0, 0, 0]},
    {input: [0, 0, 1, 1, 1], output: [0, 0, 0, 0]},
    {input: [0, 1, 1, 1, 1], output: [0, 0, 0, 0]},
];

var learningRate = 0.2;

function train() {
    for (var i = 0; i < trainingData.length; i++) {
        input.activate(trainingData[i]["input"]);
        output.activate();
        output.propagate(learningRate, trainingData[i]["output"]);
    }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function retrain() {
    for(var i = 0; i < 10; i++) {
        trainingData = shuffle(trainingData);
        train();
    }
}

retrain(); // Start the training

function getNextDir(coordsX, coordsY, fArray) {
    // process coordinates to get foodInRange and direction differences
    var foodInRange = 0;
    var range = 50;
    var top_, right, bottom, left;
    top_ = right = bottom = left = 0;

    for (var i=0; i<fArray.length; i+=2) {
        if (coordsX - range <= fArray[i] && fArray[i] <= coordsX + range || coordsY - range <= fArray[i+1] && fArray[i+1] <= coordsY + range) {
            foodInRange = 1;
        }
        if (coordsX < fArray[i]) {
            right = 1;
        } else if (coordsX > fArray[i]) {
            left = 1;
        }
        if (coordsY < fArray[i+1]) {
            bottom = 1;
        } else if (coordsY > fArray[i+1]) {
            top_ = 1;
        }
    }

    console.log(foodInRange);
    console.log(top_);
    console.log(right);
    console.log(bottom);
    console.log(left);

    input.activate([foodInRange, top_, right, bottom, left]); // food is top_ left
    var result = output.activate();

    console.log("Top Neuron: " + result[0] * 100 + "%"); // top
    console.log("Right Neuron: " + result[1] * 100 + "%"); // right
    console.log("Bottom Neuron: " + result[2] * 100 + "%"); // bottom
    console.log("Left Neuron: " + result[3] * 100 + "%"); // left

    var resultDirection = [0, 0, 0, 0];
    var x = Math.floor(Math.random() * 101);
    for (var i=0; i<4; i++) {
        if (x > result[0]*100 + result[2]*100) {
            resultDirection[0] = resultDirection[2] = 0;
        } else if (result[2]*100 < x && x <= (result[2] + result[0])*100) {
            resultDirection[0] = 1;
        } else {
            resultDirection[2] = 1;
        }
        if (x > result[1]*100 + result[3]*100) {
            resultDirection[1] = resultDirection[3] = 0;
        } else if (result[3]*100 < x && x <= (result[3] + result[1])*100) {
            resultDirection[1] = 1;
        } else {
            resultDirection[3] = 1;
        }
    }
    return resultDirection;
}
