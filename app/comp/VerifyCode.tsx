"use client";
import * as React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import axios from "axios";

const formSchema = z.object({
  identifier: z.string("Not a String!"),
  code: z
    .string("Code must be a string")
    .regex(/^\d{6}$/, "Code must be exactly 6 digits"),
});
function VerifyCode() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/auth/verify-user", {
        identifier: data.identifier,
        code: data.code,
      });

      if (!response.data.success) {
        toast.add({
          title: "Error",
          description: response.data.error,
        });

        return;
      }

      toast.add({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("Error registering user", error);
      toast.add({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    }
  };

  return (
    <Card className="w-full mt-10 max-w-lg mx-auto shadow-2xl px-3 py-4 space-y-4">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl sm:text-4xl font-bold">
          Welcome back to Anon Feedback
        </CardTitle>
        <CardDescription className="text-lg sm:text-xl">
          Verify your account to continue your secret conversation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-lg sm:text-xl!" htmlFor="identifier">Identifier :</FieldLabel>
                  <Input
                    {...field}
                    className="h-auto w-auto px-4 sm:py-3 sm:max-xl:text-lg!"
                    id="identifier"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email / Username"
                    autoComplete="username"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-lg sm:text-xl!"  htmlFor="code">Code :</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    className="h-auto w-auto px-4 sm:py-3 sm:max-xl:text-lg!"
                    id="code"
                    aria-invalid={fieldState.invalid}
                    placeholder="Verification code"
                    autoComplete="one-time-code"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              disabled={form.formState.isSubmitting ? true : false}
              type="submit"
              className={
                "h-auto cursor-pointer bg-blue-500 font-bold text-white text-lg py-2 hover:bg-blue-300 duration-200 hover:text-white"
              }
            >
              Submit
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="responsive">
          <p className="text-center text-lg sm:text-xl">
            Already verified your account?{" "}
            <Link className="text-blue-500 hover:text-blue-300 hover:underline ml-2" href={"/sign-in"}>Login</Link>
          </p>
        </Field>
      </CardFooter>
    </Card>
  );
}

export default VerifyCode;
