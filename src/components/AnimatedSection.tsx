import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Wrapper that simply renders children. Animations on scroll were removed
 * so all content is visible immediately without intersection observers.
 */
const AnimatedSection = ({ children, className = "" }: AnimatedSectionProps) => (
  <div className={className}>{children}</div>
);

export default AnimatedSection;
