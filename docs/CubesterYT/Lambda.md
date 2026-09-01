# Lambda
This extension allows you to create and execute anonymous functions.

Lambda requires the compiler to be enabled.

## Creating a Function

Use the Lambda block to create a function from the blocks inside its branch:

```scratch
new function (arguments :: #FF894D array) :: #FF894D c-block
  say [Hello!] for (2) seconds
end
```

The branch does not run when the function is created. Instead, the block returns
an object containing the function. The function can be stored in a variable,
list, object, or any other place that accepts it.

## Executing a Function

Use the command version of the execute block when you only need to run the
function:

```scratch
execute {} with @addInput :: #FF894D
```

Use the reporter version when the function returns a value:

```scratch
(execute {} with @addInput :: #FF894D)
```

The reporter can be dropped anywhere an input is accepted. Use NitroBolt's
existing `return` block inside the function to provide its result:

```scratch
new function (arguments :: #FF894D array) :: #FF894D c-block
  return [Hello world!] :: custom cap
end
```

If the function finishes without returning a value, the reporter returns an
empty string. Trying to execute something that is not a function also does
nothing and returns an empty string.

## Function Arguments

The arrow buttons on an execute block add or remove arguments. Every supplied
argument is collected into one array for the function:

```scratch
execute {my function} with [one] [two] @delInput @addInput :: #FF894D
```

Inside the function, use the duplicatable arguments block to access that array:

```scratch
[arguments :: #FF894D]
```

You can drag the arguments block out of the Lambda block's array input and use
it anywhere inside the function. For example:

```scratch
new function (arguments :: #FF894D array) :: #FF894D c-block
  say (item (0) of (arguments :: #FF894D array) :: #5755D4) for (2) seconds
  return (item (1) of (arguments :: #FF894D array) :: #5755D4) :: custom cap
end
```

When this function is executed with `one` and `two`, it says `one` and returns
`two`. Arguments keep the same order as the inputs on the execute block. When
no arguments are supplied, the arguments block contains an empty array.

Outside a running Lambda function, the arguments block also reports an empty
array.
