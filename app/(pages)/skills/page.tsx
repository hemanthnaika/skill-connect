import CourseCard from "@/components/CourseCard";
import CustomLayout from "@/components/CustomLayout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, Filter, Home, ListFilter, Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Categories } from "@/constants";

const Skills = () => {
  return (
    <section className="bg-slate-50">
      <CustomLayout>
        <div className="pt-12 ">
          <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-500 font-medium">
            <button type="button" aria-label="Home">
              <Home className="text-primary w-5 h-5" />
            </button>
            <ChevronRight className="text-gray" />
            <a href="#">All Courses</a>
          </div>
        </div>
        <hr className="my-4 border-gray" />

        <div className="grid grid-cols-4 gap-5 ">
          <div className="col-span-1 sticky top-5 h-[90vh] overflow-y-auto pr-2">
            <div>
              <div className="flex items-center gap-5 bg-white border border-primary px-5 py-1 w-1/2 rounded-lg">
                <ListFilter className="text-primary size-5" />
                <span>Filters</span>
              </div>
              <h1 className="font-bold mt-5">Ratings</h1>
              <RadioGroup
                defaultValue="option-1"
                className="mt-3 border-b border-gray-300 pb-5"
              >
                {Array.from({ length: 4 })
                  .map((_, i) => 4 - i)
                  .map((num) => (
                    <div className="flex items-center space-x-2" key={num}>
                      <RadioGroupItem
                        value={`option-${num}`}
                        id={`option-${num}`}
                      />
                      <Label htmlFor={`option-${num}`}>
                        {num}.5 & above
                        <Star className="fill-yellow-500 text-yellow-500 size-5" />
                      </Label>
                    </div>
                  ))}
              </RadioGroup>

              <div>
                <h1 className="font-bold mt-5">Mode</h1>
                <RadioGroup
                  defaultValue="option-1"
                  className="mt-3 border-b border-gray-300 pb-5 flex flex-wrap gap-2"
                >
                  {["All", "Online", "Offline"].map((item) => (
                    <div className="flex items-center space-x-2" key={item}>
                      <RadioGroupItem value={`${item}`} id={`${item}`} />
                      <Label htmlFor={`${item}`}>{item}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <h1 className="font-bold mt-5">Categories</h1>

                <div className="grid grid-cols-2 gap-5 mt-3">
                  {Categories.map((cat) => (
                    <Label
                      htmlFor={cat.name}
                      key={cat.name}
                      className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-2 cursor-pointer 
                 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 has-aria-checked:text-blue-600"
                    >
                      <Checkbox
                        id={cat.name}
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
            </div>
          </div>

          <div className="col-span-3 overflow-y-auto pr-2">
            <div className="grid grid-cols-3 gap-5">
              {Array.from({ length: 20 }).map((item, i) => (
                <CourseCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </CustomLayout>
    </section>
  );
};

export default Skills;
