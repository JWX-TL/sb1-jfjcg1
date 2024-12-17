export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  skinType: string;
  hairType: string;
  preferences: {
    brands: string[];
    products: string[];
    concerns: string[];
  };
  subscriptionType?: string;
}

export interface SkinAnalysis {
  id: string;
  userId: string;
  date: Date;
  results: {
    skinType: string;
    concerns: string[];
    recommendations: string[];
  };
  imageUrl: string;
}