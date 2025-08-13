import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from "./Input";
import { Button } from "./Button";
import { useRegister } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const register = useRegister();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (activeTab === "login") {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully!");
        onClose();
      }
    } else {
      const name = formData.get("name") as string;
      toast.promise(register.mutateAsync({ name, email, password }), {
        loading: "Creating account...",
        success: () => {
          setActiveTab("login");
          return "Account created! Please log in.";
        },
        error: (err: unknown) => {
          if (err instanceof Error) {
            return err.message;
          }
          return "Registration failed.";
        },
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 grid place-items-center z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className={cn(
              "w-full max-w-md flex flex-col bg-white/50 dark:bg-zinc-800/50",
              "backdrop-blur-xl border border-white/20 dark:border-zinc-700/50",
              "rounded-3xl shadow-xl p-8 relative z-[100]"
            )}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/30 hover:bg-black/50"
              onClick={onClose}
            >
              <Cross1Icon />
            </button>
            <div className="mb-6 flex p-1 rounded-full bg-black/20 self-start">
              <button
                onClick={() => setActiveTab("login")}
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-full",
                  activeTab === "login" && "bg-white text-black"
                )}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-full",
                  activeTab === "register" && "bg-white text-black"
                )}
              >
                Register
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-white mb-2">
                {activeTab === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              {activeTab === "register" && (
                <Input
                  variant="glass"
                  name="name"
                  placeholder="Name"
                  required
                />
              )}
              <Input
                variant="glass"
                name="email"
                type="email"
                placeholder="Email"
                required
              />
              <Input
                variant="glass"
                name="password"
                type="password"
                placeholder="Password"
                required
              />
              <Button type="submit" disabled={register.isPending}>
                {activeTab === "login" ? "Login" : "Create Account"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
