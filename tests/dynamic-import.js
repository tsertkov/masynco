console.log('')
console.log('---')
console.log('Verifying await import(masynco)')
console.log('---')

;(async () => {
  const { strict: assert } = await import('assert')
  const { default: masynco } = await import('../masynco.js')
  const { default: masyncoTest } = await import('../masynco-test.js')

  return masyncoTest(masynco, assert)
})()
