const signInPage = document.getElementById("signin-page");
const loginPage = document.getElementById("login-page");
const productsPage = document.getElementById("products-page");
const checkoutPage = document.getElementById("checkout-page");
const sellerPage = document.getElementById("seller-page");

class Seller {
  static sellerIdCounter = 1;

  constructor(name, password, isBuyer) {
    this.isBuyer = isBuyer;
    this.id = Seller.sellerIdCounter++;
    this.name = name;
    this.password = password;
    this.itemsArray = [];
  }

  addItem(image, name, quantity, price) {
    const newItem = new Item(image, name, quantity, price);
    this.itemsArray.push(newItem);
    return newItem;
  }
}

class Item {
  static itemIdCounter = 1;

  constructor(image, name, quantity, price) {
    this.image = image;
    this.name = name;
    this.id = Item.itemIdCounter++;
    this.quantity = quantity;
    this.price = price;
  }
}

class User {
  static incrementer = 1;
  id = 0;
  name = "";
  isBuyer = true;
  constructor(name, password, isBuyer) {
    this.isBuyer = isBuyer;
    this.name = name;
    this.password = password;
    this.id = User.incrementer;
    ++User.incrementer;
    this.carts = [];
  }

  addToCart(pdtId) {
    let currentItem;
    this.carts.forEach((item) => {
      if (pdtId === item.pdtId) {
        currentItem = item;
      }
    });
    if (currentItem) {
      currentItem.quantity += 1;
    } else {
      this.carts.push({
        pdtId,
        quantity: 1,
      });
    }
    this.generateCheckOut();
  }

  generateCheckOut() {
    let totalItems = 0;
    let totalAmount = 0;
    let checkoutHtml = "";
    this.carts.forEach((cartItem) => {
      const pdtId = cartItem.pdtId;
      let currentItem;
      productInfo.forEach((productItem) => {
        if (productItem.id === +pdtId) {
          totalAmount += +cartItem.quantity * +productItem.price;
          currentItem = productItem;
        }
      });
      totalItems += cartItem.quantity;
      checkoutHtml += `
    <div class="cart-item-cards">
      <div class="cart-item-image">
        <img class="product-image" src="./../images/${currentItem.image}.jpg" />
      </div>
      <div class="cart-item-details">
        <h4 class="product-name">
          ${currentItem.name}
        </h4>
        <div class="product-price">Price: Rs.${currentItem.price}</div>
        <div class="product-quantity">
          Quantity: <span class="quantity-label">${cartItem.quantity}</span> 
        </div>
      </div>
    </div>
    `;
    });
    document.querySelector(".order-container").innerHTML = checkoutHtml;
    this.generateSummary(totalAmount, totalItems);
  }

  generateSummary(totalAmount, totalItems) {
    const summaryHtml = `<h3>Summary</h3>
    <p>Total Items selected: ${totalItems} </p>
    <p>Total Amount: Rs.${totalAmount} </p>
    <button id="buy-but" onclick="amazon.currentUser.deleteCart()">Buy</button>`;
    document.querySelector(".summary").innerHTML = summaryHtml;
  }

  deleteCart() {
    if (Array.isArray(this.carts) && this.carts.length) {
      alert("Congratulations on buying the items");
      this.carts = [];
      document.querySelector(".order-container").innerHTML = "";
      const summaryHtml = `<h3>Summary</h3>
    <p>Total Items selected: 0 </p>
    <p>Total Amount: Rs.0 </p>
    <button id="buy-but" onclick="amazon.currentUser.deleteCart()">Buy</button>`;
      document.querySelector(".summary").innerHTML = summaryHtml;
    } else {
        return alert("No items to buy");
    }   
  }
}

class Amazon {
  constructor() {
    this.currentUser = undefined;
  }

  login() {
    const searchUser = this.searchUser();
    if (!searchUser) {
      this.clearLoginInputs();
      return alert("Incorrect username and password!");
    }
    this.currentUser = searchUser;
    if (searchUser.isBuyer === "true") {
      this.selectPanel(productsPage);
      this.productList();
    } else {
      this.selectPanel(sellerPage);
    }
  }

  productList() {
    document.getElementById(
      "welcome-msg"
    ).textContent = `Welcome ${this.currentUser.name}`;
    this.displayProducts();
  }

  searchUser() {
    const userName = document.getElementById("username-login-input").value;
    const password = document.getElementById("password-login-input").value;
    return usersList.find(
      (user) => user.name === userName && user.password === password
    );
  }

  signInPage() {
    this.selectPanel(signInPage);
  }

  signInUser() {
    const userName = document.getElementById("username-signin-input").value;
    const password = document.getElementById("password-signin-input").value;
    const isBuyer = document.querySelector(".signin-dropdown").value;
    if (!userName || !password || !isBuyer) {
      return alert("Please type both username and password");
    }

    if (
      usersList.some(
        (user) => user.name === userName && user.password === password
      )
    ) {
      return alert(
        "Username and password already exist. Try different username or password"
      );
    }

    alert(
      "Congratulations! Your account has been sucessfully registered!!! Press Back and Login"
    );
    addUser(userName, password, isBuyer);
  }

