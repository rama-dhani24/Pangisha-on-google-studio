import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  PlusCircle,
  Compass,
  MapPin,
  Sparkles,
  DollarSign,
  Menu,
  X,
  ChevronRight,
  Languages,
  Heart,
  Phone,
  ArrowRight,
  User,
  Check,
  Grid,
  Send,
  MessageSquare,
  Map,
  Filter,
  Wifi,
  Wind,
  Info,
  Layers,
  Sparkle,
  Bookmark,
  Building,
  ArrowUpRight,
  ExternalLink,
  Loader2
} from "lucide-react";
import { SeedListings, TZ_REGIONS, SWAHILI_DICT, Listing } from "./mockData";

export default function App() {
  // Localization State ("en" = English, "sw" = Kiswahili)
  const [lang, setLang] = useState<"en" | "sw">("sw");

  // Translation Helper
  const t = (text: string) => {
    if (lang === "sw" && SWAHILI_DICT[text]) {
      return SWAHILI_DICT[text];
    }
    return text;
  };

  // Nav Tabs ("explore" | "list" | "ai-chat" | "favorites" | "insights")
  const [activeTab, setActiveTab] = useState<string>("explore");

  // Listings state (initialized from seed + localStorage)
  const [listings, setListings] = useState<Listing[]>(() => {
    const local = localStorage.getItem("pangisha_listings");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return SeedListings;
      }
    }
    return SeedListings;
  });

  // Save listings back to localStorage on change
  useEffect(() => {
    localStorage.setItem("pangisha_listings", JSON.stringify(listings));
  }, [listings]);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const local = localStorage.getItem("pangisha_favorites");
    return local ? JSON.parse(local) : ["lst-001", "lst-003"];
  });

  useEffect(() => {
    localStorage.setItem("pangisha_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>(() => {
    const local = localStorage.getItem("pangisha_inquiries");
    return local ? JSON.parse(local) : [
      {
        id: "inq-default",
        listingTitle: "Sufiani Coastal Living Room",
        hostName: "Mama Sufiani",
        message: "Habari Mama Sufiani, ningependa kuja kuona sebule hii mwishoni mwa wiki hii ya tarehe 23. Je, inapatikana?",
        date: "2026-05-19",
        phone: "+255 712 345 678"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("pangisha_inquiries", JSON.stringify(inquiries));
  }, [inquiries]);

  // Filtering System State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [priceRange, setPriceRange] = useState<number>(3000000); // Max TZS
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const amenitiesOptions = [
    "Air Conditioning",
    "WiFi",
    "Backup Generator",
    "24/7 Security",
    "Ocean View",
    "Mountain View",
    "Fireplace",
    "Secure Parking",
    "Private Kitchen"
  ];

  // Active Map Selection Listing
  const [selectedMapListing, setSelectedMapListing] = useState<Listing | null>(listings[0]);
  const [simulatedDirections, setSimulatedDirections] = useState<any | null>(null);

  // Quick Stats
  const totalLivingRooms = listings.filter(l => l.type === "living-room").length;
  const totalStudios = listings.filter(l => l.type === "studio").length;
  const totalApartments = listings.filter(l => l.type === "apartment").length;

  // Search filter implementation
  const filteredListings = listings.filter((item) => {
    const titleMatch = (lang === "sw" ? item.titleSw : item.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.district.toLowerCase().includes(searchTerm.toLowerCase());
    const regionMatch = selectedRegion === "All" || item.region === selectedRegion;
    const typeMatch = selectedType === "All" || item.type === selectedType;
    const priceMatch = item.price <= priceRange;
    const amenitiesMatch = selectedAmenities.every(a => item.amenities.includes(a));

    return titleMatch && regionMatch && typeMatch && priceMatch && amenitiesMatch;
  });

  // Toggle Favorite Action
  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Renter Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTitleSw, setNewTitleSw] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newRegion, setNewRegion] = useState("Dar es Salaam");
  const [newDistrict, setNewDistrict] = useState("");
  const [newType, setNewType] = useState<"living-room" | "studio" | "apartment" | "shared-space">("living-room");
  const [newBeds, setNewBeds] = useState("1");
  const [newBaths, setNewBaths] = useState("1");
  const [newSize, setNewSize] = useState("50");
  const [newAmenities, setNewAmenities] = useState<string[]>([]);
  const [newDesc, setNewDesc] = useState("");
  const [newDescSw, setNewDescSw] = useState("");
  const [newHost, setNewHost] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [selectedDemoImage, setSelectedDemoImage] = useState("1"); // Index representing one of local assets
  const [isAILoadingDesc, setIsAILoadingDesc] = useState(false);

  // Inquiry Modal state
  const [selectedInquireListing, setSelectedInquireListing] = useState<Listing | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Swahili Chat State (AI Advisor)
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      role: "assistant",
      content: "Habari yako! Karibu Pangisha 🇹🇿. Mimi ni msaidizi wako wa AI wa kusaidia kutafuta sebule, vyumba au nyumba sahihi ya kupanga Tanzania nzima. Unaweza kuniuliza chochote kwa Swahili au Kiingereza!\n\n(Example: 'Natafuta sebule nzuri Kigamboni chini ya laki nane' au 'Give me upscale properties in Arusha with views')"
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Market Insights AI State
  const [selectedInsightRegion, setSelectedInsightRegion] = useState("Dar es Salaam");
  const [insightText, setInsightText] = useState("");
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  // Map route calculations
  useEffect(() => {
    if (selectedMapListing) {
      // Simulate directions from a standard hub (Airport or CBD) to listing
      const dist = Math.sqrt(Math.pow(selectedMapListing.coordinates.x - 50, 2) + Math.pow(selectedMapListing.coordinates.y - 50, 2));
      const distanceKm = Math.round(dist * 0.4 * 10) / 10;
      const trafficMinutes = Math.round(distanceKm * 2.5 + 4);
      const estimatedTaxiTZS = Math.round(distanceKm * 2200 + 4000);

      setSimulatedDirections({
        origin: selectedMapListing.region === "Zanzibar" ? "Abeid Amani Karume International Airport (ZNZ)" : "Julius Nyerere International Airport (DAR) / Arusha Clocktower",
        distanceKm,
        trafficMinutes,
        estimatedTaxiTZS: estimatedTaxiTZS.toLocaleString()
      });
    }
  }, [selectedMapListing]);

  // Watch chat scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Run initial market insights for the main region on tab load
  useEffect(() => {
    if (activeTab === "insights") {
      fetchRegionInsights(selectedInsightRegion);
    }
  }, [activeTab, selectedInsightRegion]);

  // 1. Fetch AI Description Polish via backend
  const handleAIDescriptionPolish = async () => {
    if (!newTitle || !newDistrict || !newPrice) {
      alert(lang === "sw" ? "Tafadhali jaza Jina la Chumba, Wilaya na Bei kwanza ili msaidizi wa AI apate maelezo ya msingi!" : "Please fill in Room Title, District/Neighborhood, and Price first to give the AI basic details!");
      return;
    }
    setIsAILoadingDesc(true);
    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          region: newRegion,
          price: newPrice,
          amenities: newAmenities,
          details: `Located in district ${newDistrict}. Property type: ${newType}. Beds: ${newBeds}, Baths: ${newBaths}, sizeSqM: ${newSize}. Owner named ${newHost || "Pangisha Client"}`
        })
      });
      const data = await response.json();
      if (data.text) {
        // Parse into Swahili and English if possible, or dump in matching fields
        const rawText: string = data.text;
        
        // Split text or load nicely
        setNewDesc(rawText);
        setNewDescSw(`[AI Imeandaliwa Kibunifu]\nTunakukaribisha katika makazi haya safi yaliyopo vijijini/mijini vya ${newRegion}, ${newDistrict}. Bei ni TSh ${Number(newPrice).toLocaleString()} kwa mwezi.\n\nSimu ya Mpangishaji: ${newPhone || "+255 ... "}\n\nMaelezo ya Kila aina:\n${rawText.slice(0, 500)}...`);
      } else {
        alert("We could not generate. Please check dev credentials.");
      }
    } catch (e) {
      console.error(e);
      alert("Error reaching server-side Gemini system. Please ensure server is running and API key is set.");
    } finally {
      setIsAILoadingDesc(false);
    }
  };

  // 2. Swahili-English Interactive Advisor Chat
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    
    const updatedMessages = [...chatMessages, { role: "user", content: userMsg }];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          currentListings: listings.map(l => ({
            id: l.id,
            title: l.title,
            titleSw: l.titleSw,
            price: `TSh ${l.price.toLocaleString()}/mwezi`,
            region: l.region,
            district: l.district,
            type: l.type,
            amenities: l.amenities,
            host: l.hostName,
            contact: l.hostPhone
          }))
        })
      });
      const data = await response.json();
      if (data.reply) {
        setChatMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Samahani sana, nimepata hitilafu kidogo katika kusindika maelezo yako. Tafadhali jaribu tena!" }]);
      }
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { role: "assistant", content: "Inaonekana seva iko mbali au mfumo wa Gemini haujasanidiwa vyema. Hakikisha umeiweka 'GEMINI_API_KEY' kwenye kibao cha Secrets." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 3. AI Region Insights Endpoint Tracker
  const fetchRegionInsights = async (regionName: string) => {
    setIsInsightLoading(true);
    try {
      const response = await fetch("/api/market-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region: regionName })
      });
      const data = await response.json();
      if (data.insights) {
        setInsightText(data.insights);
      } else {
        setInsightText(`Historical advice for ${regionName}:\n- Typical Rent: TSh 400,000 to TSh 1,500,000\n- Rapid development growing!\nConfigure Gemini Key to see detailed Live AI feedback.`);
      }
    } catch (e) {
      console.error(e);
      setInsightText(`Local estimates for ${regionName}. Rent varies around TZS 500k-1.5M per month. Ensure your environment variable API key is configured for smart dynamic insight lists!`);
    } finally {
      setIsInsightLoading(false);
    }
  };

  // Renter submit processing
  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newDistrict || !newHost || !newPhone) {
      alert(lang === "sw" ? "Tafadhali jaza nafasi zote zenye nyota (*)" : "Please fill in all starred (*) fields");
      return;
    }

    // Set picture according to select representation
    let finalImg = "https://picsum.photos/seed/pangishaliving/800/600";
    if (selectedDemoImage === "1") finalImg = "/src/assets/images/dar_beach_house_1779215473163.png";
    if (selectedDemoImage === "2") finalImg = "/src/assets/images/arusha_duplex_1779215488899.png";
    if (selectedDemoImage === "3") finalImg = "/src/assets/images/stonetown_studio_1779215506578.png";
    if (selectedDemoImage === "4") finalImg = "/src/assets/images/dar_budget_room_1779215523209.png";

    const newlyCreated: Listing = {
      id: `lst-${Date.now()}`,
      title: newTitle,
      titleSw: newTitleSw || `${newTitle} [Swahili]`,
      price: Number(newPrice),
      type: newType,
      beds: Number(newBeds),
      baths: Number(newBaths),
      sizeSqM: Number(newSize),
      region: newRegion,
      district: newDistrict,
      description: newDesc || "Lovely Swahili living room designed with local finishes, peaceful surrounding and solid accessibility paths.",
      descriptionSw: newDescSw || "Sebule safi yenye utuluzi na muonekano maridadi wenye upatikanaji rahisi wa huduma muhimu.",
      image: finalImg,
      amenities: newAmenities.length > 0 ? newAmenities : ["WiFi", "Water Access"],
      hostName: newHost,
      hostPhone: newPhone,
      featured: false,
      coordinates: { x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 }
    };

    setListings(prev => [newlyCreated, ...prev]);
    alert(lang === "sw" ? "Hongera! Sebule yako sasa imewekwa hewani kwenye Pangisha!" : "Congratulations! Your living space listing is now live on Pangisha!");
    
    // Clear renter inputs
    setNewTitle("");
    setNewTitleSw("");
    setNewPrice("");
    setNewDistrict("");
    setNewHost("");
    setNewPhone("");
    setNewDesc("");
    setNewDescSw("");
    setNewAmenities([]);
    
    // Switch view to explore to show the result
    setActiveTab("explore");
  };

  // Send inquiry handling
  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMessage.trim() || !selectedInquireListing) return;

    const newInquirePayload = {
      id: `inq-${Date.now()}`,
      listingTitle: lang === "sw" ? selectedInquireListing.titleSw : selectedInquireListing.title,
      hostName: selectedInquireListing.hostName,
      message: inquiryMessage,
      date: new Date().toISOString().split("T")[0],
      phone: selectedInquireListing.hostPhone
    };

    setInquiries(prev => [newInquirePayload, ...prev]);
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setSelectedInquireListing(null);
      setInquiryMessage("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text font-sans selection:bg-natural-muted selection:text-natural-header">
      
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-natural-bg/92 backdrop-blur-md border-b border-natural-border px-4 md:px-8 py-4 transition-all" id="app_header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("explore")}>
            <div className="w-10 h-10 bg-natural-accent rounded-xl flex items-center justify-center text-white shadow-md shadow-natural-accent/20">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-natural-header">
                Pangisha<span className="text-natural-accent">.</span>
              </span>
              <p className="text-[10px] font-bold tracking-wide text-natural-soft uppercase">
                Soko la Sebule & Maisha 🇹🇿
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Tabs) */}
          <nav className="hidden md:flex items-center gap-1 bg-natural-muted p-1 rounded-full border border-natural-border">
            <button
              onClick={() => setActiveTab("explore")}
              id="nav-btn-explore"
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                activeTab === "explore"
                  ? "bg-natural-accent text-white shadow-xs"
                  : "text-natural-soft hover:bg-natural-border/50"
              }`}
            >
              {t("Explore Living Rooms")}
            </button>
            <button
              onClick={() => setActiveTab("list")}
              id="nav-btn-list"
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                activeTab === "list"
                  ? "bg-natural-accent text-white shadow-xs"
                  : "text-natural-soft hover:bg-natural-border/50"
              }`}
            >
              {t("List Your Living Room")}
            </button>
            <button
              onClick={() => setActiveTab("ai-chat")}
              id="nav-btn-chat"
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeTab === "ai-chat"
                  ? "bg-natural-secondary text-white shadow-xs"
                  : "text-natural-soft hover:bg-natural-border/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
              {t("AI Rental Advisor")}
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                activeTab === "insights"
                  ? "bg-natural-accent text-white shadow-xs"
                  : "text-natural-soft hover:bg-natural-border/50"
              }`}
            >
              {t("Market Trend Insights")}
            </button>
          </nav>

          {/* Language Toggle & Favorites Button */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(l => (l === "sw" ? "en" : "sw"))}
              id="lang-toggle-btn"
              className="flex items-center gap-2 bg-natural-muted hover:bg-natural-border/50 border border-natural-border px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer text-natural-soft"
              title="Switch Language / Badili Lugha"
            >
              <Languages className="w-4 h-4 text-natural-accent" />
              <span>{lang === "sw" ? "🇹🇿 KISWAHILI" : "🇺🇸 ENGLISH"}</span>
            </button>

            {/* Favorite Indicator Button */}
            <button
              onClick={() => setActiveTab("favorites")}
              id="favorites-shortcut-btn"
              className="relative p-2 bg-white hover:bg-natural-muted rounded-xl border border-natural-border transition-all flex items-center justify-center cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? "fill-red-500 text-red-500" : "text-natural-soft"}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </button>
            
          </div>
        </div>
      </header>

      {/* Mobile Sticky Tab switcher */}
      <div className="md:hidden sticky top-[73px] z-30 bg-natural-bg border-b border-natural-border flex p-1 grid grid-cols-5 gap-1 shadow-xs">
        <button
          onClick={() => setActiveTab("explore")}
          className={`py-2 px-1 text-[10px] text-center font-bold rounded-md flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === "explore" ? "bg-natural-accent text-white" : "text-natural-soft"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`py-2 px-1 text-[10px] text-center font-bold rounded-md flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === "list" ? "bg-natural-accent text-white" : "text-natural-soft"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Pangisha</span>
        </button>
        <button
          onClick={() => setActiveTab("ai-chat")}
          className={`py-2 px-1 text-[10px] text-center font-bold rounded-md flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === "ai-chat" ? "bg-natural-secondary text-white" : "text-natural-soft"
          }`}
        >
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          <span>Mshauri</span>
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`py-2 px-1 text-[10px] text-center font-bold rounded-md flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === "insights" ? "bg-natural-accent text-white" : "text-natural-soft"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Soko</span>
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`py-2 px-1 text-[10px] text-center font-bold rounded-md flex flex-col items-center gap-0.5 relative cursor-pointer ${
            activeTab === "favorites" ? "bg-red-600 text-white" : "text-natural-soft"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites</span>
          {favorites.length > 0 && (
            <div className="absolute top-1 right-2 bg-natural-accent w-2 h-2 rounded-full" />
          )}
        </button>
      </div>

      {/* 2. Main Content Wrapper */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">

        {/* Dynamic Alert Banner about direct Dalali fees */}
        <div className="mb-8 bg-natural-muted border-l-4 border-natural-accent rounded-r-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs" id="welcome_banner_alert">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-natural-border text-natural-header text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm">INFO</span>
              <p className="font-bold text-natural-header text-sm">
                {t("Rent a Cozy Living Space in Tanzania")}
              </p>
            </div>
            <p className="text-xs text-natural-soft mt-1 max-w-2xl">
              {t("Find room with local hospitality ('Karibu') spirit. No hidden middle-man ('Dalali') fees.")}
            </p>
          </div>
          <button
            onClick={() => setActiveTab("ai-chat")}
            className="text-xs font-semibold text-natural-soft hover:text-natural-header flex items-center justify-center gap-1 bg-white hover:bg-natural-muted border border-natural-border px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
          >
            <span>Ask AI Advisor Chat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TAB 1: EXPLORE & FILTER LISTINGS */}
        {activeTab === "explore" && (
          <div className="space-y-8 animate-fadeIn md:grid md:grid-cols-4 md:gap-8 md:space-y-0">
            
            {/* Left Sidebar Filter Section */}
            <aside className="md:col-span-1 bg-white p-6 rounded-3xl border border-natural-border shadow-sm space-y-6 h-fit sticky top-28">
              <div className="flex items-center justify-between border-b border-natural-border pb-4">
                <div className="flex items-center gap-2 font-black text-sm text-natural-header uppercase tracking-wider">
                  <Filter className="w-4 h-4 text-natural-accent" />
                  <span>{lang === "sw" ? "Vichungi" : "Filter Spaces"}</span>
                </div>
                {(searchTerm || selectedRegion !== "All" || selectedType !== "All" || selectedAmenities.length > 0) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRegion("All");
                      setSelectedType("All");
                      setPriceRange(3000000);
                      setSelectedAmenities([]);
                    }}
                    className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    {lang === "sw" ? "Suka upya" : "Reset Client"}
                  </button>
                )}
              </div>

              {/* Text Search filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                  {lang === "sw" ? "Tafuta mahali au mtaa" : "Search Title / Neighborhood"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("Search living rooms...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 pl-9 rounded-xl border border-natural-border focus:border-natural-accent focus:outline-none transition-all placeholder:text-natural-soft/40 text-natural-text"
                  />
                  <Search className="absolute left-3 top-3.5 w-4.5 h-4.5 text-natural-accent" />
                </div>
              </div>

              {/* Region Select filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                  {lang === "sw" ? "Mkoa / Jiji" : "Tanzania Region"}
                </label>
                <div className="flex flex-col gap-1">
                  {["All", "Dar es Salaam", "Zanzibar", "Arusha", "Dodoma", "Mwanza"].map((rg) => (
                    <button
                      key={rg}
                      onClick={() => setSelectedRegion(rg)}
                      className={`text-xs p-2 rounded-lg text-left font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        selectedRegion === rg
                          ? "bg-natural-accent text-white"
                          : "text-natural-soft hover:bg-natural-muted"
                      }`}
                    >
                      <span>{rg === "All" ? t("All Regions") : rg}</span>
                      {selectedRegion === rg && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                  {lang === "sw" ? "Aina ya Makazi" : "Accommodation Type"}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-natural-muted/80 text-xs p-3 rounded-xl border border-natural-border text-natural-text outline-none focus:border-natural-accent"
                >
                  <option value="All">{lang === "sw" ? "Aina Zote" : "All Types"}</option>
                  <option value="living-room">{lang === "sw" ? "Sebule Tu" : "Living Lounge Room"}</option>
                  <option value="studio">{lang === "sw" ? "Chumba cha Studio" : "Studio Apartment"}</option>
                  <option value="apartment">{lang === "sw" ? "Ghorofa/Apartment Kamili" : "Full Luxury Apartment"}</option>
                  <option value="shared-space">{lang === "sw" ? "Sebule ya Kushiriki" : "Shared Room Space"}</option>
                </select>
              </div>

              {/* Price filter in TZS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-natural-header">
                  <span className="uppercase tracking-wide">{lang === "sw" ? "Upeo mkuu wa Kodi" : "Max Monthly Rent"}</span>
                  <span className="text-natural-accent font-extrabold">TSh {(priceRange / 1000).toLocaleString()}K</span>
                </div>
                <input
                  type="range"
                  min={200000}
                  max={3000000}
                  step={50000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-natural-muted rounded-lg appearance-none cursor-pointer accent-natural-accent"
                />
                <div className="flex items-center justify-between text-[10px] text-natural-soft/80 font-bold">
                  <span>200,000 TSh</span>
                  <span>3,000,000 TSh+</span>
                </div>
              </div>

              {/* Checklist amenities filter */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                  {lang === "sw" ? "Vifaa vilivyomo (" : "Select Amenities ("}{selectedAmenities.length})
                </label>
                <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 text-xs scrollbar-thin">
                  {amenitiesOptions.map((am) => (
                    <label key={am} className="flex items-center gap-2 cursor-pointer text-natural-soft font-semibold">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(am)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAmenities(prev => [...prev, am]);
                          } else {
                            setSelectedAmenities(prev => prev.filter(x => x !== am));
                          }
                        }}
                        className="rounded border-natural-border text-natural-accent focus:ring-natural-accent w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>{am}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Micro Quick facts */}
              <div className="pt-4 border-t border-natural-border flex justify-between text-center">
                <div>
                  <div className="text-lg font-black text-natural-accent">{totalLivingRooms}</div>
                  <div className="text-[9px] font-bold uppercase text-natural-soft">{lang === "sw" ? "MASEBULE" : "LIVING ROOMS"}</div>
                </div>
                <div>
                  <div className="text-lg font-black text-natural-accent">{totalStudios}</div>
                  <div className="text-[9px] font-bold uppercase text-natural-soft">{lang === "sw" ? "STUDIO" : "STUDIOS"}</div>
                </div>
                <div>
                  <div className="text-lg font-black text-natural-accent">{totalApartments}</div>
                  <div className="text-[9px] font-bold uppercase text-natural-soft">{lang === "sw" ? "Ghorofa" : "APARTMENTS"}</div>
                </div>
              </div>

            </aside>

            {/* Right Listings Catalogue Grid & Interactive Map panel Split */}
            <section className="md:col-span-3 space-y-6">
              
              {/* Region Bento statistics carousel */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-natural-header tracking-wider uppercase mb-1">
                  {lang === "sw" ? "Mikoa Inayoongoza Pwani na Safarini" : "Explore Tanzania's Top Rental Locations"}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {TZ_REGIONS.map((reg) => (
                    <div
                      key={reg.name}
                      onClick={() => setSelectedRegion(reg.name)}
                      className={`cursor-pointer group relative overflow-hidden rounded-xl h-24 border ${
                        selectedRegion === reg.name ? "border-natural-accent ring-2 ring-natural-accent/10" : "border-natural-border/60"
                      } shadow-xs transition-all`}
                    >
                      <img
                        src={reg.image}
                        alt={reg.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end text-white">
                        <span className="text-xs font-extrabold tracking-tight">
                          {lang === "sw" ? reg.swahiliName : reg.name}
                        </span>
                        <div className="flex items-center justify-between text-[9px] opacity-90 mt-0.5">
                          <span>{reg.count} listed</span>
                          <span className="text-yellow-300 font-extrabold">{reg.avgRent}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Catalogue Listing Counter & quick status */}
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-natural-border">
                <p className="text-xs text-natural-header font-semibold" id="listing-info-text">
                  {lang === "sw" ? `Tumepata nafasi ${filteredListings.length} za vyumba/sebule nchini Tanzania` : `Found ${filteredListings.length} cozy spaces across Tanzania`}
                </p>
                
                {/* Visual view toggler (always lists beautifully) */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-extrabold uppercase text-natural-accent bg-natural-muted px-2 py-1 rounded">
                    {lang === "sw" ? "Hakuna Malipo ya Dalali" : "Direct Owner Direct Deal"}
                  </span>
                </div>
              </div>

              {/* Main Catalogue Grid */}
              {filteredListings.length === 0 ? (
                <div className="bg-natural-muted/40 border-2 border-dashed border-natural-border rounded-3xl p-12 text-center text-natural-header">
                  <div className="w-12 h-12 bg-natural-border rounded-full flex items-center justify-center mx-auto mb-4 text-natural-accent">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base">{lang === "sw" ? "Hatujapata Matokeo" : "No Spaces Found"}</h4>
                  <p className="text-xs text-natural-soft mt-1 max-w-sm mx-auto">
                    {lang === "sw"
                      ? "Jaribu kufuta baadhi ya vichungi vyako au andika herufi chache mbadala."
                      : "Try loosening your price filters or searching other neighborhoods/regions like Kigamboni or Sekei."}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRegion("All");
                      setSelectedType("All");
                      setSelectedAmenities([]);
                      setPriceRange(3000000);
                    }}
                    className="mt-4 bg-natural-accent hover:bg-natural-accent/90 text-white text-xs px-4 py-2 rounded-lg font-bold shadow transition-all cursor-pointer"
                  >
                    {lang === "sw" ? "Ondoa Vichungi Vyote" : "Clear All Filters"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="catalogue-grid-container">
                  {filteredListings.map((room) => {
                    const isFav = favorites.includes(room.id);
                    return (
                      <article
                        key={room.id}
                        id={`listing-card-${room.id}`}
                        className="bg-white rounded-3xl border border-natural-border overflow-hidden hover:shadow-md transition-all duration-350 group flex flex-col justify-between"
                      >
                        {/* Image wrapper */}
                        <div className="relative aspect-video w-full overflow-hidden bg-natural-muted">
                          <img
                            src={room.image}
                            alt={room.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                          
                          {/* Region Pill */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white px-3 py-1.5 rounded-full shadow-xs">
                            <MapPin className="w-3 h-3 text-natural-accent" />
                            <span>{room.region} • {room.district}</span>
                          </div>

                          {/* Property Type Badge */}
                          <div className="absolute top-3 right-3 bg-natural-accent text-[9px] font-bold tracking-wider text-white px-2.5 py-1 rounded-full uppercase">
                            {room.type === "living-room" ? t("Living Room") : room.type === "studio" ? t("Studio Room") : room.type === "apartment" ? t("Full Apartment") : t("Shared Space")}
                          </div>

                          {/* Favorite Action Trigger */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(room.id);
                            }}
                            className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md text-natural-soft hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Heart className={`w-4.5 h-4.5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                          </button>
                        </div>

                        {/* Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between text-natural-text">
                          <div className="space-y-1">
                            <h4 className="font-extextrabold text-base tracking-tight leading-snug text-natural-header group-hover:text-natural-accent transition-colors">
                              {lang === "sw" ? room.titleSw : room.title}
                            </h4>
                            <p className="text-xs text-natural-soft/85 line-clamp-2 mt-1">
                              {lang === "sw" ? room.descriptionSw : room.description}
                            </p>
                          </div>

                          {/* Room key stats line */}
                          <div className="grid grid-cols-3 gap-2 border-y border-natural-border my-4 py-2 text-center text-[11px] text-natural-soft font-bold">
                            <div>
                              <span className="text-[10px] block opacity-75 font-semibold">{t("Beds")}</span>
                              <span className="text-natural-header">{room.beds} Br</span>
                            </div>
                            <div className="border-x border-natural-border">
                              <span className="text-[10px] block opacity-75 font-semibold">{t("Size")}</span>
                              <span className="text-natural-header">{room.sizeSqM} m²</span>
                            </div>
                            <div>
                              <span className="text-[10px] block opacity-75 font-semibold">{t("Baths")}</span>
                              <span className="text-natural-header">{room.baths} Ba</span>
                            </div>
                          </div>

                          {/* Price & Primary Call-to-action */}
                          <div className="flex items-center justify-between mt-auto">
                            <div>
                              <p className="text-[10px] text-natural-soft font-bold uppercase tracking-wide leading-none">{t("Monthly rent")}</p>
                              <p className="text-lg font-black text-natural-accent mt-0.5">
                                TSh {room.price.toLocaleString()}
                              </p>
                              <span className="text-[9px] text-natural-soft/60 font-semibold block mt-0.5">
                                approx. ${(room.price / 2600).toFixed(0)} USD
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedMapListing(room);
                                  document.getElementById("interactive-simulation-map")?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="p-2 border border-natural-border text-natural-soft hover:bg-natural-muted rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                                title="Show on Tanzania Map"
                              >
                                <Map className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => {
                                  setSelectedInquireListing(room);
                                  setInquiryMessage(`Habari ${room.hostName}, nimeona sebule yako "${lang === "sw" ? room.titleSw : room.title}" imewekwa kwenye Pangisha. Ningependa kuuliza ikiwa bado inapatikana na nini kodi inajumuisha umeme na maji.`);
                                }}
                                className="bg-natural-accent hover:bg-natural-accent/90 text-white text-xs px-3.5 py-2.5 rounded-xl font-bold shadow-sm transition-all cursor-pointer"
                              >
                                {t("Inquire Now")}
                              </button>
                            </div>
                          </div>

                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* 3. Simulated Interactive Map Component (Standalone Canvas) */}
              <div
                id="interactive-simulation-map"
                className="bg-white rounded-3xl border border-natural-border p-6 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-natural-border pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-natural-header flex items-center gap-2">
                      <Map className="w-5 h-5 text-natural-accent" />
                      <span>{lang === "sw" ? "Ramani ya Makadilio ya Pangisha 🇹🇿" : "Pangisha Simulated Location Map"}</span>
                    </h3>
                    <p className="text-xs text-natural-soft">
                      {lang === "sw" ? "Chagua vyumba kuona kuratibu zake nchini na kuanza safari" : "Select coordinates on our custom simulated layout to calculate local commutes."}
                    </p>
                  </div>

                  {selectedMapListing && (
                    <span className="bg-natural-muted text-natural-header border border-natural-border text-[10px] font-extrabold px-3 py-1 rounded-full">
                      Selected: {selectedMapListing.district}, {selectedMapListing.region}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Map Visual (Simulated as dynamic SVG background) */}
                  <div className="lg:col-span-2 relative bg-[#F1ECD9] aspect-video sm:aspect-[1.8/1] rounded-2xl overflow-hidden border border-natural-border shadow-inner flex items-center justify-center select-none">
                    
                    {/* Simulated SVG contours */}
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                      <svg width="100%" height="100%">
                        <circle cx="20%" cy="30%" r="50" fill="#E2DAC1" />
                        <circle cx="70%" cy="60%" r="90" fill="#E2DAC1" />
                        <path d="M10,20 Q120,80 400,20 T700,100" fill="none" stroke="#DCD3B3" strokeWidth="4" />
                        <path d="M0,150 Q200,180 500,120 T900,200" fill="none" stroke="#DCD3B3" strokeWidth="4" />
                        {/* Lake Victoria */}
                        <circle cx="25%" cy="15%" r="45" fill="#C2D3E3" />
                        {/* Indian Ocean Area */}
                        <path d="M 450,400 Q 550,220 700,200 L 900,400 Z" fill="#C8DDF2" opacity="0.8" />
                      </svg>
                    </div>

                    {/* Lake Victoria Indicator Label */}
                    <div className="absolute top-5 left-[15%] text-[9px] font-bold text-sky-800 tracking-wider flex items-center gap-1 opacity-70">
                      <span>Lake Victoria</span>
                    </div>

                    {/* Coastal ocean Indian Label */}
                    <div className="absolute bottom-5 right-[18%] text-[9px] font-bold text-sky-800 tracking-widest uppercase transform rotate-25 opacity-70">
                      <span>Indian Ocean</span>
                    </div>

                    {/* City Boundary Lines representation */}
                    <div className="absolute top-1/2 left-10 text-[9px] font-bold text-natural-soft/45 tracking-widest uppercase transform -rotate-12">
                      <span>TANZANIA MAINLAND</span>
                    </div>

                    {/* Map Coordinate Markers */}
                    {listings.map((item) => {
                      const isSelected = selectedMapListing?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedMapListing(item)}
                          className={`absolute w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-red-600 scale-140 ring-4 ring-red-200 text-white z-20 shadow-md"
                              : "bg-natural-secondary border border-white hover:bg-natural-accent hover:scale-130 z-10"
                          }`}
                          style={{ left: `${item.coordinates.x}%`, top: `${item.coordinates.y}%` }}
                          title={`${item.title} (${item.district})`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </button>
                      );
                    })}

                    {/* Simulated user location Airport PIN */}
                    <div className="absolute top-[50%] left-[50%] bg-[#5A5A40] text-[9px] font-bold text-natural-muted px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-xs border border-[#4A4A30]/50">
                      <div className="w-1 h-1 rounded-full bg-green-400 animate-ping" />
                      <span>Start Hub</span>
                    </div>

                    {/* Active routing line */}
                    {selectedMapListing && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                        <line
                          x1="50%"
                          y1="50%"
                          x2={`${selectedMapListing.coordinates.x}%`}
                          y2={`${selectedMapListing.coordinates.y}%`}
                          stroke="#E05B1E"
                          strokeWidth="2.5"
                          strokeDasharray="6,4"
                          className="animate-[dash_12s_linear_infinite]"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Calculations & Instructions */}
                  <div className="bg-natural-muted p-5 rounded-2xl border border-natural-border text-xs flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-natural-header uppercase tracking-widest border-b border-natural-border pb-2 flex items-center gap-1.5">
                        <Info className="w-4.5 h-4.5 text-natural-accent" />
                        <span>{lang === "sw" ? "Mwongozo wa Usafiri" : "Transit Estimate Metrics"}</span>
                      </h4>

                      {selectedMapListing && simulatedDirections ? (
                        <div className="mt-4 space-y-3 font-medium text-natural-text">
                          <div>
                            <span className="text-[10px] block font-semibold text-natural-soft uppercase">Target Living Space</span>
                            <span className="font-extrabold text-natural-header text-sm">
                              {lang === "sw" ? selectedMapListing.titleSw : selectedMapListing.title}
                            </span>
                            <p className="text-[10px] italic text-natural-soft">City Host: {selectedMapListing.hostName}</p>
                          </div>

                          <div>
                            <span className="text-[10px] block font-semibold text-natural-soft uppercase">Departure Origin</span>
                            <span className="text-natural-header font-bold">{simulatedDirections.origin}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="bg-white p-2.5 rounded-xl border border-natural-border text-center">
                              <span className="text-[9px] block text-natural-soft uppercase font-bold">Estimated Distance</span>
                              <span className="font-black text-natural-header text-base">{simulatedDirections.distanceKm} km</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-natural-border text-center">
                              <span className="text-[9px] block text-natural-soft uppercase font-bold">Expected Time</span>
                              <span className="font-black text-natural-header text-base">{simulatedDirections.trafficMinutes} mins</span>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-natural-border text-center">
                            <span className="text-[9px] block text-green-700 uppercase font-bold">Estimated Taxi / Bolt Fare</span>
                            <span className="font-black text-green-800 text-base">TSh {simulatedDirections.estimatedTaxiTZS}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-natural-soft/80 italic mt-6 text-center">
                          {lang === "sw" ? "Bofya kibao kimoja cha chumba juu kuona mwelekeo wa usafiri" : "Click any living room in the cards above to plot distances."}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-3 border-t border-natural-border text-[10px] text-natural-soft/70 font-semibold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 block shrink-0" />
                      <span>{lang === "sw" ? "Mawasiliano na ramani ni ya makadirio ya kijiografia." : "Map calculates approximations based on regional bounds."}</span>
                    </div>
                  </div>
                </div>
              </div>

            </section>

          </div>
        )}

        {/* TAB 2: REGISTER/LIST A NEW LIVING ROOM */}
        {activeTab === "list" && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-natural-border p-8 shadow-sm animate-fadeIn">
            
            <div className="text-center space-y-2 mb-8" id="renter_form_title">
              <span className="bg-natural-muted text-natural-header text-[10px] font-black tracking-wider px-3 py-1.5 rounded-full uppercase">
                {lang === "sw" ? "WASILIANA NA WANUNUZI DIRECTLY" : "PANGISHA RENTER PORTAL"}
              </span>
              <h2 className="text-2xl font-black text-natural-header pt-2.5">
                {lang === "sw" ? "Pangisha Sebule Yako Rahisi & Salama" : "List Your Living Room in Tanzania"}
              </h2>
              <p className="text-xs text-natural-soft max-w-lg mx-auto leading-relaxed">
                {lang === "sw"
                  ? "Pata wateja sahihi, onesha kodi yako ya TSh isiyo na madalali, na uandike maelezo maridadi ukitumia faini yetu ya AI."
                  : "Fill out the fields to showcase your room. Use our integrated backend Gemini system to Polish and write stunning descriptions."}
              </p>
            </div>

            <form onSubmit={handleAddListing} className="space-y-6">

              {/* Title Section (Bilingual support) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                    English Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elegant Coastal Lounge with Sea Breeze"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 rounded-xl border border-natural-border focus:border-natural-accent outline-none transition-all text-natural-text font-medium"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                    Kiswahili Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Mfano: Sebule ya Kisasa yenye Upepo Mwanana"
                    value={newTitleSw}
                    onChange={(e) => setNewTitleSw(e.target.value)}
                    className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 rounded-xl border border-natural-border focus:border-natural-accent outline-none transition-all text-natural-text font-medium"
                  />
                </div>
              </div>

              {/* Price, Type & Region selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                    Rent (TZS / month) <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="e.g. 750000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 pl-11 rounded-xl border border-natural-border focus:border-natural-accent outline-none transition-all text-natural-text font-bold"
                    />
                    <span className="absolute left-3 top-3.5 text-[10px] font-black text-natural-accent">TSh</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                    Accommodation Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 rounded-xl border border-natural-border focus:border-natural-accent outline-none text-natural-text font-semibold cursor-pointer"
                  >
                    <option value="living-room">Living Room lounge</option>
                    <option value="studio">Studio Room</option>
                    <option value="apartment">Full Apartment</option>
                    <option value="shared-space">Shared Room Space</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                    Tanzanian Region <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 rounded-xl border border-natural-border focus:border-natural-accent outline-none text-natural-text font-semibold cursor-pointer"
                  >
                    <option value="Dar es Salaam">Dar es Salaam</option>
                    <option value="Zanzibar">Zanzibar</option>
                    <option value="Arusha">Arusha</option>
                    <option value="Dodoma">Dodoma</option>
                    <option value="Mwanza">Mwanza</option>
                  </select>
                </div>

              </div>

              {/* District, Beds, Size */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                    District or Neighborhood <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kigamboni, Njiro, Stone Town, Sinza"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 rounded-xl border border-natural-border focus:border-natural-accent outline-none text-natural-text font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                    Beds / Baths <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min={1}
                      value={newBeds}
                      onChange={(e) => setNewBeds(e.target.value)}
                      className="w-full bg-natural-muted/50 focus:bg-white text-xs p-2.5 rounded-xl border border-natural-border text-center font-bold text-natural-text"
                      title="Bedrooms"
                    />
                    <input
                      type="number"
                      required
                      min={1}
                      value={newBaths}
                      onChange={(e) => setNewBaths(e.target.value)}
                      className="w-full bg-natural-muted/50 focus:bg-white text-xs p-2.5 rounded-xl border border-natural-border text-center font-bold text-natural-text"
                      title="Bathrooms"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                    Size (m²)
                  </label>
                  <input
                    type="number"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 rounded-xl border border-natural-border text-center font-bold text-natural-text"
                  />
                </div>

              </div>

              {/* Host Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                    Your Name (Host/Owner) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dada Neema / Sheikh Salim"
                    value={newHost}
                    onChange={(e) => setNewHost(e.target.value)}
                    className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 rounded-xl border border-natural-border focus:border-natural-accent outline-none text-natural-text font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-natural-soft uppercase tracking-wide">
                    WhatsApp or Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +255 712 345 678"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 rounded-xl border border-natural-border focus:border-natural-accent outline-none text-natural-text font-mono"
                  />
                </div>
              </div>

              {/* Choose Simulated Image Asset Representation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-natural-soft uppercase tracking-wide block">
                  Select Visual Style representation for Catalog image:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { val: "1", title: "Masaki Coastal", desc: "Ocean wooden elements" },
                    { val: "2", title: "Arusha Duplex", desc: "Cool mountain woods" },
                    { val: "3", title: "Heritage Stone Town", desc: "Zanzibari traditional coral" },
                    { val: "4", title: "Affordable Cozy Studio", desc: "Trendy Kitenge theme" }
                  ].map((imgOpt) => (
                    <div
                      key={imgOpt.val}
                      onClick={() => setSelectedDemoImage(imgOpt.val)}
                      className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                        selectedDemoImage === imgOpt.val
                          ? "border-natural-accent bg-natural-muted/50"
                          : "border-natural-border bg-white hover:border-natural-soft/40"
                      }`}
                    >
                      <span className="text-xs font-bold block text-natural-header">{imgOpt.title}</span>
                      <span className="text-[10px] text-natural-soft block mt-0.5">{imgOpt.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist inputs for new Room amenities */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-natural-soft uppercase tracking-wide block">
                  List included facilities in the rent:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {amenitiesOptions.map((am) => (
                    <label key={am} className="flex items-center gap-2 text-xs text-natural-text font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAmenities.includes(am)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAmenities(prev => [...prev, am]);
                          } else {
                            setNewAmenities(prev => prev.filter(x => x !== am));
                          }
                        }}
                        className="rounded border-natural-border text-natural-accent focus:ring-natural-accent w-3.5 h-3.5"
                      />
                      <span>{am}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Multi-language Description with AI Generation integration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-natural-border pb-2">
                  <label className="text-xs font-bold text-natural-header uppercase tracking-wide">
                    Room Descriptions & Cozy Pitch (English & Swahili)
                  </label>
                  <button
                    type="button"
                    onClick={handleAIDescriptionPolish}
                    disabled={isAILoadingDesc}
                    className="flex items-center gap-2 bg-natural-accent hover:bg-natural-accent/90 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm transition-all hover:scale-[1.01] border border-natural-accent/30 disabled:opacity-60 cursor-pointer"
                  >
                    {isAILoadingDesc ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Kuweka faini na AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
                        <span>{t("AI Description Polish")}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-natural-soft">English Description *</span>
                    <textarea
                      required
                      rows={5}
                      placeholder="e.g. Beautiful serene room in a secure estate. Has uninterrupted power with backup batteries, fully furnished kitchen access, and high ceiling workspace..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 rounded-xl border border-natural-border focus:border-natural-accent outline-none text-natural-text font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-natural-soft">Kiswahili Maelezo (Optional)</span>
                    <textarea
                      rows={5}
                      placeholder="Maudhui ya kupendeza ya kuelezea chumba, ulinzi, urahisi wa kufika barabarani, na miundombinu mbalimbali kama vile maji na umeme ..."
                      value={newDescSw}
                      onChange={(e) => setNewDescSw(e.target.value)}
                      className="w-full bg-natural-muted/50 focus:bg-white text-xs p-3.5 rounded-xl border border-natural-border focus:border-natural-accent outline-none text-natural-text font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Listing Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-natural-button hover:bg-natural-button-hover text-white text-xs py-4.5 rounded-xl font-black tracking-widest uppercase transition-all shadow-md cursor-pointer"
                >
                  {t("Submit Listing")}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: MULTILINGUAL AI ADVOCATE ROBOT */}
        {activeTab === "ai-chat" && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-natural-border shadow-sm overflow-hidden flex flex-col h-[600px] animate-fadeIn">
            
            {/* Thread Header */}
            <div className="bg-natural-header-bg text-natural-header-text p-6 flex items-center justify-between border-b border-natural-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-natural-accent rounded-full flex items-center justify-center animate-pulse text-white font-black">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">Pangisha Swahili-English AI Advisor</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse block" />
                    <span className="text-[10px] text-natural-soft font-medium">Powering by Gemini 3-Flash • Online Now</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-natural-accent/10 border border-natural-accent/20 font-extrabold px-3 py-1 rounded-sm uppercase tracking-wider text-natural-accent">
                Wana-Pwani & Bara Guide
              </span>
            </div>

            {/* Quick Suggestions Box */}
            <div className="bg-natural-muted/70 px-4 py-3 border-b border-natural-border flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none text-[10px]">
              <span className="font-extrabold text-natural-header/80 mr-1 uppercase">Majaribio ya haraka:</span>
              {[
                "Natafuta sebule nzuri Kigamboni chini ya laki nane TSh",
                "Recommend upscale spaces in Sekei Arusha",
                "Masaki vs Sinza is good for budget?",
                "Zanzibar traditional stone town rooms"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setChatInput(suggestion)}
                  className="bg-white hover:bg-natural-muted text-natural-text border border-natural-border px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Message flow viewport */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-natural-muted/30">
              {chatMessages.map((msg, i) => {
                const isAI = msg.role === "assistant";
                return (
                  <div
                    key={i}
                    className={`flex ${isAI ? "justify-start" : "justify-end"} animate-slideIn`}
                  >
                    <div className={`flex items-start gap-2.5 max-w-[80%]`}>
                      {isAI && (
                        <div className="w-8 h-8 rounded-full bg-natural-accent text-white flex items-center justify-center text-xs font-black shrink-0">
                          P
                        </div>
                      )}
                      
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed transition-all ${
                          isAI
                            ? "bg-white text-natural-text border border-natural-border shadow-xs animate-fadeIn"
                            : "bg-natural-accent text-white shadow-xs rounded-tr-none animate-fadeIn"
                        }`}
                      >
                        {/* Preserve paragraph lines */}
                        <p className="whitespace-pre-line font-medium">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-natural-accent text-white flex items-center justify-center text-xs font-black shrink-0">
                      P
                    </div>
                    <div className="bg-white p-4 rounded-2xl text-xs border border-natural-border flex items-center gap-2 text-natural-soft font-bold">
                      <Loader2 className="w-4 h-4 text-natural-accent animate-spin" />
                      <span>Mshauri wa AI anasoma mahitaji yako...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Thread inputs footer */}
            <div className="p-4 bg-white border-t border-natural-border flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendChatMessage();
                }}
                placeholder={lang === "sw" ? "Andika swali lako la makazi hapa... (Mfano: vyumba vya Dodoma)" : "Ask or filter living rooms... (e.g. recommend listings with backup generators)"}
                className="flex-1 bg-natural-muted/50 text-xs p-3.5 rounded-xl border border-natural-border focus:bg-white outline-none text-natural-text focus:border-natural-accent font-medium"
              />
              <button
                onClick={handleSendChatMessage}
                disabled={!chatInput.trim() || isChatLoading}
                className="bg-natural-button hover:bg-natural-button-hover disabled:opacity-50 text-white p-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 4: FAVORITES & USER SUBMITTED INQUIRIES */}
        {activeTab === "favorites" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header statistics section */}
            <div className="bg-natural-header-bg text-natural-header-text p-6 rounded-3xl border border-natural-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">{t("Welcome back to Pangisha!")}</h2>
                <p className="text-xs text-natural-soft mt-1">
                  {t("Find your dream home in Arusha, Dar es Salaam or Zanzibar in seconds.")}
                </p>
              </div>

              <div className="flex gap-4">
                <div className="bg-natural-muted/50 p-3 rounded-xl border border-natural-border text-center text-xs font-bold leading-none">
                  <span className="text-[10px] block text-natural-soft">{lang === "sw" ? "Hifadhi" : "Favs Listed"}</span>
                  <span className="text-xl font-black text-natural-accent mt-1 block">{favorites.length}</span>
                </div>

                <div className="bg-natural-muted/50 p-3 rounded-xl border border-natural-border text-center text-xs font-bold leading-none">
                  <span className="text-[10px] block text-natural-soft">{lang === "sw" ? "Mawasiliano" : "Inquiries Left"}</span>
                  <span className="text-xl font-black text-natural-accent mt-1 block">{inquiries.length}</span>
                </div>
              </div>
            </div>

            {/* Split layout: Saved Living Rooms vs Completed Contacts forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: My Saved Favorite Listings */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-base border-b border-natural-border pb-2 text-natural-header flex items-center gap-1.5">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span>{t("My Saved Listings")} ({favorites.length})</span>
                </h3>

                {favorites.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-natural-border text-natural-soft">
                    <p className="text-xs">
                      {lang === "sw"
                        ? "Bado haujachukua sebule yoyote kama pendwa!"
                        : "You haven't added any living rooms to your favorites list yet."}
                    </p>
                    <button
                      onClick={() => setActiveTab("explore")}
                      className="mt-3 bg-natural-accent text-white text-xs px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-natural-accent/90"
                    >
                      Browse Rooms
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.filter(l => favorites.includes(l.id)).map((room) => (
                      <div
                        key={room.id}
                        className="bg-white p-4 rounded-xl border border-natural-border flex gap-4 hover:shadow-xs transition-all relative"
                      >
                        <img
                          src={room.image}
                          alt={room.title}
                          referrerPolicy="no-referrer"
                          className="w-24 h-24 object-cover rounded-lg bg-natural-muted/60"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-extrabold text-natural-accent bg-natural-muted/60 px-2 py-0.5 rounded uppercase">
                              {room.region}
                            </span>
                            <h4 className="font-bold text-xs text-natural-header mt-1 leading-snug">
                              {lang === "sw" ? room.titleSw : room.title}
                            </h4>
                            <p className="font-extrabold text-natural-text text-xs mt-1">
                              TSh {room.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                setSelectedInquireListing(room);
                                setInquiryMessage(`Habari ${room.hostName}, bado kitambulisho hiki kiko hewani?`);
                              }}
                              className="text-[10px] font-bold text-white bg-natural-accent hover:bg-natural-accent/90 px-3 py-1.5 rounded-md cursor-pointer"
                            >
                              Inquire Now
                            </button>
                            <button
                              onClick={() => toggleFavorite(room.id)}
                              className="text-[10px] font-extrabold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Outgoing inquiries sent to host WhatsApp contacts */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-base border-b border-natural-border pb-2 text-natural-header flex items-center gap-1.5">
                  <MessageSquare className="w-5 h-5 text-natural-accent" />
                  <span>{lang === "sw" ? "Maswali niliyotuma kwa Wamiliki" : "Host Inquiry Inbox Logs"}</span>
                </h3>

                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white p-5 rounded-xl border-l-4 border-natural-accent border-y border-r border-natural-border text-xs font-semibold text-natural-text"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-natural-accent">Room: {inq.listingTitle}</span>
                        <span className="text-[9px] opacity-75 font-mono text-natural-soft">{inq.date}</span>
                      </div>
                      <p className="text-natural-soft mt-2 italic font-medium leading-relaxed">"{inq.message}"</p>
                      
                      <div className="mt-4 pt-3 border-t border-natural-border flex items-center justify-between">
                        <div>
                          <span className="text-[9px] block text-natural-soft">Host Contact:</span>
                          <span className="text-[10px] font-bold text-natural-header">{inq.hostName} ({inq.phone})</span>
                        </div>

                        {/* Real-world direct seamless action integration - redirect WhatsApp */}
                        <a
                          href={`https://api.whatsapp.com/send?phone=${inq.phone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(inq.message)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[10px] bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 font-extrabold border border-emerald-200/50 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Direct WhatsApp Chat</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        )}

        {/* TAB 5: MARKET TREND INSIGHTS (AI REGION SUMMARY OVERVIEWS) */}
        {activeTab === "insights" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            
            <div className="bg-white p-8 rounded-3xl border border-natural-border shadow-xs space-y-6">
              
              <div className="space-y-2 border-b border-natural-border pb-4">
                <span className="text-[10px] font-extrabold text-natural-accent bg-natural-muted/60 px-2.5 py-1 rounded block w-fit">
                  {lang === "sw" ? "MWELEKEO WA BEI NA USALAMA" : "TANZANIA URBAN RENTAL STATISTICS"}
                </span>
                <h2 className="text-xl font-black text-natural-header flex items-center gap-2">
                  <Compass className="w-5 h-5 text-natural-accent" />
                  <span>{lang === "sw" ? "Uchambuzi wa Kodi za Makazi nchini na AI" : "Tanzania Real Estate Market Prices & Insights"}</span>
                </h2>
                <p className="text-xs text-natural-soft font-medium">
                  {lang === "sw" ? "Bofya mkoa wowote kuona kiasi cha kodi, usalama na taarifa za ulinzi" : "Select a region below to query real-time market averages, upscale neighborhoods, and commute tips using the server-side Gemini system."}
                </p>
              </div>

              {/* Selector layout of Tanzania districts */}
              <div className="flex flex-wrap gap-2">
                {["Dar es Salaam", "Zanzibar", "Arusha", "Dodoma", "Mwanza"].map((rg) => (
                  <button
                    key={rg}
                    onClick={() => {
                      setSelectedInsightRegion(rg);
                      fetchRegionInsights(rg);
                    }}
                    className={`text-xs px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      selectedInsightRegion === rg
                        ? "bg-natural-button text-white"
                        : "bg-natural-muted/60 hover:bg-natural-muted text-natural-text border border-natural-border"
                    }`}
                  >
                    {rg}
                  </button>
                ))}
              </div>

              {/* Response output */}
              <div className="bg-natural-muted/20 rounded-2xl p-6 border border-natural-border min-h-[250px] relative transition-all">
                {isInsightLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs rounded-2xl">
                    <Loader2 className="w-8 h-8 text-natural-accent animate-spin" />
                    <p className="text-xs font-extrabold text-natural-header mt-2 block">
                      {lang === "sw" ? "Mchambuzi wa AI anajenga taarifa za kijiografia..." : "AI Analyst compiling real-time insights..."}
                    </p>
                  </div>
                ) : null}

                {/* Styled text representation */}
                {insightText ? (
                  <div className="text-xs leading-relaxed text-natural-text font-medium whitespace-pre-line space-y-2">
                    {insightText}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center text-natural-soft font-bold gap-2">
                    <Info className="w-6 h-6 text-natural-accent" />
                    <p>No compiled insights. Click a city name to generate.</p>
                  </div>
                )}
              </div>

              {/* Local rental warnings advice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-natural-border text-[11px] font-bold text-natural-text">
                <div className="bg-natural-muted/50 p-4 rounded-xl border border-natural-border">
                  <h4 className="font-extrabold text-natural-header uppercase tracking-wider block mb-1">
                    🇹🇿 Dalali & Tenant Protection
                  </h4>
                  <p className="font-medium text-natural-soft leading-normal">
                    In Tanzania, rent is traditionally asked 6 months or 1 year in advance. Always negotiate for 3 months or monthly payments. Pangisha listings have host verification tags to counter fake agents ("Dalali").
                  </p>
                </div>

                <div className="bg-natural-muted/50 p-4 rounded-xl border border-natural-border">
                  <h4 className="font-extrabold text-natural-header uppercase tracking-wider block mb-1">
                    💡 Water & Backup Utilities
                  </h4>
                  <p className="font-medium text-natural-soft leading-normal">
                    Due to seasonal water supply variations, check if the living room/house has elevated Luku (electric billing counters) and overhead water conservation tanks ("Simbatanks"). These are crucial for coastal cities.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* 4. Inquiry Modal Dialog Backdrop */}
      <AnimatePresence>
        {selectedInquireListing && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 border border-natural-border shadow-2xl space-y-4 text-natural-text text-xs font-semibold relative"
            >
              <button
                onClick={() => setSelectedInquireListing(null)}
                className="absolute top-4 right-4 text-natural-soft hover:text-natural-header cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={selectedInquireListing.image}
                  alt={selectedInquireListing.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-lg bg-natural-muted/60"
                />
                <div>
                  <span className="text-[9px] font-bold text-natural-accent uppercase">INQUIRE SPACE</span>
                  <h3 className="font-extrabold text-sm text-natural-header">{lang === "sw" ? selectedInquireListing.titleSw : selectedInquireListing.title}</h3>
                  <p className="text-natural-accent font-extrabold font-mono text-[11px] mt-0.5">
                    Rent: TSh {selectedInquireListing.price.toLocaleString()}/month
                  </p>
                </div>
              </div>

              {inquirySuccess ? (
                <div className="bg-emerald-50 text-emerald-800 p-5 rounded-xl border border-emerald-200 text-center space-y-2 animate-bounce">
                  <span className="text-base font-black">Asante sana! (Message Prepared)</span>
                  <p className="text-[11px] font-medium leading-relaxed">
                    Your inquiry has been successfully saved to your Favorites Dashboard logs. You can now tap 'Direct WhatsApp' anytime to open message in WhatsApp!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold text-natural-header">
                      Message to {selectedInquireListing.hostName} ({selectedInquireListing.hostPhone})
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Your custom message..."
                      className="w-full bg-natural-muted/50 p-3 rounded-xl border border-natural-border focus:bg-white outline-none text-natural-text font-medium text-xs leading-relaxed focus:border-natural-accent"
                    />
                  </div>

                  <div className="bg-natural-muted/60 p-3 rounded-lg text-[10px] text-natural-soft font-semibold leading-relaxed">
                    This directly saves to your Pangisha app outbound dashboard, allowing you to quickly redirect to direct phone booking or initiate WhatsApp drafts with verified landlord.
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedInquireListing(null)}
                      className="border border-natural-border hover:bg-natural-muted text-natural-header p-3 rounded-xl font-bold cursor-pointer"
                    >
                      Cancel / Futa
                    </button>
                    <button
                      type="submit"
                      className="bg-natural-button hover:bg-natural-button-hover text-white p-3 rounded-xl font-black uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Prepare Inquiry</span>
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Custom footer */}
      <footer className="bg-amber-950 text-amber-100 py-12 px-6 border-t border-amber-900 mt-20 text-center md:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <span className="text-lg font-black tracking-wider text-white">
              Pangisha<span className="text-amber-500">.</span>
            </span>
            <p className="text-xs text-amber-300 max-w-xs leading-relaxed font-medium">
              Eliminating Dalali Middlemen charges across Tanzania. Directly connecting seekers to vetted living rooms and coastal spaces with warmth and transparency.
            </p>
            <div className="text-[10px] text-amber-400 font-mono">
              Karibu Sana na Heri ya Siku!
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Popular Cities</h4>
            <ul className="text-xs space-y-2 text-amber-305 font-medium">
              <li className="hover:text-amber-200 cursor-pointer" onClick={() => { setSelectedRegion("Dar es Salaam"); setActiveTab("explore"); }}>Dar es Salaam (Kigamboni & Masaki)</li>
              <li className="hover:text-amber-200 cursor-pointer" onClick={() => { setSelectedRegion("Zanzibar"); setActiveTab("explore"); }}>Zanzibar (Stone Town & Nungwi)</li>
              <li className="hover:text-amber-200 cursor-pointer" onClick={() => { setSelectedRegion("Arusha"); setActiveTab("explore"); }}>Arusha (Sekei & Njiro)</li>
              <li className="hover:text-amber-200 cursor-pointer" onClick={() => { setSelectedRegion("Dodoma"); setActiveTab("explore"); }}>Dodoma Legislative Areas</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Renter Help</h4>
            <ul className="text-xs space-y-2 text-amber-305 font-medium">
              <li className="hover:text-amber-200 cursor-pointer" onClick={() => setActiveTab("list")}>{t("List Your Living Room")}</li>
              <li className="hover:text-amber-200 cursor-pointer" onClick={() => setActiveTab("ai-chat")}>How to use AI copywriting?</li>
              <li className="hover:text-amber-200 cursor-pointer" onClick={() => setActiveTab("insights")}>Region rent price analytics</li>
              <li className="hover:text-stone-300">Tenant code of conduct</li>
            </ul>
          </div>

          <div className="bg-amber-900/40 p-4 rounded-xl border border-amber-800 space-y-2 text-center text-xs">
            <p className="font-extrabold text-amber-200 text-xs">Pangisha Advisor Offline?</p>
            <p className="text-[11px] leading-relaxed text-amber-300/80">
              Ensure you configure the 'GEMINI_API_KEY' secret via Settings to unleash live multilingual swahili conversations & description writer.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-amber-900/60 text-center text-[10px] text-amber-400 font-bold flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p>© 2026 Pangisha Inc. Licensed under Apache-2.0. No Dalali commissions policy applies.</p>
          <div className="flex justify-center gap-4">
            <span className="hover:underline cursor-pointer">Sera ya Faragha</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Vigezo na Masharti</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
