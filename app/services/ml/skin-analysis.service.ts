import { ImageSource } from '@nativescript/core';
import { FaceDetectionService } from './face-detection.service';
import { SkinFeatureExtractor } from './skin-feature-extractor.service';
import { SkinConditionClassifier } from './skin-condition-classifier.service';

export interface SkinAnalysisResult {
  skinType: string;
  concerns: string[];
  hydrationLevel: number;
  sensitivityLevel: string;
  recommendations: string[];
  confidence: number;
}

export class SkinAnalysisService {
  private faceDetector: FaceDetectionService;
  private featureExtractor: SkinFeatureExtractor;
  private classifier: SkinConditionClassifier;

  constructor() {
    this.faceDetector = new FaceDetectionService();
    this.featureExtractor = new SkinFeatureExtractor();
    this.classifier = new SkinConditionClassifier();
  }

  async initialize(): Promise<void> {
    await Promise.all([
      this.faceDetector.initialize(),
      this.featureExtractor.initialize(),
      this.classifier.initialize()
    ]);
  }

  async analyzeSkin(image: ImageSource): Promise<SkinAnalysisResult> {
    try {
      // Detect face in the image
      const faceDetection = await this.faceDetector.detectFace(image);
      if (!faceDetection) {
        throw new Error('No face detected in the image');
      }

      // Extract skin features
      const features = await this.featureExtractor.extractFeatures(image, faceDetection.bounds);

      // Classify skin conditions
      const classification = await this.classifier.classify(features);

      return {
        skinType: classification.skinType,
        concerns: classification.concerns,
        hydrationLevel: classification.hydrationLevel,
        sensitivityLevel: classification.sensitivityLevel,
        recommendations: classification.recommendations,
        confidence: classification.confidence
      };
    } catch (error) {
      console.error('Skin analysis failed:', error);
      throw new Error('Skin analysis failed');
    }
  }
}