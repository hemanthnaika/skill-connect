"use client";

import { useState, useEffect, useMemo } from "react";
import CourseCard from "@/components/CourseCard";
import CustomLayout from "@/components/CustomLayout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, Home, ListFilter, Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Categories } from "@/constants";
import { useApi } from "@/hooks/useApi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// ✅ Move FilterItems outside of Skills and pass props
interface FilterItemsProps {
  selectedRating: number | null;
  setSelectedRating: (val: number | null) => void;
  selectedMode: "All" | "Online" | "Offline";
  setSelectedMode: (val: "All" | "Online" | "Offline") => void;
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
}

const FilterItems = ({
  selectedRating,
  setSelectedRating,
  selectedMode,
  setSelectedMode,
  selectedCategories,
  toggleCategory,
}: FilterItemsProps) => (
  <div>
    <div className="flex items-center gap-5 bg-white border border-primary px-5 py-1 w-1/2 rounded-lg">
      <ListFilter className="text-primary size-5" />
      <span>Filters</span>
    </div>

    {/* Ratings */}
    <h1 className="font-bold mt-5">Ratings</h1>
    <RadioGroup
      value={selectedRating ? `option-${selectedRating}` : undefined}
      onValueChange={(val) => setSelectedRating(Number(val.split("-")[1]))}
      className="mt-3 border-b border-gray-300 pb-5"
    >
      {[4, 3, 2, 1].map((num) => (
        <div className="flex items-center space-x-2" key={num}>
          <RadioGroupItem value={`option-${num}`} id={`option-${num}`} />
          <Label htmlFor={`option-${num}`}>
            {num}.5 & above
            <Star className="fill-yellow-500 text-yellow-500 size-5" />
          </Label>
        </div>
      ))}
    </RadioGroup>

    {/* Mode */}
    <h1 className="font-bold mt-5">Mode</h1>
    <RadioGroup
      value={selectedMode}
      onValueChange={(val) =>
        setSelectedMode(val as "All" | "Online" | "Offline")
      }
      className="mt-3 border-b border-gray-300 pb-5 flex flex-wrap gap-2"
    >
      {["All", "Online", "Offline"].map((item) => (
        <div className="flex items-center space-x-2" key={item}>
          <RadioGroupItem value={item} id={item} />
          <Label htmlFor={item}>{item}</Label>
        </div>
      ))}
    </RadioGroup>

    {/* Categories */}
    <h1 className="font-bold mt-5">Categories</h1>
    <div className="grid grid-cols-2 gap-5 mt-3">
      {Categories.map((cat) => (
        <Label
          htmlFor={cat.name}
          key={cat.name}
          className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-2 cursor-pointer 
                    has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 has-aria-checked:text-blue-600"
          onClick={() => toggleCategory(cat.name)}
        >
          <Checkbox
            id={cat.name}
            checked={selectedCategories.includes(cat.name)}
            onCheckedChange={() => toggleCategory(cat.name)}
            className="data-[state=checked]:border-blue-600 
                      data-[state=checked]:bg-blue-600 
                      data-[state=checked]:text-white
                      dark:data-[state=checked]:border-blue-700 
                      dark:data-[state=checked]:bg-blue-700"
          />
          <span className="font-medium font-xs">{cat.name}</span>
        </Label>
      ))}
    </div>
  </div>
);

const Skills = () => {
  const { request } = useApi<Workshops>();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<
    "All" | "Online" | "Offline"
  >("All");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch workshops on client
  useEffect(() => {
    const fetchWorkshops = async () => {
      const res = await request({
        url: "/api/workshops",
        method: "GET",
      });
      if (!res) return;
      setWorkshops(res.workshops);
    };
    fetchWorkshops();
  }, []);

  const filteredWorkshops = useMemo(() => {
    return workshops.filter((w) => {
      if (selectedRating && w.rating < selectedRating) return false;

      if (selectedMode !== "All") {
        if (selectedMode === "Online" && !["online", "both"].includes(w.mode))
          return false;
        if (selectedMode === "Offline" && !["offline", "both"].includes(w.mode))
          return false;
      }

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(w.category)
      )
        return false;

      return true;
    });
  }, [workshops, selectedRating, selectedMode, selectedCategories]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <section className="bg-secondary/10 pt-12">
      <CustomLayout>
        <div className="pt-12 flex items-center justify-between">
          <div className="flex flex-wrap items-center space-x-2 text-sm  font-medium">
            <button type="button" aria-label="Home">
              <Home className="text-primary w-5 h-5" />
            </button>
            <ChevronRight  />
            <span>All Courses</span>
          </div>

          {/* Mobile Sheet */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger className="px-4 py-2 border rounded bg-primary text-white">
                Filters
              </SheetTrigger>
              <SheetContent className="w-80 bg-white p-5">
                <SheetHeader>
                  <SheetTitle>Filter Workshops</SheetTitle>
                </SheetHeader>
                <FilterItems
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                  selectedMode={selectedMode}
                  setSelectedMode={setSelectedMode}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <hr className="my-4 border-gray" />

        <div className="grid grid-cols-4 gap-5">
          {/* Desktop Filters */}
          <div className="col-span-1 sticky top-5 h-[90vh] overflow-y-auto pr-2 hidden md:block">
            <FilterItems
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
            />
          </div>

          {/* Workshop Cards */}
          <div className="col-span-4 md:col-span-3 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {filteredWorkshops.map((workshop) => (
                <CourseCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          </div>
        </div>
      </CustomLayout>
    </section>
  );
};

export default Skills;
