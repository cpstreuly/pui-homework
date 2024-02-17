class Roll {
    constructor(rollType, rollGlazing, packSize, basePrice) {
        this.type = rollType;
        this.glazing =  rollGlazing;
        this.size = packSize;
        this.basePrice = basePrice;
    }
};

const rolls = {
    "Original": {
        "basePrice": 2.49,
        "imageFile": "original-cinnamon-roll.jpg"
    },
    "Apple": {
        "basePrice": 3.49,
        "imageFile": "apple-cinnamon-roll.jpg"
    },
    "Raisin": {
        "basePrice": 2.99,
        "imageFile": "raisin-cinnamon-roll.jpg"
    },
    "Walnut": {
        "basePrice": 3.49,
        "imageFile": "walnut-cinnamon-roll.jpg"
    },
    "Double-Chocolate": {
        "basePrice": 3.99,
        "imageFile": "double-chocolate-cinnamon-roll.jpg"
    },
    "Strawberry": {
        "basePrice": 3.99,
        "imageFile": "strawberry-cinnamon-roll.jpg"
    }    
};

// UPDATE PRODUCT DETAILS
let cart = [];

function populateProductDetails() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const rollType = params.get("roll");

    let roll = rolls[rollType];
    let imgPath = "../assets/products/" + roll.imageFile;
    let price = roll.basePrice;
    
    // modify name at top
    let description = document.querySelector(".description");
    description.innerText = rollType + " Cinnamon Roll";

    // modify image
    let image = document.querySelector("#product-page-container img");
    image.src = imgPath;

    // modify price
    let defaultPrice = document.querySelector("#price");
    defaultPrice.innerText = String(price);
}

populateProductDetails();

const addCartButton = document.querySelector("#add-cart button");
addCartButton.addEventListener("click", saveProductDetails);

function saveProductDetails() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const rollType = params.get("roll");
    let roll = rolls[rollType];
    let basePrice = roll.basePrice;
    let glazingDropdown = document.getElementById('glazing');
    let rollGlazing = glazingDropdown.options[glazingDropdown.selectedIndex].text
    let packSize = document.getElementById('pack-size').value;
    
    let currRoll = new Roll(rollType, rollGlazing, packSize, basePrice);
    cart.push(currRoll);
    console.log(cart);
}