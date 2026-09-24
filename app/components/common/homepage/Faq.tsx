import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "I placed an order by mistake. How to cancel my order and get a refund?",
    answer: "If you want to cancel your order, you just need to drop an email to care@potenthygiene.com within 12 hours of placing the order. You will receive an email confirming the cancellation of your order in 24–48 business hours. The money will be refunded as per the payment mode within 6–8 working days of the confirmation. Please note that orders that have already been shipped from our side cannot be canceled."
  },
  {
    question: "I cancelled my order but didn’t get the refund. What should I do?",
    answer: "Refunds are processed within 6–8 working days after cancellation confirmation. If you still haven't received it, please contact our support team with your order details."
  },
  {
    question: "My order has not been delivered. What should I do?",
    answer: "If your order is delayed, please check the tracking link shared with you. If the issue persists, contact our support team for assistance."
  },
  {
    question: "Are there any shipping charges?",
    answer: "Shipping charges may vary depending on your location and order value. Any applicable charges will be shown at checkout."
  },
  {
    question: "What are the locations Potent Hygiene delivers its products to?",
    answer: "We currently deliver across India. We are working on expanding our delivery services internationally."
  }

];

const Faq = () => {
  return (
    <section className="bg-[#FFFFFF] ">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="space-y-8 py-6">
            <h2 className="md:text-4xl text-3xl font-serif font-bold text-[#333333]">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4 pb-4">
              {faqData.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border rounded-md px-6 py-1 transition-all border-black/20 data-[state=open]:border-[#1A8D91] data-[state=open]:bg-[#F9FDFE] shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-800 hover:no-underline md:text-md py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-2xl mx-auto text-sm text-black/50 leading-relaxed pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="relative flex justify-center items-center lg:sticky lg:top-10">
            <div className="relative w-full aspect-square max-w-[500px]">
              <Image
                src="/faq.png"
                alt="Potent Hygiene Products Collage"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;