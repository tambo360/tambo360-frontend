import { CardContent } from '@/components/ui/card'

// Fallback estático para los <Suspense> de las páginas de auth que leen
// useSearchParams. No usa hooks: se prerenderiza en el servidor y pinta
// al instante mientras el contenido cliente carga.
const AuthCardSkeleton: React.FC = () => {
  return (
    <CardContent className="flex flex-1 flex-col px-0">
      <div
        className="flex flex-1 flex-col justify-between gap-4 py-5"
        aria-hidden
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center py-4">
            <div className="h-10.75 w-40 animate-pulse rounded bg-[#E5E3DC]" />
          </div>
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-[#E5E3DC]" />
          <div className="h-14 w-full animate-pulse rounded-lg bg-[#F2F1EC]" />
          <div className="h-14 w-full animate-pulse rounded-lg bg-[#F2F1EC]" />
        </div>
        <div className="h-14 w-full animate-pulse rounded-lg bg-[#E5E3DC]" />
      </div>
    </CardContent>
  )
}

export default AuthCardSkeleton
