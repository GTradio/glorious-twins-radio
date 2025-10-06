import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <Image
        src="/presenters/logo.jpg"
        alt="GloriousTwins Logo"
        className="rounded-full shadow-md object-cover"
        fill
        priority
        sizes="48px"
      />
    </div>
  );
};

export default Logo;
