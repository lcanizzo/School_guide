// Variables for drawing data
var color = d3.scaleOrdinal(d3.schemeCategory20b);
var lineColor = d3.scaleOrdinal(d3.schemeCategory20b);

var fullWidth = 750;
var fullHeight = 360;
var margin = {
    top: 15,
    right: 300,
    left: 50,
    bottom: 50
  };

var width = fullWidth - margin.left - margin.right;
var height = fullHeight - margin.top - margin.bottom;
var radius = Math.min(width, height) / 2;
var gLong = -60;
var gLat = 35;
var donutWidth = 75;
var legendRectSize = 18;
var legendSpacing = 4;

function GetAdmissionData(object) {
    // Check the object passed
    console.log(object);

    // Turn the object into a workable data array
    // Start with a blank data array
    var data = [];

    // For each property (for our objects it should be each year), 
    for (var property in object) {
        // if that property(year) exists
        if (object.hasOwnProperty(property)) {
            // And the subproperty is defined
            if(typeof object[property].admissions !== "undefined")
                // Pass that data to our empty array
                if(object[property].admissions.sat_scores.average.overall != null)
                    data.push(object[property].admissions.sat_scores.average.overall);
        }
    }

    return data;
}

function GetAidData(object) {0
    // Turn the object into a workable data array
    // Start with a blank data array
    var data = [];

    // For each property (for our objects it should be each year), 
    for (var property in object) {
        // if that property(year) exists
        if (object.hasOwnProperty(property)) {
            // And the subproperty is defined
            if(typeof object[property].aid !== "undefined")
            {    // Pass that data to our empty array
                var tempObject = {
                    date: property,
                    pelRate: object[property].aid.pell_grant_rate,
                    fedRate: object[property].aid.federal_loan_rate,
                    loanRate: object[property].aid.students_with_any_loan
                }
                data.push(tempObject);
            }
        }
    }

    return data;
}

function GetDemoData(object) {
    var data = [];
    // For each property (for our objects it corresponse to different ethnicities), 
    for (var property in object[2014].student.demographics.race_ethnicity) {
        // console.log("Property", property)
        // if that property(ethnicity) exists && and it's one of the types we are lookign for
        if (property == "aian" || 
            property == "asian" || 
            property == "black" || 
            property == "hispanic" || 
            property == "non_resident_alien" || 
            property == "two_or_more" ||
            property == "white")
        {
            var tempObject = {label: property, count: object[2014].student.demographics.race_ethnicity[property]};
            data.push(tempObject);
        }
    }
    return data;
}

function DrawBarGraph(data) {
    console.log("Data Set for Addmissions Graph", data);
    // We make an empty svg to add our elements 
    $("#bar-graph").empty();
    var svg = d3.select('#bar-graph')
        .append('svg')
        .attr("width", fullWidth)
        .attr("height", fullHeight)
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3.scaleTime()
        .domain([new Date(2014 - data.length+1, 0, 1), (new Date(2014, 0, 1))])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, 2400])
        .range([height, 0]);

    var xAxis = d3.axisBottom(xScale)
        .ticks(data.length - 1)
        .tickSize(5);
        
    var yAxis = d3.axisLeft()
        .scale(yScale);

    var barWidth = width / (data.length-1);

    svg.append('g')
        .attr("transform", "translate(0,"+ (height) +")")
        .classed('axis_x', true)
        .call(xAxis);
    
    svg.append('g')
        // .attr("transform", function(d) { return "translate(" + barWidth + ",0)"; })
        .classed('axis_y', true)
        .call(yAxis);
        
    // Make a bar for each element in the data array by using d3 
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
            .attr("fill", "#d1c9b8")
            .attr("width", barWidth /2)
            .attr("y", function (d) {
                return yScale(d);
            })
            .attr("height", function (d) {
                return height - yScale(d);
            })
            .attr("x", function(d, i) {
                return i * barWidth;
    });

    var legend = svg.append('g')
        .classed('legend', true)
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height - 50;
            var horz = width + barWidth;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
    });
    
    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', "#d1c9b8")
        .style('stroke', "#d1c9b8");
    
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text("Average SAT Scores Overall");
}

