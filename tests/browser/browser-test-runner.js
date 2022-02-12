import http from 'http'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import handler from 'serve-handler'
import execSh from 'exec-sh'

const exec = execSh.promise
const _dirname = dirname(fileURLToPath(import.meta.url))

const defaultChromePath = process.platform === 'darwin'
  ? '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
  : '/usr/bin/chrome'

const {
  CHROME_PATH: chromePath = defaultChromePath,
} = process.env

const server = http.createServer((req, res) =>
  handler(req, res, {
    directoryListing: false,
    symlinks: true,
    public: _dirname,
  })
)

// test web server props
const port = 3000
const testPage = 'masynco-test.html'
const url = `http://localhost:${port}/${testPage}`

// start test web server and render test page in headless chrome
server.listen(port, async () => {
  console.log(`Started test web server at '${url}'`)
  console.log(`Rendering '${url}' in headless chrome`)

  const cmd = `"${chromePath}" --headless --disable-gpu --dump-dom ${url}`
  const { stdout, stderr } = await exec(cmd, true)

  // stop web server after rendering page
  server.close()

  // extract and validate test results from rendered page
  let testLog
  try {
    testLog = extractTestLog(stdout)
    const testResult = extractTestResult(stdout)
    if (testResult !== 'SUCCESS') {
      throw new Error(`Browser tests failed with result: '${testResult}'`)
    }
  } catch (e) {
    console.error(stderr)
    throw e
  }

  console.log('\nTests passed! See the log:\n', testLog)
})

function extractTestResult (pageHtml) {
  return pageHtml
    .match(/<div id="testresult">(.+)</ig)[0]
    .match(/>(.+)</)[1]
}

function extractTestLog (pageHtml) {
  const startMarker = '<!-- start test log -->'
  const endMarker = '<!-- end test log -->'
  const p1 = pageHtml.indexOf(startMarker)
  const p2 = pageHtml.indexOf(endMarker)
  if (!p1 || !p2) throw new Error('No test result found')
  return pageHtml.substring(p1 + startMarker.length, p2)
}

