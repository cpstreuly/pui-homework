class Roll {
    constructor(rollType, rollGlazing, packSize, basePrice) {
        this.type = rollType;
        this.glazing =  rollGlazing;
        this.size = packSize;
        this.basePrice = basePrice;
    }
    totalPrice() {
        let glazingPrice = glazings.find(obj => obj.type === this.glazing).price;
        let price =(this.basePrice + glazingPrice) * this.size;
        return price;
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

class Glazing {
    constructor(glazeType, glazePrice) {
        this.type = glazeType;
        this.price = glazePrice;
    }
    totalPrice(basePrice, packPrice) {
        let result = (basePrice + this.price) * packPrice;
        return result.toFixed(2);
    }
}

class PackSize {
    constructor(packType, packPrice) {
        this.type = packType;
        this.price = packPrice;
    }
    totalPrice(basePrice, glazePrice) {
        let result = (basePrice + glazePrice) * this.price;
        return result.toFixed(2);
    }
}

const glazings = [new Glazing("Original", 0), 
                    new Glazing("Sugar Milk", 0),
                    new Glazing("Vanilla Milk", 0.5),
                    new Glazing("Double Chocolate", 1.5)];
const packSizes = [new PackSize("1", 1),
                    new PackSize("3", 3),
                    new PackSize("6", 5),
                    new PackSize("12", 10),]                


// adds options to glazing and pack size dropdown menus
function populateDropdowns(glazings, packSizes) {
    let glazingsDropdown = document.querySelector("#glazing");
    let packSizeDropdown = document.querySelector("#pack-size");

    for (let i = 0; i < glazings.length; i++) {
        var glazOption = document.createElement('option')
        glazOption.text = glazings[i].type;
        glazOption.value = glazings[i].price;
        glazingsDropdown.add(glazOption);
    }
    for (let i = 0; i < packSizes.length; i++) { 
        var packOption = document.createElement('option')
        packOption.text = packSizes[i].type;
        packOption.value = packSizes[i].price;
        packSizeDropdown.add(packOption);
    }
}

function glazingChange(element) {
    let basePrice = 2.49;
    let packSizeDropdown = document.getElementById("pack-size");
    let packSizeOption = packSizeDropdown.options[packSizeDropdown.selectedIndex];
    let packSize = parseFloat(packSizeOption.value);
    const priceChange = parseFloat(element.value);
    let newPrice = (basePrice + priceChange) * packSize;
    document.querySelector("#price").innerHTML = newPrice.toFixed(2);
}

function packSizeChange(element) {
    let basePrice = 2.49;
    let glazingDropdown = document.getElementById("glazing");
    let glazingOption = glazingDropdown.options[glazingDropdown.selectedIndex];
    let glazing = parseFloat(glazingOption.value);
    const priceChange = parseFloat(element.value);
    let newPrice = (basePrice + glazing) * priceChange;
    document.querySelector("#price").innerHTML = newPrice.toFixed(2);
}

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

    const addCartButton = document.querySelector("#add-cart button");
    addCartButton.addEventListener("click", saveProductDetails);
}

let testCart = [];

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
    testCart.push(currRoll);
    console.log(testCart);
}


// CART FUNCTIONALITY
let cart = [];
let cartPrice = 0;

// fills cart with predefined rolls
function populateCartArray() {
    cart.push(new Roll("Original", "Sugar Milk", 1, 2.49));
    cart.push(new Roll("Walnut", "Vanilla Milk", 12, 3.49));
    cart.push(new Roll("Raisin", "Sugar Milk", 3, 2.99));
    cart.push(new Roll("Apple", "Original", 3, 3.49));
}

// removes roll from cart array
function removeFromCart(roll, rollPrice) {
    const indexToRemove = cart.findIndex(item => item.type === roll.type && item.glazing === roll.glazing && item.size === roll.size);
    if (indexToRemove !== -1) {
      cart.splice(indexToRemove, 1);
    }
    cartPrice -= rollPrice;
    return cart;
  }

function updateCartPrice() {
    let price = document.querySelector("#num-price");
    price.innerText = cartPrice.toFixed(2);
}

// adds one roll to the cart page (DOM)
function addRollToCart(roll) {
    // retrieves cart container and clones template element 
    const cartContainer = document.getElementById('cart-container');
    let template = document.querySelector("#cart-item-template");
    let clone = document.importNode(template.content, true);

    // modifies item description 
    clone.querySelector(".item-description").innerHTML = 
        `${roll.type} Cinammon Roll <br> Glazing: ${roll.glazing} <br> Pack Size: ${roll.size} <br>`

    // modifies roll image
    let imgPath = "../assets/products/" + rolls[roll.type].imageFile;
    let image = clone.querySelector("img");
    image.src = imgPath;
    
    // modifies price
    let rollPrice = roll.totalPrice();
    clone.querySelector('.cart-price').innerHTML = `<br><br>$${rollPrice}`; 
    
    // adds listener to remove button
    const removeButton = clone.querySelector('.remove-cmd');
    removeButton.addEventListener('click', function() {
        // find the cart item node and remove it
        const parentElement = removeButton.closest('.cart-item');
        if (parentElement) {
            cartContainer.removeChild(parentElement);
            cart = removeFromCart(roll, rollPrice);
            updateCartPrice();
        }
    });

    // add this clone to DOM
    cartContainer.appendChild(clone);
    return rollPrice;
}

// iterates through cart array, adds rolls to page
function displayCartItems() {
    for (let i = 0; i < cart.length; i++) {
        let rollPrice = addRollToCart(cart[i]);
        console.log(rollPrice);
        console.log(typeof(rollPrice));

        cartPrice += rollPrice;
    }
    updateCartPrice();
}

// prod details page
if (window.location.pathname == "/solution-hw5/productdetails.html") {
    populateDropdowns(glazings, packSizes);
    populateProductDetails();
}

// cart page
populateCartArray();
displayCartItems();

