import { clinic, detailedServices, dentists, images } from "@/data/site";

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: "website" | "article" | "profile";
  twitterCard: "summary" | "summary_large_image";
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_KEYWORDS =
  "dentist san francisco, bayview dental clinic, cosmetic dentistry, invisalign bay area, dental implants SF, gentle dentistry, emergency dentist, teeth whitening, porcelain veneers, pediatric dentist";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://luminadentalstudio.com";

/**
 * Resolves SEO metadata based on current path and route params
 */
export function resolvePageMetadata(
  path: string,
  params: Record<string, string> = {},
  customOverride: Partial<PageMetadata> | null = null
): PageMetadata {
  const cleanPath = (path || "home").toLowerCase();

  let metadata: PageMetadata = {
    title: `${clinic.name} — Modern & Gentle Dentistry in San Francisco`,
    description:
      "Experience anxiety-free, state-of-the-art dental care in San Francisco. Comprehensive general, cosmetic, Invisalign, implants & 24/7 emergency dentistry.",
    keywords: DEFAULT_KEYWORDS,
    canonicalUrl: `${BASE_URL}/#${cleanPath === "home" ? "" : cleanPath}`,
    ogTitle: `${clinic.name} — Modern & Gentle Dentistry in San Francisco`,
    ogDescription:
      "Experience anxiety-free, state-of-the-art dental care in San Francisco. Comprehensive general, cosmetic, Invisalign, implants & 24/7 emergency dentistry.",
    ogImage: images.heroWarm,
    ogType: "website",
    twitterCard: "summary_large_image",
    noIndex: false,
  };

  // Check dynamic route: services/:slug
  if (cleanPath.startsWith("services/") || params.slug) {
    const slug = params.slug || cleanPath.replace("services/", "");
    const service = detailedServices.find(
      (s) => s.slug.toLowerCase() === slug.toLowerCase() || s.id.toLowerCase() === slug.toLowerCase()
    );

    if (service) {
      metadata = {
        title: `${service.title} in San Francisco — ${clinic.name}`,
        description: `${service.tagline} ${service.blurb.slice(0, 120)}... Book your consultation today.`,
        keywords: `${service.title.toLowerCase()}, ${service.category.toLowerCase()} dentist, ${DEFAULT_KEYWORDS}`,
        canonicalUrl: `${BASE_URL}/#services/${service.slug}`,
        ogTitle: `${service.title} | ${clinic.name}`,
        ogDescription: service.fullDescription.slice(0, 160),
        ogImage: images.clinicTech,
        ogType: "article",
        twitterCard: "summary_large_image",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          name: service.title,
          description: service.fullDescription,
          procedureType: "NoninvasiveProcedure",
          provider: {
            "@type": "Dentist",
            name: clinic.name,
            telephone: clinic.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: clinic.address.line1,
              addressLocality: clinic.address.city,
              addressRegion: clinic.address.region,
              postalCode: clinic.address.postalCode,
            },
          },
        },
      };
      if (customOverride) return { ...metadata, ...customOverride };
      return metadata;
    }
  }

  // Check dynamic route: team/:id or dentists/:id
  if (cleanPath.startsWith("team/") || cleanPath.startsWith("dentists/") || params.id) {
    const dentistId = params.id || cleanPath.replace(/^(team|dentists)\//, "");
    const doc = dentists.find(
      (d) => d.id.toLowerCase() === dentistId.toLowerCase()
    );

    if (doc) {
      metadata = {
        title: `${doc.name}, ${doc.credentials} — ${doc.role} | ${clinic.name}`,
        description: `Meet ${doc.name}, ${doc.role} at ${clinic.name}. ${doc.education}. Specializing in ${doc.focus.join(", ")}.`,
        keywords: `${doc.name.toLowerCase()}, dentist san francisco, ${doc.focus.join(", ").toLowerCase()}`,
        canonicalUrl: `${BASE_URL}/#team/${doc.id}`,
        ogTitle: `${doc.name} — ${doc.role}`,
        ogDescription: doc.bio,
        ogImage: doc.img,
        ogType: "profile",
        twitterCard: "summary_large_image",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Physician",
          name: doc.name,
          jobTitle: doc.role,
          description: doc.fullBio,
          image: doc.img,
          worksFor: {
            "@type": "Dentist",
            name: clinic.name,
          },
        },
      };
      if (customOverride) return { ...metadata, ...customOverride };
      return metadata;
    }
  }

  // Route-specific static pages
  switch (cleanPath) {
    case "services":
      metadata = {
        title: `Comprehensive Dental Treatments & Procedures — ${clinic.name}`,
        description:
          "Explore our dental treatments in SF: Cosmetic Veneers, Diamond+ Invisalign, Dental Implants, Preventive Exams, Pediatric, and Laser Whitening.",
        keywords: "dental services, cosmetic dentistry, clear aligners, dental implants, teeth cleaning, san francisco dental clinic",
        canonicalUrl: `${BASE_URL}/#services`,
        ogTitle: `Dental Treatments Catalog — ${clinic.name}`,
        ogDescription: "World-class dental treatments tailored to your comfort and health.",
        ogImage: images.clinicTech,
        ogType: "website",
        twitterCard: "summary_large_image",
      };
      break;

    case "team":
    case "dentists":
      metadata = {
        title: `Our Dentists & Clinical Specialists — ${clinic.name}`,
        description:
          "Meet Dr. Sarah Chen, Dr. Marcus Vance, and our multidisciplinary team of board-certified cosmetic dentists, orthodontists, and dental hygienists.",
        keywords: "san francisco dentists, cosmetic dentist, orthodontist, UCSF dentist, gentle dental team",
        canonicalUrl: `${BASE_URL}/#dentists`,
        ogTitle: `Meet Our Dental Specialists — ${clinic.name}`,
        ogDescription: "Experienced, compassionate dental professionals dedicated to stress-free oral health.",
        ogImage: images.dentists[0],
        ogType: "website",
        twitterCard: "summary_large_image",
      };
      break;

    case "about":
    case "why":
      metadata = {
        title: `About Our Studio & Modern Technology — ${clinic.name}`,
        description:
          "Discover Lumina Dental Studio in Bayview SF. Low-dose 3D CBCT, iTero digital scans, spa-grade amenities, and biomimetic tooth preservation.",
        keywords: "about lumina dental, modern dental clinic san francisco, biomimetic dentistry, 3d dental scan",
        canonicalUrl: `${BASE_URL}/#about`,
        ogTitle: `About Our Dental Studio — ${clinic.name}`,
        ogDescription: "Where clinical excellence meets warm hospitality in San Francisco.",
        ogImage: images.aboutInterior,
        ogType: "website",
        twitterCard: "summary_large_image",
      };
      break;

    case "gallery":
      metadata = {
        title: `Smile Transformation Gallery & Before/After Cases — ${clinic.name}`,
        description:
          "View real patient before-and-after smile transformations. High-resolution cases of porcelain veneers, clear aligners, and restorative smile makeovers.",
        keywords: "dental before and after, veneer results, smile makeover gallery, invisalign results san francisco",
        canonicalUrl: `${BASE_URL}/#gallery`,
        ogTitle: `Smile Transformations & Before/After Gallery — ${clinic.name}`,
        ogDescription: "Real smiles, real confidence. Browse genuine patient transformations.",
        ogImage: images.gallery[0],
        ogType: "website",
        twitterCard: "summary_large_image",
      };
      break;

    case "reviews":
    case "testimonials":
      metadata = {
        title: `Patient Reviews & Testimonials (4.9★) — ${clinic.name}`,
        description:
          "Read over 850 verified patient reviews and testimonials for Lumina Dental Studio. Rated 4.9/5 stars for painless care and friendly staff in San Francisco.",
        keywords: "lumina dental reviews, dentist reviews san francisco, patient testimonials, 5 star dentist sf",
        canonicalUrl: `${BASE_URL}/#reviews`,
        ogTitle: `Patient Testimonials & Reviews — ${clinic.name}`,
        ogDescription: "Rated 4.9 stars across hundreds of verified patient reviews.",
        ogImage: images.heroWarm,
        ogType: "website",
        twitterCard: "summary_large_image",
      };
      break;

    case "emergency":
      metadata = {
        title: `24/7 Emergency Dental Care & Same-Day Relief — ${clinic.name}`,
        description:
          "Urgent dental emergency in San Francisco? Same-day pain relief for toothaches, knocked-out teeth, broken crowns, and dental trauma. Call (415) 555-0192.",
        keywords: "emergency dentist san francisco, urgent toothache relief, broken tooth repair, 24/7 dental clinic",
        canonicalUrl: `${BASE_URL}/#emergency`,
        ogTitle: `Urgent Emergency Dental Care — ${clinic.name}`,
        ogDescription: "Same-day appointments and triage for severe toothaches and injuries.",
        ogImage: images.aboutCare,
        ogType: "website",
        twitterCard: "summary_large_image",
      };
      break;

    case "insurance":
    case "pricing":
      metadata = {
        title: `Dental Insurance, 0% Financing & Clear Pricing — ${clinic.name}`,
        description:
          "Affordable dental care in SF. In-network with Delta Dental, MetLife, Cigna, Aetna, Guardian. 0% APR monthly financing plans with CareCredit & Sunbit.",
        keywords: "dental insurance accepted, delta dental provider sf, affordable dentist, dental financing 0 percent",
        canonicalUrl: `${BASE_URL}/#insurance`,
        ogTitle: `Dental Insurance & Flexible Financing — ${clinic.name}`,
        ogDescription: "Transparent fees and maximum insurance benefits without surprise bills.",
        ogImage: images.whyCare,
        ogType: "website",
        twitterCard: "summary_large_image",
      };
      break;

    case "faq":
      metadata = {
        title: `Frequently Asked Questions & Patient Guide — ${clinic.name}`,
        description:
          "Answers to common dental questions about insurance, veneer longevity, Invisalign duration, teeth whitening sensitivity, and anxiety sedation.",
        keywords: "dental faq, dentist questions, veneer cost faq, invisalign guide",
        canonicalUrl: `${BASE_URL}/#faq`,
        ogTitle: `Frequently Asked Questions — ${clinic.name}`,
        ogDescription: "Everything you need to know about visiting Lumina Dental Studio.",
        ogImage: images.clinicTech,
        ogType: "website",
        twitterCard: "summary_large_image",
      };
      break;

    case "book":
    case "appointment":
      metadata = {
        title: `Book an Appointment Online — ${clinic.name}`,
        description:
          "Schedule your dental cleaning, exam, cosmetic consultation or emergency visit online in 60 seconds. Real-time slot availability with instant confirmation.",
        keywords: "book dentist appointment, schedule dental cleaning, dentist online booking san francisco",
        canonicalUrl: `${BASE_URL}/#book`,
        ogTitle: `Online Appointment Scheduling — ${clinic.name}`,
        ogDescription: "Reserve your appointment with our San Francisco dental specialists.",
        ogImage: images.heroWarm,
        ogType: "website",
        twitterCard: "summary_large_image",
      };
      break;

    case "contact":
      metadata = {
        title: `Contact & Visit Our Bayview Clinic — ${clinic.name}`,
        description:
          "Find Lumina Dental Studio at 248 Bayview Terrace, Suite 200, San Francisco. Office hours, map directions, parking details, phone, and email.",
        keywords: "lumina dental address, contact dentist sf, bayview dentist directions, dental clinic phone",
        canonicalUrl: `${BASE_URL}/#contact`,
        ogTitle: `Contact & Location Directions — ${clinic.name}`,
        ogDescription: "Conveniently located in Bayview, San Francisco with complimentary garage parking.",
        ogImage: images.aboutInterior,
        ogType: "website",
        twitterCard: "summary_large_image",
      };
      break;

    case "portal":
    case "patient-portal":
      metadata = {
        title: `Secure Patient Health Record Portal — ${clinic.name}`,
        description: "Access your personalized dental records, 3D intraoral scans, upcoming visit schedules, digital treatment plans, and contactless check-in.",
        keywords: "patient portal, dental records, digital x-rays, check in online, lumina dental studio",
        canonicalUrl: `${BASE_URL}/#portal`,
        ogTitle: `Patient Health Record Portal — ${clinic.name}`,
        ogDescription: "Secure HIPAA-compliant patient portal for clinical records, appointments, and diagnostic imaging.",
        ogImage: images.heroWarm,
        ogType: "website",
        twitterCard: "summary",
        noIndex: true, // Secure patient portal should not be indexed by public search bots
      };
      break;

    case "admin":
      metadata = {
        title: `Clinical Staff & Admin Portal — ${clinic.name}`,
        description: "Restricted administrative portal for Lumina Dental staff and clinical scheduling.",
        keywords: "admin, dental clinic internal",
        canonicalUrl: `${BASE_URL}/#admin`,
        ogTitle: `Staff Portal — ${clinic.name}`,
        ogDescription: "Internal clinical management portal.",
        ogImage: images.heroWarm,
        ogType: "website",
        twitterCard: "summary",
        noIndex: true, // Crucial for discoverability: prevent search engines from indexing the admin login
      };
      break;

    default:
      break;
  }

  if (customOverride) {
    return { ...metadata, ...customOverride };
  }

  return metadata;
}

