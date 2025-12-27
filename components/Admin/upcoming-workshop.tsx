import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";



const UpcomingWorkshop = ({ data }: { data: UpcomingWorkshop[] }) => {
  return (
    <Card className="border-secondary shadow-md bg-white dark:bg-black">
      <CardHeader>
        <CardTitle>Upcoming Workshops</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {data.map((item, i) => (
            <li
              key={i}
              className="p-3 rounded-md bg-gray-100 flex justify-between dark:bg-black dark:text-white"
            >
              <span>
                {item.title} ({item.mode})
              </span>
              <span className="font-semibold">{item.date}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UpcomingWorkshop;
