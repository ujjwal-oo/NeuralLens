import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import TabBar from './components/TabBar.jsx'
import Pane from './components/Pane.jsx'
import { TABS } from './data/tabs.js'
import { mounts } from './modules/index.js'
import { store } from './lib/store.js'

export default function App() {
  const [tab, setTab] = useState('ann')
  useEffect(() => { store.tab = tab }, [tab])

  // Wire up every playground once, then run one animation loop for the visible one.
  useEffect(() => {
    const frames = {}
    TABS.forEach((t) => { frames[t.id] = mounts[t.id]() })
    let raf
    const loop = () => { frames[store.tab]?.(); raf = requestAnimationFrame(loop) }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <Header />
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <main>{TABS.map((t) => <Pane key={t.id} html={t.html} active={t.id === tab} />)}</main>
    </>
  )
}
