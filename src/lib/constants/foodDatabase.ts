import { FoodItem } from '../../domain/entities/FoodItem';

export const PRESET_FOOD_DATABASE: FoodItem[] = [
  // Organic Farm Greens & Vegetables
  { id: 'f1', name: 'Organic Fresh Spinach', category: 'Vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: '100g' },
  { id: 'f2', name: 'Heritage Farm Carrots', category: 'Vegetables', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, servingSize: '1 medium (100g)' },
  { id: 'f3', name: 'Red Bell Pepper', category: 'Vegetables', calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3, servingSize: '1 medium (119g)' },
  { id: 'f4', name: 'Broccoli Florets', category: 'Vegetables', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, servingSize: '1 cup (91g)' },
  { id: 'f5', name: 'Avocado', category: 'Vegetables', calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7, servingSize: '1/2 medium (100g)' },
  { id: 'f6', name: 'Kale Salad Greens', category: 'Vegetables', calories: 33, protein: 2.9, carbs: 6.0, fat: 0.6, servingSize: '1 cup (67g)' },

  // Proteins & Meats
  { id: 'f7', name: 'Grilled Wild Salmon', category: 'Proteins', calories: 206, protein: 22.0, carbs: 0.0, fat: 12.3, servingSize: '1 fillet (100g)' },
  { id: 'f8', name: 'Organic Chicken Breast', category: 'Proteins', calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6, servingSize: '1 breast (100g)' },
  { id: 'f9', name: 'Boiled Large Egg', category: 'Proteins', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, servingSize: '1 egg (50g)' },
  { id: 'f10', name: 'Greek Yogurt (Plain 0%)', category: 'Proteins', calories: 100, protein: 17.0, carbs: 4.0, fat: 0.7, servingSize: '1 cup (170g)' },
  { id: 'f11', name: 'Organic Firm Tofu', category: 'Proteins', calories: 144, protein: 17.0, carbs: 3.0, fat: 8.0, servingSize: '100g' },
  { id: 'f12', name: 'Whey Protein Isolate', category: 'Proteins', calories: 120, protein: 25.0, carbs: 2.0, fat: 1.0, servingSize: '1 scoop (30g)' },

  // Grains & Carbs
  { id: 'f13', name: 'Rolled Oats (Oatmeal)', category: 'Grains', calories: 150, protein: 5.0, carbs: 27.0, fat: 2.5, servingSize: '1/2 cup dry (40g)' },
  { id: 'f14', name: 'Cooked Quinoa', category: 'Grains', calories: 222, protein: 8.1, carbs: 39.4, fat: 3.6, servingSize: '1 cup (185g)' },
  { id: 'f15', name: 'Brown Jasmine Rice', category: 'Grains', calories: 216, protein: 5.0, carbs: 45.0, fat: 1.8, servingSize: '1 cup (195g)' },
  { id: 'f16', name: 'Whole Wheat Sourdough Bread', category: 'Grains', calories: 120, protein: 5.0, carbs: 22.0, fat: 1.5, servingSize: '1 slice (45g)' },
  { id: 'f17', name: 'Baked Sweet Potato', category: 'Grains', calories: 103, protein: 2.3, carbs: 23.6, fat: 0.2, servingSize: '1 medium (114g)' },

  // Fruits & Berries
  { id: 'f18', name: 'Organic Blueberries', category: 'Fruits', calories: 84, protein: 1.1, carbs: 21.4, fat: 0.5, servingSize: '1 cup (148g)' },
  { id: 'f19', name: 'Fresh Banana', category: 'Fruits', calories: 105, protein: 1.3, carbs: 27.0, fat: 0.3, servingSize: '1 medium (118g)' },
  { id: 'f20', name: 'Crisp Red Apple', category: 'Fruits', calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3, servingSize: '1 medium (182g)' },
  { id: 'f21', name: 'Fresh Strawberries', category: 'Fruits', calories: 49, protein: 1.0, carbs: 11.7, fat: 0.5, servingSize: '1 cup (152g)' },

  // Healthy Fats & Nuts
  { id: 'f22', name: 'Raw Almonds', category: 'Nuts & Seeds', calories: 164, protein: 6.0, carbs: 6.1, fat: 14.2, servingSize: '1 oz (28g / 23 nuts)' },
  { id: 'f23', name: 'Chia Seeds', category: 'Nuts & Seeds', calories: 138, protein: 4.7, carbs: 11.9, fat: 8.7, servingSize: '1 tbsp (28g)' },
  { id: 'f24', name: 'Cold-Pressed Olive Oil', category: 'Fats', calories: 119, protein: 0.0, carbs: 0.0, fat: 13.5, servingSize: '1 tbsp (14g)' },
  { id: 'f25', name: 'Natural Peanut Butter', category: 'Fats', calories: 190, protein: 8.0, carbs: 7.0, fat: 16.0, servingSize: '2 tbsp (32g)' },
];
