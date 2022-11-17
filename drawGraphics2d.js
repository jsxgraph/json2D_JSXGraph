//TODO: error handling?
//TODO: no scaled coords yet
//TODO: color as array? -> color converter
//TODO: size scaling board.canvasWidth
//TODO: dynamic coords problematic
//TODO: optionen achsen, bounding
//TODO: dynamic interactions
//TODO: kurve anstatt linie

function drawGraphics2d(id, json) {
    console.log(json);
    // TODO: additional parameters for initialisation
    // initialize the jsx board
    var board = JXG.JSXGraph.initBoard(id, {
        boundingbox: [-8, 8, 8, -8],
        axis: true,
        showClearTraces: true,
    });
    // draw every element in the json
    board.suspendUpdate();
    for (element of json.elements) {
        drawGraphic(board, element);
    }
    board.unsuspendUpdate();
}

function drawGraphic(board, json) {
    args = {};
    // change the color format for jxg graph
    args.color = convertColor(json.color);
    // calculate given coordinates
    args.coords = convertCoords(json.coords);

    switch (json.type) {
        case "point":
            drawPoint(board, json, args);
            break;
        case "line":
            drawLine(board, json, args);
            break;
        case "disk":
            args.filled = true;
            drawCircle(board, json, args);
            break;
        case "circle":
            args.filled = false;
            drawCircle(board, json, args);
            break;
        case "rectangle":
            drawRectangle(board, json, args);
            break;
        case "polygon":
            drawPolygon(board, json, args);
            break;
        default:
            console.log("Type " + json.type + " not recognized");
    }
}

function drawPoint(board, json, args) {
    for (coord of args.coords) {
        board.create("point", coord, {
            strokeColor: args.color,
            fillColor: args.color,
            strokeOpacity: json.opacity,
            fillOpacity: json.opacity,
            size: json.pointSize,
        });
    }
}

function drawCircle(board, json, args) {
    for (coord of args.coords) {
        // calculate the foci of the ellipse
        var foci = calculateFoci(json.radius1, json.radius2, coord);
        board.create("ellipse", [foci[0], foci[1], foci[2]], {
            strokeColor: args.color,
            fillColor: args.color,
            strokeOpacity: json.opacity,
            fillOpacity: json.opacity * args.filled,
        });
    }
}

function drawLine(board, json, args) {
    for (index = 1; index < args.coords.length; index++) {
        //TODO: line between dynamic points instead of fixed coords?
        //TODO: additional directives: width, dashed, gap
        board.create(
            "line",
            [args.coords[index], args.coords[index - 1]],
            {
                straightFirst: false,
                straightLast: false,
                strokeColor: args.color,
            }
        );
    }
}

function drawPolygon(board, json, args) {
    //TODO: point creation necessary?
    board.create("polygon", args.coords, {
        strokeColor: args.color,
        fillColor: args.color,
        strokeOpacity: json.opacity,
        fillOpacity: json.opacity,
        fixed: true
    });
}

function drawRectangle(board, json, args) {
    //TODO: polygon cant be fixed, so the points can be moved freely?
    var start,end;
    if(args.coords.length == 1){
        start = args.coords[0];
        args.coords = [start, [start[0]+1,start[1]], [start[0]+1,start[1]+1], [start[0],start[1]+1]];

    }
    else if(args.coords.length == 2){
        start = args.coords[0];
        end = args.coords[1];
        args.coords = [start, [start[0],end[1]], end, [end[0],start[1]]];

    }
    drawPolygon(board, json, args);
}

function calculateFoci(radiusX, radiusY, coords) {
    var eccentricity;
    if (radiusX > radiusY) {
        eccentricity = JXG.Math.nthroot(1 - radiusY / radiusX, 2);
        return [
            [eccentricity * radiusX + coords[0], coords[1]],
            [-eccentricity * radiusX + coords[0], coords[1]],
            radiusX * 2,
        ];
    } else {
        eccentricity = JXG.Math.nthroot(1 - radiusX / radiusY, 2);
        return [
            [coords[0], eccentricity * radiusY + coords[1]],
            [coords[0], -eccentricity * radiusY + coords[1]],
            radiusY * 2,
        ];
    }
}

function convertColor(rgb){
    var color = [];
    if (rgb != null) {
        color[0] = Number((rgb[0]*255).toFixed(0));
        color[1] = Number((rgb[1]*255).toFixed(0));
        color[2] = Number((rgb[2]*255).toFixed(0));
        color = JXG.rgb2hex(color);
    }
    return color;
}

function convertCoords(coords){
    var newCoords = [];
    for(key in coords){
        newCoords[key] = coords[key][0];
    }
    return newCoords;

}

function testRun() {
    drawGraphics2d("graphics2d", {
        elements: [
            {
                type: "disk",
                color: [0.3, 0.0, 0.8],
                opacity: 0.5,
                radius1: 2.0,
                radius2: 2.0,
                coords: [[[1.0, 0.0]]],
            },
            {
                type: "circle",
                color: [0.2, 0.9, 0.0],
                opacity: 0.9,
                radius1: 1.0,
                radius2: 4.0,
                coords: [[[3.0, 4.0]]],
            },
            {
                type: "line",
                color: [1.0, 0.5, 0.0],
                opacity: 1.0,
                coords: [
                    [[1.0, 1.0]],
                    [[3.0, 1.0]],
                    [[4.0, 3.0]],
                    [[4.0, 7.0]],
                ],
            },
            {
                type: "point",
                color: [0.7, 1.0, 0.0],
                coords: [[[0, 0]], [[1, 1]], [[2, 2]], [[3, 3]]],
                opacity: 0.5,
                pointSize: 3,
            },
            {
                type: "rectangle",
                color: [0.0, 0.5, 1.0],
                opacity: 1.0,
                coords: [[[2.0, -3.0]], [[4.0, -6.0]]],
            },
            {
                type: "arrow",
                color: [1.0, 0.5, 0.0],
                opacity: 1.0,
                coords: [[[0.0, 0.0]], [[1.0, 1.0]]],
            },
            {
                type: "polygon",
                color: [1.0, 0.5, 0.0],
                opacity: 1.0,
                coords: [
                    [[-1.0, -1.0]],
                    [[0.0, -1.0]],
                    [[-4.0, -4.0]],
                    [[-1.0, 0.0]],
                ],
            },
        ],
    });
}
