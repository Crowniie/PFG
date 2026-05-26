```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Database

    
User->>Frontend: Register(name,email,password)
Frontend->>Database: Insert(user_id,username,email,password)
Database-->>Frontend: ConfirmInsert()
Frontend-->>User: LoginSuccesful - redirect to login 

