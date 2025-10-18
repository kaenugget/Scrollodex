"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
export function SeedDataButton({ userId }) {
    const [isSeeding, setIsSeeding] = useState(false);
    const seedData = useMutation(api.seed.seedDemoData);
    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            // Seed data with the authenticated user ID
            await seedData({ userId });
            alert("Demo data added successfully! Your contacts are now loaded.");
        }
        catch (error) {
            console.error("Error seeding data:", error);
            alert("Error adding demo data. Check console for details.");
        }
        finally {
            setIsSeeding(false);
        }
    };
    return (<Button onClick={handleSeed} disabled={isSeeding} className="pixel-border bg-green-600 hover:bg-green-700 text-white">
      {isSeeding ? "Adding Demo Data..." : "Add Demo Data"}
    </Button>);
}
//# sourceMappingURL=SeedDataButton.js.map