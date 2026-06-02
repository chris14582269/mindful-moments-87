from app.schemas import FoodItemAnalysis
from app.services.nutrition import build_analysis, calculate_hpb_score, calculate_nutrition, score_category


def test_chicken_rice_generates_singapore_specific_recommendations():
    analysis = build_analysis("I ate chicken rice with chilli sauce")

    assert analysis.foods[0].name == "Chicken Rice"
    assert analysis.nutrition.calories == 620
    assert analysis.confidence > 0.5
    assert any("brown rice" in item.lower() for item in analysis.recommendations)
    assert any("sodium" in item.lower() for item in analysis.recommendations)


def test_hpb_score_rewards_vegetables_wholegrains_and_low_sodium():
    score = calculate_hpb_score(
        fruit_servings=1,
        vegetable_servings=1,
        wholegrain_servings=1,
        sugar_g=3,
        sodium_mg=350,
        protein_g=28,
        fibre_g=9,
    )

    assert score >= 85
    assert score_category(score) == "Excellent"


def test_hpb_score_penalises_high_sodium_and_low_fibre():
    foods = [
        FoodItemAnalysis(
            name="Laksa",
            portion="1 bowl",
            calories=700,
            protein=24,
            carbs=78,
            fat=32,
            fibre=2,
            sodium=1900,
            confidence=0.9,
        )
    ]

    nutrition = calculate_nutrition(foods)

    assert nutrition.sodium == 1900
    assert nutrition.healthy_eating_score < 50
    assert nutrition.category == "Poor"
