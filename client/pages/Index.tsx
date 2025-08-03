import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import TimeSelector from "@/components/TimeSelector";
import UserMenu from "@/components/UserMenu";
import { FlagOnlyLanguageSelector, FullLanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLanguageDebug } from "@/hooks/useLanguageDebug";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CarIcon,
  ShieldCheckIcon,
  StarIcon,
  MessageSquareIcon,
  MenuIcon,
  XIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debugging temporal
  useLanguageDebug();
  const [preBookingData, setPreBookingData] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
  });

  const features = [
    {
      icon: ShieldCheckIcon,
      title: t("features.professionalDrivers"),
      desc: t("features.professionalDriversDesc"),
    },
    {
      icon: StarIcon,
      title: t("features.topRated"),
      desc: t("features.topRatedDesc"),
    },
    {
      icon: MessageSquareIcon,
      title: t("features.realTimeChat"),
      desc: t("features.realTimeChatDesc"),
    },
  ];

  const handlePreBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Store pre-booking data in localStorage for later use
    localStorage.setItem("preBookingData", JSON.stringify(preBookingData));

    // If user is authenticated, go directly to booking
    // If not authenticated, they'll be redirected to sign in from the booking page
    navigate("/book");
  };

  const isPreFormValid =
    preBookingData.origin &&
    preBookingData.destination &&
    preBookingData.date &&
    preBookingData.time;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-ocean rounded-lg flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-navy">
                Transfermarbell
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/services"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                {t("nav.services")}
              </Link>
              <Link
                to="/fleet"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                {t("nav.fleet")}
              </Link>
              <Link
                to="/business"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                {t("nav.business")}
              </Link>
              <Link
                to="/support"
                className="text-gray-700 hover:text-ocean transition-colors"
              >
                {t("nav.support")}
              </Link>

              <FlagOnlyLanguageSelector />

              {/* Show different buttons based on authentication status */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button
                      variant="outline"
                      className="border-ocean text-ocean hover:bg-ocean hover:text-white"
                    >
                      {t("nav.dashboard")}
                    </Button>
                  </Link>
                  <UserMenu />
                </div>
              ) : (
                <>
                  <Link to="/signin">
                    <Button
                      variant="outline"
                      className="border-ocean text-ocean hover:bg-ocean hover:text-white"
                    >
                      {t("nav.signin")}
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-ocean text-white hover:bg-ocean/90">
                      {t("nav.register")}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/services"
                  className="block px-3 py-2 text-gray-700 hover:text-ocean transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.services")}
                </Link>
                <Link
                  to="/fleet"
                  className="block px-3 py-2 text-gray-700 hover:text-ocean transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.fleet")}
                </Link>
                <Link
                  to="/business"
                  className="block px-3 py-2 text-gray-700 hover:text-ocean transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.business")}
                </Link>
                <Link
                  to="/support"
                  className="block px-3 py-2 text-gray-700 hover:text-ocean transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.support")}
                </Link>

                <div className="px-3 py-2">
                  <FullLanguageSelector />
                </div>

                {/* Show different buttons based on authentication status */}
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3 px-3 pt-2">
                    <Link to="/dashboard" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full border-ocean text-ocean hover:bg-ocean hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("nav.dashboard")}
                      </Button>
                    </Link>
                    <div className="flex justify-center pt-2">
                      <UserMenu />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 px-3 pt-2">
                    <Link to="/signin" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full border-ocean text-ocean hover:bg-ocean hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("nav.signin")}
                      </Button>
                    </Link>
                    <Link to="/signup" className="w-full">
                      <Button
                        className="w-full bg-ocean text-white hover:bg-ocean/90"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("nav.register")}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-navy mb-6">
              {t("home.title")}
              <span className="block text-ocean">
                {t("home.subtitle")}
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("home.description")}
            </p>
          </div>

          {/* Simplified Pre-Booking Form */}
          <Card className="max-w-4xl mx-auto shadow-lg border-gray-200 bg-white">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-navy mb-2">
                  {t("home.bookingTitle")}
                </h2>
                <p className="text-gray-600">
                  {t("home.bookingDescription")}
                </p>
              </div>

              <form onSubmit={handlePreBookingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-ocean" />
                      {t("home.from")}
                    </label>
                    <AddressAutocomplete
                      placeholder="Airport, hotel, address..."
                      value={preBookingData.origin}
                      onChange={(value) =>
                        setPreBookingData({ ...preBookingData, origin: value })
                      }
                      className="border-gray-200 focus:border-ocean focus:ring-ocean h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-coral" />
                      {t("home.to")}
                    </label>
                    <AddressAutocomplete
                      placeholder="Airport, hotel, address..."
                      value={preBookingData.destination}
                      onChange={(value) =>
                        setPreBookingData({
                          ...preBookingData,
                          destination: value,
                        })
                      }
                      className="border-gray-200 focus:border-ocean focus:ring-ocean h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-ocean" />
                      {t("home.date")}
                    </label>
                    <div className="relative custom-date-input">
                      <Input
                        type="date"
                        value={preBookingData.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setPreBookingData({
                            ...preBookingData,
                            date: e.target.value,
                          })
                        }
                        className="border-gray-200 focus:border-ocean focus:ring-ocean h-12 text-gray-700 bg-white hover:border-ocean/60 transition-all cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-ocean" />
                      {t("home.time")}
                    </label>
                    <TimeSelector
                      value={preBookingData.time}
                      onChange={(value) =>
                        setPreBookingData({
                          ...preBookingData,
                          time: value,
                        })
                      }
                      className="border-gray-200 focus:border-ocean focus:ring-ocean"
                      placeholder={t("home.time")}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={!isPreFormValid}
                  className="w-full bg-ocean text-white hover:bg-ocean/90 font-semibold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("home.continue")}
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  {t("home.nextStep")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">
              {t("home.whyChoose")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("home.whyChooseDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-ocean-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-ocean" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Become a Driver Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-ocean rounded-2xl p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  {t("driver.title")}
                </h2>
                <p className="text-lg mb-6 text-white/90">
                  {t("driver.description")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>{t("driver.earnUpTo")}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>{t("driver.flexibleHours")}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>{t("driver.insuranceSupport")}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    <span>{t("driver.noUpfrontCosts")}</span>
                  </li>
                </ul>
                {isAuthenticated ? (
                  <Link to="/driver-registration">
                    <Button
                      size="lg"
                      className="bg-white text-ocean hover:bg-gray-100 font-semibold px-8"
                    >
                      {t("driver.applyToDrive")}
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <p className="text-white/80 text-sm">
                      {t("driver.needAccount")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/signup">
                        <Button
                          size="lg"
                          className="bg-white text-ocean hover:bg-gray-100 font-semibold px-6"
                        >
                          {t("driver.signUp")}
                        </Button>
                      </Link>
                      <Link to="/signin">
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-white text-white hover:bg-white hover:text-ocean font-semibold px-6"
                        >
                          {t("driver.signIn")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center lg:text-right">
                <div className="w-64 h-64 mx-auto lg:mx-0 bg-white/10 rounded-full flex items-center justify-center">
                  <CarIcon className="w-32 h-32 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">
            {t("home.readyToBook")}
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            {t("home.readyToBookDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-ocean text-white hover:bg-ocean/90 font-semibold px-8"
              onClick={() =>
                document
                  .querySelector("form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("home.bookNow")}
            </Button>
            <Link to="/fleet">
              <Button
                variant="outline"
                size="lg"
                className="border-ocean text-ocean hover:bg-ocean hover:text-white font-semibold px-8"
              >
                {t("home.viewFleet")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-ocean rounded-lg flex items-center justify-center">
                  <CarIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Transfermarbell</span>
              </div>
              <p className="text-gray-300">
                Premium private transfers across Costa del Sol
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("footer.services")}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{t("footer.airportTransfers")}</li>
                <li>{t("footer.cityTransfers")}</li>
                <li>{t("footer.businessTransport")}</li>
                <li>{t("footer.groupBookings")}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("footer.support")}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{t("footer.helpCenter")}</li>
                <li>{t("footer.contactUs")}</li>
                <li>{t("footer.driverPortal")}</li>
                <li>{t("footer.fleetManager")}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("footer.company")}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{t("footer.aboutUs")}</li>
                <li>{t("footer.careers")}</li>
                <li>{t("footer.privacyPolicy")}</li>
                <li>{t("footer.termsOfService")}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
