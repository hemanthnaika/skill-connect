import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon, Upload } from "lucide-react";

const CardSection = ({
  title,
  total,
  icon: Icon,
}: {
  title: string;
  total: number;
  icon: LucideIcon;
}) => {
  return (
    <Card className="@container/card border-secondary shadow-md bg-white dark:bg-black ">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {total}
        </CardTitle>
        <CardAction>
          <Badge
            variant="outline"
            className="bg-primary text-secondary w-10 h-10"
          >
            <Icon className="size-5" />
          </Badge>
        </CardAction>
      </CardHeader>
    </Card>
  );
};

export default CardSection;
