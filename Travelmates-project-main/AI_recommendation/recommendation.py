import pandas as pd


# Load travel data
places = pd.read_csv("places.csv")


def recommend_places(city, interests, budget, days):

    # Convert interests to lowercase
    interests = [x.strip().lower() for x in interests]

    # Filter places
    result = places[
        (places["City"].str.lower() == city.lower()) &
        (places["Category"].str.lower().isin(interests)) &
        (places["Cost"] <= budget)
    ].copy()

    # If no places found
    if result.empty:
        return []

    # Calculate scores
    result["RatingScore"] = result["Rating"] * 10

    result["CostScore"] = (
        (1 - result["Cost"] / budget) * 30
    )

    result["DistanceScore"] = (
        (1 - result["Distance"] / 50) * 20
    )

    # Final recommendation score
    result["Score"] = (
        result["RatingScore"] +
        result["CostScore"] +
        result["DistanceScore"]
    )

    # Sort by highest score
    result = result.sort_values(
        by="Score",
        ascending=False
    )

    # Number of places based on days
    number_of_places = days * 2

    selected_places = result.head(
        number_of_places
    )

    # Create recommendation list
    recommendations = []

    for _, place in selected_places.iterrows():

        recommendations.append({
            "place": place["Place"],
            "city": place["City"],
            "category": place["Category"],
            "cost": float(place["Cost"]),
            "distance": float(place["Distance"]),
            "rating": float(place["Rating"]),
            "score": round(float(place["Score"]), 2)
        })

    return recommendations

if __name__ == "__main__":

    city = input("Enter city: ")

    interest = input(
        "Enter interests (example: History,Nature): "
    )

    interests = interest.split(",")

    budget = float(
        input("Enter budget: ")
    )

    days = int(
        input("Enter number of days: ")
    )

    recommendations = recommend_places(
        city,
        interests,
        budget,
        days
    )

    print("\nYOUR RECOMMENDATIONS")

    if not recommendations:

        print("No suitable places found.")

    else:

        for place in recommendations:

            print(
                place["place"],
                "- ₹", place["cost"],
                "- Distance:", place["distance"], "km",
                "- Rating:", place["rating"],
                "- Score:", place["score"]
            )