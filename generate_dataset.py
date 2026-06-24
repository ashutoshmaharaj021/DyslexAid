import pandas as pd
import random

data = []

for _ in range(1000):

    voice_accuracy = random.randint(20, 100)

    letter_score = random.randint(0, 7)

    word_score = random.randint(0, 7)

    voice_score = round(
        (voice_accuracy / 100) * 7
    )

    total = (
        voice_score
        + letter_score
        + word_score
    )

    if total >= 16:
        risk = "Low"

    elif total >= 9:
        risk = "Moderate"

    else:
        risk = "High"

    data.append([
        voice_accuracy,
        letter_score,
        word_score,
        risk
    ])

df = pd.DataFrame(
    data,
    columns=[
        "voiceAccuracy",
        "letterScore",
        "wordScore",
        "risk"
    ]
)

df.to_csv(
    "dyslexaid_dataset.csv",
    index=False
)

print(
    "Dataset Generated Successfully!"
)
print(df.head())