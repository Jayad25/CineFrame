const linechart = () => {
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
  
    var valueline = d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(d.population_percent); });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
            
    function draw(data) {
        console.log(data)
        var data = data;

        // format the data
        data.forEach(function (d) {
            d.year = d.year;
            d.population_percent = d.population_percent;
           
        });
        
        x.domain(d3.extent(data, function (d) { return d.year; }));
        y.domain(d3.extent(data, function(d) {
            return d.population_percent;
          }));
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);
        // Add the valueline path.
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function (d) { return x(d.year); })
            .attr("cy", function (d) { return y(d.population_percent); });
        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
    }
    d3.json("data.json", function (error, data) {
        if (error) throw error;

        // trigger render
        draw(data);
    });

}

linechart()