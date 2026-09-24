import LogEntry from "./logEntry";
import TrackerGuide from "./trackerGuide";

const Page = () => {
  return (
    <>
      <div className="w-full h-[87vh] bg-[url('/trackermainImage.png')] bg-cover bg-center">
        <div className="flex items-center justify-center bg-black/40 w-full h-full">
          <div className="max-w-sm md:max-w-xl flex flex-col items-center gap-4 text-center text-white">
          <h1 className="text-5xl font-bold">Know Your Body Better</h1>
          <p className="text-gray-200 max-w-lg text-center text-[14px]">
            A period tracker helps women monitor their menstrual cycle, predict
            upcoming periods, and understand body patterns. It provides insights
            into ovulation, symptoms, and health trends, making it easier to
            stay prepared, manage well-being, and take control of reproductive
            health confidently
          </p>
        </div>
        </div>
      </div>
      <LogEntry/>
      <TrackerGuide/>
    </>
  );
};

export default Page;
