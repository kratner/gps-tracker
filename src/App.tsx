import { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(5000); // Default refresh interval is 5 seconds

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        maximumAge: 0,
        timeout: 20000,
        enableHighAccuracy: true,
      }
    );

    const intervalId = setInterval(() => {
      refreshCoordinates();
    }, refreshInterval);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
    };
  }, [refreshInterval]); // Include refreshInterval in the dependency array

  const copyToClipboard = () => {
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      navigator.clipboard.writeText(`${latitude},${longitude}`);
    }
  };

  const refreshCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        maximumAge: 0,
        timeout: 20000,
        enableHighAccuracy: true,
      }
    );
  };

  return (
    <div className="App">
      <h1>GPS Tracker</h1>
      {coordinates ? (
        <div className="container">
          <p>Latitude: {coordinates.latitude}</p>
          <p>Longitude: {coordinates.longitude}</p>
          <button onClick={copyToClipboard} type="button">
            Copy to Clipboard
          </button>
          <button onClick={refreshCoordinates} type="button">
            Refresh
          </button>
          <div className='input'>
            <label htmlFor="refreshInterval">
              Refresh Interval (ms):
              <input
                type="number"
                id="refreshInterval"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
              />
            </label>
          </div>
        </div>
      ) : (
        <p>Fetching coordinates...</p>
      )}
    </div>
  );
};

export default App;