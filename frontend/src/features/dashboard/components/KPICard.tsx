import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value?: number;
  suffix?: string;
}

export default function KPICard({
  title,
  value = 0,
  suffix = "",
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{
        y: -3,
        boxShadow: "0 12px 24px rgba(15,108,189,0.08)",
      }}
      className="
        rounded-2xl
        border border-slate-200
        bg-white/75
        backdrop-blur-md
        p-6
        shadow-sm
      "
    >
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-800">
        {value.toLocaleString()}
        {suffix}
      </h2>
    </motion.div>
  );
}