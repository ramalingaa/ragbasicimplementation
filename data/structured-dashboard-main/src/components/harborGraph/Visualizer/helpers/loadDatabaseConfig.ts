import { Schema } from "components/harbor/DataViewModal";
import { EdgeConfig, SchemaColors, TableConfig, TablePositions } from "../types";
import { DataSource } from "interfaces/DataTypes";

export const loadDatabaseConfig = (entityTypes: DataSource[]) => {

  const edgesLocal = (() => {

    return entityTypes.flatMap((dataSource1) => {
      // Skip if the first data source has no schema
      if (!dataSource1?.fileMetadata?.schema) {
        return [];
      }

      return entityTypes.filter(dataSource2 => {
        // Ensure different data sources and check if an edge already exists
        return dataSource1.uuid !== dataSource2.uuid;
      }).map((dataSource2) => {
        // Skip if the second data source has no schema
        if (!dataSource2?.fileMetadata?.schema) {
          return null;
        }

        // Lowercase column names for comparison
        const schema1Columns = dataSource1.fileMetadata.schema.map((schema: Schema) => schema.columnName.toUpperCase());
        const schema2Columns = dataSource2.fileMetadata.schema.map((schema: Schema) => schema.columnName.toUpperCase());

        // Find overlapping column names
        const overlappingColumns = schema1Columns.filter((columnName: string) => schema2Columns.includes(columnName));

        // If no overlaps, skip creating an edge
        if (overlappingColumns.length === 0) {
          return null;
        }

        // return overlappingColumns.map((column: string) => {
        //   return {
        //     id: `${dataSource1.uuid}-${dataSource2.uuid}`,
        //     source: dataSource1.name,
        //     sourceKey: column,
        //     target: dataSource2.name,
        //     targetKey: column,
        //     relation: "hasMany",
        //   };
        // });
        return {
          id: `${dataSource1.uuid}-${dataSource2.uuid}`,
          source: dataSource1.name,
          sourceKey: overlappingColumns[0],
          target: dataSource2.name,
          targetKey: overlappingColumns[0],
          relation: "hasMany",
        };
      }).filter(edge => edge !== null);
    });
  })();

  const edgeConfigs = edgesLocal;
  const tablePositions = {} as TablePositions;
  const schemaColors = {
    "DEFAULT": "black",
  } as SchemaColors;

  const tables = entityTypes.map(entity => {
    let columns = entity.fileMetadata.schema.map((column: Schema) => {
      return {
        name: column.columnName.toUpperCase(),
        type: column.columnType,
        description: column.columnName.toUpperCase(),
        key: false,
      }
    })
    // if (columns.length) {
    //   columns[0].key = true;
    // }
    return {
      id: entity.uuid,
      name: entity.name,
      columns: columns,
      description: entity.name,
    }
  }) as TableConfig[];

  // edgeConfigs.forEach((edgeConfig: EdgeConfig) => {
  //   const sourceTableName = edgeConfig.source;
  //   const targetTableName = edgeConfig.target;

  //   edgeConfig.source = sourceTableName;
  //   edgeConfig.target = targetTableName;
  // });

  tables.forEach(table => {
    table.schemaColor = schemaColors[table.schema || "DEFAULT"];
  });

  return {
    tables,
    tablePositions,
    edgeConfigs,
    schemaColors
  };
}
