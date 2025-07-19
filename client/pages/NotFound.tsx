import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarIcon, HomeIcon, SearchIcon } from "lucide-react";

export default function NotFound() {
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
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <Button
                  variant="outline"
                  className="border-ocean text-ocean hover:bg-ocean hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-10 h-10 text-ocean" />
            </div>
            <CardTitle className="text-6xl font-bold text-navy mb-4">
              404
            </CardTitle>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Page Not Found
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Sorry, we couldn't find the page you're looking for. The page may
              have been moved, deleted, or you may have entered an incorrect
              URL.
            </p>

            <div className="bg-gradient-to-r from-ocean-light to-coral-light rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-navy mb-2">
                🚗 Need a ride instead?
              </h3>
              <p className="text-gray-700">
                Don't let a wrong turn stop you. Book your transfer with
                Transfermarbell and get where you need to go.
              </p>
            </div>

            <div className="space-y-4">
              <Link to="/">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 mr-4"
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" size="lg">
                  Contact Support
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>
                If you believe this is an error, please{" "}
                <Link
                  to="/support"
                  className="text-ocean hover:text-coral underline"
                >
                  contact our support team
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
