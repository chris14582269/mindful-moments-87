export interface QuizOption {
  id: string;
  label: string;
  score: number;
}

export interface QuizQuestion {
  id: number;
  category: 'physical' | 'lifestyle' | 'social-emotional';
  title: string;
  instruction: string;
  options: QuizOption[];
  multiSelect?: boolean;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'physical',
    title: 'Blood pressure',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'bp-1', label: 'I know my blood pressure is < 130/80 mmHg.', score: 3 },
      { id: 'bp-2', label: 'I know my blood pressure is < 140/90 mmHg.', score: 2 },
      { id: 'bp-3', label: "A doctor has told me I have high blood pressure, but I'm working on lowering my blood pressure.", score: 1 },
      { id: 'bp-4', label: "A doctor has told me I have high blood pressure and I'm not working on lowering it, or I don't know my blood pressure.", score: 0 },
    ],
  },
  {
    id: 2,
    category: 'physical',
    title: 'Cholesterol',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'ch-1', label: 'I know my cholesterol is under control (< 4mmol/L).', score: 3 },
      { id: 'ch-2', label: "A doctor has told me I have high cholesterol, but I'm working on lowering my cholesterol.", score: 2 },
      { id: 'ch-3', label: "A doctor has told me I have high cholesterol and I'm not working on lowering it.", score: 1 },
      { id: 'ch-4', label: "I don't know my cholesterol.", score: 0 },
    ],
  },
  {
    id: 3,
    category: 'physical',
    title: 'Blood sugar',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'bs-1', label: 'I do not have diabetes.', score: 3 },
      { id: 'bs-2', label: 'I know my blood sugar is under control (HbA1c < 6.5%).', score: 2 },
      { id: 'bs-3', label: "A doctor has told me I have high blood sugar, but I'm working on lowering my blood sugar.", score: 1 },
      { id: 'bs-4', label: "I don't know my blood sugar.", score: 0 },
    ],
  },
  {
    id: 4,
    category: 'physical',
    title: 'BMI',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'bmi-1', label: 'My BMI is < 18.5.', score: 2 },
      { id: 'bmi-2', label: 'My BMI is 18.5 - 23.', score: 3 },
      { id: 'bmi-3', label: 'My BMI is 23 - 25.', score: 2 },
      { id: 'bmi-4', label: 'My BMI is > 25.', score: 0 },
    ],
  },
  {
    id: 5,
    category: 'physical',
    title: 'Hearing impairment',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'hear-1', label: 'My hearing (with or without a hearing aid) is excellent or good.', score: 2 },
      { id: 'hear-2', label: 'I have difficulty hearing (with or without a hearing aid).', score: 0 },
    ],
  },
  {
    id: 6,
    category: 'lifestyle',
    title: 'Smoking',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'smoke-1', label: 'I have never smoked / quit smoking.', score: 2 },
      { id: 'smoke-2', label: 'I am a current smoker.', score: 0 },
    ],
  },
  {
    id: 7,
    category: 'lifestyle',
    title: 'Alcohol',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'alc-1', label: 'I have 0-1 alcoholic drinks per day.', score: 2 },
      { id: 'alc-2', label: 'I have 2 or more alcoholic drinks per day.', score: 0 },
    ],
  },
  {
    id: 8,
    category: 'lifestyle',
    title: 'Physical Activity',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'act-1', label: 'On average I perform > 150 minutes of moderate or > 75 minutes of vigorous physical activity per week.', score: 2 },
      { id: 'act-2', label: 'On average I perform < 150 minutes of moderate and < 75 minutes of vigorous physical activity per week.', score: 0 },
    ],
  },
  {
    id: 9,
    category: 'lifestyle',
    title: 'Dietary Habits',
    instruction: 'Please select all the options that fit you.',
    multiSelect: true,
    options: [
      { id: 'diet-1', label: 'Per day, I eat at least 2 servings of fruits and 2 servings of vegetables.', score: 1 },
      { id: 'diet-2', label: 'Per day, less than 30% of my food intake comes from saturated fats.', score: 1 },
      { id: 'diet-3', label: 'Per day, I eat less than 5g (1 teaspoon) of salt.', score: 1 },
      { id: 'diet-4', label: 'Per day, less than 10% of my calories come from sugars.', score: 1 },
    ],
  },
  {
    id: 10,
    category: 'lifestyle',
    title: 'Sleep',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'sleep-1', label: "I usually sleep between 6-8 hours without problems and I don't snore.", score: 2 },
      { id: 'sleep-2', label: 'I usually sleep < 6 or > 8 hours, have problems and/or snore.', score: 0 },
    ],
  },
  {
    id: 11,
    category: 'social-emotional',
    title: 'Stress',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'stress-1', label: 'Manageable levels of stress rarely make it difficult to function.', score: 2 },
      { id: 'stress-2', label: 'Moderate levels of stress occasionally make it difficult to function.', score: 1 },
      { id: 'stress-3', label: 'High levels of stress often make it difficult to function.', score: 0 },
    ],
  },
  {
    id: 12,
    category: 'social-emotional',
    title: 'Social engagement',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'social-1', label: 'I have > 3 friends or relatives I see or hear from at least once a month, with whom I feel comfortable talking about private matters and whom I can call upon for help.', score: 2 },
      { id: 'social-2', label: 'I have 3 or less friends or relatives I see or hear from at least once a month, with whom I feel comfortable talking about private matters and whom I can call upon for help.', score: 0 },
    ],
  },
  {
    id: 13,
    category: 'social-emotional',
    title: 'Purpose in life',
    instruction: 'Please select the option that best fits you.',
    options: [
      { id: 'purpose-1', label: 'I generally feel that my life has meaning and/or purpose.', score: 2 },
      { id: 'purpose-2', label: 'I often struggle to find value or purpose in my life.', score: 0 },
    ],
  },
];

export const maxScoreByCategory = {
  physical: 14, // 3+3+3+3+2
  lifestyle: 12, // 2+2+2+4+2
  'social-emotional': 6, // 2+2+2
};

export const totalMaxScore = 32;
