//TODO: this could be used to scale the width/height of the graphic, however not finished and not tested
/*
function createGraphics2dDiv(json, maxWidth, maxHeight) {
    var json2dDiv, maxRatio, givenRatio, width, height;
    json2dDiv = document.createElement("div");
    maxRatio = maxHeight / maxWidth;
    if (json.aspectRatio === undefined) {
        width = maxWidth;
        height = maxHeight;
    } else {
        if (json.aspectRatio.symbol === undefined) {
            if (json.aspectRatio.factor === undefined) {
                givenRatio = json.aspectRatio.factor;
                // width dominates
                if (givenRatio < maxRatio) {
                    width = maxWidth;
                    height = maxWidth * givenRatio;
                }
                // height dominates
                else {
                    height = maxHeight;
                    width = maxHeight / givenRatio;
                }
            }
        } else if (json.aspectRatio.symbol == "automatic") {
            givenRatio =
                json.extent === undefined
                    ? 1
                    : (json.extent.ymax - json.extent.ymin) /
                      (json.extent.xmax - json.extent.xmin);
            // width dominates
            if (givenRatio < maxRatio) {
                width = maxWidth;
                height = maxWidth * givenRatio;
            }
            // height dominates
            else {
                height = maxHeight;
                width = maxHeight / givenRatio;
            }
        } else if (json.aspectRatio.symbol == "full") {
            width = maxWidth;
            height = maxHeight;
        }
    }

    json2dDiv.setAttribute("width", width);
    json2dDiv.setAttribute("height", height);

    drawGraphics2d(json2dDiv.id, json);

    return json2dDiv;
}
*/
function drawGraphics2d(id, json) {
    var myoptions, extent, axes, grid, board, opts;
    myoptions = {
        elements: { dragToTopOfLayer: true },
        polygon: { vertices: { layer: 5 }, borders: { layer: 5 } },
        layer: {
            text: 5,
            point: 5,
            glider: 9,
            arc: 5,
            line: 5,
            circle: 5,
            curve: 5,
            turtle: 5,
            polygon: 5,
            sector: 3,
            angle: 5,
            integral: 5,
            axis: 3,
            ticks: 2,
            grid: 1,
            image: 5,
            trace: 0,
        },
    };
    JXG.Options = JXG.merge(JXG.Options, myoptions);

    extent =
        json.extent === undefined
            ? { xmin: -9.0, xmax: 9.0, ymin: -9.0, ymax: 9.0 }
            : json.extent;
    axes =
        json.axes === undefined
            ? { hasaxes: false, scaling: undefined, grid: false }
            : json.axes;
    grid = json.axes.grid ? -1 : 5;

    board = JXG.JSXGraph.initBoard(id, {
        boundingbox: [extent.xmin, extent.ymax, extent.xmax, extent.ymin],
        axis:
            (json.axes.hasaxes === true ||
                json.axes.hasaxes === [true, true]) &&
            (json.axes.scaling === undefined ||
                json.axes.scaling === ["none,none"]),
        defaultAxes: {
            x: { ticks: { visible: true, majorHeight: grid } },
            y: { ticks: { visible: true, majorHeight: grid } },
        },
        keepaspectratio: false,
        showClearTraces: true,
        showCopyRight: false,
        grid: false,
    });
    opts = { graphicsComplex: false, extent: extent };

    // draw every element in the json
    drawAxes(board, json.axes, extent);
    for (element of json.elements) {
        drawGraphic(board, element, opts);
    }
}

function drawGraphic(board, json, opts) {
    var args;

    switch (json.type) {
        case "point":
            args = getArgs(
                [
                    "coords",
                    "color",
                    "opacity",
                    "filling",
                    "pointSize",
                    "edgeForm",
                ],
                json,
                opts,
                json.type
            );
            drawPoint(board, args);
            break;
        case "arrow":
        case "line":
            args = getArgs(
                [
                    "coords",
                    "color",
                    "opacity",
                    "filling",
                    "arrow",
                    "thickness",
                    "edgeForm",
                ],
                json,
                opts,
                json.type
            );
            drawLine(board, args);
            break;
        case "disk":
        case "circle":
            args = getArgs(
                [
                    "coords",
                    "color",
                    "opacity",
                    "radius1",
                    "radius2",
                    "angle1",
                    "angle2",
                    "filled",
                    "edgeForm",
                ],
                json,
                opts,
                json.type
            );
            drawCircle(board, args);
            break;
        case "rectangle":
            args = getArgs(
                ["coords", "color", "opacity", "edgeForm"],
                json,
                opts,
                json.type
            );
            drawRectangle(board, args);
            break;
        case "polygon":
            args = getArgs(
                ["coords", "color", "opacity", "edgeForm"],
                json,
                opts,
                json.type
            );
            drawPolygon(board, args);
            break;
        case "text":
            args = getArgs(
                ["coords", "color", "opacity", "texts", "fontSize"],
                json,
                opts,
                json.type
            );
            drawText(board, args);
            break;
        case "graphicscomplex":
            drawGraphicsComplex(board, json, opts);
            break;
        case undefined:
            setOption(json, opts);
            break;
        default:
            console.warn("Type " + json.type + " not supported");
    }
}

function drawGraphicsComplex(board, json, opts) {
    opts.graphicsComplex = true;
    opts.graphicsComplexCoords = json.coords;
    for (element of json.data) {
        drawGraphic(board, element, opts);
    }
    opts.graphicsComplex = false;
}

function drawAxes(board, json, extent) {
    var attr = JXG.Options.axis,
        conversionX = function (n) {
            return n;
        };
    conversionY = function (n) {
        return n;
    };
    attr.fixed = true;
    if (
        (json.hasaxes === true || json.hasaxes === [true, true]) &&
        (json.scaling === undefined || json.scaling === ["none", "none"])
    )
        return;

    if (json.hasaxes === true || json.hasaxes[0]) {
        var xAxis = board.create(
            "line",
            [
                [0, 0],
                [1, 0],
            ],
            attr
        );
        conversionX = drawTicks(
            board,
            xAxis,
            json,
            extent.xmax - extent.xmin,
            false
        );
    }

    if (json.hasaxes === true || json.hasaxes[1]) {
        var yAxis = board.create(
            "line",
            [
                [0, 0],
                [0, 1],
            ],
            attr
        );
        conversionY = drawTicks(
            board,
            yAxis,
            json,
            extent.ymax - extent.ymin,
            extent,
            true
        );
    }

    if (json.hasaxes === true || json.hasaxes[0] || json.hasaxes[1])
        board.highlightInfobox = function (x, y, el) {
            this.infobox.setText(
                "(" + conversionX(x) + ", " + conversionY(y) + ")"
            );
        };
}

