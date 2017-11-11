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
    // input: foodInRange, top, right, bottom, left (the direction closer to the food is 1)
    // output: top, right, bottom, left
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

//input: coordinates (2), direction (4),
//       in food range(1), direction difference(4)
//output: direction(4)

var learningRate = 0.4;

function train() {
    for(var i = 0; i < trainingData.length; i++) {
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
    for(var i = 0; i < 1000; i++) {
        trainingData = shuffle(trainingData);
        train();
    }
}

retrain(); // Start the training

input.activate([1,0,0,1,1]); // food is top
var result = output.activate();

console.log("Top Neuron: " + result[0] * 100 + "%");
console.log("Right Neuron: " + result[1] * 100 + "%");
console.log("Bottom Neuron: " + result[2] * 100 + "%");
console.log("Left Neuron: " + result[3] * 100 + "%");
