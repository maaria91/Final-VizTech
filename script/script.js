/**
 * Created by Maaria on 11/29/15.
 */
/*Start by setting up the canvas */

var canvas0Width = document.getElementById('canvas-1').clientWidth,
    canvas0Height = document.getElementById('canvas-1').clientHeight;

var canvas3Width = document.getElementById('canvas-3').clientWidth,
    canvas3Height = document.getElementById('canvas-3').clientHeight;

var margin = {t: 10, r: 50, b: 15, l: 100};
var plotWidth = canvas0Width - margin.l - margin.r,
    plotHeight = canvas0Height - margin.t - margin.b;

var canvasWidth = canvas3Width - margin.l - margin.r,
    canvasHeight = canvas3Height - margin.t - [margin.b + 70];


/*-------------------- United States Map------------------------------*/
var plot = d3.select('#canvas-1')
    .append('svg')
    .attr('width', plotWidth)
    .attr('height', plotHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.l + ',' + margin.t + ')');

var state_data = [];
//var plot = d3.select('.canvas')
//    .append('svg')
//    .attr('width',plotWidth)
//    .attr('height',plotHeight)
//    .append('g')
//    .attr('class','canvas')
//    .attr('transform','translate('+margin.l+','+margin.t+')');

//First, set up a projection
var projection = d3.geo.albersUsa()// basically pulling it out of the library
    .translate([plotWidth / 2, plotHeight / 2]);

//Then, define a
var path = d3.geo.path()
    .projection(projection);

//creating a map structure
var rateById = d3.map();
var state_guns = d3.map();
var state_country = d3.map();

//create a formatting function
var formatNumber = d3.format('05');

//
var colorScale = d3.scale.linear().domain([100000, 10000000]).range(['rgb(255,204,204)', 'red']);

//import geojson data
queue()
    .defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.csv, "data/Viztech Final - Sheet1.csv", parseData)
    .await(function (err, state) {


        draw(state);
    })

function draw(state) {
    console.log(state_guns, state_country)
    plot.selectAll('.state')
        .data(state.features)
        .enter()
        .append('path').call(attachTooltip)
        .attr('class', 'state')
        .attr('d', path)
        .style('fill', function (d) {
            console.log(d)
            var id = d.properties.NAME;
            var guns = state_guns.get(id);
            return colorScale(+guns);
            //if( rateById.get(id) == undefined ){
            //    console.log(d.properties.STATE);
            //    return 'none';
        });

    //var guns = state_guns.get(d.properties.NAME);
    //return colorScale(guns);
    //plot.append('path')
    //    .datum(state)
    //    .attr('class','state')
    //    .attr('d',path)
};


//}


//ATTACH AN IMAGE
plot
    .append('image')
    .attr('xlink:href','assets/legend.svg')
    //.attr('width', 150)
    //.attr('height',60);


function attachTooltip(selection) {
    selection
        .on('mouseenter', function (d) {
            var tooltip = d3.select('.custom-tooltip');
            console.log(tooltip, d)
            tooltip
                .transition()
                .style('opacity', 1);

            tooltip.select('#state_name').html(d.properties.NAME);
            tooltip.select('#guns').html(state_guns.get(d.properties.NAME));
            tooltip.select('#country').html(state_country.get(d.properties.NAME));

        })
        .on('mousemove', function () {
            var xy = d3.mouse(plot.node());

            var tooltip = d3.select('.custom-tooltip');

            tooltip
                .style('left', xy[0] + 50 + 'px')
                .style('top', (xy[1] + 50) + 'px');

        })
        .on('mouseleave', function () {
            var tooltip = d3.select('.custom-tooltip')
                .transition()
                .style('opacity', 0);
        })




}
//
//var legend = plot.append("g")
//    .attr("class","legend")
//    .attr("transform","translate(10,30)")
//    .style("font-size","12px")
//    .call(d3.legend)


function parseData(d) {

    console.log(d);
    //rateById.set(formatNumber(+d.id), +d.rate);
    state_guns.set(d["State Name"], +d.Guns);
    state_country.set(d["State Name"], d["Closest Country"]);

    return {
        state_name: d["State Name"],
        nguns: +d["Guns"],
        ccountry: d["Closest Country"]

        //state_name: d.['State Name'],
        //nguns: +d.["Guns"],
        //ccountry: d.["Closest Country "]

        //
        //state_name: d.StateName,
        //nguns: +d.Guns,
        //ccountry: d.ClosestCountry,

    }

}




/*--------------------TODO: THE BAR CHART----------------------*/
/*--------------------TODO: BAR CHART--------------------------*/
/*--------------------TODO: BAR CHART--------------------------*/

//
//var margin2 = {t:50,r:650,b:20000,l:50};
//var plotWidth = canvasWidth - margin.l - margin.r,
//    plotHeight = canvasHeight - margin.t - margin.b;


var plot2 = d3.select('#canvas-3')
    .append('svg')
    .attr('width', canvas3Width + 50)
    .attr('height', canvas3Height + 100)
    .append('g')
    .attr('transform', 'translate(' + margin.l + ',' + margin.t + ')');
//.attr('class','paper');