function drawTicks(board, axis, json, length, index) {
    var attr = index
            ? JXG.Options.board.defaultAxes.y.ticks
            : JXG.Options.board.defaultAxes.x.ticks,
        conversion,
        scaling = json.scaling === undefined ? ["none", "none"] : json.scaling,
        coordIndex = index ? 1 : 0;
    switch (scaling[coordIndex]) {
        case "log":
            attr.drawZero = false;
            conversion = function (n) {
                console.log(n, +Math.exp(n).toFixed(5));
                //return +Math.exp(n).toFixed(2);
                return +Math.exp(n).toFixed(5);
            };
            break;
        case "log2":
            attr.drawZero = false;
            conversion = function (n) {
                return Math.pow(2, n);
            };
            break;
        case "log10":
            attr.drawZero = false;
            conversion = function (n) {
                return Math.pow(10, n);
            };
            break;
        default:
            conversion = function (n) {
                return n;
            };
            break;
    }
    attr.generateLabelText = function (tick, zero) {
        var n = +(
            tick.usrCoords[coordIndex + 1] - zero.usrCoords[coordIndex + 1]
        ).toFixed(10);
        return conversion(n).toString();
    };
    attr.drawLabels = true;
    attr.majorHeight = json.grid ? -1 : 5;
    attr.fixed = true;
    board.create("ticks", [axis, calculateSetOff(length)], attr);
    return conversion;
}

function setOption(json, opts) {
    opts[json.option] = validateAttr(json.option, json.value, undefined);
}

function getAttr(attr, json, opts, type) {
    var value;
    if (attr == "coords")
        value = convertCoords(
            opts.graphicsComplex ? json["positions"] : json["coords"],
            opts
        );
    else if (attr == "edgeForm") {
        if (json[attr] === undefined)
            value = {
                color: getAttr("color", json, opts, type),
                opacity: getAttr("opacity", json, opts, type),
            };
        else
            value = {
                color: validateAttr("color", json[attr].color, type),
                opacity: validateAttr("opacity", json[attr].opacity, type),
            };
    } else if (json[attr] != undefined)
        value = validateAttr(attr, json[attr], type);
    else if (opts[attr] != undefined) value = opts[attr];
    else value = validateAttr(attr, undefined, type);
    return value;
}

function validateAttr(attr, value, type) {
    switch (attr) {
        case "color":
            if (value == undefined) value = [0.0, 0.0, 0.0];
            else value = convertColor(value);
            break;
        case "opacity":
            if (value == undefined) value = 1.0;
            break;
        case "pointSize":
            if (value == undefined) value = 0.005;
            break;
        case "fontSize":
            if (value == undefined) value = 20;
            break;
        case "radius1":
        case "radius2":
            if (value == undefined) value = 1;
            break;
        case "arrow":
            value = type == "arrow";
            break;
        case "filled":
            value = type == "disk";
            break;
        default:
    }
    return value;
}

function getArgs(lst, json, opts, type) {
    var args = {};
    for (attr of lst) {
        args[attr] = getAttr(attr, json, opts, type);
    }
    return args;
}

function drawPoint(board, args) {
    var fillingCoord, infiniteLength, max, min;
    for (coord of args.coords) {
        board.create("point", coord, {
            strokeColor: args.edgeForm.color,
            fillColor: args.color,
            strokeOpacity: args.edgeForm.opacity,
            fillOpacity: args.opacity,
            fixed: true,
            name: "",
            size: (board.canvasWidth * args.pointSize) / 2,
        });
    }
    if (args.filling) {
        for (coord of args.coords) {
            if (max == undefined) {
                max = coord[1];
                min = coord[1];
            }
            if (coord[1] > max) max = coord[1];
            if (coord[1] < min) min = coord[1];
        }
        for (coord of args.coords) {
            switch (args.filling) {
                case "+infinity":
                    fillingCoord = [coord[0], coord[1] + 1];
                    infiniteLength = true;
                    break;
                case "-infinity":
                    fillingCoord = [coord[0], coord[1] - 1];
                    infiniteLength = true;
                    break;
                case "top":
                    fillingCoord = [coord[0], max];
                    infiniteLength = false;
                    break;
                case "bottom":
                    fillingCoord = [coord[0], min];
                    infiniteLength = false;
                    break;
                case "axis":
                    fillingCoord = [coord[0], 0];
                    infiniteLength = false;
                    break;
                default:
                    return;
            }
            board.create("line", [coord, fillingCoord], {
                strokeColor: args.edgeForm.color,
                straightFirst: false,
                straightLast: infiniteLength,
                strokeOpacity: args.edgeForm.opacity,
                fixed: true,
                filled: true,
            });
        }
    }
}

function drawCircle(board, args) {
    for (coord of args.coords) {
        // calculate the foci of the ellipse
        var foci = calculateFoci(args.radius1, args.radius2, coord);
        board.create(
            "ellipse",
            [foci[0], foci[1], foci[2], args.angle1, args.angle2],
            {
                strokeColor: args.edgeForm.color,
                fillColor: args.color,
                strokeOpacity: args.edgeForm.opacity,
                fillOpacity: args.opacity * args.filled,
            }
        );
    }
}

function drawLineSegmented(board, args) {
    for (index = 1; index < args.coords.length; index++) {
        board.create("line", [args.coords[index], args.coords[index - 1]], {
            straightFirst: false,
            straightLast: false,
            strokeColor: args.edgeForm.color,
        });
    }
}

