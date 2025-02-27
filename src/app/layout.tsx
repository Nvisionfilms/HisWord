import './globals.css';
import { Inter, Crimson_Text } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const crimson = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson'
});

export const metadata: Metadata = {
  title: 'His Words - Bible Verse Search and Spiritual Guidance',
  description: 'Search for Bible verses by emotion, get spiritual guidance, and save your favorite verses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable}`}>
      <body>
        <AuthProvider>
          {/* Background Pattern */}
          <div 
            className="fixed inset-0 z-[-1] opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a373' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          {/* Main Content */}
          <div className="min-h-screen">
            {children}
          </div>

          {/* Footer */}
          <footer className="border-t border-amber-100 mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-serif text-lg text-amber-800 mb-4">About His Words</h3>
                  <p className="text-amber-700/80">
                    A place to find comfort and guidance through God's word
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-amber-800 mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><a href="/daily-verse" className="nav-link">Daily Verse</a></li>
                    <li><a href="/emotions" className="nav-link">Emotions</a></li>
                    <li><a href="/contact" className="nav-link">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-amber-800 mb-4">Connect</h3>
                  <p className="text-amber-700/80">
                    Share His Words with others
                  </p>
                  <div className="flex gap-4 mt-4">
                    {/* Add social media icons here */}
                  </div>
                </div>
              </div>
            </div>
          </footer>

          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
