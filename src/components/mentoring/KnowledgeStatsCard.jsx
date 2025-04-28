import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KnowledgeStatsCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
}) {
  return (
    <Card className={`bg-gradient-to-br ${gradient}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}