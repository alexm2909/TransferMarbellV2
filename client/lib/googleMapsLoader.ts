declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = "AIzaSyBdejLAhodEvEQoLM8bDGpElU6xKFk12SQ";

interface GoogleMapsLoaderOptions {
  libraries?: string[];
}

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;
  private callbacks: (() => void)[] = [];

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async load(options: GoogleMapsLoaderOptions = {}): Promise<void> {
    // If already loaded, resolve immediately
    if (this.isLoaded && window.google) {
      return Promise.resolve();
    }

    // If currently loading, return the existing promise
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // Start loading
    this.isLoading = true;
    this.loadPromise = this.loadScript(options);
    
    return this.loadPromise;
  }

  private loadScript(options: GoogleMapsLoaderOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Script already exists, just wait for it to load
        if (window.google) {
          this.isLoaded = true;
          this.isLoading = false;
          resolve();
        } else {
          // Wait for existing script to load
          existingScript.addEventListener('load', () => {
            this.isLoaded = true;
            this.isLoading = false;
            resolve();
          });
          existingScript.addEventListener('error', reject);
        }
        return;
      }

      const { libraries = [] } = options;
      const librariesParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
      
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}${librariesParam}&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      // Set up callback
      window.initGoogleMaps = () => {
        this.isLoaded = true;
        this.isLoading = false;
        this.executeCallbacks();
        resolve();
      };

      script.onerror = () => {
        this.isLoading = false;
        reject(new Error('Failed to load Google Maps API'));
      };

      document.head.appendChild(script);
    });
  }

  private executeCallbacks() {
    this.callbacks.forEach(callback => callback());
    this.callbacks = [];
  }

  onLoad(callback: () => void) {
    if (this.isLoaded && window.google) {
      callback();
    } else {
      this.callbacks.push(callback);
    }
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && !!window.google;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();

// Helper function for components
export const loadGoogleMaps = (libraries: string[] = []): Promise<void> => {
  return googleMapsLoader.load({ libraries });
};

// Helper function to check if Google Maps is loaded
export const isGoogleMapsLoaded = (): boolean => {
  return googleMapsLoader.isGoogleMapsLoaded();
};
