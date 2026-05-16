const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const nav = document.querySelector(".site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-link");
const quantityInputs = document.querySelectorAll(".quantity-input");
const distanceInput = document.getElementById("distance");
const calculateDeliveryButton = document.getElementById("calculateDelivery");
const completeOrderButton = document.getElementById("completeOrder");

const productsTotalElement = document.getElementById("productsTotal");
const deliveryTotalElement = document.getElementById("deliveryTotal");
const grandTotalElement = document.getElementById("grandTotal");
const deliveryResultElement = document.getElementById("deliveryResult");
const selectedProductsElement = document.getElementById("selectedProducts");

let deliveryCost = 0;
const companyWhatsAppNumber = "252907740441";

function cleanNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function getSelectedProducts() {
  return Array.from(quantityInputs)
    .map((input) => {
      const quantity = Math.floor(cleanNumber(input.value));
      const price = cleanNumber(input.dataset.price);

      return {
        name: input.dataset.name,
        quantity,
        price,
        total: quantity * price
      };
    })
    .filter((product) => product.quantity > 0);
}

function updateSelectedProducts(products) {
  selectedProductsElement.innerHTML = "";

  if (products.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No products selected yet.";
    selectedProductsElement.append(emptyItem);
    return;
  }

  products.forEach((product) => {
    const item = document.createElement("li");
    item.textContent = `${product.name}: ${product.quantity} x ${money.format(product.price)} = ${money.format(product.total)}`;
    selectedProductsElement.append(item);
  });
}

function updateTotals() {
  const selectedProducts = getSelectedProducts();
  const productsTotal = selectedProducts.reduce((sum, product) => sum + product.total, 0);
  const grandTotal = productsTotal + deliveryCost;

  productsTotalElement.textContent = money.format(productsTotal);
  deliveryTotalElement.textContent = money.format(deliveryCost);
  grandTotalElement.textContent = money.format(grandTotal);
  deliveryResultElement.textContent = `Delivery Cost: ${money.format(deliveryCost)}`;

  updateSelectedProducts(selectedProducts);
}

function calculateDelivery() {
  deliveryCost = cleanNumber(distanceInput.value);
  updateTotals();
}

function completeOrder() {
  const selectedProducts = getSelectedProducts();

  if (selectedProducts.length === 0) {
    alert("Please select at least one product before completing your order.");
    return;
  }

  const productLines = selectedProducts
    .map((product) => `- ${product.name}: ${product.quantity} bag(s), ${money.format(product.total)}`)
    .join("\n");

  const message =
`Hello ALFARAJ GROUP,

I would like to place this wholesale order:

${productLines}

Delivery: ${deliveryTotalElement.textContent}
Grand Total: ${grandTotalElement.textContent}

Please contact me to confirm delivery and payment.`;

  const whatsappUrl = `https://wa.me/${companyWhatsAppNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener");
}

function setActiveNavigation() {
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const visibleSections = sections.filter((section) => section.getBoundingClientRect().top <= 130);
  const current = visibleSections[visibleSections.length - 1];

  if (!current) return;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

quantityInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (cleanNumber(input.value) !== Number.parseFloat(input.value)) {
      input.value = cleanNumber(input.value);
    }

    updateTotals();
  });
});

distanceInput.addEventListener("input", calculateDelivery);
calculateDeliveryButton.addEventListener("click", calculateDelivery);
completeOrderButton.addEventListener("click", completeOrder);
window.addEventListener("scroll", setActiveNavigation, { passive: true });

updateTotals();
setActiveNavigation();