  selectPanel(panelSelected) {
    const panels = document.querySelectorAll(".panel");
    panels.forEach((panel) => {
      panel.style.display = "none";
    });
    this.clearLoginInputs();
    panelSelected.style.display = "block";
  }

  checkoutBack() {
    this.selectPanel(productsPage);
    this.displayProducts();
  }

  userCart() {
    this.currentUser.generateCheckOut();
    this.selectPanel(checkoutPage);
  }

  displayProducts() {
    let productsHtml = "";
    if (!productInfo) return;

    productInfo.forEach((product) => {
      productsHtml += `
  <div class="product-cards">
    <div class="product-img">
      <img src="../images/${product.image}.jpg">
    </div>
    <div>
      <p id="product-name">${product.name}</p>
    </div>
    <div>
      <p id="product-cost">Rs.${product.price}</p>
    </div>
    <button class="add-to-cart-but" data-product-id="${product.id}">Add to Cart</button>
  </div>
  `;
    });

    document.querySelector(".product-container").innerHTML = productsHtml;
  }

  clearLoginInputs() {
    document.getElementById("username-login-input").value = "";
    document.getElementById("password-login-input").value = "";
  }

  clearSignInInputs() {
    document.getElementById("username-signin-input").value = "";
    document.getElementById("password-signin-input").value = "";
    document.querySelector(".signin-dropdown").value = "";
  }

  backToLogin() {
    this.clearSignInInputs();
    this.clearLoginInputs();
    this.selectPanel(loginPage);
  }
}

const hardcodedUsers = [
  new User("user1", "pw1", "true"),
  new User("user2", "pw2", "true"),
  new Seller("seller1", "pw1", "false"),
];

const usersList = [...hardcodedUsers];

const defaultSeller = usersList.find(
  (user) => user instanceof Seller && user.name === "seller1"
);
if (defaultSeller) {
  defaultSeller.addItem("camera", "Black Nikon D7500", 10, 12000);
  defaultSeller.addItem("dress", "Pink frock", 5, 3000);
  defaultSeller.addItem("earings", "The Majesty Earrings", 50, 30);
  defaultSeller.addItem("flipflop", "Black printed flip flop", 40, 200);
  defaultSeller.addItem("laptop", "Dell Inspiron 3520 Laptop", 5, 50000);
  defaultSeller.addItem("plant", "Live indoor money plant", 10, 500);
  defaultSeller.addItem("shoes", "Women Running Shoes JogFlow500K", 20, 11000);
  defaultSeller.addItem("umbrella", "Transparent colourful umbrella", 25, 300);
}

const amazon = new Amazon();
amazon.selectPanel(loginPage);

const addUser = function (userName, password, isBuyer) {
  if (isBuyer === "true") {
    usersList.push(new User(userName, password, isBuyer));
  } else {
    const newSeller = new Seller(userName, password, isBuyer);
    sellersArray.push(newSeller);
    usersList.push(newSeller);
  }
};

const sellersArray = hardcodedUsers.filter((user) => user instanceof Seller); // Array to store user instances
const allItemsArray = [];
sellersArray.forEach((user) => {
  if (user.itemsArray) {
    allItemsArray.push(...user.itemsArray);
  }
});
let productInfo = [...new Set(allItemsArray)];

document.querySelector(".add-item").addEventListener("click", () => {
  const currentUser = amazon.currentUser;

  const sellerProductName = document.getElementById("seller-product-item-name");
  const sellerProductQuantity = document.getElementById(
    "seller-product-quantity"
  );
  const sellerProductPrice = document.getElementById("seller-product-price");
  const sellerProductImageSource = document.getElementById(
    "seller-product-image-source"
  );

  currentUser.addItem(
    sellerProductImageSource.value,
    sellerProductName.value,
    sellerProductQuantity.value,
    sellerProductPrice.value
  );

  if (
    !sellerProductName.value ||
    !sellerProductQuantity.value ||
    !sellerProductPrice.value ||
    !sellerProductImageSource.value
  ) {
    return alert("Please fill all the details");
  }

  sellerProductName.value = "";
  sellerProductQuantity.value = "";
  sellerProductPrice.value = "";
  sellerProductImageSource.value = "";

  sellersArray.forEach((user) => {
    allItemsArray.push(...user.itemsArray);
  });

  productInfo = [...new Set(allItemsArray)];
});

document
  .querySelector(".product-container")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart-but")) {
      const pdtId = event.target.dataset.productId;
      let sellerCartQuantity;
      sellersArray.forEach((seller) => {
        seller.itemsArray.forEach((item) => {
          if (item.id === +pdtId) {
            item.quantity = item.quantity - 1;
            sellerCartQuantity = item.quantity;
          }
        });
      });
      if (sellerCartQuantity < 0) {
        alert("Not enough items in the sellers cart!");
        return;
      }
      amazon.currentUser.addToCart(pdtId);
    }
  });
