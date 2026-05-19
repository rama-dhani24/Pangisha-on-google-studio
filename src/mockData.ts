export interface Listing {
  id: string;
  title: string;
  titleSw: string;
  price: number; // in TZS (monthly)
  type: "living-room" | "studio" | "apartment" | "shared-space";
  beds: number;
  baths: number;
  sizeSqM: number;
  region: string; // e.g., "Dar es Salaam", "Zanzibar", "Arusha", "Dodoma", "Mwanza"
  district: string; // e.g., "Kigamboni", "Stone Town", "Sekei", "Kinondoni", "Njiro"
  description: string;
  descriptionSw: string;
  image: string;
  amenities: string[];
  hostName: string;
  hostPhone: string;
  featured: boolean;
  coordinates: { x: number; y: number }; // Relative map coordinates [0-100] for standard map rendering
}

export const SeedListings: Listing[] = [
  {
    id: "lst-001",
    title: "Sufiani Coastal Living Room",
    titleSw: "Sebule ya Kisasa ya Pwani Kigamboni",
    price: 1800000,
    type: "apartment",
    beds: 2,
    baths: 2,
    sizeSqM: 110,
    region: "Dar es Salaam",
    district: "Kigamboni",
    description: "Stunning modern beachfront living space overlooking the Indian Ocean. Features premium hardwood furniture, high ceilings, large glass wind-shields, and beautiful Swahili handcrafted decor. Private access to the sandy Kigamboni beaches.",
    descriptionSw: "Sebule safi yenye mwanga wa kutosha inatazama bahari ya Hindi kule Kigamboni. Imejengwa kwa samani zakiswahili na mbao ngumu za hadhi ya juu, madirisha makubwa ya kioo na upepo mwanana wa pwani. Karibu sana!",
    image: "/src/assets/images/dar_beach_house_1779215473163.png",
    amenities: ["Air Conditioning", "Ocean View", "WiFi", "Backup Generator", "24/7 Security", "Private Kitchen"],
    hostName: "Mama Sufiani",
    hostPhone: "+255 712 345 678",
    featured: true,
    coordinates: { x: 74, y: 64 },
  },
  {
    id: "lst-002",
    title: "Mount Meru Peak-View Duplex",
    titleSw: "Sebule yenye Mtazamo wa Mlima Meru",
    price: 1200000,
    type: "living-room",
    beds: 1,
    baths: 1,
    sizeSqM: 85,
    region: "Arusha",
    district: "Sekei",
    description: "Nestled in the green hills of Sekei, Arusha, this gorgeous duplex offers a stunning panoramic view of Mount Meru from its double-height living room windows. Includes a warm stone fireplace for Arusha's chilly evenings.",
    descriptionSw: "Iko katika vilima vya kijani vya Sekei Arusha. Sebule hii kubwa ina kuta refu zenye vioo kuona mlima Meru, kichomea moto cha mawe kwa ajili ya baridi ya usiku ya Arusha, na samani nzuri zenye asili ya mbao.",
    image: "/src/assets/images/arusha_duplex_1779215488899.png",
    amenities: ["Mountain View", "Fireplace", "WiFi", "Secure Parking", "Hot Water Heater", "Garden Access"],
    hostName: "Baba Vanessa",
    hostPhone: "+255 754 987 654",
    featured: true,
    coordinates: { x: 42, y: 34 },
  },
  {
    id: "lst-003",
    title: "Swahili Heritage Stone Town Loft",
    titleSw: "Chumba cha Kihistoria cha Stone Town",
    price: 950000,
    type: "shared-space",
    beds: 1,
    baths: 1.5,
    sizeSqM: 65,
    region: "Zanzibar",
    district: "Stone Town",
    description: "Enjoy an authentic Zanzibari experience in this restored coral stone building. Detailed with hand-carved arabesque doors, exposed coral beam ceilings, and vibrant traditional floor mats & pillows close to Forodhani Gardens.",
    descriptionSw: "Pata uzoefu halisi wa maisha ya kifalme ya Kizanzibari katika jengo hili la mawe ya matumbawe. Ina milango ya mbao iliyochongwa kwa mikono, kuta za asili, na mikeka ya asili ya kipekee karibu na bustani za Forodhani.",
    image: "/src/assets/images/stonetown_studio_1779215506578.png",
    amenities: ["Ocean Breeze", "Historical Architecture", "WiFi", "Washing Machine", "Mosquito Netting", "Walking Friendly"],
    hostName: "Sheikh Salim",
    hostPhone: "+255 777 112 233",
    featured: true,
    coordinates: { x: 62, y: 72 },
  },
  {
    id: "lst-004",
    title: "Sleek Kitenge Studio Space",
    titleSw: "Studio ya Kisasa ya Vitenge Kinondoni",
    price: 450000,
    type: "studio",
    beds: 1,
    baths: 1,
    sizeSqM: 45,
    region: "Dar es Salaam",
    district: "Kinondoni",
    description: "Budget-friendly, highly stylish studio tailored for students or young workers. Spiced up with local Kitenge-print interiors, a powerful overhead fan, and highly optimized modern modular kitchenette in the heart of Kinondoni.",
    descriptionSw: "Studio ya kisasa na ya gharama ya chini, iliyoandaliwa kwa ubunifu mkubwa kwa kutumia vitambaa vya kitenge. Ina feni yenye nguvu, jiko safi na muundo bapa wa kisasa katika kitovu kizuri cha Kinondoni.",
    image: "/src/assets/images/dar_budget_room_1779215523209.png",
    amenities: ["High-speed WiFi", "Ceiling Fan", "Kitenge Themed Deck", "Modern Toilet", "Easy Public Transit"],
    hostName: "Dada Neema",
    hostPhone: "+255 765 432 109",
    featured: false,
    coordinates: { x: 72, y: 56 },
  },
  {
    id: "lst-005",
    title: "Lake Breeze Bismarck View Room",
    titleSw: "Chumba chenye upepo wa Ziwa Victoria",
    price: 800000,
    type: "living-room",
    beds: 1,
    baths: 1,
    sizeSqM: 70,
    region: "Mwanza",
    district: "Kamanga",
    description: "Wake up to beautiful lake views and gentle breezes from Lake Victoria. Situated in Kamanga, this comfortable high-floor living room is peaceful, green, and just steps away from the ferry terminal.",
    descriptionSw: "Amka na mtazamo mzuri wa Ziwa Victoria na upepo safi. Chumba hiki cha ghorofa ya juu kilichopo Kamanga kina utulivu makini na mazingira ya kijani karibu na kivuko.",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    amenities: ["Lake View", "WiFi", "Secure Parking", "Kitchenette", "Modern Inverter AC"],
    hostName: "Kaka Joshua",
    hostPhone: "+255 713 111 222",
    featured: false,
    coordinates: { x: 26, y: 24 },
  },
  {
    id: "lst-006",
    title: "Executive Legislative Living Room",
    titleSw: "Sebule ya Kisasa ya Kiserikali Dodoma",
    price: 1500000,
    type: "apartment",
    beds: 3,
    baths: 2,
    sizeSqM: 130,
    region: "Dodoma",
    district: "Area D",
    description: "Stately executive living space in highly secured residential Area D, Dodoma. Spacious airy lounges, central air cooling systems, luxury leather couches, and pristine security backup.",
    descriptionSw: "Sebule kubwa ya hadhi ya kiserikali na ulinzi mkali katika Area D, Dodoma. Sehemu nzuri yenye nafasi kubwa, mfumo wa kupoza hewa, makochi ya ngozi na umeme dhabiti wa dharura.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    amenities: ["Backup Generator", "Central AC", "24/7 Gate Warden", "Lawn Garden", "High-Speed Internet", "Hot Springs Showers"],
    hostName: "Mheshimiwa Mwita",
    hostPhone: "+255 784 555 666",
    featured: false,
    coordinates: { x: 48, y: 55 },
  }
];

