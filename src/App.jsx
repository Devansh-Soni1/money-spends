import React, { useEffect, useState } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [spends, setSpends] = useState([]);
  const [editId, setEditId] = useState(null);

  // 🔹 FETCH SPENDS
  async function fetchSpends() {
    const res = await fetch("http://localhost:3000/Spends");
    const data = await res.json();
    setSpends(data.reverse());
  }

  useEffect(() => {
    fetchSpends();
  }, []);

  // 🔹 ADD / UPDATE SPEND
  async function addSpend(e) {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    if (!note.trim()) {
      toast.error("Note is required");
      return;
    }

    const now = new Date();

    const spendData = {
      amount,
      note,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (editId) {
      // UPDATE
      await fetch(`http://localhost:3000/Spends/${editId}`, {
        method: "PATCH",
        body: JSON.stringify(spendData),
      });

      toast.success("Spend updated");
      setEditId(null);
    } else {
      // ADD
      await fetch("http://localhost:3000/Spends", {
        method: "POST",
        body: JSON.stringify(spendData),
      });

      toast.success("Spend added");
    }

    setAmount("");
    setNote("");
    fetchSpends();
  }

  // 🔹 EDIT
  function editSpend(spend) {
    setEditId(spend.id);
    setAmount(spend.amount);
    setNote(spend.note);
  }

  // 🔹 DELETE
  async function deleteSpend(id) {
    await fetch(`http://localhost:3000/Spends/${id}`, {
      method: "DELETE",
    });

    toast.success("Spend deleted");
    fetchSpends();
  }

  return (
    <>
      <Toaster />

      <div className="spend-container">

        {/* INPUT BOX */}
        <form className="spend-box" onSubmit={addSpend}>
          <h3>{editId ? "Edit Spend" : "Add Spend"}</h3>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="text"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button type="submit">
            {editId ? "Update" : "Add"}
          </button>
        </form>

        {/* LIST */}
        <div className="spend-list">
          {spends.length === 0 ? (
            <p className="no-spend">No spends yet</p>
          ) : (
            spends.map((item) => (
              <div className="spend-item" key={item.id}>
                <div className="spend-info">
                  <h4>₹{item.amount}</h4>
                  <p>{item.note}</p>
                  <span>{item.date} • {item.time}</span>
                </div>

                <div className="spend-actions">
                  <button
                    className="edit-btn"
                    onClick={() => editSpend(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteSpend(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}

export default App;
