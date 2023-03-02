# Options
## Coords
### Description
Coordinate pairs are arrays with two entries, the first being used for the x-axis and the second one for the y-axis.
However, when specified within a primitive, each pair of coordinates is enclosed within another array.
This is for specification, whether the coordinate values should be treated as absolute or rather as relative values. So if a coord array only contains a pair of coordinates, they are being treated as absolute values.
If however, the first value of the array is null, then the second entry is being treated as a pair of relative coordinates. Those have values between 0 and 1 and specify the position scaled with the bounding box. 0 being the minimum and 1 being the maximum.

### Examples
Simple example for points with absolute coordinates
```
{
	type: "point",
	coords: [[[0, 0]], [[1, 1]], [[2, 2]], [[3.5, 3.5]]],
}
```

Simple example for a graphics complex with relative coordinates
```
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
}
```

## Filling
### Description
This option can be given to point and line primitives. It then draws lines for points or an area for lines in order to generate a 'filling'.
Possible types of fillings are:
- 'top': Until the heighest y-coordinate
- 'bottom': Until the lowest y-coordinate
- 'axis': Until the axis
- '+infinity': Until positive infinity
- '-infinity': Until negative infinity

### Examples
Simple example for points with filling
```
{
	type: "point",
	color: [0.7, 1.0, 0.0],
	coords: [[[0, 0]], [[1, 1]], [[2, 2]], [[3.5, 3.5]]],
	opacity: 0.5,
	pointSize: 0.005,
	filling: "top",
}
```

Simple example for lines with filling
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
	filling: "axis",
}
```