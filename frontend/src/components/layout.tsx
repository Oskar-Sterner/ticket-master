import React from "react";
import { Navbar } from "./ui/Navbar";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Button } from "./ui/Button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useModal } from "@/providers/ModalProvider";
import { useSession } from "next-auth/react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { openModal } = useModal();
  const { status } = useSession();

  const handleFabClick = () => {
    if (status === "authenticated") {
      openModal("create");
    } else {
      openModal("auth");
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="relative flex min-h-screen flex-col text-foreground">
        <Navbar />
        <main className="container mx-auto flex-grow px-4 pb-4 pointer-events-auto flex flex-col">
          {children}
        </main>
        <Button
          onClick={handleFabClick}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg z-50"
        >
          <PlusIcon className="w-6 h-6" />
        </Button>
      </div>
    </>
  );
}
