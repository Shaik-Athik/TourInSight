# Travelmates AI Recommendation Module

This module recommends travel places based on:

- City
- User interests
- Budget
- Number of days
- Rating
- Distance

## How it works

User details
→ Filter places
→ Calculate score
→ Rank places
→ Return recommendations

## Input

The recommendation function accepts:

- city
- interests
- budget
- days

Example:

```python
recommend_places(
    "Hyderabad",
    ["History", "Nature"],
    500,
    3
)