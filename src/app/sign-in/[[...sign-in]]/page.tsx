import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/50 px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-md",
          },
        }}
      />
    </main>
  );
}
