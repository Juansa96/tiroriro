import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

interface SectionCTAProps {
  to: string;
  label: string;
}

const SectionCTA = ({ to, label }: SectionCTAProps) => (
  <AnimatedSection className="text-center py-10">
    <Link to={to} className="cta-link">
      {label} <ArrowRight size={16} />
    </Link>
  </AnimatedSection>
);

export default SectionCTA;
