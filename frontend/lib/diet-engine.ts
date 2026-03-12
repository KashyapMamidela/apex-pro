export type BodyAnalysis = {
    bmi: number
    bodyType: 'Skinny' | 'Athletic / Normal' | 'Fat' | 'Obese'
    goal: 'Muscle Gain' | 'Maintenance' | 'Fat Loss'
}

export type UserData = {
    age: number
    height: number
    weight: number
    activityLevel: 'Low' | 'Moderate' | 'High'
    dietType: 'Veg' | 'Non-Veg'
}

export type DietPlan = {
    calories: number
    protein: number
    weeklyPlan: {
        day: number
        breakfast: string
        lunch: string
        snack: string
        dinner: string
    }[]
}

const FOOD_DATABASE = {
    breakfast: {
        veg: [
            'Idli + Sambar',
            'Pesarattu + Peanut Chutney',
            'Ragi Dosa + Paneer',
            'Dosa + Sambar',
            'Upma + Curd',
            'Millet Dosa + Chutney',
            'Vegetable Upma + Paneer',
        ],
        nonVeg: [
            'Idli + Sambar + Eggs',
            'Pesarattu + Egg',
            'Upma + Eggs',
            'Dosa + Egg Curry',
        ],
    },
    lunch: {
        veg: [
            'Rice + Dal + Vegetable',
            'Rice + Paneer Curry',
            'Rice + Rajma',
            'Rice + Chole',
            'Millet Rice + Dal',
        ],
        nonVeg: [
            'Brown Rice + Chicken Curry',
            'Rice + Fish Curry',
            'Rice + Egg Curry',
            'Millet Rice + Chicken Fry',
        ],
    },
    snack: {
        veg: [
            'Sprouts Salad',
            'Roasted Peanuts',
            'Roasted Chana',
            'Banana + Milk',
            'Curd Bowl',
            'Buttermilk',
            'Fruit Bowl',
        ],
        nonVeg: [
            'Boiled Eggs',
            'Egg Whites (4)',
        ],
    },
    dinner: {
        veg: [
            'Vegetable Upma + Paneer',
            'Millet Dosa + Chutney',
            'Rice + Dal',
            'Paneer Curry + Vegetable',
            'Ragi Mudde + Dal',
        ],
        nonVeg: [
            'Ragi Mudde + Chicken Curry',
            'Ragi Mudde + Fish Curry',
            'Rice + Egg Curry',
        ],
    },
}

export function analyzeBody(data: UserData): BodyAnalysis {
    const heightInMeters = data.height / 100
    const bmi = data.weight / (heightInMeters * heightInMeters)

    let bodyType: BodyAnalysis['bodyType']
    let goal: BodyAnalysis['goal']

    if (bmi < 18.5) {
        bodyType = 'Skinny'
        goal = 'Muscle Gain'
    } else if (bmi < 25) {
        bodyType = 'Athletic / Normal'
        goal = 'Maintenance'
    } else if (bmi < 30) {
        bodyType = 'Fat'
        goal = 'Fat Loss'
    } else {
        bodyType = 'Obese'
        goal = 'Fat Loss'
    }

    return { bmi, bodyType, goal }
}

export function calculateTargets(data: UserData, goal: BodyAnalysis['goal']) {
    // BMR = 10 × weight + 6.25 × height − 5 × age + 5
    const bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5

    let calories = bmr
    let proteinFactor = 1.2

    if (goal === 'Muscle Gain') {
        calories = bmr + 400
        proteinFactor = 1.8
    } else if (goal === 'Fat Loss') {
        calories = bmr - 400
        proteinFactor = 1.5
    }

    const protein = data.weight * proteinFactor

    return { calories, protein }
}

export function generateWeeklyDiet(
    userData: UserData,
    goal: BodyAnalysis['goal'],
    weekNumber: number
): DietPlan {
    const { calories, protein } = calculateTargets(userData, goal)

    const weeklyPlan = []
    const isNonVeg = userData.dietType === 'Non-Veg'

    // Weekly Retention Logic: Seed based on weekNumber to rotate patterns
    for (let day = 1; day <= 7; day++) {
        const seed = weekNumber * 7 + day

        const getOption = (options: { veg: string[], nonVeg: string[] }) => {
            const combined = isNonVeg ? [...options.veg, ...options.nonVeg] : options.veg
            return combined[seed % combined.length]
        }

        weeklyPlan.push({
            day,
            breakfast: getOption(FOOD_DATABASE.breakfast),
            lunch: getOption(FOOD_DATABASE.lunch),
            snack: getOption(FOOD_DATABASE.snack),
            dinner: getOption(FOOD_DATABASE.dinner),
        })
    }

    return { calories, protein, weeklyPlan }
}