export const TZ_REGIONS = [
  {
    name: "Dar es Salaam",
    swahiliName: "Dar es Salaam",
    count: 324,
    description: "The commercial heartbeat, dynamic street foods, and majestic Indian Ocean beaches.",
    image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=400&q=80",
    avgRent: "TSh 650,000"
  },
  {
    name: "Zanzibar",
    swahiliName: "Unguja & Pemba",
    count: 182,
    description: "Majestic Stone Town historic architecture, turquoise spice islands, and relaxing coastal resorts.",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=400&q=80",
    avgRent: "TSh 950,000"
  },
  {
    name: "Arusha",
    swahiliName: "Arusha",
    count: 145,
    description: "The green safari capital, beautiful views of Mount Meru, and refreshingly cool climates.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80",
    avgRent: "TSh 750,000"
  },
  {
    name: "Dodoma",
    swahiliName: "Dodoma (Mji Mkuu)",
    count: 98,
    description: "The thriving legislative capital of government headquarters with rapid urban developments.",
    image: "https://images.unsplash.com/photo-1528255671579-01b9e182ed1d?auto=format&fit=crop&w=400&q=80",
    avgRent: "TSh 550,000"
  },
  {
    name: "Mwanza",
    swahiliName: "Mwanza (Rock City)",
    count: 110,
    description: "Stately lakeside breezes from Lake Victoria and legendary geological Bismarck Rock structures.",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=400&q=80",
    avgRent: "TSh 450,000"
  }
];

