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
