import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FilterSidebarProps {
  className?: string;
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  const [straightChecked, setStraightChecked] = useState(true);
  const [gayChecked, setGayChecked] = useState(false);
  const [transChecked, setTransChecked] = useState(false);
  const [minQuality, setMinQuality] = useState<string | null>(null);
  const [vrOnly, setVrOnly] = useState(false);
  const [fullVideosOnly, setFullVideosOnly] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [productionOpen, setProductionOpen] = useState(false);
  const [fpsOpen, setFpsOpen] = useState(false);
  const [excludeOpen, setExcludeOpen] = useState(false);

  const resetFilters = () => {
    setStraightChecked(true);
    setGayChecked(false);
    setTransChecked(false);
    setMinQuality(null);
    setVrOnly(false);
    setFullVideosOnly(false);
  };

  return (
    <aside className={`bg-[#1e1e1e] p-4 overflow-y-auto h-full ${className || ''}`}>
      <div className="space-y-6">
        {/* Search in orientations */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Search in orientations</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="straight" 
                checked={straightChecked} 
                onCheckedChange={(checked) => setStraightChecked(checked === true)} 
              />
              <label htmlFor="straight" className="text-sm text-gray-300 cursor-pointer flex items-center gap-1">
                Straight <span className="text-red-500">♂</span><span className="text-blue-500">♀</span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gay" 
                checked={gayChecked} 
                onCheckedChange={(checked) => setGayChecked(checked === true)} 
              />
              <label htmlFor="gay" className="text-sm text-gray-300 cursor-pointer flex items-center gap-1">
                Gay <span className="text-blue-500">♂</span><span className="text-blue-500">♂</span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="trans" 
                checked={transChecked} 
                onCheckedChange={(checked) => setTransChecked(checked === true)} 
              />
              <label htmlFor="trans" className="text-sm text-gray-300 cursor-pointer flex items-center gap-1">
                Transgender <span className="text-purple-500">⚧</span>
              </label>
            </div>
          </div>
        </div>

        {/* Minimum quality */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Minimum quality</h3>
          <div className="flex flex-wrap gap-2">
            {["720p+", "1080p+", "2160p+"].map((quality) => (
              <button
                key={quality}
                onClick={() => setMinQuality(minQuality === quality ? null : quality)}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  minQuality === quality
                    ? "bg-primary text-white"
                    : "bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333]"
                }`}
              >
                {quality}
              </button>
            ))}
          </div>
        </div>

        {/* Sort by */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Sort by</h3>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-full bg-[#2a2a2a] border-[#333] text-white">
              <SelectValue placeholder="Relevance" />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-[#333] text-white">
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="longest">Longest</SelectItem>
              <SelectItem value="shortest">Shortest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Categories */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Filter by Categories</h3>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Choose category"
              className="pl-8 bg-[#2a2a2a] border-[#333] text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* VR Videos Only */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">VR Videos Only</span>
            <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold">VR</span>
          </div>
          <Switch checked={vrOnly} onCheckedChange={setVrOnly} />
        </div>

        {/* Full videos only */}
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-gray-300">Full videos only</span>
          <Switch checked={fullVideosOnly} onCheckedChange={setFullVideosOnly} />
        </div>

        {/* Duration (min) - Collapsible */}
        <Collapsible open={durationOpen} onOpenChange={setDurationOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-300 hover:text-white transition-colors">
            <span>Duration (min)</span>
            {durationOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                className="bg-[#2a2a2a] border-[#333] text-white"
              />
              <Input
                type="number"
                placeholder="Max"
                className="bg-[#2a2a2a] border-[#333] text-white"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Date - Collapsible */}
        <Collapsible open={dateOpen} onOpenChange={setDateOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-300 hover:text-white transition-colors">
            <span>Date</span>
            {dateOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="space-y-2">
              <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded">
                Last 24 hours
              </button>
              <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded">
                Last week
              </button>
              <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded">
                Last month
              </button>
              <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded">
                Last year
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Production - Collapsible */}
        <Collapsible open={productionOpen} onOpenChange={setProductionOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-300 hover:text-white transition-colors">
            <span>Production</span>
            {productionOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="space-y-2">
              <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded">
                Professional
              </button>
              <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded">
                Amateur
              </button>
              <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded">
                Homemade
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* FPS - Collapsible */}
        <Collapsible open={fpsOpen} onOpenChange={setFpsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-300 hover:text-white transition-colors">
            <span>FPS</span>
            {fpsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="space-y-2">
              <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded">
                24 FPS
              </button>
              <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded">
                30 FPS
              </button>
              <button className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded">
                60 FPS
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Exclude categories - Collapsible */}
        <Collapsible open={excludeOpen} onOpenChange={setExcludeOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-300 hover:text-white transition-colors">
            <span>Exclude categories</span>
            {excludeOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search categories"
                className="pl-8 bg-[#2a2a2a] border-[#333] text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-1 mt-2">
              {["Anal", "Hardcore", "BDSM"].map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox id={`exclude-${cat}`} />
                  <label htmlFor={`exclude-${cat}`} className="text-xs text-gray-400 cursor-pointer">
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Reset all filters */}
        <div className="pt-4 border-t border-[#333]">
          <button
            onClick={resetFilters}
            className="text-sm text-white underline decoration-dashed hover:text-primary transition-colors"
          >
            Reset all filters
          </button>
        </div>
      </div>
    </aside>
  );
}

