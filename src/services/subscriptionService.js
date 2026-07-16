
import api from './api';
import { extractApiErrorMessage } from "./exception/axiosErrorHandler"

const PRODUCT_BASE_URL = '/products';  
const SUBSCRIPTION_BASE_URL = '/subscriptions';

const BillingCycle = {
    MONTHLY: 'MONTHLY',
    YEARLY: 'YEARLY'
};

const SubscriptionStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED'
};


// API Service
export const subscriptionService = {
   
    getTenantSubscriptions : async () => {
        try {
      
            const response = await api.get(`${SUBSCRIPTION_BASE_URL}/search`);
            console.log(response.data);
            
            return response.data;
          } catch (error) {
              throw new Error(extractApiErrorMessage(error));
          }

    }, 

    getServices: async () => {
        // Your existing implementation
        return mockServices;
    },
    
    
    getSubscriptions: async () => {
        try {
      
            const response = await api.get(`${SUBSCRIPTION_BASE_URL}/search`);
            return response.data;
          } catch (error) {
              throw new Error(extractApiErrorMessage(error));
          }
    },

    updateSubscription: async (subscriptionId, updates) => {
        // Your existing implementation
        return updatedSubscription;
    },
    cancelSubscription: async (subscriptionId) => {
        // Your existing implementation
    },

      
    createSubscription :async (data) =>{

        try {
      
            const response = await api.post(SUBSCRIPTION_BASE_URL, data);
            return response.data;
          } catch (error) {
              throw new Error(extractApiErrorMessage(error));
          }
        
    } ,
        
      
     cancelSubscription : async (id) =>{} , 
     fetchSerivce: async () => {
        try {
          
          const response = await api.get(`${PRODUCT_BASE_URL}/search`);
          return response.data;
        } catch (error) {
            throw new Error(extractApiErrorMessage(error));
        }
    }
}