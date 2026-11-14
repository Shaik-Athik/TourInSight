const express = require("express");
const cors = require("cors");

const placeRoutes = require("./routes/placeRoutes");
const routeRoutes = require("./routes/routeRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// BASIC TEST
// ===============================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Travelmates Backend is running"
    });
});


// ===============================
// PLACE ROUTES
// ===============================
app.use("/api/places", placeRoutes);


// ===============================
// ROUTE CALCULATION ROUTES
// ===============================
app.use("/api/routes", routeRoutes);


module.exports = app;