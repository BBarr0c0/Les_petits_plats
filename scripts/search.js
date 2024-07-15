export class SearchHandler {
    constructor(app) {
        this.app = app;
        this.searchBar = document.getElementById('search');
        this.searchButton = document.querySelector('.search-magnifier');

        this.searchButton.addEventListener('click', this.onSearch.bind(this));
    }

    // Event handler for search
    onSearch() {
        const query = this.searchBar.value.toLowerCase().trim();
        if (query.length >= 3) {
            const filteredRecipes = this.searchRecipes(query);
            this.app.updateDisplay(filteredRecipes);
        } else {
            this.app.displayAllRecipes();
        }
    }

    // Search recipes
    searchRecipes(query) {
        const results = [];
        for (const recipe of this.app.recipes) {
            if (this.matchesQuery(recipe, query)) {
                results.push(recipe);
            }
        }
        return results;
    }

    // Check if recipe matches the query
    matchesQuery(recipe, query) {
        const nameMatches = recipe.name.toLowerCase().includes(query);
        const descriptionMatches = recipe.description.toLowerCase().includes(query);
        const ingredientsMatch = recipe.ingredients.some(ingredient => 
            ingredient.ingredient.toLowerCase().includes(query)
        );

        return nameMatches || descriptionMatches || ingredientsMatch;
    }
}