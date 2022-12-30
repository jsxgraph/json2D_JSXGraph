### Documentation
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
	- 'scaling' (type: String[2]) See scaling.md for more informations


## drawGraphics2d
# Arguments
The main function for rendering those json objects is 'drawGraphics2d', which takes the following arguments:
- 'id' (type: String) The id of the div element, on which the graphics should be rendered
- 'json' (type: object) Look above for more information about the properties of the json object

The function has no return value.

# Examples


## createGraphics2dDiv
# Arguments
Alternatively 'createGraphics2dDiv' can be used to generate an html div element.
This is necessary, if the aspect ratio of the JSXGraph window needs to be customized.
The function takes the following properties:
- 'json' (type: object) Look above for more information about the properties of the json object
- 'maxWidth' (type: int) The maximal width the generated div can take
- 'maxHeight' (type: int) The maximal height the generated div can take

It then returns a div element, which can be included in the html.

# Examples
