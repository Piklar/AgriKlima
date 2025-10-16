# SYSTEM DATA LISTING

Purpose
-------
This document lists and compiles the recommended system-level data categories, fields, formats, and conventions for the AgriKlima project. It serves as a canonical reference for data ingestion, storage, exchange, and QA/QC across modules (field data, sensors, remote sensing, modelling, and UI).

Target branch: feature-justine

Data categories and recommended fields
-----------------------------------
1) Project & Site Metadata
   - project_id (string)
   - site_id (string)
   - site_name (string)
   - owner / organization (string)
   - country, region, administrative levels
   - latitude, longitude (decimal degrees, WGS84)
   - elevation_m (meters)
   - timezone (IANA tz database name)
   - land_use_type (enum: agricultural, pasture, orchard, greenhouse, other)
   - geospatial_boundary (GeoJSON/WKT)
   - created_at, updated_at (ISO 8601 UTC)

2) Crops (per field / plot / season)
   - crop_id, season_id, field_id
   - species_common_name, species_scientific_name (latin)
   - variety / cultivar
   - planting_date, emergence_date, transplant_date
   - sowing_density (plants_per_m2) or seed_rate (kg_ha)
   - expected_maturity_days, expected_harvest_date
   - growth_stage (BBCH or other staging system with code)
   - phenological_notes (free text)
   - management_group (e.g., cash crop, cover crop)

3) Pests & Diseases
   - observation_id, date_time, observer_id
   - pest_disease_name (common and scientific)
   - taxonomy (order/family/genus/species)
   - life_stage (eggs, larvae, adult, spores)
   - severity_score (0-5 or percentage)
   - incidence_percent (percent plants affected)
   - symptoms_description
   - sample_photos (file references or URLs)
   - detection_method (visual, trap, lab test, model)
   - treatment_applied (product, active_ingredient, dose, application_date)

4) Weather & Climate Observations
   - station_id, provider (e.g., station owner or API)
   - timestamp (ISO 8601 UTC)
   - latitude, longitude, elevation (if station differs from site)
   - air_temperature_C (°C)
   - relative_humidity_pct (%)
   - precipitation_mm (mm per interval)
   - wind_speed_m_s (m/s)
   - wind_direction_deg (0-360)
   - solar_radiation_W_m2 or PAR_umol_m2_s
   - atmospheric_pressure_hPa
   - vapor_pressure_deficit_kPa
   - data_quality_flag (enum)
   - aggregation_interval (raw, hourly, daily)

5) Soil & Root Zone
   - sample_id, sample_depth_cm (top-bottom)
   - soil_texture_class (sand/silt/clay %) or triangle class
   - bulk_density_g_cm3
   - soil_moisture_vol_pct or vwc (volumetric water content)
   - soil_water_potential_kPa or matric_potential
   - pH (water)
   - organic_matter_pct or LOI
   - nutrient_concentrations (N_total, NO3_N_mg_kg, NH4_N_mg_kg, P_Olsen_mg_kg, K_mg_kg)
   - cation_exchange_capacity_cmol_kg
   - electrical_conductivity_dS_m
   - sampling_date, lab_name, method_reference

6) Irrigation & Water Management
   - event_id, date_time, method (drip, sprinkler, flood)
   - water_volume_m3 or mm_applied
   - irrigation_duration_min
   - irrigation_source (groundwater, surface, mains, reclaimed)
   - irrigation_efficiency_pct (if measured)

7) Fertilizer & Amendments
   - application_id, date_time, product_name, formulation (e.g., 10-10-10)
   - active_ingredient_N_P_K_kg_ha or kg_per_m3
   - application_rate_kg_ha or l_ha
   - method (broadcast, fertigation, foliar)

8) Management Operations & Events
   - event_id, event_type (planting, tillage, pesticide, harvest, pruning)
   - date_time, operator_id, equipment_id
   - notes, attachments (photos, documents)

9) Remote Sensing & Imagery
   - scene_id, provider (Sentinel-2, Landsat, Planet, UAV)
   - acquisition_date_time (UTC)
   - sensor_name, platform, orbit/pass
   - spatial_resolution_m, spectral_bands_list
   - processing_level (L1C, L2A, Surface reflectance)
   - footprint (GeoJSON)
   - derived_products (NDVI, EVI, LAI, SAVI) with creation_time and parameters
   - file_format (GeoTIFF, COG, NetCDF)

