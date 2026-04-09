--------------------------------------------------------------------
-- SCHEMA
--------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS financials_actuals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheme_id TEXT NOT NULL,
    fund TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS schemes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS financials_budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheme_id TEXT NOT NULL,
    fund TEXT NOT NULL,
    category TEXT NOT NULL,
    month TEXT NOT NULL,
    amount REAL NOT NULL
);

--------------------------------------------------------------------
-- SCHEME METADATA
--------------------------------------------------------------------

INSERT OR IGNORE INTO schemes (id, name)
VALUES ('surfers_palms_north', 'Surfers Palms North');

--------------------------------------------------------------------
-- ADMIN FUND: DORMANT R&M CATEGORIES (0.00)
--------------------------------------------------------------------

INSERT INTO financials_actuals (scheme_id, fund, category, date, amount, description) VALUES
('surfers_palms_north','Administrative Fund','R & M - Locks & Keys','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Doors','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Elevators','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Car Park','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Lighting','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Jettys & Moorings','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Paths & Roadways','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Fencing & Gates','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Drains','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Signs','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Gym','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Sauna','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Gardens & Lawns','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - Furniture','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','R & M - BBQ','2025-02-01',0.00,'Dormant category'),
('surfers_palms_north','Administrative Fund','Swimming Pool Power','2025-02-01',0.00,'Dormant category');

--------------------------------------------------------------------
-- ADMIN FUND: WASTE – GENERAL (FEB → JUL)
--------------------------------------------------------------------

INSERT INTO financials_actuals (scheme_id, fund, category, date, amount, description) VALUES
('surfers_palms_north','Administrative Fund','Waste - General','2025-02-01',0.00,'No waste charges'),
('surfers_palms_north','Administrative Fund','Waste - General','2025-03-01',17.90,'General waste charges'),
('surfers_palms_north','Administrative Fund','Waste - General','2025-04-01',191.00,'General waste charges'),
('surfers_palms_north','Administrative Fund','Waste - General','2025-05-01',0.00,'No waste charges'),
('surfers_palms_north','Administrative Fund','Waste - General','2025-06-01',242.55,'General waste charges'),
('surfers_palms_north','Administrative Fund','Waste - General','2025-07-01',118.18,'General waste charges');

--------------------------------------------------------------------
-- ADMIN FUND: STRATAMAX LICENSE FEE (FEB → JUL)
--------------------------------------------------------------------

INSERT INTO financials_actuals (scheme_id, fund, category, date, amount, description) VALUES
('surfers_palms_north','Administrative Fund','Stratamax License Fee','2025-02-01',40.67,'Monthly software licence'),
('surfers_palms_north','Administrative Fund','Stratamax License Fee','2025-03-01',40.67,'Monthly software licence'),
('surfers_palms_north','Administrative Fund','Stratamax License Fee','2025-04-01',40.67,'Monthly software licence'),
('surfers_palms_north','Administrative Fund','Stratamax License Fee','2025-05-01',40.67,'Monthly software licence'),
('surfers_palms_north','Administrative Fund','Stratamax License Fee','2025-06-01',40.67,'Monthly software licence'),
('surfers_palms_north','Administrative Fund','Stratamax License Fee','2025-07-01',40.67,'Monthly software licence');

--------------------------------------------------------------------
-- ADMIN FUND: WORKPLACE HEALTH & SAFETY (FULL YEAR = 0.00)
--------------------------------------------------------------------

INSERT INTO financials_actuals (scheme_id, fund, category, date, amount, description) VALUES
('surfers_palms_north','Administrative Fund','Workplace Health & Safety','2025-02-01',0.00,'No WHS expenses incurred');

--------------------------------------------------------------------
-- ADMIN FUND: BAS PREPARATION FEE (FEB → JUL)
--------------------------------------------------------------------

INSERT INTO financials_actuals (scheme_id, fund, category, date, amount, description) VALUES
('surfers_palms_north','Administrative Fund','BAS Preparation Fee','2025-02-01',310.00,'Quarterly BAS preparation'),
('surfers_palms_north','Administrative Fund','BAS Preparation Fee','2025-03-01',0.00,'No BAS preparation'),
('surfers_palms_north','Administrative Fund','BAS Preparation Fee','2025-04-01',0.00,'No BAS preparation'),
('surfers_palms_north','Administrative Fund','BAS Preparation Fee','2025-05-01',310.00,'Quarterly BAS preparation'),
('surfers_palms_north','Administrative Fund','BAS Preparation Fee','2025-06-01',0.00,'No BAS preparation'),
('surfers_palms_north','Administrative Fund','BAS Preparation Fee','2025-07-01',0.00,'No BAS preparation');

--------------------------------------------------------------------
-- ADMIN FUND: BANK CHARGES (GST INCL) (FEB → JUL)
--------------------------------------------------------------------

INSERT INTO financials_actuals (scheme_id, fund, category, date, amount, description) VALUES
('surfers_palms_north','Administrative Fund','Bank Charges (GST Incl)','2025-02-01',23.32,'Bank fees'),
('surfers_palms_north','Administrative Fund','Bank Charges (GST Incl)','2025-03-01',15.55,'Bank fees'),
('surfers_palms_north','Administrative Fund','Bank Charges (GST Incl)','2025-04-01',4.68,'Bank fees'),
('surfers_palms_north','Administrative Fund','Bank Charges (GST Incl)','2025-05-01',31.95,'Bank fees'),
('surfers_palms_north','Administrative Fund','Bank Charges (GST Incl)','2025-06-01',4.32,'Bank fees'),
('surfers_palms_north','Administrative Fund','Bank Charges (GST Incl)','2025-07-01',9.50,'Bank fees');

--------------------------------------------------------------------
-- END OF MASTER FILE
--------------------------------------------------------------------