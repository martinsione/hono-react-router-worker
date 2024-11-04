import { signIn } from "@hono/auth-js/react";
import { useMutation } from "@tanstack/react-query";
import { Link, redirect } from "react-router";
import { z } from "zod";
import { Button, buttonVariants } from "~/app/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "~/app/components/ui/form";
import { Icons } from "~/app/components/ui/icons";
import { Input } from "~/app/components/ui/input";
import { cn } from "~/app/lib/utils";

const EmailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function UserAuthForm() {
  const form = useForm({
    schema: EmailPasswordSchema,
  });

  const signin = useMutation({
    mutationFn: async (data: z.infer<typeof EmailPasswordSchema>) => {
      return await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
    },
    onSuccess: async (data, variables) => {
      return redirect("/");
    },
    onError(error, variables, context) {
      console.log("error", error);
    },
  });

  async function onSubmit(data: z.infer<typeof EmailPasswordSchema>) {
    signin.mutate(data);
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={signin.isPending}
                      placeholder="name@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect="off"
                      disabled={signin.isPending}
                      placeholder="password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={signin.isPending}>
              {signin.isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </div>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs/none uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>

      <Button variant="outline" type="button" disabled>
        {signin.isPending ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
    </div>
  );
}

export default function SignInPage() {
  return (
    <>
      <Link
        to="/sign-up"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 right-4 md:top-8 md:right-8",
        )}
      >
        Create an account
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to sign in to your account
          </p>
        </div>
        <UserAuthForm />
      </div>
    </>
  );
}
