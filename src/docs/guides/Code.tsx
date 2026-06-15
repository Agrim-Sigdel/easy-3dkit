import { useState } from 'react'

/** A copy-able code block used throughout the guides. */
export function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children)
    } catch {
      console.log(children)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="docs-codeblock">
      <button className="docs-codeblock-copy" onClick={copy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  )
}
