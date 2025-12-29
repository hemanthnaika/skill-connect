import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

const CardSection = ({
  title,
  total,
  icon: Icon,
  link
}: {
  title: string;
  total: number;
  icon: LucideIcon;
  link:string
}) => {
  return (
    <Link href={link}>
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
    </Link>
  );
};

export default CardSection;
