document.addEventListener('DOMContentLoaded', () => {
window.bubblechart = (function (category,selectyear) {

    document.getElementById("bubblechart").innerHTML = "";
    
    let width = 800,
        height = 500;
    padding = 1.5, // separation between same-color nodes
        clusterPadding = 6;
    var svgContainer = d3
        .select("#bubblechart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    var tooltip = d3.select("#bubblechart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");

        
    var keyword = d3.set("", function (movie) {
        if (movie.genres.length > 0) {
            return Math.floor(movie.vote_average);
        }
    });

    var color = d3.scaleOrdinal(d3.schemeCategory20)
        .domain(keyword);

    let forceX = d3
      .forceX(function(d) {
            let vote=Math.floor(d.vote_average)
            if (vote === 4) return width/3;
          if (vote === 6) return  1.5 * width/3;
            else if (vote === 7) return 2.5 * width/3;
            else if (vote === 5) return 2.5 * width/3;
            else if (vote === 8) return 2.5 * width/3;
            else return width-100;
          
        })
      .strength(0.05);

    let forceY = d3
        .forceY(function (d) {
            let vote = Math.floor(d.vote_average)
            if (d.genres.length > 0) {
                if (vote === 5) return height/2;
                if (vote === 4) return height / 2;
                else if (vote === 8) return 2.5 * width / 3;
            else return height-100;
            }
        })
        .strength(0.05);

    let forceCollide = d3.forceCollide(function (d) {
        return radiusScale(d.popularity * 2)+1;
    }
    )
    var simulation = d3.forceSimulation()
        .force("x", forceX)
        .force("y", forceY)
        .force("collide", forceCollide);

    var radiusScale = d3.scaleSqrt().domain([-10, 800]).range([10, 80])

    d3.queue()
        .defer(d3.json, "data/movie.json")
        .await(ready)


    function ready(error, olddatapoints) {
        let datapoints = []
        datapoint = function(x){
           
           x.forEach(d =>{
               let date = d.release_date.slice(0, 4);
               if (d.genres.length > 0) {
                   if (d.genres[0].name == category && date == selectyear) {
                       datapoints.push(d)
           }}
        })
    }
        datapoint(olddatapoints)
        var showTooltip = function (d) {
            tooltip
                .transition()
                .duration(200)
            tooltip
              .style("opacity", 1)
                .html("Title: " + d.original_title + "\n Popularity: " + d.popularity)
              .style("left", d3.mouse(this)[0] + 30 + "px")
              .style("top", d3.mouse(this)[1] + 30 + "px");
        }
        var moveTooltip = function (d) {
            tooltip
                .style("left", (d3.mouse(this)[0] + 30) + "px")
                .style("top", (d3.mouse(this)[1] + 30) + "px")
        }
        var circles = svgContainer
          .selectAll("circle")
          .data(datapoints)
          .enter()
          .append("circle")
            .on("mouseover",showTooltip )
             .on("mousemove", moveTooltip);
        function updatedetails(d) {
            var info = "";
            if (d) {
                info = "Title: "+d.original_title+ "\rvote_average: "+d.vote_average
                
            }
            document.getElementById("details").innerHTML=info;
        }
    
       
        circles.attr("r", function (d) {
            let date = d.release_date.slice(0, 4);
            if (d.genres.length > 0) {
                
                if (d.genres[0].name == category && date == selectyear  ) {

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
        d3.select("#Combine").on("click",function(d){
                simulation.force("x",d3.forceX(width/2).strength(0.05))
                .alphaTarget(0.5)
                .restart()
                simulation.force("y", d3.forceY(height / 2).strength(0.05))
                .alphaTarget(0.5)
                .restart()
            });
        d3.select("#split").on("click", function (d) {
            simulation.force("x", forceX)
                .alphaTarget(0.5)
                .restart()
            simulation.force("y", forceY)
                .alphaTarget(0.5)
                .restart()
        });
        simulation.nodes(datapoints).on('tick', ticked)
       
        function ticked() {
            circles.attr("cx", function (d) {
                if(d.x) return d.x
                else
                return 0
            })
            circles.attr("cy", function (d) {

                if(d.y) return d.y
                else return 0
            })
        }

        svgContainer
          .append("g")
          .attr("class", "legendOrdinal")
          .attr("transform", "translate(700,40)");

        var legendOrdinal = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
            .shapePadding(10)
            .scale(color);

        svgContainer.select(".legendOrdinal").call(legendOrdinal);
        svgContainer
          .append("text")
          .attr("x", width / 2)
          .attr("y", 20)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text("All " + category + " movies in "+ selectyear);
    
    }


})
bubblechart("Action",2012)
})

