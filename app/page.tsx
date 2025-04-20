"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import localFont from "next/font/local";

const meditative = localFont({
  src: "./fonts/meditative.otf",
});

export default function Home() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-x-hidden">
      {/* Hero Section */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-white text-xl sm:text-2xl font-bold"
              >
                SoulSpace
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/community"
                className="text-gray-300 hover:text-white"
              >
                Community
              </Link>
              <Link
                href="/manifesto"
                className="text-gray-300 hover:text-white"
              >
                Manifesto
              </Link>
              <Link href="/download" className="text-gray-300 hover:text-white">
                Download
              </Link>
              <Link
                href={session ? "/dashboard" : "/auth/signin"}
                className="text-gray-300 hover:text-white"
              >
                {session ? "Dashboard" : "Sign In"}
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:hidden mt-4 bg-[#1A0505]/90 backdrop-blur-lg rounded-lg p-4`}
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/community"
                className="text-gray-300 hover:text-white block px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link
                href="/manifesto"
                className="text-gray-300 hover:text-white block px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Manifesto
              </Link>
              <Link
                href="/download"
                className="text-gray-300 hover:text-white block px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Download
              </Link>
              <Link
                href={session ? "/dashboard" : "/auth/signin"}
                className="text-gray-300 hover:text-white block px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {session ? "Dashboard" : "Sign In"}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A0505] via-[#0A0A0A] to-[#0A0A0A]"></div>
          <div className="absolute top-0 right-0 w-full md:w-1/3 h-screen">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-screen">
              <div className="relative w-full h-full">
                <Image
                  src="/images/soulspace.png"
                  alt="Abstract glowing figure"
                  fill
                  className="object-cover -scale-x-100 opacity-50 md:opacity-100"
                  priority
                />
                {/* <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D4D] to-transparent opacity-20 blur-3xl"></div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center md:text-left md:w-1/2 mt-20 md:mt-0">
          <div className="max-w-3xl mx-auto md:mx-0 px-4 sm:px-6 lg:px-8">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight ${meditative.className}`}
            >
              Talk. Heal.
              <br />
              Grow.
            </h1>
          </div>
        </div>

        {/* System Text */}
        <style jsx>{`
          @keyframes float1 {
            0% {
              transform: translateY(0px);
              opacity: 0.5;
            }
            50% {
              transform: translateY(-20px);
              opacity: 1;
            }
            100% {
              transform: translateY(0px);
              opacity: 0.5;
            }
          }
          @keyframes float2 {
            0% {
              transform: translateY(-20px);
              opacity: 0.5;
            }
            50% {
              transform: translateY(0px);
              opacity: 1;
            }
            100% {
              transform: translateY(-20px);
              opacity: 0.5;
            }
          }
          @keyframes float3 {
            0% {
              transform: translateY(0px);
              opacity: 0.5;
            }
            50% {
              transform: translateY(-15px);
              opacity: 1;
            }
            100% {
              transform: translateY(0px);
              opacity: 0.5;
            }
          }
          .float-1 {
            animation: float1 6s ease-in-out infinite;
          }
          .float-2 {
            animation: float2 7s ease-in-out infinite;
          }
          .float-3 {
            animation: float3 8s ease-in-out infinite;
          }
        `}</style>

        {/* Floating Quotes - Hidden on mobile, visible on tablet and up */}
        <div className="hidden md:block absolute inset-0">
          <div className="absolute bottom-32 left-12">
            <div className="float-1 transition-all duration-300 hover:scale-105">
              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider max-w-[250px] sm:max-w-[300px] bg-[#0A0A0A]/50 p-4 rounded-lg backdrop-blur-sm">
                • "Healing takes time, and asking for help is a courageous
                step." — Mariska Hargitay
              </p>
            </div>
          </div>
          <div className="absolute top-1/3 right-1/3">
            <div className="float-2 transition-all duration-300 hover:scale-105">
              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider max-w-[250px] sm:max-w-[300px] bg-[#0A0A0A]/50 p-4 rounded-lg backdrop-blur-sm">
                • "Mental pain is less dramatic than physical pain, but it is
                more common and also more hard to bear." — C.S. Lewis
              </p>
            </div>
          </div>
          <div className="absolute top-24 left-1/4">
            <div className="float-3 transition-all duration-300 hover:scale-105">
              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider max-w-[250px] sm:max-w-[300px] bg-[#0A0A0A]/50 p-4 rounded-lg backdrop-blur-sm">
                • "Until you make the unconscious conscious, it will direct your
                life and you will call it fate." — Carl Jung
              </p>
            </div>
          </div>
          <div className="absolute top-24 left-1">
            <div className="float-3 transition-all duration-300 hover:scale-105">
              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider max-w-[250px] sm:max-w-[300px] bg-[#0A0A0A]/50 p-4 rounded-lg backdrop-blur-sm">
                • "Just because no one else can heal or do your inner work for
                you doesn&apos;t mean you can, should, or need to do it alone."
                — Lisa Olivera
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0505] via-[#0A0A0A] to-[#0A0A0A] opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-12 ${meditative.className}`}
          >
            Your Journey to Healing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-[#1A0505]/40 backdrop-blur-lg p-8 rounded-2xl border border-red-900/20 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-center">
                Express Yourself
              </h3>
              <p className="text-gray-400 text-center">
                Share your thoughts and feelings in a safe, judgment-free space
                with our AI companion.
              </p>
            </div>

            <div className="bg-[#1A0505]/40 backdrop-blur-lg p-8 rounded-2xl border border-red-900/20 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-center">
                Track Progress
              </h3>
              <p className="text-gray-400 text-center">
                Monitor your emotional journey with intuitive insights and
                personalized analytics.
              </p>
            </div>

            <div className="bg-[#1A0505]/40 backdrop-blur-lg p-8 rounded-2xl border border-red-900/20 transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-center">
                Grow Together
              </h3>
              <p className="text-gray-400 text-center">
                Learn and develop coping strategies that evolve with your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0505] via-[#0A0A0A] to-[#0A0A0A] opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 ${meditative.className}`}
            >
              Real Stories, Real Growth
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands who have found clarity and support through their
              journey with SoulSpace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1A0505]/40 backdrop-blur-lg p-8 rounded-2xl border border-red-900/20 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Sarah Mitchell</h4>
                  <p className="text-gray-400">Anxiety Management</p>
                </div>
              </div>
              <blockquote className="text-gray-300 italic">
                "SoulSpace has been transformative. The AI companion helped me
                understand my anxiety triggers and develop effective coping
                strategies. I feel more in control now."
              </blockquote>
            </div>

            <div className="bg-[#1A0505]/40 backdrop-blur-lg p-8 rounded-2xl border border-red-900/20 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-bold text-lg">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">James Thompson</h4>
                  <p className="text-gray-400">Stress Management</p>
                </div>
              </div>
              <blockquote className="text-gray-300 italic">
                "The personalized guidance and support have helped me navigate
                through challenging times. It's like having a supportive friend
                available 24/7."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-red-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/resources"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Mental Health Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Wellness Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/crisis"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Crisis Support
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/team"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/feedback"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-red-900/20 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} SoulSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
