import { strict as assert } from 'assert'
import masynco from '../masynco.js'
import masyncoTest from '../masynco-test.js'

console.log('')
console.log('---')
console.log('Verifying import masynco')
console.log('---')

;(async () =>
  await masyncoTest(masynco, assert)
)()
