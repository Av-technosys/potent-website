"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  PhoneCall,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  PackageCheck,
  Instagram,
  Facebook,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";
import { submitContactMessage } from "@/helper/user/action";

const CONTACT_INFO = [
  {
    id: "phone",
    icon: PhoneCall,
    title: "Call Us Directly",
    subtitle: "Mon - Sat: 10:00 AM - 7:00 PM IST",
    value: "+91 63758 81514",
    href: "tel:+916375881514",
    btnText: "Call Now",
    badge: "Direct Support",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    iconBg: "bg-[#0E5C3A] text-white",
  },
  {
    id: "whatsapp",
    icon: MessageSquare,
    title: "WhatsApp Chat",
    subtitle: "Fastest response & product advice",
    value: "+91 63758 81514",
    href: "https://wa.me/916375881514",
    btnText: "Chat on WhatsApp",
    badge: "Instant Chat",
    accentBg: "bg-green-50 border-green-200 text-green-800",
    iconBg: "bg-[#25D366] text-white",
    isExternal: true,
  },
  {
    id: "email",
    icon: Mail,
    title: "Email Care Team",
    subtitle: "Response within 2 - 4 business hours",
    value: "care@potenthygiene.com",
    href: "mailto:care@potenthygiene.com",
    btnText: "Send Email",
    badge: "24/7 Mail Box",
    accentBg: "bg-teal-50 border-teal-200 text-teal-800",
    iconBg: "bg-[#075965] text-white",
  },
  {
    id: "location",
    icon: MapPin,
    title: "Headquarters & Dispatch",
    subtitle: "Made in Jaipur, built for Indian journeys",
    value: "Jaipur, Rajasthan, India",
    href: "https://maps.google.com/?q=Jaipur+Rajasthan+India",
    btnText: "Jaipur, RJ",
    badge: "Origin",
    accentBg: "bg-amber-50 border-amber-200 text-amber-800",
    iconBg: "bg-[#D97706] text-white",
    isExternal: true,
  },
];

const FAQS = [
  {
    question: "How do I track my order status?",
    answer:
      "Once your order is shipped, you will receive an SMS and email with your tracking link. You can also view live order progress from your Profile > My Orders section.",
  },
  {
    question: "Are Ovy & Looway products safe for sensitive skin?",
    answer:
      "Yes! All Ovy period care products and Looway hygiene items are dermatologically tested, toxin-free, hypoallergenic, and crafted specially for Indian body needs.",
  },
  {
    question: "Do you offer corporate or bulk event orders?",
    answer:
      "We love partnering for travel kits, office hygiene setups, and women's wellness events! Please select 'B2B & Bulk Orders' in the form or WhatsApp us directly.",
  },
  {
    question: "What is your return or exchange policy?",
    answer:
      "Due to strict hygiene safety standards, opened hygiene products cannot be returned. However, if you receive a damaged or wrong item, we offer hassle-free replacements within 7 days.",
  },
];

