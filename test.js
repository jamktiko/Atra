const entries = [
  {
    appointment_id: 1001,
    appointment_date: new Date("2025-10-20T09:30:00"),
    comments: "Initial consultation. Customer interested in premium plan.",
    User_user_id: "USR-001",
    Customer_customer_id: 501,
  },
  {
    appointment_id: 1002,
    appointment_date: new Date("2025-10-22T14:00:00"),
    comments: "Follow-up appointment to review progress.",
    User_user_id: "USR-002",
    Customer_customer_id: 502,
  },
  {
    appointment_id: 1000,
    appointment_date: new Date("2025-10-22T17:00:00"),
    comments: "Follow-up appointment to continue.",
    User_user_id: "USR-002",
    Customer_customer_id: 502,
  },
  {
    appointment_id: 1003,
    appointment_date: new Date("2025-10-24T11:15:00"),
    comments: "Routine checkup — no issues reported.",
    User_user_id: "USR-003",
    Customer_customer_id: 503,
  },
  {
    appointment_id: 1004,
    appointment_date: new Date("2025-10-26T16:45:00"),
    comments: "Customer requested reschedule for next week.",
    User_user_id: "USR-001",
    Customer_customer_id: 504,
  },
  {
    appointment_id: 1005,
    appointment_date: new Date("2025-10-27T10:00:00"),
    comments: "New appointment booked via online portal.",
    User_user_id: "USR-004",
    Customer_customer_id: 505,
  },
];

let sorted = {};
for (let i = 0; i < entries.length; i++) {
  //converts Date object to string key
  const date = entries[i].appointment_date.toISOString().split("T")[0];
  if (sorted[date] == null) sorted[date] = [];

  sorted[date].push(entries[i]);
}

console.log("Sorted array: ", sorted);
