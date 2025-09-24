declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const GOOGLE_MAPS_DISABLED = String(import.meta.env.VITE_DISABLE_GOOGLE_MAPS || "").toLowerCase() === "true";
const GOOGLE_MAPS_DEV_KEY = import.meta.env.VITE_GOOGLE_MAPS_DEV_KEY;

function resolveGoogleMapsApiKey(): string | null {
  const prodKey = String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  const devKey = String(GOOGLE_MAPS_DEV_KEY || '').trim();
  try {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isPreviewOrLocal = hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.fly.dev') || hostname.endsWith('.netlify.app') || hostname.endsWith('.vercel.app');
    if (isPreviewOrLocal && devKey) return devKey;
    if (prodKey) return prodKey;
    return null;
  } catch {
    return prodKey || null;
  }
}

interface GoogleMapsLoaderOptions {
  libraries?: string[];
}

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;
  private callbacks: (() => void)[] = [];
  private hasError = false;
  private errorMessage = '';

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async load(options: GoogleMapsLoaderOptions = {}): Promise<void> {
    if (GOOGLE_MAPS_DISABLED) {
      const msg = 'Google Maps is disabled in this environment (VITE_DISABLE_GOOGLE_MAPS=true).';
      console.warn(msg);
      this.hasError = true;
      this.errorMessage = msg;
      throw new Error(msg);
    }

    const apiKey = resolveGoogleMapsApiKey();
    if (!apiKey) {
      const error = new Error('Google Maps API key not configured. Set VITE_GOOGLE_MAPS_API_KEY (and optionally VITE_GOOGLE_MAPS_DEV_KEY).');
      console.error(error.message);
      this.hasError = true;
      this.errorMessage = error.message;
      throw error;
    }

    if (this.isLoaded && window.google) {
      return Promise.resolve();
    }

    if (this.hasError) {
      throw new Error(this.errorMessage);
    }

    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = this.loadScript(options, apiKey);
    return this.loadPromise;
  }

  private loadScript(options: GoogleMapsLoaderOptions, apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        if (window.google) {
          this.isLoaded = true;
          this.isLoading = false;
          resolve();
        } else {
          existingScript.addEventListener('load', () => {
            this.isLoaded = true;
            this.isLoading = false;
            resolve();
          });
          existingScript.addEventListener('error', () => {
            this.isLoading = false;
            this.hasError = true;
            this.errorMessage = 'Failed to load Google Maps API - Check API key and HTTP referrer restrictions for this domain.';
            reject(new Error(this.errorMessage));
          });
        }
        return;
      }

      const { libraries = [] } = options;
      const librariesParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${librariesParam}&callback=initGoogleMaps&region=ES&language=es`;
      script.async = true;
      script.defer = true;

      window.initGoogleMaps = () => {
        this.isLoaded = true;
        this.isLoading = false;
        this.executeCallbacks();
        resolve();
      };

      script.onerror = (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Failed to load Google Maps API - Check API key and HTTP referrer restrictions for this domain.';
        console.error('Google Maps loading error:', error);
        reject(new Error(this.errorMessage));
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

  getError(): string | null {
    return this.hasError ? this.errorMessage : null;
  }

  hasLoadingError(): boolean {
    return this.hasError;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();

export const loadGoogleMaps = (libraries: string[] = []): Promise<void> => {
  return googleMapsLoader.load({ libraries });
};

export const isGoogleMapsLoaded = (): boolean => {
  return googleMapsLoader.isGoogleMapsLoaded();
};

export const getGoogleMapsError = (): string | null => {
  return googleMapsLoader.getError();
};

export const hasGoogleMapsError = (): boolean => {
  return googleMapsLoader.hasLoadingError();
};
