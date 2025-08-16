"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
  dob: z.date({ required_error: "Date of birth is required." }),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  altPhone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
});

type PersonalInfoFormProps = {
  onNext: () => void;
};

export function PersonalInfoForm({ onNext }: PersonalInfoFormProps) {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.displayName?.split(" ")[0] || "",
      lastName: user?.displayName?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
      middleName: "",
      gender: "",
      phone: "",
      altPhone: "",
      address: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    onNext();
  }

  return (
    <div>
        <div className="mb-6">
            <h3 className="font-serif tracking-wider text-lg">CHECK YOUR ELIGIBILITY</h3>
            <h4 className="font-sans text-muted-foreground">PERSONAL INFORMATIONS</h4>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
            <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                    <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                    <Input placeholder="Michael" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                    <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                    <Input placeholder="example@email.com" {...field} readOnly/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                    <Input placeholder="+1 234 567 890" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="altPhone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Alternative Mobile Number</FormLabel>
                    <FormControl>
                    <Input placeholder="+1 234 567 890" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                    <Input placeholder="123 Main St, Anytown, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            <div className="flex justify-end">
                <Button type="submit">Next</Button>
            </div>
        </form>
        </Form>
    </div>
  );
}
