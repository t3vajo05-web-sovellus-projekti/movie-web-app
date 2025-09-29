export default function DeleteGroupButton({ deleteGroup }) {
    return (
        <div className="mt-4">
            <button className="btn btn-danger" onClick={deleteGroup}>
                Delete Group
            </button>
        </div>
    );
}
