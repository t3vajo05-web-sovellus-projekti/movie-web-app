export default function PendingInvitesTable({ pendingInvites, acceptInvite, declineInvite }) {
    return (
        <>
            <h3 className="mt-4">{pendingInvites.length} Pending Invites</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Actions</th>
                        <th>Request sent</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingInvites.map(i => (
                        <tr key={i.id}>
                            <td>{i.username}</td>
                            <td>
                                <button className="btn btn-success btn-sm me-2" onClick={() => acceptInvite(i.id)}>
                                    Accept
                                </button>
                                <button className="btn btn-secondary btn-sm" onClick={() => declineInvite(i.id)}>
                                    Decline
                                </button>
                            </td>
                            <td>{new Date(i.created).toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
