import React from "react";
import BlogHeader from "../../components/common/BlogHeader";
import {
  IconBuildingEstate,
  IconBuildingSkyscraper,
  IconHome,
  IconMapPin,
} from "@tabler/icons-react";

const Page = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="w-full flex items-start justify-center bg-white py-16 px-0 md:px-8">
        <div className="w-full max-w-3xl flex flex-col items-center gap-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black text-center">
            Shipping Policy
          </h1>

          <div className="w-full bg-[#F8F6F1] md:rounded-2xl rounded-none shadow-sm border border-neutral-200 p-6 sm:p-8 lg:p-10 space-y-6 text-neutral-800 leading-relaxed">
            <section>
              <h2 className="font-bold text-black">Overview</h2>
              <p className="mt-2">
                At Potent Hygiene, we are committed to delivering your orders
                safely, quickly, and efficiently. This Shipping Policy outlines
                our delivery process, timelines, coverage areas, and what you
                can expect when ordering from us.
              </p>
            </section>
            <section>
              <h2 className="font-bold text-black">Order Processing Time</h2>
              <p className="mt-2">
                Once your order is successfully placed and payment is confirmed,
                we begin processing immediately:
              </p>

              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>
                  Standard Processing: 1–2 business days for order verification
                  and packing.
                </li>
                <li>Pre-orders: Processing depends on product release date.</li>
                <li>
                  Custom/Bulk Orders: 3–5 business days depending on size.
                </li>
                <li>
                  Weekend Orders: Orders placed on Saturday/Sunday are processed
                  next business day.
                </li>
              </ul>

              <p className="mt-3">
                You will receive an order confirmation email immediately after
                purchase, followed by a shipping confirmation with tracking
                details once dispatched.
              </p>
            </section>
            <section>
              <h2 className="font-bold text-black">Shipping Coverage</h2>
              <p className="mt-2">
                Estimated delivery times vary based on your location:
              </p>

              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>Domestic Shipping (India)</li>
                <li>Tier 1 and Tier 2 cities</li>
                <li>Rural areas (subject to courier availability)</li>
                <li>Remote locations (extra time may apply)</li>
              </ul>

              <p className="mt-3">
                Note: Some remote pin codes may not be serviceable by our
                courier partners. We will notify you within 24 hours if delivery
                is unavailable.
              </p>
            </section>
  
            <section>
              <h2 className="font-bold text-black">Delivery Timeline</h2>
              <p className="mt-2 mb-4">
                Estimated delivery times vary based on your location:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center">
                      <IconBuildingSkyscraper
                        className="text-red-500"
                        size={18}
                      />
                    </div>
                    <h3 className="font-semibold text-black">Metro Cities</h3>
                  </div>

                  <p className="text-sm text-neutral-600">
                    Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune
                  </p>

                  <p className="font-semibold text-red-500">
                    3–5 Business Days
                  </p>
                </div>

                <div className="bg-white border rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-yellow-50 flex items-center justify-center">
                      <IconBuildingEstate
                        className="text-yellow-600"
                        size={18}
                      />
                    </div>
                    <h3 className="font-semibold text-black">Tier 2 Cities</h3>
                  </div>

                  <p className="text-sm text-neutral-600">
                    State capitals and major towns
                  </p>

                  <p className="font-semibold text-yellow-600">
                    5–7 Business Days
                  </p>
                </div>

                <div className="bg-white border rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
                      <IconHome className="text-green-600" size={18} />
                    </div>
                    <h3 className="font-semibold text-black">
                      Tier 3 Cities & Towns
                    </h3>
                  </div>

                  <p className="text-sm text-neutral-600">
                    Smaller cities and district headquarters
                  </p>

                  <p className="font-semibold text-green-600">
                    7–10 Business Days
                  </p>
                </div>

                <div className="bg-white border rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-teal-50 flex items-center justify-center">
                      <IconMapPin className="text-teal-600" size={18} />
                    </div>
                    <h3 className="font-semibold text-black">Remote Areas</h3>
                  </div>

                  <p className="text-sm text-neutral-600">
                    Rural locations and remote pin codes
                  </p>

                  <p className="font-semibold text-teal-600">
                    10–14 Business Days
                  </p>
                </div>
              </div>
            </section>
            <section>
              <h2 className="font-bold text-black">
                Delivery Attempts and Failed Deliveries
              </h2>

              <p className="mt-2">
                Our courier partners will make up to 3 delivery attempts:
              </p>

              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>First Attempt: Delivery to the provided address.</li>
                <li>Second Attempt: Re-delivery next business day.</li>
                <li>
                  Third Attempt: Final delivery attempt with notification.
                </li>
              </ul>

              <p className="mt-3 font-medium">Failed Delivery Reasons:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Recipient unavailable or unreachable</li>
                <li>Incorrect or incomplete address</li>
                <li>Refused delivery by recipient</li>
                <li>Premises locked or inaccessible</li>
              </ul>
            </section>
            <section>
              <h2 className="font-bold text-black">
                Packaging and Product Safety
              </h2>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>Discreet Packaging for privacy.</li>
                <li>Secure Wrapping to prevent damage.</li>
                <li>Tamper-proof sealing.</li>
                <li>Eco-friendly recyclable materials.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-bold text-black">International Shipping</h2>
              <p className="mt-2">
                Currently, we only ship within India. International shipping
                will be introduced soon as services expand.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
