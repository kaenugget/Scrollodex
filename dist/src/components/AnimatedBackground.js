"use client";
import { useEffect, useState } from 'react';
export function AnimatedBackground() {
    const [particles, setParticles] = useState([]);
    useEffect(() => {
        // Generate random particles
        const newParticles = [];
        for (let i = 0; i < 20; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 2,
                delay: Math.random() * 15,
            });
        }
        setParticles(newParticles);
    }, []);
    return (<div className="scrollodex-particles">
      {particles.map((particle) => (<div key={particle.id} className="scrollodex-particle" style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
            }}/>))}
    </div>);
}
//# sourceMappingURL=AnimatedBackground.js.map