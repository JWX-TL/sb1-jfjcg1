import { Observable } from '@nativescript/core';
import { AIService } from '../../services/ai.service';

interface Tutorial {
    id: string;
    title: string;
    videoUrl: string;
    steps: { step: string }[];
    products: {
        name: string;
        description: string;
        imageUrl: string;
    }[];
}

export class TutorialViewModel extends Observable {
    private aiService: AIService;
    private currentTutorial: Tutorial;

    constructor() {
        super();
        this.aiService = new AIService();
        this.loadTutorial();
    }

    private loadTutorial() {
        // Mock tutorial data - this would normally come from a backend service
        this.currentTutorial = {
            id: '1',
            title: 'Natural Everyday Makeup Look',
            videoUrl: 'https://example.com/tutorial-video',
            steps: [
                { step: '1. Start with a clean, moisturized face' },
                { step: '2. Apply primer to create a smooth base' },
                { step: '3. Use foundation matching your skin tone' }
            ],
            products: [
                {
                    name: 'Gentle Cleanser',
                    description: 'A mild cleanser for all skin types',
                    imageUrl: 'https://example.com/cleanser.jpg'
                }
            ]
        };
        this.set('currentTutorial', this.currentTutorial);
    }

    async askAIAssistant() {
        try {
            const response = await this.aiService.getSkinAdvice(
                { tutorial: this.currentTutorial },
                { /* user profile data */ }
            );
            
            // Show AI response in a dialog
            const dialogs = require('@nativescript/core').Dialogs;
            await dialogs.alert({
                title: 'AI Assistant',
                message: response,
                okButtonText: 'OK'
            });
        } catch (error) {
            console.error('Error getting AI advice:', error);
        }
    }
}