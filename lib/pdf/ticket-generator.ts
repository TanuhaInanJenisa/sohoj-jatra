import jsPDF from "jspdf";
import { Booking } from "@/types";
import { formatCurrencyBDT, formatDateBD, formatTimeBD } from "@/lib/utils";

export async function generateTicketPDF(booking: Booking): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Colors
  const emerald = [5, 150, 105]; // #059669
  const darkNavy = [15, 23, 42]; // #0f172a
  const grayText = [100, 116, 139]; // #64748b

  // 1. Header Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 36, "F");

  doc.setFillColor(emerald[0], emerald[1], emerald[2]);
  doc.rect(0, 36, 210, 3, "F");

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SOHOJ JATRA (সহজ যাত্রা)", 15, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text("Enterprise Cloud Bus Ticketing & Counter SaaS", 15, 25);

  // Operator Badge
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(52, 211, 153);
  doc.text((booking.operator_name || "Green Line Paribahan").toUpperCase(), 195, 18, { align: "right" });

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Coach: ${booking.coach_number || "GL-701"} (${booking.bus_type || "AC Business"})`, 195, 25, { align: "right" });

  // 2. Ticket PNR Card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 46, 180, 28, 3, 3, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 46, 180, 28, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text("PNR / BOOKING REF:", 25, 57);

  doc.setFontSize(16);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  doc.text(booking.pnr_number, 25, 66);

  doc.setFontSize(10);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text("BOOKING DATE & TIME:", 110, 57);

  doc.setFontSize(11);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`${formatDateBD(booking.created_at)} at ${formatTimeBD(booking.created_at)}`, 110, 65);

  // 3. Journey & Trip Details
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 80, 180, 48, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("TRIP INFORMATION", 25, 90);

  doc.setFontSize(9);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text("FROM (ORIGIN)", 25, 99);
  doc.text("TO (DESTINATION)", 85, 99);
  doc.text("DEPARTURE TIME", 145, 99);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(booking.origin_city || "Dhaka", 25, 106);
  doc.text(booking.destination_city || "Cox's Bazar", 85, 106);
  doc.text(booking.departure_time ? formatTimeBD(booking.departure_time) : "04:30 PM", 145, 106);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text(`Boarding Counter: ${booking.boarding_counter_name || "Rajarbagh"}`, 25, 118);
  doc.text(`Dropping Point: ${booking.dropping_point || "Kolatoli Beach"}`, 110, 118);

  // 4. Passenger Details & Seat Matrix
  doc.roundedRect(15, 134, 180, 50, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("PASSENGER & SEAT RESERVATION", 25, 144);

  doc.setFontSize(9);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text("PASSENGER NAME", 25, 153);
  doc.text("CONTACT PHONE", 85, 153);
  doc.text("GENDER / NID", 145, 153);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(booking.passenger_name, 25, 160);
  doc.text(booking.passenger_phone, 85, 160);
  doc.text(`${booking.passenger_gender} ${booking.passenger_nid ? `(${booking.passenger_nid})` : ""}`, 145, 160);

  // Seat Badge Highlights
  doc.setFillColor(emerald[0], emerald[1], emerald[2]);
  doc.roundedRect(25, 166, 160, 10, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `CONFIRMED SEATS (${booking.total_seats}): ${booking.seat_numbers.join(", ")}`,
    105,
    173,
    { align: "center" }
  );

  // 5. Financial Breakdown
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 190, 180, 44, 2, 2, "F");
  doc.roundedRect(15, 190, 180, 44, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("PAYMENT SUMMARY", 25, 200);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text(`Base Ticket Fare (${booking.total_seats} seats):`, 25, 208);
  doc.text(formatCurrencyBDT(booking.total_fare), 90, 208, { align: "right" });

  doc.text("Counter Service Fee:", 25, 215);
  doc.text(formatCurrencyBDT(booking.service_charge), 90, 215, { align: "right" });

  doc.text("Promotional Discount:", 25, 222);
  doc.text(`- ${formatCurrencyBDT(booking.discount_amount)}`, 90, 222, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  doc.text("NET AMOUNT PAID:", 115, 208);
  doc.setFontSize(16);
  doc.text(formatCurrencyBDT(booking.net_fare), 115, 218);

  doc.setFontSize(9);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text(`Method: ${booking.payment_method.toUpperCase()} | Status: PAID`, 115, 226);

  // 6. Terms & Perforation Cut Line
  doc.setLineDashPattern([2, 2], 0);
  doc.setDrawColor(148, 163, 184);
  doc.line(15, 244, 195, 244);
  doc.setLineDashPattern([], 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text("TERMS & BOARDING CONDITIONS:", 15, 252);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("1. Passengers must report at the departure counter at least 30 minutes before scheduled departure.", 15, 258);
  doc.text("2. Tickets are non-refundable after scheduled departure time. Cancellation permitted up to 6 hours prior.", 15, 263);
  doc.text("3. Carrying hazardous materials, inflammable substances, or contraband items is strictly prohibited by law.", 15, 268);
  doc.text("4. Sohoj Jatra Cloud SaaS Platform is the authorized digital ticketing partner for this bus operator.", 15, 273);

  // Barcode representation
  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`*${booking.pnr_number}*`, 105, 285, { align: "center" });

  // Download the generated PDF
  doc.save(`Ticket_${booking.pnr_number}.pdf`);
}
