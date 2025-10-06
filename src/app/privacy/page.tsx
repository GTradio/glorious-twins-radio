"use client";

import Link from "next/link";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 text-white hover:text-emerald-100 transition-colors duration-200 group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-600/30 p-8 md:p-12 space-y-8">
          <div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-1 font-semibold">
              Effective Date:
            </p>
          </div>

          {/* Introduction */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              At Glorious Twins Radio your privacy is important to us. This
              Privacy Policy explains how we collect, use, store, and protect
              your personal information when you use our website and mobile
              application.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing or using our Services, you agree to this Privacy
              Policy. If you do not agree, please discontinue use of our
              Services.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                - Personal Information: Name, email address, phone number, or
                other details you provide when you contact us, subscribe to
                newsletters, participate in contests, or register for events.
              </p>
              <p>
                - Usage Data: Information about how you use our Services, such
                as pages visited, app features used, time spent, and referral
                links.
              </p>
              <p>
                - Device Information: Device type, operating system, browser
                type, IP address, and unique device identifiers.
              </p>
              <p>
                - Location Data (if enabled): Approximate or precise location,
                used to improve streaming services, provide relevant content, or
                show local ads.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                - Provide and improve our radio streaming, website, and app
                features.
              </p>
              <p>
                - Communicate with you, including sending newsletters,
                promotions, or event updates.
              </p>
              <p>
                - Personalize your experience with relevant content and
                advertisements.
              </p>
              <p>
                - Monitor and analyze usage to improve functionality and user
                experience.
              </p>
              <p>
                - Ensure security, prevent fraud, and comply with legal
                obligations.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              3. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Our website may use cookies, web beacons, and similar technologies
              to:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>- Remember user preferences.</p>
              <p>- Analyze traffic and improve performance.</p>
              <p>- Deliver targeted advertisements.</p>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              4. Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may work with trusted third parties such as analytics
              providers, advertising networks, streaming platforms, and payment
              processors. These third parties may collect, use, or store
              information according to their own privacy policies.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              5. Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              We do not sell your personal data. We may share your information
              only in these cases:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>- With service providers who help us operate our Services.</p>
              <p>
                - To comply with legal obligations or law enforcement requests.
              </p>
              <p>
                - To protect the safety, rights, or property of our users,
                staff, or the public.
              </p>
              <p>- With your consent.</p>
            </div>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We use industry-standard security measures to protect your data.
              However, no method of transmission or storage is 100% secure.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              7. Your Privacy Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Depending on your location, you may have rights such as:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>- Accessing the personal information, we hold about you.</p>
              <p>- Requesting corrections or updates to your data.</p>
              <p>- Requesting deletion of your personal information.</p>
              <p>- Opting out of marketing communications.</p>
            </div>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our Services are not directed to children under 13. We do not
              knowingly collect personal information from children.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated "Last Updated" date.
            </p>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy,
              please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                Email: glorioustwinsradio@gmail.com
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Address: Block B, Shop 19, Bashorun Islamic Ultra-Modern
                Complex, Ibadan, Oyo State, Nigeria
              </p>
            </div>
          </div>

          {/* Back to Home Button at Bottom */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/"
              className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
