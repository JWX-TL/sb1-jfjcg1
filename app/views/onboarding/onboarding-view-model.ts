import { Observable } from '@nativescript/core';
import { CameraService } from '../../services/camera.service';
import { SkinAnalysisService } from '../../services/skin-analysis.service';

export class OnboardingViewModel extends Observable {
  private cameraService: CameraService;
  private skinAnalysisService: SkinAnalysisService;

  constructor() {
    super();
    this.cameraService = new CameraService();
    this.skinAnalysisService = new SkinAnalysisService();
    
    this.initializeData();
  }

  private initializeData() {
    this.set('name', '');
    this.set('age', '');
    this.set('skinTypes', ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive']);
    this.set('hairTypes', ['Straight', 'Wavy', 'Curly', 'Coily']);
    this.set('selectedSkinType', 0);
    this.set('selectedHairType', 0);
    this.set('brandPreferences', [
      { name: 'Luxury Brands', selected: false },
      { name: 'Drugstore Brands', selected: false },
      { name: 'Clean Beauty', selected: false },
      { name: 'K-Beauty', selected: false }
    ]);
  }

  async startSkinAnalysis() {
    try {
      const hasPermission = await this.cameraService.requestPermissions();
      if (!hasPermission) {
        console.error('Camera permission denied');
        return;
      }

      const image = await this.cameraService.takePicture();
      const analysis = await this.skinAnalysisService.analyzeSkin(image);
      
      // TODO: Navigate to results page with analysis
      console.log('Skin analysis results:', analysis);
    } catch (error) {
      console.error('Error during skin analysis:', error);
    }
  }

  completeProfile() {
    // TODO: Save profile data and navigate to main app
    console.log('Profile completed');
  }
}