// Preview protocol: postMessage-based token sync between editor (parent) and preview (iframe)
// Architecture: PreviewSender (parent) ↔ PreviewReceiver (iframe) via typed messages

export type TokenMap = Record<string, string>

export type PreviewMessage =
  | { type: 'UPDATE_TOKENS'; tokens: TokenMap; messageId: string }
  | { type: 'RESET_TOKENS'; messageId: string }
  | { type: 'PING'; messageId: string }

export type PreviewResponse =
  | { type: 'READY' }
  | { type: 'ACK'; messageId: string; durationMs: number }
  | { type: 'ERROR'; messageId: string; error: string }

// ─── Utilities ────────────────────────────────────────────────────────────────

export function diffTokens(prev: TokenMap, next: TokenMap): TokenMap {
  const diff: TokenMap = {}
  for (const key in next) {
    if (next[key] !== prev[key]) diff[key] = next[key]
  }
  // Include removed tokens as empty string
  for (const key in prev) {
    if (!(key in next)) diff[key] = ''
  }
  return diff
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ─── PreviewSender (parent/editor side) ──────────────────────────────────────

interface PendingAck {
  resolve: (durationMs: number) => void
  reject: (error: string) => void
  timeoutId: ReturnType<typeof setTimeout>
}

export class PreviewSender {
  private iframe: HTMLIFrameElement
  private targetOrigin: string
  private pendingAcks = new Map<string, PendingAck>()
  private readyPromise: Promise<void>
  private readyResolve!: () => void
  private messageHandler: (event: MessageEvent) => void

  constructor(iframe: HTMLIFrameElement, targetOrigin = '*') {
    this.iframe = iframe
    this.targetOrigin = targetOrigin

    this.readyPromise = new Promise((resolve) => {
      this.readyResolve = resolve
    })

    this.messageHandler = (event: MessageEvent) => {
      if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) return
      if (event.source !== this.iframe.contentWindow) return
      this.handleResponse(event.data as PreviewResponse)
    }

    window.addEventListener('message', this.messageHandler)
  }

  private handleResponse(response: PreviewResponse) {
    if (response.type === 'READY') {
      this.readyResolve()
      return
    }

    const pending = this.pendingAcks.get(response.messageId)
    if (!pending) return

    clearTimeout(pending.timeoutId)
    this.pendingAcks.delete(response.messageId)

    if (response.type === 'ACK') {
      pending.resolve(response.durationMs)
    } else if (response.type === 'ERROR') {
      pending.reject(response.error)
    }
  }

  waitForReady(): Promise<void> {
    return this.readyPromise
  }

  private sendMessage(message: PreviewMessage, timeoutMs = 2000): Promise<number> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingAcks.delete(message.messageId)
        reject(new Error(`Message ${message.messageId} timed out after ${timeoutMs}ms`))
      }, timeoutMs)

      this.pendingAcks.set(message.messageId, { resolve, reject, timeoutId })
      this.iframe.contentWindow?.postMessage(message, this.targetOrigin)
    })
  }

  updateTokens(tokens: TokenMap): Promise<number> {
    return this.sendMessage({ type: 'UPDATE_TOKENS', tokens, messageId: generateId() })
  }

  updateTokensDiff(prev: TokenMap, next: TokenMap): Promise<number> {
    const diff = diffTokens(prev, next)
    if (Object.keys(diff).length === 0) return Promise.resolve(0)
    return this.updateTokens(diff)
  }

  resetTokens(): Promise<number> {
    return this.sendMessage({ type: 'RESET_TOKENS', messageId: generateId() })
  }

  ping(): Promise<number> {
    return this.sendMessage({ type: 'PING', messageId: generateId() })
  }

  dispose() {
    window.removeEventListener('message', this.messageHandler)
    for (const [, pending] of this.pendingAcks) {
      clearTimeout(pending.timeoutId)
      pending.reject('PreviewSender disposed')
    }
    this.pendingAcks.clear()
  }
}

// ─── PreviewReceiver (iframe side) ───────────────────────────────────────────

export class PreviewReceiver {
  private targetOrigin: string
  private pendingTokens: TokenMap = {}
  private rafId: number | null = null
  private messageHandler: (event: MessageEvent) => void

  constructor(targetOrigin = '*') {
    this.targetOrigin = targetOrigin

    this.messageHandler = (event: MessageEvent) => {
      if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) return
      this.handleMessage(event)
    }
  }

  private handleMessage(event: MessageEvent) {
    const message = event.data as PreviewMessage
    const startTime = performance.now()

    if (message.type === 'UPDATE_TOKENS') {
      Object.assign(this.pendingTokens, message.tokens)
      this.scheduleApply()
      this.sendResponse(event, { type: 'ACK', messageId: message.messageId, durationMs: performance.now() - startTime })
    } else if (message.type === 'RESET_TOKENS') {
      this.pendingTokens = {}
      this.cancelApply()
      // Remove all CSS vars set by this receiver
      const style = document.documentElement.style
      const toRemove: string[] = []
      for (let i = 0; i < style.length; i++) {
        const prop = style.item(i)
        if (prop.startsWith('--')) toRemove.push(prop)
      }
      toRemove.forEach((prop) => style.removeProperty(prop))
      this.sendResponse(event, { type: 'ACK', messageId: message.messageId, durationMs: performance.now() - startTime })
    } else if (message.type === 'PING') {
      this.sendResponse(event, { type: 'ACK', messageId: message.messageId, durationMs: performance.now() - startTime })
    }
  }

  private sendResponse(event: MessageEvent, response: PreviewResponse) {
    const origin = this.targetOrigin !== '*' ? this.targetOrigin : event.origin
    ;(event.source as Window)?.postMessage(response, origin)
  }

  private scheduleApply() {
    if (this.rafId !== null) return
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null
      this.flushTokens()
    })
  }

  private cancelApply() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  private flushTokens() {
    const style = document.documentElement.style
    for (const [key, value] of Object.entries(this.pendingTokens)) {
      if (value === '') {
        style.removeProperty(key)
      } else {
        style.setProperty(key, value)
      }
    }
    this.pendingTokens = {}
  }

  start() {
    window.addEventListener('message', this.messageHandler)
    // Signal readiness to parent
    if (window.parent !== window) {
      const origin = this.targetOrigin !== '*' ? this.targetOrigin : '*'
      window.parent.postMessage({ type: 'READY' } satisfies PreviewResponse, origin)
    }
  }

  dispose() {
    window.removeEventListener('message', this.messageHandler)
    this.cancelApply()
  }
}
