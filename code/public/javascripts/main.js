var width = 1000,
    height = 700,
    svg, data, row, size, max, padding = 30,
    rect_data, rect_width,
    x_axes, y_axes, i, j,
    csv_data = "female,local,USA,SA,EU,MEA,ASIA,businessmen,tourists,DR,agency,AC,u20,20to35,35to55,m55,price,LoS,occupancy,conventions\n\
26,69,7,0,20,1,3,78,22,70,20,10,2,25,48,25,163,1.65,67,0\n\
21,70,6,0,15,0,10,80,20,70,18,12,2,27,49,22,167,1.71,82,0\n\
26,77,3,0,14,0,6,85,15,75,19,6,4,37,42,17,166,1.65,70,0\n\
28,71,6,0,15,8,0,86,14,74,17,9,2,35,48,15,174,1.91,83,1\n\
20,37,23,8,23,6,3,85,15,69,27,4,2,25,54,19,152,1.90,74,1\n\
20,36,14,6,27,4,13,87,13,68,27,5,1,25,55,19,155,2.0,77,1\n\
20,39,19,6,22,6,8,70,30,74,19,7,1,27,53,19,145,1.54,56,0\n\
20,39,14,4,30,4,9,76,24,75,19,6,2,28,51,19,170,1.60,62,0\n\
20,55,9,2,27,2,5,87,13,68,26,6,2,24,55,19,157,1.73,90,1\n\
40,60,6,12,19,1,2,85,15,68,27,5,4,30,46,20,174,1.82,92,1\n\
15,68,8,0,19,0,5,87,13,64,21,15,2,24,55,19,165,1.66,78,1\n\
40,72,8,0,17,1,2,80,20,75,15,10,5,30,43,22,156,1.44,55,1";
var month = new Array(12);
$('#select').chosen({
    width: "300px"
});

function draw_svg() {
    svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
}

function file_handle() {
    var tmp = csv_data.toString().split("\n");
    for (i = 0; i < tmp.length; i++) {
        tmp[i] = tmp[i].toString().split(',');
    }
    data = new Array(tmp[0].length);
    for (i = 0; i < data.length; i++)
        data[i] = new Array(tmp.length);
    for (i = 0; i < tmp.length; i++) {
        for (j = 0; j < tmp[i].length; j++) {
            data[j][i] = tmp[i][j];
        }
    }
    row = Math.floor(Math.sqrt(data.length)) + 1;
    frame = (height / row);
    size = frame * 0.6;

    rect_data = new Array();
    rect_width = (size) / 12;
    var index = 0;
    x_axes = new Array();
    y_axes = new Array();
    for (i = 0; i < row; i++) {
        for (j = 0; j < row; j++) {
            x_axes[index] = frame * j;
            y_axes[index] = frame * i + padding * 1.3;
            index++;
        }
    }
}

function draw_graph(property, index, threshold) {
    var local_month = new Array(12);

    function Rect() {}
    Rect.prototype.x = 1;
    Rect.prototype.y = 1;
    Rect.prototype.height = 1;
    Rect.prototype.index = 1;

    max = 0;
    for (i = 1; i <= 12; i++) {
        if (parseInt(data[index][i]) > max) max = parseInt(data[index][i]);
    }

    var Rect_class = new Array();
    for (var i = 0; i < 12; i++) {
        Rect_class[i] = new Rect();
        Rect_class[i].x = rect_width * i + x_axes[index];
        Rect_class[i].height = (size / max) * data[index][i + 1];
        Rect_class[i].y = size - Rect_class[i].height + y_axes[index];
        Rect_class[i].index = i;
    }
    var tmpx, tmpy;

    var Frame_class = new Array();
    Frame_class[0] = new Rect();
    Frame_class[0].x = x_axes[index];
    Frame_class[0].y = y_axes[index];

    var Text_class = new Array();
    Text_class[0] = new Rect();
    Text_class[0].x = x_axes[index] + size / 2;
    Text_class[0].y = y_axes[index] + size * 1.2;

    var rects = svg.append("g").selectAll("rect")
        .data(Rect_class)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("width", rect_width)
        .attr("height", function(d) {
            return d.height;
        })
        .attr("fill", function(d, i) {
            if ((d.height / size) < (threshold / 100)) {
                local_month[i] = 0;
                return "white";
            } else {
                local_month[i] = 1;
                return "black";
            }

        });

    var texts = svg.append("g").selectAll("text")
        .data(Text_class)
        .enter()
        .append("text")
        .attr("class", "texts")　　
        .attr("x", function(d) {
            return d.x;
        })　　　　
        .attr("y", function(d) {
            return d.y;
        })　　　　
        .text(function(d) {
            return property;
        });

    var top_text = svg.append("g").selectAll("text")
        .data(Text_class)
        .enter()
        .append("text")
        .attr("class", "texts")　　
        .attr("x", function(d) {
            return d.x;
        })　　　　
        .attr("y", function(d) {
            return d.y - size * 1.3;
        })　　　　
        .text(function(d) {
            var tmp = 0;
            for (var i = 0; i < 12; i++) {
                if (month[i] == local_month[i]) tmp++;
            }
            return tmp;
        });
    var frame = svg.append("g").selectAll("rect")
        .data(Frame_class)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("width", size)
        .attr("height", size)
        .attr("opacity", "0.2")
        .attr("fill", "white")
        .on("dblclick", function(d) {
            month = local_month;
            draw();
        })
        .call(d3.drag()
            .on("start", function(d) {
                d3.select(this).raise().classed("active", true);
            })
            .on("drag", function(d) {
                d3.select(this)
                    .attr("x", function(d, i) {
                        tmpx = d3.event.x;
                        d.x = d3.event.x;
                        return d.x;
                    })
                    .attr("y", function(d, i) {
                        tmpy = d3.event.y;
                        d.y = d3.event.y;
                        return d.y;
                    });
                rects
                    .attr("x", function(d, i) {
                        d.x = tmpx + i * rect_width;
                        return d.x;
                    })
                    .attr("y", function(d) {
                        d.y = tmpy + size - d.height;
                        return d.y;
                    });
                texts
                    .attr("x", function(d, i) {
                        d.x = tmpx + size / 2;
                        return d.x;
                    })
                    .attr("y", function(d) {
                        d.y = tmpy + size * 1.2;
                        return d.y;
                    });

                top_text
                    .attr("x", function(d, i) {
                        d.x = tmpx + size / 2;
                        return d.x;
                    })
                    .attr("y", function(d) {
                        d.y = tmpy - size * 0.1;
                        return d.y;
                    });
            })
            .on("end", function(d) {
                d3.select(this).raise().classed("active", false);
            })
        );
}

function drawing(index) {
    draw_svg();
    file_handle();
    for (var ind = 0; ind < data.length; ind++)
        draw_graph(data[ind][0], ind, index);
}

function update() {
    $(select).bind("change", function() {
        draw();
    });
}
update();

function draw() {
    var tmp = d3.select("body").selectAll("svg");
    tmp.remove();
    var threshold = $("#select").val();
    //  if (!(parseInt(threshold) <= 100 && parseInt(threshold) >= 0)) {
    //     alert("wrong input!!!");
    // }
    drawing(threshold);
}
drawing(50);