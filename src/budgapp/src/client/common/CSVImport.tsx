import React from 'react';
import './CSVImport.scss';

interface CSVImportProps {
    onChange: (csvData: string) => void;
    className?: string;
}

export const CSVImport = (props: CSVImportProps) => {
    const { onChange, className } = props;

    const handleCSVFile = React.useCallback((event) => {
        const reader = new FileReader();
        reader.onload = () => {
            onChange(reader.result as string);
        }
        reader.readAsText(event.target.files[0]);
    }, [onChange]);

    return (
        <div className={className}>
            <label className="import-label">
                <input type="file" onChange={handleCSVFile}/>
                Import CSV file
            </label>
        </div>
    )
}