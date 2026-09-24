"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function TrackerGuide() {
  return (
    <section className="w-full bg-[#f5f3f0] pb-10  flex justify-center">
      <Card className="container mx-auto  md:rounded-2xl shadow-sm">
        <CardContent className="p-6 sm:p-8 md:p-10 space-y-8 text-gray-700 leading-relaxed">
          
          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
              Period Calculator - Track Your Menstrual Cycle with Ease
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-600">
              Our Period Calculator is an easy-to-use tool that helps women track and predict their menstrual cycles with precision. Whether you're trying to understand your cycle better, predict your next period, or manage your fertility window, our Period Calculator makes tracking your menstrual health straightforward.
            </p>
          </div>

          {/* Why Use */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Why Use a Period Calculator?
            </h2>

            <ul className="mt-3 space-y-2 list-disc pl-5 text-sm sm:text-base">
              <li>Predict your next period with accuracy.</li>
              <li>Understand your cycle and monitor health.</li>
              <li>Plan your fertility window easily.</li>
              <li>Avoid unexpected surprises.</li>
            </ul>
          </div>

          {/* How it Works */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              How the Period Calculator Works
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-600">
              The calculator uses your last period start date and cycle length to estimate your next cycle and ovulation window.
            </p>

            <ul className="mt-3 space-y-2 list-disc pl-5 text-sm sm:text-base">
              <li>Accurate predictions for upcoming cycles.</li>
              <li>Helps identify irregularities.</li>
              <li>Simple and user-friendly interface.</li>
            </ul>
          </div>

          {/* Wowpad Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Track Your Period and Stay Prepared with Wowpad
            </h2>

            <ul className="mt-3 space-y-2 list-disc pl-5 text-sm sm:text-base">
              <li>Ultra-absorbent protection.</li>
              <li>Breathable and comfortable materials.</li>
              <li>Leak-proof design for confidence.</li>
            </ul>
          </div>

          {/* How to Use */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              How to Use the Period Calculator
            </h2>

            <ol className="mt-3 space-y-2 list-decimal pl-5 text-sm sm:text-base">
              <li>Enter your last period start date.</li>
              <li>Input your cycle length.</li>
              <li>Get predictions instantly.</li>
            </ol>
          </div>

          {/* Final Note */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Stay Comfortable with Wowpad
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-600">
              Stay prepared and comfortable with high-quality sanitary pads designed for maximum protection and comfort throughout your cycle.
            </p>
          </div>

        </CardContent>
      </Card>
    </section>
  );
}