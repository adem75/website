function cartApp() {
  return {
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    isCartOpen: false,
    showToast: false,
    toastMessage: "",
    toastType: "success",

    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },

    addToCart(name, price, image, size, color) {
      if (!size || !color) {
        this.showToastMessage("Lütfen beden ve renk seçiniz.", "error");
        return;
      }

      const existing = this.cart.find(item => item.name === name && item.size === size && item.color === color);
      if (existing) {
        existing.qty += 1;
        this.showToastMessage(`${name} (${size}/${color}) tekrar sepete eklendi.`, "info");
      } else {
        this.cart.push({ name, price, image, size, color, qty: 1 });
        this.showToastMessage(`${name} (${size}/${color}) sepete eklendi.`, "success");
      }

      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.isCartOpen = true;
    },

    removeFromCart(index) {
      const removedItem = this.cart[index];
      this.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.showToastMessage(`${removedItem.name} (${removedItem.size}/${removedItem.color}) sepetten çıkarıldı.`, "error");
    },

    increase(item) {
      item.qty += 1;
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    decrease(item) {
      if (item.qty > 1) item.qty -= 1;
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    totalPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    },

    getShippingCost() {
      return this.totalPrice() >= 1000 ? 0 : 30;
    },

    showToastMessage(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },

    goToPaymentPage() {
      if (this.cart.length === 0) {
        alert('Sepetiniz boş. Lütfen ürün ekleyin.');
        return;
      }
      window.location.href = "#payment";
    },

    submitOrder() {
      alert('Siparişiniz alınmıştır. Teşekkür ederiz!');
      this.cart = [];
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  };
}

function productComponent(name, price, description, image, isNew, isPopular) {
  return {
    product: {
      name,
      price,
      description,
      image,
      isNew,
      isPopular,
      selectedSize: '',
      selectedColor: ''
    }
  };
}