(function (movies) {

   
    
    let width = 1440,
        height = 1000;
    padding = 1.5, // separation between same-color nodes
        clusterPadding = 6;
    var svgContainer = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var keyword = d3.set("", function (movie) {
        if (movie.genres.length > 0) {
            return movie.genres[0].name;
        }
    });

    var color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(keyword);

    let forceX = d3
      .forceX(function(d) {
          if (d.genres.length > 0) {
            if (d.genres[0].name === "Action") return 150;
            else if (d.genres[0].name === "Adventure") return 600;
            else return 500;
          }})
      .strength(0.05);

    let forceY = d3
        .forceY(function (d) {
            if (d.genres.length > 0) {
            if (d.genres[0].name === "Fantasy") return 250;
            else if (d.genres[0].name === "Animation") return 900;
            else return 700;
            }})
        .strength(0.05);

    let forceCollide = d3.forceCollide(function (d) {
        return radiusScale(d.popularity) + 1;
    }
    )
    var simulation = d3.forceSimulation()
        .force("x", forceX)
        .force("y", forceY)
        .force("collide", forceCollide);

    var radiusScale = d3.scaleSqrt().domain([1, 800]).range([10, 80])

    d3.queue()
        .defer(d3.json, "movie.json")
        .await(ready)


    function ready(error, datapoints) {
       
        var circles = svgContainer.selectAll("circle")
            .data(datapoints)
            .enter()
            .append("circle").on("click", function (d) {
                alert(d.original_title);
            });
        var cate = 0
        let selectyear = 0
        d3.select('#year')
            .on("change", function () {
                var sect = document.getElementById("year")
                selectyear = sect.options[sect.selectedIndex].value;                
            })
        circles.attr("r", function (d) {
            let date = d.release_date.slice(0, 4);
            if (date == 2015) {
              cate++;
              return radiusScale(d.popularity);
            }
        })
        
            .style("fill", function (d) {
                if (d.genres.length > 0) {
                    return color(d.genres[0].name);
                }
            });
        console.log(cate)
        d3.select("#Combine").on("click",function(d){
                simulation.force("x",d3.forceX(width/2).strength(0.05))
                .alphaTarget(0.5)
                .restart()
                simulation.force("y", d3.forceY(height / 2).strength(0.05))
                .alphaTarget(0.5)
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
                if(d.x) return d.x
                else
                return 0
            })
            circles.attr("cy", function (d) {

                if(d.y) return d.y
                else return 0
            })
        }

        
    
    }


})()

