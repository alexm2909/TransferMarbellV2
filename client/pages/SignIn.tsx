import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CarIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
} from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    // Test credentials for different user roles
  const testCredentials = {
    "cliente@test.com": {
      password: "123456",
      role: "client",
      name: "Ana García",
      phone: "+34 600 123 456"
    },
    "conductor@test.com": {
      password: "123456",
      role: "driver",
      name: "Carlos Rodríguez",
      phone: "+34 600 654 321"
    },
    "flota@test.com": {
      password: "123456",
      role: "fleet-manager",
      name: "María López",
      phone: "+34 600 789 012"
    },
    "admin@test.com": {
      password: "123456",
      role: "admin",
      name: "José Martínez",
      phone: "+34 600 345 678"
    },
    "empresa@test.com": {
      password: "123456",
      role: "business",
      name: "Hotel Majestic",
      phone: "+34 952 123 456"
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock authentication - replace with real authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if it's a test credential
      const testUser = testCredentials[formData.email.toLowerCase() as keyof typeof testCredentials];

      if (testUser && formData.password === testUser.password) {
        // Set authentication status with test user data
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", testUser.role);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: formData.email,
            name: testUser.name,
            role: testUser.role,
            phone: testUser.phone,
          }),
        );

        // Redirect based on the redirect parameter or default to dashboard
        if (redirectPath === "book") {
          navigate("/book");
        } else if (redirectPath === "driver-registration") {
          navigate("/driver-registration");
        } else {
          navigate("/dashboard");
        }
      } else if (formData.email && formData.password) {
        // Default user for any other email/password combination
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", "client");
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: formData.email,
            name: "Usuario Demo",
            role: "client",
          }),
        );

        if (redirectPath === "book") {
          navigate("/book");
        } else if (redirectPath === "driver-registration") {
          navigate("/driver-registration");
        } else {
          navigate("/dashboard");
        }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light via-sky to-coral-light">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent">
                Transfermarbell
              </span>
            </Link>

          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
              <LockIcon className="w-8 h-8 text-ocean" />
            </div>
            <CardTitle className="text-2xl font-bold text-navy mb-2">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600">
              Sign in to your account to manage your bookings
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MailIcon className="w-4 h-4 text-ocean" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="border-gray-200 focus:border-ocean focus:ring-ocean h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <LockIcon className="w-4 h-4 text-ocean" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="border-gray-200 focus:border-ocean focus:ring-ocean h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        rememberMe: checked as boolean,
                      })
                    }
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-ocean hover:text-coral transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 text-white font-semibold py-3 h-12"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="h-12 border-gray-200 hover:border-ocean"
                  onClick={() => alert("Google Sign-In coming soon!")}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-gray-200 hover:border-ocean"
                  onClick={() => alert("Facebook Sign-In coming soon!")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-gray-200 hover:border-ocean"
                  onClick={() => alert("Apple Sign-In coming soon!")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C6.624 0 2.248 4.377 2.248 9.77c0 5.393 4.376 9.77 9.769 9.77 5.393 0 9.77-4.377 9.77-9.77C21.787 4.377 17.41 0 12.017 0zm4.624 7.383c.424 0 .828.084 1.187.237.359.153.672.375.93.659.257.284.455.620.587.997.132.377.198.781.198 1.207 0 .613-.108 1.154-.324 1.621-.216.467-.51.857-.882 1.171-.372.314-.802.544-1.29.69-.488.146-1.009.219-1.563.219-.554 0-1.075-.073-1.563-.219-.488-.146-.918-.376-1.29-.69-.372-.314-.666-.704-.882-1.171-.216-.467-.324-1.008-.324-1.621 0-.426.066-.83.198-1.207.132-.377.33-.713.587-.997.258-.284.571-.506.93-.659.359-.153.763-.237 1.187-.237z" />
                  </svg>
                </Button>
              </div>
            </div>

                        {/* Test Credentials Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-ocean-light to-coral-light rounded-lg">
              <h3 className="text-sm font-semibold text-navy mb-3 text-center">
                🧪 Credenciales de Prueba
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-700">👤 Cliente:</span>
                  <span className="text-gray-600">cliente@test.com / 123456</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-700">🚗 Conductor:</span>
                  <span className="text-gray-600">conductor@test.com / 123456</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-700">👥 Jefe Flota:</span>
                  <span className="text-gray-600">flota@test.com / 123456</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-700">⚙️ Admin:</span>
                  <span className="text-gray-600">admin@test.com / 123456</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-700">🏢 Empresa:</span>
                  <span className="text-gray-600">empresa@test.com / 123456</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to={`/signup${redirectPath ? `?redirect=${redirectPath}` : ""}`}
                  className="text-ocean hover:text-coral font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
