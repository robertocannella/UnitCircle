
function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const radiusElement = document.getElementById('myRadius')
let currentRadius = radiusElement.value
radiusElement.addEventListener("input", () => {

    update(radiusElement.value);
});

const update = (currentRadius) => {
    // Create a new arc path
    const arc = d3.arc()
        .innerRadius(15)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(Math.PI * currentRadius / 180)

    // Bind the arc path
    d3.select('.arc-path')
        .datum(arc)
        .attr('d', (d) => { return d })
        .attr('transform', `translate(${originX},${originY})`)
        .attr('transform', `translate(${originX},${originY}) rotate(${90}) scale(-1,1)`)

    // Update Theta
    d3.select('.theta')
        .text(`\u03B8 = ${parseInt(currentRadius)} \u00B0`)

    // Update Trig Functions
    const x = radius * Math.sin(Math.PI * currentRadius / 180);
    const y = radius * - Math.cos(Math.PI * currentRadius / 180);
    // Because we are mirroring the circle, we need to swap secant and cosecant
    const cosecant = (1 / (Math.cos(Math.PI * currentRadius / 180))) * radius   // <-- this is the SEC formula 
    const secant = (1 / (Math.sin(Math.PI * currentRadius / 180))) * radius     // <-- This is the CSC formula


    const sine = [
        [x, 0],
        [x, y]
    ];
    const cosine = [
        [x, y],
        [0, y]
    ];
    const hypotenuse = [
        [0, 0],
        [x, y]
    ];
    const cotangent = [
        [x, y],
        [0, -cosecant]
    ]
    const tangent = [
        [x, y],
        [secant, 0]
    ]

    const sinLine = Gen(sine);
    const cosineLine = Gen(cosine);
    const tangentLine = Gen(tangent);
    const cotangentLine = Gen(cotangent);
    const hypotenuseLine = Gen(hypotenuse);

    console.log(secant)
    d3.select('.sine')
        .attr('d', sinLine);
    d3.select('.cosine')
        .attr('d', cosineLine);
    d3.select('.hypotenuse')
        .attr('d', hypotenuseLine)
    d3.select('.cotangent')
        .attr('d', cotangentLine)
    d3.select('.tangent')
        .attr('d', tangentLine)
}


// Constants
const width = Math.min(window.innerWidth, 350);
const height = Math.min(350, width);
const marginX = 20;
const marginY = 20;
const originX = height / 2;
const originY = width / 2;

let currentX = scale(Math.sqrt(2), marginX, width - marginX, -1.5, 1.5);
let currentY = scale(2, marginY, height - marginY, 1.5, -1.5);
let radius = scale(1, -1.5, 1.5, 0, width / 2 - marginX)
let initial = 0
let startAngle = (Math.PI * initial / 180) - Math.PI * 2
let endAngle = Math.atan(currentY / currentX) - Math.PI * 2

// Set Scales
const xPosScale = d3.scaleLinear()
    .domain([-1.5, 1.5])
    .range([width / 2, width - marginX])
const xNegScale = d3.scaleLinear()
    .domain([1.5, -1.5])
    .range([marginX, width / 2])
const yPosScale = d3.scaleLinear()
    .domain([-1.5, 1.5])
    .range([height / 2, marginY])
const yNegScale = d3.scaleLinear()
    .domain([-1.5, 1.5])
    .range([height / 2, height - marginY])

// Configure Axes
// Here we need an positive and negative for each axis
const xPosAxis = d3.axisBottom(xPosScale)
    .tickValues([1])
    .tickFormat((d, i) => ['2\u03c0'][i]);
const xNegAxis = d3.axisBottom(xNegScale)
    .tickValues([1])
    .tickFormat((d, i) => ['\u03c0'][i]);
const yPosAxis = d3.axisLeft(yPosScale)
    .tickValues([1])
    .tickFormat((d, i) => ['\u03c0 / 2'])
const yNegAxis = d3.axisLeft(yNegScale)
    .tickValues([1])
    .tickFormat((d, i) => ['3\u03c0 / 2'][i]);
// append svg
const svg = d3.select('#canvas')
    .append('svg').attr('width', width).attr('height', height);

// append axes
svg.append("g")
    .attr('class', 'x-positive-axis')
    // align the axis to the middle of the canvas
    .attr("transform", `translate(0,${height / 2})`)
    .call(xPosAxis);
