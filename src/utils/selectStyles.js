const v = (name) =>
  typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    : ''

export const getSelectStyles = () => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: v('--surface'),
    borderColor: state.isFocused ? v('--accent') : v('--line-2'),
    boxShadow: state.isFocused ? `0 0 0 3px ${v('--accent-2')}` : 'none',
    color: v('--ink'),
    fontSize: '13.5px',
    minHeight: '34px',
    borderRadius: v('--radius-sm'),
    ':hover': { borderColor: v('--line-2') },
  }),
  valueContainer: (base) => ({ ...base, padding: '2px 8px' }),
  input: (base) => ({ ...base, color: v('--ink'), margin: 0 }),
  placeholder: (base) => ({ ...base, color: v('--ink-4') }),
  singleValue: (base) => ({ ...base, color: v('--ink') }),
  menu: (base) => ({
    ...base,
    backgroundColor: v('--surface'),
    border: `1px solid ${v('--line-2')}`,
    boxShadow: v('--shadow-2'),
    borderRadius: v('--radius'),
    fontSize: '13.5px',
    zIndex: 500,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? v('--accent')
      : state.isFocused
      ? v('--surface-2')
      : 'transparent',
    color: state.isSelected ? '#fff' : v('--ink'),
    cursor: 'pointer',
    borderRadius: 6,
    ':active': { backgroundColor: v('--accent-2') },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: v('--surface-2'),
    borderRadius: 4,
  }),
  multiValueLabel: (base) => ({ ...base, color: v('--ink'), fontSize: '12px' }),
  multiValueRemove: (base) => ({
    ...base,
    color: v('--ink-3'),
    borderRadius: '0 4px 4px 0',
    ':hover': { backgroundColor: v('--bad-bg'), color: v('--bad') },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, color: v('--ink-4'), padding: '0 6px' }),
  clearIndicator: (base) => ({ ...base, color: v('--ink-4'), padding: '0 4px' }),
})