function drawLine(board, args) {
    var newCoords = convertCoordsCurve(args.coords),
        inverted = true,
        xCopy,
        yCopy,
        yTarget,
        coordCopy,
        filling,
        max,
        min,
        curve = board.create("curve", newCoords, {
            lastArrow: args.arrow,
            strokeColor: args.edgeForm.color,
            strokeOpacity: args.edgeForm.opacity,
            strokeWidth: (board.canvasWidth * args.thickness) / 2,
        });

    if (!args.filling) return;
    for (yCoord of newCoords[1]) {
        if (max == undefined) {
            max = yCoord;
            min = yCoord;
        }
        if (yCoord > max) max = yCoord;
        if (yCoord < min) min = yCoord;
    }
    switch (args.filling) {
        case "+infinity":
            yTarget = board.getBoundingBox()[1];
            break;
        case "-infinity":
            yTarget = board.getBoundingBox()[3];
            break;
        case "top":
            yTarget = max;
            break;
        case "bottom":
            yTarget = min;
            break;
        case "axis":
            yTarget = 0;
            break;
        default:
            return;
    }
    xCopy = [...newCoords[0]];
    yCopy = [...newCoords[1]];
    coordCopy = [xCopy, yCopy];
    coordCopy[0].push(coordCopy[0][coordCopy[0].length - 1]);
    coordCopy[0].unshift(coordCopy[0][0]);
    coordCopy[1].push(yTarget);
    coordCopy[1].unshift(yTarget);

    filling = board.create("curve", coordCopy, {
        strokeOpacity: 0.0,
        fillColor: args.color,
        fillOpacity: args.opacity,
        highlightStrokeColorOpacity: 0.0,
    });

    filling.updateDataArray = function () {
        var yTarget,
            boundingbox = board.getBoundingBox();
        this.dataY.shift();
        this.dataY.pop();
        switch (args.filling) {
            case "+infinity":
                yTarget = boundingbox[1];
                break;
            case "-infinity":
                yTarget = boundingbox[3];
                break;
            case "top":
                yTarget = max;
                break;
            case "bottom":
                yTarget = min;
                break;
            case "axis":
                yTarget = 0;
                break;
        }
        this.dataY.push(yTarget);
        this.dataY.unshift(yTarget);
    };
    board.update();
}

function drawPolygon(board, args) {
    board.create("polygon", args.coords, {
        fillColor: args.color,
        fillOpacity: args.opacity,
        borders: {
            strokeColor: args.edgeForm.color,
            strokeOpacity: args.edgeForm.opacity,
        },
        vertices: { fixed: true, visible: false },
    });
}

function drawText(board, args) {
    for (index in args.coords) {
        board.create(
            "text",
            [args.coords[index][0], args.coords[index][1], args.texts[index]],
            {
                color: args.color,
                fixed: true,
                opacity: args.opacity,
                fontSize: args.fontSize,
                anchorX: "middle",
            }
        );
    }
}

function drawRectangle(board, args) {
    var start, end, p1, p2, p3, p4;
    start = args.coords[0];
    if (args.coords.length == 1) end = [start[0] + 1, start[1] + 1];
    else if (args.coords.length == 2) end = args.coords[1];

    p1 = board.create("point", [start[0], start[1]], { visible: false });
    p2 = board.create("point", [end[0], end[1]], { visible: false });
    p3 = board.create(
        "point",
        [
            function () {
                return p1.X();
            },
            function () {
                return p2.Y();
            },
        ],
        { visible: false }
    );
    p4 = board.create(
        "point",
        [
            function () {
                return p2.X();
            },
            function () {
                return p1.Y();
            },
        ],
        { visible: false }
    );

    board.create("polygon", [p1, p3, p2, p4], {
        fillColor: args.color,
        fillOpacity: args.opacity,
        borders: {
            strokeColor: args.edgeForm.color,
            strokeOpacity: args.edgeForm.opacity,
        },
        vertices: { fixed: true, visible: false },
    });
}

