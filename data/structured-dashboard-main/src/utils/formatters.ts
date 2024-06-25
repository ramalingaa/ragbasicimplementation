export function formatIsoDateOnQueriesHistory(isoDate: string): string {
    // Create a new Date object from the ISO string
    const date = new Date(isoDate);

    // Use Intl.DateTimeFormat to format the date
    // Specify the date and time parts needed
    const dateFormatter = new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    // Format the date and replace the default separators to match the desired format
    return dateFormatter.format(date).replace(/\//g, '/').replace(',', '');
}

export function uploaderEmailFormatter(email: string): string {
    return email.split('@')[0];
}

export function convertStringToAlphanumericAndUnderscoresString(str: string) {
    return str.replace(/[^a-zA-Z0-9_]/g, '_');
}