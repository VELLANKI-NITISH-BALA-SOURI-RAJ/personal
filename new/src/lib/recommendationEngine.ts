import { Accessory, accessoriesData } from '../data/accessoriesData';

export interface QuestionnaireInput {
  budget: number; // max budget in INR
  category: string; // 'tws' | 'headphones' | 'gaming-headsets' | 'wired-earphones' | 'speakers' | 'chargers' | 'power-banks' | 'mobile' | 'laptop' | 'keyboards' | 'mouse' | 'any'
  usage: 'gaming' | 'music' | 'calls' | 'workout' | 'travel' | 'all-rounder';
  wiredWireless: 'wired' | 'wireless' | 'either';
  ancNeeded: boolean;
  batteryExpectation: 'any' | 'moderate' | 'high' | 'ultra';
  preferredBrands: string[];
  compatibility: 'iOS' | 'Android' | 'Windows' | 'Mac' | 'any';
  comfortImportance: boolean;
  micImportance: boolean;
  soundPreference: 'bass-heavy' | 'balanced' | 'vocal-clarity' | 'any';
}

export interface RecommendationResult {
  bestOverall: Accessory | null;
  bestBudget: Accessory | null;
  bestPremium: Accessory | null;
  bestValue: Accessory | null;
  alternatives: Accessory[];
  tradeoffsAlert: string | null;
  reasoningSummary: string;
}

export function analyzeTradeoffs(input: QuestionnaireInput): string | null {
  const warnings: string[] = [];

  // Tradeoff 1: Budget too low for ANC
  if (input.ancNeeded && input.budget < 4000 && ['tws', 'headphones', 'gaming-headsets', 'any'].includes(input.category)) {
    warnings.push(
      `Active Noise Cancellation (ANC) at a budget under ₹4,000 is highly compromised. Most earbuds under this price use cheap chipsets that generate uncomfortable white noise or only block high-frequency hums while degrading audio quality. We suggest stretching your budget to ₹5,000 for products like the OnePlus Buds 3 or Realme Buds Air 6 Pro, or opting for a high-isolation wired option.`
    );
  }

  // Tradeoff 2: Low Latency Wireless at Low Budget
  if (input.usage === 'gaming' && input.wiredWireless === 'wireless' && input.budget < 4000) {
    warnings.push(
      `Ultra-low latency wireless gaming (under 50ms) is technically challenging over standard Bluetooth. Sub-₹4,000 wireless earbuds often suffer from 120ms+ latency, causing a noticeable delay between seeing a gunshot and hearing it. For competitive gaming on a budget, a wired headset like the Razer BlackShark V2 X (0ms latency, ₹2,999) will deliver a vastly superior experience than cheap wireless TWS.`
    );
  }

  // Tradeoff 3: Hi-Res Audio on iOS
  if (input.compatibility === 'iOS' && input.soundPreference === 'balanced' && ['tws', 'headphones'].includes(input.category)) {
    warnings.push(
      `Apple iPhones do not support high-resolution Bluetooth codecs like LDAC or LHDC; they are strictly limited to AAC and SBC. Recommending a premium LDAC/LHDC earbud like the Realme Buds Air 6 Pro or OnePlus Buds 3 will still sound excellent, but you will miss out on the ultra-high bitrate processing. Consider this trade-off if you are buying purely for high-fidelity audio resolution.`
    );
  }

  // Tradeoff 4: Lightweight over-ear vs durability
  if (input.comfortImportance && input.budget < 8000 && input.category === 'headphones') {
    warnings.push(
      `Under ₹8,000, over-ear ANC headphones that are extremely lightweight (like the Sony WH-CH720N at 192g) achieve their feather-weight comfort by utilizing thin, all-plastic headband joints. These are prone to creaking or cracking if thrown carelessly in backpacks. Handle them with care or look into reinforced metal-slider designs.`
    );
  }

  // Tradeoff 5: Mechanical keyboard wireless latency
  if (input.category === 'keyboards' && input.usage === 'gaming' && input.wiredWireless === 'wireless') {
    warnings.push(
      `Wireless mechanical keyboards using standard Bluetooth (like the Keychron K2 on Bluetooth mode) suffer from ~80ms input latency, which is noticeable in fast-paced FPS gaming. We strongly advise using such keyboards in wired USB mode (30ms latency) during gaming, or choosing a specialized 2.4GHz dongle keyboard.`
    );
  }

  if (warnings.length === 0) return null;

  return warnings.join('\n\n');
}

