This project is a Football Management System designed using MySQL and PL/SQL.
It manages data related to teams, players, managers, matches, goals, and stadiums.
It follows full database design principles including normalization, transaction management, error handling, and PL/SQL programming.

Folder Structure:-
sql/
├── create_tables.sql      -- All CREATE TABLE statements
├── insert_data.sql         -- Sample data inserts
├── queries.sql             -- Complex SELECTs, JOINs, Subqueries
├── procedures.sql          -- Stored Procedures (with transactions and error handling)
├── functions.sql           -- Functions (e.g., Get Player Goals)
├── triggers.sql            -- Triggers (e.g., Prevent inserting player without a team)
├── transactions.sql        -- Manual transactions (safe inserts)

MySQL (8.x)

PL/SQL (Procedures, Functions, Triggers)

Transaction Management (COMMIT, ROLLBACK, Savepoints)

Error Handling (EXIT Handlers inside procedures)

Next.js (frontend)


