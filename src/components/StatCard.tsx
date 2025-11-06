import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon?: LucideIcon;
  customIcon?: string;
}

export function StatCard({ title, value, change, icon: Icon, customIcon }: StatCardProps) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          {customIcon ? (
            <span
              role="img"
              aria-label={title}
              className="h-4 w-4 bg-primary"
              style={{
                WebkitMaskImage: `url(${customIcon})`,
                maskImage: `url(${customIcon})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                display: 'inline-block',
              }}
            />
          ) : Icon ? (
            <Icon className="h-4 w-4 text-primary" />
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1">{change}</p>
        )}
      </CardContent>
    </Card>
  );
}
