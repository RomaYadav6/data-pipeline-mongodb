import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()
# connect to MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client["Polluion"]       
collection = db["metrics"]      
# reading csv into DataFrame
df = pd.read_csv("data/air_quality_health_dataset.csv")
flat_records = df.to_dict(orient="records")
# transforming flat rows into nested schema
records = [
    {
        "date": rec["date"],
        "region": rec["region"],
        "air_quality": {
            "AQI": rec["AQI"],
            "PM2_5": rec["PM2.5"],   
            "PM10": rec["PM10"],
            "NO2": rec["NO2"],
            "SO2": rec["SO2"],
            "CO": rec["CO"],
            "O3": rec["O3"]
        },
        "weather": {
            "temperature": rec["temperature"],
            "humidity": rec["humidity"],
            "wind_speed": rec["wind_speed"],
            "precipitation": rec["precipitation"]
        },
        "health": {
            "hospital_visits": rec["hospital_visits"],
            "emergency_visits": rec["emergency_visits"],
            "respiratory_admissions": rec["respiratory_admissions"]
        },
        "mobility": {
            "mobility_index": rec["mobility_index"],
            "school_closures": bool(rec["school_closures"]),
            "public_transport_usage": rec["public_transport_usage"],
            "mask_usage_rate": rec["mask_usage_rate"]
        },
        "policy": {
            "lockdown_status": bool(rec["lockdown_status"])
        },
        "economy": {
            "industrial_activity": rec["industrial_activity"],
            "vehicle_count": rec["vehicle_count"],
            "construction_activity": rec["construction_activity"]
        },
        "region_meta": {
            "population_density": rec["population_density"],
            "green_cover_percentage": rec["green_cover_percentage"]
        }
    }
    for rec in flat_records
]
# Insert into MongoDB
if records:
    collection.insert_many(records)
    print(f" Inserted {len(records)} records into MongoDB!")
else:
    print("No records found in CSV")
print("Total docs in collection:", collection.count_documents({}))
