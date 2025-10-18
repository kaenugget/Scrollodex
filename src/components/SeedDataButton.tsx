"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "../../convex/_generated/dataModel";

interface SeedDataButtonProps {
  userId: Id<"users">;
}

export function SeedDataButton({ userId }: SeedDataButtonProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const seedData = useMutation(api.seed.seedDemoData);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      // Seed data with the authenticated user ID
      await seedData({ userId });
      
      alert("Contacts imported successfully! Your contacts are now loaded.");
    } catch (error) {
      console.error("Error importing contacts:", error);
      alert("Error importing contacts. Check console for details.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button
      onClick={handleSeed}
      disabled={isSeeding}
      className="pixel-border bg-green-600 hover:bg-green-700 text-white"
    >
      {isSeeding ? "Importing Contacts..." : "Import Contacts"}
    </Button>
  );
}
