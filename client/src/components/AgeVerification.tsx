import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const AGE_VERIFICATION_KEY = "xhamster_age_verified";

export function AgeVerification() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age
    const hasVerified = localStorage.getItem(AGE_VERIFICATION_KEY);
    if (!hasVerified) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    // Store verification in localStorage
    localStorage.setItem(AGE_VERIFICATION_KEY, "true");
    setIsOpen(false);
  };

  // Prevent closing by clicking outside or pressing ESC
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Prevent closing - user must click the button
      return;
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-2xl bg-white text-black p-8 rounded-lg z-[9999] [&>button]:hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center">
            xHamster is <span className="text-red-600">adults only</span> website!
          </h2>

          {/* Content Warning */}
          <p className="text-base">
            The content available on xHamster may contain pornographic materials.
          </p>

          {/* Age Restriction */}
          <p className="text-base">
            xHamster is strictly limited to those over 18 or of legal age in your jurisdiction, whichever is greater.
          </p>

          {/* Parental Control Information */}
          <div className="space-y-3">
            <p className="text-base">
              A core goal of xHamster is to help parents restrict access for minors. xHamster is fully compliant with the RTA (Restricted to Adults) code. xHamster can be blocked by parental control tools.
            </p>
            <p className="text-base">
              It is important for parents/guardians to take necessary steps to prevent minors from accessing unsuitable content.
            </p>
            <p className="text-base">
              Anyone with a minor in their household or under their supervision should implement basic parental control protections, including computer hardware and device settings, software installation, or ISP filtering services, to block your minors from accessing inappropriate content.
            </p>
          </div>

          {/* Call to Action */}
          <p className="text-base font-bold text-center">
            To enter xHamster you must be 18 or older
          </p>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded text-lg"
            >
              I'm 18 or older - enter xHamster
            </Button>
          </div>

          {/* Informational Link and RTA Logo */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <a
              href="https://www.rtalabel.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm hover:text-blue-800"
            >
              how to protect your minors
            </a>
            <a
              href="https://www.rtalabel.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              RTA RESTRICTED TO ADULTS
            </a>
          </div>

          {/* Cookie Consent */}
          <p className="text-xs text-gray-500 text-center pt-4 border-t">
            By using xHamster you agree with our use of cookies
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
