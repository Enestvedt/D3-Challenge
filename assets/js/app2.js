//Check Datapoint Labels 

// @TODO: YOUR CODE HERE!
let data = {};

const svgWidth = 960;
const svgHeight = 500;
const margins = {
    "top": 20,
    "right": 40,
    "bottom": 80,
    "left": 100
};

const chartWidth = svgWidth - margins.right - margins.left;
const chartHeight = svgHeight - margins.top - margins.bottom;

const svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

const chartGroup = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)

let chosenXaxis = "poverty";
let chosenYaxis = "healthcare";

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

    // create the scatterplot
    // define chart scale based on default or user selection
    let xLinearScale = xScale(csvData, chosenXaxis);
    let yLinearScale = yScale(csvData, chosenYaxis);

    // define the axis based on scale
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // define the X axis
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append the Y axis
    // chartGroup.append("g")
    //     .call(leftAxis);
        //append the Y Axis
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - svgHeight / 2 - 25)
        .attr("y", 0 - margins.left)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("% Lacking Healthcare");

    // create data-point labels
    let dataPointLabels = chartGroup.selectAll(null)
        .data(csvData)
        .enter()
        .append("text").text(d => d.abbr)
        .attr("font-size", 12)
        .attr("x", d => xLinearScale(d[chosenYaxis]))
        .attr("y", d => yLinearScale(d[chosenYaxis]) + 4)
        .attr("text-anchor", "middle");

    let circlesGroup = chartGroup.selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenYaxis]))
        .attr("cy", d => yLinearScale(d[chosenYaxis]))
        .attr("r", 10)
        .attr("fill", "steelblue")
        .attr("opacity", ".5");


    // Create X axis labels
    const xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight +20})`);

    const povertyLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("% In Poverty");

    const ageLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (median years)");



    
    // update Tool Tip
    circlesGroup = updateToolTip(chosenXaxis, circlesGroup);

    // event listener
    xLabelsGroup.selectAll("text")
        .on("click", function(){
            let xValue = d3.select(this).attr("value");
            if (xValue !== chosenXaxis) {
                chosenXaxis = xValue;

                xLinearScale = xScale(csvData, chosenXaxis);
                xAxis = renderAxis(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXaxis);

                if (chosenXaxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
            }
        })


}).catch(function(error){
    console.log(error);
});



