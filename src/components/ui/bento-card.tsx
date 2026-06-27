"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  Message01Icon,
  Folder02Icon,
  Add01Icon,
  CircleArrowUpRight02Icon,
  Search01Icon,
  BarChartIcon,
  Tick01Icon,
  Settings02Icon,
  InformationCircleIcon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface TabConfig {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  header: string;
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: DashboardSquare01Icon,
    header: "Project Overview",
    description: "Daily summary of your team performance.",
  },
  {
    id: "management",
    label: "Management",
    icon: UserGroupIcon,
    header: "Team Management",
    description: "Manage roles and user permissions.",
    badge: "10",
  },
  {
    id: "threads",
    label: "Threads",
    icon: Message01Icon,
    header: "Communications",
    description: "High-priority team discussions.",
    badge: "12",
  },
  {
    id: "resources",
    label: "Resources",
    icon: Folder02Icon,
    header: "System Assets",
    description: "Shared documentation and media logs.",
  },
];

interface BentoCardProps {
  title?: string;
  description?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({
  title = "Project Dashboard",
  description = "High-performance analytics and team collaboration tools in one place.",
}) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const content = useMemo(() => {
    switch (activeTab.id) {
      case "dashboard":
        return <OverviewDashboard />;
      case "management":
        return <ManagementDashboard />;
      case "threads":
        return <ThreadsDashboard />;
      case "resources":
        return <ResourcesDashboard />;
      default:
        return null;
    }
  }, [activeTab.id]);

  return (
    <LayoutGroup>
      <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-border bg-card p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        {/* subtle inner highlight to lift from pure-black bg */}
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" />
        {/* soft top glow */}
        <div aria-hidden className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left: Title */}
          <div className="lg:col-span-4 p-6 flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-6">
                <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                Live preview
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-[1.1]">
                {title}
              </h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
                {description}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 mt-8 text-xs text-muted-foreground">
              <HugeiconsIcon icon={InformationCircleIcon} size={14} />
              <span>Click tabs to explore</span>
            </div>
          </div>

          {/* Right: Interactive panel */}
          <div className="lg:col-span-8 rounded-2xl border border-border bg-secondary/40 overflow-hidden">

            {/* Window chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400/70" />
                <span className="size-2.5 rounded-full bg-yellow-400/70" />
                <span className="size-2.5 rounded-full bg-green-400/70" />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <HugeiconsIcon icon={Search01Icon} size={12} />
                <span>workspace</span>
              </div>
              <HugeiconsIcon icon={Settings02Icon} size={14} className="text-muted-foreground" />
            </div>

            {/* Tab bar */}
            <div className="px-3 pt-3 border-b border-border">
              <div className="flex items-center gap-1 flex-wrap">
                {TABS.map((tab) => {
                  const isActive = activeTab.id === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <HugeiconsIcon icon={tab.icon} size={14} />
                      <span className="font-medium">{tab.label}</span>
                      {tab.badge && (
                        <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-muted text-foreground/70">
                          {tab.badge}
                        </span>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="bento-tab-pill"
                          className="absolute inset-0 rounded-lg bg-muted/60 -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Header */}
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {activeTab.header}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeTab.description}
                  </p>
                </div>
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                  <HugeiconsIcon icon={CircleArrowUpRight02Icon} size={14} />
                  View all
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 min-h-[260px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
};

export default BentoCard;

/* -------------------- Sub views -------------------- */

const OverviewDashboard = () => (
  <div className="grid grid-cols-2 gap-3">
    <div className="col-span-2 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Team Performance</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">94.2%</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          +12.4%
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "94.2%" }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Score across Search & Delivery campaigns</p>
    </div>

    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={BarChartIcon} size={14} />
        <span className="text-[11px]">Keywords</span>
      </div>
      <p className="mt-2 text-xl font-semibold text-foreground">1,070</p>
    </div>

    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={Tick01Icon} size={14} />
        <span className="text-[11px]">Credits</span>
      </div>
      <p className="mt-2 text-xl font-semibold text-foreground">2.3M</p>
    </div>
  </div>
);

const ManagementDashboard = () => (
  <div className="space-y-2">
    {[
      { name: "Anthony Dionne", role: "Pending admin approval", status: "Waitlist", color: "bg-amber-400" },
      { name: "Nick Yahodin", role: "Dealership group admin", status: "Active", color: "bg-emerald-400" },
      { name: "Mujeeb Aimaq", role: "Dealership group user", status: "Active", color: "bg-emerald-400" },
      { name: "Sarah Chen", role: "Product designer", status: "Active", color: "bg-emerald-400" },
    ].map((user, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-card/70 transition-colors"
      >
        <div className="size-8 rounded-full bg-muted flex items-center justify-center">
          <HugeiconsIcon icon={UserIcon} size={14} className="text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">{user.role}</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className={cn("size-1.5 rounded-full", user.color)} />
          {user.status}
        </div>
      </motion.div>
    ))}
  </div>
);

const ThreadsDashboard = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      {[
        { title: "Create a Page", desc: "Build your project base.", icon: Folder02Icon },
        { title: "Create a Task", desc: "Organize with team.", icon: Tick01Icon },
      ].map((card, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -2 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <HugeiconsIcon icon={card.icon} size={16} className="text-accent" />
          <p className="mt-2 text-xs font-medium text-foreground">{card.title}</p>
          <p className="text-[11px] text-muted-foreground">{card.desc}</p>
          <button className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            <HugeiconsIcon icon={Add01Icon} size={12} />
            Create
          </button>
        </motion.div>
      ))}
    </div>
    <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border">
      <div className="size-7 rounded-lg bg-muted flex items-center justify-center">
        <HugeiconsIcon icon={Add01Icon} size={14} className="text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground flex-1">Pin a new item</p>
      <HugeiconsIcon icon={CircleArrowUpRight02Icon} size={14} className="text-muted-foreground" />
    </div>
  </div>
);

const ResourcesDashboard = () => (
  <div className="space-y-2">
    {[
      { file: "design_spec_v2.pdf", size: "2.4 MB", type: "PDF", icon: Mail01Icon },
      { file: "q4_performance.xls", size: "1.1 MB", type: "XLS", icon: BarChartIcon },
      { file: "branding_assets.zip", size: "48 MB", type: "ZIP", icon: Folder02Icon },
      { file: "system_logs.json", size: "4 KB", type: "JSON", icon: Folder02Icon },
    ].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.04 }}
        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-card/70 transition-colors"
      >
        <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
          <HugeiconsIcon icon={item.icon} size={14} className="text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate">{item.file}</p>
          <p className="text-[11px] text-muted-foreground">{item.size} • {item.type}</p>
        </div>
        <HugeiconsIcon icon={CircleArrowUpRight02Icon} size={14} className="text-muted-foreground" />
      </motion.div>
    ))}
  </div>
);
