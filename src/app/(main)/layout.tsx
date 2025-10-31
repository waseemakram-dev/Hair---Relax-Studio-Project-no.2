
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
  )
}
