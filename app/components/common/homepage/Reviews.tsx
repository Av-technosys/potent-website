import Image from "next/image";
import { Star } from "lucide-react";

type Props = {
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  bgColor?: string;
};

const testimonials = [
  {
    id: 1,
    name: "Priya S.",
    location: "Bengaluru",
    // avatar: "/avtar.png",
    rating: 5,
    text: `I have been using mainstream pads for 14 years. My skin was so used to the rash that I thought it was just normal. Tried Ovy XL on a friend's recommendation and went through an entire cycle rash-free for the first time. I actually cried a little. That is how much this matters.`,
    Lifestyle: "Working Professional, 31 ",
  },
  {
    id: 2,
    name: "Meenakshi R.",
    location: "Jaipur",
    rating: 5,
    text: `Ordered the Looway pee funnel before our Kedarnath trek in October. Used it for three days in the mountains with zero clean restrooms in sight. Life-changing is not an exaggeration. Every woman going on a pilgrimage or trek needs this.`,
    Lifestyle: "Teacher & Trekker, 38",
  },
  {
    id: 3,
    name: "Sneha K.",
    location: "Pune",
    rating: 5,
    text: `The packaging arrived in a plain box — no brand name on the outside. That alone told me this company understands its customers. The pads are genuinely the softest I have ever used. I have subscribed to a monthly plan and I am not going back.`,
    Lifestyle: "Postgraduate Student, 24 ",
  },
  {
    id: 4,
    name: "Kavitha M. ",
    location: "Chennai",
    rating: 5,
    text: `I bought the Ovy Teen pack for my 13-year-old daughter when she got her first period. The silent wrappers — she told me this was the first time she felt comfortable changing at school. I did not realise how much that detail matters to a teenage girl until she said it.`,
    Lifestyle: " Parent, 41",
  },
  {
    id: 5,
    name: "Ananya T.",
    location: "Mumbai",
    rating: 5,
    text: `Started the menstrual cup three months ago. Month one was a learning curve. By month two I could not imagine going back to pads. Twelve hours of protection. Zero leaks. I have done two long-haul flights with it. This product has genuinely changed the quality of my period weeks.`,
    Lifestyle: "Frequent Traveller, 27",
  },
  {
    id: 6,
    name: "Reema J.",
    location: "Ahmedabad",
    rating: 5,
    text: `I bought the toilet seat covers for a trip to North India with my mother-in-law. We were going to temples and dhabas across Rajasthan. We used them every single day. Clean, easy to carry, and they actually stay in place — which cheaper ones never do. Already ordered again.`,
    Lifestyle: " Homemaker & Traveller, 45",
  },
];

export function Testimonials({
  title = "What Our Customers Say",
  subtitle = "Join thousands of happy customers who have made the switch to healthier feminine care.",
  primaryColor = "#1A8D91",
  bgColor = "#F8F6F1",
}: Props) {
  return (
    <section
      className="py-12 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="container mx-auto px-4 md:px-16">
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-16 space-y-3">
          <h2 className="md:text-4xl text-3xl font-serif font-bold text-[#333333]">
            {title}
          </h2>

          <p className="max-w-2xl mx-auto text-sm text-black/50 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* CARDS */}
        <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 no-scrollbar snap-x snap-mandatory">
          {testimonials?.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-[28px] md:rounded-md shadow-sm border flex flex-col justify-between min-w-[300px] md:min-w-0 snap-start"
            >
              <div>
                {/* STARS */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < item.rating ? "fill-current" : "text-gray-200"
                      }`}
                      style={{ color: primaryColor }}
                    />
                  ))}
                </div>

                {/* TEXT */}
                <p className="text-sm text-gray-600 mb-4 italic">{item.text}</p>

                {/* PRODUCT */}
                <div className="text-xs font-medium mb-4 text-gray-500">
                  Lifestyle: {item.Lifestyle}
                </div>
              </div>

              {/* USER */}
              <div className="flex items-center gap-4 border-t pt-5">
                {/* <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover grayscale"
                  />
                </div> */}

                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
