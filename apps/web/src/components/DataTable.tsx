interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  isLoading?: boolean
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = 'No data',
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500">{emptyMessage}</div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full">
        <thead>
          <tr className="bg-slate-700 text-left">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-200"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
              }`}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="whitespace-nowrap px-4 py-3 text-sm text-slate-700"
                >
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
