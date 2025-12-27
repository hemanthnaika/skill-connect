"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A simple area chart";



const chartConfig = {
  Revenue: {
    label: "Revenue",
    color: "#0075eb",
  },
} satisfies ChartConfig;

const ChartArea = ({ data }: { data: RevenueDatum[] }) => {
  return (
    <Card className="border-secondary shadow-md bg-white dark:bg-black">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="var(--color-Revenue)"
              fillOpacity={0.4}
              stroke="var(--color-Revenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartArea;
