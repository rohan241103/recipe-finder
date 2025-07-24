async function searchRecipe() {
const query = document.getElementById('searchInput').value;
const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
  const data = await response.json();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (data.meals) {
    data.meals.forEach(meal => {
      const mealDiv = document.createElement('div');
      mealDiv.className = 'recipe';

      const shortInstructions = meal.strInstructions.substring(0, 200);
      const isLong = meal.strInstructions.length > 200;

      mealDiv.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        
        <p><strong>Instructions:</strong>
        <span class="short-instructions">${shortInstructions}${isLong ? '...' : ''}</span>
        <span class="full-instructions" style="display:none;">${meal.strInstructions}</span>
        ${isLong ? '<button class="show-more-btn" >Show More</button>' : ''}
    </p>
      `;

      if (isLong) {
        mealDiv.querySelector('.show-more-btn').addEventListener('click', function() {
        localStorage.setItem('selectedMeal', JSON.stringify(meal));
        localStorage.setItem('lastSearch', document.getElementById('searchInput').value); // Save search
        localStorage.setItem('fromRecipe', 'true'); // Set flag
        window.location.href = 'recipe.html';
      });
    }


      resultsDiv.appendChild(mealDiv);
    });
  } else {
    resultsDiv.innerHTML = '<p style="color:#fff;font-size:large">No recipes found.</p>';
  }
}

// Optionally, auto-search if there's a value in the input
window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const lastSearch = localStorage.getItem('lastSearch');
  const fromRecipe = localStorage.getItem('fromRecipe');
  if (input && lastSearch) {
    if (fromRecipe === 'true') {
      input.value = lastSearch;
      searchRecipe();
      localStorage.removeItem('fromRecipe'); // Reset flag
    }
  }
});
