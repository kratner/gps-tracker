import { useState, useEffect } from "react";
import {
	FaExternalLinkAlt,
	FaClipboard,
	FaSync,
	FaMap,
	FaCopy,
} from "react-icons/fa";

const App: React.FC = () => {
	const [coordinates, setCoordinates] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [refreshInterval, setRefreshInterval] = useState<number>(5000);

	useEffect(() => {
		const watchId = navigator.geolocation.watchPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setCoordinates({ latitude, longitude });
			},
			(error) => {
				console.error("Error getting location:", error);
			},
			{
				maximumAge: 0,
				timeout: 20000,
				enableHighAccuracy: true,
			},
		);

		const intervalId = setInterval(() => {
			refreshCoordinates();
		}, refreshInterval);

		return () => {
			navigator.geolocation.clearWatch(watchId);
			clearInterval(intervalId);
		};
	}, [refreshInterval]);

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
				console.error("Error getting location:", error);
			},
			{
				maximumAge: 0,
				timeout: 20000,
				enableHighAccuracy: true,
			},
		);
	};

	const googleMapsLink = coordinates
		? `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`
		: "";

	return (
		<div className="App">
			<h1>GPS Tracker</h1>
			{coordinates ? (
				<div className="container">
					<p>Latitude: {coordinates.latitude}</p>
					<p>Longitude: {coordinates.longitude}</p>
					<div className="buttons">
						<a
							className="button"
							href={googleMapsLink}
							target="_blank"
							rel="noopener noreferrer"
							title="Open in Google Maps"
						>
							<FaMap />
						</a>
						<button
							onClick={copyToClipboard}
							type="button"
							title="Copy to Clipboard"
						>
							<FaCopy />
						</button>
						<button
							onClick={refreshCoordinates}
							type="button"
							title="Refresh Coordinates"
						>
							<FaSync />
						</button>
					</div>
					<div className="input">
						<label htmlFor="refreshInterval">
							Refresh Interval (ms):
							<input
								type="number"
								id="refreshInterval"
								value={refreshInterval}
								onChange={(e) =>
									setRefreshInterval(Number.parseInt(e.target.value))
								}
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
