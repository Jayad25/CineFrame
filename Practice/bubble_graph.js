window.bubblechart = (function (category, selectyear) {



    let width = 1440,
        height = 1000;
    padding = 1.5, // separation between same-color nodes
        clusterPadding = 6;
    var svgContainer = d3
        .select("#piearea")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var keyword = d3.set("", function (movie) {
        if (movie.genres.length > 0) {
            console.log(Math.floor(movie.vote_average));
            return Math.floor(movie.vote_average);
        }
    });

    var color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(keyword);

    let forceX = d3
        .forceX(function (d) {
            let vote = Math.floor(d.vote_average)
            if (vote === 5) return 150;
            else if (vote === 7) return 600;
            else return 500;

            // return width/2
        })
        .strength(0.05);

    let forceY = d3
        .forceY(function (d) {
            if (d.genres.length > 0) {
                if (d.genres[0].name === "Fantasy") return 250;
                else if (d.genres[0].name === "Animation") return 900;
                else return 700;
            }
            // return height/2
        })
        .strength(0.05);

    let forceCollide = d3.forceCollide(function (d) {
        return radiusScale(d.popularity * 2);
    }
    )
    var simulation = d3.forceSimulation()
        .force("x", forceX)
        .force("y", forceY)
        .force("collide", forceCollide);

    var radiusScale = d3.scaleSqrt().domain([100, 800]).range([10, 80])

    d3.queue()
        .defer(d3.json, "movie1.json")
        .await(ready)


    function ready(error, datapoints) {

        var circles = svgContainer.selectAll("circle")
            .data(datapoints)
            .enter()
            .append("circle").on("click", function (d) {
                alert(d.original_title);
            });
        var cate = 0
        circles.attr("r", function (d) {
            let date = d.release_date.slice(0, 4);
            if (d.genres.length > 0) {

                if (d.genres[0].name == category && date == selectyear) {
                    cate++;
                    return radiusScale(d.popularity * 2);
                }
            }
        })

            .style("fill", function (d) {
                if (d.genres.length > 0) {
                    return color(Math.floor(d.vote_average));
                }
            })
            .sort(function (a, b) {
                return (a.value - b.value);
            })
        d3.select("#Combine").on("click", function (d) {
            simulation.force("x", d3.forceX(width / 2).strength(0.05))
                // .alphaTarget(0.5)
                .restart()
            simulation.force("y", d3.forceY(height / 2).strength(0.05))
                // .alphaTarget(0.5)
                .restart()

        }
        )
        d3.select("#split").on("click", function (d) {

            simulation.force("x", forceX)
                .alphaTarget(0.5)
                .restart()
            simulation.force("y", forceY)
                .alphaTarget(0.5)
                .restart()

        }
        )
        simulation.nodes(datapoints).on('tick', ticked)

        function ticked() {
            circles.attr("cx", function (d) {
                if (d.x) return d.x
                else
                    return 0
            })
            circles.attr("cy", function (d) {

                if (d.y) return d.y
                else return 0
            })
        }
        let legends = svgContainer
            .append("g")
            .attr("transform", "translate(500, 100)")
            .selectAll(".legends")
            .data(datapoints);
        let legend = legends.enter().append("g").classed("legends", true)
            .attr("transform", function (d, i) { return "translate(0," + (i + 1) * 30 + ")"; });
        legend.append("rect").attr("width", 20).attr("height", 20)
            .attr("fill", function (d) {

                return color(Math.floor(d.vote_average));
            });
        legend.append("text").classed("bubblelabel", true)
            .text(function (d) {
                console.log(document.getElementsByClassName("bubblelabel"));
                return Math.floor(d.vote_average)
            })
            .attr("fill", function (d) { return color(Math.floor(d.vote_average)); })
            .attr("x", 30)
            .attr("y", 20);




    }


})

