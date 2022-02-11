const { strict: assert } = require('assert')
const masynco = require('../masynco.cjs')
const masyncoTest = require('../masynco-test.cjs')

console.log('')
console.log('---')
console.log('Verifying require(masynco)')
console.log('---')

;(async () =>
  masyncoTest({ masynco, assert })
)()
