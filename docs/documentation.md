# Documentation
Hello and welcome to the documentation for json2D_JSXGraph!
The goal of this project is to render json graphic objects onto a div element with the help of JSXGraph.


## JSON
The json object needs to have the following properties:
- 'elements' (type: object[]) See primitives.md for more informations
- 'extent' (type: object)
	- 'xmin' (type: double) Minimal x value to be included in the JSXGraph canvas
	- 'xmax' (type: double) Maximal x value to be included in the JSXGraph canvas
	- 'ymin' (type: double) Minimal y value to be included in the JSXGraph canvas
	- 'ymax' (type: double) Maximal y value to be included in the JSXGraph canvas
- 'axes' (type: object)
	- 'hasaxes' (type: boolean/boolean[2]) Whether both axes should be drawn, a boolean array can be used if only one axis should be drawn - default: 'false'
	- 'grid' (type: boolean) Whether a grid should be drawn - default: 'false'
	- 'scaling' (type: String[2]) The scaling which is used for setting the ticks of the axes. Possible options for the strings are:
		- "none" (default)
		- "log"
		- "log2"
		- "log10"


## drawGraphics2d
### Arguments
The main function for rendering those json objects is 'drawGraphics2d', which takes the following arguments:
- 'id' (type: String) The id of the div element, on which the graphics should be rendered
- 'json' (type: object) Look above for more information about the properties of the json object

The function has no return value.

### Examples
A simple example, which should make the basic structure of the json clearer:
```
drawGraphics2d("graphics2d", {
	elements: [
		{
			type: "circle",
			radius1: 2.0,
			radius2: 2.0,
			coords: [[[1.0, 1.0]]],
		},
	],
	extent: { xmin: -5.0, xmax: 5.0, ymin: -5.0, ymax: 5.0 },
	axes: { hasaxes: true},
});
```
A more elaborate example, which uses nearly every primitive and option:
```
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
		},
		{ option: "filling", value: "top" },
		{
			type: "point",
			color: [0.7, 1.0, 0.0],
			coords: [[[0, 0]], [[1, 1]], [[2, 2]], [[3.5, 3.5]]],
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
		{ option: "pointSize", value: 0.01 },
		{ option: "filling", value: "-infinity" },
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
	axes: { hasaxes: true, scaling: ["none", "log10"] },
});
```
More examples can be found in tests/graphicstest.html