import Image from "next/image";

type BrandHeroProps = {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  bgImage: string;
  primaryColor: string;
  secondaryColor: string;
};

export function BrandHero({
  logo,
  title,
  subtitle,
  description,
  bgImage,
  primaryColor,
  secondaryColor,
}: BrandHeroProps) {
  return (
    <section
      className="relative w-full h-[500px] flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/20 absolute inset-0" />

      <div className="relative z-10 text-white space-y-4">
        <Image
          src={logo}
          alt="logo"
          className="mx-auto w-auto object-contain h-32"
          height={500}
          width={500}
        />

        <h1 className="font-playfair  text-4xl max-w-2xl font-semibold">
          {title}
        </h1>

        <p className="text-lg max-w-2xl font-roboto">{subtitle}</p>

        <p className="max-w-xl font-roboto mx-auto text-md opacity-90">
          {description}
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <button
            className="px-8 py-3 rounded-full font-medium transition-transform hover:scale-105 active:scale-95 shadow-lg"
            style={{
              backgroundColor: primaryColor,
              color: "#FFFFFF",
            }}
          >
            Explore products
          </button>
          {/* 
          <button
            className="px-8 py-3 rounded-xl font-medium  transition-all hover:bg-white/10 backdrop-blur-md shadow-lg"
            style={{
              backgroundColor: secondaryColor,
              color: "#FFFFFF",
            }}
          >
            All Brands
          </button> */}
        </div>
      </div>
    </section>
  );
}
