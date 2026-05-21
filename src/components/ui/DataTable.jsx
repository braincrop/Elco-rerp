'use client'
import { useState, useMemo } from 'react'
import SvgIcon from './SvgIcon'
import styles from './DataTable.module.css'

const SORT_NONE = null
const SORT_ASC  = 'asc'
const SORT_DESC = 'desc'

export const DataTable = ({
  columns = [],
  data = [],
  onRowClick,
  selectable = false,
  loading = false,
  emptyText = 'No results',
  rowKey = 'id',
  density = 'normal',
  selectedKeys,
  onSelectionChange,
}) => {
  const [sort, setSort] = useState({ key: SORT_NONE, dir: SORT_ASC })

  const internalSelection = useState(new Set())
  const selected = selectedKeys !== undefined ? selectedKeys : internalSelection[0]
  const setSelected = selectedKeys !== undefined ? onSelectionChange : internalSelection[1]

  const sorted = useMemo(() => {
    if (!sort.key) return data
    const col = columns.find((c) => c.key === sort.key)
    if (!col?.sortable) return data
    return [...data].sort((a, b) => {
      const va = a[sort.key] ?? ''
      const vb = b[sort.key] ?? ''
      const cmp = typeof va === 'number'
        ? va - vb
        : String(va).localeCompare(String(vb))
      return sort.dir === SORT_ASC ? cmp : -cmp
    })
  }, [data, sort, columns])

  const allKeys = useMemo(() => new Set(data.map((r) => r[rowKey])), [data, rowKey])
  const allSelected = allKeys.size > 0 && [...allKeys].every((k) => selected.has(k))
  const someSelected = !allSelected && [...allKeys].some((k) => selected.has(k))

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : allKeys)
  }

  const toggleRow = (key) => {
    const next = new Set(selected)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setSelected(next)
  }

  const cycleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: SORT_ASC }
      if (prev.dir === SORT_ASC) return { key, dir: SORT_DESC }
      return { key: SORT_NONE, dir: SORT_ASC }
    })
  }

  return (
    <div className={styles.wrap}>
      <table className={[styles.table, styles[density]].join(' ')}>
        <thead>
          <tr>
            {selectable && (
              <th className={styles.checkCol}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={allSelected}
                  ref={(el) => el && (el.indeterminate = someSelected)}
                  onChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  styles.th,
                  col.sortable && styles.sortable,
                  col.align === 'right' && styles.right,
                  col.width && styles.fixed,
                ].filter(Boolean).join(' ')}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable ? () => cycleSort(col.key) : undefined}
              >
                <span className={styles.thInner}>
                  {col.label}
                  {col.sortable && (
                    <span className={styles.sortIcon}>
                      {sort.key === col.key ? (
                        <SvgIcon id={sort.dir === SORT_ASC ? 'i-up' : 'i-down'} className="ic-xs" />
                      ) : (
                        <SvgIcon id="i-sort" className="ic-xs" />
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.empty}>
                <span className={styles.loader} />
              </td>
            </tr>
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.empty}>
                {emptyText}
              </td>
            </tr>
          ) : (
            sorted.map((row) => {
              const key = row[rowKey]
              const isSelected = selected.has(key)
              return (
                <tr
                  key={key}
                  className={[
                    onRowClick && styles.clickable,
                    isSelected && styles.rowSelected,
                  ].filter(Boolean).join(' ')}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectable && (
                    <td className={styles.checkCol} onClick={(e) => { e.stopPropagation(); toggleRow(key) }}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                        aria-label="Select row"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={[styles.td, col.align === 'right' && styles.right].filter(Boolean).join(' ')}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
