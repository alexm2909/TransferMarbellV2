import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { GlobeIcon, ChevronDownIcon } from "lucide-react";

interface LanguageSelectorProps {
  variant?: "dropdown" | "select" | "button";
  size?: "sm" | "md" | "lg";
  showFlag?: boolean;
  showText?: boolean;
  className?: string;
}

export default function LanguageSelector({
  variant = "dropdown",
  size = "md",
  showFlag = true,
  showText = true,
  className = "",
}: LanguageSelectorProps) {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = availableLanguages.find((lang) => lang.code === language);

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-3",
  };

  // Icon size classes
  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (variant === "select") {
    return (
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`${sizeClasses[size]} ${className}`}>
          <SelectValue>
            <div className="flex items-center space-x-2">
              {showFlag && <span className="text-lg">{currentLanguage?.flag}</span>}
              {showText && <span>{currentLanguage?.name}</span>}
              {!showText && !showFlag && <GlobeIcon className={iconSizeClasses[size]} />}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (variant === "button") {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="outline"
          className={`${sizeClasses[size]} border-gray-200 hover:border-ocean hover:text-ocean transition-colors`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-1">
            {showFlag && <span className="text-lg">{currentLanguage?.flag}</span>}
            {showText && <span>{currentLanguage?.name}</span>}
            {!showText && !showFlag && <GlobeIcon className={iconSizeClasses[size]} />}
            <ChevronDownIcon className={`${iconSizeClasses[size]} transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </Button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10 bg-transparent"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              <div className="py-1">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-ocean-light/20 transition-colors flex items-center space-x-3 ${
                      lang.code === language ? "bg-ocean-light/10 text-ocean font-medium" : "text-gray-700"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {lang.code === language && (
                      <span className="ml-auto text-ocean">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`${sizeClasses[size]} hover:bg-ocean-light/20 hover:text-ocean transition-colors ${className}`}
        >
          <div className="flex items-center space-x-1">
            {showFlag && <span className="text-lg">{currentLanguage?.flag}</span>}
            {showText && <span className="hidden sm:inline">{currentLanguage?.name}</span>}
            {!showText && !showFlag && <GlobeIcon className={iconSizeClasses[size]} />}
            <ChevronDownIcon className={`${iconSizeClasses[size]} transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center space-x-3 cursor-pointer ${
              lang.code === language ? "bg-ocean-light/10 text-ocean font-medium" : ""
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
            {lang.code === language && (
              <span className="ml-auto text-ocean">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version for mobile/tight spaces - only flag
export function CompactLanguageSelector({ className = "" }: { className?: string }) {
  return (
    <LanguageSelector
      variant="dropdown"
      size="md"
      showFlag={true}
      showText={false}
      className={`${className} min-w-0`}
    />
  );
}

// Icon-only version with larger flag
export function FlagOnlyLanguageSelector({ className = "" }: { className?: string }) {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = availableLanguages.find((lang) => lang.code === language);

  console.log("FlagOnlyLanguageSelector - Current language:", language);
  console.log("FlagOnlyLanguageSelector - Current language object:", currentLanguage);

  const handleLanguageChange = (languageCode: string) => {
    console.log("FlagOnlyLanguageSelector - Changing to:", languageCode);
    setLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`px-2 py-1 hover:bg-ocean-light/20 transition-colors ${className}`}
        >
          <span className="text-xl">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center space-x-3 cursor-pointer ${
              lang.code === language ? "bg-ocean-light/10 text-ocean font-medium" : ""
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
            {lang.code === language && (
              <span className="ml-auto text-ocean text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Full version with text
export function FullLanguageSelector({ className = "" }: { className?: string }) {
  return (
    <LanguageSelector
      variant="dropdown"
      size="md"
      showFlag={true}
      showText={true}
      className={className}
    />
  );
}
