const map = (value, inputEnd, outputEnd) => {

    return ((value * outputEnd) / inputEnd)
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

const dragCircle = d3.drag()
    .on('start', function () {
        d3.select(this).raise();
        d3.select(this).attr('cursor', 'move');
    })
    .on('drag', function (event) {
        // Move point
        d3.select(this).attr('cx', event.x);
        d3.select(this).attr('cy', event.y);

    })
    .on('end', function (d, i, nodes) {
        d3.select(this).attr('cursor', 'auto')
    })


const dragRay = d3.drag()
    .on('start', function () {
        d3.select('.ray').raise();
        d3.select('.ray').attr('cursor', 'move');
    })
    .on('drag', function (event) {
        // Move Ray
        const hypotenuse = [
            [originX, originY],
            [event.x, event.y]
        ];
        const sine = [
            [event.x, height / 2],
            [event.x, event.y]
        ];
        const cosine = [
            [event.x, event.y],
            [height / 2, event.y]
        ];

        const pathOfLine = Gen(hypotenuse);
        const sinLine = Gen(sine);
        const cosineLine = Gen(cosine);
        d3.select('.sine')
            .attr('d', sinLine);
        d3.select('.cosine')
            .attr('d', cosineLine);
        d3.select('.ray')
            .attr('d', pathOfLine);


        // Move point
        d3.select(this).attr('cx', event.x);
        d3.select(this).attr('cy', event.y);
        d3.select('.test-point').attr('cx', )
        d3.select('.test-point').attr('cy', )
    })
    .on('end', function (d, i, nodes) {
        d3.select('.ray').attr('cursor', 'auto')
    })
// constants

const height = 500;
const width = 500;
const marginX = 50;
const marginY = 50;
const originX = height / 2;
const originY = width / 2;
let currentX = (Math.sqrt(2) / 2);
let currentY = (Math.sqrt(2) / 2);

// Set Scales
const xPosScale = d3.scaleLinear()
    .domain([0, 1])
    .range([width / 2, width - marginX])
const xNegScale = d3.scaleLinear()
    .domain([1, 0])
    .range([marginX, width / 2])
const yPosScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height / 2, marginY])
const yNegScale = d3.scaleLinear()
    .domain([0, 1])
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


// Create the Ray
// Making a line Generator

const mappedX = map(currentX, 1, width / 2);
const mappedY = map(currentY, 1, height / 2);
const Gen = d3.line();


const hypotenuse = [
    [originX, originY],
    [mappedX, mappedY]
];

const sine = [
    [mappedX, height / 2],
    [mappedX, mappedY]
];

const cosine = [
    [mappedX, mappedY],
    [height / 2, mappedY]
];
const pathOfLine = Gen(hypotenuse);
const sinLine = Gen(sine);
const cosineLine = Gen(cosine);

svg.append('path')
    .attr('d', sinLine)
    .attr('class', 'sine')

svg.append('path')
    .attr('d', cosineLine)
    .attr('class', 'cosine')

svg.append('path')
    .attr('d', pathOfLine)
    .attr('class', 'ray')

svg.append('circle')
    .attr('class', 'ray-point')
    .attr('cx', mappedX)
    .attr('r', 4)
    .attr('cy', mappedY)
    .on('click', (event) => {
        console.log(map(event.x, width / 2 - 1, 1))
    })
    .call(dragRay)

svg.append('circle')
    .attr('class', 'unit-circle')
    .attr('cx', originX)
    .attr('cy', originY)
    .attr('fill', 'none')
    .attr('stroke', 'grey')
    .attr('stroke-width', 2)
    .attr('r', () => {
        return map(1 /* Value */, 2 /* Input End */, width / 2 /** Output End */)
    })
svg.append('circle')
    .attr('class', 'test-point')
    .attr('cx', mappedX)
    .attr('r', 4)
    .attr('cy', mappedY)
    .on('click', (event) => {
        console.log(map(event.x, width / 2 - 1, 1))
    })
    .call(dragCircle)