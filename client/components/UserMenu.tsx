import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarIcon, CarIcon } from "lucide-react";

interface UserMenuProps {
  className?: string;
}

// Replaced the old user menu (which required authentication) with a simple menu
// that exposes the "Mi reserva" quick access and a link to book.
export default function UserMenu({ className }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <CalendarIcon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/mi-reserva" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Mi reserva
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/book" className="flex items-center gap-2">
            <CarIcon className="w-4 h-4" />
            Reservar ahora
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
