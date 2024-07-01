import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
            </SignedIn>
          </header>
          <main>
            <Toaster/>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
