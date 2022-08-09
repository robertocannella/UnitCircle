// Utility Functions
function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// Constants
const WIDTH = Math.min(window.innerWidth, 350);
const HEIGHT = Math.min(350, WIDTH);
const MARGIN_X = 20;
const MARGIN_Y = 20;
const ORIGIN_X = HEIGHT / 2;
const ORIGIN_Y = WIDTH / 2;
const Gen = d3.line();
const svg = d3.select('#canvas')
    .append('svg').attr('width', WIDTH).attr('height', HEIGHT);

// Set initial configuration
let currentX = scale(Math.sqrt(2) / 2, MARGIN_X, WIDTH - MARGIN_X, -1.5, 1.5);
let currentY = scale(Math.sqrt(2) / 2, MARGIN_Y, HEIGHT - MARGIN_Y, 1.5, -1.5);
let radius = scale(1, -1.5, 1.5, 0, WIDTH / 2 - MARGIN_X)
let startAngle = (Math.PI * 0 / 180) - Math.PI * 2
let endAngle = Math.atan(currentY / currentX) - Math.PI * 2


// Event Handlers
const radiusElement = document.getElementById('myRadius')
let currentAngle = radiusElement.value
radiusElement.addEventListener("input", () => {

    update(radiusElement.value);
});


// D3 setup function
const setup = () => {
    buildAxes();
    buildInitial();
}
setup();

// D3 update function
const update = (currentAngle) => {
    // Create a new arc path
    const arc = d3.arc()
        .innerRadius(15)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(Math.PI * currentAngle / 180)

    // Bind the arc path
    d3.select('.arc-path')
        .datum(arc)
        .attr('d', (d) => { return d })
        .attr('transform', `translate(${ORIGIN_X},${ORIGIN_Y})`)
        .attr('transform', `translate(${ORIGIN_X},${ORIGIN_Y}) rotate(${90}) scale(-1,1)`)

    // Update Theta
    d3.select('.theta')
        .text(`\u03B8 = ${parseInt(currentAngle)} \u00B0`)


    // Update Trig Functions
    const x = radius * Math.sin(Math.PI * currentAngle / 180);
    const y = radius * - Math.cos(Math.PI * currentAngle / 180);
    // Because we are mirroring the circle, we need to swap secant and cosecant
    const cosecant = (1 / (Math.cos(Math.PI * currentAngle / 180))) * radius   // <-- this is the SEC formula 
    let secant = (1 / (Math.sin(Math.PI * currentAngle / 180))) * radius     // <-- This is the CSC formula

    if (secant == 'Infinity')
        secant = 99999


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

function getTrigValues() {

}

function buildAxes() {
    // Set Scales
    const xPosScale = d3.scaleLinear()
        .domain([-1.5, 1.5])
        .range([WIDTH / 2, WIDTH - MARGIN_X])
    const xNegScale = d3.scaleLinear()
        .domain([1.5, -1.5])
        .range([MARGIN_X, WIDTH / 2])
    const yPosScale = d3.scaleLinear()
        .domain([-1.5, 1.5])
        .range([HEIGHT / 2, MARGIN_Y])
    const yNegScale = d3.scaleLinear()
        .domain([-1.5, 1.5])
        .range([HEIGHT / 2, HEIGHT - MARGIN_Y])

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




    // append axes
    svg.append("g")
        .attr('class', 'x-positive-axis')
        // align the axis to the middle of the canvas
        .attr("transform", `translate(0,${HEIGHT / 2})`)
        .call(xPosAxis);
    svg.append("g")
        .attr('class', 'x-negative-axis')
        // align the axis to the middle of the canvas
        .attr("transform", `translate(0,${HEIGHT / 2})`)
        .call(xNegAxis);
    svg.append("g")
        .attr('class', 'y-positive-axis')
        // align the axis to the middle of the canvas
        .attr("transform", `translate(${WIDTH / 2},0)`)
        .call(yPosAxis);
    svg.append("g")
        .attr('class', 'y-negative-axis')
        // align the axis to the middle of the canvas
        .attr("transform", `translate(${WIDTH / 2},0)`)
        .call(yNegAxis);

    // Generate a complete circle
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
        .startAngle(startAngle)
        .endAngle(Math.PI * 2)

    // Append complete circle
    svg.append('path')
        .datum(arc)
        .attr('d', (d) => { return d })
        .attr('transform', `translate(${ORIGIN_X},${ORIGIN_Y}) rotate(90)`)
        .attr('fill', 'none')
        .attr('class', 'full-path')
        .attr('stroke', 'white')
        .attr('opacity', .3)
}

function buildInitial() {

    // Create the Ray
    // Making a line Generator
    var x = radius * Math.sin(Math.PI * currentAngle / 180);
    var y = radius * - Math.cos(Math.PI * currentAngle / 180);
    const tanXIntercept = radius * Math.tan(Math.PI * currentAngle / 180)

    // Because we are mirroring the circle, we need to swap secant and cosecant
    const secant = (1 / (Math.cos(Math.PI * currentAngle / 180))) * radius
    const cosecant = (1 / (Math.sin(Math.PI * currentAngle / 180))) * radius




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
        .attr('transform', `translate(${ORIGIN_X},${ORIGIN_Y}) rotate(90) scale(-1,1)`)
    svg.append('path')
        .attr('d', sinLine)  // <-- USE SIN because of mirroring
        .attr('class', 'cosine')
        .attr('transform', `translate(${ORIGIN_X},${ORIGIN_Y}) rotate(90) scale(-1,1)`)
    svg.append('path')
        .attr('d', hypotenuseLine)
        .attr('class', 'hypotenuse')
        .attr('transform', `translate(${ORIGIN_X},${ORIGIN_Y}) rotate(90) scale(-1,1)`)
    svg.append('path')
        .attr('d', tangentLine)
        .attr('class', 'cotangent')
        .attr('transform', `translate(${ORIGIN_X},${ORIGIN_Y}) rotate(90) scale(-1,1)`)
    svg.append('path')
        .attr('d', cotangentLine)
        .attr('class', 'tangent')
        .attr('transform', `translate(${ORIGIN_X},${ORIGIN_Y}) rotate(90) scale(-1,1)`)

    // This is the full circle
    const fullArc = d3.arc()
        .innerRadius(15)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(Math.PI * currentAngle / 180)

    svg.append('path')
        .datum(fullArc)
        .attr('d', (d) => { return d })
        .attr('transform', `translate(${ORIGIN_X},${ORIGIN_Y})`)
        .attr('transform', `translate(${ORIGIN_X},${ORIGIN_Y}) rotate(${90}) scale(-1,1)`)
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
}



