//TODO: error handling?
//TODO: no scaled coords yet -> point size?
//TODO: some objects draggable

function drawGraphics2d(id, json) {
    var boundingBox = json.extent;
    // initialize the jsx board
    var board = JXG.JSXGraph.initBoard(id, {
        boundingbox: [
            boundingBox.xmin,
            boundingBox.ymax,
            boundingBox.xmax,
            boundingBox.ymin,
        ],
        axis: true,
        keepaspectratio: true,
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
        case "arrow":
            args.arrow = true;
            drawLine(board, json, args);
            break;
        case "line":
            args.arrow = false;
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
            size: board.canvasWidth * json.pointSize / 2,
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

function drawLineSegmented(board, json, args) {
    for (index = 1; index < args.coords.length; index++) {
        board.create("line", [args.coords[index], args.coords[index - 1]], {
            straightFirst: false,
            straightLast: false,
            strokeColor: args.color,
        });
    }
}

function drawLine(board, json, args) {
    //TODO: line between dynamic points instead of fixed coords?
    //TODO: additional directives: width, dashed, gap
    var newCoords = convertCoordsCurve(args.coords);

    board.create("curve", newCoords, {
        lastArrow: args.arrow,
        strokeColor: args.color,
        strokeOpacity: json.opacity,
    });
}

function drawPolygon(board, json, args) {
    board.create("polygon", args.coords, {
        strokeColor: args.color,
        fillColor: args.color,
        strokeOpacity: json.opacity,
        fillOpacity: json.opacity,
        fixed: true,
        vertices: {visible:false}
    });
}

function drawRectangle(board, json, args) {
    var start, end, p1, p2, p3, p4;
    start = args.coords[0];
    if (args.coords.length == 1) end = [start[0]+1, start[1]+1]
    else if (args.coords.length == 2) end = args.coords[1]; 

    p1 = board.create('point', [start[0], start[1]], {visible:false});
    p2 = board.create('point', [end[0], end[1]], {visible:false});
    p3 = board.create('point', [function(){return p1.X()},function(){return p2.Y()}], {visible:false});
    p4 = board.create('point', [function(){return p2.X()},function(){return p1.Y()}], {visible:false});

    board.create("polygon", [p1,p3,p2,p4], {
        strokeColor: args.color,
        fillColor: args.color,
        strokeOpacity: json.opacity,
        fillOpacity: json.opacity,
        fixed: true,
    });
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

function convertColor(rgb) {
    var color = [];
    if (rgb != null) {
        color[0] = Number((rgb[0] * 255).toFixed(0));
        color[1] = Number((rgb[1] * 255).toFixed(0));
        color[2] = Number((rgb[2] * 255).toFixed(0));
        color = JXG.rgb2hex(color);
    }
    return color;
}

function convertCoords(coords) {
    var newCoords = [];
    for (key in coords) {
        newCoords[key] = coords[key][0];
    }
    return newCoords;
}

function convertCoordsCurve(coords) {
    var x = [];
    var y = [];
    for (key in coords) {
        x[key] = coords[key][0];
        y[key] = coords[key][1];
    }
    return [x,y];
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
                opacity: 0.6,
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
                pointSize: 0.005,
            },
            {
                type: "rectangle",
                color: [0.0, 0.5, 1.0],
                opacity: 1.0,
                coords: [[[2.0, -5.0]], [[4.0, -2.0]]],
            },
            {
                type: "arrow",
                color: [0.2, 0.0, 1.0],
                opacity: 1.0,
                coords: [[[0.0, 0.0]], [[-4.0, 3.0]]],
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
        extent: { xmin: -6.0, xmax: 9.0, ymin: -4.0, ymax: 7.0 },
    });
}
