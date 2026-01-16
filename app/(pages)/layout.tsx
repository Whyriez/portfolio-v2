import React from "react";
import { AppProvider } from "../../context/AppContext"; // Perhatikan path-nya naik 2 level
import Footer from "../../components/layout/Footer";
import Navigation from "../../components/layout/Navigation";
import Sidebar from "../../components/layout/Sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 md:ml-80">
          <div className="glassmorphism main-content m-4 md:m-8 rounded-3xl p-6 md:p-8">
            <Navigation />

            {children}

            <Footer />
          </div>
        </main>
      </div>
    </AppProvider>
  );
}