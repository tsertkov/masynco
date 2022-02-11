// test masynco
export default async function masyncoTest ({
  masynco,
  logFn = null,
}) {
  // process is expected to be defined when logFn in not passed (nodejs env)
  const log = logFn
    ? logFn
    : process.stdout.write.bind(process.stdout)

  // simple assert that works in node and browser
  const assert = (received, expected) => {
    const sr = JSON.stringify(received, null, 2)
    const se = JSON.stringify(expected, null, 2)
    const eDetails = `received: ${sr}\nexpected: ${se}\n`
    const eMsg = 'Received value is not the same as expected!'
    const eFullMsg = `${eMsg}\n${eDetails}`
    const err = new Error(eMsg)

    if (typeof received !== typeof expected) {
      log(eFullMsg)
      throw err
    }

    if (typeof received !== 'object') {
      if (received === expected) return
      log(eFullMsg)
      throw err
    }

    if (sr !== se) {
      log(eFullMsg)
      throw err
    }
  }

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

      log(`Should ${testName} ... `)
      const results = await Promise.all(mapFns.map(fn => masynco(input, fn, limit)))
      results.forEach(result => assert(result, expected))
      log('OK\n')
    }
  }

  log('Executing masynco tests:\n')
  await runTests(testData)

  // test limit
  let limitCallCount = 0
  const limit = (fn) => fn(limitCallCount++)

  log('\nExecuting masynco tests with limit:\n')
  await runTests(testData, limit)

  const expectedLimitCallCount = 18
  log(`Limit expected to be called ${expectedLimitCallCount} times ... `)
  assert(limitCallCount, expectedLimitCallCount)
  log('OK\n')
}

