
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [isChef, setIsChef] = useState(false);
  const [burritos, setBurritos] = useState([]);
  const [condiments, setCondiments] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderResponse, setOrderResponse] = useState("");

  // New state for current selection
  const [currentBurrito, setCurrentBurrito] = useState(null);
  const [currentCondiments, setCurrentCondiments] = useState([]);
  const [currentQuantity, setCurrentQuantity] = useState(1);

  const [orders, setOrders] = useState([]);


  useEffect(() => {
    async function fetchData() {
      try {
        const burritosResponse = await axios.get("http://localhost:3001/api/burrito");
        setBurritos(burritosResponse.data || []);
      } catch (error) {
        console.error('Error fetching burritos:', error);
      }

      try {
        const condimentsResponse = await axios.get("http://localhost:3001/api/condiments");
        setCondiments(condimentsResponse.data || []);
      } catch (error) {
        console.error('Error fetching condiments:', error);
      }
    }

    fetchData();
    if (isChef) {
      fetchOrders();
    }
    
  }, [isChef]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };



  const renderOrderItems = (items) => {
    return items.map((item, index) => (
      <tr key={index}>
        <td>{item.burrito && item.burrito.details ? item.burrito.details.name : "Unknown"}</td>
        <td>{item.burrito && item.burrito.quantity ? item.burrito.quantity : "N/A"}</td>
        <td>
          {item.condiments && item.condiments.length > 0
            ? item.condiments.map((c, i) => c && c.details ? c.details.name : "Unknown Condiment").join(", ")
            : "No Condiments"}
        </td>
      </tr>
    ));
  };
  
  const renderOrdersTable = () => {
    return orders.map((order, index) => (
      <div key={index}>
        <h4>Order ID: {order._id}</h4>
        <table>
          <thead>
            <tr>
              <th>Burrito</th>
              <th>Quantity</th>
              <th>Condiments</th>
            </tr>
          </thead>
          <tbody>
            {renderOrderItems(order.items)}
          </tbody>
        </table>
        <p>Total Cost: ${order.totalCost ? order.totalCost.toFixed(2) : "N/A"}</p>
      </div>
    ));
  };
  
  
 

  const handleSelectBurrito = (event) => {
    const burritoId = event.target.value;
    const burrito = burritos.find(b => b._id === burritoId);
    setCurrentBurrito(burrito);
  };

  const calculateItemTotal = (item) => {
    let itemTotal = item.burrito.price * item.quantity;
    item.condiments.forEach(condiment => {
      itemTotal += condiment.price * item.quantity; // Assuming each condiment's quantity is always in sync with burrito's quantity
    });
    return itemTotal.toFixed(2);
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(calculateItemTotal(item)), 0).toFixed(2);
  };

  const handleSelectCondiment = (condimentId) => {
    setCurrentCondiments(prevCondiments => {
      if (prevCondiments.includes(condimentId)) {
        return prevCondiments.filter(id => id !== condimentId);
      } else {
        return [...prevCondiments, condimentId];
      }
    });
  };

  const addToCart = () => {
    if (currentBurrito) {
      const newItem = {
        burrito: currentBurrito,
        condiments: currentCondiments.map(condimentId => condiments.find(c => c._id === condimentId)),
        quantity: currentQuantity
      };
      setCart([...cart, newItem]);

      // Reset current selection
      setCurrentBurrito(null);
      setCurrentCondiments([]);
      setCurrentQuantity(1);
    }
  };

  const submitOrder = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/orders", { items: cart });
      const orderSummary = cart.map(item => `${item.burrito.name} x ${item.quantity}`).join(', ');
      const orderTotalCost = calculateCartTotal();
      setOrderResponse(`Order Success! Summary: ${orderSummary}. Total Cost: $${orderTotalCost}`);
      setCart([]); 
    } catch (error) {
      console.error('Error submitting order:', error);
      setOrderResponse(`Failed to place order: ${error.message}`);
    }
  };
  const renderCartItems = () => {
    return cart.map((item, index) => (
      <tr key={index}>
        <td>{item.burrito.name} x {item.quantity}</td>
        <td>{item.condiments.map(c => c.name).join(", ")}</td>
        <td>${calculateItemTotal(item)}</td>
      </tr>
    ));
  };

  return (
    <div>
      <h2>Burrito Shop</h2>

      {/* User Type Selection */}
      <div>
        <label>
          Select User Type:
          <select onChange={(e) => setIsChef(e.target.value === 'chef')}>
            <option value="customer">Customer</option>
            <option value="chef">Chef</option>
          </select>
        </label>
      </div>

       {/* Chef View */}
       {isChef && (
        <div>
          <h3>All Orders</h3>
          {renderOrdersTable()}
        </div>
      )}
      
      {!isChef && (
        <>
          {/* Burrito Selection */}
          <div>
            <h4>Select Burrito</h4>
            <select value={currentBurrito?._id || ''} onChange={handleSelectBurrito}>
              <option value="">-- Select Burrito --</option>
              {burritos.map((burrito) => (
                <option key={burrito._id} value={burrito._id}>{burrito.name}</option>
              ))}
            </select>
            <p>Price: ${currentBurrito?.price ? currentBurrito.price.toFixed(2) : '0.00'}</p>
          </div>

          {/* Condiment Selection */}
          <div>
            <h4>Select Condiments</h4>
            {condiments.map((condiment) => (
              <div key={condiment._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={currentCondiments.includes(condiment._id)}
                    onChange={() => handleSelectCondiment(condiment._id)}
                  />
                  {condiment.name}
                </label>
              </div>
            ))}
          </div>
          

          <button onClick={addToCart}>Add To Cart</button>
      <button onClick={submitOrder} disabled={cart.length === 0}>Submit Order</button>

       <div>
        <h3>Cart</h3>
        <table>
          <thead>
            <tr>
              <th>Burrito</th>
              <th>Condiments</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {renderCartItems()}
            {cart.length > 0 && (
              <tr>
                <td colSpan="2">Total</td>
                <td>${calculateCartTotal()}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

          {/* Submit Order Button */}
          <button onClick={submitOrder} disabled={cart.length === 0}>Submit Order</button>

          {/* Order Response */}
          {orderResponse && (
            <div>
              <h3>Order Response:</h3>
              <pre>{orderResponse}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

