class QueuedFetch<T> {
  url: string
  options: RequestInit | undefined

  attempt: number

  promise: Promise<T>
  resolve!: (value: T | PromiseLike<T>) => void
  reject!: (reason?: any) => void

  constructor(url: string, options: RequestInit | undefined) {
    this.url = url
    this.options = options

    this.attempt = 1

    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export default class RateLimiter {
  readonly maxAttempts = 3
  readonly rateLimitPolicyRegex = /^\s*(\d+)\s*;\s*w\s*=\s*(\d+)\s*/

  debug: boolean

  queue: QueuedFetch<any>[]

  policySet: boolean
  requestLimit: number
  waitMs: number
  nextWindow: number

  timeoutId: number

  BoundSendFetches: () => void

  constructor() {
    this.debug = true

    this.queue = []

    this.policySet = false
    this.requestLimit = 1
    this.waitMs = 1000
    this.nextWindow = 0

    this.timeoutId = 0

    this.BoundSendFetches = this.SendFetches.bind(this)
  }

  async Fetch<T>(url: string, options: RequestInit | undefined): Promise<T> {
    const queuedFetch = new QueuedFetch<T>(url, options)
    this.queue.push(queuedFetch)
    this.ScheduleSend()
    return queuedFetch.promise
  }

  private trace(message?: any, ...optionalParams: any[]) {
    if (this.debug) console.debug(message, ...optionalParams)
  }

  private async DoFetch(queuedFetch: QueuedFetch<any>) {
    let result: Awaited<any>
    const response = await fetch(queuedFetch.url, queuedFetch.options)
    if (!this.policySet) this.UpdateRateLimitPolicy(response.headers)

    if (response.ok) {
      try {
        result = await response.json()
        queuedFetch.resolve(result)
        return
      } catch (ex) {
        queuedFetch.reject(ex)
        throw ex
      }
    } else {
      if (queuedFetch.attempt <= this.maxAttempts) {
        this.queue.unshift(queuedFetch)
        this.ScheduleSend()
        if (response.status !== 429) queuedFetch.attempt += 1
        else console.warn(`Throttled! ${queuedFetch.options?.method || 'GET'} ${queuedFetch.url}`)
        return
      } else {
        const ex = await this.GetError(queuedFetch, response)
        queuedFetch.reject(ex)
        throw ex
      }
    }
  }

  private async GetError(queuedFetch: QueuedFetch<any>, response: Response) {
    let body: string = ''
    try {
      body = await response.text()
    } catch {
      /* empty */
    }

    const ex = new Error(
      `${queuedFetch.options?.method || 'GET'} ${queuedFetch.url} failed: ${response.status} ${
        response.statusText
      } ${body}`,
    )
    return ex
  }

  private UpdateRateLimitPolicy(headers: Headers) {
    const rateLimitPolicy = headers.get('ratelimit-policy')
    if (rateLimitPolicy === null) return

    const match = rateLimitPolicy.match(this.rateLimitPolicyRegex)
    if (match === null || match.length !== 3) return

    this.policySet = true
    this.requestLimit = Number.parseInt(match[1])
    this.waitMs = Number.parseInt(match[2]) * 1000
  }

  private ScheduleSend() {
    if (this.timeoutId || this.queue.length === 0) return

    const time = Math.max(0, this.nextWindow - performance.now())
    this.trace(`Waiting ${time}ms`)
    this.timeoutId = window.setTimeout(this.BoundSendFetches, time)
  }

  private SendFetches() {
    this.timeoutId = 0
    const fetches = this.queue.splice(0, this.requestLimit)
    this.trace(`${performance.now()} Sending ${fetches.length} fetches`)
    fetches.forEach((x, i) => this.trace(`  ${i}: ${x.options?.method || 'GET'} ${x.url}`))
    fetches.map((x) => this.DoFetch(x))
    this.nextWindow = performance.now() + this.waitMs
    if (this.queue.length > 0) this.ScheduleSend()
  }
}
