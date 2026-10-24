import { CTA } from "../components/landing/CTA";
import { CheckerShowcase } from "../components/landing/CheckerShowcase";
import { Features } from "../components/landing/Features";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <CheckerShowcase />
      <CTA />
    </>
  );
}