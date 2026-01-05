import { Search, Menu, Camera, Upload, Settings, ChevronDown, Heart, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <div className="flex flex-col w-full sticky top-0 z-50 bg-[#151515]">
      {/* Primary Header */}
      <header className="h-16 bg-[#151515] border-b border-[#222] flex items-center px-4 justify-between gap-4">
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <img 
              src="https://static.xhpingcdn.com/xh-desktop/images/logo/logo-nightmode.svg" 
              alt="Logo" 
              className="h-10 cursor-pointer"
            />
          </Link>
          <span className="text-gray-400 text-xs">IN</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-400 hover:text-white hover:bg-[#222]">
                <span className="text-red-500">♂</span>
                <span className="text-blue-500">♀</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-[#1e1e1e] border-[#333] text-white">
              <DropdownMenuItem className="text-white hover:bg-[#333]">Straight</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-[#333]">Gay</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-[#333]">Transgender</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Search */}
        <div className="flex flex-1 max-w-2xl mx-4">
          <div className="relative w-full flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-r-none bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#333] border-r-0 h-10 px-3">
                  <Camera className="h-5 w-5 text-gray-400" />
                  <ChevronDown className="h-3 w-3 text-gray-400 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#1e1e1e] border-[#333] text-white">
                <DropdownMenuItem className="text-white hover:bg-[#333]">Search by Image</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input 
              placeholder="Search for videos" 
              className="w-full bg-[#1e1e1e] border-[#333] text-white placeholder:text-gray-500 rounded-none border-r-0 focus-visible:ring-primary h-10"
            />
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-l-none h-10 px-4">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-1.5 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#222]">
                <Settings className="h-4 w-4" />
                <span className="text-xs">🇮🇳</span>
                <span>EN</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1e1e1e] border-[#333] text-white">
              <DropdownMenuItem className="text-white hover:bg-[#333]">English</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-[#333]">Spanish</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-[#333]">French</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-primary font-medium h-9">
                Login
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1e1e1e] border-[#333] text-white">
              <DropdownMenuItem className="text-white hover:bg-[#333]">Sign In</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-[#333]">Create Account</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded px-6 h-9 text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95">
            Sign up for free
          </Button>
        </div>
      </header>

      {/* Secondary Nav */}
      <nav className="flex h-10 bg-[#1e1e1e] items-center px-4 justify-between text-sm font-medium border-b border-[#333]">
        <div className="flex items-center gap-6 text-gray-300 overflow-x-auto scrollbar-hide">
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group relative border-b-2 border-primary pb-1.5 px-1">
            Videos
            <ChevronDown className="h-3 w-3" />
          </a>
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
            <span className="flex items-center gap-1">
              <span className="text-primary">Live</span>
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            </span>
            <span className="ml-1">Sex</span>
          </a>
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
            Categories
            <ChevronDown className="h-3 w-3" />
          </a>
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
            Pornstars
            <ChevronDown className="h-3 w-3" />
          </a>
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
            Creators
            <ChevronDown className="h-3 w-3" />
          </a>
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors px-1">
            Channels
          </a>
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
            Photos
            <ChevronDown className="h-3 w-3" />
          </a>
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
            <Heart className="h-3 w-3 text-pink-500" />
            Nude Chat
          </a>
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
            <Crown className="h-3 w-3 text-yellow-500" />
            Premium Videos
            <span className="bg-primary text-white text-[10px] px-1 rounded ml-1">-60%</span>
          </a>
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors px-1">
            Dating
          </a>
          <a href="#" className="hover:text-primary whitespace-nowrap transition-colors px-1">
            Subscriptions
          </a>
        </div>
        <div className="flex items-center pl-4 border-l border-[#333] h-full">
           <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white gap-2 h-full rounded-none">
             <Upload className="h-4 w-4" />
             Upload
           </Button>
        </div>
      </nav>
    </div>
  );
}
