import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  iconBg?: string
  subtitleVariant?: "positive" | "negative" | "neutral"
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = "bg-primary/10 text-primary",
  subtitleVariant = "neutral",
  
}: StatCardProps) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="flex items-center justify-between px-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="text-2xl font-semibold tracking-tight">
            {value}
          </p>

          <p
            className={cn(
              "text-xs font-medium",
              subtitleVariant === "positive" &&
                "text-emerald-600 dark:text-emerald-500",
              subtitleVariant === "negative" &&
                "text-red-600 dark:text-red-500",
              subtitleVariant === "neutral" &&
                "text-muted-foreground"
            )}
          >
            {subtitle}
          </p>
        </div>

        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            iconBg
          )}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
