import api from './api';
import { extractApiErrorMessage } from "./exception/axiosErrorHandler"

const INVOICE_BASE_URL = '/invoices';  

export const InvoiceService = {

    getInvoices: async (searchTerm) => {
        try {
        
          const response = await api.get(`${INVOICE_BASE_URL}/search`, searchTerm);
          console.log(response.data);
          return response.data;
        } catch (error) {
          throw new Error(extractApiErrorMessage(error));
        }
      },

      
      getInvoice: async (id) => {
        try {
        
          const response = await api.get(`${INVOICE_BASE_URL}/${id}`);
          console.log(response.data);
          return response.data;
        } catch (error) {
          throw new Error(extractApiErrorMessage(error));
        }
      },

}