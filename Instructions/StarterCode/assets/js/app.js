// SVG wrapper dimensions are determined by the current width
  // and height of the browser window.
var svgWidth = 960;
var svgHeight = 450;

var margin = {top: 20, right: 40, bottom: 85, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create an SVG 
var svg = d3.select("#scatter").append("svg").attr("width", svgWidth).attr("height", svgHeight);
 
// append svg and group
//Appending an svg group that will hold the chart and shift by left and top margins
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Loading data + change string (from CSV) into number format
d3.csv("assets/data/data.csv").then(function(widata) {
  console.log(widata)
  widata.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Scale functions using D3 for x and Y and the axis
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(widata, d => d.healthcare)])
    .range([height, 0]);
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(widata, d => d.poverty)])
    .range([0, width-margin.left]);
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  chartGroup.append("g")
    .call(leftAxis);

 // Addign the labels for the Axes 
 chartGroup.append("text")
 .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
 .attr("class", "axisText")
 .text("In Poverty(% )");
 chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left + 40)
   .attr("x", 0 - (height / 2))
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("Lacks Healthcare(% )");

  // Circles and circle text
  var circlesGroup = chartGroup.selectAll("circle")
  .data(widata)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "15")
  .attr("class", "stateCircle");
  circlesGroup.append("text")
  .text(d => d.abbr)
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("font-size", "13")
  .attr("class", "stateText");

//  Append a div to the body to create tooltips, assign it a class + Event listeners Add an onmouseover event to display a tooltip
  // =======================================================
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>% Poverty ${d.poverty}<br>% healthcare ${d.healthcare}`);
    });
  chartGroup.call(toolTip);
  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

 

});

