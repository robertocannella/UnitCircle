// constants

const height = 500;
const width = 500;
const marginX = 50;
const marginY = 50;


// Set Scales
const xPosScale = d3.scaleLinear()
    .domain([0, Math.PI * 2])
    .range([width / 2, width - marginX])
const xNegScale = d3.scaleLinear()
    .domain([Math.PI * 2, 0])
    .range([marginX, width / 2])
const yPosScale = d3.scaleLinear()
    .domain([0, Math.PI * 2])
    .range([height / 2, marginY])
const yNegScale = d3.scaleLinear()
    .domain([0, Math.PI * 2])
    .range([height / 2, height - marginY])

// Configure Axes
// Here we need an positive and negative for each axis
const xPosAxis = d3.axisBottom(xPosScale)
    .tickValues([Math.PI, Math.PI * 2])
    .tickFormat((d, i) => ['\u03c0', '2\u03c0'][i]);
const xNegAxis = d3.axisBottom(xNegScale)
    .tickValues([Math.PI, Math.PI * 2])
    .tickFormat((d, i) => ['- \u03c0', '- 2\u03c0'][i]);
const yPosAxis = d3.axisLeft(yPosScale)
    .tickValues([Math.PI, Math.PI * 2])
    .tickFormat((d, i) => ['\u03c0', '2\u03c0'][i]);
const yNegAxis = d3.axisLeft(yNegScale)
    .tickValues([Math.PI, Math.PI * 2])
    .tickFormat((d, i) => ['- \u03c0', '- 2\u03c0'][i]);
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
