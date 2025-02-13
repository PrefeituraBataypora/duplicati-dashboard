interface BytesConverterProps {
    bytes: number;
    type: "MB" | "GB" | "TB";
}

const bytesConverter = ({ bytes, type }: BytesConverterProps) => {
    if (type === "MB") {
        return parseFloat((bytes / 1024 / 1024).toFixed(2));
    }

    if (type === "GB") {
        return parseFloat((bytes / 1024 / 1024 / 1024).toFixed(2))
    }

    if (type === "TB") {
        return parseFloat((bytes / 1024 / 1024 / 1024 / 1024).toFixed(2));
    }

    return 0;
}

export { bytesConverter }