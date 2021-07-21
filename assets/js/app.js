// settings for the chart
const chartHeight = 450;
const chartWidth = 750;

const margins = {
    top: 80,
    right: 120,
    bottom: 120,
    left: 120
}

// set initial paramaters - users will select on the dashboard after initial load
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

// create the svg container based on above settings
const svg = d3.select("#scatter")
    .append("svg")
    .attr("width", chartWidth + margins.left + margins.right)
    .attr("height", chartHeight + margins.top + margins.bottom);

// this is temporary to visualize what is happening
const mySVG = svg.append("g").append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "rgb(104,94,129)")
    .attr("rx", 10)
    .attr("ry", 10)

// create a group to contain the chart
const chartGroup = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

// temporary to visualize 
const myChartRect = chartGroup.append("rect")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .attr("fill", "rgb(16,5,50)");

// function to create and update the X and Y scales - send the data and choices and each function returns the scale factor
// the linear scales are then used to create the axes and place circles on chart
function xScale(statesData, chosenXAxis) {
    let xLinearScale = d3.scaleLinear()
        .domain(d3.extent(statesData, d => d[chosenXAxis]))
        .range([0, chartWidth])
        .nice();
    return xLinearScale;
    console.log(`xLinearScale = ${xLinearScale}`);
}
function yScale(statesData, chosenYAxis) {
    let yLinearScale = d3.scaleLinear()
        .domain(d3.extent(statesData, d => d[chosenYAxis]))
        .range([chartHeight, 0])
        .nice();
    return yLinearScale;
    console.log(`yLinearScale = ${yLinearScale}`);
}
// func to update x axis after user selection
function renderXAxis(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// func to update x axis after user selection
function renderYAxis(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// func to update circles when new x or y label is selected
function renderCircles(changedAxis, circlesGroup, newScale, chosenAxis) {
    if (changedAxis === "X"){
        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d=> newScale(d[chosenAxis]));
    }
    else{
        circlesGroup.transition()
            .duration(1000)
            .attr("cy", d=> newScale(d[chosenAxis]));
    }
    return circlesGroup;
}

// Retrieve data from data.csv
d3.csv("/assets/data/data.csv").then(function (statesData, err) {
    if (err) throw (err);

    //parse data
    statesData.forEach(data => {
        if (data.poverty && data.healthcare) {

            data.id = +data.id,
                data.age = +data.age,
                data.healthcare = +data.healthcare,
                data.income = +data.income,
                data.obesity = +data.obesity,
                data.poverty = +data.poverty,
                data.smokes = +data.smokes
        }
    });
    console.log(statesData);

    // send data and chosen Axes to linear scale functions call the results xLinearScale and yLinearScale
    let xLinearScale = xScale(statesData, chosenXAxis);
    let yLinearScale = yScale(statesData, chosenYAxis);

    // set the default axes - these will be updated by user choice
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    // append the axes
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    let yAxis = chartGroup.append("g")
        .call(leftAxis);

    // append default scatter plot circles
    const circlesGroup = chartGroup.selectAll("circle")
        .data(statesData)
        .enter()
        .append("circle")
        .attr("cx", d=> xLinearScale(d[chosenXAxis]))
        .attr("cy", d=> yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "rgb(230,0,50)")
        .attr("opacity", ".6");

    const xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    const povertyLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .classed("inactive", false)
        .text("% In Poverty");

    const ageLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .classed("active", false)
        .text("Age (median years)");

    const incomeLabel = xLabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .classed("active", false)
        .text("Household Income (median)");

    // create Y Labels
    const yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")

    const healthcareLabel = yLabelsGroup
        .append("text")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", -60)
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("active", true)
        .classed("inactive", false)
        .text("% Lacking Healthcare");

    const smokesLabel = yLabelsGroup
        .append("text")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", -80)
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("active", false)
        .classed("inactive", true)
        .text("Smokes %");

    const obeseLabel = yLabelsGroup
        .append("text")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", -100)
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("active", false)
        .classed("inactive", true)
        .text("Obesity %");

    // labels event listeners
    xLabelsGroup.selectAll("text")
        .on("click", function () {
            let value = d3.select(this).attr("value");

            if (value !== chosenXAxis) {
                chosenXAxis = value;
                xLinearScale = xScale(statesData, chosenXAxis);
                xAxis = renderXAxis(xLinearScale, xAxis);

                // update the selected label text to bold
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                        ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                        incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
            let myXAxis = "X";
            circlesGroup = renderCircles(myXAxis, circlesGroup, xLinearScale, chosenXAxis);

        });
        yLabelsGroup.selectAll("text")
        .on("click", function () {
            let value = d3.select(this).attr("value");

            if (value !== chosenYAxis) {
                chosenYAxis = value;
                yLinearScale = yScale(statesData, chosenYAxis);
                yAxis = renderYAxis(yLinearScale, yAxis);

                // update the selected label text to bold
                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenYAxis === "smokes") {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
            let myYAxis = "Y"
            circlesGroup = renderCircles(myYAxis, circlesGroup, yLinearScale, chosenYAxis);

        });
        

});