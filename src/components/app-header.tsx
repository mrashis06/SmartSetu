
"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { Home, LayoutDashboard, Settings, User as UserIcon, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
                <span className="sr-only">Go back</span>
            </Button>
            <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-8 w-auto" />
            </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#" className="transition-colors hover:text-primary">FAQs</Link>
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <Link href="/dashboard" className="transition-colors hover:text-primary font-bold">Dashboard</Link>
          </nav>
            {user && (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar>
                                <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
                                <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                        <Link href="/profile"><UserIcon className="mr-2 h-4 w-4" /><span>Profile</span></Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                        <Link href="/"><Home className="mr-2 h-4 w-4" /><span>Home</span></Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                        <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Dashboard</span></Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                        <Link href="/settings"><Settings className="mr-2 h-4 w-4" /><span>Settings</span></Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut}>
                        Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
