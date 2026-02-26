// Shared Invoice Design Elements for INVORA Theme - Reference Layout
// Colors based on the reference image
export const COLORS = {
    PRIMARY: [26, 188, 156],      // Turquoise (#1abc9c) - Used for sidebar and totals
    SECONDARY: [44, 62, 80],      // Dark Navy/Gray (#2c3e50) - Used for title and table headers
    ACCENT: [52, 152, 219],       // Sky Blue (#3498db)
    TEXT_DARK: [33, 37, 41],      // Near black for main text
    TEXT_LIGHT: [108, 117, 125],  // Grey for labels
    WHITE: [255, 255, 255],
    BG_LIGHT: [248, 251, 253],    // Very light blue for payment info box
    WATERMARK: [240, 240, 240]    // Faint gray for watermark
};

/**
 * Draws the vertical sidebar on the left
 */
const drawSidebar = (doc) => {
    doc.setFillColor(...COLORS.PRIMARY);
    doc.rect(0, 0, 15, 297, 'F');
};

/**
 * Draws the "INVORA" watermark diagonally across the page
 */
const drawWatermark = (doc) => {
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.05 }));
    doc.setFontSize(140);
    doc.setTextColor(180, 180, 180);
    doc.setFont("helvetica", "bold");
    doc.text("INVORA", 35, 180, { angle: 35 });
    doc.restoreGraphicsState();
};

/**
 * Draws a dummy QR Code placeholder - closer to reference image
 */
const drawQRCode = (doc, x, y) => {
    doc.setFillColor(30, 30, 30);
    doc.rect(x, y, 25, 25, 'F');
    doc.setFillColor(255, 255, 255);

    // Create a more realistic QR pattern
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (Math.random() > 0.4) {
                // Main pattern
                if (!((i < 3 && j < 3) || (i > 6 && j < 3) || (i < 3 && j > 6))) {
                    doc.rect(x + 1.5 + i * 2.2, y + 1.5 + j * 2.2, 1.8, 1.8, 'F');
                }
            }
        }
    }
    // Squares in corners
    doc.rect(x + 1.5, y + 1.5, 6, 6, 'F');
    doc.rect(x + 17.5, y + 1.5, 6, 6, 'F');
    doc.rect(x + 1.5, y + 17.5, 6, 6, 'F');

    doc.setFillColor(30, 30, 30);
    doc.rect(x + 2.5, y + 2.5, 4, 4, 'F');
    doc.rect(x + 18.5, y + 2.5, 4, 4, 'F');
    doc.rect(x + 2.5, y + 18.5, 4, 4, 'F');
};

/**
 * Applies the reference layout header
 */
export const applyInvoiceHeader = (doc, title, invoiceNo, date, clientLabel = "BILL TO", clientName = "Valued Client") => {
    drawSidebar(doc);
    drawWatermark(doc);

    // Header Left - Title and ID
    doc.setTextColor(...COLORS.SECONDARY);
    doc.setFontSize(48);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 28, 48);

    doc.setFontSize(14);
    doc.setTextColor(...COLORS.PRIMARY);
    doc.text(`#${invoiceNo}`, 28, 58);

    // Header Right - Company Info
    doc.setTextColor(...COLORS.SECONDARY);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Invora Systems Inc.", 195, 35, { align: "right" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.TEXT_LIGHT);
    doc.text("123 Tech Park, Silicon Valley", 195, 42, { align: "right" });
    doc.text("California, USA 94000", 195, 48, { align: "right" });
    doc.text("support@invora.com", 195, 54, { align: "right" });

    // Divider line below header
    doc.setDrawColor(240, 240, 240);
    doc.line(28, 68, 195, 68);

    // Middle Section - Bill To and Vendor Info
    doc.setTextColor(...COLORS.TEXT_LIGHT);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("BILL TO", 28, 90);
    doc.text("VENDOR", 90, 90);

    doc.setTextColor(...COLORS.SECONDARY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(clientName, 28, 98);
    doc.text("General Gadgets Inc", 90, 98);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.TEXT_LIGHT);
    doc.setFontSize(11);
    doc.text("Store Department", 28, 104);
    doc.text("Internal Procurement", 28, 110);

    doc.text("Authorized Supplier", 90, 104);

    drawQRCode(doc, 165, 80);
};

/**
 * Draws Payment Info Box
 */
export const drawPaymentInfo = (doc, startY) => {
    doc.setFillColor(...COLORS.BG_LIGHT);
    doc.roundedRect(28, startY, 82, 48, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(...COLORS.TEXT_LIGHT);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT INFO", 33, startY + 12);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.SECONDARY);
    doc.text("Bank: HDFC Bank", 33, startY + 22);
    doc.text("Account: 1234 5678 9000", 33, startY + 28);
    doc.text("IFSC: HDFC0001234", 33, startY + 34);
    doc.text("Status: Paid via Credit Balance", 33, startY + 40);
};

/**
 * Branded Footer
 */
export const applyInvoiceFooter = (doc) => {
    // Reference image shown minimal/no footer but we add a small green bar if needed
    // The sidebar handles the main vertical visual
};

/**
 * Table Styles for Reference Design
 */
export const getInvoiceTableStyles = () => {
    return {
        theme: 'plain',
        headStyles: {
            fillColor: COLORS.SECONDARY,
            textColor: COLORS.WHITE,
            fontStyle: 'bold',
            fontSize: 11,
            halign: 'left',
            cellPadding: 5
        },
        bodyStyles: {
            textColor: COLORS.SECONDARY,
            fontSize: 11,
            cellPadding: 6
        },
        alternateRowStyles: {
            fillColor: [255, 255, 255]
        },
        margin: { left: 28, right: 15 },
        styles: {
            lineColor: [240, 240, 240],
            lineWidth: 0.1
        },
        columnStyles: {
            0: { cellWidth: 80 }, // Item Description
            1: { halign: 'center', cellWidth: 20 }, // QTY
            2: { halign: 'right', cellWidth: 35 }, // Unit Price
            3: { halign: 'right', cellWidth: 35 }  // Total
        }
    };
};

/**
 * Total Amount Section
 */
export const drawTotalSection = (doc, startY, subtotal, total, totalLabel = "TOTAL") => {
    const startX = 140;
    const endX = 195;

    doc.setFontSize(11);
    doc.setTextColor(...COLORS.TEXT_LIGHT);
    doc.setFont("helvetica", "normal");

    doc.text("Subtotal:", startX, startY + 10);
    doc.setTextColor(...COLORS.SECONDARY);
    doc.text(`Rs. ${total.toLocaleString()}`, endX, startY + 10, { align: "right" });

    doc.setTextColor(...COLORS.TEXT_LIGHT);
    doc.text("Tax (0%):", startX, startY + 20);
    doc.setTextColor(...COLORS.SECONDARY);
    doc.text("Rs. 0.00", endX, startY + 20, { align: "right" });

    // Divider line
    doc.setDrawColor(230, 230, 230);
    doc.line(140, startY + 30, 195, startY + 30);

    doc.setFontSize(16);
    doc.setTextColor(...COLORS.PRIMARY);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", startX, startY + 45);
    doc.text(`Rs. ${total.toLocaleString()}`, endX, startY + 45, { align: "right" });

    drawPaymentInfo(doc, startY);
};
