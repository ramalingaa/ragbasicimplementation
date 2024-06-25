import { DatabaseConfigs } from "../types";
import { loadDatabaseConfig } from ".";
import { DataSource } from "interfaces/DataTypes";

export const loadDatabases = (entityTypes: DataSource[], databaseName: string) => {
  const databaseConfigs: DatabaseConfigs = {};

  const databaseConfig = loadDatabaseConfig(entityTypes);
  databaseConfigs[databaseName] = databaseConfig;

  return databaseConfigs;
};
