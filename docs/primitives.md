#  Primitives

These are the Graphic Objects, that can be drawn. More information about unexplained properties of these primitives can be found in options.md.

##  Point
### Properties
- 'coords' (type: double[][2][2])
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'filling' (type: String)
- 'edgeForm' (type: json)
### Example
```
{
	type: "point",
	color: [0.7, 1.0, 0.0],
	coords: [[[0, 0]], [[1, 1]], [[2, 2]], [[3.5, 3.5]]],
	opacity: 0.5,
	pointSize: 0.005,
}
```

##  Circle
### Properties
- 'coords' (type: double[][2][2]) Coordinates of the middle points of the circles
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'radius1' (type: double) Radius for the x-axis
- 'radius2' (type: double) Radius for the y-axis
- 'angle1' (type: double) Starting angle, from which the circle should be drawn, given in radians
- 'angle2' (type: double) Ending angle, until which the circle should be drawn, given in radians
- 'edgeForm' (type: json)

### Example
```
{
	type: "circle",
	color: [0.3, 0.0, 0.8],
	opacity: 0.5,
	radius1: 2.0,
	radius2: 2.0,
	coords: [[[1.0, 0.0]]],
}
```
```
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
}
```

##  Disk
Same as a circle, but filled
### Properties
- 'coords' (type: double[][2][2]) Coordinates of the middle points of the circles
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'radius1' (type: double) Radius for the x-axis
- 'radius2' (type: double) Radius for the y-axis
- 'angle1' (type: double) Starting angle, from which the circle should be drawn, given in radians
- 'angle2' (type: double) Ending angle, until which the circle should be drawn, given in radians
- 'edgeForm' (type: json)

### Example
```
{
	type: "disk",
	color: [0.3, 0.0, 0.8],
	opacity: 0.5,
	radius1: 2.0,
	radius2: 2.0,
	coords: [[[1.0, 0.0]]],
}
```

##  Line
### Properties
- 'coords' (type: double[][2][2]) The line goes through all coordinates
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'filling' (type: String)
- 'thickness' (type: double)

### Example
```
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
}
```

##  Arrow 
### Properties
- 'coords' (type: double[][2][2]) The arrow goes through all coordinates, arrow head pointing to the last coordinate
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'filling' (type: String)
- 'thickness' (type: double)

### Example
```
{
	type: "arrow",
	color: [0.2, 0.0, 1.0],
	opacity: 1.0,
	coords: [[[0.0, 0.0]], [[-4.0, 3.0]]],
	thickness: 0.02,
}
```

##  Polygon
### Properties
- 'coords' (type: double[][2][2]) The polygon goes through all coordinates in the given order
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'edgeForm' (type: json)

### Example
```
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
}
```

##  Rectangle
### Properties
- 'coords' (type: double[2][][2]) The bottom left and top right coordinates of the rectangle 
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'edgeForm' (type: json)

### Example
```
{
	type: "rectangle",
	color: [0.0, 0.5, 1.0],
	opacity: 1.0,
	coords: [[[2.0, -5.0]], [[4.0, -2.0]]],
}
```

##  Text
### Properties
- 'coords' (type: double[][2][2]) Array of coordinates corresponding to the texts
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'texts' (type: String[]) Array of texts to be rendered
- 'fontSize' (type: int) How large the text should be in pixels

### Example
```
{
	type: "text",
	color: [0.5, 0.4, 0.1],
	fontSize: 40,
	opacity: 0.8,
	coords: [[[-5, -5]], [[5, 5]]],
	texts: ["Bottom left", "Top right"],
}
```
##  Graphics Complex
This is not technically a graphic object. However, this construct can be used to simplify multiple graphic objects with repeating coordinates. The coordinates of elements contained in the graphics complex are being set with the attribute 'positions' instead of 'coords', which uses indices to access the coordinates stored in the graphics complex primitive
### Properties
- 'coords' (type: double[][2][2]) Array of all coordinates used within the graphics complex
- 'data' (type: json) Json with all the primitives contained within the graphics complex
### Example
```
{
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
}
```

##  Option
This is not technically a graphic object. However, this construct can be used to simplify multiple graphic objects with repeating properties. When a property is set with an option, it is used for all following primitives, which use that property, unless it is locally overwritten by that primitive. 
### Properties
- 'option' (type: String) Name of the attribute, the option is set for
- 'value' (type: *) Value for the given attribute

### Example
```
{ option: "pointSize", value: 0.01 }
```