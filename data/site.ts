import {
  Activity,
  Anchor,
  Baby,
  ShieldCheck,
  Sparkles,
  Siren,
  Stethoscope,
  Sun,
  Syringe,
  Smile,
  Clock,
  HeartPulse,
  Microscope,
  BadgeCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
export type NavLink = { label: string; href: string; page?: string };
export type NavGroup = { label: string; href: string; page?: string; children?: NavLink[] };

/* ------------------------------------------------------------------ */
/* Clinic Info                                                        */
/* ------------------------------------------------------------------ */
export const clinic = {
  name: "Lumina Dental Studio",
  shortName: "Lumina",
  tagline: "Modern dentistry, beautifully done.",
  phone: "(415) 555-0192",
  phoneHref: "tel:+14155550192",
  whatsapp: "14155550192",
  email: "hello@luminadental.com",
  address: {
    line1: "248 Bayview Terrace, Suite 200",
    city: "San Francisco",
    region: "CA",
    postalCode: "94110",
    country: "US",
  },
  mapQuery: "248 Bayview Terrace, San Francisco, CA 94110",
  mapsEmbed:
    "https://www.google.com/maps?q=248+Bayview+Terrace,+San+Francisco,+CA+94110&output=embed",
};

/* ------------------------------------------------------------------ */
/* Multi-page Navigation                                              */
/* ------------------------------------------------------------------ */
export const navItems: NavGroup[] = [
  {
    label: "Home",
    href: "#home",
    page: "home",
  },
  {
    label: "Services",
    href: "#services",
    page: "services",
    children: [
      { label: "All Services Overview", href: "#services", page: "services" },
      { label: "Cosmetic & Veneers", href: "#services/cosmetic", page: "services" },
      { label: "Invisalign & Aligners", href: "#services/invisalign", page: "services" },
      { label: "Dental Implants", href: "#services/implants", page: "services" },
      { label: "Teeth Whitening", href: "#services/whitening", page: "services" },
      { label: "General & Family Care", href: "#services/general", page: "services" },
      { label: "Pediatric Dentistry", href: "#services/pediatric", page: "services" },
      { label: "Emergency Care", href: "#emergency", page: "emergency" },
    ],
  },
  {
    label: "Dentists",
    href: "#team",
    page: "team",
    children: [
      { label: "Meet the Team", href: "#team", page: "team" },
      { label: "Dr. Sarah Chen, DDS", href: "#team/sarah-chen", page: "team" },
      { label: "Dr. Marcus Vance, DMD", href: "#team/marcus-vance", page: "team" },
      { label: "Dr. Elena Rostova, MS", href: "#team/elena-rostova", page: "team" },
    ],
  },
  { label: "About Studio", href: "#about", page: "about" },
  { label: "Smile Gallery", href: "#gallery", page: "gallery" },
  { label: "Reviews", href: "#reviews", page: "reviews" },
  { label: "Insurance & Pricing", href: "#insurance", page: "insurance" },
  { label: "Emergency", href: "#emergency", page: "emergency" },
  { label: "FAQ", href: "#faq", page: "faq" },
  { label: "Contact", href: "#contact", page: "contact" },
];

/* ------------------------------------------------------------------ */
/* Imagery                                                            */
/* ------------------------------------------------------------------ */
const px = (path: string, w: number, h: number) =>
  `https://images.pexels.com/photos/${path}?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const images = {
  heroWarm: px("3884101/pexels-photo-3884101.jpeg", 1100, 1320),
  aboutInterior: px("5355920/pexels-photo-5355920.jpeg", 1100, 980),
  aboutCare: px("3884103/pexels-photo-3884103.jpeg", 760, 900),
  whyCare: px("4562895/pexels-photo-4562895.jpeg", 1200, 920),
  clinicTech: px("3845625/pexels-photo-3845625.jpeg", 1200, 800),
  chairComfort: px("3845766/pexels-photo-3845766.jpeg", 1200, 800),
  gallery: [
    px("3762402/pexels-photo-3762402.jpeg", 800, 640),
    px("3762453/pexels-photo-3762453.jpeg", 800, 640),
    px("3762400/pexels-photo-3762400.jpeg", 800, 640),
    px("41208/fun-cold-elegance-face-41208.jpeg", 800, 640),
    px("65665/smile-mouth-teeth-laugh-65665.jpeg", 800, 640),
    px("3762464/pexels-photo-3762464.jpeg", 800, 640),
  ],
  dentists: [
    px("37458046/pexels-photo-37458046.jpeg", 800, 1000),
    px("5355860/pexels-photo-5355860.jpeg", 800, 1000),
    px("31043311/pexels-photo-31043311.jpeg", 800, 1000),
  ],
  avatars: [
    px("6497114/pexels-photo-6497114.jpeg", 200, 200),
    px("30701542/pexels-photo-30701542.jpeg", 200, 200),
    px("804009/pexels-photo-804009.jpeg", 200, 200),
    px("37272329/pexels-photo-37272329.png", 200, 200),
    px("14950779/pexels-photo-14950779.jpeg", 200, 200),
    px("6102841/pexels-photo-6102841.jpeg", 200, 200),
  ],
};

/* ------------------------------------------------------------------ */
/* Stats                                                              */
/* ------------------------------------------------------------------ */
export const stats = [
  { value: "18+", label: "Years of excellence" },
  { value: "25k+", label: "Smiles transformed" },
  { value: "4.9★", label: "Patient satisfaction" },
  { value: "100%", label: "Anxiety-free guarantee" },
];

/* ------------------------------------------------------------------ */
/* Comprehensive Service Catalog                                      */
/* ------------------------------------------------------------------ */
export interface ServiceDetail {
  id: string;
  slug: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  category: "Cosmetic" | "Orthodontics" | "Restorative" | "Preventive" | "Emergency" | "Pediatric";
  blurb: string;
  fullDescription: string;
  points: string[];
  duration: string;
  priceEstimate: string;
  insuranceCovered: string;
  accent: boolean;
  idealFor: string[];
  steps: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const detailedServices: ServiceDetail[] = [
  {
    id: "cosmetic",
    slug: "cosmetic",
    icon: Sparkles,
    title: "Cosmetic Dentistry & Veneers",
    tagline: "Artistry meets precision for your dream smile.",
    category: "Cosmetic",
    blurb:
      "Handcrafted porcelain veneers, composite bonding, and digital smile makeovers tailored to your natural facial symmetry.",
    fullDescription:
      "Our cosmetic dentistry merges fine artistry with biomimetic ceramic engineering. Using 3D intraoral digital photography and facial aesthetic mapping, we preview your new smile before touching a tooth. Whether correcting discoloration, gaps, chips, or alignment, our ultra-thin porcelain veneers deliver breathtaking, natural-looking results.",
    points: ["Handmade feldspathic & e.max veneers", "Micro-aesthetic composite bonding", "Digital smile preview & mock-up", "Minimal tooth preparation"],
    duration: "2 visits over 2 weeks",
    priceEstimate: "$1,200 – $2,400 per tooth (0% APR financing available)",
    insuranceCovered: "Partially (restorative or replacement components)",
    accent: true,
    idealFor: [
      "Discolored or intrinsically stained teeth",
      "Chipped, worn, or unevenly sized teeth",
      "Gaps or minor crowding without braces",
      "Patients seeking Hollywood or natural glow upgrades",
    ],
    steps: [
      { step: "01", title: "Digital Aesthetic Scan & Consultation", desc: "High-definition 3D scanning, photographic analysis, and discussion of your aesthetic goals." },
      { step: "02", title: "Smile Preview Mockup", desc: "Experience a temporary physical try-in of your new smile in your mouth before final fabrication." },
      { step: "03", title: "Master Lab Artistry & Placement", desc: "Bonding of custom ceramic veneers with microscopic margin precision for lifetime durability." },
    ],
    faqs: [
      { q: "How long do porcelain veneers last?", a: "With routine cleanings and good oral hygiene, our porcelain veneers typically last 15 to 20+ years." },
      { q: "Does the veneer procedure hurt?", a: "Not at all. We use computerized painless local anesthesia and comfort amenities so you feel relaxed throughout." },
    ],
  },
  {
    id: "invisalign",
    slug: "invisalign",
    icon: Smile,
    title: "Invisalign & Clear Aligners",
    tagline: "Straighten teeth discreetly with Diamond+ Invisalign expertise.",
    category: "Orthodontics",
    blurb:
      "Virtually invisible, removable aligners engineered from patented SmartTrack® material for faster, comfortable movement.",
    fullDescription:
      "Straighten your smile without brackets, wires, or dietary restrictions. Dr. Sofia Marchetti uses our iTero Element 5D scanner to map out your entire tooth movement in real time. You'll see your completed smile simulation on screen before starting.",
    points: ["iTero 3D digital scan — no gooey molds", "Removable for eating & brushing", "Average treatment 6–14 months", "Diamond+ Top 1% Invisalign Provider"],
    duration: "6 to 14 months average",
    priceEstimate: "$3,200 – $5,800 (Monthly plans from $99/mo)",
    insuranceCovered: "Up to $3,000 orthodontic coverage accepted",
    accent: false,
    idealFor: [
      "Crowded or overlapping teeth",
      "Gaps and spacing concerns",
      "Overbites, underbites, and crossbites",
      "Adults & teens desiring invisible orthodontics",
    ],
    steps: [
      { step: "01", title: "3D ClinCheck® Simulation", desc: "Instant digital scan showing your week-by-week tooth progression and final result." },
      { step: "02", title: "Aligner Delivery & Guidance", desc: "Receive custom medical-grade aligners with check-in visits every 8-10 weeks." },
      { step: "03", title: "Vivera® Lifetime Retention", desc: "Custom retainers to lock your perfect alignment in place forever." },
    ],
    faqs: [
      { q: "How many hours a day do I wear aligners?", a: "We recommend wearing them 20 to 22 hours per day, removing them only for meals and brushing." },
      { q: "Can I do Invisalign if I had braces before?", a: "Yes! Many of our patients are adults whose teeth shifted after childhood braces." },
    ],
  },
  {
    id: "implants",
    slug: "implants",
    icon: Anchor,
    title: "Dental Implants & Restorations",
    tagline: "Permanent, bio-compatible tooth replacement for life.",
    category: "Restorative",
    blurb:
      "Titanium and zirconia implants that feel, function, and look indistinguishable from natural teeth, placed with 3D CBCT guided surgery.",
    fullDescription:
      "Missing teeth affect chewing, jawbone health, and facial contours. Our surgical specialist Dr. Priya Nair utilizes robotic 3D CBCT guided navigation for implant placement with sub-millimeter precision. We restore individual teeth, multiple gaps, or full arches with All-on-4® solutions.",
    points: ["Computer-guided painless surgery", "Preserves jawbone and facial structure", "98.7% long-term success rate", "Custom shaded zirconia crowns"],
    duration: "1–2 surgical visits + integration period",
    priceEstimate: "$1,800 – $3,900 per implant (Flexible payment plans)",
    insuranceCovered: "Major insurance contribution + financing options",
    accent: false,
    idealFor: [
      "Single or multiple missing teeth",
      "Failing bridges or root canals",
      "Loose, uncomfortable dentures",
      "Jawbone preservation after extractions",
    ],
    steps: [
      { step: "01", title: "3D CBCT Bone Mapping", desc: "High-resolution 3D scan to evaluate bone density and design virtual surgical guide." },
      { step: "02", title: "Gentle Implant Placement", desc: "Minimally invasive placement under local anesthesia or twilight sedation." },
      { step: "03", title: "Custom Crown Delivery", desc: "Attachment of custom-crafted zirconia crown matched perfectly to your smile." },
    ],
    faqs: [
      { q: "Is dental implant surgery painful?", a: "Most patients report less discomfort than a standard extraction. You can return to normal activities the next day." },
      { q: "How long do dental implants last?", a: "Dental implants integrate with your jawbone and are designed to last a lifetime with proper oral hygiene." },
    ],
  },
  {
    id: "whitening",
    slug: "whitening",
    icon: Sun,
    title: "Teeth Whitening",
    tagline: "Brighten your smile up to 8 shades in a single hour.",
    category: "Cosmetic",
    blurb:
      "In-office Philips Zoom! WhiteSpeed laser whitening and custom take-home kits formulated with desensitizing minerals.",
    fullDescription:
      "Erase years of coffee, tea, wine, and aging stains safely. Our clinical whitening utilizes advanced light-activated technology combined with ACP (amorphous calcium phosphate) to strengthen enamel and eliminate post-treatment tooth sensitivity.",
    points: ["Up to 8 shades brighter in 60 minutes", "Enamel-safe with anti-sensitivity formula", "Includes custom take-home touch-up trays", "Netflix & noise-canceling headphones during visit"],
    duration: "60 minutes in office",
    priceEstimate: "$299 – $499 (Special new patient rates)",
    insuranceCovered: "Elective cosmetic / HSA/FSA eligible",
    accent: false,
    idealFor: [
      "Stains from coffee, tea, wine, or tobacco",
      "Upcoming weddings, interviews, or photo shoots",
      "Age-related yellowing of enamel",
      "Post-orthodontic polish and radiance",
    ],
    steps: [
      { step: "01", title: "Shade Analysis & Gum Barrier", desc: "Measure baseline shade and apply protective barrier to delicate gingival tissue." },
      { step: "02", title: "Zoom! Light Application", desc: "Three 15-minute intervals of light-activated whitening gel while you relax." },
      { step: "03", title: "Enamel Mineral Polish", desc: "Application of soothing mineral glaze to seal brightness and prevent sensitivity." },
    ],
    faqs: [
      { q: "Will whitening damage my enamel?", a: "No. Our medical-grade whitening is pH-neutral and scientifically formulated to protect enamel integrity." },
    ],
  },
  {
    id: "general",
    slug: "general",
    icon: Stethoscope,
    title: "General & Preventive Care",
    tagline: "Gentle cleanings and proactive oral wellness.",
    category: "Preventive",
    blurb:
      "Comprehensive digital exams, gentle ultrasonic cleanings, tooth-colored fillings, and personalized preventive therapy.",
    fullDescription:
      "Prevention is the foundation of lifelong dental health. Our hygiene appointments feature ultrasonic airflow cleaning that removes biofilm and tartar without scraping. We use low-dose digital sensors, oral cancer screenings, and laser cavity diagnostics.",
    points: ["Airflow ultrasonic cleaning — zero scraping", "Low-dose digital X-rays & AI cavity detection", "BPA-free composite fillings", "Oral cancer screening with every exam"],
    duration: "45 – 60 minutes",
    priceEstimate: "$89 New Patient Special (Cleanings 100% covered by most PPOs)",
    insuranceCovered: "100% covered by almost all PPO plans",
    accent: false,
    idealFor: [
      "Routine 6-month wellness checkups",
      "Plaque, tartar, and stain removal",
      "Cavity repair with seamless fillings",
      "Gum health monitoring and maintenance",
    ],
    steps: [
      { step: "01", title: "Digital Imaging & Exam", desc: "Ultra-low radiation scans and high-magnification intraoral camera tour of your teeth." },
      { step: "02", title: "Gentle Airflow Hygiene", desc: "Warm water ultrasonic technology to comfortably polish and remove plaque." },
      { step: "03", title: "Personalized Wellness Plan", desc: "Clear review of findings, custom home-care tips, and no surprise pricing." },
    ],
    faqs: [
      { q: "How often do I need a cleaning?", a: "We recommend visits every 6 months for most patients, or every 3-4 months for those with periodontal needs." },
    ],
  },
  {
    id: "pediatric",
    slug: "pediatric",
    icon: Baby,
    title: "Pediatric Dentistry",
    tagline: "Fun, gentle dental visits that kids genuinely love.",
    category: "Pediatric",
    blurb:
      "Specialized care for infants, children, and teens with gentle touch, fluoride treatments, sealants, and positive reinforcement.",
    fullDescription:
      "We believe a child's early dental experiences shape their attitude toward healthcare for life. Our pediatric suite features kid-sized equipment, playful explanations, ceiling TVs, and a treasure tower reward system.",
    points: ["Child-friendly language & positive psychology", "Protective dental sealants & fluoride varnish", "Growth & orthodontic monitoring", "Parent-welcomed treatment rooms"],
    duration: "30 – 45 minutes",
    priceEstimate: "$79 – $150 (Covered by dental insurance)",
    insuranceCovered: "100% preventive coverage on most family plans",
    accent: false,
    idealFor: [
      "Babies starting their first tooth (Age 1+)",
      "School-age kids needing cavity protection",
      "Teens requiring orthodontic evaluation",
      "Children with fear or dental sensitivity",
    ],
    steps: [
      { step: "01", title: "Fun Tour & 'Tell-Show-Do'", desc: "We introduce tools playfully so kids feel safe and in control." },
      { step: "02", title: "Gentle Polish & Examination", desc: "Cleaning, fluoride application, and checking tooth eruption." },
      { step: "03", title: "Treasure Chest & Healthy Smile Badge", desc: "Celebrating great brushing and rewarding our young patients." },
    ],
    faqs: [
      { q: "When should my baby have their first dentist visit?", a: "The American Academy of Pediatric Dentistry recommends a first visit by age one or when the first tooth appears." },
    ],
  },
  {
    id: "emergency",
    slug: "emergency",
    icon: Siren,
    title: "Emergency Dental Care",
    tagline: "Same-day immediate relief for dental pain and accidents.",
    category: "Emergency",
    blurb:
      "Rapid triage and same-day treatment for severe toothaches, broken teeth, lost crowns, facial trauma, and infections.",
    fullDescription:
      "Dental emergencies can be terrifying and agonizing. At Lumina Dental Studio, we reserve dedicated same-day emergency slots every morning and afternoon. We triage your pain immediately, diagnose with instant digital radiography, and provide prompt intervention.",
    points: ["Same-day emergency appointments guaranteed", "Instant pain relief & infection control", "Broken tooth & root canal rescue", "Direct 24/7 emergency hotline"],
    duration: "Immediate same-day service",
    priceEstimate: "Urgent exam + digital X-ray from $99",
    insuranceCovered: "Accepted by all major PPOs & emergency benefits",
    accent: true,
    idealFor: [
      "Severe, throbbing, or unmanageable toothache",
      "Broken, chipped, or cracked teeth",
      "Knocked-out or loosened tooth (Trauma)",
      "Swollen gums, abscesses, or facial swelling",
      "Lost fillings, loose crowns, or broken bridges",
    ],
    steps: [
      { step: "01", title: "Immediate Pain Relief", desc: "Fast-acting anesthesia and anti-inflammatory treatment to get you out of pain immediately." },
      { step: "02", title: "Digital Diagnosis & X-Ray", desc: "Pinpointing the exact cause of pain within minutes using digital imaging." },
      { step: "03", title: "Definitive Treatment", desc: "Same-day restorative repair, bonding, crown stabilization, or gentle root canal relief." },
    ],
    faqs: [
      { q: "What should I do if a permanent tooth gets knocked out?", a: "Touch only the crown (not root), gently rinse with milk or saline, place it back in the socket if possible or in a cup of milk, and call our emergency line immediately." },
    ],
  },
];

export const services = detailedServices;

/* ------------------------------------------------------------------ */
/* Why Choose Us Features                                            */
/* ------------------------------------------------------------------ */
export const features: { icon: LucideIcon; title: string; blurb: string }[] = [
  {
    icon: HeartPulse,
    title: "Gentle, anxiety-free care",
    blurb: "Sedation options, warm scented towels, noise-canceling headphones, and a calm, judgment-free pace.",
  },
  {
    icon: Microscope,
    title: "Advanced 3D technology",
    blurb: "iTero 5D digital scans, low-dose CBCT 3D imaging, and AI diagnostics for precision without pain.",
  },
  {
    icon: Wallet,
    title: "Transparent, upfront pricing",
    blurb: "No surprise bills. Detailed itemized estimates, 0% APR financing, and we file your insurance for you.",
  },
  {
    icon: Clock,
    title: "Same-day emergency guarantee",
    blurb: "Dedicated daily urgent slots and an on-call priority line so you're never left in pain.",
  },
  {
    icon: BadgeCheck,
    title: "Multidisciplinary specialists",
    blurb: "Cosmetic dentists, orthodontists, and periodontists collaborating together under one roof.",
  },
  {
    icon: ShieldCheck,
    title: "Biomimetic prevention focus",
    blurb: "Preserving your natural tooth structure using cutting-edge biomimetic materials and longevity care.",
  },
];

/* ------------------------------------------------------------------ */
/* Dentists Team Profiles                                            */
/* ------------------------------------------------------------------ */
export interface DentistProfile {
  id: string;
  name: string;
  role: string;
  credentials: string;
  education: string;
  experienceYears: number;
  bio: string;
  fullBio: string;
  img: string;
  focus: string[];
  philosophy: string;
  languages: string[];
  awards: string[];
}

export const dentists: DentistProfile[] = [
  {
    id: "sarah-chen",
    name: "Dr. Sarah Chen",
    role: "Founder & Lead Cosmetic Dentist",
    credentials: "DDS, FAGD, AACD Member",
    education: "UCSF School of Dentistry · UCLA Aesthetic Continuum",
    experienceYears: 16,
    bio: "Dr. Chen founded Lumina to combine fine-art smile design with gentle, biomimetic dentistry. She has completed over 3,500 porcelain smile transformations.",
    fullBio: "Dr. Sarah Chen is recognized as one of San Francisco's premier cosmetic dentists. Having trained at UCSF and completed postgraduate fellowships in aesthetic restorative dentistry, she approaches every smile as a unique work of art. Dr. Chen is passionate about minimally invasive dentistry, ensuring maximum preservation of healthy natural tooth structure.",
    img: images.dentists[0],
    focus: ["Porcelain Veneers", "Smile Makeovers", "Biomimetic Restorations", "Laser Aesthetics"],
    philosophy: "A great smile doesn't look fabricated — it looks like the best, most radiant version of you.",
    languages: ["English", "Mandarin", "Spanish"],
    awards: ["Top Cosmetic Dentist SF Magazine (2024, 2025)", "Fellow of the Academy of General Dentistry (FAGD)"],
  },
  {
    id: "marcus-vance",
    name: "Dr. Marcus Vance",
    role: "Orthodontist & Aligner Specialist",
    credentials: "DMD, MS Orthodontics — Diamond+ Invisalign Provider",
    education: "Harvard School of Dental Medicine · University of Washington MS",
    experienceYears: 12,
    bio: "Dr. Vance is a top 1% Diamond+ Invisalign specialist who plans orthodontic movements with airway and facial aesthetics in mind.",
    fullBio: "Dr. Marcus Vance specializes in modern, discreet orthodontics for teens and adults. Utilizing advanced 3D digital kinematics, Dr. Vance crafts accelerated clear aligner treatments that correct bite function while enhancing facial profiles and jawline balance.",
    img: images.dentists[1],
    focus: ["Invisalign Clear Aligners", "Airway Orthodontics", "Accelerated Ortho", "Bite Reconstruction"],
    philosophy: "Orthodontics is about more than straight teeth — it's about lifetime airway health, jaw comfort, and self-confidence.",
    languages: ["English", "French"],
    awards: ["Invisalign Diamond+ Top 1% Provider", "American Association of Orthodontists Merit Award"],
  },
  {
    id: "elena-rostova",
    name: "Dr. Elena Rostova",
    role: "Periodontist & Implant Surgeon",
    credentials: "DDS, MS Periodontics, Board Certified Diplomate",
    education: "Columbia University College of Dental Medicine · NYU Implantology",
    experienceYears: 14,
    bio: "Dr. Rostova specializes in 3D computer-guided dental implants, regenerative bone grafting, and gentle periodontal therapy.",
    fullBio: "Dr. Elena Rostova is a dual board-certified periodontist and implantologist. Her gentle touch and expertise in microsurgical tissue regeneration make complex implant procedures surprisingly comfortable and predictable. She is a pioneer in immediate same-day implant restorations.",
    img: images.dentists[2],
    focus: ["Computer-Guided Implants", "All-on-4® Full Arch", "Microsurgical Gum Grafting", "Bone Regeneration"],
    philosophy: "We restore missing teeth so seamlessly that you forget which ones are implants.",
    languages: ["English", "Russian", "German"],
    awards: ["Diplomate, American Board of Periodontology", "International Congress of Oral Implantologists Fellow"],
  },
];

/* ------------------------------------------------------------------ */
/* Smile Gallery                                                      */
/* ------------------------------------------------------------------ */
export const gallery = [
  {
    id: "case-1",
    img: images.gallery[0],
    treatment: "Handcrafted Porcelain Veneers",
    category: "Cosmetic",
    duration: "2 Weeks",
    dentist: "Dr. Sarah Chen, DDS",
    description: "Corrected severe fluorosis discoloration and edge chipping with 8 custom e.max porcelain veneers.",
  },
  {
    id: "case-2",
    img: images.gallery[1],
    treatment: "Full Smile Transformation",
    category: "Cosmetic",
    duration: "3 Weeks",
    dentist: "Dr. Sarah Chen, DDS",
    description: "Replaced old discolored bonding with natural layered porcelain veneers and gingival contouring.",
  },
  {
    id: "case-3",
    img: images.gallery[2],
    treatment: "Philips Zoom! Laser Whitening",
    category: "Whitening",
    duration: "1 Hour",
    dentist: "Lumina Hygiene Specialists",
    description: "Lifted 7 shades of coffee and red wine stains with zero sensitivity formula.",
  },
  {
    id: "case-4",
    img: images.gallery[3],
    treatment: "Invisalign Clear Aligners",
    category: "Orthodontics",
    duration: "9 Months",
    dentist: "Dr. Marcus Vance, DMD",
    description: "Resolved lower anterior crowding and aligned crossbite comfortably without traditional braces.",
  },
  {
    id: "case-5",
    img: images.gallery[4],
    treatment: "Guided Implant & Ceramic Crown",
    category: "Restorative",
    duration: "3 Months",
    dentist: "Dr. Elena Rostova, MS",
    description: "3D computer-guided single tooth replacement in the aesthetic anterior zone.",
  },
  {
    id: "case-6",
    img: images.gallery[5],
    treatment: "Complete Arch Rehabilitation",
    category: "Restorative",
    duration: "4 Weeks",
    dentist: "Drs. Chen & Rostova",
    description: "Harmonized bite height, replaced worn restorations, and restored youthful smile line.",
  },
];

/* ------------------------------------------------------------------ */
/* Testimonials                                                       */
/* ------------------------------------------------------------------ */
export const testimonials = [
  {
    name: "Elena Rostova",
    role: "Invisalign Patient",
    service: "Invisalign",
    quote: "I had severe dental anxiety for over 10 years. Dr. Vance and the team at Lumina completely transformed my experience. Gentle, patient, and my teeth are now perfectly straight!",
    rating: 5,
    avatar: images.avatars[0],
    verified: true,
  },
  {
    name: "Marcus Vance",
    role: "Porcelain Veneers",
    service: "Cosmetic Dentistry",
    quote: "Dr. Sarah Chen is a true artist. My veneers look completely natural and I smile constantly in meetings and photos now. The investment was worth every single dollar.",
    rating: 5,
    avatar: images.avatars[1],
    verified: true,
  },
  {
    name: "Dr. Priya Patel",
    role: "Physician & Implant Patient",
    service: "Dental Implants",
    quote: "As a physician, clinical sterilisation and technology matter deeply to me. Lumina's 3D imaging, hygiene standards, and bedside manner are unmatched in Northern California.",
    rating: 5,
    avatar: images.avatars[2],
    verified: true,
  },
  {
    name: "Liam Gallagher",
    role: "Emergency Care",
    service: "Emergency Dentistry",
    quote: "Cracked a molar on a Sunday night. They had me in first thing Monday, numbed the pain instantly, and fixed my tooth without stress. Total lifesavers!",
    rating: 5,
    avatar: images.avatars[3],
    verified: true,
  },
  {
    name: "Chloe Zhao",
    role: "Teeth Whitening",
    service: "Teeth Whitening",
    quote: "The 1-hour laser whitening lifted my coffee stains by 6 shades with zero sensitivity. Loved watching Netflix on the ceiling screen during the treatment!",
    rating: 5,
    avatar: images.avatars[4],
    verified: true,
  },
  {
    name: "Michael Chang",
    role: "Family Care",
    service: "General & Family",
    quote: "Our entire family comes here now. The kids actually look forward to their visits because of the kind staff and painless cleanings.",
    rating: 5,
    avatar: images.avatars[5],
    verified: true,
  },
];

/* ------------------------------------------------------------------ */
/* Insurance & Financing                                              */
/* ------------------------------------------------------------------ */
export const insurance = [
  "Delta Dental Premier",
  "MetLife Dental",
  "Cigna Dental",
  "Guardian",
  "Aetna Dental",
  "UnitedHealthcare",
  "BlueCross BlueShield",
  "Humana Dental",
];

export const insurancePartners = [
  { name: "Delta Dental Premier & PPO", category: "In-Network", tier: "Tier 1 Provider" },
  { name: "Cigna Dental PPO", category: "In-Network", tier: "Total Care Network" },
  { name: "MetLife PDP Plus", category: "In-Network", tier: "Preferred Network" },
  { name: "Aetna Dental PPO", category: "In-Network", tier: "Extended Care" },
  { name: "Guardian DentalGuard", category: "In-Network", tier: "Direct Advantage" },
  { name: "UnitedHealthcare Dental", category: "In-Network", tier: "National Network" },
  { name: "Humana Dental PPO", category: "In-Network", tier: "Choice PPO" },
  { name: "Blue Cross Blue Shield", category: "In-Network", tier: "Grid+ Network" },
];

export const beforeAfterCases = [
  {
    id: "case-1",
    title: "Porcelain Veneers & Alignment",
    treatment: "Cosmetic Veneers",
    dentist: "Dr. Sarah Chen",
    blurb: "Corrected fluorosis staining and spacing in 2 visits.",
    before: images.gallery[0],
    after: images.gallery[1],
  },
  {
    id: "case-2",
    title: "Invisalign Crowding Correction",
    treatment: "Clear Aligners",
    dentist: "Dr. Marcus Vance",
    blurb: "Realigned anterior arch and corrected deep overbite.",
    before: images.gallery[2],
    after: images.gallery[3],
  },
  {
    id: "case-3",
    title: "Full Arch Ceramic Reconstruction",
    treatment: "Restorative Implants",
    dentist: "Dr. Elena Rostova",
    blurb: "Restored chewing function and youthful smile symmetry.",
    before: images.gallery[4],
    after: images.gallery[5],
  },
];

export const membershipClub = {
  name: "Lumina Dental Membership Savings Club",
  price: "$29/month",
  tagline: "No insurance? No problem. Complete dental coverage with zero deductibles or maximums.",
  includes: [
    "2 Comprehensive cleanings & exams per year",
    "All routine digital X-rays & emergency exams included ($450 value)",
    "20% discount on all cosmetic, orthodontic & restorative treatments",
    "Zero waiting periods, zero pre-approvals, zero claims hassle",
    "1 Free in-office laser whitening session each year",
  ],
};

/* ------------------------------------------------------------------ */
/* Emergency Reasons                                                  */
/* ------------------------------------------------------------------ */
export const emergencies = [
  {
    title: "Severe toothache or throbbing pain",
    blurb: "Persistent pain indicates deep decay, infection, or nerve irritation needing fast intervention.",
    action: "Rinse gently with warm water, avoid placing aspirin on gums, and call our priority line.",
  },
  {
    title: "Broken, chipped, or cracked tooth",
    blurb: "Exposed dentin can quickly decay and cause sharp pain if left untreated.",
    action: "Save any tooth fragments in milk or saline, avoid biting, and book same-day repair.",
  },
  {
    title: "Knocked-out permanent tooth (Avulsion)",
    blurb: "A tooth can be saved if replanted within the first 30 to 60 minutes.",
    action: "Hold by crown only, do not scrub, place in milk or socket, and call us instantly.",
  },
  {
    title: "Lost crown, filling, or bridge",
    blurb: "Leaves the underlying tooth vulnerable to temperature sensitivity and bacterial ingress.",
    action: "Keep the crown safe; we can re-bond or fabricate a same-day ceramic restoration.",
  },
  {
    title: "Swollen gums, abscess, or facial swelling",
    blurb: "A serious bacterial infection that requires immediate antibiotic triage and drainage.",
    action: "Do not apply heat. Call our 24/7 hotline immediately for emergency evaluation.",
  },
  {
    title: "Sports injury or mouth trauma",
    blurb: "Impact causing loosened teeth, soft tissue lacerations, or jaw misalignment.",
    action: "Apply gentle pressure with clean gauze to stop bleeding and come in right away.",
  },
];

/* ------------------------------------------------------------------ */
/* Hours                                                              */
/* ------------------------------------------------------------------ */
export const hours = [
  { day: "Monday – Thursday", time: "8:00 AM – 6:00 PM" },
  { day: "Friday", time: "8:00 AM – 5:00 PM" },
  { day: "Saturday", time: "9:00 AM – 3:00 PM" },
  { day: "Sunday", time: "Emergency On-Call 24/7" },
];

/* ------------------------------------------------------------------ */
/* FAQs                                                               */
/* ------------------------------------------------------------------ */
export const faqs = [
  {
    category: "General & First Visit",
    q: "Are you accepting new patients?",
    a: "Yes! We warmly welcome new patients of all ages. Your first visit includes a comprehensive exam, 3D digital imaging, gentle ultrasonic cleaning, and an unhurried consultation with your dentist.",
  },
  {
    category: "Insurance & Payments",
    q: "Do you accept my dental insurance?",
    a: "We are in-network with Delta Dental, Cigna, MetLife, Aetna, Guardian, UnitedHealthcare, and more. Our front-desk coordinators verify your exact benefits beforehand and handle all claim submissions for you.",
  },
  {
    category: "Comfort & Anxiety",
    q: "I experience severe dental anxiety — how do you help?",
    a: "You are not alone. We offer nitrous oxide (laughing gas), oral sedation, computerized painless wand injections, warm neck pillows, noise-canceling headphones, and ceiling streaming screens to make every visit effortless.",
  },
  {
    category: "Cosmetics & Aligners",
    q: "How do I know what my smile will look like before treatment?",
    a: "We use 3D digital smile design simulations and physical try-in mockups so you can see, feel, and approve your new smile in your mouth before any permanent porcelain or aligner treatment begins.",
  },
  {
    category: "Emergency Care",
    q: "How quickly can I be seen for a dental emergency?",
    a: "We guarantee same-day emergency appointments during clinic hours and have a 24/7 priority emergency line for after-hours trauma and severe pain relief.",
  },
  {
    category: "Insurance & Payments",
    q: "Do you offer 0% interest financing payment plans?",
    a: "Yes, we partner with CareCredit and Sunbit to provide 0% APR financing for up to 24 months, with instant approvals and monthly payments as low as $49/mo.",
  },
];

export const formIcons = { Syringe, Activity, Baby, Sparkles, Smile, Anchor, Sun, Siren };
