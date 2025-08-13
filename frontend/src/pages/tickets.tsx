import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTickets } from "@/hooks/useTickets";
import { TicketCard } from "@/components/ui/TicketCard";
import { useRouter } from "next/router";
import { Ticket } from "@/types";
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

export default function TicketsPage() {
  const router = useRouter();
  const { data: tickets, isLoading: ticketsLoading } = useTickets();
  const [searchQuery, setSearchQuery] = useState("");

  const sortedTickets = useMemo(
    () =>
      tickets
        ? [...tickets].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
        : [],
    [tickets]
  );

  const filteredTickets = useMemo(
    () =>
      sortedTickets.filter((ticket) =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, sortedTickets]
  );

  const handleNavigate = useCallback(
    (ticket: Ticket) => {
      router.push(`/tickets/${ticket._id}`);
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
          className="w-full h-[320px] rounded-xl bg-white/10 animate-pulse"
        />
      )),
    []
  );

  return (
    <>
      <Head>
        <title>TicketMaster - Tickets</title>
      </Head>
      <div
        className={cn(
          "flex flex-col flex-grow w-full p-8 rounded-3xl",
          "bg-white/10 backdrop-blur-lg border border-white/20",
          "shadow-xl"
        )}
      >
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h2 className="text-4xl font-bold text-white">All Tickets</h2>
          <div className="w-full sm:w-auto sm:min-w-[300px]">
            <Input
              type="text"
              placeholder="Search tickets..."
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
            {ticketsLoading && skeletonItems}
            {!ticketsLoading &&
              filteredTickets.map((ticket) => (
                <motion.div key={ticket._id} variants={itemVariants}>
                  <TicketCard
                    ticket={ticket}
                    onOpen={handleNavigate}
                    layoutId={`card-${ticket._id}`}
                  />
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
        {!ticketsLoading && filteredTickets.length === 0 && (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-white/50 text-lg">
              {searchQuery
                ? "No tickets match your search."
                : "No tickets found."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
