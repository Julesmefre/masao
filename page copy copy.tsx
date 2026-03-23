'use client';

export default function LegalsPage() {
  return (
    <div className="min-h-screen bg-[#0c0d12]">
      {/* Hero */}
      <section className="px-6 py-24">
        <h1 className="text-[10vw] font-bold tracking-tighter leading-none">
          LEGALS
        </h1>
      </section>

      {/* Content */}
      <section className="px-6 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Company Info */}
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6 uppercase">Company Information</h2>
            <div className="space-y-4 text-sm opacity-70 leading-relaxed">
              <p><strong className="text-white">Company Name:</strong> First Frame Production</p>
              <p><strong className="text-white">Legal Form:</strong> SAS (Société par Actions Simplifiée)</p>
              <p><strong className="text-white">Registered Office:</strong> 6 rue Jules Simon, 92100 Boulogne-Billancourt, France</p>
              <p><strong className="text-white">SIRET:</strong> XXX XXX XXX XXXXX</p>
              <p><strong className="text-white">VAT Number:</strong> FR XX XXX XXX XXX</p>
              <p><strong className="text-white">Publication Director:</strong> Axel Covo & Rafael Covo</p>
            </div>
          </div>

          {/* Hosting */}
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6 uppercase">Hosting</h2>
            <div className="space-y-4 text-sm opacity-70 leading-relaxed">
              <p>This website is hosted by:</p>
              <p><strong className="text-white">Netlify, Inc.</strong></p>
              <p>44 Montgomery Street, Suite 300<br />San Francisco, California 94104</p>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6 uppercase">Intellectual Property</h2>
            <div className="space-y-4 text-sm opacity-70 leading-relaxed">
              <p>
                All content on this website, including but not limited to text, graphics, logos, images,
                audio clips, video clips, data compilations, and software, is the property of First Frame
                Production or its content suppliers and is protected by French and international copyright laws.
              </p>
              <p>
                The reproduction, representation, modification, publication, adaptation, in whole or in part,
                of the elements of the site, whatever the means or process used, is prohibited without the
                prior written authorization of First Frame Production.
              </p>
            </div>
          </div>

          {/* Data Protection */}
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6 uppercase">Data Protection & GDPR</h2>
            <div className="space-y-4 text-sm opacity-70 leading-relaxed">
              <p>
                In accordance with the General Data Protection Regulation (GDPR) and the French Data
                Protection Act, you have the right to access, rectify, delete, and port your personal data.
              </p>
              <p>
                To exercise these rights, please contact us at:
              </p>
              <p>
                <a href="mailto:contact@firstframe.fr" className="text-white hover:opacity-70 transition-opacity">
                  contact@firstframe.fr
                </a>
              </p>
              <p>
                <strong className="text-white">Data Protection Officer:</strong> First Frame Production<br />
                6 rue Jules Simon, 92100 Boulogne-Billancourt, France
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6 uppercase">Cookies Policy</h2>
            <div className="space-y-4 text-sm opacity-70 leading-relaxed">
              <p>
                This website uses cookies to enhance your browsing experience and to analyze site traffic.
                By continuing to use this site, you consent to the use of cookies.
              </p>
              <h3 className="text-lg font-bold text-white mt-6 mb-3">Types of cookies we use:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">Essential cookies:</strong> Required for the website to function properly.</li>
                <li><strong className="text-white">Analytics cookies:</strong> Help us understand how visitors interact with the website.</li>
                <li><strong className="text-white">Preference cookies:</strong> Remember your settings and preferences.</li>
              </ul>
              <p className="mt-4">
                You can control and manage cookies through your browser settings. Please note that
                disabling cookies may affect the functionality of this website.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6 uppercase">Contact</h2>
            <div className="space-y-4 text-sm opacity-70 leading-relaxed">
              <p>For any questions regarding these legal notices, please contact us:</p>
              <p>
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:contact@firstframe.fr" className="text-white hover:opacity-70 transition-opacity">
                  contact@firstframe.fr
                </a>
              </p>
              <p>
                <strong className="text-white">Address:</strong> 6 rue Jules Simon, 92100 Boulogne-Billancourt, France
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* To Top */}
      <section className="px-6 py-8 border-t border-white/10">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-xs tracking-wider opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transform -rotate-90"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>TO TOP</span>
        </button>
      </section>
    </div>
  );
}
