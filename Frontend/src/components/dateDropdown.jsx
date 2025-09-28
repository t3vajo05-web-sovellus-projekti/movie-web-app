export default function DateDropdown({ selectedDate, setSelectedDate }) {
    // Generate array of 6 dates (today + next 5 days)
    const dates = [];
    for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push(new Date(d));
    }

    return (
        <div className="mb-4">
            <select id="dateSelect" className="form-select" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>

            {dates.map((d) => {
                const iso = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
                const fiDate = d.toLocaleDateString("fi-FI", { weekday: "short", day: "numeric", month: "numeric" }); // "su 28.9"
                return (
                    <option key={iso} value={iso}>
                        {fiDate}
                    </option>
                );
            })}

            </select>
        </div>
    );
}
