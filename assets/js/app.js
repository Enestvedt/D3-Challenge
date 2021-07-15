// @TODO: YOUR CODE HERE!
let data = {};

const svgWidth = 600;
const svgHeight = 400;
const margins = {
    "top": 50,
    "right": 50,
    "bottom": 50,
    "left": 50
};

const chartWidth = svgWidth - margins.right - margins.left;
const chartHeight = svgHeight - margins.top - margins.bottom;

const svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

const chartGroup = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)



d3.csv("/assets/data/data.csv").then(function (csvData) {

    csvData.forEach(data => {
        if (data.poverty && data.healthcare) {

            data.id = +data.id,
                data.age = +data.age,
                data.healthcare = +data.healthcare,
                data.income = +data.income,
                data.obesity = +data.income,
                data.poverty = +data.poverty,
                data.smokes = +data.smokes
        }
    });
    console.log(csvData);

    scatterplot(csvData);

}
);



function scatterplot(data) {
    console.log("creating scatterplot")
    data.forEach(d=>console.log(d.abbr));

    let xLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d=>d.poverty))
        .range([0, chartWidth])
        .nice();
    
    let yLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d=>d.healthcare))
        .range([chartHeight,0])
        .nice();

    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d=> xLinearScale(d.poverty))
        .attr("cy", d=> yLinearScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "steelblue")
        .attr("opacity", ".7");

    chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("text").text(d=>d.abbr)
        .attr("x", d=> xLinearScale(d.poverty))
        .attr("y", d=> yLinearScale(d.healthcare));        
}
