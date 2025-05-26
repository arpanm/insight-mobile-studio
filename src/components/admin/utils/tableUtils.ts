
export const getColumnsForTable = (tableName: string): string[] => {
  const tableColumnMap: Record<string, string[]> = {
    'sales': ['order_id', 'customer_id', 'product_id', 'revenue', 'quantity', 'order_date', 'region'],
    'customers': ['customer_id', 'customer_name', 'email', 'phone', 'city', 'country', 'signup_date'],
    'products': ['product_id', 'product_name', 'category', 'price', 'cost', 'brand', 'launch_date'],
    'regions': ['region', 'country', 'manager', 'target', 'population']
  };
  
  return tableColumnMap[tableName] || [];
};
