import tutLogo from "@/assets/tut-logo.svg";

export function TutLogo({ className = "h-12" }: { className?: string }) {
  return (
    <img
      src={tutLogo}
      alt="Tshwane University of Technology"
      className={`w-auto bg-transparent ${className}`}
    />
  );
}
