

const linechart = () => {

    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;


    var x = d3.scaleOrdinal().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // var parseTime = d3.timeParse("%d-%b-%y");
    var valueline = d3.line()
        .x(function (d) { return d.genres[0].name; })
        .y(function (d) { return d.vote_count; });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    function draw(data) {
        console.log(data)
        var data = data.slice(0, 100);

        data.forEach(function (d) {
            console.log(d.genres[0].name);
            d.genres[0].name = d.genres[0].name;
            d.vote_count = +d.vote_count;
        });

        x.domain(data.map(function (d) { return d.genres[0].name; }));
        y.domain([0, d3.max(data.map(function (d) { return d.vote_count; }))]);

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline(d.values));
        // Add the valueline path.
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 2)
            .attr("cx", function (d) { return x(d.genres[0].name); })
            .attr("cy", function (d) { return y(d.runtime); });
        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
    }
    d3.json("movie1.json", function (error, data) {
        if (error) throw error;

        draw(data);
    });

}

linechart()