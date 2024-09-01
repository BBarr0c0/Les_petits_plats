class TagsHandler {
    constructor(app) {
        this.app = app;
        this.searchTagsContainer = document.querySelector('.search-tags-container');
        this.activeSearchTags = [];
        this.init();
        this.filteredRecipes = null;
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
        } else {
            dropdown.innerHTML = '';
        }
    }

    // Populate the dropdown with items and set up the search bar
    populateDropdown(type, dropdown) {
        // Create a search bar inside the dropdown
        dropdown.innerHTML = `
        <div class="search-bar-container">
            <input type="text" class="search-bar">
            <button class="clear-tag">&times;</button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="magnifying-glass">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            </svg>
        </div>
        `;
        
        const items = this.getUniqueItems(type);
        const searchBar = dropdown.querySelector('.search-bar');

        // Filter items based on search query
        searchBar.addEventListener('input', () => {
            const query = searchBar.value.toLowerCase().trim();
            this.filterDropdownItems(dropdown, items, query, type);
            searchBar.focus();
        });

        // Initially display all items in the dropdown
        this.filterDropdownItems(dropdown, items, '', type);
    }

    // Filter dropdown items based on the search query
    filterDropdownItems(dropdown, items, query, type) {
        const filteredItems = items.filter(item => item.toLowerCase().includes(query));
        const searchBarContainerHTML = dropdown.querySelector('.search-bar-container').outerHTML;
    
        dropdown.innerHTML = searchBarContainerHTML; // Reset dropdown with preserved search bar
        const searchBar = dropdown.querySelector('.search-bar');
        const clearButton = dropdown.querySelector('.clear-tag');
    
        // Create a container for the dropdown items
        const dropdownItemContainer = document.createElement('div');
        dropdownItemContainer.classList.add('dropdown-items-container');
    
        // Add filtered items to the dropdown container
        filteredItems.forEach((item) => {
            const div = document.createElement('div');
            div.classList.add('dropdown-item');
            div.textContent = item;
            div.addEventListener('click', () => this.onDropdownItemClick(type, item));
            dropdownItemContainer.appendChild(div);
        });
    
        // Append the container with dropdown items to the dropdown
        dropdown.appendChild(dropdownItemContainer);
    
        searchBar.value = query; // Restore search query value
    
        // Show or hide the clear button based on the search query
        clearButton.classList.toggle('visible', query.length > 0);
    
        searchBar.focus();
    
        // Reattach input event listener
        searchBar.addEventListener('input', () => {
            const newQuery = searchBar.value.toLowerCase();
            this.filterDropdownItems(dropdown, items, newQuery, type);
        });
    
        // Reattach click event listener for clear button
        clearButton.addEventListener('click', () => {
            searchBar.value = '';
            clearButton.classList.remove('visible');
            this.filterDropdownItems(dropdown, items, '', type);
            searchBar.focus();
        });
    }

    // Handle click on a dropdown item
    onDropdownItemClick(type, item) {
        this.addSearchTag(type, item);
        this.toggleDropdown(type, document.getElementById(`btn-${type}`));
        this.app.searchHandler.updateRecipesAndTags(
			this.app.searchHandler.searchBar.value,
		);
    }

    // Add a search tag to the active tags and update the UI
    addSearchTag(type, value) {
        const tag = { type, value };
        this.activeSearchTags.push(tag);

        // Create the tag element in the UI
        const tagElement = document.createElement('div');
        tagElement.classList.add('search-tag');
        tagElement.innerHTML = `<span>${value}</span><button class="close-tags">&times;</button>`;
        tagElement.querySelector('button').addEventListener('click', () => {
            this.removeSearchTag(tag);
            tagElement.remove();
            this.app.searchHandler.updateRecipesAndTags(
                this.app.searchHandler.searchBar.value,
            );
        });

        this.searchTagsContainer.appendChild(tagElement);
    }

    // Remove a search tag from the active tags
    removeSearchTag(tagToRemove) {
        this.activeSearchTags = this.activeSearchTags.filter(tag => tag !== tagToRemove);
        this.updateAvailableTags(this.filteredRecipes);

    // Update recipes and tags using current search
    this.app.searchHandler.updateRecipesAndTags(this.app.searchHandler.searchBar.value);
    }

	// Update the available tags based on the filtered recipes
	updateAvailableTags(filteredRecipes) {
		this.filteredRecipes = filteredRecipes;
		const dropdowns = document.querySelectorAll('.dropdown');
		for (let i = 0; i < dropdowns.length; i++) {
            const dropdown = dropdowns[i];
            if (dropdown.classList.contains('open')) {
                const type = dropdown.id.replace('dropdown-', '');
                this.populateDropdown(type, dropdown);
            }
        }
    }

    // Get unique items for a given type (ingredients, appliances, utensils)
    getUniqueItems(type) {
        const items = new Set();
        const recipes = this.filteredRecipes || this.app.recipes;

    // Collect items based on the type
    recipes.forEach(recipe => {
        if (type === 'ingredients') {
            recipe.ingredients.forEach(ingredient => {
                const normalizedIngredient = this.normalizeString(ingredient.ingredient);
                if (!this.isTagActive(type, normalizedIngredient)) {
                    items.add(normalizedIngredient);
                }
            });
        } else if (type === 'appliances') {
            const normalizedAppliance = this.normalizeString(recipe.appliance);
            if (!this.isTagActive(type, normalizedAppliance)) {
                items.add(normalizedAppliance);
            }
        } else if (type === 'utensils') {
            recipe.ustensils.forEach(utensil => {
                const normalizedUtensil = this.normalizeString(utensil);
                if (!this.isTagActive(type, normalizedUtensil)) {
                    items.add(normalizedUtensil);
                }
            });
        }
    });

        return Array.from(items);
    }

    // Normalize a string by converting it to lowercase and trimming spaces (avoid duplicate), and add a upper case
    normalizeString(str) {
        str = str.toLowerCase().trim();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Check if a tag is already active
    isTagActive(type, value) {
        return this.activeSearchTags.some(tag => tag.type === type && tag.value.toLowerCase().includes(value.toLowerCase()));
    }
}

export { TagsHandler };
