import { useLocation } from 'react-router-dom'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div
      key={location.pathname + location.search}
      className="animate-fade-up"
    >
      {children}
    </div>
  )
}
