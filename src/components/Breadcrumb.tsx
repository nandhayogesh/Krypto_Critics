import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)} aria-label="Breadcrumb">
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-auto text-muted-foreground hover:text-foreground"
        onClick={items[0]?.onClick}
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Button>
      
      {items.length > 1 && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          
          {items.slice(1).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              
              {item.isActive ? (
                <span className="font-medium text-foreground truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto font-medium text-muted-foreground hover:text-foreground"
                  onClick={item.onClick}
                >
                  <span className="truncate max-w-[200px]">{item.label}</span>
                </Button>
              )}
            </div>
          ))}
        </>
      )}
    </nav>
  );
}