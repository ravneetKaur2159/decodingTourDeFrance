var maxRadius = 35;
var rScale = d3.scaleSqrt().domain([0, 210]).range([0, maxRadius]);
var colorScale = {
  "France": '#016FB9',
  "Luxembourg": '#C6E0FF',
  "Belgium": '#555',
  "Italy": '#58BC82',
  "Switzerland": '#D16462',
  "Spain": '#FFC400',
  "Netherlands": '#F86018',
  "USA": '#74B0D8',
  "Ireland Irish": '#FFF',
  "Denmark": '#EBBCBB',
  "Germany": '#FFCE00',
  "Australia": '#013D65',
  "United Kingdom": '#B80C09',
  "Results voided": 'none'
} 
var popup;

function layout(data) {
  var numCols = 10, cellSize = 80;
  data.forEach(function(d) {
    d.layout = {};
    var i = d.Year - 1900;

    var col = i % numCols;
    d.layout.x = col * cellSize + 0.5 * cellSize;

    var row = Math.floor(i / numCols);
    d.layout.y = row * cellSize + 0.5 * cellSize;

    d.layout.entrantsRadius = rScale(d.Entrants);
    d.layout.finishersRadius = rScale(d.Finishers);
  });
}

function popupTemplate(d) {
  var year = +d.Year;
  var distance = +d["Total distance (km)"];
  var entrants = +d.Entrants;
  var finishers = +d.Finishers;
  var winner = d.Winner;
  var nationality = d["Winner's Nationality"];

  var html = '';
  html += '<table><tbody>';
  html += '<tr><td>Year</td><td>' + year + '</td></tr>';
  html += '<tr><td>Total distance</td><td>' + distance + 'km</td></tr>';
  html += '<tr><td>Entrants</td><td>' + entrants + '</td></tr>';
  html += '<tr><td>Finishers</td><td>' + finishers + '</td></tr>';
  html += '<tr><td>Winner</td><td>' + winner + '</td></tr>';
  html += '<tr><td>Nationality</td><td>' + nationality + '</td></tr>';
  html += '</tbody></table>';
  return html;
}

function updateChart(data) {
  layout(data);

  d3.select('svg g.chart g.entrants')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) {
      return d.layout.x;
    })
    .attr('cy', function(d) {
      return d.layout.y;
    })
    .attr('r', function(d) {
      return d.layout.entrantsRadius;
    })
    .style('fill', 'none')
    .style('stroke', '#aaa')
    .style('stroke-dasharray', '1 1');

  d3.select('svg g.chart g.finishers')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) {
      return d.layout.x;
    })
    .attr('cy', function(d) {
      return d.layout.y;
    })
    .attr('r', function(d) {
      return d.layout.finishersRadius;
    })
    .style('fill', '#aaa')
    .on('mousemove', function(d) {
      popup.point(d3.event.clientX, d3.event.clientY);
      popup.html(popupTemplate(d));
      popup.draw();
    })
    .on('mouseout', function() {
      popup.hide();
    });

  d3.select('svg g.chart g.winners')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) {
      return d.layout.x;
    })
    .attr('cy', function(d) {
      return d.layout.y;
    })
    .attr('r', 5)
    .style('pointer-events', 'none')
    .style('fill', function(d) {
      return colorScale[d["Winner's Nationality"].trim()];
    });
}

function tourDetails(d){

}

function updateYearLabels() {
  var years = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010];
  var cellSize = 80;
  d3.select('svg g.chart .year-labels')
    .selectAll('text')
    .data(years)
    .join('text')
    .attr('y', function(d, i) {
      return i * cellSize + 0.5 * cellSize;
    })
    .attr('dy', '0.3em')
    .style('text-anchor', 'end')
    .style('fill', '#555')
    .style('font-weight', 'bold')
    .style("cursor", "default")
    .text(function(d) {
      return d;
    })
    .on('mousemove', function(d){
      if(d == 1900){
        popup.point(d3.event.clientX, d3.event.clientY);
        popup.html("Tour de France started as a publicity stunt<br/> to sell newspapers. L'Auto newspaper sales plummeted<br/> from the long-standing competition with Le Vélo.<br/> To boost sales, Tour de France was the brain-child of<br/> L'Auto journalist Geo Lefèvre");
        popup.draw();
      }

      if(d == 1910){
        popup.point(d3.event.clientX, d3.event.clientY);
        popup.html("The racing event was put on hold from<br/> the year 1915-1918 due to World War I");
        popup.draw();
      }
      if(d == 1940){
        popup.point(d3.event.clientX, d3.event.clientY);
        popup.html("The racing event was put on hold from<br/> the year 1949-1946 due to World War II");
        popup.draw();
      }

      if(d == 2000){
        popup.point(d3.event.clientX, d3.event.clientY);
        popup.html("This winner from 1999-2005 was Lance Armstrong.However<br/> due to doping charges he was stripped from<br/> his title and the results were voided.");
        popup.draw();
      }
      
    })
    .on("mouseout", function(){
      popup.hide();
    });
}

function updateLegend() {
  var countries = Object.keys(colorScale);
  d3.select('.legend')
    .selectAll('div')
    .data(countries)
    .join('div')
    .html(function(d) {
      return '<span style="background-color: ' + colorScale[d] + ';"></span><span>' + d + '</span>';
    });
}

function dataIsReady(data) {
  updateChart(data);
  updateYearLabels();
  updateLegend();
  popup = Popup();
}

d3.csv('data/tour_de_france.csv')
  .then(dataIsReady);
