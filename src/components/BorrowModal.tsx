/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { CalendarIcon, Book as BookIcon } from "lucide-react";
import { toast } from "sonner";
// import { useBorrowBookMutation } from "@/lib/api";
import type { DBBook } from "@/types/schema";
import { useBorrowBookMutation } from "@/redux/store/api";

const borrowSchema = z.object({
  book: z.string().min(1, "Book ID is required"),
  quantity: z.coerce.number().min(1, "At least 1 book must be borrowed"),
  dueDate: z.date().refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  }, {
    message: "Due date must be in the future"
  }),
});

type BorrowFormData = z.infer<typeof borrowSchema>;

interface BorrowModalProps {
  book: DBBook | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BorrowModal({
  book,
  isOpen,
  onClose,
}: BorrowModalProps) {
  const [borrowBook, { isLoading }] = useBorrowBookMutation();

  const form = useForm<BorrowFormData>({
    resolver: zodResolver(borrowSchema),
    defaultValues: {
      book: book?._id || "",
      quantity: 1,
      dueDate: new Date(),
    },
  });

  const dueDate = form.watch("dueDate");

  useEffect(() => {
    if (book) {
      form.setValue("book", book._id);
      form.setValue("quantity", 1);
      const twoWeeksLater = new Date();
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
      form.setValue("dueDate", twoWeeksLater);
    }
  }, [book, form]);

  const onSubmit = async (data: BorrowFormData) => {
    try {
      await borrowBook({
        ...data,
        dueDate: data.dueDate.toISOString().split("T")[0],
      }).unwrap();
      toast.success(`"${book?.title}" has been successfully borrowed.`);
      onClose();
      form.reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to borrow book.");
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogDescription className="sr-only"></DialogDescription>
      <DialogContent  className="w-full max-w-md bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Borrow Book</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Book</Label>
            <div className="p-3 bg-muted rounded-lg mt-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded flex items-center justify-center flex-shrink-0">
                  <BookIcon className="text-white text-xs" />
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground">{book.title}</h4>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {book.copies} copies
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={book.copies}
              {...form.register("quantity", { valueAsNumber: true })}
              className="mt-2"
            />
            {form.formState.errors.quantity && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full mt-2 justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => form.setValue("dueDate", date!)}
                  disabled={(date) => date < new Date()}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.dueDate && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.dueDate.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Borrowing..." : "Borrow Book"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
