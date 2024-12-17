import { ImageSource } from '@nativescript/core';
import { MLKitFaceDetection } from '@nativescript/mlkit/facedetection';

export interface FaceDetectionResult {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks: {
    leftEye?: { x: number; y: number };
    rightEye?: { x: number; y: number };
    nose?: { x: number; y: number };
    mouth?: { x: number; y: number };
  };
  confidence: number;
}

export class FaceDetectionService {
  private detector: MLKitFaceDetection;

  constructor() {
    this.detector = new MLKitFaceDetection();
  }

  async initialize(): Promise<void> {
    try {
      await this.detector.initialize();
    } catch (error) {
      console.error('Failed to initialize face detector:', error);
      throw new Error('Face detector initialization failed');
    }
  }

  async detectFace(image: ImageSource): Promise<FaceDetectionResult | null> {
    try {
      const faces = await this.detector.detectFaces(image);
      if (faces && faces.length > 0) {
        return this.processFaceDetection(faces[0]);
      }
      return null;
    } catch (error) {
      console.error('Face detection failed:', error);
      throw new Error('Face detection failed');
    }
  }

  private processFaceDetection(rawFace: any): FaceDetectionResult {
    return {
      bounds: {
        x: rawFace.bounds.origin.x,
        y: rawFace.bounds.origin.y,
        width: rawFace.bounds.size.width,
        height: rawFace.bounds.size.height
      },
      landmarks: {
        leftEye: rawFace.landmarks?.leftEye,
        rightEye: rawFace.landmarks?.rightEye,
        nose: rawFace.landmarks?.nose,
        mouth: rawFace.landmarks?.mouth
      },
      confidence: rawFace.confidence || 0
    };
  }
}