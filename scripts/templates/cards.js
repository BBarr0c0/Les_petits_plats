// Creation of the CardTemplate class
export class CardTemplate {
	// Create and return an element with class and text
	createElement(tag, className, textContent) {
		const element = document.createElement(tag);
		if (className) element.classList.add(className);
		if (textContent) element.textContent = textContent;
		return element;
	}

	getMenuCardDom(menu) {
		const { image, name, ingredients, description, time } = menu;

		// Create the main card container
        const article = document.createElement('article');
        article.classList.add('card');

        // Create image element
        const img = document.createElement('img');
        const webpImg = image.replace('.jpg', '.webp');
        img.src = `../../assets/images/${webpImg}`;
        img.alt = name;

        // Create time label element
        const timeLabel = document.createElement('div');
        timeLabel.classList.add('time-label');
        timeLabel.textContent = `${time}min`;

        // Create the content container
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        // Create title element
        const title = document.createElement('h2');
        title.textContent = name;

        // Create "RECETTE" heading
        const recipe = document.createElement('h3');
        recipe.textContent = 'RECETTE';

        // Create recipe description element
        const recipeDescription = document.createElement('p');
        recipeDescription.classList.add('recipe-description');
        recipeDescription.textContent = description;

        // Create "INGRÉDIENTS" heading
        const ingredient = document.createElement('h3');
        ingredient.textContent = 'INGRÉDIENTS';

        // Create ingredients container
        const ingredientsDescription = document.createElement('div');
        ingredientsDescription.classList.add('ingredients');

        // Loop through ingredients to create and append each one
        ingredients.forEach((ingredient) => {
            // Create the container for a single ingredient
            const ingredientElement = document.createElement('div');
            ingredientElement.classList.add('ingredient');

            // Create ingredient name element
            const ingredientName = document.createElement('p');
            ingredientName.classList.add('ingredient-name');
            ingredientName.textContent = ingredient.ingredient;

            // Determine the quantity text
            const quantityText =
                ingredient.quantity !== undefined
                    ? ingredient.quantity + (ingredient.unit ? ` ${ingredient.unit}` : '')
                    : '-';

            // Create ingredient quantity element
            const quantityIngredient = document.createElement('p');
            quantityIngredient.classList.add('ingredient-quantity');
            quantityIngredient.textContent = quantityText;

            ingredientElement.appendChild(ingredientName);
            ingredientElement.appendChild(quantityIngredient);

            ingredientsDescription.appendChild(ingredientElement);
        });

        // Append elements to the content container
        cardContent.appendChild(title);
        cardContent.appendChild(recipe);
        cardContent.appendChild(recipeDescription);
        cardContent.appendChild(ingredient);
        cardContent.appendChild(ingredientsDescription);

        // Append the image, time label, and content container to the main article element
        article.appendChild(img);
        article.appendChild(timeLabel);
        article.appendChild(cardContent);

        // Return the complete menu card element
        return article;
	}
}
