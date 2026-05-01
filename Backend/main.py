from fastapi import FastAPI
 
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/n8n/Endpoint/Placeholder")
def process_n8n_data():
    # Placeholder for processing data from n8n
    return {"message": "Data processed successfully"}