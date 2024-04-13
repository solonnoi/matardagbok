import { useState, FormEvent, useEffect } from 'react';
import styles from './Home.module.css'; // Import your CSS module here
import getFoods from './api/foodEntries';
import postFoods from './api/foodEntries';
import { sumNutrientsByDay, FoodEntry } from '../utils/nutritionCalculations';


const Home: React.FC = () => {
  const [foodName, setFoodName] = useState<string>('');
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [foods, setFoods] = useState<Array<any>>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [availableDates, setAvailableDates] = useState<Array<string>>([]);
  const [sumOfKcal, setSumOfKcal] = useState<number>(0);
  const [sumOfProtein, setSumOfProtein] = useState<number>(0);


  useEffect(() => {
    fetchDatesWithEntries();
    if (foods.length!) {
      calculateTotals();
    }
    else {
      setSumOfKcal(0);
      setSumOfProtein(0);
    }
  }, [foods]);

  async function calculateTotals() {
    const totals = sumNutrientsByDay(foods)

    setSumOfKcal(totals[selectedDate].totalCalories);
    setSumOfProtein(totals[selectedDate].totalProtein);
  }

  async function fetchDatesWithEntries() {
    const response = await fetch('/api/foodEntries');

    const data = await response.json();
    setAvailableDates(data);
  }
 

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/foodEntries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName, calories, protein }),
    });
    setFoodName('');
    setCalories(0);
    setProtein(0);
    fetchDatesWithEntries(); // Refresh dates with entries
    getFoodEntries(selectedDate); // Refresh entries for the current date
  }

  async function getFoodEntries(date: string) {
    const response = await fetch(`/api/foodEntries?date=${date}`);
    const data = await response.json();
    setFoods(data);
  }

  useEffect(() => {
    getFoodEntries(selectedDate);
  }, [selectedDate]);

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="Food Name"
          required
          className={styles.input}
        />
        <input
          type="number"
          value={calories || ''}
          onChange={(e) => setCalories(Number(e.target.value))}
          placeholder="Calories"
          required
          className={styles.input}
        />
        <input
          type="number"
          value={protein || ''}
          onChange={(e) => setProtein(Number(e.target.value))}
          placeholder="Protein (g)"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Add Entry</button>
      </form>
      <div className={styles.entriesSection}>
  <h2>Food Entries</h2>
  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className={styles.input}
  />
  <ul>
    {foods.map((food) => (
      <li key={food.id}>
        {food.foodName} - {food.calories} calories, {food.protein}g protein
      </li>
    ))}
  </ul>
  <div>
          <strong>Total Calories:</strong> {sumOfKcal} kcal
          <br/>
          <strong>Total Protein:</strong> {sumOfProtein} g
        </div>

</div>


    </div>
  );
};

export default Home;