function DrawDemoGraph(data) {
    console.log("Data Set for Demo Graph", data);

    // Get basic svg 
    $("#demo-graph").empty();
    var svg = d3.select('#demo-graph')
    .append('svg')
    .attr('width', fullWidth)
    .attr('height', fullHeight)
    .append('g')
        .attr('transform', 'translate(' + (fullWidth / 2) + ',' + (fullHeight / 2) + ')');

    // Add the arc using d3.arc()
    var arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);

    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    // Define the slices
    var pie = d3.pie()
        .value(function(d) {return d.count; })
        .sort(null);

    // Draw the lines using path by passing our earlier variables
    var g = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('g')
            .classed('arc', true);
    
    g.append('path')
        .attr('d', arc)
        .attr('fill', function(d, i){ return color (d.data.label)}) 

    var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
        .classed('legend', true)
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = width / 2;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
    });
    
    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);
    
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	    .text(function(d) { return Math.round(d.data.count*100) + " %";})	
        .style("fill", "#fff")
        .style('z-index', 10);
}

function DrawAidGraph(data){
    console.log("Data Set for Aid Graph", data);
    // We make an empty svg to add our elements
    
    var legendData = ["Federal Loan Rate","Pell Grant Rate", "Students with Loans"];
    $("#aid-graph").empty();
    var svg = d3.select('#aid-graph')
        .append('svg')
        .attr("width", fullWidth)
        .attr("height", fullHeight)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var parseTime = d3.timeParse("%Y");
        
    data.forEach(function(d) {
        d.date = parseTime(d.date);
    });

    var xScale = d3.scaleTime()
        .domain([new Date(1996,0,1), (new Date(2014,0,1))])
        .rangeRound([0, width])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, 1])
        .range([height, 0]);

    var fedLine = d3.line()
        // assign the X function to plot our line as we wish
        .x(function(d) { console.log("New X", d.date);return xScale(d.date); })
        .y(function(d) { return yScale(d.fedRate); });

    var pelLine = d3.line()
        // assign the X function to plot our line as we wish
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.pelRate); });

    var loanLine = d3.line()
        // assign the X function to plot our line as we wish
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.loanRate); });

    var xAxis = d3.axisBottom(xScale)
        .ticks(data.length /2)
        .tickSize(5);
        
    var yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append('g')
        .call(yAxis);

    svg.append('path')
        .classed('line', true)
        .style('stroke', lineColor(0))
        .style('stroke-width', "2px")
        .style('fill', "none")
        .attr("d", fedLine(data));
    
    svg.append('path')
        .classed('line', true)
        .style('stroke', lineColor(1))
        .style('stroke-width', "2px")
        .style('fill', "none")
        .attr("d", pelLine(data));

    svg.append('path')
        .classed('line', true)
        .style('stroke', lineColor(2))
        .style('stroke-width', "2px")
        .style('fill', "none")
        .attr("d", loanLine(data));
        // .append('text')
        //     // .attr("transform", function(d) { return "translate(" + xScale(i) + "," + yScale(d.loanRate) + ")"; })
        //     .text("Percent of Students with Loans")
        
    var legend = svg.selectAll('.legend')
    .data(legendData)
    .enter()
    .append('g')
        .classed('legend', true)
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height - 50;
            var horz = width;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
    });
    
    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d, i) {
            return lineColor(i);
        })
        .style('stroke', function (d, i) {
            return lineColor(i);
        });
    
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });
}

function DisplayGraphs(id) {

    var schoolID = id;
    var queryURL = "https://api.data.gov/ed/collegescorecard/v1/schools?id=" + schoolID + "&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A"
    
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).done(function (response) {
        console.log("Displaying Result");
        var dataObject = response.results["0"];
        console.log("Base School Object", dataObject);
        //Display school name
        let name = dataObject.school.name;
        $('#school-name').html(name);

        gLat = dataObject.location.lat;
        gLong = dataObject.location.lon;

        var admissionData = GetAdmissionData(dataObject);
        DrawBarGraph(admissionData);

        var demoData = GetDemoData(dataObject);
        DrawDemoGraph(demoData);

        var aidData = GetAidData(dataObject);
        DrawAidGraph(aidData);
        DrawGoogleMap();
    });
}
$(document).ready(function() {
    DisplayGraphs(164924);    
})
