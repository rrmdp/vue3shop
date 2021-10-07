let app = Vue.createApp({
    data() {
      return {
        inventory:[],
        cart: { },
         cartVisible:true
      }
    },
    methods: {
      addToCart(name,i) {

        if(!this.cart[name]) this.cart[name] = 0

        this.cart[name] += this.inventory[i].quantity
        this.inventory[i].quantity = 0;
      },
      cartToggle() {

        return this.cartVisible = !this.cartVisible;

      },
      removeItem(name) {
        delete this.cart[name]
      },
      totalQuantity() {
        return Object.values(this.cart).reduce((acc, curr) => {
          return acc + curr
        }, 0)
      }
    },
    async mounted() {
      console.log('Mounted...');
      const res = await fetch('./food.json')
      const data = await res.json();
      console.log(data);
      this.inventory = data
    }
  })

  app.component('cart',{

    data() {

      return {

       
      }

    },
    methods: {
      getPrice(name) {

        const product = this.inventory.find((p) => {return p.name === name})

        return product.price.USD;
      },
      getIcon(i) {
        return this.inventory[i].icon;
      },
      calculateTotal() {
        const total = Object.entries(this.cart).reduce((acc, curr, index) => {
          return acc + (curr[1] * this.getPrice(curr[0]))
        }, 0)

        return total.toFixed(2)
      }


    },
    props:['toggle','cart','inventory','remove'],

    template: `
    <aside class="cart-container" >
    <div class="cart">
      <h1 class="cart-title spread">
        <span>
          Cart
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button class="cart-close" @click="toggle">&times;</button>
      </h1>

      <div class="cart-body">
        <table class="cart-table">
          <thead>
            <tr>
              <th><span class="sr-only">Product Image</span></th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(qty,name,i) in cart" :key="i">
              <td><i class="icofont-{{getIcon(i)}} icofont-3x"></i></td>
              <td>{{name}}</td>
              <td>\${{getPrice(name).toFixed(2)}}</td>
              <td class="center">{{qty}}</td>
              <td>\${{(qty * getPrice(name)).toFixed(2)}}</td>
              <td class="center">
                <button class="btn btn-light cart-remove" @click="remove(name)">
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="center" v-if="Object.keys(this.cart).length == 0"><em>No items in cart</em></p>
        <br>
        <div class="spread">
          <span><strong>Total:</strong> \${{calculateTotal()}}</span>
          <button class="btn btn-light">Checkout</button>
        </div>
      </div>
    </div>
  </aside>
    `

  })

  app.mount('#app')