/**
 * Updates or creates a <meta> element in document.head
 */
function setMetaTag(selector: string, attrName: string, attrValue: string, content: string): void {
  if (typeof document === "undefined") return;

  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Updates or creates a <link rel="..."> element in document.head
 */
function setLinkTag(rel: string, href: string): void {
  if (typeof document === "undefined") return;

  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Updates the document title, canonical link, meta tags, and structured data
 */
export function updateDocumentMetadata(meta: PageMetadata): void {
  if (typeof document === "undefined") return;

  // 1. Document Title
  if (document.title !== meta.title) {
    document.title = meta.title;
  }

  // 2. Primary Meta Tags
  setMetaTag('meta[name="description"]', "name", "description", meta.description);
  setMetaTag('meta[name="keywords"]', "name", "keywords", meta.keywords);

  // 3. Robots meta (noindex on admin page, index on all public pages)
  const robotsContent = meta.noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large";
  setMetaTag('meta[name="robots"]', "name", "robots", robotsContent);

  // 4. Canonical link
  if (meta.canonicalUrl) {
    setLinkTag("canonical", meta.canonicalUrl);
  }

  // 5. Open Graph / Facebook / WhatsApp
  setMetaTag('meta[property="og:title"]', "property", "og:title", meta.ogTitle || meta.title);
  setMetaTag('meta[property="og:description"]', "property", "og:description", meta.ogDescription || meta.description);
  setMetaTag('meta[property="og:type"]', "property", "og:type", meta.ogType || "website");
  setMetaTag('meta[property="og:url"]', "property", "og:url", meta.canonicalUrl);
  if (meta.ogImage) {
    setMetaTag('meta[property="og:image"]', "property", "og:image", meta.ogImage);
  }

  // 6. Twitter Card
  setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", meta.twitterCard || "summary_large_image");
  setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", meta.ogTitle || meta.title);
  setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", meta.ogDescription || meta.description);
  if (meta.ogImage) {
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", meta.ogImage);
  }

  // 7. Dynamic JSON-LD Structured Data
  const existingJsonLd = document.getElementById("dynamic-seo-schema");
  if (meta.jsonLd) {
    if (!existingJsonLd) {
      const script = document.createElement("script");
      script.id = "dynamic-seo-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(meta.jsonLd);
      document.head.appendChild(script);
    } else {
      existingJsonLd.textContent = JSON.stringify(meta.jsonLd);
    }
  } else if (existingJsonLd) {
    existingJsonLd.remove();
  }
}
