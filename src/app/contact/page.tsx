// Replace INSTAGRAM_URL and EMAIL with real values when ready
const INSTAGRAM_URL = "https://instagram.com/carlетoncluбsoccer";
const EMAIL = "clubsoccer@carleton.edu";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact</h1>
      <p className="text-gray-500 mb-12">Get in touch with Carleton Club Soccer.</p>

      <div className="grid sm:grid-cols-2 gap-8">

        {/* Instagram card */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {/* Placeholder image — swap with <Image> when you have a real photo */}
          <div className="aspect-[4/3] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex flex-col items-center justify-center text-white gap-3">
            <InstagramIcon />
            <p className="text-sm font-medium opacity-80 tracking-wide">Photo coming soon</p>
          </div>
          <div className="p-6 bg-white flex flex-col items-center text-center gap-2">
            <p className="font-semibold text-gray-900">Follow Us</p>
            <p className="text-sm text-gray-500">Stay up to date with match highlights and team news.</p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <InstagramIcon />
              Instagram
            </a>
          </div>
        </div>

        {/* Email card */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {/* Placeholder image — swap with <Image> when you have a real photo */}
          <div className="aspect-[4/3] bg-gradient-to-br from-carleton-blue to-blue-900 flex flex-col items-center justify-center text-white gap-3">
            <EmailIcon />
            <p className="text-sm font-medium opacity-80 tracking-wide">Photo coming soon</p>
          </div>
          <div className="p-6 bg-white flex flex-col items-center text-center gap-2">
            <p className="font-semibold text-gray-900">Email Us</p>
            <p className="text-sm text-gray-500">Questions about joining, scheduling, or sponsorship? Reach out directly.</p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-3 inline-flex items-center gap-2 bg-carleton-blue text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <EmailIcon />
              {EMAIL}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
