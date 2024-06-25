export const fullTableName = (tableName: string, schemaName = "public") => {
  try {
    return tableName;
  } catch (error) {
    console.error("Error in fullTableName", error);
    return tableName;
  }
};