svg.append("g")
    .attr('class', 'x-negative-axis')
    // align the axis to the middle of the canvas
    .attr("transform", `translate(0,${height / 2})`)
    .call(xNegAxis);
svg.append("g")
    .attr('class', 'y-positive-axis')
    // align the axis to the middle of the canvas
    .attr("transform", `translate(${width / 2},0)`)
    .call(yPosAxis);
svg.append("g")
    .attr('class', 'y-negative-axis')
    // align the axis to the middle of the canvas
    .attr("transform", `translate(${width / 2},0)`)
    .call(yNegAxis);


const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
    .startAngle(startAngle)
    .endAngle(Math.PI * 2)

svg.append('path')
    .datum(arc)
    .attr('d', (d) => { return d })
    .attr('transform', `translate(${originX},${originY}) rotate(90)`)
    .attr('fill', 'none')
    .attr('class', 'full-path')
    .attr('stroke', 'white')
    .attr('opacity', .3)




// Create the Ray
// Making a line Generator


var x = radius * Math.sin(Math.PI * currentRadius / 180);
var y = radius * - Math.cos(Math.PI * currentRadius / 180);
const tanXIntercept = radius * Math.tan(Math.PI * currentRadius / 180)

// Because we are mirroring the circle, we need to swap secant and cosecant
const secant = (1 / (Math.cos(Math.PI * currentRadius / 180))) * radius
const cosecant = (1 / (Math.sin(Math.PI * currentRadius / 180))) * radius



const Gen = d3.line();
const tangent = [
    [0, -cosecant],
    [x, y],
]
const cotangent = [
    [x, y],
    [secant, 0]
]
const hypotenuse = [
    [0, 0],
    [x, y]
];
const sine = [
    [x, y],
    [x, 0]
];
const cosine = [
    [x, y],
    [0, y]
];


const sinLine = Gen(sine);
const cosineLine = Gen(cosine);
const tangentLine = Gen(tangent);
const cotangentLine = Gen(cotangent);
const hypotenuseLine = Gen(hypotenuse);

// Because of having to mirror the direction of the arc, we need to 
// swap sine and cosine
svg.append('path')
    .attr('d', cosineLine) // <-- USE COS because of mirroring
    .attr('class', 'sine')
    .attr('transform', `translate(${originX},${originY}) rotate(90) scale(-1,1)`)
svg.append('path')
    .attr('d', sinLine)  // <-- USE SIN because of mirroring
    .attr('class', 'cosine')
    .attr('transform', `translate(${originX},${originY}) rotate(90) scale(-1,1)`)
svg.append('path')
    .attr('d', hypotenuseLine)
    .attr('class', 'hypotenuse')
    .attr('transform', `translate(${originX},${originY}) rotate(90) scale(-1,1)`)
svg.append('path')
    .attr('d', tangentLine)
    .attr('class', 'cotangent')
    .attr('transform', `translate(${originX},${originY}) rotate(90) scale(-1,1)`)
svg.append('path')
    .attr('d', cotangentLine)
    .attr('class', 'tangent')
    .attr('transform', `translate(${originX},${originY}) rotate(90) scale(-1,1)`)

// This is the full circle
const fullArc = d3.arc()
    .innerRadius(15)
    .outerRadius(radius)
    .startAngle(0)
    .endAngle(Math.PI * currentRadius / 180)

svg.append('path')
    .datum(fullArc)
    .attr('d', (d) => { return d })
    .attr('transform', `translate(${originX},${originY})`)
    .attr('transform', `translate(${originX},${originY}) rotate(${90}) scale(-1,1)`)
    .attr('class', 'arc-path')



//Drag point
// svg.append('circle')
//     .attr('cx', () => radius * Math.cos(endAngle))
//     .attr('cy', () => radius * Math.sin(endAngle))
//     .attr('r', '6px')
//     .attr('class', 'ray-point')
//     .attr('transform', `translate(${originX},${originY})`)
//     .call(dragCircle)

// Theta
svg.append("text")
    .text("\u03B8 = 45\u00B0")
    .attr('fill', 'aqua')
    .attr('class', 'theta')
    .attr('x', 20)
    .attr('y', 20)
