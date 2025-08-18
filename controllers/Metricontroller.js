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
        const metrics = await Metrics.find().limit(20);
        if (metrics.length === 0) {
            return res.status(404).json({ message: "No metrics found." });
        }
        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const deleteMetric = async (req, res) => {
  try {
    const { region, date } = req.params;

    // Normalize date to match documents on the specified day
    const dayStart = new Date(date);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setUTCHours(23, 59, 59, 999);

    // Find and delete the metric by region and date range
    const deletedMetric = await Metrics.findOneAndDelete({
      region,
      date: { $gte: dayStart, $lte: dayEnd },
    });

    if (!deletedMetric) {
      return res.status(404).json({ message: "Metric not found." });
    }

    res.status(200).json({ message: "Metric deleted successfully." });
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
      {
        $group: {
          _id: "$region",
          avgHospitalVisits: { $avg: "$health.hospital_visits" }
        }
      },
      { $match: { avgHospitalVisits: { $gt: 10 } } }
    ]);
    console.log("Aggregation Result:", highHospitalVisits);
    res.status(200).json(highHospitalVisits);
  } catch (error) {
    console.error("Aggregation Error:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};



// PUT /metrics/:id
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const metric = await Metrics.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!metric) {
      return res.status(404).json({ message: "Metric not found" });
    }

    res.json(metric);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateByRegionAndDate = async (req, res) => {
  try {
    const { region, date } = req.params;

    // Construct date range for given day
    const dayStart = new Date(date);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setUTCHours(23, 59, 59, 999);

    // Debug logs
    console.log("Region:", region);
    console.log("Date (raw):", date);
    console.log("Day Start:", dayStart);
    console.log("Day End:", dayEnd);
    console.log("Request Body:", req.body);

    // Find metric by region and date within the day
    const updatedMetric = await Metrics.findOneAndUpdate(
      {
        region,
        date: { $gte: dayStart, $lte: dayEnd }
      },
      { $set: req.body },
      { new: true }
    );

    // Log the found document (if any)
    console.log("Updated Metric:", updatedMetric);

    if (!updatedMetric) {
      console.log("Metric not found for the specified region and date.");
      return res.status(404).json({ message: "Metric not found" });
    }

    res.status(200).json(updatedMetric);
  } catch (err) {
    console.error("Error in updateByRegionAndDate:", err.message);
    res.status(500).json({ error: err.message });
  }
};
