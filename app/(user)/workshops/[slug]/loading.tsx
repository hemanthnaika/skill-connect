import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="bg-secondary py-5">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Breadcrumb */}
        <Skeleton className="w-1/3 h-5" />
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-5 mt-5">
          {/* Left */}
          <div className="w-full space-y-5">
            <Skeleton className="h-10 w-2/3" /> {/* Title */}
            <Skeleton className="h-5 w-1/4" /> {/* Category */}
            <div className="flex gap-2 items-center">
              <Skeleton className="h-12 w-12 rounded-full" /> {/* Profile */}
              <Skeleton className="h-5 w-1/4" />
            </div>
            {/* Stats */}
            <div className="flex gap-3">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
            </div>
            {/* Extra Info */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/3" />
            </div>
            {/* Button */}
            <Skeleton className="h-10 w-40 mt-5" />
          </div>

          {/* Right Image */}
          <Skeleton className="w-full h-64 md:h-80 rounded-xl" />
        </div>

        {/* Description */}
        <div className="bg-white p-5 rounded-xl">
          <Skeleton className="h-5 w-1/4 mb-2" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Related Courses */}
        <div className="space-y-2 mt-5">
          <Skeleton className="h-5 w-1/4" />
          <div className="flex gap-5 flex-wrap">
            <Skeleton className="h-48 w-64 rounded-xl" />
            <Skeleton className="h-48 w-64 rounded-xl" />
            <Skeleton className="h-48 w-64 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
