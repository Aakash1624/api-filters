"use strict";

//Global variable

let filteredData = [];

//In this api filter method we have three methods
// 1.search
// 2.sort
// 2.categories

const productContainer = document.getElementById("product-container");
const selectEl = document.getElementById("select");
const searchEl = document.getElementById("search");
const btnSearch = document.getElementById("btn-search");
const btnPriceSort = document.getElementById("btn-sort-price");
const btnTitleSort = document.getElementById("btn-sort-title");

const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();

    filteredData = [...data];

    data.forEach((product) => {
      displayProduct(product);
    });

    productContainer = [...data];
  } catch (error) {
    console.log(error);
  }
};

//functions
function init() {
  getCategories();
  fetchData(`http://fakestoreapi.com/products`);
}

function displayProduct(product) {
  const { title, image, price } = product;
  const productEl = document.createElement("li");
  productEl.classList.add("product");
  productEl.innerHTML = `
   <div class="img-container">
          <img
            src="${image}"
            alt="${title}"
            class="product-image"
          />
        </div>

        <div class="product-body">
          <h4>${title.slice(0, 10)}</h4>
          <br />
          <h4>$${price}</h4>
          
        </div>
  `;

  productContainer.appendChild(productEl);
}

// SELECTING CATEGORIES

async function getCategories() {
  const response = await fetch(`https://fakestoreapi.com/products/categories`);

  const data = await response.json();

  data.forEach((item) => {
    const optionEl = document.createElement("option");
    optionEl.value = item;
    optionEl.innerText = item[0].toUpperCase() + item.slice(1);
    selectEl.appendChild(optionEl);
  });
}

init();

selectEl.addEventListener("change", async () => {
  const category = selectEl.value;
  const response = await fetch(`https://fakestoreapi.com/products`);

  const data = await response.json();

  if (category == "all") {
    filteredData = data.filter((item) => item.category !== "all");
  } else {
    filteredData = data.filter((item) => item.category === category);
  }

  productContainer.innerHTML = null;

  filteredData.forEach((item) => {
    displayProduct(item);
  });
});

//SortPrice

btnPriceSort.addEventListener("click", () => {
  filteredData
    .sort((itemOne, itemTwo) => itemOne.price - itemTwo.price)
    .reverse();

  productContainer.innerHTML = null;

  filteredData.forEach((item) => {
    displayProduct(item);
  });
});

//SortTitle

btnTitleSort.addEventListener("click", () => {
  filteredData.sort((a, b) => {
    const nameA = a.title.toUpperCase();
    const nameB = b.title.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });

  productContainer.innerHTML = null;

  filteredData.forEach((item) => {
    displayProduct(item);
  });
});

//Search

btnSearch.addEventListener("click", () => {
  const searchStr = searchEl.value.toLowerCase();

  filteredData = filteredData.filter((item) => {
    return item.title.toLowerCase().includes(searchStr);
  });
  productContainer.innerHTML = null;
  filteredData.forEach((item) => {
    displayProduct(item);
  });
});
