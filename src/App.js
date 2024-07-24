import { useEffect, useState } from 'react';
import nutritionFacts from './nutritionFacts.json'
import './App.css';

function App() {

    const [numberOfServings, setNumberOfServings] = useState(0);
    const [weightPerServing, setWeightPerServing] = useState(33);
    const [sodiumPerServingMg, setSodiumPerServingMg] = useState(0);
    const [bcaaPerServingMg, setBcaaPerServingMg] = useState(0);

    const [ingredients, setIngredients] = useState(null);
    const [nutritionInfo, setNutritionInfo] = useState(null);

    useEffect(() => {
        if (ingredients){
            getNutritionFacts();
        }
    },[ingredients])

    function calculateIngredients() {
        // Define the weight ratios for each ingredient
        const ratioF = 0.8; // f = 0.8m
        const ratioW = 0.42; // w = 0.42(m + f)
        
        // Convert mg to g for s and b
        const sPerServingG = sodiumPerServingMg / 1000; // convert mg to g
        const bPerServingG = bcaaPerServingMg / 1000; // convert mg to g
      
        // Calculate the total weight per serving for m, f, and w only
        const totalOtherWeight = sPerServingG + bPerServingG;
      
        // Adjust weight per serving for m, f, and w
        const adjustedWeightPerServing = weightPerServing - totalOtherWeight;
      
        // Calculate the weight of ingredient m per serving
        const mPerServing = adjustedWeightPerServing / (1 + ratioF + ratioW * (1 + ratioF));
        
        // Calculate the weight of ingredient f per serving
        const fPerServing = ratioF * mPerServing;
        
        // Calculate the weight of ingredient w per serving
        const wPerServing = ratioW * (mPerServing + fPerServing);
      
        // Calculate total weights for the given number of servings
        const totalM = mPerServing * numberOfServings;
        const totalF = fPerServing * numberOfServings;
        const totalW = wPerServing * numberOfServings;
      
        // Calculate total weights for s and b
        const totalS = sPerServingG * numberOfServings;
        const totalB = bPerServingG * numberOfServings;
      
        return {
          maltodextrin: totalM,
          fructose: totalF,
          water: totalW,
          sodium: totalS,
          bcaa: totalB
        };
      }

    function getNutritionFacts() {
        let maltodextrinPerServing = ingredients.maltodextrin / numberOfServings;
        let fructosePerServing = ingredients.fructose / numberOfServings;

        function getFact(category) {

            let maltodextrinFact = maltodextrinPerServing * nutritionFacts.maltodextrin[category];
            let fructoseFact = fructosePerServing * nutritionFacts.fructose[category];

            return Math.round(maltodextrinFact + fructoseFact);
        }

        setNutritionInfo({
            servingSize: weightPerServing,
            calories: getFact("calories"),
            carbohydrates: getFact("carbohydrates"),
            sugars: getFact("sugars"),
            sodium: sodiumPerServingMg
        })
    }
      

    return (
        <>
            <img src="https://jordan-morrison.github.io/gel-calculator/gel.png" alt="a blank energy gel"/>
            <form>
                <label>Number of Servings:</label>
                <input type="number" onChange={(ev) => {setNumberOfServings(ev.target.value)}}/>

                <label>Grams per Serving (default is 33g)</label>
                <input type="number" defaultValue={weightPerServing} onChange={(ev) => {setWeightPerServing(ev.target.value)}}/>

                <label>Milligrams of Sodium per Serving</label>
                <input type="number" onChange={(ev) => {setSodiumPerServingMg(ev.target.value)}}/>

                <label>Milligrams of Amino Acids per Serving</label>
                <input type="number" onChange={(ev) => {setBcaaPerServingMg(ev.target.value)}}/>
            </form>
            <button onClick={() => {setIngredients(calculateIngredients())}}>Calculate</button>
            {ingredients && nutritionInfo &&
                <div>
                    <h1>Ingredients</h1>
                    <p>{+ingredients.maltodextrin.toFixed(2)}g of maltodextrin</p>
                    <p>{+ingredients.fructose.toFixed(2)}g of fructose</p>
                    <p>{+ingredients.water.toFixed(2)}g of water</p>
                    <p>{+ingredients.sodium.toFixed(2)}g of sodium</p>
                    <p>{+ingredients.bcaa.toFixed(2)}g of amino acids</p>

                    <h1>Nutrition Facts</h1>
                    <p>Serving size: 1 Gel ({nutritionInfo.servingSize}g)</p>
                    <p>Calories: {nutritionInfo.calories}</p>
                    <p>Carbohydrates: {nutritionInfo.carbohydrates}g</p>
                    <p>Sugars: {nutritionInfo.sugars}g</p>
                    <p>Sodium: {nutritionInfo.sodium}mg</p>
                </div>
            }
        </>
    );
}

export default App;
