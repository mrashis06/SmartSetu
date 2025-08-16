
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
  hasCibilScore: z.enum(["yes", "no"]).optional(),
  cibilScore: z.string().optional(),
  ownHouse: z.enum(["yes", "no"]).optional(),
  ownBusiness: z.enum(["yes", "no"]).optional(),
  govtBenefits: z.enum(["yes", "no"]).optional(),
  benefitType: z.string().optional(),
});

type AdditionalInfoFormProps = {
  onNext: () => void;
  onBack: () => void;
};

export function AdditionalInfoForm({ onNext, onBack }: AdditionalInfoFormProps) {
  const { formData, setAdditionalInfo } = useQuestionnaire();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData.additionalInfo,
  });

  const watchHasCibilScore = form.watch("hasCibilScore");
  const watchGovtBenefits = form.watch("govtBenefits");

  useEffect(() => {
    const subscription = form.watch((value) => {
      setAdditionalInfo(value as z.infer<typeof formSchema>);
    });
    return () => subscription.unsubscribe();
  }, [form, setAdditionalInfo]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setAdditionalInfo(values);
    onNext();
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-serif tracking-wider text-lg">CHECK YOUR ELIGIBILITY</h3>
        <h4 className="font-sans text-muted-foreground">ADDITIONAL INFORMATION</h4>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="hasCibilScore"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Do you have a CIBIL score?</FormLabel>
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
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchHasCibilScore === "yes" && (
                <FormField
                  control={form.control}
                  name="cibilScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's your CIBIL score?</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your CIBIL score" {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
               <FormField
                control={form.control}
                name="ownHouse"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Do you have your own house?</FormLabel>
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
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-8">
                 <FormField
                control={form.control}
                name="ownBusiness"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Are you the owner of your business?</FormLabel>
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
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                 <FormField
                control={form.control}
                name="govtBenefits"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Do you get financial benefits from Govt?</FormLabel>
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
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {watchGovtBenefits === "yes" && (
                <FormField
                  control={form.control}
                  name="benefitType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>If yes, then select</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select benefit type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="benefit-1">Benefit 1</SelectItem>
                          <SelectItem value="benefit-2">Benefit 2</SelectItem>
                          <SelectItem value="benefit-3">Benefit 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>Back</Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
