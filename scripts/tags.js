class TagsHandler {
    constructor(app) {
        this.app = app;
        this.searchTagsContainer = document.querySelector('.search-tags-container');
        this.activeSearchTags = [];
        this.init();
    }

    // Initialize the TagsHandler by setting up dropdowns
    init() {
        this.setupDropdowns();
    }

    // Set up event listeners for dropdown buttons
    setupDropdowns() {
        const ingredientsButton = document.getElementById('btn-ingredients');
        const appliancesButton = document.getElementById('btn-appliances');
        const utensilsButton = document.getElementById('btn-utensils');

        // Attach event listeners to each button to toggle corresponding dropdowns
        ingredientsButton.addEventListener('click', () => this.toggleDropdown('ingredients', ingredientsButton));
        appliancesButton.addEventListener('click', () => this.toggleDropdown('appliances', appliancesButton));
        utensilsButton.addEventListener('click', () => this.toggleDropdown('utensils', utensilsButton));
    }

    // Toggle the visibility of the dropdown and populate it if opened
    toggleDropdown(type, button) {
        const dropdown = document.getElementById(`dropdown-${type}`);
        const isOpen = dropdown.classList.toggle('open');
        button.classList.toggle('open', isOpen);

        if (isOpen) {
            this.populateDropdown(type, dropdown);
            this.positionDropdown(dropdown, button);
        } else {
            dropdown.innerHTML = '';
        }
    }

    // Populate the dropdown with items and set up the search bar
    populateDropdown(type, dropdown) {
        // Create a search bar
        dropdown.innerHTML = '<input type="text" class="search-bar" placeholder="Search...">';

        const items = this.getUniqueItems(type);
        const searchBar = dropdown.querySelector('.search-bar');

        // Filter items based on search query
        searchBar.addEventListener('input', () => {
            const query = searchBar.value.toLowerCase().trim();
            this.filterDropdownItems(dropdown, items, query, type);
            searchBar.focus(); // Keep focus on the search bar
        });

        // Initially display all items
        this.filterDropdownItems(dropdown, items, '', type);
    }

    // Filter dropdown items based on the search query
    filterDropdownItems(dropdown, items, query, type) {
        const filteredItems = items.filter(item => item.toLowerCase().includes(query));
        const searchBarHTML = dropdown.querySelector('.search-bar').outerHTML; // Preserve search bar HTML

        dropdown.innerHTML = searchBarHTML; // Reset dropdown with preserved search bar
        const searchBar = dropdown.querySelector('.search-bar');

        // Add filtered items to the dropdown
        filteredItems.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('dropdown-item');
            div.textContent = item;
            div.addEventListener('click', () => this.onDropdownItemClick(type, item));
            dropdown.appendChild(div);
        });

        searchBar.value = query; // Restore search query value
        searchBar.focus();
        searchBar.addEventListener('input', () => {
            const newQuery = searchBar.value.toLowerCase().trim();
            this.filterDropdownItems(dropdown, items, newQuery, type);
        });
    }

    // Position the dropdown relative to the button
    positionDropdown(dropdown, button) {
        const rect = button.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.left = `${rect.left + window.scrollX}px`;
    }

    // Handle click on a dropdown item
    onDropdownItemClick(type, item) {
        this.addSearchTag(type, item);

        let filteredRecipes;

        // Filter recipes based on the type of tag
        if (type === 'ingredients') {
            filteredRecipes = this.app.recipes.filter(recipe =>
                this.activeSearchTags.every(tag => 
                    recipe.ingredients.some(ingredient => ingredient.ingredient === tag.value)
                )
            );
        } else if (type === 'appliances') {
            filteredRecipes = this.app.recipes.filter(recipe => 
                this.activeSearchTags.every(tag => recipe.appliance === tag.value)
            );
        } else if (type === 'utensils') {
            filteredRecipes = this.app.recipes.filter(recipe =>
                this.activeSearchTags.every(tag => recipe.ustensils.includes(tag.value))
            );
        }

        // Update the displayed recipes based on the filtered results
        this.app.updateDisplay(filteredRecipes);
    }

    // Add a search tag to the active tags and update the UI
    addSearchTag(type, value) {
        const tag = { type, value };
        this.activeSearchTags.push(tag);

        const tagElement = document.createElement('div');
        tagElement.classList.add('search-tag');
        tagElement.innerHTML = `<span>${value}</span><button>x</button>`;
        tagElement.querySelector('button').addEventListener('click', () => {
            this.removeSearchTag(tag);
            tagElement.remove();
            this.updateFilteredRecipes();
        });

        this.searchTagsContainer.appendChild(tagElement);
    }

    // Remove a search tag from the active tags
    removeSearchTag(tagToRemove) {
        this.activeSearchTags = this.activeSearchTags.filter(tag => tag !== tagToRemove);
    }

    // Update the displayed recipes based on the active search tags
    updateFilteredRecipes() {
        let filteredRecipes = this.app.recipes;

        this.activeSearchTags.forEach(tag => {
            if (tag.type === 'ingredients') {
                filteredRecipes = filteredRecipes.filter(recipe =>
                    recipe.ingredients.some(ingredient => ingredient.ingredient === tag.value)
                );
            } else if (tag.type === 'appliances') {
                filteredRecipes = filteredRecipes.filter(recipe => recipe.appliance === tag.value);
            } else if (tag.type === 'utensils') {
                filteredRecipes = filteredRecipes.filter(recipe => recipe.ustensils.includes(tag.value));
            }
        });

        this.app.updateDisplay(filteredRecipes);
    }

    // Get unique items for a given type (ingredients, appliances, utensils)
    getUniqueItems(type) {
        const items = new Set();

        this.app.recipes.forEach(recipe => {
            if (type === 'ingredients') {
                recipe.ingredients.forEach(ingredient => items.add(ingredient.ingredient));
            } else if (type === 'appliances') {
                items.add(recipe.appliance);
            } else if (type === 'utensils') {
                recipe.ustensils.forEach(utensil => items.add(utensil));
            }
        });

        return Array.from(items);
    }
}

export { TagsHandler };
