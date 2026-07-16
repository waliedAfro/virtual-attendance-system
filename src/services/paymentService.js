import api from "./api";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler"
const PAYMENT_BASE_URL ="payments" ;

export const PaymentService = {

    getPaymentBySession: async (sessionId) => {
        try {
          
          const response = await api.get(`${PAYMENT_BASE_URL}/verify/${sessionId}`);
          return response.data;
        } catch (error) {
            throw new Error(extractApiErrorMessage(error));
        }
      } , 

      getPayments: async () => {
        try {
          
          const response = await api.get(`${PAYMENT_BASE_URL}/search`);
          console.log(response.data);
          return response.data;
        } catch (error) {
            throw new Error(extractApiErrorMessage(error));
        }
      },


      getPayment: async (paymentId) => {
        try {
          
          const response = await api.get(`${PAYMENT_BASE_URL}/${paymentId}`);
          return response.data;
        } catch (error) {
            throw new Error(extractApiErrorMessage(error));
        }
      },

      createCheckout: async (invoiceId) => {
        try {
          console.log(invoiceId);
          const response = await api.get(`${PAYMENT_BASE_URL}/${invoiceId}/pay`);
          
          
          return response.data;
        } catch (error) {
            throw new Error(extractApiErrorMessage(error));
        }
      }
}