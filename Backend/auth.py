import bcrypt
from pydantic import BaseModel

#------------------------------Models for athentication------------------------------
class LoginRequest(BaseModel):
    submitted_password:str
    stored_password: str
    


class LoginResponse(BaseModel):
    success: bool

class HashPasswordRequest(BaseModel):
    password: str
    
class HashPasswordResponse(BaseModel):
    hash: str
    
#------------------------------Authentication function------------------------------
def verify_password(submitted_password: str, stored_password: str) -> LoginResponse:
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

#------------------------------Hashing function------------------------------
def hash_password(password: str) -> str:

    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    