export default function TabBar({ tabs, active, onChange }) {
  return (
    <nav role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={t.id === active} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </nav>
  )
}
