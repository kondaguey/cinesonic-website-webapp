import React from "react";
import ActorCard from "./ActorCard";

const MainRoster = ({ actors, onSelectActor }) => {
  // 1. Handle "Empty State" (Database is ready, but empty)
  if (!actors || actors.length === 0) {
    return (
      <div className="text-center py-20 opacity-50">
        <p className="text-white font-serif tracking-wide">
          Roster is currently empty.
        </p>
      </div>
    );
  }

  // 2. Render Grid (No loading logic needed here)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {actors.map((actor) => (
        <div
          key={actor.id}
          onClick={() => {
            if (actor.isRevealed) {
              onSelectActor(actor);
            }
          }}
          className={actor.isRevealed ? "cursor-pointer" : "cursor-default"}
        >
          <ActorCard actor={actor} />
        </div>
      ))}
    </div>
  );
};

export default MainRoster;
