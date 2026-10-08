const q = (question, opts, answer, category, difficulty = "easy") => ({
  q: question,
  opts,
  answer,
  category,
  difficulty,
});

export const fallbackQuestionsByCategory = {
  "general-knowledge": [
    q(
      "Which planet is known as the Red Planet?",
      ["Earth", "Mars", "Jupiter", "Venus"],
      1,
      "General Knowledge",
    ),
    q(
      "What is the capital city of France?",
      ["Madrid", "Rome", "Paris", "Berlin"],
      2,
      "General Knowledge",
    ),
    q(
      "How many continents are there on Earth?",
      ["5", "6", "7", "8"],
      2,
      "General Knowledge",
    ),
    q(
      "Which ocean is the largest?",
      ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      3,
      "General Knowledge",
    ),
    q(
      "Which country is home to the Taj Mahal?",
      ["India", "Egypt", "Turkey", "Greece"],
      0,
      "General Knowledge",
    ),
  ],
  mathematics: [
    q("What is 12 × 8?", ["86", "96", "108", "112"], 1, "Mathematics"),
    q("What is 144 ÷ 12?", ["10", "11", "12", "14"], 2, "Mathematics"),
    q("What is 15% of 200?", ["20", "25", "30", "35"], 2, "Mathematics"),
    q(
      "What is the square root of 81?",
      ["7", "8", "9", "10"],
      2,
      "Mathematics",
    ),
    q("If x + 7 = 15, what is x?", ["6", "7", "8", "9"], 2, "Mathematics"),
  ],
  "science-nature": [
    q(
      "Which gas do plants absorb during photosynthesis?",
      ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
      2,
      "Science & Nature",
    ),
    q(
      "What is the chemical symbol for water?",
      ["CO2", "H2O", "O2", "NaCl"],
      1,
      "Science & Nature",
    ),
    q(
      "Which organ pumps blood around the human body?",
      ["Liver", "Lung", "Heart", "Kidney"],
      2,
      "Science & Nature",
    ),
    q(
      "What force keeps planets in orbit around the Sun?",
      ["Magnetism", "Gravity", "Friction", "Electricity"],
      1,
      "Science & Nature",
    ),
    q(
      "Which part of a plant usually absorbs water from soil?",
      ["Flower", "Leaf", "Root", "Fruit"],
      2,
      "Science & Nature",
    ),
  ],
  history: [
    q(
      "Who was the first President of the United States?",
      [
        "Abraham Lincoln",
        "George Washington",
        "Thomas Jefferson",
        "John Adams",
      ],
      1,
      "History",
    ),
    q(
      "The Taj Mahal was commissioned by which Mughal emperor?",
      ["Akbar", "Shah Jahan", "Babur", "Aurangzeb"],
      1,
      "History",
    ),
    q(
      "Which ancient civilization built the pyramids at Giza?",
      ["Romans", "Greeks", "Egyptians", "Persians"],
      2,
      "History",
    ),
    q(
      "In which year did World War II end?",
      ["1943", "1944", "1945", "1946"],
      2,
      "History",
    ),
    q(
      "Who wrote the Declaration of Independence draft in the United States?",
      [
        "Thomas Jefferson",
        "Benjamin Franklin",
        "George Washington",
        "James Madison",
      ],
      0,
      "History",
    ),
  ],
  geography: [
    q(
      "What is the largest country by land area?",
      ["Canada", "China", "United States", "Russia"],
      3,
      "Geography",
    ),
    q(
      "Which is the longest river in South America?",
      ["Amazon River", "Nile River", "Yangtze River", "Danube River"],
      0,
      "Geography",
    ),
    q(
      "What is the capital of Japan?",
      ["Kyoto", "Osaka", "Tokyo", "Hiroshima"],
      2,
      "Geography",
    ),
    q(
      "Which continent is the Sahara Desert located in?",
      ["Asia", "Africa", "Australia", "South America"],
      1,
      "Geography",
    ),
    q(
      "Which ocean lies between Africa and Australia?",
      ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"],
      2,
      "Geography",
    ),
  ],
  "entertainment-video-games": [
    q(
      "Which company created the Mario video game series?",
      ["Nintendo", "Sega", "Sony", "Valve"],
      0,
      "Entertainment: Video Games",
    ),
    q(
      "Which game features the character Master Chief?",
      ["Halo", "Minecraft", "Fortnite", "Portal"],
      0,
      "Entertainment: Video Games",
    ),
    q(
      "What is the main currency in many Animal Crossing games?",
      ["Bells", "Coins", "Gil", "Rupees"],
      0,
      "Entertainment: Video Games",
    ),
    q(
      "Which game is known for the phrase “Victory Royale”?",
      ["Fortnite", "Valorant", "Overwatch", "Tetris"],
      0,
      "Entertainment: Video Games",
    ),
    q(
      "Which company develops the PlayStation console?",
      ["Microsoft", "Nintendo", "Sony", "Sega"],
      2,
      "Entertainment: Video Games",
    ),
  ],
};

export const fallbackQuestions = Object.values(
  fallbackQuestionsByCategory,
).flat();
