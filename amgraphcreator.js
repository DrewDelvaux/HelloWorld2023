
function am5graph (dataPoints) {

    console.log("Making Graph!")

    console.log(dataPoints);
            
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv");
    
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    root.dateFormatter.setAll({
      dateFormat: "yyyy",
      dateFields: ["valueX"]  
    });
    
    var data = dataPoints; //this is the line that feeds the data points to the graph
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      focusable: true,
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX:true
    }));
    
    var easing = am5.ease.linear;
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.1,
      groupData: false,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
    
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.2,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));
    
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.LineSeries.new(root, {
      minBulletDistance: 10,
      connect: true,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "{valueY}"
      })
    }));
    
    series.fills.template.setAll({
      fillOpacity: 0.2,
      visible: true
    });
    
    series.strokes.template.setAll({
      strokeWidth: 2
    });

    console.log("Graph Created!")
    
    
    // Set up data processor to parse string dates
    // https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
    series.data.processor = am5.DataProcessor.new(root, {
      dateFormat: "yyyy/MM/dd",
      dateFields: ["date"]
    });
    
    series.data.setAll(data);


    
    series.bullets.push(function() {
      var circle = am5.Circle.new(root, {
        radius: 4,
        fill: root.interfaceColors.get("background"),
        stroke: series.get("fill"),
        strokeWidth: 2
      })
    
      return am5.Bullet.new(root, {
        sprite: circle
      })
    });

    console.log("Bullets Created!")
    
    
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      xAxis: xAxis,
      behavior: "none"
    }));
    cursor.lineY.set("visible", true);
    
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
    
    }; // end am5.ready()