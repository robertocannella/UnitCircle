
function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
// constants

const height = 375;
const width = 375;
const marginX = 24;
const marginY = 24;
const originX = height / 2;
const originY = width / 2;



let currentQuadrant = 1;
let currentX = scale(Math.sqrt(2), marginX, width - marginX, -1.5, 1.5);
let currentY = scale(2, marginY, height - marginY, 1.5, -1.5);
let radius = scale(1, -1.5, 1.5, 0, width / 2 - marginX)
let initial = 0
let startAngle = (Math.PI * initial / 180) - Math.PI * 2
let endAngle = Math.atan(currentY / currentX) - Math.PI * 2



const dragCircle = d3.drag()
    .on('start', function () {
        d3.select(this).raise();
        d3.select(this).attr('cursor', 'move');
    })
    .on('drag', function (event) {
        // Get new coordinates here and scale to chart
        const newX = scale(event.x, marginX, width - marginX, -1.5, 1.5);
        const newY = scale(event.y, marginY, height - marginY, 1.5, -1.5);

        // Set the new angle depending of the quadrant
        let endAngle = - Math.atan(newY / newX) - Math.PI * 2
        if (newX > 0 && newY > 0) { // quadrant 1
            endAngle = - Math.atan(newY / newX) - Math.PI * 2
        }
        if (newX < 0 && newY > 0) { // quadrant 2
            endAngle = - Math.atan(newY / newX) - Math.PI * 2 - (Math.PI)
        }
        if (newX < 0 && newY < 0) { // quadrant 3
            endAngle = - Math.atan(newY / newX) - Math.PI * 2 - (Math.PI)
        }
        if (newX > 0 && newY < 0) { // quadrant 4
            endAngle = - Math.atan(newY / newX) - Math.PI * 2 - (Math.PI * 2)
        }

        let degrees = scale(endAngle, - Math.PI * 2, - Math.PI * 4, 0, 360);
        // Update Theta
        d3.select('.theta')
            .text(`\u03B8 = ${parseInt(degrees)} \u00B0`)

        // Generate a new ARC path
        const arc = d3.arc()
            .innerRadius(15)
            .outerRadius(radius)
            .startAngle(startAngle)
            .endAngle(endAngle)

        d3.select('.arc-path')
            .datum(arc)
            .attr('d', (d) => { return d })
            .attr('transform', `translate(${originX},${originY}) rotate(${90})`)

        // Move Point
        d3.select(this).attr('cx', () => - radius * Math.cos(endAngle));
        d3.select(this).attr('cy', () => - radius * Math.sin(endAngle))
            .attr('transform', `translate(${originX},${originY}) rotate(180)`)

        // Animate Trig Functions Here
        // Move Ray
        const x = radius * Math.cos(endAngle)
        const y = radius * Math.sin(endAngle)
        const tangent = radius * Math.tan(endAngle)
        const tan = [
            [x, y],
            [tangent, 0]
        ]
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

        const pathOfLine = Gen(hypotenuse);
        const tanLine = Gen(tan)
        const sinLine = Gen(sine);
        const cosineLine = Gen(cosine);
        d3.select('.tangent')
            .attr('d', tanLine);
        d3.select('.sine')
            .attr('d', sinLine);
        d3.select('.cosine')
            .attr('d', cosineLine);
        d3.select('.ray')
            .attr('d', pathOfLine);
    })
    .on('end', function (d, i, nodes) {
        d3.select(this).attr('cursor', 'auto')
    })

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
    .innerRadius(15)
    .outerRadius(radius)
    .startAngle(startAngle)
    .endAngle(endAngle)

svg.append('path')
    .datum(arc)
    .attr('d', (d) => { return d })
    .attr('transform', `translate(${originX},${originY}) rotate(90)`)
    .attr('fill', 'none')
    .attr('class', 'arc-path')
    .attr('stroke', 'green')




// Create the Ray
// Making a line Generator

const mappedX = radius * Math.cos(endAngle)
const mappedY = radius * Math.sin(endAngle)
const tangent =  Math.tan(endAngle)
console.log(tangent)
const Gen = d3.line();


const hypotenuse = [
    [0, 0],
    [mappedX, mappedY]
];

const sine = [
    [mappedX, mappedY],
    [mappedX, 0]
];

const cosine = [
    [mappedX, mappedY],
    [0, mappedY]
];

const tan = [
    [mappedX, mappedY],
    [tangent, 0]
]
const initialRay = [
    [mappedX, 0],
    [0, 0]
]
const pathOfLine = Gen(hypotenuse);
const sinLine = Gen(sine);
const cosineLine = Gen(cosine);
const initialRayLine = Gen(initialRay)
const tanLine = Gen(tan)

svg.append('path')
    .attr('d', sinLine)
    .attr('class', 'sine')
    .attr('transform', `translate(${originX},${originY})`)
svg.append('path')
    .attr('d', cosineLine)
    .attr('class', 'cosine')
    .attr('transform', `translate(${originX},${originY})`)
svg.append('path')
    .attr('d', tanLine)
    .attr('class', 'tangent')
    .attr('transform', `translate(${originX},${originY})`)
svg.append('path')
    .attr('d', pathOfLine)
    .attr('class', 'ray')
    .attr('transform', `translate(${originX},${originY})`)
svg.append('path')
    .attr('d', initialRayLine)
    .attr('class', 'ray')
    .attr('transform', `translate(${originX},${originY})`)

// This is the full circle

const fullArc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
    .startAngle(0)
    .endAngle(Math.PI * 2)

svg.append('path')
    .datum(fullArc)
    .attr('d', (d) => { return d })
    .attr('transform', `translate(${originX},${originY}) rotate(90)`)
    .attr('fill', 'none')
    .attr('class', 'arc-path')
    .attr('stroke', 'green')

//Drag point
svg.append('circle')
    .attr('cx', () => radius * Math.cos(endAngle))
    .attr('cy', () => radius * Math.sin(endAngle))
    .attr('r', '6px')
    .attr('class', 'ray-point')
    .attr('transform', `translate(${originX},${originY})`)
    .call(dragCircle)

// Theta
svg.append("text")
    .text("\u03B8 = 45\u00B0")
    .attr('class', 'theta')
    .attr('x', 20)
    .attr('y', 20)
