import { Observable } from '@nativescript/core';
import { SubscriptionService, SubscriptionPlan } from '../../services/subscription.service';

export class SubscriptionViewModel extends Observable {
    private subscriptionService: SubscriptionService;
    private subscriptionPlans: SubscriptionPlan[];

    constructor() {
        super();
        this.subscriptionService = new SubscriptionService();
        this.loadSubscriptionPlans();
    }

    private loadSubscriptionPlans() {
        this.subscriptionPlans = this.subscriptionService.getAvailablePlans();
        this.set('subscriptionPlans', this.subscriptionPlans);
    }

    async subscribeToPlan(args: any) {
        const planId = args.object.data;
        try {
            const success = await this.subscriptionService.subscribeToPlan('current-user-id', planId);
            if (success) {
                // Navigate to subscription confirmation page
                const frame = require('@nativescript/core').Frame;
                frame.topmost().navigate({
                    moduleName: 'views/subscription/confirmation-page',
                    context: { planId }
                });
            }
        } catch (error) {
            console.error('Error subscribing to plan:', error);
        }
    }
}