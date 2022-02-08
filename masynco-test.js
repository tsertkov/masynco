// test masynco
export default async function masyncoTest (masynco, assert) {
  // differnt types of map functions
  const mapSync = (v) => `processed-${v}`
  const mapAsync = async (v) => mapSync(v)
  const mapKvSync = (v, k) => mapSync(`${v}-${k}`)
  const mapKvAsync = async (v, k) => mapKvSync(v, k)

  // test data input and expectations
  const testData = {
    'handle empty array': [
      [],
      [ mapSync, mapAsync ],
      [],
    ],
    'handle single item array': [
      [ 'i1' ],
      [ mapSync, mapAsync ],
      [ 'processed-i1' ],
    ],
    'handle multiple items array': [
      [ 'i1', 'i2' ],
      [ mapSync, mapAsync ],
      [ 'processed-i1', 'processed-i2' ],
    ],
    'handle empty object': [
      {},
      [ mapSync, mapAsync, mapKvSync, mapKvAsync ],
      {},
    ],
    'handle single item object': [
      { 'k1': 'v1' },
      [ mapSync, mapAsync ],
      { 'k1': 'processed-v1' },
    ],
    'handle multiple items object': [
      { 'k1': 'v1', 'k2': 'v2' },
      [ mapSync, mapAsync ],
      { 'k1': 'processed-v1', 'k2': 'processed-v2' },
    ],
    'handle single item object (keys)': [
      { 'k1': 'v1' },
      [ mapKvSync, mapKvAsync ],
      { 'k1': 'processed-v1-k1' },
    ],
    'handle multiple items object (keys)': [
      { 'k1': 'v1', 'k2': 'v2' },
      [ mapKvSync, mapKvAsync ],
      { 'k1': 'processed-v1-k1', 'k2': 'processed-v2-k2' },
    ],
  }

  async function runTests (testData, limit = null) {
    for (const testName of Object.keys(testData)) {
      const [
        input,
        mapFns,
        expected,
      ] = testData[testName]

      process.stdout.write(`Should ${testName} ... `)
      const results = await Promise.all(mapFns.map(fn => masynco(input, fn, limit)))
      results.forEach(result => assert.deepEqual(result, expected))
      process.stdout.write('OK\n')
    }
  }

  console.log('Executing masynco tests:')
  await runTests(testData)

  // test limit
  let limitCallCount = 0
  const limit = (fn) => fn(limitCallCount++)

  console.log('\nExecuting masynco tests with limit:')
  await runTests(testData, limit)

  const expectedLimitCallCount = 18
  process.stdout.write(`Limit expected to be called ${expectedLimitCallCount} times ... `)
  assert.equal(limitCallCount, expectedLimitCallCount)
  process.stdout.write('OK\n')
}
