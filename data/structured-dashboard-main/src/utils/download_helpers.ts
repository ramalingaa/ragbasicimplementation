// Function to convert a JSON array to CSV
function jsonToCSV(jsonArray: any[]): string {
    if (jsonArray.length === 0) {
        return '';
    }

    const keys = Object.keys(jsonArray[0]);
    const csvRows = [];

    // Add header row with column titles
    csvRows.push(keys.join(','));

    // Convert each data row to CSV
    for (const obj of jsonArray) {
        const row = keys.map(fieldName => {
            let fieldValue = obj[fieldName];

            // Wrap string values that contain commas or double-quotes in double-quotes
            if (typeof fieldValue === 'string' && (fieldValue.includes(',') || fieldValue.includes('"'))) {
                fieldValue = `"${fieldValue.replace(/"/g, '""')}"`; // Escape double quotes
            }

            return fieldValue;
        });

        csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
}

// Function to trigger a CSV file download
function downloadCSV(csvData: string, filename: string) {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Example usage inside a React component or another function
export function handleDownload(contents: any[], filename: string) {
    const csvData = jsonToCSV(contents);
    downloadCSV(csvData, `${filename}`);
}
