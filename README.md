# masynco

> massive async operations

Minimal async Map/Reduce helper with pluggable limit to handle massive amount of asynchronous operations.

## Usage

```javascript
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
})()
```

Optionally `limit` function can be passed for concurrency control:

```javascript
import masynco from 'masynco'
import plimit from 'p-limit'

;(async () => {
  const limit = plimit(3)
  const fn = async (num) => num + 1
    
  const o = await masynco({ 'k1': 'v1', 'k2': 'v2' }, fn, limit)
  console.log(o) // { k1: 'v11', k2: 'v21' }
})()

```
