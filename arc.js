
function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
// constants

const height = 500;
const width = 500;
const marginX = 50;
const marginY = 50;
const originX = height / 2;
const originY = width / 2;



let currentQuadrant = 1;
let currentX = scale(Math.sqrt(2), marginX, width - marginX, -1.5, 1.5);
let currentY = scale(2, marginY, height - marginY, 1.5, -1.5);
let radius = scale(1,-1.5, 1.5, 0, width / 2 - marginX)
let initial = 0
let startAngle = (Math.PI * initial / 180) - Math.PI * 2
let endAngle = Math.atan(currentY / currentX) - Math.PI * 2



const dragCircle = d3.drag()
    .on('start', function () {
        d3.select(this).raise();
        d3.select(this).attr('cursor', 'move');
    })
    .on('drag', function (event) {
        const newX = scale(event.x, marginX, width - marginX, -1.5, 1.5);
        const newY = scale(event.y, marginY, height - marginY, 1.5, -1.5);

        let endAngle = - Math.atan(newY / newX) - Math.PI * 2
        if (newX > 0 && newY > 0) {
            endAngle = - Math.atan(newY / newX) - Math.PI * 2
        }
        if (newX < 0 && newY > 0) {
            endAngle = - Math.atan(newY / newX) - Math.PI * 2 - (Math.PI)
        }
        if (newX < 0 && newY < 0) {

            endAngle = - Math.atan(newY / newX) - Math.PI * 2 - (Math.PI)
        }
        if (newX > 0 && newY < 0) {
            endAngle = - Math.atan(newY / newX) - Math.PI * 2 - (Math.PI * 2)
        }
        const arc = d3.arc()
            .innerRadius(10)
            .outerRadius(radius)
            .startAngle(startAngle)
            .endAngle(endAngle)

        d3.select(this).attr('cx', () => - radius * Math.cos(endAngle));
        d3.select(this).attr('cy', () => - radius * Math.sin(endAngle))
            .attr('transform', `translate(${originX},${originY}) rotate(180)`)

        console.log(newX, newY, endAngle)
        d3.select('.arc-path')
            .datum(arc)
            .attr('d', (d) => { return d })
            .attr('transform', `translate(${originX},${originY}) rotate(${90})`)
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


// const arc = d3.arc()
//     .innerRadius(10)
//     .outerRadius(radius)
//     .startAngle(Math.PI * startAngle / 180)
//     .endAngle(Math.PI * endAngle / 180)


const arc = d3.arc()
    .innerRadius(10)
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

svg.append('circle')
    .attr('cx', () => radius * Math.sin(endAngle))
    .attr('cy', () => radius * Math.cos(endAngle))
    .attr('r', '6px')
    .attr('class', 'ray-point')
    .attr('transform', `translate(${originX},${originY}) rotate(180)`)
    .call(dragCircle)