export default function ContactUsClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Product Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullMessage = `[Topic: ${formData.subject}]\n\n${formData.message.trim()}`;
      const res = await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: fullMessage,
      });

      if (res.success) {
        toast.success(res.message || "Message sent successfully!");
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "Product Inquiry",
          message: "",
        });
      } else {
        toast.error(res.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try contacting via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#17271E]">
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-[#075965] py-14 sm:py-20 text-white">
        {/* Decorative background glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#FAF8F3]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-[#F4C430]/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-100 shadow-2xs backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#F4C430]" />
            <span>We&apos;re Here For You</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
            Get in Touch with Potent Hygiene
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-base text-emerald-100/90 leading-relaxed font-medium">
            Have a question about Ovy period care or Looway travel hygiene? Need help tracking an order? We&apos;re always here to listen, guide, and support your hygiene journey.
          </p>
        </div>
      </section>

      {/* QUICK CONTACT INFO CARDS GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_INFO.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#E4DED0] bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#0E5C3A]/30"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs transition-transform group-hover:scale-105 ${item.iconBg}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase ${item.accentBg}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-[#0A4A2E]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[#0E5C3A] break-words">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[11px] text-[#17271E]/65 leading-tight">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E4DED0]/60">
                  <a
                    href={item.href}
                    target={item.isExternal ? "_blank" : "_self"}
                    rel={item.isExternal ? "noreferrer" : undefined}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F1F7F3] px-3.5 py-2 text-xs font-bold text-[#0E5C3A] transition-all group-hover:bg-[#075965] group-hover:text-white"
                  >
                    <span>{item.btnText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MAIN FORM & BRAND SHOWCASE SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* LEFT: INTERACTIVE CONTACT FORM */}
          <div className="lg:col-span-7 rounded-3xl border border-[#E4DED0] bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#075965] text-white">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-extrabold text-[#0A4A2E] sm:text-3xl">
                  Send Us a Message
                </h2>
                <p className="text-xs text-[#17271E]/70 sm:text-sm font-medium">
                  Fill out the form below and our customer care team will get back to you.
                </p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="mt-8 rounded-2xl bg-[#F1F7F3] p-6 text-center border border-[#0E5C3A]/20">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#0E5C3A]" />
                <h3 className="mt-3 text-lg font-extrabold text-[#0A4A2E]">
                  Message Received!
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#17271E]/80 leading-relaxed max-w-md mx-auto">
                  Thank you for reaching out to Potent Hygiene. We have received your query and will reply via email/phone shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#075965] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#0A4A2E]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A4A2E] mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-[#E4DED0] bg-[#FAF8F3]/50 px-4 py-3 text-sm text-[#17271E] outline-none transition focus:border-[#075965] focus:bg-white focus:ring-2 focus:ring-[#075965]/15"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A4A2E] mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ananya@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-[#E4DED0] bg-[#FAF8F3]/50 px-4 py-3 text-sm text-[#17271E] outline-none transition focus:border-[#075965] focus:bg-white focus:ring-2 focus:ring-[#075965]/15"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A4A2E] mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-[#E4DED0] bg-[#FAF8F3]/50 px-4 py-3 text-sm text-[#17271E] outline-none transition focus:border-[#075965] focus:bg-white focus:ring-2 focus:ring-[#075965]/15"
                    />
                  </div>

                  {/* Topic / Subject */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A4A2E] mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-[#E4DED0] bg-[#FAF8F3]/50 px-4 py-3 text-sm text-[#17271E] outline-none transition focus:border-[#075965] focus:bg-white focus:ring-2 focus:ring-[#075965]/15 cursor-pointer"
                    >
                      <option value="Product Inquiry">Product Inquiry (Ovy / Looway)</option>
                      <option value="Order Tracking">Order & Delivery Status</option>
                      <option value="Period Care Advice">Period Care Advice & Sizing</option>
                      <option value="B2B & Bulk Orders">B2B & Bulk Orders</option>
                      <option value="Feedback & Support">Feedback or Complaint</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A4A2E] mb-1.5">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-[#E4DED0] bg-[#FAF8F3]/50 px-4 py-3 text-sm text-[#17271E] outline-none transition focus:border-[#075965] focus:bg-white focus:ring-2 focus:ring-[#075965]/15 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#075965] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0A4A2E] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-[#17271E]/60">
                  <ShieldCheck className="h-4 w-4 text-[#0E5C3A]" />
                  <span>🔒 100% Privacy Protected • Your information is never shared</span>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT: BRAND SHOWCASE & QUICK LINKS CARD */}
          <div className="lg:col-span-5 space-y-6">
            {/* BRAND STORY IMAGE CARD */}
            <div className="relative overflow-hidden rounded-3xl border border-[#E4DED0] bg-white shadow-sm">
              <div className="relative h-64 sm:h-72 w-full">
                <Image
                  src="/yatra_mom_daughter.jpg"
                  alt="Potent Hygiene Journey"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#075965]/90 via-[#075965]/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-[#075965] shadow-xs">
                    ✦ Made in Jaipur, India
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-serif text-lg font-extrabold leading-snug sm:text-xl">
                    &ldquo;Built for Indian bodies, Indian toilets &amp; Indian journeys.&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-emerald-100/90 font-medium">
                    India&apos;s 1st scenario-based intimate care brand.
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS & HELPFUL LINKS */}
            <div className="rounded-3xl border border-[#E4DED0] bg-[#FAF8F3] p-6 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0E5C3A] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0E5C3A]" />
                <span>Quick Self-Service Links</span>
              </h3>

              <div className="space-y-2.5">
                <Link
                  href="/quiz"
                  className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-[#E4DED0]/80 transition-all hover:border-[#0E5C3A] hover:shadow-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#075965]">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0A4A2E]">Find What I Need Quiz</div>
                      <div className="text-[10.5px] text-[#17271E]/65">Take 1-min test to match products</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#0E5C3A] transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/faq"
                  className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-[#E4DED0]/80 transition-all hover:border-[#0E5C3A] hover:shadow-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#0E5C3A]">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0A4A2E]">Frequently Asked Questions</div>
                      <div className="text-[10.5px] text-[#17271E]/65">Instant answers to top queries</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#0E5C3A] transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/shop"
                  className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-[#E4DED0]/80 transition-all hover:border-[#0E5C3A] hover:shadow-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#D97706]">
                      <PackageCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0A4A2E]">Explore Full Catalog</div>
                      <div className="text-[10.5px] text-[#17271E]/65">Browse Ovy &amp; Looway ranges</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#0E5C3A] transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="border-t border-[#E4DED0] bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <div className="text-center mb-10">
            <span className="rounded-full bg-[#F1F7F3] px-3.5 py-1 text-xs font-bold text-[#0E5C3A] border border-[#0E5C3A]/20">
              Got Questions?
            </span>
            <h2 className="mt-3 font-serif text-2xl font-extrabold text-[#0A4A2E] sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#17271E]/70 font-medium">
              Quick answers to the most common inquiries from our customers.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-[#E4DED0] bg-[#FDFCF9] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-[#0A4A2E] cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#0E5C3A] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 pt-0 text-xs sm:text-sm text-[#17271E]/75 leading-relaxed font-medium border-t border-[#E4DED0]/50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#075965] hover:underline"
            >
              <span>View All FAQs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SOCIAL COMMUNITY BAR */}
      <section className="bg-[#075965] py-10 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 text-center">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Connect With Our Community
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100/80 font-medium">
            Follow @potenthygiene on social media for daily tips, product giveaways, and wellness stories.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href="https://www.instagram.com/potenthygiene/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-xs transition-all hover:bg-white hover:text-[#075965]"
            >
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
            </a>

            <a
              href="https://www.facebook.com/potenthygiene"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-xs transition-all hover:bg-white hover:text-[#075965]"
            >
              <Facebook className="h-4 w-4" />
              <span>Facebook</span>
            </a>

            <a
              href="https://wa.me/916375881514"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white transition-all hover:brightness-110"
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
