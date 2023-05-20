import React, { useState, useEffect } from "react";
import { useStateValue } from "../../StateProvider";
import { getBasketTotal } from "../../reducer";
import CheckoutProduct from "../Checkout/CheckoutProduct/CheckoutProduct";
import { Link, useNavigate } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "./../../axios.js";
import db from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

import "../Payment/Payment.css";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();

  const navigate = useNavigate();

  const [error, setError] = useState(null); //to show error
  const [disabled, setDisabled] = useState(true); //Disable the button
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [clientSecret, setClientSecret] = useState("true");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // generate stripe secret api which allows us to charge the client
    const getClientSecret = async () => {
      //axios is a request
      const response = await axios({
        method: "post",
        //submits how much you will be deducting the client
        //stripe expects that we send them sub units so we multiply the dollah with a 100 "$1=c100"
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      console.log({ getBasketTotal });
      setClientSecret(response.data.clientSecret);
      return response;
    };

    getClientSecret();
  }, [basket]);

  console.log("here's the secret API =====>", clientSecret);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        const ref = doc(db, "users", user?.uid, "orders", paymentIntent.id);
        setDoc(ref, {
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });
        setSucceeded(true);
        setError(null);
        setProcessing(false);
        dispatch({
          type: "EMPTY_BASKET",
        });
        navigate("/orders", { replace: true });
      });

    const handleChange = (event) => {
      // Listening any changes in CardElement
      // Display errors
      setDisabled(event.empty);
      setError(event.error ? event.error.message : "");
    };

    return (
      <div className="payment">
        <div className="payment-container">
          {/*Number of items added in Basket*/}
          <h1>
            Checkout (<Link to="/checkout">{basket.length} items </Link>)
          </h1>

          {/* Delivery */}
          <div className="payment-section">
            <div className="payment-title">
              <h3>Delivery Address</h3>
            </div>
            <div className="payment-address">
              <p>{(user && user.email) || "User Email"}</p>
              <p>{(user && user.address) || "123 React Lane"}</p>
              <p>{(user && user.city) || "Los Angeles, CA"}</p>
            </div>
          </div>

          {/* review */}
          <div className="payment-section">
            <div className="payment-title">
              <h3>Review items and delivery</h3>
            </div>
            <div className="payment-items">
              {basket.map((item) => (
                <CheckoutProduct
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                />
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div className="payment-section">
            <div className="payment-title">
              <h3>Payment Method</h3>
            </div>
            <div className="payment-details">
              {/* Stripe */}
              <form onSubmit={handleSubmit}>
                <CardElement onChange={handleChange} />

                <div className="payment-price">
                  <CurrencyFormat
                    renderText={(value) => <h3>Order Total: {value}</h3>}
                    decimalScale={2}
                    value={getBasketTotal(basket)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />

                  <button disabled={processing || disabled || succeeded}>
                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                  </button>

                  {/* Errors */}
                  {error && <div>{error}</div>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default Payment;
