export interface PermissionStatus {
  camera: 'granted' | 'denied' | 'prompt' | 'unknown';
  location: 'granted' | 'denied' | 'prompt' | 'unknown';
  contacts: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export class PermissionsManager {
  private static instance: PermissionsManager;
  private permissionStatus: PermissionStatus = {
    camera: 'unknown',
    location: 'unknown',
    contacts: 'unknown'
  };

  static getInstance(): PermissionsManager {
    if (!PermissionsManager.instance) {
      PermissionsManager.instance = new PermissionsManager();
    }
    return PermissionsManager.instance;
  }

  async checkCameraPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return 'denied';
      }

      // Try to get camera permission status
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        this.permissionStatus.camera = permission.state;
        return permission.state;
      }

      // Fallback: try to access camera directly
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        this.permissionStatus.camera = 'granted';
        return 'granted';
      } catch (error: any) {
        if (error.name === 'NotAllowedError') {
          this.permissionStatus.camera = 'denied';
          return 'denied';
        }
        this.permissionStatus.camera = 'prompt';
        return 'prompt';
      }
    } catch (error) {
      this.permissionStatus.camera = 'unknown';
      return 'denied';
    }
  }

  async requestCameraPermission(): Promise<MediaStream | null> {
    try {
      // Try back camera first (mobile)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      } catch (backCameraError) {
        // Fallback to front camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      }

      this.permissionStatus.camera = 'granted';
      return stream;
    } catch (error: any) {
      console.error('Camera permission error:', error);
      
      if (error.name === 'NotAllowedError') {
        this.permissionStatus.camera = 'denied';
        throw new Error('Camera permission denied. Please allow camera access and try again.');
      } else if (error.name === 'NotFoundError') {
        this.permissionStatus.camera = 'denied';
        throw new Error('No camera found on this device.');
      } else if (error.name === 'NotSupportedError') {
        this.permissionStatus.camera = 'denied';
        throw new Error('Camera not supported in this browser. Please use Chrome, Safari, or Edge.');
      } else {
        this.permissionStatus.camera = 'denied';
        throw new Error('Failed to access camera. Please check your camera settings and try again.');
      }
    }
  }

  async checkLocationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    try {
      if (!navigator.geolocation) {
        return 'denied';
      }

      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        this.permissionStatus.location = permission.state;
        return permission.state;
      }

      return 'prompt';
    } catch (error) {
      this.permissionStatus.location = 'unknown';
      return 'denied';
    }
  }

  async requestLocationPermission(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        this.permissionStatus.location = 'denied';
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.permissionStatus.location = 'granted';
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          this.permissionStatus.location = 'denied';
          let errorMessage = 'Location access failed';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  getPermissionStatus(): PermissionStatus {
    return { ...this.permissionStatus };
  }

  async checkAllPermissions(): Promise<PermissionStatus> {
    const [camera, location] = await Promise.all([
      this.checkCameraPermission(),
      this.checkLocationPermission()
    ]);

    this.permissionStatus = {
      camera,
      location,
      contacts: 'unknown' // Future feature
    };

    return this.permissionStatus;
  }

  getPermissionIcon(permission: string): string {
    switch (permission) {
      case 'granted': return '✅';
      case 'denied': return '❌';
      case 'prompt': return '⏳';
      default: return '❓';
    }
  }

  getPermissionColor(permission: string): string {
    switch (permission) {
      case 'granted': return 'text-green-600';
      case 'denied': return 'text-red-600';
      case 'prompt': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  }
}

export const permissionsManager = PermissionsManager.getInstance();