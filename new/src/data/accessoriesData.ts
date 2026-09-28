export interface ReviewSentiment {
  redditScore: number; // 0 to 100
  redditSummary: string;
  sponsoredHypeScore: number; // 0 to 10 (higher means more sponsored hype)
  durabilityComplaintRate: number; // percentage
  reviewQualityScore: number; // 0 to 100
  recentComplaints: string[];
}

export interface Accessory {
  id: string;
  name: string;
  brand: string;
  category: 'tws' | 'headphones' | 'gaming-headsets' | 'wired-earphones' | 'speakers' | 'chargers' | 'power-banks' | 'mobile' | 'laptop' | 'keyboards' | 'mouse';
  priceINR: number;
  priceUSD: number;
  rating: number;
  image: string;
  keyFeatures: string[];
  batteryLife: string;
  anc: string;
  driverSize: string;
  bluetoothVersion: string;
  codecs: string[];
  latency: string; // e.g. "45ms", "120ms"
  micQuality: string; // e.g. "Excellent (4.5/5)", "Average (3/5)"
  fastCharging: string;
  waterResistance: string;
  warranty: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  audioQualitySummary: string;
  comfortLevel: string;
  buildQuality: string;
  brandTrustScore: number; // 0 to 10
  supportScore: number; // 0 to 10
  durabilityScore: number; // 0 to 10
  finalVerdict: string;
  sentiment: ReviewSentiment;
}

