const pie = () => {
        var width = 800,
                height = 500;

        var color = d3.scaleOrdinal(d3.schemeCategory10)
        var svg = d3.select("body").append("svg")
                .attr("width", width).attr("height", height)
        let moviedetails = [{}]
        d3.json("movie1.json", function (data) {

                data.forEach(d => {
                        let inSerted = false;
                        moviedetails.forEach(movie => {
                                if (movie.category === d.genres[0].name) {
                                        movie.number += 1
                                        inSerted = true
                                }
                        })
                        if (!inSerted) {
                                moviedetails.push({ category: d.genres[0].name, number: 1, enabled: true })
                        }

                });
                update(moviedetails)



        });
        const update = (details) => {
                let data = d3.pie().sort(null).value(function (d) { return d.number; })(details);
                console.log(data)
                var segments = d3.arc()
                        .innerRadius(0)
                        .outerRadius(200)
                        .padAngle(.05)
                        .padRadius(50);
                var sections = svg.append("g").attr("transform", "translate(250,250)")
                        .selectAll("path").data(data)
                sections.enter().append("path").attr("d", segments).style("fill", function (d) {

                        return color(d.data.number);
                })

                var content = d3.select("g").selectAll("text").data(data)
                content.enter().append("text").each(function (d) {
                        var center = segments.centroid(d)
                        d3.select(this).attr("x", center[0]).attr("y", center[1]).text(d.data.category);
                })
                let totalCount = 0;
                data.forEach((dat) => {
                        totalCount += dat.number;
                });
                var legends = svg.append("g").attr("transform", "translate(500, 100)")
                        .selectAll(".legends").data(data);
                var legend = legends.enter().append("g").classed("legends", true)
                        .attr("transform", function (d, i) { return "translate(0," + (i + 1) * 30 + ")"; });
                legend.append("rect").attr("width", 20).attr("height", 20)
                        .attr("fill", function (d) { return color(d.data.number); });
                legend.append("text").classed("label", true)
                        .text(function (d) { return d.data.category; })
                        .attr("fill", function (d) { return color(d.data.number); })
                        .attr("x", 30)
                        .attr("y", 20);
        }


}

pie()