document.addEventListener('DOMContentLoaded', () => {
        const pie = (selectyear) => {
                // console.log(selectyear)
                let width = 800,
                        height = 500,
                        radius = height / 2 - 10;

                let color = d3.scaleOrdinal(d3.schemeCategory10);
                let svg = d3
                        .select("#piearea")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);
                let moviedetails = [{}]
                //fetch data
                d3.json("data/movie.json", function (data) {
                        // console.log(data)
                        data.forEach(d => {
                                let inSerted = false;
                                
                                if (d.release_date.slice(0, 4) == selectyear && d.genres.length > 0) {
                                        
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
                        let newmoviedetails=[]
                        moviedetails.forEach(mov => {
                                if(mov.number > 10){
                                        newmoviedetails.push(mov)
                                }
                        })
                        // console.log(newmoviedetails)
                        update(newmoviedetails)
                });
                const update = (details) => {
                        let data = d3.pie().sort(null).value(function (d) { return d.number; })(details);
                        // console.log(data)
                        
                        let segments = d3
                                .arc()
                                .innerRadius(10)
                                .outerRadius(200)
                                .padAngle(0.2)
                                .padRadius(50)
                                .cornerRadius(30)

                        let sections = svg.append("g").attr("transform", "translate(250,250)")
                                .selectAll("path").data(data)
                       
                        sections.enter().append("path").attr("d", segments).style("fill", function (d) {

                                return color(d.data.category);
                        }).on("click", function (d) {
                                // console.log(selectyear)

                                window.bubblechart(d.data.category, selectyear);
                                }).on("mouseover", function () {
                                        d3.select(this).transition().duration(300).style("fill", "white")
                                })
                                .on("mouseout", function () {
                                        d3.select(this).transition().duration(300).style("fill", function (d) { return color(d.data.category); });
                                })
                                .on("mousedown", function (d) {
                                        var total = d3.sum(details.map(function (d) { return d.number; }));
                                        var percent = Math.round(10000 * d.data.number / total) / 100;
                                        var position = d3.mouse(svg.node());
                                        // console.log(position);
                                        d3.select("body").append("div").classed("tooltip", true)
                                                .style("left", position[0] + 10 + "px")
                                                .style("top", position[1] + "px")
                                                .html(d.data.category + " : " + percent + "%");
                                })
                                .on("mouseup", function () {
                                        d3.select(".tooltip").remove();
                                });

                        let content = d3.select("g").selectAll("text").data(data)
                        content.enter().append("text").each(function(d){
                                let center = segments.centroid(d)
                                d3.select(this).attr("x",center[0]).attr("y",center[1]).text(d.data.number);
                        })
                        let totalCount = 0;
                        data.forEach((dat) => {
                                totalCount += dat.number;
                        });
                        let legends = svg.append("g").attr("transform", "translate(500, 100)")
                                .selectAll(".legends").data(data);
                        let legend = legends.enter().append("g").classed("legends", true)
                                .attr("transform", function (d, i) { return "translate(0," + (i + 1) * 30 + ")"; });
                        legend.append("rect").attr("width", 20).attr("height", 20)
                                .attr("fill", function (d) { return color(d.data.category); });
                        legend.append("text").classed("label", true)
                                .text(function (d) { return d.data.category; })
                                .attr("fill", function (d) { return color(d.data.category); })
                                .attr("x", 30)
                                .attr("y", 20);
                }
        }
       


d3.select("#year").on("input", function () {
        
        var sect = document.getElementById("year")
        selectyear = sect.options[sect.selectedIndex].value; 
        document.getElementById("piearea").innerHTML=""
        pie(selectyear)
});
       
        pie(2012);
})


