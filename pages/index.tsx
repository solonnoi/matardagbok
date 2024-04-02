import { useState, FormEvent } from 'react';

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
    // Optionally reset the form or handle the response
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Food Name" required />
        <input type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} placeholder="Calories" required />
        <input type="number" value={protein} onChange={(e) => setProtein(Number(e.target.value))} placeholder="Protein (g)" required />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
};

export default Home;
