/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { Button } from "./Button";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useModal } from "@/providers/ModalProvider";

const navContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const navTitleVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      staggerChildren: 0.075,
    },
  },
};

const navLetterVariants: Variants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 15,
    },
  },
};

const navButtonVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export function Navbar() {
  const title = "TM".split("");
  const { pathname } = useRouter();
  const { data: session, status } = useSession();
  const { openModal } = useModal();

  return (
    <header className="p-4 z-50 sticky top-0 pointer-events-none">
      <motion.nav
        className="w-full max-w-6xl mx-auto flex items-center justify-center relative rounded-full border border-white/10 bg-black/10 pr-2 pl-4 py-2 shadow-xl backdrop-blur-md pointer-events-auto"
        variants={navContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-nabla text-4xl flex overflow-hidden absolute left-4"
          variants={navTitleVariants}
        >
          {title.map((letter, index) => (
            <motion.span key={index} variants={navLetterVariants}>
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        <div className="flex space-x-4">
          <motion.div variants={navButtonVariants}>
            <Link href="/" passHref>
              <Button asChild variant="outline" active={pathname === "/"}>
                <span>Overview</span>
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={navButtonVariants}>
            <Link href="/projects" passHref>
              <Button
                asChild
                variant="outline"
                active={pathname?.startsWith("/projects") ?? false}
              >
                <span>Projects</span>
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={navButtonVariants}>
            <Link href="/tickets" passHref>
              <Button
                asChild
                variant="outline"
                active={pathname?.startsWith("/tickets") ?? false}
              >
                <span>Tickets</span>
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={navButtonVariants}>
            <Link href="/users" passHref>
              <Button
                asChild
                variant="outline"
                active={pathname?.startsWith("/users") ?? false}
              >
                <span>Users</span>
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="absolute right-4 flex items-center gap-2">
          <motion.div
            variants={navButtonVariants}
            className="h-10 flex items-center"
          >
            {status === "loading" && (
              <div className="h-10 w-24 rounded-full bg-white/10 animate-pulse" />
            )}
            {status === "authenticated" && (
              <Button
                className="rounded-full"
                variant="glass"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            )}
            {status === "unauthenticated" && (
              <Button
                className="rounded-full"
                onClick={() => openModal("auth")}
              >
                Login
              </Button>
            )}
          </motion.div>
        </div>
      </motion.nav>
    </header>
  );
}
