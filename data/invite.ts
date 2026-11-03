// Edit this file to personalise your wedding invitation. Keep image paths inside /public/invite.
export const invite = {
  groom: "Shadman Azad",
  bride: "Farhat Lamisa Diya",
  dateLabel: "Friday, 1 January 2027",
  // ISO date with Bangladesh time offset (+06:00), used by the countdown.
  dateISO: "2027-01-01T18:00:00+06:00",
  // Google Calendar event time in UTC format.
  calendarStart: "20270101T120000Z",
  calendarEnd: "20270101T150000Z",
  time: "Evening",
  venue: "ICCB, Dhaka",
  venueFull: "International Convention City Bashundhara (ICCB), Dhaka, Bangladesh",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=International+Convention+City+Bashundhara+Dhaka",
  groomParents: "Mr. Abul Kalam Azad & Mrs. Lithu Sharmin",
  brideParents: "Late Md. Joglul Hayder & Mrs. Papia Hayder",
  photos: ["/invite/photo-1.jpg", "/invite/photo-2.jpg", "/invite/photo-3.jpg"],
  events: [
    { title: "Wedding Reception", when: "Friday, 1 January 2027", time: "Evening", place: "ICCB, Dhaka", blurb: "The nikah, witnessed by family — a quiet promise and the beginning of a shared life.", image: "/invite/event.jpg" },
    { title: "Reception", when: "Friday, 1 January 2027", time: "Evening", place: "ICCB, Dhaka", blurb: "An evening to greet the newlyweds and share a feast with everyone they love.", image: "/invite/venue.jpg" }
  ]
} as const;
