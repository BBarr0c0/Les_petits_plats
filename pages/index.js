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
            for (let i = 0; i < filteredRecipes.length; i++) {
                const recipe = filteredRecipes[i];
                this.sectionMenu.appendChild(
                    this.templateMenu.getMenuCardDom(recipe)
                );
            }
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
        this.recipesCountElement.textContent = `${count} recettes`;
    }

    // Filter recipes based on the search query and selected tags
    filterRecipesByQueryAndTags(query, tags) {
        query = query.toLowerCase().trim();
        const filteredRecipes = [];
    
        for (let i = 0; i < this.recipes.length; i++) {
            const recipe = this.recipes[i];
    
            // Check if the recipe matches the query
            let recipeText = recipe.name + ' ' + recipe.description + ' ';
            for (let j = 0; j < recipe.ingredients.length; j++) {
                recipeText += recipe.ingredients[j].ingredient + ' ';
            }
            recipeText = recipeText.toLowerCase();
    
            const matchesQuery = recipeText.includes(query);
    
            // Check if the recipe matches all selected tags
            let matchesTags = true;
            for (let k = 0; k < tags.length; k++) {
                const tag = tags[k];
                let tagMatches = false;
    
                if (tag.type === 'ingredients') {
                    for (let l = 0; l < recipe.ingredients.length; l++) {
                        if (recipe.ingredients[l].ingredient.toLowerCase() === tag.value.toLowerCase()) {
                            tagMatches = true;
                            break;
                        }
                    }
                } else if (tag.type === 'appliances') {
                    tagMatches = recipe.appliance.toLowerCase() === tag.value.toLowerCase();
                } else if (tag.type === 'utensils') {
                    for (let m = 0; m < recipe.ustensils.length; m++) {
                        if (recipe.ustensils[m].toLowerCase() === tag.value.toLowerCase()) {
                            tagMatches = true;
                            break;
                        }
                    }
                }
    
                if (!tagMatches) {
                    matchesTags = false; // If a tag does not match, break the loop
                    break;
                }
            }
    
            if (matchesQuery && matchesTags) {
                filteredRecipes.push(recipe); // Add the recipe to the filtered table
            }
        }
    
        return filteredRecipes; // Return the filtered array
    }
    
}

// Create instance of MenuApp and initialize
const app = new MenuApp();
