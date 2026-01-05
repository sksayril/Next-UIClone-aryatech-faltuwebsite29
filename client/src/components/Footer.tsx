import { Button } from "@/components/ui/button";
import { Play, Twitter, Smartphone, ChevronUp } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1e1e1e] border-t border-[#333] mt-12">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* xHamster Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">xHamster</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Creator's Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Advertising</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">xHamster Awards 2025</a>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Content Removal</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Improve xHamster</a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of use</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">DMCA/Copyright</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Parental Controls</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">EU DSA</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Trust and Safety</a>
              </li>
            </ul>
          </div>

          {/* Start making money with us Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Start making money with us</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Camgirls Wanted</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Creator Contest</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Content Creators Program</a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-white font-semibold mb-2 text-sm">Monetize your content</h4>
              <Button className="bg-[#2a2a2a] hover:bg-[#333] text-white border-0 flex items-center gap-2">
                <Play className="h-4 w-4 text-green-500" />
                Become a creator
              </Button>
              {/* Profile pictures placeholder */}
              <div className="flex -space-x-2 mt-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#1e1e1e]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#333] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-500 text-xs">© 2007 - 2026, xHamster.com</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white bg-[#2a2a2a] hover:bg-[#333] h-8"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile Version
            </Button>
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#333] flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#333] flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Play className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-gray-500 text-xs text-right">
              18 U.S.C. 2257 Record-Keeping Requirements Compliance Statement
            </span>
            <div className="bg-[#2a2a2a] px-3 py-1 rounded text-xs text-gray-400">
              RTA
              <div className="text-[10px] text-gray-500">RESTRICTED TO ADULTS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-10 h-10 bg-[#2a2a2a] hover:bg-[#333] text-white rounded flex items-center justify-center transition-colors z-50"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </footer>
  );
}

