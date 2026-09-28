import fundsData from '../mock-data/funds.json';
import fundDetailsData from '../mock-data/fundDetails.json';

export interface Fund {
  fundType: string;
  frequency: string;
  fundId: string;
  fundName: string;
  currency: string;
  status: string;
  lock: string;
}

export interface FundDetails {
  summary: {
    fundId: string;
    fundName: string;
    currency: string;
    status: string;
    lock: string;
  };
  overview: any;
  performance: any[];
  holdings: any[];
  audit: any[];
}

export const getFunds = async (_sponsorId: string): Promise<Fund[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fundsData as Fund[]);
    }, 500);
  });
};

export const getFundDetails = async (fundId: string): Promise<FundDetails | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const details = (fundDetailsData as Record<string, any>)[fundId];
      // Fallback for demo if id not strictly matched
      if (details) {
        resolve(details);
      } else if (fundId && (fundDetailsData as Record<string, any>)["113351cyy50"]) {
        const dummy = { ...(fundDetailsData as Record<string, any>)["113351cyy50"] };
        dummy.summary.fundId = fundId;
        dummy.summary.fundName = fundId + "Long";
        resolve(dummy);
      } else {
        resolve(null);
      }
    }, 500);
  });
};
