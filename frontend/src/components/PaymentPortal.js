import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentPortal.css";

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://localhost:3001/user/viewPendingPayments",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Error fetching payments:", errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("No Payments are Pending Currently. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [navigate]);

  const handleStatusChange = async (payment, newStatus) => {
    if (!payment) {
      console.error("Payment is undefined");
      setError("Failed to update payment status. Payment is undefined.");
      return;
    }

    const { amount, date, reference } = payment; // Extract fields from payment
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://localhost:3001/user/updatePaymentStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, date, reference, status: newStatus }), // Send unique fields and status
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error updating payment status:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update payment status locally
      setPayments((prevPayments) =>
        prevPayments.map((p) =>
          p.amount === amount && p.date === date && p.reference === reference
            ? { ...p, status: newStatus }
            : p
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      setError("Failed to update payment status. Please try again later.");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="payment-portal-container">
      <h2>Your Payments</h2>
      {error ? (
        <div className="error-message">{error}</div>
      ) : payments.length > 0 ? (
        <table className="portal-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Account Holder</th>
              <th>Account Number</th>
              <th>Reference</th>
              <th>SWIFT Code</th>
              <th>Date of Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.amount}</td>
                <td>{payment.currency}</td>
                <td>{payment.provider}</td>
                <td>{payment.accountHolder}</td>
                <td>{payment.accountNumber}</td>
                <td>{payment.reference}</td>
                <td>{payment.swiftCode}</td>
                <td>{payment.date}</td>
                <td>{payment.status}</td>
                <td>
                  {payment.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(payment, "Approved")}
                        className="approve-button"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(payment, "Denied")}
                        className="reject-button"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-payments-message">
          Currently, all app payments have been checked.
        </div>
      )}
    </div>
  );
};

export default ViewPayments;
