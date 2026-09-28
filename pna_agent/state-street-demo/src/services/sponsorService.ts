import sponsorsData from '../mock-data/sponsors.json';

export interface Sponsor {
  id: string;
  name: string;
}

export const getSponsors = async (serverName: string, clientName: string): Promise<Sponsor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, we would filter based on serverName and clientName
      // For this demo, we just return the mock data if both are provided
      if (serverName && clientName) {
        resolve(sponsorsData as Sponsor[]);
      } else {
        resolve([]);
      }
    }, 500);
  });
};
