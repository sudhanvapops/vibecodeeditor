import { Button } from "@/components/ui/button";
import UserButton from "@/modules/auth/components/UserButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button>
        Get Started
      </Button>
      <UserButton/>
    </div>    
  );
}
