import { type ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md ring-1 ring-slate-900/5 ${className}`}
    >
      {title && (
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