function calculateFoci(radiusX, radiusY, coords) {
    var eccentricity, diff;
    diff = Math.abs(radiusX * radiusX - radiusY * radiusY);
    eccentricity = Math.sqrt(diff);
    if (radiusX > radiusY) {
        return [
            [eccentricity + coords[0], coords[1]],
            [-eccentricity + coords[0], coords[1]],
            [coords[0], radiusY + coords[1]],
        ];
    } else {
        diff = radiusY ^ (2 - radiusX) ^ 2;
        return [
            [coords[0], eccentricity + coords[1]],
            [coords[0], -eccentricity + coords[1]],
            [coords[0], radiusY + coords[1]],
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

function convertCoords(coords, opts) {
    var x,
        y,
        newCoords = [],
        target = opts.graphicsComplex ? opts.graphicsComplexCoords : coords,
        key;

    for (index in coords) {
        key = opts.graphicsComplex ? coords[index] - 1 : index;
        if (target[key][0] != null) newCoords[index] = target[key][0];
        else {
            x =
                opts.extent.xmin +
                target[key][1][0] * (opts.extent.xmax - opts.extent.xmin);
            y =
                opts.extent.ymin +
                target[key][1][1] * (opts.extent.ymax - opts.extent.ymin);
            newCoords[index] = [x, y];
        }
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
    return [x, y];
}

function calculateSetOff(length) {
    var setOff = Math.floor(Math.log10(Math.abs(length) / 2));
    return 10 ** setOff;
}

function testRun() {
    drawGraphics2d("graphics2d", {
        axes: {
            hasaxes: [true, true],
            scaling: ["log", "none"],
        },
        elements: [
            {
                option: "opacity",
                value: 1.0,
            },
            {
                option: "pointSize",
                value: 0.0013,
            },
            {
                option: "fontSize",
                value: 12,
            },
            {
                option: "color",
                value: [0.0, 0.0, 0.0],
            },
            {
                option: "opacity",
                value: 1.0,
            },
            {
                aspectRatio: {
                    symbol: "automatic",
                },
            },
            {
                option: "color",
                value: [
                    0.36841699481010437, 0.5067790150642395, 0.7097979784011841,
                ],
            },
            {
                option: "opacity",
                value: 1.0,
            },
            {
                type: "line",
                coords: [
                    [[-4.605170185988091, 0.011283415555849616]],
                    [[-4.526435254891175, 0.012207655368268452]],
                    [[-4.438618509204393, 0.013328072146486673]],
                    [[-4.345676974946632, 0.014626055071214977]],
                    [[-4.247553499623224, 0.016133790531662542]],
                    [[-4.135231655959776, 0.018051351211604203]],
                    [[-4.036439530044997, 0.01992537469051343]],
                    [[-3.928491947659845, 0.022196099216269062]],
                    [[-3.819275358394481, 0.024756836173917267]],
                    [[-3.693356610687164, 0.028077665740535496]],
                    [[-3.5768073913492553, 0.03154671537736212]],
                    [[-3.4771610056421194, 0.03485018286903202]],
                    [[-3.373209443013041, 0.03866506354641426]],
                    [[-3.2809388698241793, 0.042399122193371164]],
                    [[-3.1794853624276103, 0.04692146460141316]],
                    [[-3.0548523438055923, 0.053140799736736785]],
                    [[-2.9444257666432194, 0.059334368347812166]],
                    [[-2.855770358314415, 0.06482330088154742]],
                    [[-2.7747811723742184, 0.07027812823504884]],
                    [[-2.670067896951281, 0.07801274687519696]],
                    [[-2.5810028914445273, 0.08525323128705677]],
                    [[-2.4764035843488923, 0.09461174581298241]],
                    [[-2.387642478365849, 0.10334638486082878]],
                    [[-2.2890453202714727, 0.11398559187090514]],
                    [[-2.1748735562014567, 0.12765968379666565]],
                    [[-2.0418316952699076, 0.14563495851656053]],
                    [[-1.9244623968570933, 0.16352966073661027]],
                    [[-1.8140459452126734, 0.18230247854893203]],
                    [[-1.7195173689549752, 0.2000099843982754]],
                    [[-1.6063370751461308, 0.22337589408775335]],
                    [[-1.4793926714596672, 0.25264115334901793]],
                    [[-1.3644037387598815, 0.28218327796145887]],
                    [[-1.2678670245261465, 0.3093727009339386]],
                    [[-1.145937718390312, 0.3470117642064873]],
                    [[-1.0442128305086888, 0.38134608781986684]],
                    [[-0.9249374982005204, 0.4250764502299808]],
                    [[-0.8230860486787237, 0.46536431484154367]],
                    [[-0.7173234164006994, 0.509942010571425]],
                    [[-0.6158285825485391, 0.555102024829899]],
                    [[-0.5349120655844672, 0.5925187908860827]],
                    [[-0.44548122951362606, 0.6349722372410185]],
                    [[-0.3280343155200688, 0.6916603782399201]],
                    [[-0.20726709858969167, 0.7496403871277924]],
                    [[-0.09747498052346788, 0.8004618601982757]],
                    [[0.016059346702397982, 0.8493127634831105]],
                    [[0.12207060411656578, 0.8899183784747158]],
                    [[0.24164583684051777, 0.9282623020755847]],
                    [[0.3738752614719248, 0.9601553248464214]],
                    [[0.5005335599289943, 0.9803459958725685]],
                    [[0.618596669946653, 0.9913410714048725]],
                    [[0.7270310739716632, 0.9965654687958083]],
                    [[0.8297721799857095, 0.9988151557938643]],
                    [[0.9164040555561902, 0.9995936647085429]],
                    [[1.0374371634284454, 0.9999341703038378]],
                    [[1.1496958791603114, 0.9999919931674193]],
                    [[1.259079467629555, 0.9999993677989969]],
                    [[1.3714987009348616, 0.9999999750720187]],
                    [[1.4910661660033961, 0.9999999996650973]],
                    [[1.5982629012335736, 0.9999999999972995]],
                    [[1.696954580071903, 0.9999999999999882]],
                    [[1.804491440957973, 1.0]],
                    [[1.9172242136431756, 1.0]],
                    [[2.0499428024958846, 1.0]],
                    [[2.1830347478913157, 1.0]],
                    [[2.302585092994046, 1.0]],
                ],
            },
            {
                option: "color",
                value: [
                    0.8807219862937927, 0.6110410094261169, 0.14205099642276764,
                ],
            },
            {
                option: "opacity",
                value: 1.0,
            },
            {
                type: "line",
                coords: [
                    [[-4.605170185988091, 0.9887165844441503]],
                    [[-4.483945241527553, 0.9872625076635165]],
                    [[-4.3725163824093265, 0.9857612367488829]],
                    [[-4.258256082161105, 0.9840379389181184]],
                    [[-4.147250361496865, 0.982164267977128]],
                    [[-4.034181963740968, 0.980029601035375]],
                    [[-3.9171903475154015, 0.9775516926794791]],
                    [[-3.8043519827934382, 0.9748710599175034]],
                    [[-3.6727821205818505, 0.9713389154146203]],
                    [[-3.5631208593848704, 0.9680187825917232]],
                    [[-3.4332572096487306, 0.9635867402360251]],
                    [[-3.3171702689178413, 0.9591082154528703]],
                    [[-3.1871975810519837, 0.9534386011100476]],
                    [[-3.0466644195671533, 0.9464229557811602]],
                    [[-2.922733190229939, 0.9393669350870455]],
                    [[-2.792871394486158, 0.930978612078079]],
                    [[-2.680097439378381, 0.9227633260530348]],
                    [[-2.572733548022571, 0.9140415913485194]],
                    [[-2.4562784085272567, 0.9034742039123972]],
                    [[-2.340480469191667, 0.891692886988184]],
                    [[-2.2180868237547355, 0.8776959855950691]],
                    [[-2.10417006096921, 0.8630767890761106]],
                    [[-1.9920894768984092, 0.8470270913120899]],
                    [[-1.8928153773766427, 0.8312901881997582]],
                    [[-1.7800117036214897, 0.8115029597694384]],
                    [[-1.6755920533508077, 0.7912120853760004]],
                    [[-1.563560463452004, 0.7671376203053082]],
                    [[-1.4414126685011683, 0.737931789571556]],
                    [[-1.3190532193328321, 0.7053234621474387]],
                    [[-1.2006127990796462, 0.6703322952767647]],
                    [[-1.0642513575784494, 0.6256320638240094]],
                    [[-0.9492508928444027, 0.5841422373888516]],
                    [[-0.8233478517163806, 0.5347426416084663]],
                    [[-0.7314309796607987, 0.49615774063141904]],
                    [[-0.6432511392929471, 0.45730997048479594]],
                    [[-0.5471101478994178, 0.41319071586719847]],
                    [[-0.4668223391852555, 0.37524052255254464]],
                    [[-0.35600962823813614, 0.3218768628545733]],
                    [[-0.2566878539948171, 0.27393337144278385]],
                    [[-0.16937323449576358, 0.2325287194445958]],
                    [[-0.06490323414084628, 0.18505782512856428]],
                    [[0.031275372910780884, 0.14452587929553587]],
                    [[0.12232263878078334, 0.10999199071336506]],
                    [[0.21840066439684158, 0.0785091700251278]],
                    [[0.30447067553309454, 0.05516908418276241]],
                    [[0.39860420687324033, 0.03513353312111993]],
                    [[0.508026878576669, 0.018751476336465244]],
                    [[0.6018718612538563, 0.009831695198351191]],
                    [[0.6882541547446888, 0.004883473456078879]],
                    [[0.7985686972176091, 0.0016728954007849584]],
                    [[0.9024675334579041, 4.884754587279875e-4]],
                    [[1.0011808896584824, 1.1871079300683019e-4]],
                    [[1.1151323532361435, 1.608272520435538e-5]],
                    [[1.2132599573366651, 1.95492230504191e-6]],
                    [[1.3011491441734435, 2.0457062674077836e-7]],
                    [[1.4033226761515587, 8.715318402234646e-9]],
                    [[1.5279865610113976, 7.127399123617135e-11]],
                    [[1.620000823557003, 8.924245479522374e-13]],
                    [[1.7214933934964465, 2.58385053694855e-15]],
                    [[1.811483611353302, 4.959123644947644e-18]],
                    [[1.9091179470636293, 1.4025312246741092e-21]],
                    [[2.0081868691050078, 5.920146056519247e-26]],
                    [[2.090625110821102, 2.6102280914378954e-30]],
                    [[2.203716313075544, 1.426246511668164e-37]],
                    [[2.302585092994046, 2.0884875837625446e-45]],
                ],
            },
        ],
        extent: {
            xmin: -5.180816459236603,
            xmax: 2.878231366242557,
            ymin: -0.08333333333333333,
            ymax: 1.0833333333333333,
        },
    });

    /*
    drawGraphics2d("graphics2d", {
        elements: [
            {
                option: "opacity",
                value: 1.0,
            },
            {
                option: "pointSize",
                value: 0.0013,
            },
            {
                option: "textSize",
                value: 12,
            },
            {
                option: "fontSize",
                value: 12,
            },
            {
                option: "color",
                value: [0.0, 0.0, 0.0],
            },
            {
                type: "graphicscomplex",
                coords: [
                    [null, [1.0, 0.5]],
                    [null, [0.5, 0.1]],
                    [null, [0.0, 0.5]],
                    [null, [0.5, 0.6]],
                ],
                data: [
                    {
                        type: "polygon",
                        positions: [1, 2, 3, 4],
                    },
                ],
            },
        ],
        extent: {
            xmin: -20.0,
            xmax: 10.0,
            ymin: -10.0,
            ymax: 15.0,
        },
        axes: {
            hasaxes: [true, true],
            grid: false
        },
        aspectRatio: {
            symbol: "automatic",
        },
    });
    */

    /**
        elements: [
            { option: "opacity", value: 1.0 },
            { option: "pointSize", value: 0.0013 },
            { option: "textSize", value: 12 },
            { option: "color", value: [1.0, 0.0, 0.0] },
            {
                type: "disk",
                radius1: 1.0,
                radius2: 1.0,
                coords: [[[0.0, 0.0]]],
            },
            { option: "color", value: [0.0, 1.0, 0.0] },
            { type: "rectangle", coords: [[[0.0, 0.0]], [[2.0, 2.0]]] },
            { option: "color", value: [0.0, 0.0, 1.0] },
            {
                type: "disk",
                radius1: 1.0,
                radius2: 1.0,
                coords: [[[2.0, 2.0]]],
            },
        ],
        extent: { xmin: -1.0, xmax: 3.0, ymin: -1.0, ymax: 3.0 },
        axes: { hasaxes: false },
        aspectRatio: { symbol: "automatic" },
    });
    drawGraphics2d("graphics2d", {
        elements: [
            {
                type: "disk",
                color: [0.3, 0.0, 0.8],
                opacity: 0.5,
                radius1: 2.0,
                radius2: 2.0,
                coords: [[[1.0, 0.0]]],
                edgeForm: {
                    color: [1.0, 0.0, 0.0],
                    opacity: 1.0,
                }
            },
            {
                type: "circle",
                color: [0.2, 0.9, 0.0],
                opacity: 0.9,
                radius1: 4.0,
                radius2: 2.0,
                coords: [[[0.0, 5.0]]],
            },
            {
                type: "circle",
                color: [0.0, 0.0, 1.0],
                opacity: 1.0,
                radius1: 4.0,
                radius2: 2.0,
                angle1: 0.523598775598298,
                angle2: 2.35619449019234,
                coords: [[[0.0, 5.0]]],
            },
            {
                type: "arrow",
                color: [0.2, 0.0, 1.0],
                opacity: 1.0,
                coords: [[[0.0, 0.0]], [[-4.0, 3.0]]],
                thickness: 0.02,
            },
            { option: "filling", value: "axis" },
            {
                type: "line",
                color: [1.0, 0.5, 0.0],
                opacity: 0.6,
                coords: [
                    [[1.0, 1.0]],
                    [[3.0, 1.0]],
                    [[4.0, 3.0]],
                    [[5.0, 7.0]],
                ],
                thickness: 0.01,
                edgeForm: {
                    color: [1.0, 0.0, 0.0],
                    opacity: 1.0,
                }
            },
            { option: "filling", value: "bottom" },
            {
                type: "point",
                color: [0.7, 1.0, 0.0],
                coords: [[[0, 0]], [[1, 1]], [[2, 2]], [[3.5, 3.5]]],
                opacity: 0.5,
                pointSize: 0.005,
            },
            {
                type: "rectangle",
                color: [0.5, 0.5, 0.0],
                opacity: 0.3,
                coords: [[[2.0, -5.0]], [[4.0, -2.0]]],
                edgeForm: {
                    color: [1.0, 0.0, 0.0],
                    opacity: 1.0,
                }
            },
            {
                type: "polygon",
                color: [0.0, 0.5, 0.0],
                opacity: 1.0,
                coords: [
                    [[-1.0, -1.0]],
                    [[0.0, -1.0]],
                    [[-4.0, -4.0]],
                    [[-1.0, 0.0]],
                ],
                edgeForm: {
                    color: [1.0, 0.0, 0.0],
                    opacity: 1.0,
                }
            },
            { option: "pointSize", value: 0.01 },
            { option: "filling", value: "bottom" },
            { option: "color", value: [1, 0, 1] },
            {
                type: "point",
                coords: [[[-1, -1]], [[-2, -2]], [[-3, -3]]],
                opacity: 0.5,
            },
            {
                type: "text",
                color: [0.5, 0.4, 0.1],
                fontSize: 40,
                opacity: 0.8,
                coords: [[[-5, -5]], [[5, 5]]],
                texts: ["Bottom left", "Top right"],
            },
        ],
        extent: { xmin: -9.0, xmax: 9.0, ymin: -9.0, ymax: 9.0 },
        axes: { hasaxes: true, scaling: ["log2", "log2"] },
    });
    /*
    drawGraphics2d("graphics2d", {
  "axes": {
    "hasaxes": false
  },
  "elements": [{
    "option": "opacity",
    "value": 1.0
  }, {
    "option": "pointSize",
    "value": 0.0013
  }, {
    "option": "textSize",
    "value": 12
  }, {
    "option": "fontSize",
    "value": 12
  }, {
    "option": "color",
    "value": [0.0, 0.0, 0.0]
  }, {
    "aspectRatio": {
      "symbol": "automatic"
    }
  }, {
    "type": "graphicscomplex",
    "coords": [
      [
        [15.0, 0.0]
      ],
      [
        [-12.135254915624213, 8.816778784387097]
      ],
      [
        [4.635254915624212, -14.265847744427303]
      ],
      [
        [4.635254915624212, 14.265847744427303]
      ],
      [
        [-12.135254915624213, -8.816778784387097]
      ],
      [
        [15.0, 0.0]
      ]
    ],
    "data": [{
      "type": "line",
      "positions": [1, 2, 3, 4, 5, 6]
    }, {
      "type": "point",
      "positions": [1, 2, 3, 4, 5]
    }]
  }],
  "extent": {
    "xmin": -12.135254915624213,
    "xmax": 15.0,
    "ymin": -14.265847744427303,
    "ymax": 14.265847744427303
  }
});

    drawGraphics2d("graphics2d", {
        axes: {
            hasaxes: false,
        },
        elements: [
            {
                option: "opacity",
                value: 1.0,
            },
            {
                option: "pointSize",
                value: 0.0013,
            },
            {
                option: "fontSize",
                value: 12,
            },
            {
                option: "color",
                value: [0.0, 0.0, 0.0],
            },
            {
                aspectRatio: {
                    symbol: "automatic",
                },
            },
            {
                type: "graphicscomplex",
                coords: [[[0.0, 0.0]], [[2.0, 0.0]], [[2.0, 2.0]], [[0.0, 2.0]]],
                data: [
                    {
                        type: "circle",
                        color: [0.0, 0.0, 0.0],
                        positions: [1],
                    },
                    {
                        type: "circle",
                        color: [0.0, 0.0, 0.0],
                        positions: [2],
                    },
                    {
                        type: "circle",
                        color: [0.0, 0.0, 0.0],
                        positions: [3],
                    },
                    {
                        type: "circle",
                        color: [0.0, 0.0, 0.0],
                        positions: [4],
                    },
                ],
            },
        ],
        extent: {
            xmin: 0.0,
            xmax: 2.0,
            ymin: 0.0,
            ymax: 2.0,
        },
    });
   drawGraphics2d("graphics2d",
{"axes":{"hasaxes":true, "scaling":["log","log10"]},"elements":[{"option":"opacity","value":1.0},{"option":"pointSize","value":0.0013},{"option":"textSize","value":12},{"option":"fontSize","value":12},{"option":"color","value":[0.0,0.0,0.0]},{"aspectRatio":{"symbol":"automatic"}},{"option":"color","value":[0.36841699481010437,0.5067790150642395,0.7097979784011841]},{"type":"point","coords":[[[0.25,0.0]],[[0.4990133642141358,0.03139525976465669]],[[0.7440860259858584,0.0939999251732282]],[[0.9822872507286887,0.18738131458572463]],[[1.2107289514107888,0.3108623589560685]],[[1.4265847744427302,0.46352549156242107]],[[1.62710885030444,0.6442179671981864]],[[1.8096541049320392,0.8515585831301452]],[[1.971690030098693,1.0839457667288592]],[[2.110819813755038,1.3395669874474914]],[[2.2247967345311057,1.6164094438043008]],[[2.311539728327368,1.9122719692460688]],[[2.369148039119588,2.224778094268238]],[[2.3959148707504108,2.55139019597494]],[[2.390339961557587,2.889424660409209]],[[2.3511410091698934,3.236067977499789]],[[2.277263878660736,3.5883936833835635]],[[2.167891533457719,3.943380060197386]],[[2.0224516349340953,4.297928499213593]],[[1.8406227634233894,4.648882429441257]],[[1.6223392204684732,4.993046710549557]],[[1.3677943794067,5.327207386207472]],[[1.0774425588679146,5.64815169168996]],[[0.7519994013858229,5.952688207886867]],[[0.39244074705820536,6.237667052676697]],[[-3.9318595863152205E-15,6.5]],[[-0.42383600682287,6.736680416890833]],[[-0.877332634950135,6.944802909201345]],[[-1.3585145307465099,7.121582567782991]],[[-1.865174153736418,7.264373708464731]],[[-2.39488170640585,7.370688001287437]],[[-2.9449964214774322,7.438211887106008]],[[-3.5126791554118566,7.464823182844658]],[[-4.094906229864588,7.4486067803728355]],[[-4.688484456066228,7.387869348142626]],[[-5.290067270632267,7.28115294937452]],[[-5.89617190517539,7.127247495676042]],[[-6.503197506322552,6.9252019605034]],[[-7.107444117358773,6.674334282804704]],[[-7.705132427757903,6.374239897486885]],[[-8.292424192343221,6.024798835997836]],[[-8.865443217771169,5.626181347279449]],[[-9.420296810471543,5.178851996593422]],[[-9.953097577126224,4.6835722072157795]],[[-10.459985466242836,4.141401217702606]],[[-10.937149937394274,3.553695435311872]],[[-11.380852143261421,2.922106174187019]],[[-11.78744700874427,2.2485757750286686]],[[-12.153405091102357,1.5353321111626983]],[[-12.475334105353395,0.7848814941163866]],[[-12.75,-3.241139988461692E-14]],[[-12.97434746956753,-0.816276753881108]],[[-13.145519792416827,-1.6606653447270672]],[[-13.26087788483729,-2.5296477469073197]],[[-13.318018465518668,-3.419485948516792]],[[-13.314791228132137,-4.326237921249303]],[[-13.249314923907566,-5.245774875756702]],[[-13.119992260757263,-6.173799727693595]],[[-12.925523530646965,-7.105866693000342]],[[-12.6649188825302,-8.03740192468499]],[[-12.337509164217918,-8.963725097460257]],[[-11.942955263024698,-9.880071841104732]],[[-11.481255881887193,-10.781616918376887]],[[-10.952753694858975,-11.663498038742624]],[[-10.358139833416162,-12.520840195106613]],[[-9.69845666282576,-13.348780407186666]],[[-8.975098815898152,-14.14249275215878]],[[-8.18981245972912,-14.897213560745703]],[[-7.344692779497467,-15.608266655038854]],[[-6.442179671981832,-16.271088503044414]],[[-5.48505165015529,-16.881253164238984]],[[-4.476417968967365,-17.434496900315366]],[[-3.419708991189459,-17.92674232579857]],[[-2.318664820939619,-18.35412197431784]],[[-1.1773222411746227,-18.713001158030092]],[[-3.4902433775699565E-15,-19.0]],[[1.208717500939272,-19.21201452224423]],[[2.4439980545039153,-19.34623667563232]],[[3.7007809630680373,-19.400173201891608]],[[4.973797743297064,-19.37166322257263]],[[6.2575941360926475,-19.258894454976872]],[[7.546553330035854,-19.06041796070917]],[[8.834920299975208,-18.77516133866993]],[[10.116827156135965,-18.402440280921166]],[[11.386319393303618,-17.94196841691786]],[[12.637382924288108,-17.393865379061417]],[[13.863971777033932,-16.758663030373473]],[[15.060036330431078,-16.03730980327112]],[[16.21955196012633,-15.2311731069134]],[[17.33654796245518,-14.34203976934561]],[[18.40513662202998,-13.372114489653866]],[[19.419542286546275,-12.324016284517038]],[[20.37413031101976,-11.200772922865008]],[[21.263435732951393,-10.005813351779349]],[[22.08219153984591,-8.742958126261255]],[[22.82535639108363,-7.416407864998906]],[[23.48814165736926,-6.030729763747909]],[[24.066037642852837,-4.590842207350447]],[[24.5548388575333,-3.1019975307167367]],[[24.950668210706777,-1.5697629882330533]]]},{"option":"color","value":[0.8807219862937927,0.6110410094261169,0.14205099642276764]},{"type":"point","coords":[[[1.0,0.0]],[[1.4114229349541114,0.08879920430680767]],[[1.7183930696126968,0.2170835284102719]],[[1.9645745014573774,0.37476262917144926]],[[2.165817790145251,0.5560874930173678]],[[2.329603181472081,0.7569339580671206]],[[2.4599573565358694,0.9739660179005526]],[[2.559237378399034,1.2042856974178682]],[[2.628920040131591,1.4452610223051456]],[[2.6699993366713346,1.6944331034817033]],[[2.6832058193627657,1.949463139158519]],[[2.6691361687846404,2.2081014724159873]],[[2.6283337643725044,2.4681696908963655]],[[2.561340735492802,2.727550849517785]],[[2.4687324967697633,2.984184957302903]],[[2.3511410091698934,3.236067977499789]],[[2.209270472734582,3.481253219503447]],[[2.0439077389131417,3.7178543751485176]],[[1.8559289041844917,3.944049683081155]],[[1.6463030479792848,4.158086852654009]],[[1.4160937677509389,4.358288476103544]],[[1.1664589660667442,4.543057723657328]],[[0.898649215369994,4.71088416199283]],[[0.614004940091221,4.860349569068419]],[[0.3139525976465643,4.990133642141358]],[[-3.0844044238966405E-15,5.0990195135927845]],[[-0.3262691101752534,5.1858990028485366]],[[-0.6632011340454491,5.249777543458468]],[[-1.0090792608216481,5.2897787331210395]],[[-1.3621306102360595,5.305148461698121]],[[-1.7205338087896829,5.295258578465424]],[[-2.0824269401968083,5.259610065275045]],[[-2.4459158139941457,5.197835687173399]],[[-2.8090824988520877,5.109702096467358]],[[-3.16999406901831,4.995111370368906]],[[-3.5267115137548446,4.85410196624968]],[[-3.877298760756532,4.686849082255141]],[[-4.219831765478702,4.493664414601618]],[[-4.552407619141949,4.274995306334071]],[[-4.873153628987553,4.031423285675352]],[[-5.180236325177307,3.763661995359508]],[[-5.471870349603195,3.472554517517818]],[[-5.7463271828228235,3.159070101778608]],[[-6.001943666386018,2.8243003072493478]],[[-6.237130278981017,2.469454571968915]],[[-6.45037912611529,2.0958552262444443]],[[-6.640271604462489,1.7049319690149387]],[[-6.805485703556952,1.298215829006073]],[[-6.944802909201346,0.8773326349501133]],[[-7.057114674770558,0.44399602153402107]],[[-7.14142842854285,-1.8154015101558723E-14]],[[-7.196873087263413,-0.45278887555194364]],[[-7.222704048340115,-0.912439713127016]],[[-7.218307635379828,-1.376965824200901]],[[-7.183204974188484,-1.8443335649480082]],[[-7.117055278870498,-2.312471439283428]],[[-7.01965853026414,-2.7792794243274446]],[[-6.890957531628813,-3.2426384777350896]],[[-6.731039329247768,-3.700420185346491]],[[-6.540135988414308,-4.150496506810722]],[[-6.318624718119893,-4.590749576220021]],[[-6.067027340646922,-5.019081514365228]],[[-5.786009105175445,-5.433424208988919]],[[-5.476376847429488,-5.831749019371312]],[[-5.139076500302726,-6.212076361735766]],[[-4.775189963302667,-6.5724851323052444]],[[-4.385931341524841,-6.911121925377248]],[[-3.9726425677014996,-7.226210004510389]],[[-3.536788423650768,-7.516057985828071]],[[-3.079950980170058,-7.779068193540246]],[[-2.6038234770600908,-8.01374464905831]],[[-2.110203667521424,-8.218700656525893]],[[-1.6009866536229462,-8.392665949203577]],[[-1.078157241890365,-8.534493362921982]],[[-0.5437818502920815,-8.643165004747562]],[[-1.6014334917041597E-15,-8.717797887081348]],[[0.5509845727355697,-8.757648999623552]],[[1.106913147443542,-8.762119793977748]],[[1.665481554210083,-8.73076005812701]],[[2.224349972069457,-8.663271160581008]],[[2.78115294937451,-8.559508646656388]],[[3.333509603364298,-8.419484172102113]],[[3.879033955178687,-8.243366762104596]],[[4.41534535578837,-8.03148338659292]],[[4.940078957717594,-7.784318845699721]],[[5.45089618703906,-7.502514962205877]],[[5.945495169918199,-7.186869080794458]],[[6.421621067978849,-6.838331876948514]],[[6.877076276954765,-6.458004481335235]],[[7.309730443481288,-6.047134928513077]],[[7.717530255467718,-5.60711394176544]],[[8.098508962271564,-5.139470068791835]],[[8.450795581868187,-4.645864185862211]],[[8.772623753369794,-4.128083390850052]],[[9.062340194591934,-3.588034308292412]],[[9.318412725888301,-3.027735832268551]],[[9.539437823170033,-2.449311335431446]],[[9.724147664886832,-1.8549803749570968]],[[9.87141663976691,-1.2470499284844077]],[[9.98026728428271,-0.6279051952932213]]]},{"option":"color","value":[0.5601810216903687,0.6915689706802368,0.1948850005865097]},{"type":"point","coords":[[[0.0,0.0]],[[0.6917794129335226,0.04352307157763775]],[[1.0899494026323766,0.13769263057225506]],[[1.3617392766851413,0.25976565978942234]],[[1.5588744608656857,0.40025093284207586]],[[1.7040645188428873,0.5536841258237046]],[[1.8092615002429326,0.7163373031855621]],[[1.8815349609335614,0.8853831464674229]],[[1.925442574676284,1.058521012958312]],[[1.9441368948595275,1.2337867905454143]],[[1.9399380264252326,1.4094474778927186]],[[1.914653480723275,1.583939110860917]],[[1.8697676125141682,1.755828659503944]],[[1.806559057368019,1.92378999925605]],[[1.7261761636263127,2.0865885420508916]],[[1.6296867616049762,2.243071394704303]],[[1.518111625637368,2.3921611452916114]],[[1.3924472138863109,2.5328520792545337]],[[1.2536811426060728,2.664208042685226]],[[1.102802603165116,2.785361425967052]],[[0.9408091730123798,2.8955129034036675]],[[0.7687109989474548,2.9939316706565973]],[[0.5875330280567389,3.07995599304075]],[[0.39831576299892946,3.1529939266569844]],[[0.2021148853438198,3.212524108710064]],[[-1.9708274009477227E-15,3.258096538021482]],[[-0.2069473091002781,3.289333284811588]],[[-0.4176359661578194,3.305929082331228]],[[-0.6309683192218971,3.307651763227591]],[[-0.8458433930709641,3.294342511552753]],[[-1.0611604046520313,3.265915907699775]],[[-1.2758224789413817,3.2223597487218747]],[[-1.4887405124731208,3.1637346307668635]],[[-1.6988371389410912,3.090173283964124]],[[-1.9050507568226642,3.001879653194965]],[[-2.106339583335284,2.8991277208754616]],[[-2.301685702532696,2.7822600702686824]],[[-2.4900990782069536,2.6516861899828634]],[[-2.670621504652859,2.5078805222493883]],[[-2.842330470398316,2.3513802593432693]],[[-3.0043429117998848,2.1827828941340677]],[[-3.155818835017109,2.0027435322551415]],[[-3.2959647863640247,1.811971974767164]],[[-3.4240371524307287,1.611229581477602]],[[-3.539345272701272,1.4013259262682343]],[[-3.641254348688333,1.1831152568825538]],[[-3.729188134876148,0.9574927726373025]],[[-3.802631398022834,0.7253907344494981]],[[-3.8611321326296473,0.4877744224133902]],[[-3.9043035216435875,0.24563795692144963]],[[-3.9318256327243257,-9.994978263436474E-15]],[[-3.94344684167858,-0.2481006458766743]],[[-3.938984975945049,-0.4976095237197073]],[[-3.918328172300219,-0.7474610745067081]],[[-3.8814354442481305,-0.9965832376674526]],[[-3.828336955853374,-1.2439020807731]],[[-3.759134000073243,-1.4883464394528254]],[[-3.6739986809389613,-1.7288525484708166]],[[-3.5731733002235564,-1.9643686448889088]],[[-3.456969450511435,-2.1938595243151626]],[[-3.32576681784801,-2.4163110313956553]],[[-3.1800116983925473,-2.6307344659444585]],[[-3.0202152347196107,-2.8361708864239836]],[[-2.846951378609633,-3.031695292882838]],[[-2.6608545883330055,-3.2164206719292707]],[[-2.462617269560347,-3.3895018868629725]],[[-2.2529869701200926,-3.550139396704015]],[[-2.032763339869077,-3.6975827885423813]],[[-1.8027948679384784,-3.831134108381943]],[[-1.5639754105623953,-3.9501509764656126]],[[-1.3172405235858713,-4.05404947394037]],[[-1.063563614579855,-4.142306788648287]],[[-0.8039519302591153,-4.214463608808599]],[[-0.5394423956025249,-4.270126254382325]],[[-0.2710973217105793,-4.3089685369805935]],[[-7.955428084713571E-16,-4.330733340286331]],[[0.27274979917243874,-4.335233914101621]],[[0.5460404049471486,-4.322354876305294]],[[0.8187528826090366,-4.292052918202205]],[[1.089765709330429,-4.244357209962287]],[[1.3579594697103974,-4.179369504078955]],[[1.6222215517061045,-4.097263936017481]],[[1.8814508235265999,-3.9982865224697552]],[[2.134562272114355,-3.8827543588769697]],[[2.380491583974606,-3.7510545191213978]],[[2.61819964932665,-3.603642661517196]],[[2.846676970843855,-3.4410413464432787]],[[3.064947958619016,-3.263838072153547]],[[3.2720750934374503,-3.0726830364664073]],[[3.4671629409600127,-2.868286633171672]],[[3.6493620000099054,-2.6514166930939274]],[[3.8178723688185108,-2.422895480812848]],[[3.9719472138136154,-2.1835964590581787]],[[4.110896026325601,-1.9344408337662404]],[[4.234087653440053,-1.6763938937015703]],[[4.340953090135475,-1.4104611594081495]],[[4.430988020808651,-1.1376843570558628]],[[4.503755099303757,-0.8591372334861235]],[[4.558885957620502,-0.5759212294329276]],[[4.596082934577107,-0.28916102849913733]]]}],"extent":{"xmin":-16.507075688537455,"xmax":28.139725433725562,"ymin":-21.63892290061963,"ymax":9.70357288157268}}
);
    */
}
