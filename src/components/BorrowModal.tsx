/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Book as BookIcon } from "lucide-react";
import { toast } from "sonner";
import { useBorrowBookMutation } from "@/lib/api";
import type { DBBook } from "@/types/schema";

const borrowSchema = z.object({
  book: z.string().min(1, "Book ID is required"),
  quantity: z.coerce.number().min(1, "At least 1 book must be borrowed"),
  dueDate: z
    .string()
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
      },
      { message: "Due date must be in the future" }
    ),
});

type BorrowFormData = z.infer<typeof borrowSchema>;

interface BorrowModalProps {
  book: DBBook | null;
  isOpen: boolean;
  onClose: () => void;
}

const  BorrowModal = ({
  book,
  isOpen,
  onClose,
}: BorrowModalProps) => {
  const [borrowBook, { isLoading }] = useBorrowBookMutation();

  const form = useForm<BorrowFormData>({
    resolver: zodResolver(borrowSchema),
    defaultValues: {
      book: book?._id || "",
      quantity: 1,
      dueDate: "",
    },
  });

  useEffect(() => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    const formattedDate = twoWeeksFromNow.toISOString().split("T")[0];
    form.setValue("dueDate", formattedDate);
  }, [form]);

  useEffect(() => {
    if (book) {
      form.setValue("book", book._id);
      form.setValue("quantity", 1);
    }
  }, [book, form]);

  const onSubmit = async (data: BorrowFormData) => {
    try {
      await borrowBook(data).unwrap();
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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md bg-card text-card-foreground">
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
            <Input
              id="dueDate"
              type="date"
              min={minDate}
              {...form.register("dueDate")}
              className="mt-2"
            />
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
export default BorrowModal
