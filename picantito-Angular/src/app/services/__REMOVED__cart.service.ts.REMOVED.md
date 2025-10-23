# CartService removed

This project previously included a legacy CartService (cart.service.ts) storing data under the `cart` key in localStorage.

The cart implementation has been unified into `carrito.service.ts` using the `carrito` key and supporting adicionales.

If you had data in `cart`, the new service attempts to migrate it on startup.
