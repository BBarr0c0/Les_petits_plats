import { CardTemplate } from '../scripts/templates/cards.js';
import { recipes } from '../data/recipes.js';
import { SearchHandler } from '../scripts/search.js';
import { TagsHandler } from '../scripts/tags.js';

// Creation of the MenuApp class
class MenuApp {
    constructor() {
        this.recipes = recipes;
        this.sectionMenu = document.querySelector('.section-menu');
        this.templateMenu = new CardTemplate();

        this.init();
    }

    // Initialize method
    async init() {
        this.displayAllRecipes();
    }

    // Display all recipes
    displayAllRecipes() {
        this.clearSectionMenu();
        this.recipes.forEach(recipe => {
            this.sectionMenu.appendChild(
                this.templateMenu.getMenuCardDom(recipe));
        });
    }

    // Clear section menu
    clearSectionMenu() {
        this.sectionMenu.innerHTML = '';
    }

    // Update display with filtered recipes
    updateDisplay(filteredRecipes) {
        this.clearSectionMenu();
        filteredRecipes.forEach(recipe => {
            this.sectionMenu.appendChild(
                this.templateMenu.getMenuCardDom(recipe));
        });
    }
}

// Create instance of MenuApp and initialize
const app = new MenuApp();

// Create instance of SearchHandler and pass the app instance
const searchHandler = new SearchHandler(app);

// Create instance of TagsHandler and pass the app instance
const tagsHandler = new TagsHandler(app);
