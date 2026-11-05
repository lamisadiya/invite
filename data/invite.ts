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
  photos: ["/invite/photo-1.jpg", "/invite/photo-2.jpg", "/invite/photo-3.jpeg"],
  events: [
    { title: "Wedding Reception",     dateISO: "2027-01-01T18:00:00+06:00", when: "Friday, 1 January 2027", time: "Evening", place: "ICCB, Dhaka", blurb: "An evening of love, elegance, and celebration as we come together to honour the newlyweds and celebrate the beginning of their forever. A night made special by the presence of our beloved family and friends.", image: "/invite/event.jpg" },
    { title: "Holud",    dateISO: "2026-12-26T18:00:00+06:00", when: "Saturday, 26 December 2026", time: "Evening", place:"Lazzi Polli Resort", blurb: "A traditional pre-wedding celebration filled with turmeric, blessings, music, laughter, and the warmth of family and friends as we celebrate the bride and groom before their big day.", image: "/invite/holud.png" }
  ]
} as const;