export const accessoriesData: Accessory[] = [
  // TWS Earbuds
  {
    id: "tws-oneplus-buds-3",
    name: "OnePlus Buds 3",
    brand: "OnePlus",
    category: "tws",
    priceINR: 5499,
    priceUSD: 79,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["49dB Active Noise Cancellation", "Dual Dynamic Drivers (10.4mm + 6mm)", "LHDC 5.0 Hi-Res Audio", "Sliding Volume Control"],
    batteryLife: "44 hours (ANC off with case)",
    anc: "Smart Active Noise Cancellation (Up to 49dB)",
    driverSize: "10.4mm woofer + 6mm tweeter dual drivers",
    bluetoothVersion: "Bluetooth 5.3",
    codecs: ["SBC", "AAC", "LHDC 5.0"],
    latency: "94ms (Pro Gaming Mode)",
    micQuality: "Excellent (3-mic setup with AI noise reduction)",
    fastCharging: "Yes (10 mins charge = 7 hours playback)",
    waterResistance: "IP55 dust and water resistance",
    warranty: "1 Year Domestic Warranty",
    pros: [
      "Exceptional soundstage with deep punchy bass and detailed treble",
      "Highly effective sliding touch volume control on the stems",
      "Strong ANC that filters out high and low frequency hums",
      "Very fast charging speed"
    ],
    cons: [
      "LHDC codec not supported on non-OnePlus/non-Android devices (falls back to AAC)",
      "Fit can feel a bit slippery during extreme workouts",
      "Case build quality feels slightly plasticky"
    ],
    bestFor: "All-rounder daily usage, commuting, and balanced listening",
    audioQualitySummary: "Dual drivers deliver deep, well-controlled bass without muddying the mids. Treble is bright and crisp, and LHDC codec support ensures rich detail resolution on compatible devices.",
    comfortLevel: "Very High. Lightweight at 4.8g per earbud. Ergonomic nozzle design allows fatigue-free listening for up to 5 hours.",
    buildQuality: "High-grade matte finish plastic with glossy metallic stems. Premium look, though case hinge has slight play.",
    brandTrustScore: 8.5,
    supportScore: 8.0,
    durabilityScore: 8.2,
    finalVerdict: "The OnePlus Buds 3 offer flagship-tier dual drivers and excellent ANC at a mid-range price. An absolute no-brainer for OnePlus or Android users, though iPhone users will miss out on the LHDC high-res codec.",
    sentiment: {
      redditScore: 88,
      redditSummary: "Redditors highly praise the dual-driver separation, noting it rivals earbuds twice the price. Some complain about the glossy stems being fingerprint magnets, but general consensus ranks it as the best under ₹6000 ($80).",
      sponsoredHypeScore: 3.5,
      durabilityComplaintRate: 4,
      reviewQualityScore: 92,
      recentComplaints: [
        "Slight crackle in left earbud after 4 months of heavy gym use",
        "Case lid scratch marks appear too easily"
      ]
    }
  },
  {
    id: "tws-realme-buds-air-6-pro",
    name: "Realme Buds Air 6 Pro",
    brand: "Realme",
    category: "tws",
    priceINR: 4999,
    priceUSD: 69,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["50dB Active Noise Cancellation", "Dual Drivers (11mm + 6mm)", "LDAC Hi-Res Audio", "40ms Ultra-Low Latency Mode"],
    batteryLife: "40 hours total playback",
    anc: "50dB Hybrid Active Noise Cancellation",
    driverSize: "11mm bass driver + 6mm micro-planar tweeter",
    bluetoothVersion: "Bluetooth 5.3",
    codecs: ["SBC", "AAC", "LDAC"],
    latency: "40ms (Gaming mode enabled)",
    micQuality: "Great (6-mic setup for clean call quality)",
    fastCharging: "Yes (10 mins charge = 7 hours playback)",
    waterResistance: "IPX5 water resistance",
    warranty: "1 Year Warranty",
    pros: [
      "True ultra-low latency (40ms) makes it viable for casual gaming",
      "Universal LDAC support provides high-resolution audio on almost all Android devices",
      "Very strong static hum suppression (50dB ANC)",
      "Dual device connection works flawlessly"
    ],
    cons: [
      "Dynamic bass can sometimes overwhelm the vocals if not EQ'd",
      "Slightly bulkier case compared to rivals",
      "Companion app requires extensive permissions on Android"
    ],
    bestFor: "Gaming, EDM/Hip-Hop lovers, and busy office calls",
    audioQualitySummary: "Planar tweeter provides excellent vocal clarity, while the 11mm woofer hits hard on bass. Sound is pre-tuned to a warm V-shape. Perfect for bass heads, but purists will need to tweak the custom EQ.",
    comfortLevel: "High. Fits securely, making them excellent for running and light workouts.",
    buildQuality: "Glossy pebble-shaped case with solid hinge. Earbuds feel robust and well-sealed.",
    brandTrustScore: 7.8,
    supportScore: 7.5,
    durabilityScore: 8.0,
    finalVerdict: "A technological powerhouse. If you want high-resolution LDAC audio, 50dB ANC, and actual gaming-ready latency without spending premium cash, this is your best option.",
    sentiment: {
      redditScore: 84,
      redditSummary: "Praised heavily on r/BudgetAudophile for LDAC sound quality and the planar tweeter. However, many users advise turning down the bass boost in the app to prevent vocal bleeding.",
      sponsoredHypeScore: 4.8,
      durabilityComplaintRate: 6,
      reviewQualityScore: 88,
      recentComplaints: [
        "Realme Link app takes too long to pair on older phones",
        "Right earbud stopped charging due to dirty contacts (fixed by cleaning with alcohol)"
      ]
    }
  },
  {
    id: "tws-cmf-buds-pro-2",
    name: "CMF by Nothing Buds Pro 2",
    brand: "Nothing",
    category: "tws",
    priceINR: 4299,
    priceUSD: 59,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["Smart Rotary Dial on Case", "50dB Hybrid ANC", "Spatial Audio Effect", "LDAC support"],
    batteryLife: "43 hours total playback",
    anc: "50dB Hybrid ANC with Smart Environmental adaptation",
    driverSize: "11mm bass driver + 6mm micro-planar tweeter",
    bluetoothVersion: "Bluetooth 5.3",
    codecs: ["SBC", "AAC", "LDAC"],
    latency: "50ms (Low Latency Mode)",
    micQuality: "Good (Clear vocals, struggles slightly in windy environments)",
    fastCharging: "Yes (10 mins = 3 hours with ANC on)",
    waterResistance: "IP55 dust and water resistance",
    warranty: "1 Year Warranty",
    pros: [
      "Unique physical rotary dial on the case that controls volume/tracks",
      "Stunning design aesthetics with premium matte finish colors",
      "Very comfortable and lightweight",
      "Intuitive and clean companion app (Nothing X)"
    ],
    cons: [
      "The physical dial can spin accidentally inside tight pockets",
      "Spatial audio effect feels gimmicky and introduces artificial reverb",
      "ANC struggles slightly with high-frequency voices"
    ],
    bestFor: "Style-conscious users, heavy commutes, and simple tactile controls",
    audioQualitySummary: "Fun, warm sound signature with punchy bass. The LDAC codec captures nice instrument separation, although mids are slightly recessed.",
    comfortLevel: "Very High. One of the most comfortable options in the sub-5k category. Fits small ears easily.",
    buildQuality: "Superb. Premium matte plastic case with rubberized texture. Rotary dial is solid and clicky.",
    brandTrustScore: 8.0,
    supportScore: 7.8,
    durabilityScore: 8.5,
    finalVerdict: "A refreshing product with a genuinely useful hardware dial. It packs excellent audio and ANC into a gorgeous, highly durable case.",
    sentiment: {
      redditScore: 86,
      redditSummary: "Users love the custom dial for adjusting volume directly on the desk. Sound quality is considered very competitive, though spatial audio is generally disliked.",
      sponsoredHypeScore: 5.2,
      durabilityComplaintRate: 3,
      reviewQualityScore: 85,
      recentComplaints: [
        "Case dial registered a phantom rotation once inside a backpack",
        "Yellow version shows dirt stains over months"
      ]
    }
  },

  // Headphones
  {
    id: "hp-sony-ch720n",
    name: "Sony WH-CH720N",
    brand: "Sony",
    category: "headphones",
    priceINR: 7990,
    priceUSD: 128,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["Integrated V1 Processor (same as 1000XM5)", "Dual Noise Sensor technology", "35 hours battery with ANC", "Multipoint connection"],
    batteryLife: "35 hours with ANC, 50 hours with ANC off",
    anc: "Yes, Digital ANC with Dual Noise Sensor",
    driverSize: "30mm dynamic drivers",
    bluetoothVersion: "Bluetooth 5.2",
    codecs: ["SBC", "AAC"],
    latency: "180ms",
    micQuality: "Excellent (Precise Voice Pickup technology with Beamforming mics)",
    fastCharging: "Yes (3 min charge = up to 1 hour playback)",
    waterResistance: "No IP rating",
    warranty: "1 Year Domestic Warranty",
    pros: [
      "Incredibly lightweight (only 192g) for full-sized headphones",
      "V1 chip provides remarkably clean, detailed audio processing",
      "Excellent mic quality for office calls and Zoom meetings",
      "Sony Headphones Connect app provides rich EQ customizability"
    ],
    cons: [
      "Earpads are somewhat shallow; ears might touch the inner driver mesh",
      "Do not fold down compactly (swivel flat only)",
      "Build is almost entirely lightweight plastic and feels somewhat cheap"
    ],
    bestFor: "Work from home, long Zoom calls, and everyday office wear",
    audioQualitySummary: "Balanced and clean out of the box. Sony's DSEE upscaling restores compressed tracks nicely. The 30mm driver does not have the overwhelming bass boom of the Sony XB series, offering a more natural acoustic presentation.",
    comfortLevel: "Excellent. Extremely lightweight frame reduces clamp force fatigue, though shallow cups might bother people with larger ears.",
    buildQuality: "Fair. Solid assembly, but the plastics feel light and scratch easily.",
    brandTrustScore: 9.0,
    supportScore: 8.5,
    durabilityScore: 7.8,
    finalVerdict: "The best lightweight over-ear ANC headphones for calls and music. Sony's V1 processor punches above its price class, although the physical plastic build feels a bit delicate.",
    sentiment: {
      redditScore: 80,
      redditSummary: "Redditors note that the ANC is about 70% of the flagship XM5, which is amazing for a third of the price. The lightweight design is praised, but some express concerns over headband durability.",
      sponsoredHypeScore: 2.8,
      durabilityComplaintRate: 8,
      reviewQualityScore: 89,
      recentComplaints: [
        "Headband pad is very thin and can press on the crown of the head after 4 hours",
        "Slight creak in the left swivel arm when walking"
      ]
    }
  },
  {
    id: "hp-soundcore-space-one",
    name: "Anker Soundcore Space One",
    brand: "Anker",
    category: "headphones",
    priceINR: 6999,
    priceUSD: 99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["2X Stronger Voice Reduction ANC", "LDAC Hi-Res Wireless", "40 hours battery (ANC on)", "Wear Detection Sensors"],
    batteryLife: "40 hours (ANC on), 55 hours (ANC off)",
    anc: "Upgraded Adaptive Hybrid ANC",
    driverSize: "40mm customized dynamic drivers",
    bluetoothVersion: "Bluetooth 5.3",
    codecs: ["SBC", "AAC", "LDAC"],
    latency: "140ms",
    micQuality: "Good (3 microphones with AI algorithm)",
    fastCharging: "Yes (5 mins = 4 hours playback)",
    waterResistance: "IPX4 splash resistance (rare for over-ears)",
    warranty: "18 Months Warranty (Longer than competitors)",
    pros: [
      "Outstanding ANC for commuting; exceptionally good at blocking mid-frequency chatter",
      "Supports LDAC codec for rich, uncompressed audio playback",
      "Smart Wear Detection auto-pauses music when taken off",
      "Comes with an 18-month warranty and robust carrying pouch"
    ],
    cons: [
      "Ear cups trap heat during outdoor summer usage",
      "Soundcore's signature sound is heavily bass-boosted by default (needs 'Acoustic' EQ preset)",
      "Wear detection can be slow to respond occasionally"
    ],
    bestFor: "Commuters, travel, and bass-heavy audio enthusiasts",
    audioQualitySummary: "Boomy and energetic. Custom 40mm drivers push plenty of sub-bass detail. When LDAC is activated on Android, instrument layering becomes much more distinct and pleasurable.",
    comfortLevel: "High. Deep, plush memory foam earcups provide excellent clamping seal, though they can sweat during hot weather.",
    buildQuality: "Very Good. Matte soft-touch plastics, metal reinforced headband slider. Feels much more premium than the Sony CH720N.",
    brandTrustScore: 8.2,
    supportScore: 8.0,
    durabilityScore: 8.7,
    finalVerdict: "If you prioritize ANC performance, premium build feel, and long battery life for traveling, the Space One is an exceptional value pick, especially with its 18-month warranty.",
    sentiment: {
      redditScore: 85,
      redditSummary: "Highly recommended in r/headphones as the top sub-$100 ANC over-ear. Users love the build design and the depth of the EQ in the Soundcore app.",
      sponsoredHypeScore: 4.0,
      durabilityComplaintRate: 4,
      reviewQualityScore: 87,
      recentComplaints: [
        "Earpads started showing minor wear on the stitching after 9 months of intense daily use",
        "LDAC causes slight audio stutters when walking in crowded signal areas like train stations"
      ]
    }
  },

  // Gaming Headsets
  {
    id: "gh-hyperx-cloud-iii",
    name: "HyperX Cloud III Wireless",
    brand: "HyperX",
    category: "gaming-headsets",
    priceINR: 11999,
    priceUSD: 149,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["Up to 120-Hour Battery Life", "Ultra-clear 10mm Detachable Mic", "DTS Headphone:X Spatial Audio", "2.4GHz Ultra-Low Latency Wireless"],
    batteryLife: "Up to 120 hours of continuous gaming",
    anc: "None (Passive physical isolation is high)",
    driverSize: "53mm angled dynamic drivers",
    bluetoothVersion: "None (Uses 2.4GHz USB Dongle + USB-C adapter)",
    codecs: ["Proprietary lossless 2.4GHz protocol"],
    latency: "Under 20ms (Lossless wireless transmission)",
    micQuality: "Excellent (10mm microphone with internal metal mesh pop filter)",
    fastCharging: "Yes",
    waterResistance: "None",
    warranty: "2 Years Warranty",
    pros: [
      "Unbelievable 120-hour battery life (charge once a month for casual users)",
      "Legendary comfort with signature HyperX memory foam and soft leatherette",
      "Detachable mic is one of the clearest on any wireless headset",
      "Vastly improved 53mm angled drivers deliver exceptional positional audio cues"
    ],
    cons: [
      "No Bluetooth support (cannot pair with your phone directly unless using the USB dongle)",
      "No active noise cancellation (ANC)",
      "Lacks deep sub-bass impact (tuned strictly for tactical gaming mid-high clarity)"
    ],
    bestFor: "Competitive FPS gaming (Valorant, CS2, CoD) and long streams",
    audioQualitySummary: "Tactical and clear. Tuning is focused on spatial awareness, footprints, and vocal frequencies. Mids and highs are clean, though EDM and movie enthusiasts will find the bass roll-off a bit dry.",
    comfortLevel: "Unmatched. The gold standard of gaming headset comfort. Lightweight metal frame distributes pressure perfectly, with extremely plush earcups.",
    buildQuality: "Elite. Full steel and aluminum headband frame with robust metal forks. Exceptionally durable.",
    brandTrustScore: 9.2,
    supportScore: 8.4,
    durabilityScore: 9.5,
    finalVerdict: "A legendary gaming headset upgraded. If you prioritize comfort, mic quality, physical durability, and low latency for PC/Console gaming, this is the absolute best wireless headset on the market.",
    sentiment: {
      redditScore: 92,
      redditSummary: "Redditors on r/gaming and r/headphones rave about the 120-hour battery and the metal headband durability. The mic is highly praised, but many warn that this is not a music-first headphone due to the flat bass tuning.",
      sponsoredHypeScore: 2.5,
      durabilityComplaintRate: 1,
      reviewQualityScore: 94,
      recentComplaints: [
        "NGenuity software on Windows is sometimes buggy",
        "USB dongle is a bit wide and can block adjacent ports on thin laptops"
      ]
    }
  },
  {
    id: "gh-razer-blackshark-v2-x",
    name: "Razer BlackShark V2 X",
    brand: "Razer",
    category: "gaming-headsets",
    priceINR: 2999,
    priceUSD: 49,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["TriForce 50mm Drivers", "HyperClear Cardioid Mic", "Advanced Passive Noise Cancellation", "240g Ultra-Lightweight"],
    batteryLife: "Wired (Infinite)",
    anc: "None (Excellent physical passive noise sealing)",
    driverSize: "Razer TriForce 50mm Custom Drivers",
    bluetoothVersion: "Wired (3.5mm jack)",
    codecs: ["Wired Audio (Analog lossless)"],
    latency: "0ms (Wired connection)",
    micQuality: "Very Good (Flexible cardioid mic with focused voice capture)",
    fastCharging: "No",
    waterResistance: "None",
    warranty: "2 Years Warranty",
    pros: [
      "Incredibly cheap, providing professional-grade audio spatialization for under ₹3000",
      "At 240g, it is exceptionally lightweight and comfortable for long sessions",
      "Very good passive sound isolation from surrounding household noises",
      "Double-year warranty from Razer"
    ],
    cons: [
      "Wired non-detachable cable (if the cable breaks, the headset is ruined)",
      "7.1 surround sound software is only available on Windows 10/11",
      "Plastic slider mechanisms feel a bit thin and flimsy"
    ],
    bestFor: "Budget esports gaming and school/office calls",
    audioQualitySummary: "Bright and directional. Mid-range is clean, letting you spot enemy footsteps easily. Sub-bass is present but not boomy, maintaining competitive clarity.",
    comfortLevel: "Very High. Thick headband padding and breathable memory foam ear cushions make it feel weightless.",
    buildQuality: "Mediocre. Mainly lightweight plastic with thin adjustment wires. Needs to be handled with care.",
    brandTrustScore: 8.0,
    supportScore: 7.2,
    durabilityScore: 7.0,
    finalVerdict: "The undisputed king of budget wired gaming headsets. If you don't mind a wired connection and can handle it gently, the spatial accuracy and mic quality are unmatched at this price.",
    sentiment: {
      redditScore: 87,
      redditSummary: "Widely regarded on Reddit as the go-to budget headset. Users constantly highlight the comfort and zero-latency wired connection, though many point out the thin non-braided wire as a weak point.",
      sponsoredHypeScore: 3.8,
      durabilityComplaintRate: 12,
      reviewQualityScore: 90,
      recentComplaints: [
        "Volume wheel on the ear cup developed static sound when turned after 1 year",
        "Thin wire easily tangles and needs manual untwisting"
      ]
    }
  },

  // Wired Earphones
  {
    id: "we-salnotes-zero",
    name: "7Hz Salnotes Zero",
    brand: "7Hz",
    category: "wired-earphones",
    priceINR: 1999,
    priceUSD: 20,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["10mm Metal Cavity Dynamic Driver", "Detachable 0.78mm 2-Pin Cable", "High-purity Oxygen-Free Copper Cable", "Acoustic Neutral Tuning"],
    batteryLife: "Wired (Infinite)",
    anc: "None",
    driverSize: "10mm custom metal cavity driver",
    bluetoothVersion: "Wired (3.5mm Gold Plated)",
    codecs: ["Wired Analog Lossless"],
    latency: "0ms (Analog)",
    micQuality: "Good (Optional version with in-line microphone)",
    fastCharging: "No",
    waterResistance: "None",
    warranty: "6 Months Seller Warranty",
    pros: [
      "Audiophile-grade neutral tuning that beats TWS earbuds costing ₹15,000+",
      "Detachable, replaceable cable means infinite lifespan if pins are handled properly",
      "Stunning instrument separation and clean, realistic vocal clarity",
      "Very low distortion even at high volumes"
    ],
    cons: [
      "No active noise cancellation or wireless features",
      "Bass is strictly accurate and natural (bass heads will find it too thin)",
      "Angular plastic body shape can be slightly fatiguing for very small ears"
    ],
    bestFor: "Critical music listening, vocal tracks, acoustic music, and high-fidelity video editing",
    audioQualitySummary: "Acoustically spectacular. Tuned to the popular Harman-neutral curve. Highs are airy and crisp, vocals are forward and beautifully resolved, and bass is tight, accurate, and completely fast.",
    comfortLevel: "Good. Over-ear hook wire style fit keeps them stable, though the geometric shell design can feel stiff.",
    buildQuality: "High. Translucent plastic shells with a metal faceplate. Detachable 2-pin cables are sturdy and thick.",
    brandTrustScore: 8.5,
    supportScore: 7.0,
    durabilityScore: 9.0,
    finalVerdict: "An absolute legend in the audiophile community. For ₹2000, it delivers sound resolution that is literally impossible to find in any wireless product. Buy the in-line mic version for calls.",
    sentiment: {
      redditScore: 96,
      redditSummary: "Universally worshipped on r/headphones and r/iem. It is considered a benchmark for what good tuning sounds like under $100. Users love the detachable cable which lets them swap in Bluetooth adapters or premium braided wires.",
      sponsoredHypeScore: 1.2,
      durabilityComplaintRate: 2,
      reviewQualityScore: 98,
      recentComplaints: [
        "In-line mic button feels slightly mushy",
        "Default silicone tips can slide off easily if ears get sweaty"
      ]
    }
  },

  // Bluetooth Speakers
  {
    id: "sp-tribit-stormbox-flow",
    name: "Tribit StormBox Flow",
    brand: "Tribit",
    category: "speakers",
    priceINR: 5999,
    priceUSD: 79,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["25W Pulsating Sound", "30-Hour Battery Life", "IPX7 Waterproofing", "Runstretch Battery Technology"],
    batteryLife: "30 hours at 60% volume",
    anc: "None",
    driverSize: "Custom full-range driver + passive radiators",
    bluetoothVersion: "Bluetooth 5.3",
    codecs: ["SBC", "AAC"],
    latency: "150ms",
    micQuality: "Average (In-built mic for basic speakerphone calls)",
    fastCharging: "Yes (USB-C)",
    waterResistance: "IPX7 fully waterproof (can survive complete immersion)",
    warranty: "1 Year Warranty",
    pros: [
      "Massive 30-hour battery life outlasts almost all rivals in this class",
      "Stunningly loud 25W output with solid, deep bass when 'XBass' is on",
      "Fully IPX7 waterproof, ideal for poolside, showers, and camping",
      "Can be placed flat or stood upright for different sound dispersion"
    ],
    cons: [
      "Slightly heavy (about 650g) compared to smaller pocket speakers",
      "XBass mode consumes battery faster (reduces life to ~18 hours)",
      "High volumes (above 90%) introduce minor mid-range distortion"
    ],
    bestFor: "Outdoor trips, house parties, shower sessions, and travel",
    audioQualitySummary: "Energetic and powerful. Mids are clear and forward, making podcasts and acoustic music sound great. The XBass technology gives a satisfying sub-bass rumble that defies the speaker's compact size.",
    comfortLevel: "N/A (Portable carry strap included)",
    buildQuality: "Excellent. Rugged rubberized plastic bumpers, heavy-gauge metal front grille. Built to take drops and shocks.",
    brandTrustScore: 8.2,
    supportScore: 7.8,
    durabilityScore: 9.2,
    finalVerdict: "The undisputed value champion of portable speakers. Tribit has delivered flagship-tier volume and an incredible 30-hour battery life at half the price of equivalent JBL speakers.",
    sentiment: {
      redditScore: 89,
      redditSummary: "Highly recommended on r/BluetoothSpeakers. Users constantly compare it favorably to the JBL Flip 6, noting that the Tribit has double the battery life and custom EQ profiles that JBL lacks.",
      sponsoredHypeScore: 2.2,
      durabilityComplaintRate: 2,
      reviewQualityScore: 91,
      recentComplaints: [
        "Strap loop is a bit narrow, making it hard to thread thick carabiners",
        "Matte finish shows dust particles easily in outdoor environments"
      ]
    }
  },

  // Chargers
  {
    id: "ch-anker-nano-3",
    name: "Anker 511 Charger (Nano 3, 30W)",
    brand: "Anker",
    category: "chargers",
    priceINR: 1799,
    priceUSD: 23,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["GaN Tech (Gallium Nitride)", "30W Power Delivery", "ActiveShield 2.0 temperature monitoring", "Foldable Prongs"],
    batteryLife: "N/A",
    anc: "None",
    driverSize: "N/A",
    bluetoothVersion: "N/A",
    codecs: [],
    latency: "N/A",
    micQuality: "N/A",
    fastCharging: "PD 3.0 / PPS Fast Charging Support",
    waterResistance: "None",
    warranty: "24 Months Warranty (Industry Leading)",
    pros: [
      "Impossibly small (70% smaller than standard 30W chargers)",
      "Supports PPS (Programmable Power Supply) for Samsung Super Fast Charging",
      "Foldable prongs prevent scratching other gear in your backpack",
      "ActiveShield 2.0 monitors temperature 3 million times a day to prevent overheating"
    ],
    cons: [
      "Only a single USB-C port (cannot charge multiple devices at once)",
      "Does not come with a charging cable in the box",
      "Priced slightly premium compared to generic local brands"
    ],
    bestFor: "Minimalist travel, iPhone 15/16 fast charging, and iPad/MacBook Air charging",
    audioQualitySummary: "N/A",
    comfortLevel: "N/A",
    buildQuality: "Elite. Premium fire-resistant polycarbonate with robust, snappy folding prongs.",
    brandTrustScore: 9.5,
    supportScore: 9.0,
    durabilityScore: 9.8,
    finalVerdict: "The ultimate compact travel charger. Utilizing GaN technology, it delivers 30W of safe, cool power in a body the size of an old Apple 5W block. Covered by Anker's legendary 2-year warranty.",
    sentiment: {
      redditScore: 94,
      redditSummary: "Highly recommended in r/usbchardware. Redditors love the foldable prongs and temperature control, calling it the most reliable charger for travel.",
      sponsoredHypeScore: 1.5,
      durabilityComplaintRate: 0.5,
      reviewQualityScore: 96,
      recentComplaints: [
        "None major. Some users note the prongs can be slightly stiff to unfold at first"
      ]
    }
  },

  // Power Banks
  {
    id: "pb-duracell-powerbank-10k",
    name: "Duracell Power Bank 10000mAh",
    brand: "Duracell",
    category: "power-banks",
    priceINR: 1999,
    priceUSD: 25,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["22.5W Fast Charging", "Dual Output (USB-C & USB-A)", "10-way safety protection", "Iconic black & copper design"],
    batteryLife: "Charges an iPhone 15 up to 2.2 times",
    anc: "None",
    driverSize: "N/A",
    bluetoothVersion: "N/A",
    codecs: [],
    latency: "N/A",
    micQuality: "N/A",
    fastCharging: "22.5W Power Delivery & Quick Charge 3.0",
    waterResistance: "None",
    warranty: "3 Years Warranty (Longest in Segment)",
    pros: [
      "Stunning 3-year replacement warranty provides ultimate peace of mind",
      "Very fast 22.5W bidirectional charging (fast charges your phone AND fast recharges itself)",
      "Compact size with premium rubberized grip top",
      "Exceptional battery cell grade maintains charge for months"
    ],
    cons: [
      "Slightly thicker than ultra-slim lipo power banks",
      "No digital percentage screen (uses 4 LED dots instead)",
      "Cannot charge low-current items (like TWS buds) without auto-shutoff trigger"
    ],
    bestFor: "Day trips, emergency phone backup, and peace-of-mind warranty seekers",
    audioQualitySummary: "N/A",
    comfortLevel: "N/A",
    buildQuality: "Excellent. Tough, impact-resistant outer shell with Duracell's iconic color branding.",
    brandTrustScore: 9.3,
    supportScore: 8.8,
    durabilityScore: 9.4,
    finalVerdict: "A rock-solid power bank backed by the best warranty in the industry. For ₹1999, the 22.5W output and 3-year backup make it a significantly more reliable choice than cheaper competitors.",
    sentiment: {
      redditScore: 88,
      redditSummary: "Highly regarded for its long-term battery cell retention. Many users share stories of getting quick, hassle-free replacements under the 3-year warranty window.",
      sponsoredHypeScore: 2.0,
      durabilityComplaintRate: 1.5,
      reviewQualityScore: 90,
      recentComplaints: [
        "Included USB-C cable is very short (only 15cm)",
        "LED indicators are a bit too bright when charging next to the bed at night"
      ]
    }
  },

  // Laptop Accessories
  {
    id: "la-portronics-my-buddy-k2",
    name: "Portronics My Buddy K2 Laptop Stand",
    brand: "Portronics",
    category: "laptop",
    priceINR: 1199,
    priceUSD: 16,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["Aluminum Alloy Construction", "7-level Height Adjustment", "Heat Dissipation Cutouts", "Foldable & Portable"],
    batteryLife: "N/A",
    anc: "None",
    driverSize: "N/A",
    bluetoothVersion: "N/A",
    codecs: [],
    latency: "N/A",
    micQuality: "N/A",
    fastCharging: "N/A",
    waterResistance: "N/A",
    warranty: "1 Year Warranty",
    pros: [
      "Solid aluminum body feels highly premium and supports up to 17-inch laptops",
      "Non-slip silicone pads prevent scratches on both your desk and your device",
      "Folds completely flat and fits inside a neat carry pouch",
      "Increases air ventilation under the laptop, preventing thermal throttling"
    ],
    cons: [
      "The adjustment pins are manual, needing both hands to realign heights",
      "Adds about 280g of weight to your travel backpack",
      "Heavy typing directly on the laptop keyboard while on the stand causes slight wobble"
    ],
    bestFor: "Improving desk posture, reducing neck fatigue, and heavy laptop cooling",
    audioQualitySummary: "N/A",
    comfortLevel: "Very High ergonomics improvement. Relieves neck stiffness by lifting screen to eye level.",
    buildQuality: "High. Sandblasted aluminum alloy feels sturdy and premium.",
    brandTrustScore: 8.0,
    supportScore: 7.5,
    durabilityScore: 9.3,
    finalVerdict: "An absolute essential for anyone working long hours on a laptop. It is cheap, extremely sturdy, and instantly fixes poor posture while keeping your laptop cool.",
    sentiment: {
      redditScore: 86,
      redditSummary: "Highly recommended on r/workspaces as a simple, durable posture fixer. Users emphasize that buying an aluminum stand is a one-time purchase that lasts a lifetime.",
      sponsoredHypeScore: 1.8,
      durabilityComplaintRate: 1,
      reviewQualityScore: 87,
      recentComplaints: [
        "Silicone pads can peel off after 2 years of heavy daily friction (fixed with glue)",
        "The carry pouch is made of cheap felt cloth"
      ]
    }
  },

  // Keyboards
  {
    id: "kb-keychron-k2-v2",
    name: "Keychron K2 (Version 2) Mechanical Keyboard",
    brand: "Keychron",
    category: "keyboards",
    priceINR: 7499,
    priceUSD: 79,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["75% Compact Layout", "Gateron G-Pro Mechanical Switches", "Mac & Windows Dual Compatibility", "Dual Mode: Wired & Bluetooth"],
    batteryLife: "Up to 240 hours (Backlight off)",
    anc: "None (Physical dampeners inside layout)",
    driverSize: "N/A",
    bluetoothVersion: "Bluetooth 5.1",
    codecs: [],
    latency: "30ms (Wired mode), 80ms (Bluetooth mode)",
    micQuality: "N/A",
    fastCharging: "No",
    waterResistance: "None",
    warranty: "1 Year Warranty",
    pros: [
      "Satisfying tactile typing feedback with choice of Blue, Brown, or Red Gateron switches",
      "Seamless layout swapping between macOS and Windows (custom keycaps included)",
      "Massive 4000mAh battery lasts weeks with backlights turned off",
      "Can connect up to 3 devices simultaneously via Bluetooth"
    ],
    cons: [
      "Keyboard has a high profile; a wrist rest is highly recommended to prevent strain",
      "Stock ABS keycaps develop a greasy shine after months of typing",
      "Bluetooth connection can sometimes drop briefly in rooms with heavy Wi-Fi interference"
    ],
    bestFor: "Developers, writers, office workers, and clean desk setups",
    audioQualitySummary: "Acoustically satisfying typing sound. Brown switches offer a soft tactile bump with a muted clack, while Red switches are smooth and quiet. Blue switches are clicky and loud.",
    comfortLevel: "Medium. High frame height requires a slight wrist extension, which is solved by using a wooden or foam wrist rest.",
    buildQuality: "Superb. Heavy-duty plastic bottom with optional solid aluminum bezel frame. Very stiff with zero flex.",
    brandTrustScore: 8.8,
    supportScore: 7.8,
    durabilityScore: 9.2,
    finalVerdict: "The absolute gateway drug to mechanical keyboards. The Keychron K2 is a beautifully built, highly versatile mechanical deck that works flawlessly on Mac and Windows alike.",
    sentiment: {
      redditScore: 90,
      redditSummary: "Extremely popular on r/MechanicalKeyboards. It is considered the gold standard entry-level pre-built keyboard. Users heavily suggest buying a wrist rest and swapping keycaps to PBT down the road.",
      sponsoredHypeScore: 3.2,
      durabilityComplaintRate: 3,
      reviewQualityScore: 92,
      recentComplaints: [
        "Charging port on the side is a bit awkward for routing straight cables",
        "Bluetooth switching has a 2-second delay"
      ]
    }
  },

  // Mouse Devices
  {
    id: "ms-logitech-mx-master-3s",
    name: "Logitech MX Master 3S Wireless Mouse",
    brand: "Logitech",
    category: "mouse",
    priceINR: 9499,
    priceUSD: 99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    keyFeatures: ["MagSpeed Electromagnetic Scroll Wheel", "8K DPI Any-Surface Tracking", "Quiet Click Switches", "Logi Options+ App integration"],
    batteryLife: "Up to 70 days on a full charge",
    anc: "None",
    driverSize: "N/A",
    bluetoothVersion: "Bluetooth Low Energy + Logi Bolt USB Receiver",
    codecs: [],
    latency: "15ms (Bolt Receiver), 25ms (Bluetooth)",
    micQuality: "N/A",
    fastCharging: "Yes (1 min charge = 3 hours use)",
    waterResistance: "None",
    warranty: "1 Year Warranty",
    pros: [
      "MagSpeed wheel scrolls 1000 lines in a single second and switches auto-scrolling modes",
      "Remarkably quiet click switches are soft and make zero noise in libraries",
      "Ergonomic thumb rest with dedicated horizontal scroll wheel and gesture button",
      "Tracks perfectly on any surface, including high-gloss glass dining tables"
    ],
    cons: [
      "Strictly right-handed design (completely unusable for left-handed people)",
      "Too heavy (141g) for fast competitive gaming",
      "The soft rubberized coating can degrade and become sticky after 3-4 years in humid climates"
    ],
    bestFor: "Software engineers, video editors, financial analysts, and multi-device productivity setups",
    audioQualitySummary: "N/A",
    comfortLevel: "Elite. The most comfortable productivity mouse ever created. Sculpts perfectly to natural palm posture.",
    buildQuality: "Elite. Sturdy frame with high-quality metal scroll wheels and textured premium rubber grips.",
    brandTrustScore: 9.4,
    supportScore: 8.5,
    durabilityScore: 8.9,
    finalVerdict: "The undisputed king of productivity. The MagSpeed wheel, quiet clicks, and incredible ergonomics make the MX Master 3S a productivity cheat code. An expensive but worthwhile investment for your career.",
    sentiment: {
      redditScore: 94,
      redditSummary: "Highly recommended in r/macsys and r/workspaces. Users love the horizontal wheel for scrubbing Excel sheets and video timelines. A minor warning is given about the rubber shell wearing out in hot/humid environments.",
      sponsoredHypeScore: 2.8,
      durabilityComplaintRate: 4,
      reviewQualityScore: 95,
      recentComplaints: [
        "Logi Options+ software occupies a lot of background RAM on Mac",
        "Charging port placement is great, but mouse cannot be used wired if dongle is lost (only Bluetooth works)"
      ]
    }
  }
];
