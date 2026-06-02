from __future__ import annotations

from dataclasses import dataclass

from app.schemas import FoodItemAnalysis, MealAnalysisResponse, NutritionSummary


@dataclass(frozen=True)
class ReferenceFood:
    name: str
    portion: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fibre: float
    sodium: float
    sugar: float = 0
    fruit_servings: float = 0
    vegetable_servings: float = 0
    wholegrain_servings: float = 0
    cooking_method: str | None = None


SINGAPORE_FOOD_DATABASE: dict[str, ReferenceFood] = {
    "chicken rice": ReferenceFood("Chicken Rice", "1 serving", 620, 32, 72, 18, 3, 890, cooking_method="poached"),
    "laksa": ReferenceFood("Laksa", "1 bowl", 700, 24, 78, 32, 4, 1650, 6, cooking_method="coconut gravy"),
    "nasi lemak": ReferenceFood("Nasi Lemak", "1 plate", 760, 25, 86, 34, 5, 1180, 9, cooking_method="fried and coconut rice"),
    "roti prata": ReferenceFood("Roti Prata", "2 pieces", 520, 12, 66, 22, 3, 980, 4, cooking_method="pan fried"),
    "fish soup": ReferenceFood("Fish Soup", "1 bowl", 390, 30, 42, 8, 3, 1050, cooking_method="boiled"),
    "yong tau foo": ReferenceFood("Yong Tau Foo", "1 bowl", 430, 28, 46, 13, 6, 980, cooking_method="soup"),
    "economic rice": ReferenceFood("Economic Rice", "1 plate", 680, 27, 90, 22, 5, 1100, cooking_method="mixed"),
    "brown rice": ReferenceFood("Brown Rice", "0.5 bowl", 110, 3, 23, 1, 2, 5, wholegrain_servings=1),
    "vegetables": ReferenceFood("Non-starchy vegetables", "1 serving", 45, 3, 8, 0, 4, 60, vegetable_servings=1),
    "fruit": ReferenceFood("Fresh fruit", "1 serving", 80, 1, 18, 0, 3, 2, 12, fruit_servings=1),
    "kopi": ReferenceFood("Kopi with sugar", "1 cup", 120, 2, 22, 3, 0, 45, 18),
}

MEAL_SODIUM_TARGET_MG = 700
MEAL_SUGAR_TARGET_G = 12


def identify_foods_from_text(description: str | None) -> list[FoodItemAnalysis]:
    text = (description or "").lower()
    matches: list[FoodItemAnalysis] = []
    for key, ref in SINGAPORE_FOOD_DATABASE.items():
        if key in text:
            matches.append(_to_analysis(ref, confidence=0.82))
    if not matches:
        matches.append(_to_analysis(SINGAPORE_FOOD_DATABASE["chicken rice"], confidence=0.55))
    return matches


def _to_analysis(ref: ReferenceFood, confidence: float) -> FoodItemAnalysis:
    return FoodItemAnalysis(
        name=ref.name,
        portion=ref.portion,
        cooking_method=ref.cooking_method,
        calories=ref.calories,
        protein=ref.protein,
        carbs=ref.carbs,
        fat=ref.fat,
        fibre=ref.fibre,
        sodium=ref.sodium,
        confidence=confidence,
    )


def calculate_nutrition(foods: list[FoodItemAnalysis]) -> NutritionSummary:
    calories = sum(food.calories for food in foods)
    protein = sum(food.protein for food in foods)
    carbs = sum(food.carbs for food in foods)
    fat = sum(food.fat for food in foods)
    fibre = sum(food.fibre for food in foods)
    sodium = sum(food.sodium for food in foods)
    sugar = sum(_lookup(food.name).sugar for food in foods)
    fruit = sum(_lookup(food.name).fruit_servings for food in foods)
    vegetables = sum(_lookup(food.name).vegetable_servings for food in foods)
    wholegrain = sum(_lookup(food.name).wholegrain_servings for food in foods)
    score = calculate_hpb_score(
        fruit_servings=fruit,
        vegetable_servings=vegetables,
        wholegrain_servings=wholegrain,
        sugar_g=sugar,
        sodium_mg=sodium,
        protein_g=protein,
        fibre_g=fibre,
    )
    return NutritionSummary(
        calories=round(calories, 1),
        protein=round(protein, 1),
        carbs=round(carbs, 1),
        fat=round(fat, 1),
        fibre=round(fibre, 1),
        sodium=round(sodium, 1),
        fruit_servings=fruit,
        vegetable_servings=vegetables,
        wholegrain_servings=wholegrain,
        sugar=sugar,
        healthy_eating_score=score,
        category=score_category(score),
    )


