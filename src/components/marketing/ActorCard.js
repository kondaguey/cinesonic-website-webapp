import React from "react";

// REMOVED: const MYSTERY_IMAGE = ... (No longer needed)

const ActorCard = ({ actor }) => {
  if (!actor) return null;

  const { name, roleName, headshotUrl, isRevealed } = actor;

  // --- LOGIC: HIDDEN / MYSTERY CARD ---
  // Uses real headshot but heavily frosted so it's unrecognizable.
  if (!isRevealed) {
    return (
      <div className="glass-panel relative w-full h-[450px] rounded-xl overflow-hidden group cursor-default">
        {/* THE REAL HEADSHOT - HEAVILY BLURRED */}
        {/* scale-125 is crucial to hide blurred edges */}
        <img
          src={headshotUrl}
          alt="Mystery Actor"
          className="w-full h-full object-cover scale-125 blur-md opacity-60 pointer-events-none"
        />

        {/* Dark Overlay for contrast */}
        <div className="absolute inset-0 bg-black/50" />

        {/* TEXT CONTENT (Stays Sharp) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
          <h5 className="mb-4 text-[var(--color-gold)] opacity-80 tracking-widest uppercase text-xs">
            New human actor on board!
          </h5>
          <h3 className="italic text-white opacity-90 mb-6 text-xl font-serif tracking-wider">
            Check back soon for the reveal.
          </h3>
          {/* Pulsing Gold Line */}
          <div className="h-[1px] w-16 bg-[var(--color-gold)] shadow-[0_0_15px_var(--color-gold)] animate-pulse" />
        </div>
      </div>
    );
  }

  // --- LOGIC: REVEALED CARD ---
  return (
    <div className="glass-panel relative w-full h-[450px] rounded-xl overflow-hidden group transition-transform duration-500 hover:-translate-y-2">
      <img
        src={headshotUrl}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-midnight)] via-transparent to-transparent opacity-90" />
      <div className="absolute bottom-0 left-0 w-full p-6">
        <h3 className="mb-1 drop-shadow-md text-2xl">{name}</h3>
        {/* Shows 'voice_type' from DB as subtitle */}
        <h5 className="text-[var(--color-gold)] opacity-90">{roleName}</h5>
      </div>
    </div>
  );
};

export default ActorCard;
