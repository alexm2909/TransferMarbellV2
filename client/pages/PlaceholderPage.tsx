import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarIcon, WrenchIcon } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function PlaceholderPage({
  title,
  description,
  icon: Icon = WrenchIcon,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean to-coral rounded-lg flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-ocean to-coral bg-clip-text text-transparent">
                Transfermarbell
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-ocean text-ocean">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-ocean-light to-coral-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-ocean" />
            </div>
            <CardTitle className="text-3xl font-bold text-navy mb-4">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              {description}
            </p>
            <div className="bg-gradient-to-r from-ocean-light to-coral-light rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-navy mb-2">
                🚧 Coming Soon
              </h3>
              <p className="text-gray-700">
                This page is currently under development. Our team is working
                hard to bring you the best experience.
              </p>
            </div>
            <div className="space-y-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-ocean to-coral hover:from-ocean/90 hover:to-coral/90 mr-4"
              >
                Return Home
              </Button>
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
