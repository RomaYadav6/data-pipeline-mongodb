import express from "express";
import { 
    create, fetch, update, deleteMetric, 
    getTopRegionsByAQI, getAveragePM25ByRegion, getHighHospitalVisitsRegions 
} from "../controllers/Metricontroller.js";

const router = express.Router();

// CRUD routes
router.post("/", create);
router.get("/", fetch);
router.put("/:id", update);
router.delete("/:id", deleteMetric);

// Advanced query routes
router.get("/top-aqi", getTopRegionsByAQI);
router.get("/avg-pm25", getAveragePM25ByRegion);
router.get("/high-hospital-visits", getHighHospitalVisitsRegions);

export default router;
