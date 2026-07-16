import * as yup from 'yup';

const locationSchema = yup.object().shape({
  locationName: yup
    .string()
    .required('Location name is required')
    .max(100, 'Location name must be at most 100 characters'),
  
  locationCode: yup
    .string()
    .max(50, 'Location code must be at most 50 characters'),
  
  locationNameAR: yup
    .string()
    .max(100, 'Arabic name must be at most 100 characters'),
  
  description: yup
    .string()
    .max(500, 'Description must be at most 500 characters'),
  
  status: yup
    .boolean()
    .default(true),
  
  companyId: yup
    .string()
    .required('Company is required'),
  
  delReason: yup
    .string()
    .when('status', {
      is: false,
      then: yup.string().required('Delete reason is required when deactivating'),
      otherwise: yup.string()
    })
});

export default locationSchema;