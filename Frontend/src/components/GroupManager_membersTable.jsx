export default function MembersTable({ groupMembers, user, removeUser }) {
    return (
        <>
            <h3 className="mt-4">{groupMembers.length} {groupMembers.length === 1 ? "Member" : "Members"}</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Action</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {groupMembers.map(m => (
                        <tr key={m.id}>
                            <td>{m.username}</td>
                            <td>
                                {m.id !== user.id && (
                                    <button className="btn btn-danger btn-sm" onClick={() => removeUser(m.id)}>
                                        Remove
                                    </button>
                                )}
                            </td>
                            <td>{new Date(m.joined).toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
