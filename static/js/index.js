var opts = {
    size: 50,           // Width and height of the spinner
    factor: 0.15,       // Factor of thickness, density, etc.
    color: "#208EC1",      // Color #rgb or #rrggbb
    speed: 0.4,         // Number of turns per second
    clockwise: true     // Direction of rotation
};
var ajaxLoader = new AjaxLoader("spinner", opts);

function attach_column_graph(grapharea, graphname, data_dict) {
    var xAxisNames = getXAxisNames(data_dict);
    var yaxisName = getYAxisName(data_dict);
    var graphTitle = getGraphTitle(data_dict);
    chart = new Highcharts.Chart ({
            chart: {
                 height: 600,
                 width: 1200,
                 renderTo: grapharea,
                 type: 'column'
                 //reflow: false
            },
            title: {
                text: graphTitle
            },
            subtitle: {
                text: 'Source: World Bank'
            },
            xAxis: {
                categories: xAxisNames
            },
            yAxis: {
                min: 0,
                title: {
                    text: yaxisName
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: generateLineData(data_dict)
        });
}





function getXAxisNames(data_dict) {
    x_data = [];
    if ("xAxisLabels" in data_dict) {
      for (i=0; i<data_dict["xAxisLabels"].length; i++) {
        x_data.push(data_dict["xAxisLabels"][i]);
      }
    }
    return x_data;
}

function generateLineData(data_dict) {
    y_data = [];
    if ("yAxisValues" in data_dict) {
        intermediate_y = {}
        intermediate_y["data"] = data_dict["yAxisValues"];
        intermediate_y["name"] = data_dict["yAxisTitle"];
        y_data.push(intermediate_y);
    }
    return y_data;
}

function getYAxisName(data_dict) {
    if ("yAxisTitle" in data_dict)
      return data_dict["yAxisTitle"];
    else
      return "Nothing on Y axis";
}

function getGraphTitle(data_dict) {
    if ( "graphTitle" in data_dict)
      return data_dict["graphTitle"];
    else
      return "unknown graph";
}


    function fetch_and_draw(tab_id) {
            $("#loading").show();
            ajaxLoader.show();
            $("#line-grapharea-2").hide();
            $("#line-grapharea-1").hide();
            $("#line-grapharea-3").hide();
            $("#line-grapharea-4").hide();
            $("#line-grapharea-5").hide();
            $("#line-grapharea-6").hide();
            $("#line-grapharea-7").hide();
            $("#line-grapharea-8").hide();

            var country = $('#countries_id :selected').text();
            var metric = "Total"
            console.log(country,metric,tab_id)

            if (tab_id == 2) {
              metric="Renewable"
            }
            else if (tab_id == 3) {
              metric = "Hydro"
            }
            else if (tab_id == 4) {
              metric = "Solar"
            }
            else if (tab_id == 5) {
              metric = "Biomass"
            }
            else if (tab_id == 6) {
              metric = "Wind"
            }
            else if (tab_id == 7) {
              metric = "Geo"
            }
            else if (tab_id == 8) {
              metric = "Waste"
            }
            $.ajax({
                url : "/trends/fetch_and_draw_data",
                type : "GET",
                dataType: "json",
                data : {
                    csrfmiddlewaretoken: '{{ csrf_token }}',
                    country : country,
                    metric : metric
                },

                success : function(json) {
                ajaxLoader.hide();
                $("#loading").hide();

                var grapharea = 'grapharea-' + tab_id;
                var line_grapharea = 'line-grapharea-' + tab_id;
                var column_grapharea = 'column-grapharea-' + tab_id;
                var line_graph_list;

                if (json) {
                   line_graph_list = {"graphTitle": json["graphTitle"] ,"xAxisLabels" : json["xAxisLabels"], "xAxisTitle" : json["xAxisTitle"],
                    "yAxisTitle" : json["yAxisTitle"], "yAxisValues" : json["yAxisValues"] };
                    attach_column_graph(line_grapharea, 'My Line Graph', line_graph_list);
                    $("#line-grapharea-2").show();
                    $("#line-grapharea-1").show();
                    $("#line-grapharea-3").show();
                    $("#line-grapharea-4").show();
                    $("#line-grapharea-5").show();
                    $("#line-grapharea-6").show();
                    $("#line-grapharea-7").show();
                    $("#line-grapharea-8").show();
                }
                else {
                    alert("Sorry, Data is not available for : " + country);
                }
              },
               error : function(xhr,errmsg,err) {
                 alert("Something bad happened ! Please try after some time");
               }
            });
    }

    $('#tabs').tabs({
        activate: function(event ,ui){
          var tab_id = ($("#tabs").tabs('option', 'active'));
          tab_id += 1;
          fetch_and_draw(tab_id);

        }
    });

    $('#countries_id').change(function()
        {
          var tab_id = ($("#tabs").tabs('option', 'active'));
          tab_id += 1;
          fetch_and_draw(tab_id);

    });

    $(function () {
        $(document).ready(function(){
            $('#initialGraph').hide();
            // code starts here
            $( "#tabs" ).tabs();

            var tab_id = ($("#tabs").tabs('option', 'active'));
            fetch_and_draw(1);
});
});