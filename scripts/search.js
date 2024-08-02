class SearchHandler {
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
        for (let i = 0; i < this.app.recipes.length; i++) {
            const recipe = this.app.recipes[i];
            if (this.matchesQuery(recipe, query)) {
                results.push(recipe);
            }
        }
        return results;
    }

    // Check if recipe matches the query
    matchesQuery(recipe, query) {
        let recipeText = recipe.name + ' ' + recipe.description + ' ';
        for (let i = 0; i < recipe.ingredients.length; i++) {
            recipeText += recipe.ingredients[i].ingredient + ' ';
        }
        recipeText = recipeText.toLowerCase();

        return recipeText.includes(query);
    }
}

export { SearchHandler };
