"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Menu,
  Phone,
  Shield,
  X,
  Search,
  Sparkles,
  HeartPulse,
  Calendar,
  MessageCircle,
  Clock,
  MapPin,
  Star,
  Users,
  User,
  Info,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { clinic, navItems, type NavGroup, type NavLink } from "@/data/site";
import { useScrolled } from "@/hooks/useScroll";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useNavigation } from "@/context/NavigationContext";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Navbar() {
  const scrolled = useScrolled(16);
  const { currentPath, navigate, openBookingModal } = useNavigation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>("Services");

  const isHomePage = currentPath === "home" || currentPath === "";

  type NavItemConfig = NavGroup & { shortLabel?: string; hideOnLg?: boolean };

  const desktopNavItems: NavItemConfig[] = [
    { ...navItems.find((i) => i.label === "Services")!, shortLabel: "Services" },
    { ...navItems.find((i) => i.label === "Dentists")!, shortLabel: "Dentists" },
    { ...navItems.find((i) => i.label === "Smile Gallery")!, shortLabel: "Gallery" },
    { ...navItems.find((i) => i.label === "About Studio")!, shortLabel: "About" },
    { ...navItems.find((i) => i.label === "Insurance & Pricing")!, shortLabel: "Pricing", hideOnLg: true },
    { ...navItems.find((i) => i.label === "Contact")!, shortLabel: "Contact", hideOnLg: true },
    {
      label: "More",
      shortLabel: "More",
      href: "#more",
      page: "more",
      children: [
        { label: "Insurance & 0% Financing", href: "#insurance", page: "insurance" },
        { label: "Studio Location & Contact", href: "#contact", page: "contact" },
        { label: "Patient Reviews", href: "#reviews", page: "reviews" },
        { label: "Frequently Asked Questions", href: "#faq", page: "faq" },
        { label: "24/7 Emergency Care", href: "#emergency", page: "emergency" },
        { label: "Clinical Staff Portal", href: "admin", page: "admin" },
      ],
    },
  ].filter(Boolean);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Tone: On homepage top it is light (over dark hero), on scrolled or inner pages it is dark
  const tone: "light" | "dark" = !isHomePage || scrolled ? "dark" : "light";
  const linkText =
    tone === "light" ? "text-white/85 hover:text-white" : "text-ink/75 hover:text-ink";

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    setMobileSearch("");
    const clean = href.replace(/^#\/?/, "");
    navigate(clean);
  };

  // Filter items for search
  const filteredNav = navItems.filter((item) => {
    if (!mobileSearch.trim()) return true;
    const q = mobileSearch.toLowerCase();
    const matchLabel = item.label.toLowerCase().includes(q);
    const matchChild = item.children?.some((c) => c.label.toLowerCase().includes(q));
    return matchLabel || matchChild;
  });

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 w-full">
        <div
          className={cn(
            "transition-all duration-500",
            tone === "dark"
              ? "border-b border-ink/5 bg-cream/90 shadow-soft backdrop-blur-xl"
              : "border-b border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label="Primary"
            className="mx-auto flex w-full max-w-7xl xl:max-w-[1380px] 2xl:max-w-[1560px] items-center justify-between gap-3 lg:gap-4 xl:gap-6 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3"
          >
            <button
              onClick={() => navigate("home")}
              aria-label={`${clinic.name} — home`}
              className="shrink-0 text-left cursor-pointer"
            >
              <Logo tone={tone === "light" ? "light" : "dark"} />
            </button>

            {/* Desktop nav */}
            <ul className="hidden items-center gap-0.5 xl:gap-1.5 2xl:gap-2.5 lg:flex shrink-0">
              {desktopNavItems.map((item, idx) => {
                const itemRoute = item.href.replace(/^#\/?/, "");
                const isCurrent =
                  (itemRoute === "home" && isHomePage) ||
                  (itemRoute !== "home" && currentPath.startsWith(itemRoute));
                const hasChildren = !!item.children?.length;
                const isNearRight = idx >= 4;

                return (
                  <li
                    key={item.label}
                    className={cn("group relative", item.hideOnLg && "hidden xl:block")}
                  >
                    <button
                      onClick={() => handleLinkClick(item.href)}
                      className={cn(
                        "relative inline-flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-[0.75rem] xl:text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap",
                        linkText,
                        isCurrent &&
                          (tone === "light" ? "text-white" : "text-brand-700"),
                      )}
                    >
                      <span>{item.shortLabel || item.label}</span>
                      {hasChildren ? (
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180",
                            tone === "light" ? "text-white/70" : "text-ink/40",
                          )}
                          strokeWidth={2.5}
                        />
                      ) : null}
                      {isCurrent ? (
                        <span className="absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full bg-gold" />
                      ) : null}
                    </button>

                    {hasChildren ? (
                      <div
                        role="menu"
                        className={cn(
                          "invisible absolute top-full z-50 min-w-[240px] origin-top translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                          isNearRight ? "right-0" : "left-0",
                        )}
                      >
                        <div className="rounded-2xl border border-ink/8 bg-white/95 p-2 shadow-card backdrop-blur-xl">
                          {item.children!.map((c: NavLink) => (
                            <button
                              key={c.href + c.label}
                              onClick={() => handleLinkClick(c.href)}
                              role="menuitem"
                              className="block w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-medium text-ink/75 transition-colors hover:bg-brand-50 hover:text-brand-700"
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <a
                href={clinic.phoneHref}
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 xl:px-3 py-1.5 text-xs font-semibold transition-all shrink-0",
                  tone === "light"
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    : "border-ink/10 bg-white/80 text-brand-800 hover:bg-brand-50 hover:border-brand-300 shadow-2xs"
                )}
                title={`Call ${clinic.name}: ${clinic.phone}`}
                aria-label={`Call ${clinic.phone}`}
              >
                <Phone className="h-3.5 w-3.5 text-brand-600 shrink-0" strokeWidth={2.2} />
                <span className="hidden min-[1640px]:inline font-mono tracking-tight">{clinic.phone}</span>
                <span className="min-[1640px]:hidden font-medium">Call</span>
              </a>

              <button
                onClick={() => navigate("portal")}
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 xl:px-3 py-1.5 text-xs font-semibold transition-colors shrink-0",
                  currentPath === "portal" || currentPath === "patient-portal"
                    ? "border-brand-500 bg-brand-50 text-brand-800"
                    : "border-ink/10 bg-white/70 text-ink/80 hover:bg-sand/60 hover:text-ink"
                )}
                title="Secure Patient Health Records Portal"
              >
                <User className="h-3.5 w-3.5 text-brand-700 shrink-0" />
                <span className="hidden min-[1500px]:inline">Patient </span>Portal
              </button>

              <Button
                onClick={() => openBookingModal()}
                variant={tone === "light" ? "light" : "primary"}
                size="sm"
                className="hidden sm:inline-flex shrink-0 px-3.5 xl:px-4 text-xs font-semibold whitespace-nowrap"
              >
                Book Appointment
              </Button>

              {/* Mobile toggle with crisp contrast */}
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 bg-white/95 text-ink shadow-soft transition-all duration-200 hover:bg-white active:scale-95 lg:hidden"
              >
                <span className="relative h-5 w-5">
                  <Menu
                    className={cn(
                      "absolute inset-0 h-5 w-5 transition-all duration-300 text-ink",
                      mobileOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
                    )}
                  />
                  <X
                    className={cn(
                      "absolute inset-0 h-5 w-5 transition-all duration-300 text-ink",
                      mobileOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
                    )}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
            />

            {/* Menu Sheet */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-[2rem] border-t border-ink/10 bg-[#fdfbf7] shadow-2xl overflow-hidden"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-ink/8 px-6 py-4">
                <Logo tone="dark" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sand/60 text-ink/70 hover:bg-sand hover:text-ink transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search Bar in Mobile Menu */}
              <div className="border-b border-ink/8 px-6 py-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <input
                    type="text"
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    placeholder="Search services, dentists, reviews, pricing..."
                    className="w-full rounded-xl border border-ink/10 bg-white py-2 pl-9 pr-3 text-xs text-ink placeholder:text-ink/40 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                  />
                  {mobileSearch && (
                    <button
                      onClick={() => setMobileSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Navigation List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                {filteredNav.map((item) => {
                  const hasChildren = Boolean(item.children?.length);
                  const isExpanded = expandedSection === item.label;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-ink/5 bg-white/80 overflow-hidden shadow-soft transition-all"
                    >
                      <div className="flex items-center justify-between p-3.5">
                        <button
                          onClick={() => handleLinkClick(item.href)}
                          className="flex items-center gap-3 text-left font-display text-sm font-bold text-ink hover:text-brand-700 transition-colors flex-1"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
                            {item.label === "Home" && <Sparkles className="h-4 w-4" />}
                            {item.label === "Services" && <HeartPulse className="h-4 w-4" />}
                            {item.label === "Dentists" && <Users className="h-4 w-4" />}
                            {item.label === "About Studio" && <Info className="h-4 w-4" />}
                            {item.label === "Smile Gallery" && <Star className="h-4 w-4" />}
                            {item.label === "Reviews" && <MessageCircle className="h-4 w-4" />}
                            {item.label === "Insurance & Pricing" && <CheckCircle className="h-4 w-4" />}
                            {item.label === "Emergency" && <Clock className="h-4 w-4 text-rose-600" />}
                            {item.label === "FAQ" && <HelpCircle className="h-4 w-4" />}
                            {item.label === "Contact" && <MapPin className="h-4 w-4" />}
                          </span>
                          <span>{item.label}</span>
                        </button>

                        {hasChildren && (
                          <button
                            onClick={() =>
                              setExpandedSection(isExpanded ? null : item.label)
                            }
                            className="p-2 text-ink/40 hover:text-ink transition-colors"
                            aria-label="Toggle sub-services"
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isExpanded && "rotate-180 text-brand-700",
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {hasChildren && isExpanded && (
                        <div className="border-t border-ink/5 bg-sand/30 p-2 space-y-1">
                          {item.children!.map((child) => (
                            <button
                              key={child.href + child.label}
                              onClick={() => handleLinkClick(child.href)}
                              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-ink/75 hover:bg-brand-50 hover:text-brand-800 transition-colors"
                            >
                              <span>{child.label}</span>
                              <span className="text-[0.65rem] text-brand-600 font-semibold uppercase tracking-wider">
                                View
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Patient Health Portal Button in Mobile Menu */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("portal");
                    }}
                    className="flex w-full items-center justify-between rounded-2xl border border-brand-300 bg-brand-50/90 p-3.5 text-xs font-bold text-brand-900 hover:bg-brand-100 transition-colors shadow-xs"
                  >
                    <span className="flex items-center gap-2.5">
                      <User className="h-4 w-4 text-brand-700" />
                      <span>Patient Health & Records Portal</span>
                    </span>
                    <span className="rounded-full bg-brand-200 px-2 py-0.5 text-[0.65rem] font-bold text-brand-900">
                      Login
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("admin");
                    }}
                    className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-sand/40 p-3.5 text-xs font-semibold text-ink/75 hover:bg-sand transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Shield className="h-4 w-4 text-brand-600" />
                      <span>Clinical Staff & Admin Portal</span>
                    </span>
                    <span className="rounded-full bg-sand/80 px-2 py-0.5 text-[0.65rem] font-bold text-ink/70">
                      PIN: 1234
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom Quick Action CTAs */}
              <div className="border-t border-ink/10 bg-white p-5 space-y-3">
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    openBookingModal();
                  }}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center shadow-lift text-sm font-bold"
                >
                  <Calendar className="mr-2 h-4 w-4" /> Book Appointment Online
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={clinic.phoneHref}
                    className="flex items-center justify-center gap-2 rounded-xl border border-ink/15 bg-sand/40 py-2.5 text-xs font-bold text-ink hover:bg-sand transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-brand-700" />
                    Call (415) 555-0192
                  </a>
                  <a
                    href={`https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent("Hi Lumina Dental! I'd like to book a visit.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
