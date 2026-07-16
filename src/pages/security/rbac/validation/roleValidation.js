// Using a simple validation object (can be replaced with Joi or Yup)
export const validateRole = (role) => {
  const errors = {};
  if (!role.name || role.name.trim().length < 2) {
    errors.name = 'Role name must be at least 2 characters';
  }
  if (role.description && role.description.length > 255) {
    errors.description = 'Description must be less than 255 characters';
  }
  return errors;
};