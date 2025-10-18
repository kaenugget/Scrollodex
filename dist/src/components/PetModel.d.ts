import React from 'react';
import { Id } from '../../convex/_generated/dataModel';
interface PetModelProps {
    contactId: Id<"contacts">;
    userId: Id<"users">;
    relationshipStats: {
        connection: number;
        reliability: number;
        communication: number;
        energy: number;
    };
    petData?: {
        petType?: string;
        petName?: string;
        level?: number;
        happiness?: number;
        color?: string;
        pattern?: string;
        accessory?: string;
        happyImageUrl?: string;
        neutralImageUrl?: string;
        sadImageUrl?: string;
        excitedImageUrl?: string;
        happyVideoUrl?: string;
        neutralVideoUrl?: string;
        sadVideoUrl?: string;
        excitedVideoUrl?: string;
        evolutionTokens?: number;
        totalEvolutions?: number;
        lastEvolutionAt?: number;
    };
}
export declare function PetModel({ contactId, userId, relationshipStats, petData }: PetModelProps): React.JSX.Element;
export {};
//# sourceMappingURL=PetModel.d.ts.map