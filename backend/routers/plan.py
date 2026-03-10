from fastapi import APIRouter
from models.user import UserProfile

router = APIRouter()

# Placeholder workout templates per goal
WORKOUT_TEMPLATES = {
    "fat_loss": [
        {"day": 1, "name": "Upper Body Cardio Circuit", "exercises": [
            {"name": "Push-ups", "sets": 4, "reps": "15", "rest": "45s"},
            {"name": "Dumbbell Rows", "sets": 4, "reps": "15", "rest": "45s"},
            {"name": "Mountain Climbers", "sets": 3, "reps": "30s", "rest": "30s"},
        ]},
        {"day": 2, "name": "Lower Body HIIT", "exercises": [
            {"name": "Jump Squats", "sets": 4, "reps": "15", "rest": "45s"},
            {"name": "Lunges", "sets": 3, "reps": "12/leg", "rest": "45s"},
            {"name": "Burpees", "sets": 3, "reps": "10", "rest": "60s"},
        ]},
    ],
    "muscle": [
        {"day": 1, "name": "Chest & Triceps", "exercises": [
            {"name": "Bench Press", "sets": 4, "reps": "8-10", "rest": "90s"},
            {"name": "Incline Dumbbell Press", "sets": 3, "reps": "10-12", "rest": "75s"},
            {"name": "Tricep Pushdowns", "sets": 3, "reps": "12-15", "rest": "60s"},
        ]},
        {"day": 2, "name": "Back & Biceps", "exercises": [
            {"name": "Deadlift", "sets": 4, "reps": "6-8", "rest": "120s"},
            {"name": "Barbell Rows", "sets": 4, "reps": "8-10", "rest": "90s"},
            {"name": "Bicep Curls", "sets": 3, "reps": "12-15", "rest": "60s"},
        ]},
        {"day": 3, "name": "Legs & Shoulders", "exercises": [
            {"name": "Squat", "sets": 4, "reps": "8-10", "rest": "120s"},
            {"name": "Romanian Deadlift", "sets": 3, "reps": "10-12", "rest": "90s"},
            {"name": "Overhead Press", "sets": 3, "reps": "10-12", "rest": "75s"},
        ]},
    ],
    "strength": [
        {"day": 1, "name": "Heavy Lower — Squat Focus", "exercises": [
            {"name": "Back Squat", "sets": 5, "reps": "5", "rest": "180s"},
            {"name": "Romanian Deadlift", "sets": 4, "reps": "6", "rest": "150s"},
            {"name": "Leg Press", "sets": 3, "reps": "8", "rest": "120s"},
        ]},
        {"day": 2, "name": "Heavy Upper — Bench Focus", "exercises": [
            {"name": "Bench Press", "sets": 5, "reps": "5", "rest": "180s"},
            {"name": "Barbell Row", "sets": 4, "reps": "6", "rest": "150s"},
            {"name": "Overhead Press", "sets": 3, "reps": "8", "rest": "120s"},
        ]},
        {"day": 3, "name": "Deadlift Focus", "exercises": [
            {"name": "Conventional Deadlift", "sets": 5, "reps": "3-5", "rest": "240s"},
            {"name": "Pull-ups", "sets": 4, "reps": "6-8", "rest": "120s"},
        ]},
    ],
    "fitness": [
        {"day": 1, "name": "Full Body A", "exercises": [
            {"name": "Goblet Squat", "sets": 3, "reps": "12", "rest": "60s"},
            {"name": "Push-ups", "sets": 3, "reps": "15", "rest": "60s"},
            {"name": "Dumbbell Row", "sets": 3, "reps": "12", "rest": "60s"},
        ]},
        {"day": 2, "name": "Cardio & Core", "exercises": [
            {"name": "Treadmill / Run", "sets": 1, "reps": "20 min", "rest": "—"},
            {"name": "Plank", "sets": 3, "reps": "45s", "rest": "30s"},
            {"name": "Crunches", "sets": 3, "reps": "20", "rest": "30s"},
        ]},
    ],
}

NUTRITION_TEMPLATES = {
    "veg": {
        "breakfast": "Idli (4) + sambar + boiled egg whites (3)",
        "lunch": "Brown rice + dal + sabzi + curd",
        "snack": "Banana + peanut butter + almonds",
        "dinner": "2 chapati + paneer bhurji or tofu curry",
    },
    "non_veg": {
        "breakfast": "Oats + boiled eggs (3) + banana",
        "lunch": "Rice + dal + grilled chicken breast (150g)",
        "snack": "Chicken sandwich or Greek yoghurt",
        "dinner": "2 chapati + chicken curry or fish fry + salad",
    },
    "flex": {
        "breakfast": "Eggs / idli / oats — your choice",
        "lunch": "Rice or chapati + protein of choice + dal",
        "snack": "Banana / nuts / Greek yoghurt",
        "dinner": "Chapati + curry (veg or non-veg)",
    },
}

def calc_calories(profile: UserProfile) -> dict:
    """Simple BMR/TDEE placeholder — replace with real formula."""
    base = 1800 if profile.gender == "female" else 2200
    if profile.goal == "fat_loss":
        cal = base - 300
    elif profile.goal in ("muscle", "strength"):
        cal = base + 300
    else:
        cal = base
    return {
        "calories": cal,
        "protein_g":  round(cal * 0.30 / 4),
        "carbs_g":    round(cal * 0.45 / 4),
        "fats_g":     round(cal * 0.25 / 9),
    }


@router.post("/generate-plan")
async def generate_plan(profile: UserProfile):
    days_requested = min(profile.days, 7)
    template = WORKOUT_TEMPLATES.get(profile.goal, WORKOUT_TEMPLATES["fitness"])
    # Cycle template to fill requested days
    workout_plan = [template[i % len(template)] for i in range(days_requested)]

    nutrition_template = NUTRITION_TEMPLATES.get(profile.diet, NUTRITION_TEMPLATES["flex"])
    macros = calc_calories(profile)

    return {
        "workout_plan": workout_plan,
        "nutrition_plan": {
            "meals": nutrition_template,
            "macros": macros,
        },
        "meta": {
            "generated_by": "apex-placeholder-v1",
            "note": "AI-personalized plans via FastAPI coming in v2",
        },
    }
