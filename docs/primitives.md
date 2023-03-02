### Primitives

These are the Graphic Objects, that can be drawn. More information about unexplained properties of these primitives can be found in options.md.

## Point
# Properties
- 'coords' (type: double[][][2])
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'filling' (type: String)
# Example

## Circle
- 'coords' (type: double[][][2]) Coordinates of the middle points of the circles
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'radius1' (type: double) Radius for the x-axis
- 'radius2' (type: double) Radius for the y-axis
- 'angle1' (type: double) Starting angle, from which the circle should be drawn, given in radians
- 'angle2' (type: double) Ending angle, until which the circle should be drawn, given in radians
# Properties

# Example

## Disk
Same as a circle, but filled
# Properties
- 'coords' (type: double[][][2]) Coordinates of the middle points of the circles
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'radius1' (type: double) Radius for the x-axis
- 'radius2' (type: double) Radius for the y-axis
- 'angle1' (type: double) Starting angle, from which the circle should be drawn, given in radians
- 'angle2' (type: double) Ending angle, until which the circle should be drawn, given in radians

# Example

## Line
# Properties
- 'coords' (type: double[][][2]) The line goes through all coordinates
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'filling' (type: String)
- 'thickness' (type: double)

# Example

## Arrow 
# Properties
- 'coords' (type: double[][][2]) The arrow goes through all coordinates, arrow head pointing to the last coordinate
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'filling' (type: String)
- 'thickness' (type: double)

# Example

## Polygon
- 'coords' (type: double[][][2]) The polygon goes through all coordinates in the given order
- 'color' (type: double[3])
- 'opacity' (type: double)
# Properties

# Example

## Rectangle
- 'coords' (type: double[2][][2]) The bottom left and top right coordinates of the rectangle 
- 'color' (type: double[3])
- 'opacity' (type: double)
# Properties

# Example

## Text
# Properties
- 'coords' (type: double[][][2]) Array of coordinates corresponding to the texts
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'texts' (type: String[]) Array of texts to be rendered
- 'fontSize' (type: int) How large the text should be in pixels

# Example

## Graphics Complex
This is not technically a graphic object. However, this construct can be used to simplify multiple graphic objects with repeating coordinates. The coordinates of elements contained in the graphics complex are being set with the attribute 'positions' instead of 'coords', which uses indices to access the coordinates stored in the graphics complex primitive
# Properties
- 'coords' (type: double[][][2]) Array of all coordinates used within the graphics complex
- 'data' (type: json) Json with all the primitives contained within the graphics complex
# Example
`{
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
  }`

## Option
This is not technically a graphic object. However, this construct can be used to simplify multiple graphic objects with repeating properties. When a property is set with an option, it is used for all following primitives, which use that property, unless it is locally overwritten by that primitive. 
# Properties
- 'option' (type: String) Name of the attribute, the option is set for
- 'value' (type: *) Value for the given attribute

# Example