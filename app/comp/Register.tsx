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
  username: z
    .string("Username must be a string")
    .min(4, {
      error: (iss) => `Username must be at least ${iss.minimum} characters!`,
    })
    .max(10, {
      error: (iss) => `Username can be at most ${iss.maximum} characters!`,
    })
    .regex(/^[a-z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/, {
      error:
        "Username can contain only lowercase letters and special characters!",
    }),
  email: z.string("Email must be a string").email({
    error: "Please enter a valid email address!",
  }),

  password: z
    .string("Password must be a string")
    .min(4, {
      error: (iss) => `Password must be at least ${iss.minimum} characters!`,
    })
    .max(10, {
      error: (iss) => `Password can be at most ${iss.maximum} characters!`,
    }),
});

function Register() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/auth/sign-up", {
        username: data.username,
        email: data.email,
        password: data.password,
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

      router.replace("/verify");
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
        <CardTitle className="text-3xl sm:text-4xl font-bold sm:mb-4">
          Create your Anon Feedback account
        </CardTitle>
        <CardDescription className="text-lg sm:text-xl">
          Sign up to start your secret conversations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="text-lg sm:text-xl!"
                    htmlFor="username"
                  >
                    Username :
                  </FieldLabel>
                  <Input
                    {...field}
                    className="h-auto w-auto px-4 sm:py-3 sm:max-xl:text-lg!"
                    id="username"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Username"
                    autoComplete="username"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-lg sm:text-xl!" htmlFor="email">
                    Email :
                  </FieldLabel>
                  <Input
                    {...field}
                    className="h-auto w-auto px-4 sm:py-3 sm:max-xl:text-lg!"
                    id="email"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="text-lg sm:text-xl!"
                    htmlFor="password"
                  >
                    Password :
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    className="h-auto w-auto px-4 sm:py-3 sm:max-xl:text-lg!"
                    id="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    autoComplete="current-password"
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
            Already have an account with us?{" "}
            <Link
              className="text-blue-500 hover:text-blue-300 hover:underline ml-2"
              href={"/sign-in"}
            >
              Sign In
            </Link>
          </p>
        </Field>
      </CardFooter>
    </Card>
  );
}

export default Register;
