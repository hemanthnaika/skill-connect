import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const workshops = [
  { title: "React Bootcamp", mode: "Online", date: "15 Feb" },
  { title: "Java Backend", mode: "Offline", date: "20 Feb" },
  { title: "UI/UX Workshop", mode: "Hybrid", date: "28 Feb" },
];

const UpcomingWorkshop = () => {
  return (
    <Card className="border-secondary shadow-md">
      <CardHeader>
        <CardTitle>Upcoming Workshops</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {workshops.map((item, i) => (
            <li
              key={i}
              className="p-3 rounded-md bg-gray-100 flex justify-between"
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
