# All types of Object in JavaScript and whether we can implement them
## 1. Overview
ECMAScript is an object-oriented language for performing computations and manipulating computational objects within a host environment.

ECMAScript is object-based: basic language and host facilities are provided by objects.An ECMAScript program is a cluster of communicating objects.

In ECMAScript, an object is a collection of zero  or more properties each with attributes that determine how each properties can be used.

A function is a callable object.

Ways to create an object:
- Via a literal notation
- Via constructors
    - Create objects
    - Then execute code to initializes all or part of them by assigning initial values to their properties

## 2. Categories of objects

ECMAScript defines a collection of built-in objects:
- The global object
- Objects that are fundamental to the runtime semantics of the language
    - Object
    - Function
    - Boolean
    - Symbol
    - Error
- Objects that represent and manipulate numeric values
    - Math
    - Number
    - Date
- Text processing objects
    - String
    - RegExp
- Objects that are indexed collections of values
    - Array
    - nine different kinds of Typed Arrays whose elements all have a specific numeric data representaion
- Keyed collections
    - Map
    - Set
- Objects supporting structured data
    - JSON
    - ArrayBuffer
    - SharedArrayBuffer
    - Dataview
- Objects supporting control abstractions
    - Generator functions
    - Promise
- Reflection objects
    - Reflect
    - Proxy

## 3. About manually creating

Among all kinds of objects, there are some types that we can't create or simulate on our own:

### The global object

It is created before control enters any execution context, so when our JavaScript code runs, the global object has already existed there. Additionally, the globel object has neither [[Construct]] nor [[Call]] internal method, so we are unable to invoke it as a function.

### Object object

It is the intrinsic object, and is also the root of all the objects, we cannot implement it again because the new product is also a child of Object object.

### Function

Don't even think about it. It will be like implement a new JavaScript engine using JavaScript Engine.

### Error

There is no way we build an Object whose instance can make the browser throw an error, that is out of our control.

### Date

Time is always hard to handle, even in JavaScript.

## 4. Summary

You know,I'm not pro on JavaScript. The list above is only a part of objects that we can't implement manually, I believe. And with the later deeper understanding of JavaScript, I might find  new elelement that can push into the list, or remove some out.

What the elements in that list have in common is that, the data they contain are quite diffcult to produce, describe or express with JavaScript language. They spread their roots deeply down in runtime environment, and that is the mineral resource that we can't reach.