/*
  One-off migration for databases created before shipping columns were added.
  Safe to run multiple times only if your SQL Server version supports
  IF NOT EXISTS for columns (SQL Server 2016+). Otherwise, comment out
  clauses that fail after the first run.
*/

-- Warehouses table
IF OBJECT_ID(N'syn_data.warehouses', N'U') IS NULL
BEGIN
    CREATE TABLE [syn_data].[warehouses] (
        [warehouse_id] INT NULL,
        [name] NVARCHAR(200) NULL,
        [city] NVARCHAR(100) NULL,
        [state] NVARCHAR(50) NULL,
        [postal_code] NVARCHAR(20) NULL,
        [latitude] DECIMAL(9, 6) NULL,
        [longitude] DECIMAL(9, 6) NULL,
        [_ingest_timestamp] DATETIME2 NULL
    );
END

-- Customers: coordinates
IF COL_LENGTH('syn_data.customers', 'latitude') IS NULL
    ALTER TABLE [syn_data].[customers] ADD [latitude] DECIMAL(9, 6) NULL;
IF COL_LENGTH('syn_data.customers', 'longitude') IS NULL
    ALTER TABLE [syn_data].[customers] ADD [longitude] DECIMAL(9, 6) NULL;

-- Orders: shipping from warehouse
IF COL_LENGTH('syn_data.orders', 'warehouse_id') IS NULL
    ALTER TABLE [syn_data].[orders] ADD [warehouse_id] INT NULL;
IF COL_LENGTH('syn_data.orders', 'estimated_transit_days') IS NULL
    ALTER TABLE [syn_data].[orders] ADD [estimated_transit_days] INT NULL;
IF COL_LENGTH('syn_data.orders', 'estimated_delivery_date') IS NULL
    ALTER TABLE [syn_data].[orders] ADD [estimated_delivery_date] DATE NULL;
