export default function GroupDescription({ group, editingDescription, descriptionValue, setDescriptionValue, setEditingDescription, saveDescription }) {
    return (
        <div className="d-flex align-items-center mb-3">
            {editingDescription ? (
                <>
                    <input
                        type="text"
                        className="form-control me-2"
                        value={descriptionValue}
                        onChange={e => setDescriptionValue(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={saveDescription}>
                        Save
                    </button>
                </>
            ) : (
                <>
                    <p className="mb-0 me-2">{group?.description || "No description"}</p>
                    <button className="btn btn-dark p-1" style={{ fontSize: "1rem" }} onClick={() => setEditingDescription(true)}>
                        📝
                    </button>
                </>
            )}
        </div>
    );
}
