// update X scale on click of axis label
function xScale(data, chosenXaxis) {
    let xLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[chosenXaxis]))
        .range([0, chartWidth])
        .nice();
    return xLinearScale;
}

// update Y scale on click of axis label
function yScale(data, chosenYaxis) {
    let yLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[chosenYaxis]))
        .range([chartHeight, 0])
        .nice();
    return yLinearScale;
}

// func to update x axis after user selection
function renderAxis(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// update scatter circles func
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d=> newXScale(d[chosenXAxis]));
    return circlesGroup;
}

// function to add mouseover tooltip with text descriptions
function updateToolTip(chosenXaxis, circlesGroup){
    let xLabel;

    if(chosenXaxis === "poverty") {
        xLabel = "% in Poverty";
    }
    else {
        xLabel = "Age (median years)"
    }

    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function (d) {
            return (`${d["abbr"]}<br> ${xLabel}: <br> yLabel here `);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });
    
    return circlesGroup
}

