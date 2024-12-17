import { UserProfile } from '../models/user.model';
import { Product } from './product-database.service';
import { AIService } from './ai.service';
import { ProductDatabaseService } from './product-database.service';

export interface SubscriptionBox {
  id: string;
  userId: string;
  products: Product[];
  shippingDate: Date;
  status: 'pending' | 'confirmed' | 'shipped';
}

export class SubscriptionBoxService {
  private aiService: AIService;
  private productDatabase: ProductDatabaseService;

  constructor() {
    this.aiService = new AIService();
    this.productDatabase = new ProductDatabaseService();
  }

  async generateMonthlyBox(userProfile: UserProfile): Promise<SubscriptionBox> {
    try {
      // Get available products
      const availableProducts = await this.productDatabase.fetchProducts();

      // Generate personalized product selection using AI
      const selectedProducts = await this.aiService.generatePersonalizedBox(
        userProfile,
        availableProducts
      );

      // Create subscription box
      const box: SubscriptionBox = {
        id: Date.now().toString(),
        userId: userProfile.id,
        products: selectedProducts,
        shippingDate: this.calculateNextShippingDate(),
        status: 'pending'
      };

      return box;
    } catch (error) {
      console.error('Error generating monthly box:', error);
      throw error;
    }
  }

  private calculateNextShippingDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }
}