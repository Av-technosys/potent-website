"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ContactMessageRow = {
  id: string;
  name: string | null;
  email: string | null;
  number: string | null;
  message: string | null;
  createdAt: Date | null;
};

interface Props {
  messages: ContactMessageRow[];
  page: number;
  pageSize: number;
}

function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function MessageDialog({ message }: { message: string | null }) {
  if (!message) return <span className="text-sm text-muted-foreground">-</span>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Message</DialogTitle>
        </DialogHeader>
        <p className="max-h-[55vh] overflow-y-auto whitespace-pre-wrap break-words rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
          {message}
        </p>
      </DialogContent>
    </Dialog>
  );
}

const ContactUsTable = ({ messages, page, pageSize }: Props) => {
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="mt-8 overflow-hidden">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">S.No</TableHead>
            <TableHead className="w-[18%]">Name</TableHead>
            <TableHead className="w-[24%]">Email</TableHead>
            <TableHead className="w-[14%]">Phone</TableHead>
            <TableHead className="w-[12%]">Message</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <TableRow key={message.id} className="align-top">
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>
                  <p className="truncate font-medium">{message.name ?? "-"}</p>
                </TableCell>
                <TableCell>
                  <p className="truncate">{message.email ?? "-"}</p>
                </TableCell>
                <TableCell>{message.number ?? "-"}</TableCell>
                <TableCell>
                  <MessageDialog message={message.message} />
                </TableCell>
                <TableCell>{formatDate(message.createdAt)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-600">
                No contact messages found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactUsTable;
