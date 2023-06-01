var width = 1920
var height = 1080

var k = height/width

x = d3.scaleLinear()
    .domain(data.map(d => d[1]))
    .range([0, width])
    
y = d3.scaleLinear()
    .domain(data.map(d => d[2]))
    .range([height, 0])
    
z = d3.scaleOrdinal()
    .domain(data.map(d => d[3]))
    .range(d3.schemeCategory10)

const zoom = d3.zoom()
  .scaleExtent([0.5, 64])
  .on("zoom", zoomed);

const svg = d3.select("svg")
  .attr("viewBox", [0, 0, width, height]);

const gDot = svg.append("g")
  .attr("fill", "none")

var gdata = gDot.selectAll("path")
.data(data)

function click(event) {
	var dt = event.srcElement.__data__
	var pid = dt[0]
	var title = dt[4]
	var istag = dt[6]
	
	if (istag) {
		var url = "https://astronomy.stackexchange.com/questions/tagged/"+title
	} else {
		var url = "https://astronomy.stackexchange.com/questions/"+pid
	}
	window.open(url,'_blank');
}

/*
gdata.enter()
.append("circle")
  .attr("cx", d => x(d[1]))
  .attr("cy", d => y(d[2]))
  .attr("r", d => 1)//Math.log(d[3]+2)/5)
  .attr("stroke", "black")
  .attr("stroke-width", 0.01)
  .attr("fill", d => d[5] ? "green" : "white")
  .on("click", click)
*/

gdata.enter()
.append("text")
  .attr("dx", d => x(d[1]))
  .attr("dy", d => y(d[2]))
  .text(d => d[4])
  .attr("fill", d => d[5] ? d[6] ? "blue" : "green" : "black")
  .attr("font-size", d => d[6] ? 8 : Math.log(Math.max(d[7], 0) + 10)) 
  .on("click", click)
  //.attr("pointer-events", "none")

const gx = svg.append("g");

const gy = svg.append("g");

svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

function zoomed({transform}) {
const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
gDot.attr("transform", transform).attr("r", 1 / transform.k);
}

var chart = Object.assign(svg.node(), {
reset() {
  svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
}
});

