from fastapi import FastAPI
from src import env, api

app = FastAPI()
app.include_router(api.router)