export const SWAHILI_DICT: Record<string, string> = {
  "Search living rooms...": "Tafuta sebule na vyumba...",
  "List Your Living Room": "Pangisha Sebule Yako",
  "Explore Living Rooms": "Chunguza Maeneo ya Kupangisha",
  "AI Rental Advisor": "Mshauri wa AI (Swahili/English)",
  "Favorites & Inquiries": "Vipendwa & Maswali",
  "Renter Dashboard": "Dashibodi ya Mpangishaji",
  "All Regions": "Mikoa Yote",
  "Any Price": "Bei yoyote",
  "Rent a Cozy Living Space in Tanzania": "Pangisha Sebule na Vyumba Vizuri Tanzania 🇹🇿",
  "Find room with local hospitality ('Karibu') spirit. No hidden middle-man ('Dalali') fees.": "Tafuta sebule na makazi yenye roho ya ukarimu. Epuka usumbufu na gharama za madalali.",
  "Monthly rent": "Kodi ya mwezi",
  "Beds": "Vyumba vya kulala",
  "Baths": "Maliwato",
  "Size": "Ukubwa",
  "Contact Owner": "Wasiliana na Mwenye Nyumba",
  "Inquire Now": "Tuma Swali Sasa",
  "Amenities": "Miundombinu & Huduma",
  "Save to Favorites": "Weka kwenye Vipendwa",
  "Filter by type": "Chuja kulingana na aina",
  "Dar es Salaam": "Dar es Salaam",
  "Arusha": "Arusha",
  "Zanzibar": "Zanzibar",
  "Dodoma": "Dodoma",
  "Mwanza": "Mwanza",
  "Living Room": "Sebule",
  "Studio Room": "Chumba kimoja (Studio)",
  "Full Apartment": "Ghorofa / Apartment Nzima",
  "Shared Space": "Sebule ya Kushiriki",
  "Enter your rental info": "Weka taarifa za kupangisha chumba chako",
  "AI Description Polish": "Boresha Maelezo kwa AI",
  "Generate awesome multilingual copy for your listing automatically.": "Tengeneza maelezo mazuri ya lugha mbili (Swahili/English) kwa kusaidiwa na AI.",
  "Submit Listing": "Weka Sokoni Chumba hiki",
  "My Saved Listings": "Sebule Nilizohifadhi",
  "Welcome back to Pangisha!": "Karibu tena Pangisha!",
  "Find your dream home in Arusha, Dar es Salaam or Zanzibar in seconds.": "Tafuta makazi ya ndoto zako kwa dakika chache tu.",
  "Market Trend Insights": "Tathmini ya Soko kwa AI",
  "Select a city to check typical rental fees and local safety tips using AI.": "Chagua mji kuona makadirio ya kodi na vidokezo vya usalama vya AI."
};