10) Sensors & Telemetry (IoT)
   - sensor_id, sensor_type (temp, RH, soil_moisture, sapflow)
   - manufacturer, model, firmware_version
   - installation_date, calibration_date, calibration_offset
   - measurement_interval_s
   - data_endpoint (MQTT topic, REST URL)
   - battery_status_pct, rssi, signal_quality_flag

11) Phenology & Yield Measurements
   - measurement_id, date_time
   - plant_height_cm, leaf_area_index, biomass_g_m2
   - yield_t_ha (tons per hectare) or kg_per_plot with plot_area_m2 for conversion
   - sampling_method, replicate_number, technician

12) Socioeconomic & Management Context
   - farmer_id (pseudonymized if required), household_info (size, labor)
   - land_tenure_type, field_size_ha, cropping_history (list of previous crops & years)
   - input_costs, yields_market_price_local_currency

13) Geospatial & Mapping Standards
   - coordinate_reference_system (EPSG code, e.g., EPSG:4326)
   - geometry_type (Point, Polygon, MultiPolygon)
   - geometry_properties (area_m2, perimeter_m)

14) Provenance, Source & Licensing
   - source_system (sensor, farmer_app, national_station, satellite)
   - collector/author, contact_email
   - license (e.g., CC-BY-4.0, ODbL)
   - ingestion_timestamp, original_file_hash (SHA256)

15) Data Quality, Validation & Flags
   - quality_flag (OK, suspect, bad, missing)
   - qc_method (range_check, spike_detect, gap_fill)
   - qc_notes, corrected_by, corrected_at
   - missing_value_code (e.g., NA, -9999)

16) Units, Formats & Naming Conventions
   - timestamps: ISO 8601 in UTC (e.g., 2025-10-16T18:45:50Z)
   - numeric formats: use SI units where possible, explicit unit columns when ambiguous
   - file formats: tabular data -> CSV or Parquet; spatial -> GeoJSON, Shapefile, GeoPackage; raster -> GeoTIFF / COG; time series / gridded climatology -> NetCDF
   - reserved column names: id, source, timestamp, latitude, longitude, geometry, value, unit, quality_flag

17) Schema & Example CSV headers
   - Example (crop observations):
     project_id, site_id, field_id, season_id, crop_id, species_scientific_name, variety, planting_date, emergence_date, harvest_date, sowing_density_plants_m2, growth_stage_bbch

   - Example (weather hourly):
     station_id, timestamp_utc, latitude, longitude, elevation_m, temperature_C, relative_humidity_pct, precipitation_mm, wind_speed_m_s, wind_direction_deg, solar_radiation_W_m2, quality_flag

18) API & Access Patterns
   - Recommended REST endpoints and parameters (e.g., /api/v1/weather?site_id=...&start=..&end=..)
   - Authentication: token-based (Bearer), OAuth2 if wider integrations required
   - Pagination, rate limiting, bulk download (ZIP, file manifest)

19) Privacy & Sensitive Data
   - PII or sensitive identifiers for farmers must be pseudonymized or access-restricted
   - store consent_records and data_sharing_agreements linked to data

20) Versioning & Change Management
   - semantic versioning for schema changes (MAJOR.MINOR.PATCH)
   - changelog.md for schema and data pipeline changes
   - record of data migrations and transforms with commit-like messages

21) QA Checklist for Ingest
   - validate required fields present
   - range checks and plausibility checks
   - coordinate and CRS validation
   - duplicate detection and deduplication
   - unit normalization and conversions applied

22) Glossary & References
   - BBCH: Biologische Bundesanstalt, Bundessortenamt und CHemical industry scale for plant phenology
   - NDVI: Normalized Difference Vegetation Index
   - VWC: Volumetric Water Content

Notes and next steps
--------------------
- This file is intended as a starting "system data contract". Teams implementing ingestion, storage, APIs, and UI should review and align on mandatory fields, enumerations, and controlled vocabularies.
- Consider creating a machine-readable schema (JSON Schema, OpenAPI components, or Protobuf) derived from this document to enable automatic validation.
