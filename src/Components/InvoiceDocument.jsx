import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// ========== Styles ==========
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    backgroundColor: "#fff",
    color: "#333",
  },
  container: {
    flex: 1,
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 20,
  },
  logoContainer: {
    width: "40%",
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 9,
    color: "#7f8c8d",
    lineHeight: 1.4,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 8,
  },
  invoiceMeta: {
    fontSize: 10,
    textAlign: "right",
    lineHeight: 1.6,
  },
  invoiceNumber: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  buyerInfo: {
    width: "48%",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
    borderBottom: "1px solid #eee",
    paddingBottom: 4,
  },
  infoText: {
    fontSize: 10,
    marginBottom: 5,
    color: "#34495e",
  },
  table: {
    marginTop: 20,
    border: "1px solid #e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    color: "#fff",
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e0e0e0",
    paddingVertical: 8,
  },
  cell: {
    padding: 8,
    fontSize: 10,
    textAlign: "left",
  },
  col1: { width: "10%", paddingLeft: 12 },
  col2: { width: "40%" },
  col3: { width: "15%", textAlign: "right" },
  col4: { width: "15%", textAlign: "right" },
  col5: { width: "20%", textAlign: "right", paddingRight: 12 },

  totalsBox: {
    marginTop: 20,
    alignSelf: "flex-end",
    width: "40%",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: "#7f8c8d",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  grandTotal: {
    borderTop: "1px solid #e0e0e0",
    marginTop: 6,
    paddingTop: 6,
    fontWeight: "extrabold",
    color: "#2c3e50",
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: "1px solid #e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inWords: {
    fontSize: 10,
    color: "#7f8c8d",
    fontStyle: "italic",
    width: "60%",
  },
  signature: {
    width: "30%",
    textAlign: "center",
  },
  signatureLine: {
    borderTop: "1px solid #bdc3c7",
    marginTop: 40,
    paddingTop: 8,
    fontSize: 10,
    color: "#7f8c8d",
  },
  thankYou: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 12,
    color: "#3498db",
    fontWeight: "bold",
  },
  notes: {
    fontSize: 9,
    color: "#95a5a6",
    marginTop: 5,
    lineHeight: 1.4,
  },
});

// ========== Helper ==========
const numberToWords = (num) => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if ((num = num.toString()).length > 9) return "Overflow";
  let n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  let str = "";
  str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore " : "";
  str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh " : "";
  str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand " : "";
  str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " Hundred " : "";
  str += n[5] != 0
    ? (str != "" ? "and " : "") + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) + " "
    : "";
  return str.trim() + " Rupees Only";
};

// ========== Main ==========
const InvoiceDocument = ({ buyer, items = [], gst = 18 }) => {
  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.qty) * Number(item.rate || 0),
    0
  );
  const tax = (subtotal * gst) / 100;
  const total = subtotal + tax;
  const invoiceDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Document>
      <Page style={styles.page} size="A4">
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {/* Replace with your actual logo */}
              <Image
                style={styles.logo}
                src="https://via.placeholder.com/120x60?text=Company+Logo"
              />
              <Text style={styles.companyName}>TechSolutions Pvt. Ltd.</Text>
              <Text style={styles.companyDetails}>
                123 Business Park, Sector 22{"\n"}
                Gurugram, Haryana - 122001{"\n"}
                GSTIN: 06AABCU9603R1ZM{"\n"}
                Phone: +91-9876543210 | Email: info@techsolutions.com
              </Text>
            </View>
            
            <View>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <View style={styles.invoiceMeta}>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Invoice #: </Text>
                  <Text style={styles.invoiceNumber}>INV-{Date.now().toString().slice(-6)}</Text>
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Date: </Text>
                  {invoiceDate}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Due Date: </Text>
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Buyer and Seller Info */}
          <View style={styles.content}>
            <View style={styles.buyerInfo}>
              <Text style={styles.sectionTitle}>BILL TO</Text>
              <Text style={[styles.infoText, { fontWeight: "bold" }]}>{buyer.name}</Text>
              <Text style={styles.infoText}>{buyer.address}</Text>
              <Text style={styles.infoText}>GSTIN: {buyer.gstin || "Not Provided"}</Text>
              <Text style={styles.infoText}>Phone: {buyer.phone}</Text>
              <Text style={styles.infoText}>Email: {buyer.email || "Not Provided"}</Text>
            </View>
            
            <View style={styles.buyerInfo}>
              <Text style={styles.sectionTitle}>COMPANY DETAILS</Text>
              <Text style={styles.infoText}>Bank: HDFC Bank</Text>
              <Text style={styles.infoText}>Account No: 123456789012</Text>
              <Text style={styles.infoText}>IFSC: HDFC0001234</Text>
              <Text style={styles.infoText}>PAN: AABCU9603R</Text>
              <Text style={styles.infoText}>Terms: Net 7 Days</Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.col1]}>#</Text>
              <Text style={[styles.cell, styles.col2]}>DESCRIPTION</Text>
              <Text style={[styles.cell, styles.col3]}>QTY</Text>
              <Text style={[styles.cell, styles.col4]}>RATE</Text>
              <Text style={[styles.cell, styles.col5]}>AMOUNT</Text>
            </View>

            {items.map((item, idx) => {
              const amount = Number(item.qty) * Number(item.rate || 0);
              return (
                <View style={styles.tableRow} key={idx}>
                  <Text style={[styles.cell, styles.col1]}>{idx + 1}</Text>
                  <Text style={[styles.cell, styles.col2]}>{item.name}</Text>
                  <Text style={[styles.cell, styles.col3]}>{item.qty}</Text>
                  <Text style={[styles.cell, styles.col4]}>₹{item.rate?.toFixed(2)}</Text>
                  <Text style={[styles.cell, styles.col5]}>
                    ₹{amount.toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Totals */}
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>GST ({gst}%):</Text>
              <Text style={styles.totalValue}>₹{tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, { marginTop: 6 }]}>
              <Text style={[styles.totalLabel, { fontWeight: "bold" }]}>Total:</Text>
              <Text style={[styles.totalValue, { fontWeight: "bold" }]}>₹{total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.inWords}>
              <Text style={styles.sectionTitle}>AMOUNT IN WORDS</Text>
              <Text>{numberToWords(Math.floor(total))}</Text>
              <Text style={[styles.notes, { marginTop: 10 }]}>
                Notes: Payment due within 7 days. Please include invoice number in your payment reference.
              </Text>
            </View>
            
            <View style={styles.signature}>
              <Text style={styles.signatureLine}>Authorized Signature</Text>
            </View>
          </View>

          <Text style={styles.thankYou}>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;