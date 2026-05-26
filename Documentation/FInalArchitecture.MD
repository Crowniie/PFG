```mermaid
flowchart TB
    %% Client Tier
    subgraph Client_Tier ["1. Presentation Layer (Frontend)"]
        UI["React Web Application<br/>(User Interface & Data Visualization)"]
    end

    %% Middleware Tier
    subgraph Middleware_Tier ["2. Integration Layer (Middleware)"]
        N8N["N8N Workflow Automation<br/>(API Gateway & Task Scheduler)"]
    end

    %% Backend Tier
    subgraph Backend_Tier ["3. Application Layer (Backend)"]
        PythonAPI["Python API Service<br/>(Business Logic & Authentication)"]
        Model["Trading Model Engine<br/>(Calculates 200-MA & MACD)"]
        PythonAPI <--> Model
    end

    %% Data Tier
    subgraph Data_Tier ["4. Data Layer"]
        DB[(Relational Database<br/>e.g., PostgreSQL / MySQL)]
    end

    %% External APIs
    subgraph External_Services ["5. External Services"]
        FinAPI(("Financial Market APIs<br/>(e.g., AlphaVantage / Yahoo Finance)"))
        Email(("Email Provider<br/>(e.g., SendGrid / SMTP)"))
    end

    %% Inter-Tier Connections
    UI <-->|"1. HTTPS / REST<br/>(Sends credentials & App Data)"| N8N
    
    N8N <-->|"2. Internal REST calls<br/>(Routes requests & Auth)"| PythonAPI
    N8N <-->|"3. Fetch Data (HTTPS)"| FinAPI
    N8N -->|"4. Trigger Alerts (SMTP/API)"| Email
    
    %% Database Connections
    N8N <-->|"SQL / ORM"| DB
    PythonAPI <-->|"SQL / ORM<br/>(Verifies hashed passwords)"| DB