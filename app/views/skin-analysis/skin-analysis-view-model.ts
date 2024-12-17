import { Observable } from '@nativescript/core';
import { CameraService } from '../../services/camera.service';
import { SkinAnalysisService } from '../../services/skin-analysis.service';
import { FaceDetectionService } from '../../services/face-detection.service';

export class SkinAnalysisViewModel extends Observable {
    private cameraService: CameraService;
    private skinAnalysisService: SkinAnalysisService;
    private faceDetectionService: FaceDetectionService;
    private isAnalyzing: boolean = false;

    constructor() {
        super();
        this.cameraService = new CameraService();
        this.skinAnalysisService = new SkinAnalysisService();
        this.faceDetectionService = new FaceDetectionService();
        
        this.initializeCamera();
    }

    private async initializeCamera() {
        try {
            const hasPermission = await this.cameraService.requestPermissions();
            if (!hasPermission) {
                this.set('statusMessage', 'Camera permission denied');
                return;
            }

            await this.cameraService.initializePreview();
            this.startFaceDetection();
        } catch (error) {
            console.error('Error initializing camera:', error);
            this.set('statusMessage', 'Failed to initialize camera');
        }
    }

    private async startFaceDetection() {
        try {
            await this.faceDetectionService.startDetection({
                onFaceDetected: (face) => {
                    this.updateFaceOverlay(face);
                }
            });
        } catch (error) {
            console.error('Error starting face detection:', error);
        }
    }

    private updateFaceOverlay(face: any) {
        // Update UI overlay to show face detection bounds
        const overlay = this.get('faceOverlay');
        if (overlay) {
            // Draw face detection bounds
            overlay.drawFaceBounds(face);
        }
    }

    async startAnalysis() {
        if (this.isAnalyzing) return;

        try {
            this.set('isAnalyzing', true);
            this.set('statusMessage', 'Capturing image...');

            const image = await this.cameraService.takePicture();
            this.set('statusMessage', 'Analyzing skin...');

            const analysis = await this.skinAnalysisService.analyzeSkin(image);
            
            // Navigate to results page
            const frame = require('@nativescript/core').Frame;
            frame.topmost().navigate({
                moduleName: 'views/skin-analysis/results-page',
                context: { analysis }
            });
        } catch (error) {
            console.error('Error during analysis:', error);
            this.set('statusMessage', 'Analysis failed. Please try again.');
        } finally {
            this.set('isAnalyzing', false);
        }
    }
}