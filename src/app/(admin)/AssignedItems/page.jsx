'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allBranch, GetAllBranch } from '@/redux/slice/Branch/branchSlice'
import { allItemCategory, GetItemCategory } from '@/redux/slice/ItemCategory/ItemCategorySlice'
import ItemCategoryView from '@/components/ItemCategoryView/ItemCategoryView'
import CreateRestuarantItem from '@/components/CreateRestuarantItem/CreateRestuarantItem'
import DataTable from '@/components/ui/DataTable'
import Toolbar from '@/components/ui/Toolbar'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import SvgIcon from '@/components/ui/SvgIcon'

const COLUMNS = [
  { key: 'categoryName',     label: 'Category',      sortable: true },
  { key: 'itemCategoryId',   label: 'Category ID' },
  { key: 'itemSubCategoryID', label: 'Sub Cat. ID' },
  { key: 'comments',         label: 'Comments', render: (v) => v ?? '-' },
  {
    key: 'imagePath',
    label: 'Image',
    render: (v) => v
      ? <img src={v} alt="category" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
      : '-',
  },
]

export default function AssignedItemsPage() {
  const dispatch = useDispatch()
  const { itemCat, loading } = useSelector(allItemCategory)
  const { branch } = useSelector(allBranch)

  const [selectedBranchId, setSelectedBranchId] = useState(null)
  const [search, setSearch] = useState('')
  const [isViewMode, setIsViewMode] = useState(false)
  const [isItemCreate, setIsItemCreate] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => { dispatch(GetAllBranch()) }, [])

  useEffect(() => {
    if (selectedBranchId) dispatch(GetItemCategory({ BranchId: selectedBranchId }))
  }, [selectedBranchId])

  if (isItemCreate) {
    return (
      <div className="page-content">
        <CreateRestuarantItem handleItem={() => setIsItemCreate(false)} onBack={() => setIsItemCreate(false)} />
      </div>
    )
  }

  if (isViewMode && selectedCategory) {
    return (
      <div className="page-content">
        <ItemCategoryView data={selectedCategory} onBack={() => { setIsViewMode(false); if (selectedBranchId) dispatch(GetItemCategory({ BranchId: selectedBranchId })) }} />
      </div>
    )
  }

  const filtered = (itemCat ?? []).filter((item) =>
    !search || item.categoryName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-content">
      <div className="page-head">
        <div>
          <h1 className="page-title">Assigned Items</h1>
          <p className="page-sub">View and manage item categories assigned to each branch.</p>
        </div>
        <Button onClick={() => setIsItemCreate(true)} icon={<SvgIcon id="i-plus" />}>Create Item</Button>
      </div>

      <Toolbar onSearch={setSearch} searchPlaceholder="Search categories…">
        {branch?.map((b) => (
          <Chip
            key={b.branchId}
            active={selectedBranchId === b.branchId}
            onClick={() => setSelectedBranchId(b.branchId)}
          >
            {b.name}
          </Chip>
        ))}
      </Toolbar>

      {!selectedBranchId ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--warn)', fontSize: 13 }}>
          Select a branch above to view assigned items.
        </div>
      ) : (
        <DataTable
          columns={[
            ...COLUMNS,
            {
              key: '_actions',
              label: 'Actions',
              align: 'right',
              render: (_, row) => (
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedCategory(row); setIsViewMode(true) }} title="View">
                  <SvgIcon id="i-eye" />
                </Button>
              ),
            },
          ]}
          data={filtered}
          rowKey="itemSubCategoryID"
          loading={loading}
          onRowClick={(row) => { setSelectedCategory(row); setIsViewMode(true) }}
          emptyText="No item categories found for this branch"
        />
      )}
    </div>
  )
}
