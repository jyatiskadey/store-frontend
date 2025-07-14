import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// ========== Styles ==========
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 30,
    backgroundColor: "#fff",
    color: "#000",
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  companyDetails: {
    fontSize: 10,
    marginTop: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  buyerInfo: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  invoiceMeta: {
    fontSize: 10,
    textAlign: "right",
    lineHeight: 1.5,
  },
  table: {
    border: "1pt solid #000",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1pt solid #000",
    backgroundColor: "#f0f0f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #ccc",
  },
  cell: {
    padding: 6,
    fontSize: 10,
    borderRight: "1pt solid #ccc",
  },
  noBorderRight: {
    borderRight: 0,
  },
  col1: { width: "10%" },
  col2: { width: "40%" },
  col3: { width: "15%" },
  col4: { width: "15%" },
  col5: { width: "20%" },

  totalsBox: {
    marginTop: 10,
    alignSelf: "flex-end",
    width: "50%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  line: {
    marginVertical: 8,
    borderBottom: "1pt solid #000",
  },
  inWords: {
    fontSize: 10,
    marginBottom: 8,
  },
  thankYou: {
    textAlign: "center",
    marginVertical: 8,
    fontWeight: "bold",
  },
  signature: {
    textAlign: "right",
    fontSize: 10,
    marginTop: 20,
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

  return (
    <Document>
      <Page style={styles.page} size="A4">
        <View style={styles.header}>
          <Text style={styles.companyName}>Company Name Pvt. Ltd</Text>
          <Text style={styles.companyDetails}>
            Street Name, City, State - 000000
          </Text>
          <Text style={styles.companyDetails}>
            GST No: ____________ | Phone: +91-99999 99999
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <View style={{ marginBottom: 6 }}>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>Buyer Name:</Text>
            <Text style={{ fontSize: 10 }}>{buyer.name}</Text>

            <Text style={{ fontSize: 10, fontWeight: "bold", marginTop: 4 }}>Phone:</Text>
            <Text style={{ fontSize: 10 }}>{buyer.phone}</Text>

            <Text style={{ fontSize: 10, fontWeight: "bold", marginTop: 4 }}>Address:</Text>
            <Text style={{ fontSize: 10 }}>{buyer.address}</Text>
          </View>


          <View style={styles.invoiceMeta}>
            <Text>Invoice No: INV{Date.now().toString().slice(-6)}</Text>
            <Text>Date: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.col1]}>Sl. No</Text>
            <Text style={[styles.cell, styles.col2]}>Item</Text>
            <Text style={[styles.cell, styles.col3]}>Qty</Text>
            <Text style={[styles.cell, styles.col4]}>Rate</Text>
            <Text style={[styles.cell, styles.col5, styles.noBorderRight]}>Amount</Text>
          </View>

          {items.map((item, idx) => {
            const amount = Number(item.qty) * Number(item.rate || 0);
            return (
              <View style={styles.tableRow} key={idx}>
                <Text style={[styles.cell, styles.col1]}>{idx + 1}</Text>
                <Text style={[styles.cell, styles.col2]}>{item.name}</Text>
                <Text style={[styles.cell, styles.col3]}>{item.qty}</Text>
                <Text style={[styles.cell, styles.col4]}>₹{item.rate?.toFixed(2)}</Text>
                <Text style={[styles.cell, styles.col5, styles.noBorderRight]}>
                  ₹{amount.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Totals */}
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text>Sub Total:</Text>
            <Text>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>GST ({gst}%):</Text>
            <Text>₹{tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, { fontWeight: "bold" }]}>
            <Text>Grand Total:</Text>
            <Text>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.line} />
        <Text style={styles.inWords}>In Words: {numberToWords(Math.floor(total))}</Text>
        <Text style={styles.thankYou}>Thank You for your purchase!</Text>
        <Text style={styles.signature}>Authorized Signature: ____________________</Text>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
