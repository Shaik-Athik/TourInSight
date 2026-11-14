const { calculateRoute } = require("../services/routesService");

const getRoute = async (req, res) => {
    try {
        const {
            originLat,
            originLng,
            destinationLat,
            destinationLng
        } = req.query;

        if (
            !originLat ||
            !originLng ||
            !destinationLat ||
            !destinationLng
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Origin and destination coordinates are required"
            });
        }

        const route = await calculateRoute(
            originLat,
            originLng,
            destinationLat,
            destinationLng
        );

        res.json({
            success: true,
            data: route
        });

    } catch (error) {
        console.error(
            "Route Controller Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to calculate route"
        });
    }
};

module.exports = {
    getRoute
};