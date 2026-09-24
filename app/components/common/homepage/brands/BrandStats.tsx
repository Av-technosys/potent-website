import Image from "next/image";

type Props =
  | {
      variant: "stats";
      stats: { value: string; label: string }[];
      bullets: string[];
      image: string; // The product overlay image
      gradientFrom: string;
      gradientTo: string;
    }
  | {
      variant: "banner";
      title: string;
      highlight: string;
      subtitle: string;
      image: string;
      bgColor: string;
    };

export function BrandStats(props: Props) {
  if (props.image) {
    return (
      <div className=" bg-[#F8F6F1] w-full h-auto">
        <div className=" max-w-6xl mx-auto px-4">
          <Image
            src={props.image}
            height={800}
            width={1600}
            alt="banner image"
            className=" w-full h-auto object-contain"
          />
        </div>
      </div>
    );
  }
}
