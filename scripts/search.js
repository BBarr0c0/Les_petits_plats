class SearchHandler {
    constructor(app) {
        this.app = app;
        this.searchBar = document.getElementById('search');
        this.searchButton = document.querySelector('.search-magnifier');
        this.clearSearchButton = document.getElementById('clear-search');

        this.searchButton.addEventListener('click', this.onSearch.bind(this));
        this.clearSearchButton.addEventListener('click', this.clearSearch.bind(this));
        this.searchBar.addEventListener('input', this.toggleClearButton.bind(this));
    }

    // Event handler for search
    onSearch() {
        const query = this.searchBar.value.toLowerCase().trim();

        // Clear active tags before a new search
        this.app.tagsHandler.clearSearchTags();

        const filteredRecipes = this.app.filterRecipesByQueryAndTags(
            query,
            this.app.tagsHandler.activeSearchTags,
        );
        this.app.updateDisplay(filteredRecipes, query);
    }

    clearSearch() {
        this.searchBar.value = '';
        this.toggleClearButton();
        this.app.tagsHandler.clearSearchTags();
        this.app.displayAllRecipes();
    }

    toggleClearButton() {
        if (this.searchBar.value) {
            this.clearSearchButton.style.display = 'flex';
        } else {
            this.clearSearchButton.style.display = 'none';
        }
    }

    updateFilteredRecipes() {
        const query = this.app.searchHandler.searchBar.value
            .toLowerCase()
            .trim();
        const filteredRecipes = this.app.filterRecipesByQueryAndTags(
            query,
            this.app.tagsHandler.activeSearchTags,
        );
        this.app.updateDisplay(filteredRecipes, query);
    }
}

export { SearchHandler };
