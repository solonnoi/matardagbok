// utils/nutritionCalculations.ts

export type FoodEntry = {
    dateCreated: string;
    calories: number;
    protein: number;
  };
  
  export type TotalsByDate = {
    [date: string]: {
      totalCalories: number;
      totalProtein: number;
    };
  };
  
  export const sumNutrientsByDay = (foodEntries: FoodEntry[]): TotalsByDate => {
    return foodEntries.reduce((acc, entry) => {
      const date = entry.dateCreated.split('T')[0];
      if (!acc[date]) {
        acc[date] = { totalCalories: 0, totalProtein: 0 };
      }
      acc[date].totalCalories += entry.calories;
      acc[date].totalProtein += entry.protein;
      return acc;
    }, {} as TotalsByDate);
  };
  