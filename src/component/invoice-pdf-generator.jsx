// components/InvoicePDFGenerator.jsx (Optional helper component for generating/displaying PDF)
import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import InvoicePDF from './invoice-pdf';

const InvoicePDFGenerator = ({ invoiceData }) => {
  const [showPreview, setShowPreview] = useState(false);

  const sampleInvoice = {
    invoiceNumber: 'INV-2024-001',
    invoiceDate: '2024-01-15',
    dueDate: '2024-02-15',
    companyName: 'Tech Solutions Inc.',
    companyAddress: '123 Tech Street\nSan Francisco, CA 94107\ncontact@techsolutions.com\n(555) 123-4567',
    clientName: 'Acme Corporation',
    clientAddress: '456 Business Ave\nNew York, NY 10001',
    clientEmail: 'billing@acmecorp.com',
    items: [
      { description: 'Website Development', quantity: 40, price: 75 },
      { description: 'Mobile App Design', quantity: 20, price: 100 },
      { description: 'Project Management', quantity: 10, price: 150 },
      { description: 'Technical Support', quantity: 5, price: 80 },
    ],
    taxRate: 0.1,
    discount: 100,
    currency: 'USD',
    notes: 'All work completed as per contract specifications.',
    terms: 'Payment due within 30 days of invoice date. A 1.5% monthly service charge is applicable on overdue balances.',
  };

  const invoice = invoiceData || sampleInvoice;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoice Generator</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          
          <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} />}
            fileName={`invoice-${invoice.invoiceNumber}.pdf`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors no-underline"
          >
            {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
          </PDFDownloadLink>
        </div>
      </div>

      {showPreview && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">PDF Preview</h2>
          <div className="border rounded-lg overflow-hidden shadow-lg">
            <PDFViewer width="100%" height="600" className="border-0">
              <InvoicePDF invoice={invoice} />
            </PDFViewer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Invoice Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-600 mb-2">Company Information</h3>
            <p className="text-gray-800 whitespace-pre-line">{invoice.companyName}</p>
            <p className="text-gray-600 whitespace-pre-line">{invoice.companyAddress}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-600 mb-2">Client Information</h3>
            <p className="text-gray-800">{invoice.clientName}</p>
            <p className="text-gray-600 whitespace-pre-line">{invoice.clientAddress}</p>
            <p className="text-gray-600">{invoice.clientEmail}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-medium text-gray-600 mb-4">Invoice Items</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 border">Description</th>
                <th className="text-center p-3 border">Quantity</th>
                <th className="text-right p-3 border">Unit Price</th>
                <th className="text-right p-3 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{item.description}</td>
                  <td className="text-center p-3">{item.quantity}</td>
                  <td className="text-right p-3">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="text-right p-3 font-medium">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDFGenerator;