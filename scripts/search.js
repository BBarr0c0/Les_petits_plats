class SearchHandler {
    constructor(app) {
        this.app = app;
        this.searchBar = document.getElementById('search');
        this.searchButton = document.querySelector('.search-magnifier');
        this.clearSearchButton = document.getElementById('clear-search');

        // Event listeners for search functionality
        this.searchButton.addEventListener(
            'click', 
            this.onSearch.bind(this)
        );
        this.clearSearchButton.addEventListener(
            'click', 
            this.clearSearch.bind(this)
        );
        this.searchBar.addEventListener(
            'input', 
            this.toggleClearButton.bind(this)
        );
    }

    // Event handler for the search button click
    onSearch() {
        const query = this.searchBar.value.toLowerCase().trim();

        // Only perform the search if the query is at least 3 characters long
        if (query.length < 3) {
            this.app.displayAllRecipes();
            this.app.tagsHandler.updateAvailableTags(this.app.recipes);
            return;
        }

        // Clear active tags before a new search
        this.app.tagsHandler.clearSearchTags();

        this.updateRecipesAndTags(query);
    }

    // Clear the search input and reset the display
    clearSearch() {
        this.searchBar.value = '';
        this.toggleClearButton();
        this.app.tagsHandler.clearSearchTags();
        this.app.displayAllRecipes();
        this.app.tagsHandler.updateAvailableTags(this.app.recipes);
    }

    // Show or hide the clear button based on the search bar content
    toggleClearButton() {
        if (this.searchBar.value) {
            this.clearSearchButton.style.display = 'flex';
        } else {
            this.clearSearchButton.style.display = 'none';
        }
    }

    // Filter recipes and update tags based on the search query
    updateRecipesAndTags(query) {
        const filteredRecipes = this.app.filterRecipesByQueryAndTags(
            query,
            this.app.tagsHandler.activeSearchTags,
        );
        this.app.updateDisplay(filteredRecipes, query);
        this.app.tagsHandler.updateAvailableTags(filteredRecipes);
    }
}

export { SearchHandler };
