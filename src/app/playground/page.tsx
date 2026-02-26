"use client"

import dynamic from 'next/dynamic'
import React from 'react'

const CodeEditor = dynamic(
  () => import("@/modules/playground/components/CodeMirrorEditor/components/editor/playGEditor"),
  { ssr: false }
)

const Playground = () => {
  return (
    <div>
        <h1>My Editor</h1>
      <CodeEditor/>
    </div>
  )
}

export default Playground
