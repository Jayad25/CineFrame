const pie = (selectyear) => {
        let width = 800,
                height = 700,
                radius = height / 2 - 10;

        let color = d3.scaleOrdinal(d3.schemeCategory10)
        let svg = d3
                .select("#piearea")
                .append("svg")
                .attr("width", width)
                .attr("height", height);
        let moviedetails = [{}]
        //fetch data
        d3.json("movie.json", function (data) {
                data.forEach(d => {
                        let inSerted = false;
                        if (d.release_date.slice(0, 4) === selectyear && d.genres.length > 0) {
                                moviedetails.forEach(movie => {
                                        if (movie.category === d.genres[0].name) {
                                                movie.number += 1
                                                inSerted = true
                                        }
                                })
                                if (!inSerted) {
                                        moviedetails.push({ category: d.genres[0].name, number: 1, enabled: true })
                                }

                        }
                });
                update(moviedetails)
        });
        const update = (details) => {
                let data = d3.pie().sort(null).value(function (d) { return d.number; })(details);
                console.log(data)
                let segments = d3.arc()
                        .innerRadius(10)
                        .outerRadius(200)
                        .padAngle(0.2)
                        .padRadius(50)
                        .cornerRadius(30);
                let sections = svg.append("g").attr("transform", "translate(250,250)")
                        .selectAll("path").data(data)
                sections.enter().append("path").attr("d", segments).style("fill", function (d) {

                        return color(d.data.number);
                })

                let content = d3.select("g").selectAll("text").data(data)
                // content.enter().append("text").each(function(d){
                //         let center = segments.centroid(d)
                //         d3.select(this).attr("x",center[0]).attr("y",center[1]).text(d.data.category);
                // })
                let totalCount = 0;
                data.forEach((dat) => {
                        totalCount += dat.number;
                });
                let legends = svg.append("g").attr("transform", "translate(500, 100)")
                        .selectAll(".legends").data(data);
                let legend = legends.enter().append("g").classed("legends", true)
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
d3.select("#year").on("input", function () {

        var sect = document.getElementById("year")
        selectyear = sect.options[sect.selectedIndex].value;
        document.getElementById("piearea").innerHTML = ""
        pie(selectyear)
});