export async function save() {
    const syncStatus = document.getElementById("syncStatus");

    if (syncStatus) {
        syncStatus.textContent = "☁️ Saving...";
        syncStatus.classList.add("saving");
        syncStatus.classList.remove("offline");
    }

    renderAll();

    try {
        await savePlanner(data);

        setTimeout(() => {
            if (syncStatus) {
                syncStatus.textContent = "✅ All changes saved";
                syncStatus.classList.remove("saving", "offline");
            }
        }, 500);

    } catch (error) {
        if (syncStatus) {
            syncStatus.textContent = "📶 Offline — will sync later";
            syncStatus.classList.add("offline");
        }

        console.warn("Cloud save failed:", error);
    }
}
