import React, { useState } from "react";
import PlaceOnMap from "./placeOnMap";
import PinIcon from "../../assets/icons/pinIcon";

const MinigamePlacer = ({ selectedMinigames = [], handleMinigamesChange }) => {
  const [coordinates, setCoordinates] = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentGameId, setCurrentGameId] = useState(null);

  const updateGameGeometry = (id, lat, lng) => {
    const updatedMinigames = selectedMinigames.map((game) =>
      game._id === id
        ? {
          ...game,
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        }
        : game
    );
    handleMinigamesChange(updatedMinigames);
  };

  const handleCoordinateChange = (id, field, value) => {
    const numericValue = parseFloat(value) || 0;
    setCoordinates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: numericValue,
      },
    }));

    if (field === "lat" || field === "lng") {
      const { lat = 0, lng = 0 } = {
        ...coordinates[id],
        [field]: numericValue,
      };
      updateGameGeometry(id, lat, lng);
    }
  };

  const handlePlaceOnMap = (id) => {
    setCurrentGameId(id);
    setIsMapOpen(true);
  };

  const handleConfirmLocation = (position) => {
    const { lat, lng } = position;

    setCoordinates((prev) => ({
      ...prev,
      [currentGameId]: { lat, lng },
    }));

    updateGameGeometry(currentGameId, lat, lng);
    setIsMapOpen(false);
    setCurrentGameId(null);
  };

  const handleCancelLocation = () => {
    setIsMapOpen(false);
    setCurrentGameId(null);
  };

  return (
    <div className="minigame-placer space-y-4">

      {selectedMinigames.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center rounded-md">
          <p className="text-gray-800">Selecciona minijuegos para continuar.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {selectedMinigames.map((minigame) => (
            <li
              key={minigame._id}
              className="rounded flex items-center justify-between border p-4 m-4"
            >
              <div className="w-[15%]">
                <div className="w-24 h-16 bg-[#C8FACC] rounded-lg"></div>
              </div>

              <div className="w-[45%] flex flex-col space-y-1">
                <h3
                  className={`font-semibold text-lg ${!minigame.nombre ? "text-gray-400" : "text-gray-800"}`}
                >
                  {minigame.nombre || "Sin título"}
                </h3>
                <p
                  className={`text-sm ${!minigame.tipo ? "text-gray-400" : "text-gray-600"}`}
                >
                  {minigame.tipo || "Tipo no seleccionado"}
                </p>
                <p
                  className={`text-xs ${!minigame.descripcion ? "text-gray-400" : "text-gray-600"}`}
                >
                  {minigame.descripcion && minigame.descripcion.length > 150
                    ? `${minigame.descripcion.slice(0, 150)}...`
                    : minigame.descripcion || "Sin descripción"}
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <input
                  type="number"
                  placeholder="Latitud"
                  className="p-2 border rounded"
                  value={minigame.geometry?.coordinates?.[1] || ""}
                  onChange={(e) =>
                    handleCoordinateChange(minigame._id, "lat", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Longitud"
                  className="p-2 border rounded"
                  value={minigame.geometry?.coordinates?.[0] || ""}
                  onChange={(e) =>
                    handleCoordinateChange(minigame._id, "lng", e.target.value)
                  }
                />
              </div>

              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => handlePlaceOnMap(minigame._id)}
                  className="h-12 w-12 flex items-center justify-center rounded bg-green-500 text-white"
                >
                  <PinIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isMapOpen && (
        <PlaceOnMap
          initialLat={coordinates[currentGameId]?.lat}
          initialLng={coordinates[currentGameId]?.lng}
          onConfirm={handleConfirmLocation}
          onCancel={handleCancelLocation}
        />
      )}
    </div>
  );
};

export default MinigamePlacer;
