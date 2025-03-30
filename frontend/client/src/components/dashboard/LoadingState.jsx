import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"

const LoadingState = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-10 w-1/3 mx-auto" />
      <Skeleton className="h-4 w-1/4 mx-auto" />
    </div>

    <Card className="border border-purple-200">
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </CardContent>
    </Card>
  </div>
)

export default LoadingState

