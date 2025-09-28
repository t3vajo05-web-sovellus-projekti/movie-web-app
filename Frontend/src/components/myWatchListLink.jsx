import { useState } from "react";

export default function PublicWatchlistLink({ userId })
{
    const link = `${window.location.origin}/watchlist/user/${userId}`;
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () =>
    {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2s
    };

    return (
<div className="mb-3 row align-items-center">
    <label htmlFor="publicLink" className="col-sm-3 col-form-label">
        Link to your watchlist:
    </label>
    <div className="col-sm-9">
        <div className="input-group">
            <input 
                id="publicLink"
                type="text" 
                className="form-control" 
                value={link} 
                readOnly 
            />
            <button 
                className="btn btn-outline-secondary" 
                type="button" 
                onClick={copyToClipboard}
            >
                {copied ? "Copied!" : "Copy"}
            </button>
        </div>
    </div>
</div>

    );
}
