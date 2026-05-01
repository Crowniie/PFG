```mermaid
erDiagram
    %% Relationships
    USER ||--o{ PORTFOLIO : "owns"
    USER ||--o{ SIMULATED_TRADE : "executes"
    USER ||--o{ RECOMMENDATION : "receives"
    PORTFOLIO ||--o{ PORTFOLIO_ASSET : "contains"
    ASSET ||--o{ PORTFOLIO_ASSET : "included in"
    ASSET ||--o{ MARKET_DATA : "has history"
    ASSET ||--o{ RECOMMENDATION : "triggers"
    RECOMMENDATION ||--o| SIMULATED_TRADE : "results in"

    %% Tables and Attributes
    USER {
        uuid id PK
        string email
        string password_hash
        string risk_profile
        datetime created_at
    }

    PORTFOLIO {
        uuid id PK
        uuid user_id FK
        string name
        float total_simulated_value
        datetime updated_at
    }

    ASSET {
        string symbol PK
        string name
        string asset_type "Stock, ETF, etc."
    }

    PORTFOLIO_ASSET {
        uuid id PK
        uuid portfolio_id FK
        string asset_symbol FK
        float simulated_quantity
        float average_entry_price
    }

    MARKET_DATA {
        uuid id PK
        string asset_symbol FK
        date timestamp
        float close_price
        float ma_200
        float macd_value
        float macd_signal
    }

    RECOMMENDATION {
        uuid id PK
        uuid user_id FK
        string asset_symbol FK
        string action_type "BUY or SELL"
        string explanation
        boolean is_acted_upon
        datetime created_at
    }

    SIMULATED_TRADE {
        uuid id PK
        uuid user_id FK
        uuid recommendation_id FK
        string asset_symbol FK
        string trade_type "BUY or SELL"
        float execution_price
        float quantity
        datetime executed_at
    }