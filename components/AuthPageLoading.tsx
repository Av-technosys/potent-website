import Image from "next/image";

export default function AuthPageLoading() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center lg:justify-end">
      <Image
        src="/loginbg.png"
        alt="background"
        fill
        priority
        className="object-cover -z-10"
      />

      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-sm md:max-w-lg lg:max-w-md p-6">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.svg"
              alt="Potent logo"
              width={90}
              height={50}
              className="object-contain"
            />
          </div>

          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-10 w-10 rounded-full border-4 border-cyan-100 border-t-cyan-700 animate-spin" />
            <div className="space-y-2 w-full max-w-xs">
              <div className="h-3 w-2/3 mx-auto rounded-full bg-cyan-100 animate-pulse" />
              <div className="h-3 w-1/2 mx-auto rounded-full bg-cyan-50 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
