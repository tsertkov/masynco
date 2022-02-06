// massive asyncronyous operations
export default async function masynco (o, fn, limit = null) {
  if (Array.isArray(o)) {
    return limit
      ? Promise.all(o.map((e, i, a) => limit(() => fn(e, i, a))))
      : Promise.all(o.map(fn))
  }

  const f = processKvFn(fn)
  return (
    await Promise.all(
      limit
        ? Object.keys(o).map(k => limit(() => f(k, o)))
        : Object.keys(o).map(k => f(k, o))
    )
  ).reduce((a, c) => Object.assign(a, c), {})
}

function processKvFn (fn) {
  return fn[Symbol.toStringTag] === 'AsyncFunction'
    ? (k, o) => fn(o[k], k, o).then(v => normalizeKvResponse(v, k))
    : (k, o) => normalizeKvResponse(fn(o[k], k, o), k)
}

function normalizeKvResponse (v, k) {
  return { [ k ] : v }
}

