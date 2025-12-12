import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const recentUsers = [
  { name: "Rohit Sharma", course: "Java Full Stack", joined: "2 days ago" },
  { name: "Priya Patel", course: "Python with ML", joined: "4 days ago" },
  { name: "Aman Kumar", course: "AWS DevOps", joined: "1 week ago" },
];

const RecentUser = () => {
  return (
    <Card className="border-secondary shadow-md">
      <CardHeader>
        <CardTitle>Recent User</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentUsers.map((user, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.course}</TableCell>
                <TableCell>{user.joined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentUser;
