import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/CartItem.model';
import { AuthService } from '../services/auth';

@Component({
  standalone:false,
  selector: 'app-cart',
  templateUrl: './cart.html',
    styleUrls: ['./cart.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCart();
  }

 loadCart(): void {
  const token = this.authService.getToken();
  if (!token) {
    console.error('No token');
    return;
  }

  this.cartService.getCart(token).subscribe({
    next: (items) => {
      this.cartItems = items;
      this.total = items.reduce((sum, item) => sum + (item.quantity * item.priceSnapshot), 0);
      console.log('Cart items loaded:', items);
    },
    error: (err) => {
      console.error('Error loading cart:', err);
    }
  });
}


  
  removeFromCart(itemId: number): void {
  this.cartService.removeItem(itemId).subscribe({
    next: (res) => {
      console.log(res.message);  // ✅ should show "Item removed successfully"
      this.loadCart();
    },
    error: (error) => {
      console.error('Error removing item from cart:', error);
    }
  });
}
increase(item: CartItem): void {
  this.cartService.increaseQuantity(item.userEmail, item.productName).subscribe({
    next: (res) => {
      console.log("Increased:", res);
      this.loadCart();
    },
    error: (err) => {
      console.error("Error increasing quantity:", err);
    }
  });
}

decrease(item: CartItem): void {
  this.cartService.decreaseQuantity(item.userEmail, item.productName).subscribe({
    next: (res) => {
      if (res.message) {
        console.log(res.message);  // "Item removed from cart."
      } else {
        console.log("Decreased:", res);
      }
      this.loadCart();
    },
    error: (err) => {
      console.error("Error decreasing quantity:", err);
    }
  });
}


}



