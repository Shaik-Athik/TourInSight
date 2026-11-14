from recommendation import recommend_places


recommendations = recommend_places(
    "Hyderabad",
    ["History", "Nature"],
    500,
    3
)


print("\nTEST RESULTS")

if not recommendations:
    print("No recommendations found.")

else:
    for place in recommendations:
        print(
            place["place"],
            "| Cost: ₹", place["cost"],
            "| Distance:", place["distance"], "km",
            "| Rating:", place["rating"],
            "| Score:", place["score"]
        )