const axios = require("axios");

const searchPlaces = async (city) => {
    try {
        const response = await axios.post(
            "https://places.googleapis.com/v1/places:searchText",
            {
                textQuery: `tourist places in ${city}`
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
                    "X-Goog-FieldMask":
                        "places.id,places.displayName,places.formattedAddress,places.location,places.types"
                }
            }
        );

        const places = response.data.places || [];

        return places.map(place => ({
            id: place.id,
            name: place.displayName?.text || "Unknown",
            address: place.formattedAddress || "Address not available",
            latitude: place.location?.latitude || null,
            longitude: place.location?.longitude || null,
            types: place.types || []
        }));

    } catch (error) {
        console.error(
            "Google Places API Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

const getPlaceDetails = async (placeId) => {
    try {
        const response = await axios.get(
            `https://places.googleapis.com/v1/places/${placeId}`,
            {
                headers: {
                    "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
                    "X-Goog-FieldMask":
                        "id,displayName,formattedAddress,location,types"
                }
            }
        );

        return {
            id: response.data.id,
            name: response.data.displayName?.text || "Unknown",
            address:
                response.data.formattedAddress ||
                "Address not available",
            latitude: response.data.location?.latitude || null,
            longitude: response.data.location?.longitude || null,
            types: response.data.types || []
        };

    } catch (error) {
        console.error(
            "Google Place Details Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

module.exports = {
    searchPlaces,
    getPlaceDetails
};