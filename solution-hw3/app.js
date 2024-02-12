const glazings = [
    {
        name: "Keep original", 
        value: 0
    },
    {
        name: "Sugar milk",
        value: 0
    },
    {
        name: "Vanilla milk",
        value: 0.5
    },
    {
        name: "Double chocolate",
        value: 1.5
    }
]

const packSizes = [
    {
        name: "1", 
        value: 1
    },
    {
        name: "3",
        value: 3
    },
    {
        name: "6",
        value: 5
    },
    {
        name: "12",
        value: 10
    }
]
function populateDropdowns(glazings, packSizes) {
    let glazingsDropdown = document.querySelector("#glazing");
    let packSizeDropdown = document.querySelector("#pack-size");

    for (let i = 0; i < glazings.length; i++) {
        var glazOption = document.createElement('option')
        glazOption.text = glazings[i].name;
        glazOption.value = glazings[i].value;
        glazingsDropdown.add(glazOption);
    }
    for (let i = 0; i < packSizes.length; i++) { 
        var packOption = document.createElement('option')
        packOption.text = packSizes[i].name;
        packOption.value = packSizes[i].value;
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

populateDropdowns(glazings, packSizes);