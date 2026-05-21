'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import SvgIcon from './SvgIcon'
import styles from './CommandPalette.module.css'

export const CommandPalette = ({ open, onClose, items = [] }) => {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return items
    return items
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (it) =>
            it.label.toLowerCase().includes(q) ||
            it.keywords?.some((k) => k.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.items.length > 0)
  }, [items, query])

  const flat = useMemo(() => filtered.flatMap((g) => g.items), [filtered])

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[activeIndex]) {
        flat[activeIndex].onSelect?.()
        onClose?.()
      }
    } else if (e.key === 'Escape') {
      onClose?.()
    }
  }

  let flatIndex = 0

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className={styles.palette} role="dialog" aria-modal="true" aria-label="Command palette">
        <div className={styles.search}>
          <SvgIcon id="i-search" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
            onKeyDown={handleKey}
            className={styles.input}
            autoComplete="off"
          />
          <kbd className={styles.esc}>esc</kbd>
        </div>
        <div className={styles.list} ref={listRef}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>No results for &ldquo;{query}&rdquo;</div>
          ) : (
            filtered.map((group) => (
              <div key={group.label} className={styles.group}>
                {group.label && <div className={styles.groupLabel}>{group.label}</div>}
                {group.items.map((item) => {
                  const idx = flatIndex++
                  const isActive = idx === activeIndex
                  return (
                    <button
                      key={item.id ?? item.label}
                      type="button"
                      className={[styles.item, isActive && styles.active].filter(Boolean).join(' ')}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => { item.onSelect?.(); onClose?.() }}
                      tabIndex={-1}
                    >
                      {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                      <span className={styles.itemLabel}>{item.label}</span>
                      {item.shortcut && <kbd className={styles.shortcut}>{item.shortcut}</kbd>}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CommandPalette
