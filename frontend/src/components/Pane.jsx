import { memo } from 'react'

// Renders a playground's static markup once; its module wires up behaviour on mount.
export default memo(function Pane({ html, active }) {
  return <section className="pane" hidden={!active} dangerouslySetInnerHTML={{ __html: html }} />
})
