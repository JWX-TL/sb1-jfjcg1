import { Camera, CameraOptions } from '@nativescript/camera';
import { ImageAsset } from '@nativescript/core';

export class CameraService {
  private camera: Camera;

  constructor() {
    this.camera = new Camera();
  }

  async requestPermissions(): Promise<boolean> {
    return await this.camera.requestPermissions();
  }

  async takePicture(): Promise<ImageAsset> {
    const options: CameraOptions = {
      width: 1920,
      height: 1080,
      keepAspectRatio: true,
      saveToGallery: false,
      cameraFacing: 'front'
    };

    try {
      const imageAsset = await this.camera.takePicture(options);
      return imageAsset;
    } catch (error) {
      console.error('Error taking picture:', error);
      throw error;
    }
  }
}