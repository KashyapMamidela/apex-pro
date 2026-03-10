from pydantic import BaseModel
from typing import Optional, Literal

class UserProfile(BaseModel):
    age: int
    gender: Literal["male", "female", "other"]
    goal: Literal["fat_loss", "muscle", "strength", "fitness"]
    level: Literal["beginner", "intermediate", "advanced"]
    bodytype: Literal["ectomorph", "mesomorph", "endomorph"]
    days: int  # workouts per week  (2–7)
    diet: Literal["veg", "non_veg", "flex"]
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
