"""Customer reviews, transcribed from the Google Business Profile.

Owner responses have been stripped, as have Google UI artifacts
("Local Guide", reaction counts, "... More" truncation markers and photo
captions). Where Google truncated a review mid-sentence the text is cut at the
last complete sentence rather than invented — never put words in a customer's
mouth. `date` values are derived from Google's relative timestamps
("3 months ago") as of 2026-08-31 and are therefore approximate.
"""

REVIEWS = [
    {
        "author": "Maria Caridad Gonzalez",
        "rating": 5,
        "date": "2026-08-24",
        "relative": "1 week ago",
        "text": "Excellent service! They were responsive, professional and did a "
                "fantastic job. The quality was great and everything was completed "
                "in a timely manner. Definitely recommend them!",
        "tags": ["general"],
        "featured": True,
    },
    {
        "author": "Yonisdel Pelaez Gonzalez",
        "rating": 5,
        "date": "2026-08-24",
        "relative": "1 week ago",
        "text": "Great company to work with. They were honest and professional. The "
                "work was done right and the price was fair. I'm very happy with the "
                "results and would definitely recommend Acosta Pro Aluminum Screen.",
        "tags": ["pricing", "general"],
        "featured": True,
    },
    {
        "author": "Yani Gonzalez",
        "rating": 5,
        "date": "2026-08-24",
        "relative": "1 week ago",
        "text": "I had a wonderful experience with Acosta Pro Aluminum & Screen! From "
                "start to finish, they were professional, reliable, and very attentive "
                "to detail. The quality of their work exceeded my expectations.",
        "tags": ["general"],
        "featured": True,
    },
    {
        "author": "Liliana Fundora Gonzalez",
        "rating": 5,
        "date": "2026-08-10",
        "relative": "3 weeks ago",
        "text": "Great experience and very professional team! The best.",
        "tags": ["general"],
        "featured": False,
    },
    {
        "author": "Daniela Romero",
        "rating": 5,
        "date": "2026-08-10",
        "relative": "3 weeks ago",
        "text": "Very happy with the final result. Highly recommended. Everything "
                "looks beautiful!",
        "tags": ["general"],
        "featured": False,
    },
    {
        "author": "Mike Athas",
        "rating": 5,
        "date": "2026-06-30",
        "relative": "2 months ago",
        "text": "Great experience. Highly recommend. Professional and fast service. "
                "Will use again.",
        "tags": ["speed"],
        "featured": True,
    },
    {
        "author": "Yadira Garcia",
        "rating": 5,
        "date": "2026-05-31",
        "relative": "3 months ago",
        "text": "Excellent work and very professional. I loved how my lanai and screen "
                "door turned out. They arrived on time, worked very clean, and were "
                "very friendly. I highly recommend them 100%. I would definitely hire "
                "them again. Thank you Acosta Pro Aluminum Screen LLC for the "
                "excellent service.",
        "tags": ["lanai", "screen-door"],
        "featured": True,
    },
    {
        "author": "Gonzalez Aguila",
        "rating": 5,
        "date": "2026-04-30",
        "relative": "4 months ago",
        "text": "I can't say enough good things about Acosta Pro Aluminum Screen! From "
                "the very beginning, they made me feel confident that I was in the "
                "right hands. Their attention to detail, dedication, and passion for "
                "their work truly stand out.",
        "tags": ["general"],
        "featured": True,
    },
    {
        "author": "Calixto Martinez",
        "rating": 5,
        "date": "2026-04-30",
        "relative": "4 months ago",
        "text": "Amazing experience with Acosta Pro Aluminum Screen! You can truly feel "
                "their dedication and passion in every detail. The quality of their "
                "work exceeded my expectations, and their prices are the best. I'm "
                "extremely happy with the results. Highly recommended!",
        "tags": ["pricing"],
        "featured": True,
    },
    {
        "author": "Mary Horta",
        "rating": 5,
        "date": "2026-03-31",
        "relative": "5 months ago",
        "text": "Excellent service from Acosta Pro Aluminum Screen. They repaired the "
                "screen on my patio quickly and the work came out perfect. Very "
                "professional and reliable. Highly recommended for screen repair and "
                "lanai work.",
        "tags": ["screen-repair", "lanai"],
        "featured": True,
    },
    {
        "author": "Juan Artigas",
        "rating": 5,
        "date": "2026-03-31",
        "relative": "5 months ago",
        "text": "Very professional and knowledgeable with reasonable prices. Will use "
                "them again.",
        "tags": ["pricing"],
        "featured": False,
    },
    {
        "author": "Dulce Maria Gonzalez Rodriguez",
        "rating": 5,
        "date": "2026-03-31",
        "relative": "5 months ago",
        "text": "Great experience with Acosta Pro Aluminum Screen. Very professional, "
                "fast, and high-quality work. Highly recommended!",
        "tags": ["speed"],
        "featured": False,
    },
    {
        "author": "Mariela Horta Acosta",
        "rating": 5,
        "date": "2026-03-31",
        "relative": "5 months ago",
        "text": "Great experience with Acosta Pro Aluminum Screen! Very professional, "
                "fast, and reliable. The quality of the work exceeded my expectations. "
                "Highly recommend.",
        "tags": ["speed"],
        "featured": False,
    },
    {
        "author": "Daliana Castro",
        "rating": 5,
        "date": "2026-03-31",
        "relative": "5 months ago",
        "text": "They do an awesome job!",
        "tags": ["general"],
        "featured": False,
    },
]

REVIEW_COUNT = len(REVIEWS)
RATING_AVG = round(sum(r["rating"] for r in REVIEWS) / REVIEW_COUNT, 1)
