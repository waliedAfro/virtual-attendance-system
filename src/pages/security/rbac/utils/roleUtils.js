export const getRoleColor = (roleType) => {
  const colors = {
    admin: 'red',
    manager: 'blue',
    user: 'green',
    guest: 'gray',
  };
  return colors[roleType] || 'default';
};

export const getRoleBadgeVariant = (roleType) => {
  const variants = {
    admin: 'danger',
    manager: 'primary',
    user: 'success',
    guest: 'secondary',
  };
  return variants[roleType] || 'light';
};