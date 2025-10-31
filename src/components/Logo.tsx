import { cn } from '@/lib/utils'
import React from 'react'

export function Logo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('font-headline tracking-wider', className)} {...props}>
      <span className="bg-gradient-to-b from-red-600 to-red-900 bg-clip-text text-transparent text-2xl">
        HAIR &amp; RELAX
      </span>
      <span className="block text-center text-lg bg-gradient-to-b from-red-600 to-red-900 bg-clip-text text-transparent">
        STUDIO
      </span>
    </div>
  )
}
