import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  useCreateBookMutation,
  useUpdateBookMutation,
} from "@/lib/api";
import type { DBBook } from "@/types/schema";
import { genres } from "@/types/schema";

interface BookFormProps {
  book?: DBBook; // Include _id if editing
  onCancel: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.enum(genres, {
    required_error: "Genre is required",
  }),
  isbn: z.string().min(1, "ISBN is required"),
  description: z.string().optional(),
  copies: z.coerce.number().min(1, "At least one copy is required"),
  available: z.coerce.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function BookForm({ book, onCancel }: BookFormProps) {
  const navigate = useNavigate();
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();


  const isEditing = !!book;
  const isLoading = isCreating || isUpdating;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: book?.title ?? "",
      author: book?.author ?? "",
      genre: book?.genre ?? "FICTION",
      isbn: book?.isbn ?? "",
      description: book?.description ?? "",
      copies: book?.copies ?? 1,
      available: book?.available ?? true,
    },
  });

  const onSubmit = async (data: FormData) => {
    const payload = {
      title: data.title,
      author: data.author,
      genre: data.genre,
      isbn: data.isbn,
      description: data.description,
      copies: data.copies,
      available: data.available ?? true,
    };

    try {
      if (isEditing) {
        if (!book?._id) {
          toast.error("Book ID is missing for edit.");
          return;
        }
        await updateBook({ id: book._id, data: payload }).unwrap();
        toast.success(`"${data.title}" has been updated in the library.`);
      } else {
        await createBook(payload).unwrap();
        toast.success(`"${data.title}" has been added to the library.`);
      }

      navigate("/books");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-semibold">
            {isEditing ? "Edit Book" : "Add New Book"}
          </h2>
        </div>
        <p className="text-gray-600">
          {isEditing
            ? "Update the book details"
            : "Enter the book details to add it to your library"}
        </p>
      </div>

      <div className="rounded-lg shadow-sm border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter book title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ISBN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="copies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Copies *</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available?</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      defaultValue={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4 pt-4 border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                    ? "Update Book"
                    : "Add Book"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
