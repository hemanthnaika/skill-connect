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



const RecentUser = ({ data }: { data: RecentUser[] }) => {
  return (
    <Card className="border-secondary shadow-md bg-white dark:bg-black">
      <CardHeader>
        <CardTitle>Recent User</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.createdAt).toDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentUser;
