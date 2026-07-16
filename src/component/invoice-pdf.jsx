// components/InvoicePDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed (optional)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf'
// });

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
    borderBottomStyle: 'solid',
    paddingBottom: 20,
  },
  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  companyAddress: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 1.4,
  },
  invoiceInfo: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },
  invoiceDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  clientInfo: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clientSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  clientDetails: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
  },
  table: {
    marginTop: 20,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  colDescription: {
    flex: 2,
    fontSize: 11,
    color: '#1F2937',
  },
  colQuantity: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
    color: '#1F2937',
  },
  colPrice: {
    flex: 1,
    fontSize: 11,
    textAlign: 'right',
    color: '#1F2937',
  },
  colTotal: {
    flex: 1,
    fontSize: 11,
    textAlign: 'right',
    color: '#1F2937',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
  },
  totals: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#4F46E5',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF',
  },
  terms: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 1.5,
  },
});

// Main InvoicePDF component
const InvoicePDF = ({ invoice }) => {
  const {
    invoiceNumber = 'INV-2023-001',
    invoiceDate = new Date().toLocaleDateString(),
    dueDate,
    companyName = 'Your Company Name',
    companyAddress = '123 Business St.\nCity, State 12345\ncontact@company.com\n(123) 456-7890',
    companyLogo = null,
    clientName = 'Client Name',
    clientAddress = '123 Client St.\nClient City, State 12345',
    clientEmail = 'client@email.com',
    items = [
      { description: 'Web Development', quantity: 10, price: 75 },
      { description: 'UI/UX Design', quantity: 5, price: 100 },
      { description: 'Consultation', quantity: 3, price: 150 },
    ],
    taxRate = 0.1,
    discount = 0,
    currency = 'USD',
    notes = 'Thank you for your business!',
    terms = 'Payment due within 30 days. Late payments subject to 1.5% monthly interest.',
  } = invoice || {};

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax - discount;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <View style={styles.companyDetails}>
              {companyLogo && (
                <Image src={companyLogo} style={{ width: 150, marginBottom: 10 }} />
              )}
              <Text style={styles.companyName}>{companyName}</Text>
              <Text style={styles.companyAddress}>{companyAddress}</Text>
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>Invoice #: {invoiceNumber}</Text>
              <Text style={styles.invoiceDate}>Date: {invoiceDate}</Text>
              {dueDate && (
                <Text style={styles.invoiceDate}>Due Date: {dueDate}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.clientInfo}>
          <View style={styles.clientSection}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <Text style={styles.clientDetails}>
              {clientName}{'\n'}
              {clientAddress}{'\n'}
              {clientEmail}
            </Text>
          </View>
          {dueDate && (
            <View style={styles.clientSection}>
              <Text style={styles.sectionTitle}>Payment Details:</Text>
              <Text style={styles.clientDetails}>
                Due Date: {dueDate}{'\n'}
                Status: Pending{'\n'}
                Payment Method: Bank Transfer
              </Text>
            </View>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colDescription]}>Description</Text>
            <Text style={[styles.headerText, styles.colQuantity]}>Quantity</Text>
            <Text style={[styles.headerText, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.headerText, styles.colTotal]}>Total</Text>
          </View>
          
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQuantity}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatCurrency(item.price)}</Text>
              <Text style={styles.colTotal}>
                {formatCurrency(item.quantity * item.price)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          
          {discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalValue}>-{formatCurrency(discount)}</Text>
            </View>
          )}
          
          {tax > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({taxRate * 100}%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(tax)}</Text>
            </View>
          )}
          
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Notes & Terms */}
        <View style={styles.terms}>
          {notes && (
            <>
              <Text style={styles.termsTitle}>Notes</Text>
              <Text style={styles.termsText}>{notes}</Text>
            </>
          )}
          
          {terms && (
            <>
              <Text style={[styles.termsTitle, { marginTop: 15 }]}>Terms & Conditions</Text>
              <Text style={styles.termsText}>{terms}</Text>
            </>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {companyName} • {companyAddress.replace(/\n/g, ' • ')}
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;