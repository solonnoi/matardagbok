import { useState, FormEvent } from 'react';
import styles from './Home.module.css'; // Import your CSS module here

const Home: React.FC = () => {
  const [foodName, setFoodName] = useState<string>('');
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/foodEntries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName, calories, protein }),
    });
    // Reset form fields
    setFoodName('');
    setCalories(0);
    setProtein(0);
  }

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
    </div>
  );
};

export default Home;
