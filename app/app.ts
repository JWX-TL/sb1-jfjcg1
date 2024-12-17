import { Application } from '@nativescript/core';
import { initializeAI } from './services/ai.service';
import { initializeFirebase } from '@nativescript/firebase';
import { firebaseConfig } from './config/firebase.config';

// Initialize Firebase for backend services
initializeFirebase(firebaseConfig).then(() => {
  console.log('Firebase initialized successfully');
}).catch(error => {
  console.error('Error initializing Firebase:', error);
});

// Initialize ML models and AI services
initializeAI().catch(error => {
  console.error('Error initializing AI services:', error);
});

Application.run({ moduleName: 'app-root' });