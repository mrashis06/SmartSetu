
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
import { useQuestionnaire } from "@/context/questionnaire-context";
import { useEffect } from "react";

const formSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  altPhone: z.string().optional(),
  address: z.string().optional(),
});

type PersonalInfoFormProps = {
  onNext: () => void;
};

export function PersonalInfoForm({ onNext }: PersonalInfoFormProps) {
  const { formData, setPersonalInfo } = useQuestionnaire();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: formData.personalInfo.firstName || "",
      middleName: formData.personalInfo.middleName || "",
      lastName: formData.personalInfo.lastName || "",
      gender: formData.personalInfo.gender || "",
      dob: formData.personalInfo.dob || "",
      email: formData.personalInfo.email || "",
      phone: formData.personalInfo.phone || "",
      altPhone: formData.personalInfo.altPhone || "",
      address: formData.personalInfo.address || "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setPersonalInfo(value as z.infer<typeof formSchema>);
    });
    return () => subscription.unsubscribe();
  }, [form, setPersonalInfo]);
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    setPersonalInfo(values);
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
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <Input placeholder="DD/MM/YYYY" {...field} />
                    </FormControl>
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
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                          +91
                        </span>
                        <Input placeholder="98765 43210" {...field} className="pl-10" />
                      </div>
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
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                          +91
                        </span>
                        <Input placeholder="98765 43210" {...field} className="pl-10" />
                      </div>
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
