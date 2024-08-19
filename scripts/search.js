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
        this.searchBar.addEventListener(
            'input', 
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
            // If there are no active tags, all recipes are displayed
            if (this.app.tagsHandler.activeSearchTags.length === 0) {
                this.app.displayAllRecipes();
            } else {
                // Otherwise, we filter the recipes only by active tags
                this.updateRecipesAndTags('');
            }
            this.app.tagsHandler.updateAvailableTags(this.app.recipes);
            return;
        }
        // Otherwise, we continue to filter by text and tags
        this.updateRecipesAndTags(query);
    }

    // Clear the search input and reset the display
    clearSearch() {
        this.searchBar.value = '';
        this.toggleClearButton();

        this.updateRecipesAndTags('');
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
        // see if text search is empty and no tags are active
        if (!query && this.app.tagsHandler.activeSearchTags.length === 0) {
            this.app.displayAllRecipes(); // Display all recipes if no query and no active tags
            this.app.tagsHandler.updateAvailableTags(this.app.recipes); // Update tags for all recipes
            return;
        }

        const filteredRecipes = this.app.filterRecipesByQueryAndTags(
            query,
            this.app.tagsHandler.activeSearchTags,
        );
        this.app.updateDisplay(filteredRecipes, query);
        this.app.tagsHandler.updateAvailableTags(filteredRecipes);
    }
}

export { SearchHandler };
