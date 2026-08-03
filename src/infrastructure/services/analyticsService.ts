import {
  DailyCalorieData,
  WeightProgressData,
  WaterIntakeData,
  MacroDistribution,
  MealFrequencyData,
  HealthScoreSummary,
} from '../../domain/entities/Analytics';

class AnalyticsService {
  getDailyCalorieTrends(): DailyCalorieData[] {
    return [
      { day: 'Mon', consumed: 1820, target: 2000, burned: 420 },
      { day: 'Tue', consumed: 1950, target: 2000, burned: 380 },
      { day: 'Wed', consumed: 1680, target: 2000, burned: 450 },
      { day: 'Thu', consumed: 1740, target: 2000, burned: 510 },
      { day: 'Fri', consumed: 1890, target: 2000, burned: 390 },
      { day: 'Sat', consumed: 2050, target: 2000, burned: 600 },
      { day: 'Sun', consumed: 1720, target: 2000, burned: 350 },
    ];
  }

  getWeightProgressTrends(): WeightProgressData[] {
    return [
      { date: '4 Wks Ago', weightKg: 72.5, targetKg: 65.0 },
      { date: '3 Wks Ago', weightKg: 71.2, targetKg: 65.0 },
      { date: '2 Wks Ago', weightKg: 70.1, targetKg: 65.0 },
      { date: 'Last Week', weightKg: 69.2, targetKg: 65.0 },
      { date: 'Today', weightKg: 68.5, targetKg: 65.0 },
    ];
  }

  getWaterIntakeTrends(): WaterIntakeData[] {
    return [
      { day: 'Mon', intakeMl: 2750, goalMl: 3000 },
      { day: 'Tue', intakeMl: 3000, goalMl: 3000 },
      { day: 'Wed', intakeMl: 2500, goalMl: 3000 },
      { day: 'Thu', intakeMl: 3200, goalMl: 3000 },
      { day: 'Fri', intakeMl: 2900, goalMl: 3000 },
      { day: 'Sat', intakeMl: 3100, goalMl: 3000 },
      { day: 'Sun', intakeMl: 2850, goalMl: 3000 },
    ];
  }

  getMacroDistribution(): MacroDistribution[] {
    return [
      { name: 'Protein', grams: 135, percentage: 30, color: '#10b981' }, // emerald
      { name: 'Carbohydrates', grams: 202, percentage: 45, color: '#14b8a6' }, // teal
      { name: 'Healthy Fats', grams: 50, percentage: 25, color: '#f59e0b' }, // amber
    ];
  }

  getMealFrequencyDistribution(): MealFrequencyData[] {
    return [
      { mealType: 'Breakfast', percentage: 25, count: 28, color: '#10b981' },
      { mealType: 'Lunch', percentage: 35, count: 39, color: '#06b6d4' },
      { mealType: 'Evening Snacks', percentage: 15, count: 17, color: '#8b5cf6' },
      { mealType: 'Dinner', percentage: 25, count: 28, color: '#f43f5e' },
    ];
  }

  getHealthScore(): HealthScoreSummary {
    return {
      overallScore: 92,
      calorieAdherenceScore: 94,
      hydrationScore: 90,
      weightTrendScore: 95,
      bmi: 23.2,
      bmiCategory: 'Normal / Optimal',
    };
  }

  exportAnalyticsCSV(): void {
    const calorieData = this.getDailyCalorieTrends();
    const weightData = this.getWeightProgressTrends();

    let csvContent = '--- DAILY CALORIES REPORT ---\n';
    csvContent += 'Day,Consumed (kcal),Target (kcal),Burned (kcal)\n';
    calorieData.forEach((c) => {
      csvContent += `${c.day},${c.consumed},${c.target},${c.burned}\n`;
    });

    csvContent += '\n--- WEIGHT PROGRESS REPORT ---\n';
    csvContent += 'Date,Current Weight (kg),Target Weight (kg)\n';
    weightData.forEach((w) => {
      csvContent += `${w.date},${w.weightKg},${w.targetKg}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kshetriva-health-analytics-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const analyticsService = new AnalyticsService();