//data
d3.csv('data/Pop anddd guns - Sheet1.csv',
    function parse(d) {
        var newRow = {
            state: d.State,
            guns: +d.Guns,
            pop: +d.Pop

        };
        return newRow;
    },


    function (err, rows) {

////SINCE IN THE WEBPAGE WE HAVE TWO BUTTONS! WE WILL GET TWO TYPES OF DATE BECUASE WE HAVE TWO BUTTONS
//        d3.selectAll('.btn').on('click',function(){
//            var type = d3.select(this).attr('id');
//
//            if(type=='pop'){
//                draw(pop);
//            }else{
//                draw(guns);
//            }
//        });

        state_names = rows.map(function (d) {
            return d.state;
        });

        //console.log(state_names)

        var scaleX = d3.scale.ordinal().domain(state_names).rangePoints([0, canvasWidth]),
            scaleY = d3.scale.linear().domain([0, 40000000]).range([canvasHeight, 0]);

//Axis
        var axisX = d3.svg.axis()
            .orient('bottom')
            .scale(scaleX)


        //.tickFormat( d3.format(', ') ); //https://github.com/mbostock/d3/wiki/Formatting
        var axisY = d3.svg.axis()
            .scale(scaleY)
            .orient('left')
            .tickSize(-canvasWidth)
        //.tickValues([1000000, 2000000, 5000000, 15000000,20000000,25000000,40000000])


//Draw axes
//        plot.append('g').attr('class','axis axis-x')
//            .attr('transform','translate(0,'+height+')')
//            .call(axisX);
        plot2.append("g")
            .attr("class", "axis axis-x")
            .attr("transform", "translate(0," + canvasHeight + ")")
            .call(axisX)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 8)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");


        plot2.append('g').attr('class', 'axis axis-y')
            .call(axisY);


        //
        var states = plot2.append('g')
            .attr('class', 'state');

        var rateById = d3.map();

////HUMAN POP PINK RECT
        states.selectAll('.state')
            .data(rows)
            .enter()
            .append('rect')
            .attr('class', 'state')
            .attr("x", function (d) {
                return scaleX(d.state)
            })
            //.attr(height)
            //.attr("x2", function (d) {
            //        return scaleX(d.state)
            // })
            .attr("height", function (d) {
                return canvasHeight - scaleY(d.pop);
            })
            .attr('width', '14px')
            .attr('y', function (d) {
                return scaleY(d.pop);
            })
            .style('fill', 'rgba(139,137,137,.7)')


            .on("mouseover", function (d) {
                console.log(d)
            });


        //////RED GUN RATE RECT
//*----------------------- TODO: BUTTON FUNCTION ----------------------*/
//*----------------------- TODO: BUTTON FUNCTION ----------------------*/
//*----------------------- TODO: BUTTON FUNCTION ----------------------*/


        state_map = d3.map()
        state_map.set('guns', 'notclicked')
        d3.selectAll('#guns').on('click', function () {
            //
            // CLICK AND UNCLICK//


            if (state_map.get('guns') == 'notclicked') {
                state_map.set('guns', 'clicked')
                drawGuns(rows);

            } else {
                state_map.set('guns', 'notclicked')
                drawGuns([]);
            }
                function drawGuns (data) {

                var guns_bars = states.selectAll('.state2')
                    .data(data)
                var guns_enter = guns_bars.enter()
                    .append('rect')
                    .attr('class', 'state2').attr('opacity', 0)
                    .attr("x", function (d) {
                        return scaleX(d.state)
                    })
                    .attr("y", function (d) {
                        return canvasHeight;
                    })
                    .attr("height", function (d) {
                        return 0;
                    }).attr('transform',function(d,j,i){return "translate(4,0)"});
                //exit
                var guns_exit = guns_bars.exit().remove().transition().attr('opacity', 0)
                //update
                guns_bars.transition().delay(500).duration(1000).attr('opacity', 1)
                    .attr("x", function (d) {
                        return scaleX(d.state)
                    })
                    //.attr(height)
                    //.attr("x2", function (d) {
                    //        return scaleX(d.state)
                    // })
                    .attr("height", function (d) {
                        return canvasHeight - scaleY(d.guns)
                    })
                    .attr('width', '4px')
                    .attr('y', function (d) {
                        return scaleY(d.guns);
                    })

                    .style('fill', 'red')


            }



                //(function (d,i){ return i * 300;}) if you add the 300.. they do it one by one

            //
            //.attr("height", 0)
            //    .transition()
            //    .duration(200)
            //    .delay(function (d) {
            //        return d * 50;
            //    })
            //    .attr("y", function (d) {
            //        return "height" - scaleY(d.guns);
            //    })
            //    .attr("height", function (d) {
            //        return canvasHeight - scaleY(d.guns)
            //    })


            //.attr("height", function (d) {
            //    return canvasHeight - scaleY(d.guns);
            //})



            //.style('opacity',1)        })

            //.on("mouseover", function (d) {
            //    console.log(d)
            //})


        });
        function parse(d) { // in inspect the console.. this basically shows the array with those THREE elements
            return {
                //item: d.ItemName,
                guns: +d.Guns,
                pop: +d.Pop
            }
        }
    });
