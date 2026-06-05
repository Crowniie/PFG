//User types
export interface User {
    user_id: string;
    email: string;
    name: string;
    notifications_enabled: boolean;
}

//Login types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    user?: User;
    message?: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

//Portfolio types
export type PositionState = "NONE" | "HALF_LONG" |"FULL_LONG";

export interface PortfolioAsset{
    id: string;
    asset_symbol: string;
    target_quantity: number;
    position_state: PositionState;
    current_quantity: number;
    entry_price: number | null;
    last_sell_price: number | null;
}

export interface AddPortfolioRequest{
    user_id: string;
    asset_symbol: string;
    target_quantity: number;
}

//Signal types
export type SignalType = "BUY_50" |"BUY_100" | "SELL_50" | "SELL_100" | "HOLD";

export interface Recommendation{
    id: string;
    asset_symbol: string;
    signal_type: SignalType;
    explanation: string;
    price_at_recommendation: number;
    action_taken: boolean;
    created_at: string;
}

//Asset types
export type AssetType = "STOCK" | "ETF";

export interface Asset{
    symbol: string;
    name: string;
    asset_type: AssetType;
}

