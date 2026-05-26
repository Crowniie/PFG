```mermaid
    sequenceDiagram
    Actor User
    participan Frontend
    Participant Middleware
    Participant Database
    Participant Alpaca API
    Participant Backend

    note over Middleware: Triggers analysis
    Middleware->>Middleware:Trigger(8PM Eastern coast US)

    note over Middleware, database: User portfolio retrieval
    Middleware->>Database: SELECT all active users
    Database->>Middleware: Return user list(user_ids)

    loop For each user
    Middleware->>: SELECT portfolio assets JOIN assets WHERE portfolio.user_id = user_id
    