import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const LOGO_URL = "https://media.base44.com/images/public/6ab28d95c80fc3641aee9d2d/0e4c11b61_image.png";

export default function BrandMark({ className, to = "/" }) {
  return (
    <Link to={to} aria-label="greenergyX — home" className={cn("flex items-center focus-ring rounded-sm", className)}>
      <img
        src={LOGO_URL}
        alt="greenergyX"
        className="h-8 w-auto select-none md:h-9"
        draggable={false}
      />
    </Link>
  );
}