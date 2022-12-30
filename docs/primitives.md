### Primitives

These are the Graphic Objects, that can be drawn. More information about unexplained properties of these primitives can be found in options.md.

## Point
# Properties
- 'coords' (type: double[][][2])
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'filling' (type: String)
# Examples

## Circle
- 'coords' (type: double[][][2]) Coordinates of the middle points of the circles
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'radius1' (type: double)
# Properties

# Examples

## Disk
# Properties

# Examples

## Line
# Properties
- 'coords' (type: double[][][2]) The line goes through all coordinates, arrow head pointing to the last coordinate
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'filling' (type: String)
- 'thickness' (type: double)

# Examples

## Arrow 
# Properties
- 'coords' (type: double[][][2]) The arrow goes through all coordinates, arrow head pointing to the last coordinate
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'filling' (type: String)
- 'thickness' (type: double)

# Examples

## Polygon
- 'coords' (type: double[][][2]) The polygon goes through all coordinates in the given order
- 'color' (type: double[3])
- 'opacity' (type: double)
# Properties

# Examples

## Rectangle
- 'coords' (type: double[2][][2]) The bottom left and top right coordinates of the rectangle 
- 'color' (type: double[3])
- 'opacity' (type: double)
# Properties

# Examples

## Text
# Properties
- 'coords' (type: double[][][2]) Array of coordinates corresponding to the texts
- 'color' (type: double[3])
- 'opacity' (type: double)
- 'texts' (type: String[]) Array of texts to be rendered
- 'fontSize' (type: int) How large the text should be in pixels

# Examples

## Graphics Complex
This is not technically a graphic object. However, this construct can be used to simplify multiple graphic objects with repeating coordinates.
# Properties

# Examples

## Option
This is not technically a graphic object. However, this construct can be used to simplify multiple graphic objects with repeating properties. When a property is set with an option, it is used for all following primitives, which use that property, unless it is locally overwritten by that primitive. 
# Properties

# Examples