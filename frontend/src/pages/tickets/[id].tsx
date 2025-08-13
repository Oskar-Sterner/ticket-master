import { useCallback } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useTicket } from "@/hooks/useTickets";
import { OpenTicketPanel } from "@/components/ui/OpenTicketPanel";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Head from "next/head";

export default function TicketDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const ticketId = typeof id === "string" ? id : "";

  const { data: ticket, isLoading } = useTicket(ticketId);

  const handleClose = useCallback(() => {
    router.push("/tickets");
  }, [router]);

  const title = isLoading
    ? "Loading Ticket..."
    : `TicketMaster - ${ticket?.title ?? "Ticket"}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div
        className={cn(
          "flex flex-col flex-grow w-full p-8 rounded-3xl",
          "bg-white/10 backdrop-blur-lg border border-white/20",
          "shadow-xl"
        )}
      >
        {isLoading && (
          <div className="flex flex-col gap-8 h-full">
            <div className="h-10 w-1/3 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-6 w-1/2 rounded-lg bg-white/10 animate-pulse" />
            <div className="mt-auto border-t border-gray-200/80 dark:border-zinc-700/50 pt-6">
              <div className="h-12 w-full rounded-lg bg-white/10 animate-pulse" />
            </div>
          </div>
        )}

        {!isLoading && ticket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 self-start"
            >
              <ArrowLeftIcon />
              Back to All Tickets
            </button>
            <div className="flex-grow">
              <OpenTicketPanel ticket={ticket} onClose={handleClose} />
            </div>
          </motion.div>
        )}

        {!isLoading && !ticket && (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-white/50 text-lg">Ticket not found.</p>
          </div>
        )}
      </div>
    </>
  );
}
