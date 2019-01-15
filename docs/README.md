## CineFrame

[Live_demo](https://jayad25.github.io/CineFrame/)

CineFrame will visualize the Movies between 2012 and 2016 based  on geners. User can click on each geners to list all movies. This list will user o visualize the data based on popularity(cicrle radius) and voting_Average(color)

### Technologies
  * Vanilla JavaScript for overall structure
  * D3 library to implement visual representation

### ScreenShots
  ![](https://i.imgur.com/ajvrSRK.png)
  ![](https://i.imgur.com/nIXCzeP.png)
 ### Code Snippets
  `d3.select("#Combine").on("click",function(d){
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
        });`
  
### Bonus features

In Future i would like to add below fetatures

- [ ] Live Data
- [ ] upload file select fields to visualize
