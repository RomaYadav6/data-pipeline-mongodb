import mongoose from "mongoose";

const metricsSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },
        region: {
            type: String,
            required: true
        },
        air_quality: {
            AQI: Number,
            PM2_5: Number,
            PM10: Number,
            NO2: Number,
            SO2: Number,
            CO: Number,
            O3: Number
        },
        weather: {
            temperature: Number,
            humidity: Number,
            wind_speed: Number,
            precipitation: Number
        },
        health: {
            hospital_visits: Number,
            emergency_visits: Number,
            respiratory_admissions: Number
        },
        mobility: {
            mobility_index: Number,
            school_closures: Boolean,
            public_transport_usage: Number,
            mask_usage_rate: Number
        },
        policy: {
            lockdown_status: Boolean
        },
        economy: {
            industrial_activity: Number,
            vehicle_count: Number,
            construction_activity: Number
        },
        region_meta: {
            population_density: Number,
            green_cover_percentage: Number
        }
    },
    { timestamps: true }
);


export default mongoose.model("Metrics", metricsSchema);


