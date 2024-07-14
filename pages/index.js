import { CardTemplate } from '../scripts/templates/cards.js';
import { recipes } from '../data/recipes.js';

// Creation of the MenuApp class
class MenuApp {
	constructor() {
		// Initialization of the class properties
		this.recipes = recipes;
		this.menusSection = document.querySelector('.section-menu');
		this.menusTemplate = new CardTemplate();
	}

	// Asynchronous method to fetch menus
	async getMenus() {
		try {
			const data = { recipes: this.recipes };
			console.log(data);
			return data;
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	// Method to display menu data on the web page
	displayData(menus) {
		menus.forEach((menu) => {
			const menuCardDOM =
				this.menusTemplate.getMenuCardDom(menu);
			this.menusSection.appendChild(menuCardDOM);
		});
	}

	// Asynchronous method to initialize the application
	async init() {
		const { recipes } = await this.getMenus();
		if (recipes) {
			this.displayData(recipes);
		} else {
			console.error('Error: No menu data fetched.');
		}
	}
}

// Creates an instance of the MenuApp class and initializes the application
const app = new MenuApp();
app.init();
