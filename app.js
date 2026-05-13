document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("dream-form");
    const dreamsList = document.getElementById("dreams-list");
    const dateInput = document.getElementById("date");
    const titleInput = document.getElementById("title");
    const vividnessInput = document.getElementById("vividness");
    const vividnessDisplay = document.getElementById("vividness-display");
    const lengthInput = document.getElementById("length");
    const lengthDisplay = document.getElementById("length-display");
    const ratingInput = document.getElementById("rating");
    const ratingDisplay = document.getElementById("rating-display");
    const descInput = document.getElementById("description");
    const dreamCount = document.getElementById("dream-count");
    
    const lucidState = document.getElementById("lucid-state");
    const controlState = document.getElementById("control-state");
    const garminInput = document.getElementById("garmin-score");
    const bevelInput = document.getElementById("bevel-score");
    const totalSleepInput = document.getElementById("total-sleep");
    const remSleepInput = document.getElementById("rem-sleep");

    const editingIdInput = document.getElementById("editing-id");
    const submitBtn = document.getElementById("submit-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const formTitle = document.getElementById("form-title");

    // Views & Tools
    const tabDreams = document.getElementById("tab-dreams");
    const tabAnalytics = document.getElementById("tab-analytics");
    const viewDreams = document.getElementById("view-dreams");
    const viewAnalytics = document.getElementById("view-analytics");
    const mockDataBtn = document.getElementById("mock-data-btn");
    const clearAllDataBtn = document.getElementById("clear-all-data");

    if (tabDreams) {
        tabDreams.addEventListener("click", () => {
            viewDreams.classList.remove("hidden");
            viewAnalytics.classList.add("hidden");
            tabDreams.className = "flex-1 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white shadow transition-all";
            tabAnalytics.className = "flex-1 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-slate-200 transition-all";
        });

        tabAnalytics.addEventListener("click", () => {
            viewDreams.classList.add("hidden");
            viewAnalytics.classList.remove("hidden");
            tabAnalytics.className = "flex-1 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white shadow transition-all";
            tabDreams.className = "flex-1 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-slate-200 transition-all";
            updateAnalytics();
        });
    }

    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener("click", async () => {
            if (confirm("Are you SURE you want to delete all dreams? This cannot be undone!")) {
                await deleteAllDreamsFromDB();
                dreams = [];
                renderDreams();
                updateAnalytics();
                categories.forEach(cat => renderCategoryUI(cat));
                alert("All data wiped successfully from the cloud.");
            }
        });
    }

    if (mockDataBtn) {
        mockDataBtn.addEventListener("click", () => {
            const mockDreams = [
                { id: "101", date: "2026-05-01", title: "Flying over the city", description: "I realized I was dreaming and flew over New York. It was incredibly real.", vividness: "9", length: "4", rating: "5", isLucid: true, hasControl: true, garminScore: "85", bevelScore: "88", totalSleep: "08:15", remSleep: "02:10", people: [], objects: ["buildings"], places: ["New York"], themes: ["flying", "freedom"], actions: ["flying"], emotions: ["joy", "excitement"] },
                { id: "102", date: "2026-05-02", title: "Lost in IKEA", description: "Wandering endless aisles looking for a lampshade.", vividness: "6", length: "5", rating: "2", isLucid: false, hasControl: false, garminScore: "70", bevelScore: "65", totalSleep: "06:30", remSleep: "01:05", people: ["friend"], objects: ["furniture"], places: ["IKEA"], themes: ["lost", "frustration"], actions: ["walking"], emotions: ["frustrated"] },
                { id: "103", date: "2026-05-04", title: "Zombie apocalypse", description: "Running away from zombies in an old hospital.", vividness: "8", length: "3", rating: "4", isLucid: false, hasControl: false, garminScore: "60", bevelScore: "55", totalSleep: "05:45", remSleep: "00:45", people: ["zombies"], objects: ["weapons"], places: ["hospital"], themes: ["survival", "chase"], actions: ["running", "hiding"], emotions: ["fear", "adrenaline"] },
                { id: "104", date: "2026-05-06", title: "Meeting Elon Musk", description: "We had tea on Mars. Sandbox mode activated.", vividness: "10", length: "4", rating: "5", isLucid: true, hasControl: true, garminScore: "92", bevelScore: "95", totalSleep: "07:50", remSleep: "01:55", people: ["Elon Musk"], objects: ["tea cup", "rocket"], places: ["Mars"], themes: ["space", "conversation"], actions: ["drinking tea", "talking"], emotions: ["awe", "curiosity"] },
                { id: "105", date: "2026-05-08", title: "School Exam", description: "Forgot to study for a math exam. Typical stress dream.", vividness: "7", length: "2", rating: "1", isLucid: false, hasControl: false, garminScore: "75", bevelScore: "72", totalSleep: "07:00", remSleep: "01:20", people: ["Teacher"], objects: ["exam paper"], places: ["School"], themes: ["stress", "unprepared"], actions: ["writing", "panicking"], emotions: ["stress", "panic"] }
            ];
            mockDreams.forEach(md => {
                const exists = dreams.find(d => d.id === md.id || d.title === md.title);
                if (!exists) dreams.push(md);
            });
            saveDreams();
            renderDreams();
            updateAnalytics();
            alert("Mock data loaded!");
        });
    }

    // Update displays while sliding
    vividnessInput.addEventListener("input", (e) => {
        vividnessDisplay.textContent = `${e.target.value}/10`;
    });
    lengthInput.addEventListener("input", (e) => {
        lengthDisplay.textContent = `${e.target.value}/5`;
    });
    ratingInput.addEventListener("input", (e) => {
        ratingDisplay.textContent = `${e.target.value}/5`;
    });

    dateInput.valueAsDate = new Date();

    // Toggle button listeners
    document.querySelectorAll(".toggle-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const field = btn.getAttribute("data-field");
            const val = btn.getAttribute("data-val");
            setToggleUI(field, val);
        });
    });

    function setToggleUI(field, val) {
        let stateEl = document.getElementById(`${field}-state`);
        if (stateEl) stateEl.value = val;

        const noBtn = document.getElementById(`${field}-no`);
        const yesBtn = document.getElementById(`${field}-yes`);
        
        if (noBtn && yesBtn) {
            if (val === "yes") {
                yesBtn.className = "flex-1 py-3 rounded-2xl font-bold text-lg bg-white text-slate-900 transition-colors toggle-btn";
                noBtn.className = "flex-1 py-3 rounded-2xl font-bold text-lg bg-slate-800/80 text-slate-500 hover:text-slate-300 transition-colors toggle-btn";
            } else {
                noBtn.className = "flex-1 py-3 rounded-2xl font-bold text-lg bg-white text-slate-900 transition-colors toggle-btn";
                yesBtn.className = "flex-1 py-3 rounded-2xl font-bold text-lg bg-slate-800/80 text-slate-500 hover:text-slate-300 transition-colors toggle-btn";
            }
        }
    }

    // Category Logic
    const categories = ["people", "objects", "places", "themes", "actions", "emotions"];
    let currentTags = { people: [], objects: [], places: [], themes: [], actions: [], emotions: [] };
    
    // Load dreams
    let dreams = [];

    function getKnownTags(category) {
        const set = new Set();
        dreams.forEach(d => {
            if (d[category] && Array.isArray(d[category])) {
                d[category].forEach(item => set.add(item));
            }
        });
        return Array.from(set);
    }

    function renderCategoryUI(category) {
        const block = document.querySelector(`.category-block[data-category="${category}"]`);
        if(!block) return;
        const selectedContainer = document.getElementById(`selected-${category}`);
        const knownScroll = document.getElementById(`known-${category}-scroll`);
        
        selectedContainer.innerHTML = currentTags[category].map(item => `
            <span class="inline-flex items-center bg-blue-600/20 border border-blue-500/30 text-blue-200 px-3 py-1.5 rounded-[10px] text-sm font-medium">
                ${escapeHTML(item)}
                <button type="button" onclick="removeTag('${category}', '${escapeHTML(item)}')" class="ml-2 text-blue-400 hover:text-blue-100">&times;</button>
            </span>
        `).join("");

        const known = getKnownTags(category);
        const suggestions = known.filter(item => !currentTags[category].includes(item));
        
        if (suggestions.length > 0) {
            knownScroll.innerHTML = suggestions.map(item => `
                <button type="button" onclick="addTag('${category}', '${escapeHTML(item)}')" class="shrink-0 snap-start bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-700/80 transition-colors whitespace-nowrap">
                    + ${escapeHTML(item)}
                </button>
            `).join("");
        } else {
            knownScroll.innerHTML = `<span class="text-slate-600 text-sm italic py-2">No past ${category} to add.</span>`;
        }
    }

    // Set up category DOM listeners
    document.querySelectorAll(".category-block").forEach(block => {
        const category = block.getAttribute("data-category");
        const btn = block.querySelector(".add-category-btn");
        const pane = block.querySelector(".category-selection-pane");
        const input = block.querySelector(".new-category-input");

        if (btn && pane && input) {
            btn.addEventListener("click", () => {
                // Close other panes
                document.querySelectorAll(".category-selection-pane").forEach(p => {
                    if (p !== pane) p.classList.add("hidden");
                });
                
                pane.classList.toggle("hidden");
                if (!pane.classList.contains("hidden")) {
                    input.focus();
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag(category, input.value);
                    input.value = "";
                    input.focus();
                }
            });
        }
    });

    window.addTag = (category, value) => {
        const item = value.trim();
        if (item && !currentTags[category].includes(item)) {
            currentTags[category].push(item);
            renderCategoryUI(category);
        }
    };

    window.removeTag = (category, value) => {
        currentTags[category] = currentTags[category].filter(item => item !== value); 
        renderCategoryUI(category);
    };

    const icons = {
        people: "👤",
        objects: "📦",
        places: "🗺️",
        themes: "💭",
        actions: "⚡",
        emotions: "🎭"
    };

    function formatTime(str) {
        if (!str) return null;
        let [h, m] = str.split(':');
        if (h === undefined || m === undefined) return str;
        h = parseInt(h, 10);
        m = parseInt(m, 10);
        let out = [];
        if (h > 0) out.push(`${h}h`);
        if (m > 0 || h === 0) out.push(`${m}m`);
        return out.join(' ');
    }

    const renderDreams = function() {
        if (!dreamsList) return;
        dreamsList.innerHTML = "";
        if (dreamCount) dreamCount.textContent = dreams.length;

        if (dreams.length === 0) {
            dreamsList.innerHTML = `
                <div class="text-center py-10 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-800">
                    <p class="text-slate-500 font-medium italic">No dreams logged yet.</br>Sleep tight and come back tomorrow!</p>
                </div>`;
            return;
        }

        const sortedDreams = [...dreams].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id);

        sortedDreams.forEach(dream => {
            const el = document.createElement("div");
            el.className = "bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-5 md:p-6 hover:border-slate-700 transition-colors group";
            
            const dateObj = new Date(dream.date);
            const dateString = new Date(dateObj.getTime() + Math.abs(dateObj.getTimezoneOffset() * 60000))
                .toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });

            const displayTitle = dream.title && dream.title.trim() !== "" ? dream.title : "Untitled Dream";
            const vividnessValue = dream.vividness || "5";
            const lengthValue = dream.length || "3";
            const ratingValue = dream.rating || "3";

            // Generate Tags UI
            let tagsHtml = "";
            
            if (dream.isLucid) {
                tagsHtml += `<span class="text-xs font-semibold bg-purple-900/80 text-purple-300 border border-purple-800/40 px-2.5 py-1 rounded-full whitespace-nowrap">🌀 Lucid Dream</span>`;
            }
            if (dream.hasControl) {
                tagsHtml += `<span class="text-xs font-semibold bg-emerald-900/80 text-emerald-300 border border-emerald-800/40 px-2.5 py-1 rounded-full whitespace-nowrap">🎮 Controlled</span>`;
            }
            
            if (dream.garminScore || dream.bevelScore || dream.totalSleep || dream.remSleep) {
                let statsHtml = [];
                if (dream.garminScore) statsHtml.push(`Garmin: ${dream.garminScore}`);
                if (dream.bevelScore) statsHtml.push(`Bevel: ${dream.bevelScore}`);
                if (dream.totalSleep) statsHtml.push(`Sleep: ${formatTime(dream.totalSleep)}`);
                if (dream.remSleep) statsHtml.push(`REM: ${formatTime(dream.remSleep)}`);
                tagsHtml += `<span class="text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap lg:col-span-full">📊 ${statsHtml.join(" | ")}</span>`;
            }

            
            categories.forEach(cat => {
                if (dream[cat] && dream[cat].length > 0) {
                    tagsHtml += dream[cat].map(item => `
                        <span class="text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/40 px-2.5 py-1 rounded-full whitespace-nowrap">
                            ${icons[cat]} ${escapeHTML(item)}
                        </span>
                    `).join("");
                }
            });

            el.innerHTML = `
                <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                    <div class="flex items-center gap-3 w-full md:w-auto break-words max-w-full flex-wrap">
                        <h3 class="text-xl font-bold text-blue-300 truncate">${escapeHTML(displayTitle)}</h3>
                        <span class="inline-flex shrink-0 text-xs font-bold ring-1 ring-blue-500/50 bg-blue-900/30 text-blue-300 py-1 px-2 rounded whitespace-nowrap" title="Vividness Score">👁️ ${vividnessValue}/10</span>
                        <span class="inline-flex shrink-0 text-xs font-bold ring-1 ring-blue-500/50 bg-blue-900/30 text-blue-300 py-1 px-2 rounded whitespace-nowrap" title="Length Score">⏱️ ${lengthValue}/5</span>
                        <span class="inline-flex shrink-0 text-xs font-bold ring-1 ring-blue-500/50 bg-blue-900/30 text-blue-300 py-1 px-2 rounded whitespace-nowrap" title="Rating Score">⭐ ${ratingValue}/5</span>
                    </div>
                    <div class="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        <span class="inline-flex shrink-0 text-xs font-bold bg-slate-800 text-slate-300 py-1.5 px-3 rounded-full mr-auto md:mr-0">${dateString}</span>
                        <div class="flex gap-2 shrink-0">
                            <button onclick="editDream('${dream.id}')" class="text-slate-400 hover:text-blue-400 transition-colors p-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                            <button onclick="deleteDream('${dream.id}')" class="text-slate-400 hover:text-red-400 transition-colors p-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        </div>
                    </div>
                </div>
                <p class="text-slate-300 whitespace-pre-wrap leading-relaxed">${escapeHTML(dream.description)}</p>
                ${tagsHtml ? `<div class="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-800">${tagsHtml}</div>` : ''}
            `;
            dreamsList.appendChild(el);
        });
    }

    function escapeHTML(str) {
        if (!str) return "";
        return String(str).replace(/[&<>'"]/g, tag => ({"&": "&amp;","<": "&lt;",">": "&gt;","'": "&#39;",'"': "&quot;"}[tag] || tag));
    }

    window.deleteDream = async function(id) {
        if(confirm("Are you sure you want to delete this dream?")) {
            await deleteDreamFromDB(id);
            dreams = dreams.filter(d => d.id !== String(id) && d.id !== id);
            renderDreams();
            updateAnalytics();
            categories.forEach(cat => renderCategoryUI(cat));
            if (editingIdInput && editingIdInput.value === String(id)) resetForm();
        }
    };;

    window.editDream = (id) => {
        const dream = dreams.find(d => d.id === String(id));
        if (!dream) return;
        
        editingIdInput.value = dream.id;
        dateInput.value = dream.date;
        titleInput.value = dream.title || "";
        descInput.value = dream.description || "";
        
        vividnessInput.value = dream.vividness || "5";
        vividnessDisplay.textContent = `${vividnessInput.value}/10`;
        lengthInput.value = dream.length || "3";
        lengthDisplay.textContent = `${lengthInput.value}/5`;
        ratingInput.value = dream.rating || "3";
        ratingDisplay.textContent = `${ratingInput.value}/5`;

        categories.forEach(cat => {
            currentTags[cat] = dream[cat] ? [...dream[cat]] : [];
            renderCategoryUI(cat);
        });

        setToggleUI("lucid", dream.isLucid ? "yes" : "no");
        setToggleUI("control", dream.hasControl ? "yes" : "no");
        
        if (garminInput) garminInput.value = dream.garminScore || "";
        if (bevelInput) bevelInput.value = dream.bevelScore || "";
        if (totalSleepInput) totalSleepInput.value = dream.totalSleep || "";
        if (remSleepInput) remSleepInput.value = dream.remSleep || "";

        formTitle.textContent = "Edit Dream";
        submitBtn.textContent = "Update Dream";
        cancelBtn.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
        descInput.focus();
    };

    function resetForm() {
        editingIdInput.value = "";
        dateInput.valueAsDate = new Date();
        titleInput.value = "";
        descInput.value = "";
        vividnessInput.value = "5";
        vividnessDisplay.textContent = "5/10";
        lengthInput.value = "3";
        lengthDisplay.textContent = "3/5";
        ratingInput.value = "3";
        ratingDisplay.textContent = "3/5";
        
        categories.forEach(cat => {
            currentTags[cat] = [];
            renderCategoryUI(cat);
        });

        setToggleUI("lucid", "no");
        setToggleUI("control", "no");
        
        if (garminInput) garminInput.value = "";
        if (bevelInput) bevelInput.value = "";
        if (totalSleepInput) totalSleepInput.value = "";
        if (remSleepInput) remSleepInput.value = "";

        formTitle.textContent = "Log a Dream";
        submitBtn.textContent = "Save Dream";
        cancelBtn.classList.add("hidden");
    }

    function saveDreams() {

    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", resetForm);
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const date = dateInput.value;
            const title = titleInput.value;
            const description = descInput.value;
            const vividness = vividnessInput.value;
            const length = lengthInput.value;
            const rating = ratingInput.value;
            const editingId = editingIdInput.value;

            const isLucid = lucidState ? lucidState.value === "yes" : false;
            const hasControl = controlState ? controlState.value === "yes" : false;
            
            const garminScore = garminInput ? garminInput.value : "";
            const bevelScore = bevelInput ? bevelInput.value : "";
            const totalSleep = totalSleepInput ? totalSleepInput.value : "";
            const remSleep = remSleepInput ? remSleepInput.value : "";

            // Flush partially typed inputs for all categories
            document.querySelectorAll(".category-block").forEach(block => {
                const cat = block.getAttribute("data-category");
                const input = block.querySelector(".new-category-input");
                if (input && input.value.trim() !== "") {
                    addTag(cat, input.value);
                    input.value = "";
                }
            });

            let tagsToSave = {};
            categories.forEach(cat => {
                tagsToSave[cat] = [...currentTags[cat]];
            });

            const dbPayload = {
                date, title, description, 
                vividness: vividness ? parseFloat(vividness) : 5, 
                length: length ? parseFloat(length) : 3, 
                rating: rating ? parseFloat(rating) : 3, 
                is_lucid: isLucid, has_control: hasControl, 
                garmin_score: garminScore ? parseInt(garminScore, 10) : null, 
                bevel_score: bevelScore ? parseInt(bevelScore, 10) : null, 
                total_sleep: totalSleep || null, 
                rem_sleep: remSleep || null,
                ...tagsToSave
            };

            if (editingId) {
                await updateDreamInDB(editingId, dbPayload);
                const index = dreams.findIndex(d => d.id === editingId);
                if (index !== -1) {
                    dreams[index] = { id: editingId, ...dbPayload, isLucid, hasControl, garminScore, bevelScore, totalSleep, remSleep, ...tagsToSave };
                }
            } else {
                const newRows = await saveDreamToDB(dbPayload);
                if (newRows && newRows.length > 0) {
                    const row = newRows[0];
                    dreams.unshift({
                        ...row,
                        isLucid: row.is_lucid,
                        hasControl: row.has_control,
                        garminScore: row.garmin_score,
                        bevelScore: row.bevel_score,
                        totalSleep: row.total_sleep,
                        remSleep: row.rem_sleep
                    });
                }
            }

            resetForm();
            renderDreams();
            updateAnalytics();
        });
    }

    const updateAnalytics = function() {
        const viewE = document.getElementById("view-analytics");
        if (!viewE || viewE.classList.contains("hidden")) return;

        if (dreams.length === 0) {
            document.getElementById("stat-total").textContent = "0";
            document.getElementById("stat-lucid").textContent = "0%";
            document.getElementById("stat-control").textContent = "0%";
            document.getElementById("stat-rating").textContent = "0/5";
            return;
        }

        const total = dreams.length;
        const lucid = dreams.filter(d => d.isLucid).length;
        const control = dreams.filter(d => d.hasControl).length;
        
        const sumRating = dreams.reduce((acc, d) => acc + Number(d.rating||0), 0);
        
        let sumGarmin = 0, countGarmin = 0;
        let sumBevel = 0, countBevel = 0;
        let sumRem = 0, countRem = 0;
        
                let highRemVividSum = 0, highRemCount = 0;

        let sumVivLucid = 0, countVivLucid = 0;
        let sumVivNormal = 0, countVivNormal = 0;
        let daysCount = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
        let longSleepRatingSum = 0, longSleepCount = 0;
        let totalSleepMinsAllTime = 0;
        let totalTags = 0;
        let tagRatings = {};

        const counts = {};

        dreams.forEach(d => {
            if (d.garminScore) { sumGarmin += Number(d.garminScore); countGarmin++; }
            if (d.bevelScore) { sumBevel += Number(d.bevelScore); countBevel++; }
            if (d.remSleep && typeof d.remSleep === 'string' && d.remSleep.includes(':')) {
                let [h, m] = d.remSleep.split(':');
                let mins = parseInt(h, 10)*60 + parseInt(m, 10);
                if (!isNaN(mins)) {
                    sumRem += mins;
                    countRem++;
                    
                    if (mins > 90) { // High REM
                        highRemVividSum += Number(d.vividness||5);
                        highRemCount++;
                    }
                }
            } else if (d.remSleep && !d.remSleep.includes(':')) {
                // Handle legacy mock data in minutes
                let mins = parseInt(d.remSleep, 10);
                if (!isNaN(mins)) {
                    sumRem += mins;
                    countRem++;
                    if (mins > 90) {
                        highRemVividSum += Number(d.vividness||5);
                        highRemCount++;
                    }
                }
            }

            if (d.totalSleep && typeof d.totalSleep === 'string' && d.totalSleep.includes(':')) {
                let [h, m] = d.totalSleep.split(':');
                let smins = parseInt(h, 10)*60 + parseInt(m, 10);
                if (!isNaN(smins)) {
                    totalSleepMinsAllTime += smins;
                    if (smins >= 420) { // 7 hours
                        longSleepRatingSum += Number(d.rating || 3);
                        longSleepCount++;
                    }
                }
            }

            if (d.isLucid) {
                sumVivLucid += Number(d.vividness || 5);
                countVivLucid++;
            } else {
                sumVivNormal += Number(d.vividness || 5);
                countVivNormal++;
            }

            let dDateObj = new Date(d.date);
            let day = new Date(dDateObj.getTime() + Math.abs(dDateObj.getTimezoneOffset() * 60000)).getDay();
            if (!isNaN(day)) daysCount[day]++;


            categories.forEach(cat => {
                if (d[cat] && Array.isArray(d[cat])) {
                    d[cat].forEach(tag => {
                        let k = `${cat}: ${tag}`;
                        counts[k] = (counts[k] || 0) + 1;
                        
                        totalTags++;
                        if (!tagRatings[k]) tagRatings[k] = { sum: 0, count: 0 };
                        tagRatings[k].sum += Number(d.rating || 3);
                        tagRatings[k].count++;
                    });
                }
            });
        });

        document.getElementById("stat-total").textContent = total;
        document.getElementById("stat-lucid").textContent = Math.round((lucid/total)*100) + "%";
        document.getElementById("stat-control").textContent = Math.round((control/total)*100) + "%";
        document.getElementById("stat-rating").textContent = (sumRating/total).toFixed(1) + "/5";

        const cg = document.getElementById("corr-garmin");
        if (cg) cg.textContent = countGarmin ? (sumGarmin/countGarmin).toFixed(1) : "N/A";
        
        const cb = document.getElementById("corr-bevel");
        if (cb) cb.textContent = countBevel ? (sumBevel/countBevel).toFixed(1) : "N/A";
        
        const cr = document.getElementById("corr-rem");
        if (cr) {
            if (countRem) {
                let avgMins = Math.round(sumRem/countRem);
                cr.textContent = `${Math.floor(avgMins/60)}h ${avgMins%60}m`;
            } else {
                cr.textContent = "N/A";
            }
        }
        
        const ch = document.getElementById("corr-high-rem-vivid");
        if (ch) {
            ch.textContent = highRemCount ? (highRemVividSum/highRemCount).toFixed(1) + " / 10" : "Not enough data";
        }

        const bestDayIndex = Object.keys(daysCount).reduce((a, b) => daysCount[a] > daysCount[b] ? a : b);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const bdE = document.getElementById("stat-best-day");
        if (bdE) bdE.textContent = daysCount[bestDayIndex] > 0 ? dayNames[bestDayIndex] : "N/A";

        const svl = document.getElementById("stat-viv-lucid");
        if(svl) svl.textContent = countVivLucid ? (sumVivLucid/countVivLucid).toFixed(1) + "/10" : "N/A";
        
        const svn = document.getElementById("stat-viv-normal");
        if(svn) svn.textContent = countVivNormal ? (sumVivNormal/countVivNormal).toFixed(1) + "/10" : "N/A";
        
        const sls = document.getElementById("stat-rating-long-sleep");
        if(sls) sls.textContent = longSleepCount ? (longSleepRatingSum/longSleepCount).toFixed(1) + "/5" : "N/A";

        const tst = document.getElementById("stat-total-sleep-tracked");
        if(tst) tst.textContent = totalSleepMinsAllTime ? `${Math.floor(totalSleepMinsAllTime/60)}h ${totalSleepMinsAllTime%60}m` : "N/A";
        
        const trt = document.getElementById("stat-total-rem-tracked");
        if(trt) trt.textContent = sumRem ? `${Math.floor(sumRem/60)}h ${sumRem%60}m` : "N/A";
        
        const at = document.getElementById("stat-avg-tags");
        if(at) at.textContent = total > 0 ? (totalTags / total).toFixed(1) : "0";

        let bestTag = "N/A";
        let bestTagScore = 0;
        for (let k in tagRatings) {
            if (tagRatings[k].count >= 2) { 
                let avg = tagRatings[k].sum / tagRatings[k].count;
                if (avg > bestTagScore) {
                    bestTagScore = avg;
                    bestTag = k.split(': ')[1];
                }
            }
        }
        if (bestTag === "N/A") {
            for (let k in tagRatings) {
                 let avg = tagRatings[k].sum / tagRatings[k].count;
                 if (avg > bestTagScore) {
                     bestTagScore = avg;
                     bestTag = k.split(': ')[1];
                 }
            }
        }
        const be = document.getElementById("stat-best-element");
        if (be) be.textContent = bestTag !== "N/A" ? `${bestTag} (${bestTagScore.toFixed(1)}/5)` : "Not enough data";

        // Sort Top tags
        const sortedTags = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 5);
        const topEl = document.getElementById("top-elements");
        if (topEl) {
            if (sortedTags.length > 0) {
                topEl.innerHTML = sortedTags.map(t => {
                    let [cat, tag] = t[0].split(': ');
                    return `<div class="flex justify-between items-center text-sm border-b border-slate-800/80 pb-2">
                        <span class="text-slate-400 capitalize"><span class="mr-2">${icons[cat]}</span>${escapeHTML(tag)}</span>
                        <span class="font-bold text-blue-400 px-2 py-0.5 bg-blue-900/30 rounded">${t[1]} times</span>
                    </div>`;
                }).join("");
            } else {
                topEl.innerHTML = '<span class="text-slate-500 italic text-sm">No tags logged yet.</span>';
            }
        }
    }

    categories.forEach(cat => renderCategoryUI(cat));
    setToggleUI("lucid", "no");
    setToggleUI("control", "no");



    // --- AUTHENTICATION LOGIC ---
    const loginContainer = document.getElementById("login-container");
    const mainApp = document.getElementById("main-app");
    const authEmail = document.getElementById("auth-email");
    const authBtn = document.getElementById("auth-btn");
    const authMsg = document.getElementById("auth-msg");
    const authError = document.getElementById("auth-error");
    const logoutBtn = document.getElementById("logout-btn");

    if (authBtn) {
        authBtn.addEventListener("click", async () => {
            try {
                authMsg.classList.add("hidden");
                authError.classList.add("hidden");
                authBtn.textContent = "Sending...";
                authBtn.disabled = true;
                
                await sendMagicLink(authEmail.value);
                
                authMsg.classList.remove("hidden");
            } catch (err) {
                authError.textContent = err.message || "Failed to send link.";
                authError.classList.remove("hidden");
            } finally {
                authBtn.textContent = "Send Magic Link";
                authBtn.disabled = false;
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await signOutUser();
            window.location.reload();
        });
    }

    onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            document.body.classList.add("logged-in");
            // Instead of reloading, dynamically mount the app now that a session exists
            if (event === 'SIGNED_IN') initApp();
        } else if (event === 'SIGNED_OUT') {
            loginContainer.classList.remove("hidden");
            mainApp.classList.add("hidden");
        }
    });

    window.exportAllData = function() {
    if (dreams.length === 0) {
        alert("No data to export!");
        return;
    }
    const dataStr = JSON.stringify(dreams, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lucid_dreams_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

    async function initApp() {
        const session = await getCurrentSession();
        
        if (!session) {
            // Show Login
            loginContainer.classList.remove("hidden");
            mainApp.classList.add("hidden");
            return;
        } else {
            // Show App
            loginContainer.classList.add("hidden");
            mainApp.classList.remove("hidden");
        }

        // Load dreams from Supabase
        dreams = await fetchDreamsFromDB();
        
        // Map Supabase column names back to our camelCase app structures if necessary
        dreams = dreams.map(d => ({
            ...d,
            isLucid: d.is_lucid,
            hasControl: d.has_control,
            garminScore: d.garmin_score,
            bevelScore: d.bevel_score,
            totalSleep: d.total_sleep,
            remSleep: d.rem_sleep
        }));

        renderDreams();
        updateAnalytics();
        categories.forEach(cat => renderCategoryUI(cat));
    }

    // Replace the synchronous initialization
    initApp();
});


