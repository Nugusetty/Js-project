document.addEventListener("DOMContentLoaded", function () {
  const cateElement = document.querySelector("#cate");
  const mealsElement = document.getElementById("meals");
  const galleryElement = document.getElementById("gallery");
  const outputElement = document.getElementById("output");
  const searchButton = document.querySelector(".search-button");
  const searchInput = document.querySelector(".search-input");
  // Hamburger menu functionality
  const hamburgerElement = document.getElementById("hamburger");
  const dropdownElement = document.getElementById("dropdown");
  const cancelElement = document.getElementById("cancle");

  if (hamburgerElement && dropdownElement) {
    hamburgerElement.addEventListener("click", () => {
      dropdownElement.style.display = "block";
    });
  }

  if (cancelElement && dropdownElement) {
    cancelElement.addEventListener("click", () => {
      dropdownElement.style.display = "none";
    });
  }
  // Show the category section initially
  if (cateElement) {
    cateElement.style.display = "block";
  }
  if (searchButton && searchInput) {
    searchButton.addEventListener("click", function () {
      searchMeals(searchInput.value.trim());
    });
  }

  function searchMeals(searchTerm) {
    if (mealsElement) {
      mealsElement.style.display = "none";
    }
    if (galleryElement) {
      galleryElement.style.display = "none";
    }
    if (cateElement) {
      cateElement.style.display = "none";
    }

    if (outputElement) {
      outputElement.innerHTML = "";
    }

    if (searchTerm) {
      console.log(`Searching for: ${searchTerm}`);

      fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("API Response:", data);

          if (data.meals) {
            let mealgrid = `
              <h1 style="color:black;">Meals</h1>
              <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:15px;">
            `;

            // Loop through meals and build the grid
            data.meals.forEach((meal) => {
              mealgrid += `
                <div style="border: 2px solid red; padding: 15px; text-align: center; background-color: #f39c12;">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-width: 80%;">
                  <p>${meal.strMeal}</p>
                </div>
              `;
            });

            // Close the grid container
            mealgrid += "</div>";

            // Set the output to the new mealgrid content
            if (outputElement) {
              outputElement.innerHTML = mealgrid;
            }
          } else {
            // If no meals were found
            if (outputElement) {
              outputElement.innerHTML = "<p>No meals found</p>";
            }
          }
        });
    } else {
      // If no search term was entered
      if (outputElement) {
        outputElement.innerHTML = "<p>Please enter a search term</p>";
      }
    }
  }
  //  -----search item bar ends here-------------------------------------
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("imageGrid").style.display = "none";

      let gallery = `
      <div id="gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px;">
    `;
      data.categories.forEach((category) => {
        gallery += `
        <div class="gallery-item" 
             data-category="${category.strCategory}" 
             data-description="${category.strCategoryDescription}" 
             data-img="${category.strCategoryThumb}" 
             style="border: 1px solid #ccc; padding: 10px; text-align: center; cursor: pointer; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; border-radius: 10px;"> 
          <img class="glry-img" src="${category.strCategoryThumb}" alt="${category.strCategory}" style="max-width: 80%; cursor: pointer;"> 
          <p style="background-color: rgb(216, 91, 45); width: 55%; margin-left: auto; margin-right: auto; color: #fff;">${category.strCategory}</p>
        </div>
      `;
      });
      gallery += `</div>`;

      document.getElementById("output").innerHTML = gallery;
      document.getElementById("mel").style.display = "none";

      document.querySelectorAll(".gallery-item").forEach((item) => {
        item.addEventListener("click", () => {
          const category = item.dataset.category;
          const description = item.dataset.description;

          // Fetch and display related items
          fetchRelatedItems(category, description);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.getElementById("output").innerHTML =
        "<p>Error fetching categories. Please try again later.</p>";
    });
  // ---------------related items cateogry ----------------------
  function fetchRelatedItems(category, description) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => response.json())
      .then((data) => {
        const items = data.meals;

        let details = `
        <div id="related-items-details">
          <div style="color:black; border: 2px solid red; margin-bottom: 20px; margin: 15px;"> <h2 style="color:red">${category} - Related Items</h2>
          ${description}</div>
          <div id="related-items" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; padding: 0px;">
      `;
        items.forEach((item) => {
          details += `
          <div class="item" data-meal="${item.idMeal}" style="border: 1px solid #ccc; padding: 10px; text-align: center; cursor: pointer; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; border-radius: 10px;"> 
            <img src="${item.strMealThumb}" alt="${item.strMeal}" style="max-width: 80%; cursor: pointer;"> 
            <p style="background-color: rgb(216, 91, 45); width: 55%; margin-left: auto; margin-right: auto; color: #fff;">${item.strMeal}</p>
          </div>
        `;
        });
        details += `</div></div>`;

        document.getElementById("output").innerHTML = details;
        document.getElementById("cat").style.display = "none";
        document.getElementById("mel").style.display = "block";

        // -----------------independent item click -----------------------
        // Add click event listener to items
        document.querySelectorAll(".item").forEach((item) => {
          item.addEventListener("click", () => {
            const mealId = item.dataset.meal;
            fetchItemDetails(mealId);
            // document.getElementById('mel').style.display='block';
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching related items:", error);
        document.getElementById("output").innerHTML =
          "<p>Error fetching related items. Please try again later.</p>";
      });
  }
  // ------------------independent card for every item ---------------------------
  function fetchItemDetails(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((response) => response.json())
      .then((data) => {
        const meal = data.meals[0];
        const details = `
            <div style="text-align: center;"> 
            <div style="background-color: darkgoldenrod; display:flex; align-items:start; margin: 20px;">
           <a href="meals.html"><i class="fa-solid fa-house" style="font-size: 50px; align-items: start; margin-top:10px;"></i></a>
           <i class="fa-solid fa-forward" style="font-size: 50px; justify-content: start; margin-left:20px; margin-top:10px;"></i>
           <h2 style="margin-left:30px; margin-bottom: 15px;">${meal.strMeal}</h2>
           </div>
            
          <div style="display: flex;">
           <div style="border: 2px solid blue; margin-left: 100px;">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-width: 50%; margin: auto; margin-top: 20px; border-radius: 10px; border: 2px solid blue; margin-right: 700px; width: 300px; margin-left: 50px;">
                </div>
                
                <div style="margin-left: -600px; padding-bottom: 20px;">
           <h2 style="color: red;width: 50%; margin: 10px; margin-left: 150px;">${meal.strMeal}</h2>
          <h3 style="color: red;">Category:<a style="color: black;"> ${meal.strCategory}</a></h3>
          <p style="color: black; margin: 20px"> Source: <a href="${meal.strYoutube}">${meal.strYoutube}</a></p>
                <h3 style="color: red; margin: 20px">Tags:<a style="color: black; border: 2px solid red; margin: 25px;"> ${meal.strTags}</a></h3>
                <div style="background-color: orange;">
                <h3 style="color: red;">Ingredients:</h3>
                 <ol style="color: black">
                        <div style="color: red; margin: 5px; display: grid; grid-template-columns: repeat(3, 1fr);">
                        <br/> 
                        <li style="color: black;">${meal.strIngredient1}</li>
                        <li style="color: black;">${meal.strIngredient2}</li>
                        <li style="color: black;">${meal.strIngredient3}</li>
                        <li style="color: black;">${meal.strIngredient4}</li>
                        <li style="color: black;">${meal.strIngredient5}</li>
                        <li style="color: black;">${meal.strIngredient6}</li>
                        <li style="color: black;">${meal.strIngredient7}</li>
                        <li style="color: black;">${meal.strIngredient8}</li>
                        </div>
                    </ol>
                </div>
                </div>
                </div>
                <p style="color: black; margin: 20px;"><a style="color: red;">Instructions:</a>${meal.strInstructions}</p>
            </div>

            <div style="background-color: orange;> 
                 <p style="color: red;">Measure:</p>
                <div class="measure" style="color: red; margin: 5px; display: grid; grid-template-columns: repeat(3, 1fr);>
                <p style="color: black; dispaly: flex;"> ${meal.strMeasure1}</p>
                <p style="color: black; dispaly: flex;"> ${meal.strMeasure2}</p>
                <p style="color: black; dispaly: flex;"> ${meal.strMeasure3}</p>
                <p style="color: black; dispaly: flex;"> ${meal.strMeasure4}</p>
                <p style="color: black; dispaly: flex;"> ${meal.strMeasure5}</p>
                <p style="color: black; dispaly: flex;"> ${meal.strMeasure6}</p>
                <p style="color: black; dispaly: flex;"> ${meal.strMeasure7}</p>
                <p style="color: black; dispaly: flex;"> ${meal.strMeasure8}</p>
                </div>
            `;

        document.getElementById("output").innerHTML = details;
        document.getElementById("mel").style.display = "block";
        document.getElementById("cat").style.display = "none";
      })
      .catch((error) => {
        console.error("Error fetching item details:", error);
        document.getElementById("output").innerHTML =
          "<p>Error fetching item details. Please try again later.</p>";
      });

    function getIngredientsList(item) {
      let ingredientsList = "";
      for (let i = 1; i <= 20; i++) {
        const ingredient = item[`strIngredient${i}`];
        const measure = item[`strMeasure${i}`];
        if (ingredient && ingredient !== "") {
          ingredientsList += `<li style='list-style:none'><i class='fa-solid fa-spoon'></i> ${measure} ${ingredient}</li>`;
        }
      }
      return ingredientsList;
    }
  }

  // Fetch and display categories list
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then((response) => response.json())
    .then((data) => {
      const categories = data.categories;
      const categoriesList = document.getElementById("categoriesList");

      // Create a list item for each category
      categories.forEach((category) => {
        const listItem = document.createElement("li");
        listItem.textContent = category.strCategory;

        // Add click event to load meals when category is clicked
        listItem.addEventListener("click", function () {
          fetchMealsByCategory(category.strCategory);
        });
        categoriesList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error fetching categories:", error));

  // Function to fetch meals by category
  function fetchMealsByCategory(category) {
    document.getElementById("output").style.display = "none";
    document.getElementById("meals").style.display = "block";

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => response.json())
      .then((data) => {
        displayMeals(data.meals);
      })
      .catch((error) => console.error("Error fetching meals:", error));
  }

  // Function to display meals
  function displayMeals(meals) {
    const mealsContainer = document.getElementById("meals");
    mealsContainer.innerHTML = "";

    meals.forEach((meal) => {
      const mealItem = document.createElement("div");
      mealItem.classList.add("meal-item");

      mealItem.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
      `;
      mealsContainer.appendChild(mealItem);
    });
  }
});
//
//
// ---------------image click function -----------
// Function to fetch categories from the API
async function fetchCategories() {
  const apiUrl = "https://www.themealdb.com/api/json/v1/1/categories.php?";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Populate the image grid with categories
    const imageGrid = document.getElementById("imageGrid");
    data.categories.forEach((category) => {
      const categoryDiv = document.createElement("div");
      const categoryImg = document.createElement("img");
      categoryImg.src = category.strCategoryThumb;
      categoryImg.alt = category.strCategory;
      categoryImg.dataset.category = category.strCategory;
      categoryImg.dataset.description = category.strCategoryDescription;

      categoryImg.onclick = displayCategoryMeals;

      categoryDiv.appendChild(categoryImg);
      imageGrid.appendChild(categoryDiv);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
