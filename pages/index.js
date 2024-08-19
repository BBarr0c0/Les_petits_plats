import { CardTemplate } from '../scripts/templates/cards.js';
import { recipes } from '../data/recipes.js';
import { SearchHandler } from '../scripts/search.js';
import { TagsHandler } from '../scripts/tags.js';

// Creation of the MenuApp class
class MenuApp {
    constructor() {
        this.recipes = recipes;
        this.sectionMenu = document.querySelector('.section-menu');
        this.noResultsMessage = document.getElementById('no-results-message');
        this.searchQueryElement = document.getElementById('search-query');
        this.recipesCountElement = document.querySelector('.section-tags h3');
        this.templateMenu = new CardTemplate();

        this.init();
    }

    // Initialize method
    async init() {
        this.displayAllRecipes();

        // Create handlers after initialization
        this.searchHandler = new SearchHandler(this);
        this.tagsHandler = new TagsHandler(this);
    }

    // Display all recipes
    displayAllRecipes() {
        this.clearSectionMenu();
        this.recipes.forEach(recipe => {
            this.sectionMenu.appendChild(
                this.templateMenu.getMenuCardDom(recipe)
            );
        });
        this.noResultsMessage.style.display = 'none';
        this.updateRecipesCount(1500);
    }

    // Clear section menu
    clearSectionMenu() {
        this.sectionMenu.innerHTML = '';
    }

    // Update display with filtered recipes
    updateDisplay(filteredRecipes, query) {
        this.clearSectionMenu();
        
        if (filteredRecipes.length > 0) {
            // If there are recipes that match the filters
            filteredRecipes.forEach(recipe => {
                this.sectionMenu.appendChild(
                    this.templateMenu.getMenuCardDom(recipe)
                );
            });
            this.noResultsMessage.style.display = 'none';
            this.updateRecipesCount(filteredRecipes.length); // Updates the number of recipes found
        } else {
            // If no recipes match the filters
            this.noResultsMessage.style.display = 'block';
            document.getElementById('search-query').textContent = query; // Update the span with the search query
            this.updateRecipesCount(0); // Updates the number to 0 if no recipe found
        }
    }

    // Update the displayed count of recipes
    updateRecipesCount(count) {
        if (count < 2) {
            this.recipesCountElement.textContent = `${count} recette`;
        } else {
        this.recipesCountElement.textContent = `${count} recettes`;
        }
    }

    // Filter recipes based on the search query and selected tags
    filterRecipesByQueryAndTags(query, tags) {
        query = query.toLowerCase().trim();
    
        return this.recipes.filter(recipe => {
            let recipeText = recipe.name + ' ' + recipe.description + ' ' +
                recipe.ingredients.map(ing => ing.ingredient).join(' ').toLowerCase();
    
            const matchesQuery = recipeText.includes(query);
    
            const matchesTags = tags.every(tag => {
                if (tag.type === 'ingredients') {
                    return recipe.ingredients.some(ing => 
                        ing.ingredient.toLowerCase().includes(tag.value.toLowerCase())
                    );
                } else if (tag.type === 'appliances') {
                    return recipe.appliance.toLowerCase().includes(tag.value.toLowerCase());
                } else if (tag.type === 'utensils') {
                    return recipe.ustensils.some(utensil =>
                        utensil.toLowerCase().includes(tag.value.toLowerCase())
                    );
                }
            });
    
            return matchesQuery && matchesTags;
        });
    }
    
}

// Create instance of MenuApp and initialize
const app = new MenuApp();
