import BookStack from "../components/home/BookStack";
import LandingHero from "../components/home/LandingHero";

export default function HomePage() {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
      <LandingHero />
      <BookStack />
    </main>
  );
}
