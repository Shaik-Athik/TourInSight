const express = require("express");

const {
    searchPlaces,
    getPlaceDetails
} = require("../services/placeService");

const router = express.Router();


// ===============================
// SEARCH PLACES BY CITY
// ===============================
router.get("/search", async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({
                success: false,
                message: "City is required"
            });
        }

        const places = await searchPlaces(city);

        res.json({
            success: true,
            city: city,
            data: places
        });

    } catch (error) {
        console.error(
            "Google Places API Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch places"
        });
    }
});


// ===============================
// GET PLACE DETAILS
// ===============================
router.get("/details/:placeId", async (req, res) => {
    try {
        const { placeId } = req.params;

        if (!placeId) {
            return res.status(400).json({
                success: false,
                message: "Place ID is required"
            });
        }

        const place = await getPlaceDetails(placeId);

        res.json({
            success: true,
            data: place
        });

    } catch (error) {
        console.error(
            "Google Place Details Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch place details"
        });
    }
});


module.exports = router;