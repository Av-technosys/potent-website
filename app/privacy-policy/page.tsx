import React from "react";
import Footer from "../components/common/Footer";
import { Navbar } from "../components/common/Navbar";

const Page = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      

     
      <Navbar/>

      
      <div className="w-full flex items-start justify-center bg-white py-16 px-0 md:px-8">
        <div className="w-full max-w-3xl flex flex-col items-center gap-10">

          
          <h1 className="text-3xl sm:text-4xl font-bold text-black text-center">
            Privacy Policy
          </h1>

         
          <div className="w-full bg-[#F8F6F1] md:rounded-2xl rounded-none shadow-sm border border-neutral-200 p-6 sm:p-8 lg:p-10 space-y-6 text-neutral-800 leading-relaxed">

            <div>
              <h2 className="font-bold text-black">Introduction</h2>
              <p className="mt-3">
                At Potent Hygiene, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, store, and protect your data when you visit or use our website.
              </p>
              <p className="mt-3">
                By accessing or using our website, you agree to the terms outlined in this Privacy Policy. 
                If you do not agree with our policies, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-black">Information We Collect</h2>
              <p className="mt-3">
                We collect various types of information to provide and improve our services:
              </p>

              <p className="mt-3 font-semibold text-black">Personal Information</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Name, email, and phone number</li>
                <li>Billing and shipping address</li>
                <li>Payment details (processed securely via third-party gateways)</li>
                <li>Communication details when contacting support</li>
              </ul>

              <p className="mt-3 font-semibold text-black">Automatically Collected Information</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited, session duration, and usage data</li>
                <li>Cookies and analytics data</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-black">Third-Party Payment Gateways</h2>
              <p className="mt-3">
                We use secure third-party payment processors to handle all financial transactions. 
                Your payment information is processed directly by these providers and is not stored on our servers.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-black">Cookies and Tracking Technologies</h2>
              <p className="mt-3">
                We use cookies and similar technologies to enhance your browsing experience, 
                analyze traffic, and improve our services.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-black">Data Security</h2>
              <p className="mt-3">
                We implement industry-standard security measures to protect your personal data 
                from unauthorized access, misuse, or disclosure.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-black">Your Data Protection Rights</h2>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Access and update your personal information</li>
                <li>Request correction or deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-black">Opt-Out and Account Deletion</h2>
              <p className="mt-3">
                You may opt out of promotional emails at any time by using the unsubscribe link 
                or by contacting our support team.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-black">Security & Encryption Assurance</h2>
              <p className="mt-3">
                We use encryption and secure technologies to protect your personal data and 
                ensure safe transactions on our platform.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-black">Contact Us</h2>
              <p className="mt-3">
                If you have any questions regarding this Privacy Policy, please contact us at 
                care@potenthygiene.com
              </p>
            </div>

          </div>
        </div>
      </div>
       <Footer/>
    </div>
  );
};

export default Page;