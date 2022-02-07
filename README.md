# masynco

> massive async operations

Minimal async Map/Reduce helper with pluggable limit to handle massive amount of asynchronous operations.

![main ci status](https://github.com/tsertkov/masynco/actions/workflows/main.yml/badge.svg?branch=main)

## Usage

```javascript
// const masynco = require('masynco') // cjs and mjs are supported
import masynco from 'masynco'

;(async () => {
  // supports async and regular functions
  const fn = async (num) => num + 1
  
  // supports async array mapping
  const a = await masynco([1, 2, 3], fn)
  console.log(a) // [ 2, 3, 4 ]
  
  // supports async object mapping
  const o = await masynco({ 'k1': 'v1', 'k2': 'v2' }, fn)
  console.log(o) // { k1: 'v11', k2: 'v21' }

  // supports regular (non-async) functions also
  const fnSync = (num) => num + 1
  const o1 = await masynco({ 'k1': 'v1', 'k2': 'v2' }, fnSync)
  console.log(o1) // { k1: 'v11', k2: 'v21' }
})()
```

Optionally `limit` function can be passed for concurrency control:

```javascript
import masynco from 'masynco'
import plimit from 'p-limit'

;(async () => {
  const fn = async (num) => num + 1
  const o = await masynco({ 'k1': 'v1', 'k2': 'v2' }, fn, plimit(3))
  console.log(o) // { k1: 'v11', k2: 'v21' }
})()
```

## API

### async masynco(iterable, fn, limit = null)

Returns new output iterable created by processing each item with `fn` function.

#### iterable

Type: `object`, `array`

Array or object to iterate. For array iterable returned result is also array. Object will be returned for non-array iterables.

#### fn

Type: `function (value, key)`

Function that is called for every element of input iterable. It receives original `value` and `key` and returns new value that is inserted into output iterable.

#### limit

Type: `function`

Optionally use limit function for concurrency control. See `p-limit`.

## Why?

Single interface for applying regular and async map function to every item of input iterable and returning new iterable with original keys and mapped values.

" It saves my time, Al

