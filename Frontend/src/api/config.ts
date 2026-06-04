//Base URLs for API middleware endpoints

export const N8N_BASE_URL = "https://pfg1.app.n8n.cloud/webhook";

//Generate full endpoint URLs by appending paths to the base URL
export const Endpoints = {
    LOGIN: `${N8N_BASE_URL}/login`,
    REGISTER: `${N8N_BASE_URL}/register`,
    GET_PORTFOLIO: `${N8N_BASE_URL}/portfolio`,
    ADD_PORTFOLIO: `${N8N_BASE_URL}/portfolio/add`,
    REMOVE_PORTFOLIO: `${N8N_BASE_URL}/portfolio/remove`,
    UPDATE_TARGET: `${N8N_BASE_URL}/portfolio/update-target`,
    GET_SIGNALS_HISTORY: `${N8N_BASE_URL}/signals/history`,
    GET_ASSETS: `${N8N_BASE_URL}/assets`,
} as const;