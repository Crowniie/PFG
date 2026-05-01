
``` mermaid
flowchart LR
    %% Actors
    User[\"User"/]
    Cron[\"Automated Scheduler"/]
    ExtAPI[\"External Financial APIs"/]
    DB[\Database/]

    %% System Boundary
    subgraph System["Average Price Based Investment Advisor"]
        direction TB
        %% User Use Cases
        UC1(["Configure Portfolio"])
        UC2(["View Asset Prices & Data"])
        UC3(["View Recent Recommendations"])
        UC4(["Access Educational Support"])
        UC18(["Register"])
        UC19(["Login"])
        
        %% Background/System Use Cases
        UC5(["Retrieve Historical & Market Data"])
        UC6(["Calculate Indicators (MA & MACD)"])
        UC7(["Detect Investment Triggers"])
        UC8(["Send Email Notifications"])
        UC9(["Add stock"])
        UC10(["Remove stock"])
        UC11(["Clear portfolio"])
        UC12(["Select timeframe"])
        UC13(["Plot MA"])
        UC14(["View Recommendation"])
        UC15(["Delete Recommendations"])
        UC16(["Accept Reccomendation"])
        UC17(["Reject Reccomedation"])
    end

    %% User Interactions
    User --- UC1
    User --- UC2
    User --- UC3
    User --- UC4
    User --- UC18
    User --- UC19
    %% Background Process Interactions
    Cron --- UC5
    Cron --- UC6
    Cron --- UC7
    Cron --- UC8

    %% External System Interactions
    UC5 --- ExtAPI
    
    %% Actions for portfolio configuration
    UC1 -.->|<< includes >>| UC9
    UC1 -.->|<< includes >>| UC10
    UC1 -.->|<< includes >>| UC11
    
    %% Actions for data viewing
    UC2 -.->|<< includes >>| UC12
    UC2 -.->|<< includes >>| UC13

    %% Actions for reccomendation management 
    UC3 -.->|<< includes >>| UC14
    UC14 -.->|<< includes >>| UC15
    UC14 -.->|<< includes >>| UC16
    UC14 -.->|<< includes >>| UC17

    %% Login and registry to DB
    UC18 --- DB
    UC19 --- DB
