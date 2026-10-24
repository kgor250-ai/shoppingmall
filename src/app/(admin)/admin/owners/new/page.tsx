import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OwnerForm } from './OwnerForm'

export default function NewOwnerPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add Store Owner</h1>

      <Card>
        <CardHeader>
          <CardTitle>Owner Details</CardTitle>
        </CardHeader>
        <CardContent>
          <OwnerForm />
        </CardContent>
      </Card>
    </div>
  )
}
