"use client";

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";
import { resolvePageMetadata, updateDocumentMetadata, type PageMetadata } from "@/utils/seo";

export type PageRoute =
  | "home"
  | "services"
  | "services/:slug"
  | "team"
  | "team/:id"
  | "about"
  | "gallery"
  | "reviews"
  | "emergency"
  | "insurance"
  | "faq"
  | "book"
  | "contact"
  | "admin"
  | "portal"
  | "patient-portal";

interface NavigationContextType {
  currentPath: string;
  activeSection: string;
  params: Record<string, string>;
  metadata: PageMetadata;
  setCustomMetadata: (meta: Partial<PageMetadata> | null) => void;
  navigate: (path: string, scrollToId?: string) => void;
  openBookingModal: (serviceId?: string, dentistId?: string) => void;
  closeBookingModal: () => void;
  isBookingModalOpen: boolean;
  bookingPreselectedService?: string;
  bookingPreselectedDoctor?: string;
  bookingPreselect: { serviceId?: string; dentistId?: string } | null;
  clearBookingPreselect: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

function parseHash(hash: string): { path: string; params: Record<string, string>; targetSection?: string } {
  const clean = hash.replace(/^#\/?/, "") || "home";
  const parts = clean.split("?")[0].split("/");

  // Match /services/:slug
  if (parts[0] === "services" && parts[1]) {
    return { path: `services/${parts[1]}`, params: { slug: parts[1] } };
  }
  // Match /team/:id or /dentists/:id
  if ((parts[0] === "team" || parts[0] === "dentists") && parts[1]) {
    return { path: `team/${parts[1]}`, params: { id: parts[1] } };
  }
  // Standard routes
  if (["home", "services", "team", "dentists", "about", "gallery", "reviews", "testimonials", "emergency", "insurance", "faq", "book", "appointment", "contact", "admin"].includes(parts[0])) {
    const route = parts[0] === "testimonials" ? "reviews" : parts[0] === "dentists" ? "team" : parts[0] === "appointment" ? "book" : parts[0];
    return { path: route, params: {} };
  }

  return { path: "home", params: {}, targetSection: clean };
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const parsed = parseHash(typeof window !== "undefined" ? window.location.hash : "");
    return parsed.path;
  });
  const [params, setParams] = useState<Record<string, string>>(() => {
    const parsed = parseHash(typeof window !== "undefined" ? window.location.hash : "");
    return parsed.params;
  });
  const [activeSection] = useState<string>("home");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPreselectedService, setBookingPreselectedService] = useState<string | undefined>(undefined);
  const [bookingPreselectedDoctor, setBookingPreselectedDoctor] = useState<string | undefined>(undefined);
  const [bookingPreselect, setBookingPreselect] = useState<{ serviceId?: string; dentistId?: string } | null>(null);
  const [customMetadata, setCustomMetadata] = useState<Partial<PageMetadata> | null>(null);

  // Compute active page metadata based on current path, params, and any custom overrides
  const metadata = useMemo(() => {
    return resolvePageMetadata(currentPath, params, customMetadata);
  }, [currentPath, params, customMetadata]);

  // Synchronize document.title, meta tags, and structured JSON-LD with current page
  useEffect(() => {
    updateDocumentMetadata(metadata);
  }, [metadata]);

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      setCurrentPath(parsed.path);
      setParams(parsed.params);
      setCustomMetadata(null); // Reset page-specific custom overrides on navigation
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (path: string, scrollToId?: string) => {
    const normalized = path.replace(/^#\/?/, "");
    window.location.hash = `#${normalized}`;
    const parsed = parseHash(`#${normalized}`);
    setCurrentPath(parsed.path);
    setParams(parsed.params);
    setCustomMetadata(null); // Reset page-specific custom overrides on navigation

    if (scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openBookingModal = (serviceId?: string, dentistId?: string) => {
    setBookingPreselectedService(serviceId);
    setBookingPreselectedDoctor(dentistId);
    setBookingPreselect({ serviceId, dentistId });
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const clearBookingPreselect = () => {
    setBookingPreselect(null);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPath,
        activeSection,
        params,
        metadata,
        setCustomMetadata,
        navigate,
        openBookingModal,
        closeBookingModal,
        isBookingModalOpen,
        bookingPreselectedService,
        bookingPreselectedDoctor,
        bookingPreselect,
        clearBookingPreselect,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

export function useMetadata() {
  const { metadata, setCustomMetadata } = useNavigation();
  return { metadata, setCustomMetadata };
}

