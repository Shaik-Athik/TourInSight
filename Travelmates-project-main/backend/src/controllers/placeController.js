const placeService = require("../services/placeService");

const searchPlaces = (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({
            success: false,
            message: "City is required"
        });
    }

    const places = placeService.searchPlaces(city);

    res.json({
        success: true,
        city: city,
        data: places
    });
};

module.exports = {
    searchPlaces
};