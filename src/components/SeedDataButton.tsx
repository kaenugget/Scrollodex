"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

interface SeedDataButtonProps {
  userId: Id<"users">;
}

export function SeedDataButton({ userId }: SeedDataButtonProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isGeneratingPets, setIsGeneratingPets] = useState(false);
  const seedData = useMutation(api.seed.seedDemoData);
  const generatePets = useMutation(api.pets.generatePetsForContactsWithoutPets);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      // Seed data with the authenticated user ID
      await seedData({ userId });
      
      alert("Contacts imported successfully! Your contacts are now loaded.");
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("Error importing contacts. Check console for details.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGeneratePets = async () => {
    setIsGeneratingPets(true);
    try {
      const result = await generatePets({ userId });
      
      if (result.scheduled > 0) {
        alert(`Pet generation started for ${result.scheduled} contacts! Check back in a few minutes to see your pets.`);
      } else {
        alert("No contacts found that need pets generated.");
      }
    } catch (error) {
      console.error("Error generating pets:", error);
      alert("Error generating pets. Check console for details.");
    } finally {
      setIsGeneratingPets(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleSeed}
        disabled={isSeeding}
        className="pixel-border bg-green-600 hover:bg-green-700 text-white"
      >
        {isSeeding ? "Importing Contacts..." : "Import Contacts"}
      </Button>
      <Button
        onClick={handleGeneratePets}
        disabled={isGeneratingPets}
        className="pixel-border bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isGeneratingPets ? "Generating Pets..." : "Generate Pets"}
      </Button>
    </div>
  );
}
