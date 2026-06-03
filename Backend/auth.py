import os
import bcrypt
import httpx
from typing import Optional
from pydantic import HTTPException
from fastapi import BaseModel, EmailStr

#------------------------------Models for athentication------------------------------
class LoginRequest(BaseModel):
    submitted_password:str
    stored_password: str
    


class LoginResponse(BaseModel):
    success: bool
    
#------------------------------Authentication function------------------------------
async def verify_password(submitted_password: str, stored_password: str) -> LoginResponse:
    if not submitted_password or not stored_password:
        return False
    try:
        return(
            bcrypt.checkpw(
                submitted_password.encode("utf-8"),
                stored_password.encode("utf-8")
            )
        )
    except(ValueError, TypeError):
        return False