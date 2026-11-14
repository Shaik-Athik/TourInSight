const axios = require("axios");

const calculateRoute = async (
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude
) => {
    try {
        const response = await axios.post(
            "https://routes.googleapis.com/directions/v2:computeRoutes",
            {
                origin: {
                    location: {
                        latLng: {
                            latitude: Number(originLatitude),
                            longitude: Number(originLongitude)
                        }
                    }
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: Number(destinationLatitude),
                            longitude: Number(destinationLongitude)
                        }
                    }
                },
                travelMode: "DRIVE",
                routingPreference: "TRAFFIC_AWARE",
                computeAlternativeRoutes: false,
                languageCode: "en-US",
                units: "METRIC"
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key":
                        process.env.GOOGLE_PLACES_API_KEY,
                    "X-Goog-FieldMask":
                        "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline"
                }
            }
        );

        const route = response.data.routes?.[0];

        if (!route) {
            throw new Error("No route found");
        }

        return {
            distanceMeters: route.distanceMeters,
            distanceKm: (route.distanceMeters / 1000).toFixed(2),
            duration: route.duration,
            polyline: route.polyline?.encodedPolyline || null
        };

    } catch (error) {
        console.error(
            "Google Routes API Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

module.exports = {
    calculateRoute
};