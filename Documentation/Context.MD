``` mermaid
flowchart TB
    %% Core System
    System["Investment Recommendation<br>Platform"]

    %% External Entities
    User(("User<br>(Small Investor)"))
    Auth(("Identity Provider<br>(Auth0 / Firebase)"))
    MarketAPI(("External<br>Financial APIs"))
    Email(("Email<br>Service"))

    %% User interactions
    User -->|"Configures portfolio,<br>executes trades"| System
    System -->|"Shows recommendations,<br>prices, & P&L"| User
    
    %% Authentication
    System -->|"Validates credentials"| Auth
    Auth -->|"Auth status"| System

    %% Market Data
    System -->|"Requests market data"| MarketAPI
    MarketAPI -->|"Returns asset data"| System
    
    %% Notifications
    System -->|"Triggers alerts"| Email
    Email -->|"Sends automated emails"| User