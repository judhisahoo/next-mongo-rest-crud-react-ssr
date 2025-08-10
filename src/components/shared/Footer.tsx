// src/components/shared/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} Your App Name. All rights reserved.</p>
      </div>
    </footer>
  );
}
