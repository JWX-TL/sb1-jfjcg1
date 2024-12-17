import { Configuration, OpenAIApi } from 'openai';
import { UserProfile } from '../models/user.model';
import { Product } from './product-database.service';

export class AIService {
  private openai: OpenAIApi;
  private readonly SYSTEM_PROMPT = `You are an expert AI beauty advisor with deep knowledge of skincare, 
    makeup, and beauty products. Provide personalized recommendations based on user data and preferences.`;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.openai = new OpenAIApi(configuration);
  }

  async getSkinAdvice(skinAnalysis: any, userProfile: UserProfile): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          { 
            role: "user", 
            content: `Analyze this skin data and provide recommendations:
              Skin Analysis: ${JSON.stringify(skinAnalysis)}
              User Profile: ${JSON.stringify(userProfile)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.data.choices[0].message?.content || "Unable to generate advice";
    } catch (error) {
      console.error('Error getting AI advice:', error);
      throw error;
    }
  }

  async generatePersonalizedBox(userProfile: UserProfile, availableProducts: Product[]): Promise<Product[]> {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          {
            role: "user",
            content: `Generate a personalized beauty box for this user:
              User Profile: ${JSON.stringify(userProfile)}
              Available Products: ${JSON.stringify(availableProducts)}
              
              Consider:
              1. User's skin type and concerns
              2. Previous products they've received
              3. Brand preferences
              4. Product compatibility
              
              Select 5-7 products that would work well together.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      // Parse the AI response and match with available products
      const recommendedProducts = this.parseProductRecommendations(
        response.data.choices[0].message?.content || "",
        availableProducts
      );

      return recommendedProducts;
    } catch (error) {
      console.error('Error generating personalized box:', error);
      throw error;
    }
  }

  async getMakeupTutorial(userProfile: UserProfile, products: Product[]): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          {
            role: "user",
            content: `Create a personalized makeup tutorial for this user:
              User Profile: ${JSON.stringify(userProfile)}
              Available Products: ${JSON.stringify(products)}
              
              Include step-by-step instructions and product application tips.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.data.choices[0].message?.content || "Unable to generate tutorial";
    } catch (error) {
      console.error('Error generating makeup tutorial:', error);
      throw error;
    }
  }

  private parseProductRecommendations(aiResponse: string, availableProducts: Product[]): Product[] {
    // Implementation to parse AI response and match with available products
    // This is a placeholder for the actual parsing logic
    return [];
  }
}