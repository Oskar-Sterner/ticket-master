import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useUsers } from "@/hooks/useUsers";
import { UserCard } from "@/components/ui/UserCard";
import { useRouter } from "next/router";
import { UserWithDetails } from "@/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import Head from "next/head";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function UsersPage() {
  const router = useRouter();
  const { data: users, isLoading: usersLoading } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const sortedUsers = useMemo(
    () =>
      users
        ? [...users].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [],
    [users]
  );

  const filteredUsers = useMemo(
    () =>
      sortedUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, sortedUsers]
  );

  const handleNavigate = useCallback(
    (user: UserWithDetails) => {
      router.push(`/users/${user._id}`);
    },
    [router]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const skeletonItems = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`skeleton-${i}`}
          variants={itemVariants}
          className="w-full h-[350px] rounded-xl bg-white/10 animate-pulse"
        />
      )),
    []
  );

  return (
    <>
      <Head>
        <title>TicketMaster - Users</title>
      </Head>
      <div
        className={cn(
          "flex flex-col flex-grow w-full p-8 rounded-3xl",
          "bg-white/10 backdrop-blur-lg border border-white/20",
          "shadow-xl"
        )}
      >
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h2 className="text-4xl font-bold text-white">All Users</h2>
          <div className="w-full sm:w-auto sm:min-w-[300px]">
            <Input
              type="text"
              placeholder="Search by name or email..."
              variant="glass"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {usersLoading && skeletonItems}
            {!usersLoading &&
              filteredUsers.map((user) => (
                <motion.div key={user._id} variants={itemVariants}>
                  <UserCard
                    user={user}
                    onOpen={handleNavigate}
                    layoutId={`user-card-${user._id}`}
                  />
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
        {!usersLoading && filteredUsers.length === 0 && (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-white/50 text-lg">
              {searchQuery ? "No users match your search." : "No users found."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
