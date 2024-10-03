import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function DashboardCard({ icon: Icon, title, description }: DashboardCardProps) {
  return (
    <Card className="flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-primary/10">
      <CardHeader className="pb-2 flex flex-col items-center">
        <div className="w-12 h-12 flex items-center justify-center mb-4 bg-primary/10 rounded-full">
          <Icon className="w-6 h-6 text-[#E8DFD5]" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}