import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  UserIcon,
  CalendarIcon,
  CarIcon,
  MessageSquareIcon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  BuildingIcon,
  TrendingUpIcon,
  EuroIcon,
  MapPinIcon,
  ClockIcon,
  ShieldIcon,
} from "lucide-react";

interface UserMenuProps {
  className?: string;
}

export default function UserMenu({ className }: UserMenuProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Force navigation to home page after logout
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
  };

  const getRoleBadge = (role: string) => {
    const roleMap = {
      client: "Cliente",
      driver: "Conductor",
      admin: "Administrador",
    };
    return roleMap[role as keyof typeof roleMap] || "Dashboard";
  };

  const getRoleIcon = (role: string) => {
    const iconMap = {
      client: "👤",
      driver: "🚗",
      admin: "⚙️",
    };
    return iconMap[role as keyof typeof iconMap] || "👤";
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <UserIcon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{user?.name || "Usuario"}</span>
          </div>
          <Badge variant="outline" className="border-ocean text-ocean w-fit">
            {getRoleIcon(user?.role || "")} {getRoleBadge(user?.role || "")}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          {user?.role === "client" && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/book" className="cursor-pointer">
                  <CarIcon className="w-4 h-4 mr-2" />
                  {t('book_transfer')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/my-bookings" className="cursor-pointer">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {t('view_bookings')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/chat" className="cursor-pointer">
                  <MessageSquareIcon className="w-4 h-4 mr-2" />
                  Chat con Conductor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/refer-friends" className="cursor-pointer">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Referir Amigos
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {user?.role === "driver" && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/driver-panel" className="cursor-pointer">
                  <CarIcon className="w-4 h-4 mr-2" />
                  Panel de Conductor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/driver-earnings" className="cursor-pointer">
                  <EuroIcon className="w-4 h-4 mr-2" />
                  Ganancias
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/admin-panel" className="cursor-pointer">
                  <ShieldIcon className="w-4 h-4 mr-2" />
                  Panel Admin
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <UsersIcon className="w-4 h-4 mr-2" />
                Usuarios
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <TrendingUpIcon className="w-4 h-4 mr-2" />
                Reportes
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <SettingsIcon className="w-4 h-4 mr-2" />
            {t('settings')}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOutIcon className="w-4 h-4 mr-2" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
