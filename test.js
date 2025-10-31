const entries = [
  {
    entry_id: 1005,
    entry_date: new Date("2025-10-27T10:00:00"),
    comments: "New entry booked via online portal.",
    User_user_id: "USR-004",
    Customer_customer_id: 505,
  },
  {
    entry_id: 1001,
    entry_date: new Date("2025-10-20T09:30:00"),
    comments: "Initial consultation. Customer interested in premium plan.",
    User_user_id: "USR-001",
    Customer_customer_id: 501,
  },
  {
    entry_id: 1002,
    entry_date: new Date("2025-10-22T14:00:00"),
    comments: "Follow-up entry to review progress.",
    User_user_id: "USR-002",
    Customer_customer_id: 502,
  },
  {
    entry_id: 1000,
    entry_date: new Date("2025-10-22T17:00:00"),
    comments: "Follow-up entry to continue.",
    User_user_id: "USR-002",
    Customer_customer_id: 502,
  },
  {
    entry_id: 1003,
    entry_date: new Date("2025-10-24T11:15:00"),
    comments: "Routine checkup — no issues reported.",
    User_user_id: "USR-003",
    Customer_customer_id: 503,
  },
  {
    entry_id: 1004,
    entry_date: new Date("2025-10-26T16:45:00"),
    comments: "Customer requested reschedule for next week.",
    User_user_id: "USR-001",
    Customer_customer_id: 504,
  },

  {
    entry_id: 1006,
    entry_date: new Date("2025-10-20T11:30:00"),
    comments: "TEST ADDED MANUALLY",
    User_user_id: "USR-001",
    Customer_customer_id: 508,
  },
];

let sorted = {};

for (let i = 0; i < entries.length; i++) {
  const date = entries[i].entry_date.toLocaleDateString("en-CA").split("T")[0];

  if (!(date in sorted)) {
    sorted[date] = [];
  }

  sorted[date].push(entries[i]);
}

groupedEntries = Object.entries(sorted)
  .map(([date, entries]) => ({ date, entries }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

console.log("Sorted array: ", groupedEntries);
