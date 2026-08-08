import { createServerClient } from "./supabase/server";

const mockServices = [
  {
    id: "1",
    slug: "whitening",
    name: "Professional Whitening",
    summary: "Brighten your smile in just one visit.",
    content: "Our advanced laser whitening technology provides immediate results with minimal sensitivity.",
    duration_minutes: 60,
    price_text: "Starting at $299",
  },
  {
    id: "2",
    slug: "cleaning",
    name: "Comprehensive Cleaning",
    summary: "Routine checkup and professional cleaning.",
    content: "Maintain optimal oral health with our thorough cleaning and examination.",
    duration_minutes: 45,
    price_text: "Covered by most insurance",
  },
  {
    id: "3",
    slug: "implants",
    name: "Dental Implants",
    summary: "Permanent solution for missing teeth.",
    content: "State-of-the-art implant procedures for a natural-looking and feeling restoration.",
    duration_minutes: 120,
    price_text: "Consultation required",
  },
];

const mockFaqs = [
  {
    id: "1",
    category: "General",
    question: "Are you accepting new patients?",
    answer: "Yes, we are currently accepting new patients! You can book an appointment online or call our clinic directly.",
  },
  {
    id: "2",
    category: "Services",
    question: "How long does a professional whitening session take?",
    answer: "A typical in-office laser whitening session takes about 60 minutes and can brighten your smile by several shades in just one visit.",
  },
  {
    id: "3",
    category: "Billing",
    question: "Do you offer payment plans?",
    answer: "Yes, we partner with CareCredit and offer in-house payment plans for extensive treatments like implants and orthodontics.",
  }
];

export async function getServices() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("display_order");
      
    if (error) throw error;
    return data || mockServices;
  } catch (e) {
    console.warn("Supabase not configured or failed, returning mock services", e);
    return mockServices;
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .single();
      
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn("Supabase not configured or failed, returning mock service", e);
    return mockServices.find(s => s.slug === slug);
  }
}

export async function getFaqs(category?: string, query?: string) {
  try {
    const supabase = createServerClient();
    let q = supabase
      .from("faqs")
      .select("*")
      .eq("published", true)
      .order("display_order");
      
    if (category) {
      q = q.eq("category", category);
    }
    if (query) {
      q = q.ilike("question", `%${query}%`);
    }

    const { data, error } = await q;
    if (error) throw error;
    return data || mockFaqs;
  } catch (e) {
    console.warn("Supabase not configured or failed, returning mock faqs", e);
    let filtered = mockFaqs;
    if (category) filtered = filtered.filter(f => f.category === category);
    if (query) filtered = filtered.filter(f => f.question.toLowerCase().includes(query.toLowerCase()));
    return filtered;
  }
}