def calculate_hpb_score(
    *,
    fruit_servings: float,
    vegetable_servings: float,
    wholegrain_servings: float,
    sugar_g: float,
    sodium_mg: float,
    protein_g: float,
    fibre_g: float,
) -> int:
    # Meal-level proxy for HPB guidance: 2 fruit + 2 vegetable servings/day,
    # choose wholegrains, limit sodium/sugar, and include lean protein.
    vegetable_points = min(vegetable_servings / 1.0, 1) * 20
    fruit_points = min(fruit_servings / 1.0, 1) * 10
    wholegrain_points = min(wholegrain_servings / 1.0, 1) * 15
    sugar_points = max(0, (1 - sugar_g / MEAL_SUGAR_TARGET_G)) * 15
    sodium_points = max(0, (1 - sodium_mg / (MEAL_SODIUM_TARGET_MG * 2))) * 20
    protein_points = min(protein_g / 25, 1) * 10
    fibre_points = min(fibre_g / 8, 1) * 10
    return round(vegetable_points + fruit_points + wholegrain_points + sugar_points + sodium_points + protein_points + fibre_points)


def score_category(score: int) -> str:
    if score >= 85:
        return "Excellent"
    if score >= 70:
        return "Good"
    if score >= 50:
        return "Fair"
    return "Poor"


def generate_recommendations(foods: list[FoodItemAnalysis], nutrition: NutritionSummary) -> list[str]:
    names = " ".join(food.name.lower() for food in foods)
    recommendations: list[str] = []
    if "chicken rice" in names:
        recommendations.extend(["Choose brown rice when available.", "Ask for less dark sauce and chilli to reduce sodium.", "Add a serving of vegetables such as chye sim."])
    if "laksa" in names:
        recommendations.extend(["Take less gravy to lower saturated fat and sodium.", "Add tofu or fish cake for protein without upsizing noodles."])
    if "nasi lemak" in names:
        recommendations.extend(["Share or reduce fried sides for portion control.", "Choose grilled chicken or egg and add cucumber or vegetables."])
    if nutrition.sodium > MEAL_SODIUM_TARGET_MG:
        recommendations.append("This meal is sodium-heavy; balance the rest of the day with lower-sodium options and plain water.")
    if nutrition.vegetable_servings < 1:
        recommendations.append("Target at least one vegetable serving at this meal to support HPB's 2+2 fruit and vegetable guidance.")
    if nutrition.wholegrain_servings < 1:
        recommendations.append("Swap some refined grains for brown rice, wholemeal noodles, oats, or wholemeal bread.")
    return list(dict.fromkeys(recommendations))[:6]


def build_analysis(description: str | None, foods: list[FoodItemAnalysis] | None = None) -> MealAnalysisResponse:
    analysed_foods = foods or identify_foods_from_text(description)
    nutrition = calculate_nutrition(analysed_foods)
    confidence = round(sum(food.confidence for food in analysed_foods) / max(len(analysed_foods), 1), 2)
    return MealAnalysisResponse(
        foods=analysed_foods,
        nutrition=nutrition,
        recommendations=generate_recommendations(analysed_foods, nutrition),
        confidence=confidence,
    )


def _lookup(name: str) -> ReferenceFood:
    normalized = name.lower()
    for key, ref in SINGAPORE_FOOD_DATABASE.items():
        if ref.name.lower() == normalized or key in normalized:
            return ref
    return ReferenceFood(name=name, portion="1 serving", calories=0, protein=0, carbs=0, fat=0, fibre=0, sodium=0)
