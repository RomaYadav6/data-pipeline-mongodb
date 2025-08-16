import Metrics from "../models/Metrics.js";
export const create = async (req, res) => {
    try {
        const metricData = new Metrics(req.body);
        const { region, date } = metricData;
        // Check if a record already exists for the same region & date
        const metricExist = await Metrics.findOne({ region, date });
        if (metricExist) {
            return res.status(400).json({ message: "Metrics for this region and date already exist." });
        }
        const savedMetric = await metricData.save();
        res.status(201).json(savedMetric);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};
export const fetch = async (req, res) => {
    try {
        const metrics = await Metrics.find();
        if (metrics.length === 0) {
            return res.status(404).json({ message: "No metrics found." });
        }
        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};
export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const metricExist = await Metrics.findById(id);
        if (!metricExist) {
            return res.status(404).json({ message: "Metrics not found." });
        }
        const updatedMetric = await Metrics.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedMetric);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};
export const deleteMetric = async (req, res) => {
    try {
        const id = req.params.id;
        const metricExist = await Metrics.findById(id);
        if (!metricExist) {s
            return res.status(404).json({ message: "Metrics not found." });
        }
        await Metrics.findByIdAndDelete(id);
        res.status(200).json({ message: "Metrics deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// metricsController.js
export const getTopRegionsByAQI = async (req, res) => {
    try {
        const top5AQI = await Metrics.aggregate([
            { $sort: { "air_quality.AQI": -1 } },
            { $limit: 5 },
            { $project: { region: 1, "air_quality.AQI": 1 } }
        ]);
        res.status(200).json(top5AQI);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const getAveragePM25ByRegion = async (req, res) => {
    try {
        const avgPM25PerRegion = await Metrics.aggregate([
            { $group: { _id: "$region", avgPM25: { $avg: "$air_quality.PM2_5" } } },
            { $sort: { avgPM25: -1 } }
        ]);
        res.status(200).json(avgPM25PerRegion);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const getHighHospitalVisitsRegions = async (req, res) => {
    try {
        const highHospitalVisits = await Metrics.aggregate([
            { $group: { _id: "$region", avgHospitalVisits: { $avg: "$health.hospital_visits" } } },
            { $match: { avgHospitalVisits: { $gt: 50 } } }
        ]);
        res.status(200).json(highHospitalVisits);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