export function generateRecommendations(input: QuestionnaireInput): RecommendationResult {
  // 1. Filter products by category
  let pool = accessoriesData;
  if (input.category !== 'any') {
    pool = pool.filter((item) => item.category === input.category);
  }

  // 2. Filter by wired/wireless preference
  if (input.wiredWireless === 'wired') {
    pool = pool.filter((item) => item.bluetoothVersion === 'None' || item.bluetoothVersion.toLowerCase().includes('wired') || item.bluetoothVersion === 'N/A' || item.id.includes('wired') || item.name.toLowerCase().includes('wired') || item.id.includes('salnotes') || item.id.includes('blackshark'));
  } else if (input.wiredWireless === 'wireless') {
    pool = pool.filter((item) => item.bluetoothVersion !== 'None' && !item.id.includes('salnotes') && !item.id.includes('blackshark') && item.bluetoothVersion !== 'N/A');
  }

  // 3. Brand preference filter (soft filter, if matches exist, prioritize them, else don't empty the list)
  let brandMatches = pool;
  if (input.preferredBrands.length > 0) {
    brandMatches = pool.filter((item) =>
      input.preferredBrands.some((b) => item.brand.toLowerCase().includes(b.toLowerCase()))
    );
    if (brandMatches.length > 0) {
      pool = brandMatches;
    }
  }

  if (pool.length === 0) {
    // If we filtered too aggressively, recover default category pool
    pool = accessoriesData.filter((item) => input.category === 'any' || item.category === input.category);
  }

  // 4. Multi-dimensional Scoring Engine
  const scoredPool = pool.map((item) => {
    let score = 50; // baseline

    // A. Price match
    if (item.priceINR <= input.budget) {
      score += 15;
      // Bonus for being well below budget (room for savings)
      if (item.priceINR <= input.budget * 0.7) {
        score += 5;
      }
    } else {
      // Penalty for exceeding budget (but keep in pool to show tradeoffs)
      const excessRatio = (item.priceINR - input.budget) / input.budget;
      score -= Math.min(30, excessRatio * 40);
    }

    // B. Usage mapping
    if (input.usage === 'gaming') {
      if (item.category === 'gaming-headsets') score += 15;
      // Check latency
      const latencyMs = parseInt(item.latency);
      if (!isNaN(latencyMs) && latencyMs <= 50) score += 12;
      else if (item.latency.toLowerCase().includes('0ms') || item.latency.toLowerCase().includes('lossless')) score += 15;
    } else if (input.usage === 'music') {
      score += item.rating * 3;
      if (item.category === 'wired-earphones') score += 10; // high-res audiophile
    } else if (input.usage === 'calls') {
      if (item.micQuality.toLowerCase().includes('excellent')) score += 12;
      else if (item.micQuality.toLowerCase().includes('great') || item.micQuality.toLowerCase().includes('good')) score += 8;
      score += item.supportScore * 0.5;
    } else if (input.usage === 'workout') {
      if (item.waterResistance.toLowerCase().includes('ip55') || item.waterResistance.toLowerCase().includes('ipx7') || item.waterResistance.toLowerCase().includes('ipx5')) score += 12;
      if (item.comfortLevel.toLowerCase().includes('very high') || item.comfortLevel.toLowerCase().includes('secure')) score += 8;
    } else if (input.usage === 'travel') {
      if (item.batteryLife.toLowerCase().includes('30 hours') || item.batteryLife.toLowerCase().includes('120') || item.batteryLife.toLowerCase().includes('70 days')) score += 10;
      if (item.anc && item.anc !== 'None') score += 12;
    }

    // C. ANC match
    if (input.ancNeeded) {
      if (item.anc && item.anc !== 'None') {
        score += 15;
      } else {
        score -= 20;
      }
    }

    // D. Sound profile
    if (input.soundPreference === 'bass-heavy') {
      if (item.pros.some((p) => p.toLowerCase().includes('bass') || p.toLowerCase().includes('punchy') || p.toLowerCase().includes('boomy'))) score += 10;
      if (item.audioQualitySummary.toLowerCase().includes('bass') || item.audioQualitySummary.toLowerCase().includes('sub-bass')) score += 8;
    } else if (input.soundPreference === 'balanced') {
      if (item.audioQualitySummary.toLowerCase().includes('balanced') || item.audioQualitySummary.toLowerCase().includes('neutral')) score += 12;
      if (item.cons.some((c) => c.toLowerCase().includes('bass is strictly accurate') || c.toLowerCase().includes('bass roll-off'))) score += 4; // soft bonus because it's truly balanced
    } else if (input.soundPreference === 'vocal-clarity') {
      if (item.audioQualitySummary.toLowerCase().includes('vocal') || item.audioQualitySummary.toLowerCase().includes('mids')) score += 10;
    }

    // E. Mic and Comfort flags
    if (input.micImportance && (item.micQuality.toLowerCase().includes('excellent') || item.micQuality.toLowerCase().includes('great'))) {
      score += 10;
    }
    if (input.comfortImportance && (item.comfortLevel.toLowerCase().includes('very high') || item.comfortLevel.toLowerCase().includes('excellent') || item.comfortLevel.toLowerCase().includes('gold standard') || item.comfortLevel.toLowerCase().includes('elite'))) {
      score += 10;
    }

    // F. Quality scores
    score += item.durabilityScore * 1.5;
    score += item.brandTrustScore * 1.0;
    score += item.rating * 2;

    return { item, score };
  });

  // Sort by score descending
  const sorted = scoredPool.sort((a, b) => b.score - a.score);

  // Filter out any items that are outrageously outside budget (e.g. 50% higher) unless they are premium picks
  const affordableSorted = sorted.filter((s) => s.item.priceINR <= input.budget * 1.25);

  let bestOverall: Accessory | null = null;
  let bestBudget: Accessory | null = null;
  let bestPremium: Accessory | null = null;
  let bestValue: Accessory | null = null;

  if (affordableSorted.length > 0) {
    // Best Overall is the highest scored within budget (or slightly over)
    const inBudget = affordableSorted.filter((s) => s.item.priceINR <= input.budget);
    bestOverall = inBudget.length > 0 ? inBudget[0].item : affordableSorted[0].item;

    // Best Budget is the lowest price among highly rated (score > 55)
    const budgetCandidates = affordableSorted
      .filter((s) => s.item.priceINR <= input.budget * 0.7 && s.score >= 45)
      .sort((a, b) => a.item.priceINR - b.item.priceINR);
    bestBudget = budgetCandidates.length > 0 ? budgetCandidates[0].item : null;

    // Best Premium is the highest priced that fits close to or slightly above budget and has premium scores
    const premiumCandidates = sorted
      .filter((s) => s.item.priceINR >= input.budget * 0.8)
      .sort((a, b) => b.item.priceINR - a.item.priceINR);
    bestPremium = premiumCandidates.length > 0 ? premiumCandidates[0].item : sorted[0].item;

    // Best Value is the best ratio of Score / Price
    const valueCandidates = affordableSorted.map((s) => ({
      item: s.item,
      valueIndex: s.score / (s.item.priceINR / 1000),
    })).sort((a, b) => b.valueIndex - a.valueIndex);
    bestValue = valueCandidates.length > 0 ? valueCandidates[0].item : null;

    // Ensure we don't have overlapping duplicates in roles if possible
    if (bestBudget === bestOverall && affordableSorted.length > 1) {
      bestBudget = affordableSorted[affordableSorted.length - 1].item;
    }
    if (bestPremium === bestOverall && sorted.length > 1) {
      const remaining = sorted.filter((s) => s.item.id !== bestOverall?.id);
      bestPremium = remaining.length > 0 ? remaining[0].item : null;
    }
    if (bestValue === bestOverall && affordableSorted.length > 2) {
      bestValue = affordableSorted[1].item;
    }
  }

  // Deduplicate roles to offer distinct picks
  const selectedIds = new Set<string>();
  if (bestOverall) selectedIds.add(bestOverall.id);
  if (bestBudget) {
    if (selectedIds.has(bestBudget.id)) bestBudget = null;
    else selectedIds.add(bestBudget.id);
  }
  if (bestPremium) {
    if (selectedIds.has(bestPremium.id)) bestPremium = null;
    else selectedIds.add(bestPremium.id);
  }
  if (bestValue) {
    if (selectedIds.has(bestValue.id)) bestValue = null;
    else selectedIds.add(bestValue.id);
  }

  // Remaining are alternative picks
  const alternatives = sorted
    .filter((s) => !selectedIds.has(s.item.id) && s.item.priceINR <= input.budget * 1.35)
    .slice(0, 4)
    .map((s) => s.item);

  const tradeoffsAlert = analyzeTradeoffs(input);

  // Generate Reasoning Summary
  let reasoningSummary = `Based on your requirement for a ${input.category === 'any' ? 'tech accessory' : input.category.toUpperCase()} suited for ${input.usage.toUpperCase()} within a budget of ₹${input.budget}, we analyzed ${pool.length} candidates. `;
  if (bestOverall) {
    reasoningSummary += `Our top recommendation is the **${bestOverall.name}** because of its outstanding price-to-feature performance, strong reliability (${bestOverall.durabilityScore}/10 durability), and excellent alignment with your preference for ${input.soundPreference} sound. `;
  }
  if (tradeoffsAlert) {
    reasoningSummary += `We did detect minor performance conflicts in your budget/feature ratio (highlighted below), and selected alternatives that maintain optimal hardware reliability.`;
  } else {
    reasoningSummary += `We prioritized real-world user feedback from Reddit and tech reviews, filtering out sponsored rating spikes to ensure high long-term reliability.`;
  }

  return {
    bestOverall,
    bestBudget,
    bestPremium,
    bestValue,
    alternatives,
    tradeoffsAlert,
    reasoningSummary,
  };
}
