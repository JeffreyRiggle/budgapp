import React from 'react';

interface CSVExportProps {
    onChange: (csvData: string) => void;
}

export const CSVExport = (props: CSVExportProps) => {
    const { onChange } = props;

    const handleCSVFile = React.useCallback((event) => {
        const reader = new FileReader();
        reader.onload = () => {
            onChange(reader.result as string);
        }
        reader.readAsText(event.target.files[0]);
    }, [onChange]);

    return (
        <div>
            <label>Import CSV file</label>
            <input type="file" onChange={handleCSVFile}/>
        </div>
    )
}