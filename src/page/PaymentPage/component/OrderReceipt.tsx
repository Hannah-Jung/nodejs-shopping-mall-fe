import React from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = () => {
  return (
    <div className="receipt-container">
      <h3 className="receipt-title">Order Details</h3>
      <ul className="receipt-list">
        <li>
          <div className="display-flex space-between">
            <div>Item</div>
            <div>$45</div>
          </div>
        </li>
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>$Grand Total</strong>
        </div>
      </div>
      <div>
        Available payment methods, final pricing, and shipping fees are
        confirmed at checkout. We offer a 30-day return period; please note that
        return shipping fees and costs for unclaimed deliveries may apply. Read
        our [Return & Refund Policy].
      </div>
    </div>
  );
};

export default OrderReceipt;
