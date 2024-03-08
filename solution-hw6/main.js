class Roll {
    constructor(rollType, rollGlazing, packSize, basePrice) {
        this.type = rollType;
        this.glazing =  rollGlazing;
        this.size = packSize;
        this.basePrice = basePrice;
    }
    totalPrice() {
        let glazingPrice = glazings.find(obj => obj.type === this.glazing).price;
        let packSizePrice = packSizes.find(obj => obj.type === this.size).price;
        let price =(this.basePrice + glazingPrice) * packSizePrice;
        return Math.round(price * 100) / 100;
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
}

class PackSize {
    constructor(packType, packPrice) {
        this.type = packType;
        this.price = packPrice;
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
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const rollType = params.get("roll");
    let roll = rolls[rollType];
    const basePrice = roll.basePrice;
    
    let packSizeDropdown = document.getElementById("pack-size");
    let packSizeOption = packSizeDropdown.options[packSizeDropdown.selectedIndex];
    let packSize = parseFloat(packSizeOption.value);
    const priceChange = parseFloat(element.value);
    let newPrice = (basePrice + priceChange) * packSize;
    newPrice = Math.round(newPrice * 100) / 100;
    document.querySelector("#price").innerHTML = newPrice.toFixed(2);
}

function packSizeChange(element) {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const rollType = params.get("roll");
    let roll = rolls[rollType];
    const basePrice = roll.basePrice;

    let glazingDropdown = document.getElementById("glazing");
    let glazingOption = glazingDropdown.options[glazingDropdown.selectedIndex];
    let glazing = parseFloat(glazingOption.value);
    const priceChange = parseFloat(element.value);
    let newPrice = (basePrice + glazing) * priceChange;
    newPrice = Math.round(newPrice * 100) / 100;
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
    addCartButton.addEventListener("click", addToCart);
}

function updateCartIcon() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let icon = document.querySelector(".oval");
    icon.innerText = cart.length;
}

function createNewRoll() {
    // gets selected product details from page
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const rollType = params.get("roll");
    let roll = rolls[rollType];
    
    let basePrice = roll.basePrice;
    
    let glazingDropdown = document.getElementById('glazing');
    let rollGlazing = glazingDropdown.options[glazingDropdown.selectedIndex].text
    
    let packSizeDropdown = document.getElementById('pack-size');
    let packSize = packSizeDropdown.options[packSizeDropdown.selectedIndex].text;
    
    // creates roll from this info and calculates price
    let currRoll = new Roll(rollType, rollGlazing, packSize, basePrice);
    return currRoll
}

function addToCart() {
    let currRoll = createNewRoll();
    let rollPrice = currRoll.totalPrice();

    let cart = JSON.parse(localStorage.getItem("cart"));
    let price = JSON.parse(localStorage.getItem("cartPrice"));

    // update cart and price
    cart.push(currRoll);
    price += rollPrice;

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartPrice", JSON.stringify(Math.round(price * 100)/100));
    
    updateCartIcon();

    console.log(cart);
}

// removes roll from cart array
function removeFromCart(roll, rollPrice) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let cartPrice = JSON.parse(localStorage.getItem("cartPrice"));

    const indexToRemove = cart.findIndex(item => item.type === roll.type && item.glazing === roll.glazing && item.size === roll.size);
    if (indexToRemove !== -1) {
      cart.splice(indexToRemove, 1);
    }
    cartPrice -= rollPrice;
    localStorage.setItem("cartPrice", JSON.stringify(Math.round(cartPrice * 100)/100));

    console.log(cart);
    return cart;
  }

// updates total cart price when cart is changed
function updateCartPrice() {
    let price = document.querySelector("#num-price");
    let cartPrice = JSON.parse(localStorage.getItem("cartPrice"));
    price.innerText = cartPrice.toFixed(2);
}

// adds one roll to the cart page (DOM)
function addRollToCartDOM(roll) {
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
    clone.querySelector('.cart-price').innerHTML = `<br><br>$${rollPrice.toFixed(2)}`; 
    
    // adds listener to remove button
    const removeButton = clone.querySelector('.remove-cmd');
    removeButton.addEventListener('click', function() {
        // find the cart item node and remove it
        const parentElement = removeButton.closest('.cart-item');
        if (parentElement) {
            cartContainer.removeChild(parentElement);
            cart = removeFromCart(roll, rollPrice);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartPrice();
            updateCartIcon();
        }
    });

    // add this clone to DOM
    cartContainer.appendChild(clone);
    return rollPrice;
}

// iterates through cart array, adds rolls to page
function displayCartItems() {
    let cart = JSON.parse(localStorage.getItem("cart"));

    for (let i = 0; i < cart.length; i++) {
        let parsedRoll = cart[i];
        let currRoll = new Roll(parsedRoll.type, parsedRoll.glazing, parsedRoll.size, parsedRoll.basePrice)
        addRollToCartDOM(currRoll);
    }
    updateCartPrice();
}

// returns reference to cart in localStorage
function findCart() {
    let cart = localStorage.getItem("cart");
    let cartPrice = localStorage.getItem("cartPrice");

    if (cart == null || cartPrice == null) {
        localStorage.setItem("cart", JSON.stringify([]));
    }

    if (cartPrice == null) {
        localStorage.setItem("cartPrice", JSON.stringify(0));
    }
}

findCart();
updateCartIcon();

if (window.location.pathname.includes("/solution-hw6/productdetails.html")) {
    populateDropdowns(glazings, packSizes);
    populateProductDetails();
}

if (window.location.pathname.includes("/solution-hw6/cart.html")) {
    displayCartItems();
}
