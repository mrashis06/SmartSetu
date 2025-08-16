
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuestionnaire } from "@/context/questionnaire-context";
import { useEffect } from "react";

const formSchema = z.object({
  businessType: z.string().optional(),
  businessDuration: z.string().optional(),
  stockValue: z.string().optional(),
  monthlyUpiTransactions: z.string().optional(),
  monthlyCashIncome: z.string().optional(),
  monthlyExpenses: z.string().optional(),
  existingLoan: z.enum(["yes", "no"]).optional(),
});

type FinancialInfoFormProps = {
  onNext: () => void;
  onBack: () => void;
};

export function FinancialInfoForm({ onNext, onBack }: FinancialInfoFormProps) {
  const { formData, setFinancialInfo } = useQuestionnaire();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: formData.financialInfo.businessType || "",
      businessDuration: formData.financialInfo.businessDuration || "",
      stockValue: formData.financialInfo.stockValue || "",
      monthlyUpiTransactions: formData.financialInfo.monthlyUpiTransactions || "",
      monthlyCashIncome: formData.financialInfo.monthlyCashIncome || "",
      monthlyExpenses: formData.financialInfo.monthlyExpenses || "",
      existingLoan: formData.financialInfo.existingLoan || undefined,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFinancialInfo(value as z.infer<typeof formSchema>);
    });
    return () => subscription.unsubscribe();
  }, [form, setFinancialInfo]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFinancialInfo(values);
    onNext();
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-serif tracking-wider text-lg">CHECK YOUR ELIGIBILITY</h3>
        <h4 className="font-sans text-muted-foreground">FINANCIAL INFORMATIONS</h4>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fruits-vegetables">Fruits / Vegetables Shop</SelectItem>
                      <SelectItem value="fish-meat-chicken">Fish / Meat / Chicken Shop</SelectItem>
                      <SelectItem value="kirana-general">Small Kirana / General Shop</SelectItem>
                       <SelectItem value="chai-thela">Chai / Thela</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Duration</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="less-than-5">Less than 5 years</SelectItem>
                      <SelectItem value="more-than-5">More than 5 years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stockValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Stock/Inventory Value</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 50000" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlyUpiTransactions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly UPI Transactions</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 100000" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlyCashIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Cash Income</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 25000" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="monthlyExpenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Expenses</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 75000" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormField
              control={form.control}
              name="existingLoan"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Existing Loan (Yes/No)</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>Back</Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
